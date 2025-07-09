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
      // Get total users
      const totalUsersQuery = 'SELECT COUNT(*) as count FROM "user"';
      const totalUsersResult = await pool.query(totalUsersQuery);
      const totalUsers = parseInt(totalUsersResult.rows[0].count);

      // Get new users (last 30 days)
      const newUsersQuery = `
        SELECT COUNT(*) as count 
        FROM "user" 
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      `;
      const newUsersResult = await pool.query(newUsersQuery);
      const newUsers = parseInt(newUsersResult.rows[0].count);

      // Get active users (users who have logged in in last 7 days)
      const activeUsersQuery = `
        SELECT COUNT(DISTINCT "userId") as count 
        FROM session 
        WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      `;
      const activeUsersResult = await pool.query(activeUsersQuery);
      const activeUsers = parseInt(activeUsersResult.rows[0].count);

      // Get role distribution
      const roleDistributionQuery = `
        SELECT 
          COALESCE(ur.role, 'learner') as role, 
          COUNT(*) as count
        FROM "user" u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        GROUP BY COALESCE(ur.role, 'learner')
        ORDER BY count DESC
      `;
      const roleDistributionResult = await pool.query(roleDistributionQuery);
      const roleDistribution = roleDistributionResult.rows.reduce((acc: Record<string, number>, row: any) => {
        acc[row.role] = parseInt(row.count);
        return acc;
      }, {});

      // Get recent users (last 10) with proper structure
      const recentUsersQuery = `
        SELECT 
          u.id,
          u.email,
          u.name,
          u."createdAt",
          ARRAY_AGG(COALESCE(ur.role, 'learner')) as roles
        FROM "user" u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        GROUP BY u.id, u.email, u.name, u."createdAt"
        ORDER BY u."createdAt" DESC
        LIMIT 10
      `;
      const recentUsersResult = await pool.query(recentUsersQuery);
      const recentUsers = recentUsersResult.rows.map((row: any) => ({
        id: row.id,
        email: row.email,
        name: row.name || row.email.split('@')[0], // Fallback to email prefix if no name
        createdAt: row.createdAt,
        roles: row.roles || ['learner'] // Ensure roles is always an array
      }));

      const stats = {
        totalUsers,
        newUsersToday: newUsers,
        activeUsers,
        adminUsers: roleDistribution.admin || 0,
        guideUsers: roleDistribution.guide || 0,
        contentCreatorUsers: roleDistribution.content_creator || 0,
        learnerUsers: roleDistribution.learner || 0,
        recentUsers
      };

      return NextResponse.json(stats);

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 