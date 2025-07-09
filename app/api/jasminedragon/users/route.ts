import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { currentUserHasRole } from '@/lib/auth/role-helpers';

export async function GET(request: NextRequest) {
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

    // Get database connection
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.BETTER_AUTH_DATABASE_URL,
      ssl: process.env.BETTER_AUTH_DATABASE_URL?.includes('rds.amazonaws.com') 
        ? { rejectUnauthorized: false } 
        : false
    });

    try {
      // Get all users with their roles and activity status
      const usersQuery = `
        SELECT 
          u.id,
          u.email,
          u.name,
          u."createdAt",
          ARRAY_AGG(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL) as roles,
          MAX(s."createdAt") as last_login,
          CASE 
            WHEN MAX(s."createdAt") >= NOW() - INTERVAL '7 days' THEN true 
            ELSE false 
          END as is_active
        FROM "user" u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN session s ON u.id = s."userId"
        GROUP BY u.id, u.email, u.name, u."createdAt"
        ORDER BY u."createdAt" DESC
      `;

      const usersResult = await pool.query(usersQuery);
      
      const users = usersResult.rows.map((row: any) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        roles: row.roles || ['learner'], // Default to learner if no roles
        createdAt: row.createdAt,
        lastLogin: row.last_login,
        isActive: row.is_active
      }));

      return NextResponse.json(users);

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 