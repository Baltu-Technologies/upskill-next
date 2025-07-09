import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { currentUserHasRole } from '@/lib/auth/role-helpers';
import { emailService } from '@/lib/services/email-service';

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await currentUserHasRole('admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const { userId, role, action } = await request.json();

    if (!userId || !role || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, role, action' },
        { status: 400 }
      );
    }

    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "add" or "remove"' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'content_creator', 'guide', 'learner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Get database connection
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.BETTER_AUTH_DATABASE_URL,
      ssl: process.env.BETTER_AUTH_DATABASE_URL?.includes('rds.amazonaws.com') 
        ? { rejectUnauthorized: false } 
        : false
    });

    try {
      // Check if user exists and get user details
      const userCheckQuery = 'SELECT id, email, name FROM "user" WHERE id = $1';
      const userCheckResult = await pool.query(userCheckQuery, [userId]);
      
      if (userCheckResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const targetUser = userCheckResult.rows[0];

      // Get current user (admin who is making the change)
      const currentUserQuery = 'SELECT email, name FROM "user" WHERE id = $1';
      const currentUserResult = await pool.query(currentUserQuery, [session.user.id]);
      const currentUser = currentUserResult.rows[0];

      // Check if role change is actually needed
      const currentRolesQuery = 'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2';
      const currentRolesResult = await pool.query(currentRolesQuery, [userId, role]);
      const hasRole = currentRolesResult.rows.length > 0;

      if (action === 'add' && hasRole) {
        return NextResponse.json(
          { error: 'User already has this role' },
          { status: 400 }
        );
      }

      if (action === 'remove' && !hasRole) {
        return NextResponse.json(
          { error: 'User does not have this role' },
          { status: 400 }
        );
      }

      if (action === 'add') {
        // Add role (using ON CONFLICT to avoid duplicates)
        const insertQuery = `
          INSERT INTO user_roles (user_id, role) 
          VALUES ($1, $2) 
          ON CONFLICT (user_id, role) DO NOTHING
        `;
        await pool.query(insertQuery, [userId, role]);
      } else {
        // Remove role
        const deleteQuery = 'DELETE FROM user_roles WHERE user_id = $1 AND role = $2';
        await pool.query(deleteQuery, [userId, role]);
      }

      // Get updated user roles
      const rolesQuery = 'SELECT role FROM user_roles WHERE user_id = $1';
      const rolesResult = await pool.query(rolesQuery, [userId]);
      const updatedRoles = rolesResult.rows.map((row: any) => row.role);

      // Send email notification
      try {
        await emailService.sendRoleChangeNotification({
          userEmail: targetUser.email,
          userName: targetUser.name || targetUser.email.split('@')[0],
          role: role,
          action: action === 'add' ? 'added' : 'removed',
          changedBy: currentUser.name || currentUser.email,
          timestamp: new Date().toISOString(),
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the entire request if email fails
      }

      return NextResponse.json({
        success: true,
        message: `Role ${role} ${action === 'add' ? 'added to' : 'removed from'} user`,
        updatedRoles
      });

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 