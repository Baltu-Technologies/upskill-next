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

    // Get query parameters
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
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
      // Get daily registration data
      const dailyQuery = `
        WITH date_series AS (
          SELECT generate_series(
            DATE_TRUNC('day', $1::timestamp),
            DATE_TRUNC('day', NOW()),
            '1 day'::interval
          )::date as date
        ),
        daily_registrations AS (
          SELECT 
            DATE_TRUNC('day', "createdAt")::date as date,
            COUNT(*) as count
          FROM "user"
          WHERE "createdAt" >= $1
          GROUP BY DATE_TRUNC('day', "createdAt")::date
        ),
        running_totals AS (
          SELECT 
            ds.date,
            COALESCE(dr.count, 0) as count,
            (
              SELECT COUNT(*) 
              FROM "user" 
              WHERE "createdAt"::date <= ds.date
            ) as total
          FROM date_series ds
          LEFT JOIN daily_registrations dr ON ds.date = dr.date
          ORDER BY ds.date
        )
        SELECT * FROM running_totals
      `;

      const dailyResult = await pool.query(dailyQuery, [startDate]);

      // Get weekly registration data
      const weeklyQuery = `
        WITH week_series AS (
          SELECT generate_series(
            DATE_TRUNC('week', $1::timestamp),
            DATE_TRUNC('week', NOW()),
            '1 week'::interval
          )::date as date
        ),
        weekly_registrations AS (
          SELECT 
            DATE_TRUNC('week', "createdAt")::date as date,
            COUNT(*) as count
          FROM "user"
          WHERE "createdAt" >= $1
          GROUP BY DATE_TRUNC('week', "createdAt")::date
        )
        SELECT 
          ws.date,
          COALESCE(wr.count, 0) as count,
          (
            SELECT COUNT(*) 
            FROM "user" 
            WHERE "createdAt" <= ws.date + INTERVAL '6 days'
          ) as total
        FROM week_series ws
        LEFT JOIN weekly_registrations wr ON ws.date = wr.date
        ORDER BY ws.date
      `;

      const weeklyResult = await pool.query(weeklyQuery, [startDate]);

      // Get monthly registration data
      const monthlyQuery = `
        WITH month_series AS (
          SELECT generate_series(
            DATE_TRUNC('month', $1::timestamp),
            DATE_TRUNC('month', NOW()),
            '1 month'::interval
          )::date as date
        ),
        monthly_registrations AS (
          SELECT 
            DATE_TRUNC('month', "createdAt")::date as date,
            COUNT(*) as count
          FROM "user"
          WHERE "createdAt" >= $1
          GROUP BY DATE_TRUNC('month', "createdAt")::date
        )
        SELECT 
          ms.date,
          COALESCE(mr.count, 0) as count,
          (
            SELECT COUNT(*) 
            FROM "user" 
            WHERE "createdAt" <= ms.date + INTERVAL '1 month' - INTERVAL '1 day'
          ) as total
        FROM month_series ms
        LEFT JOIN monthly_registrations mr ON ms.date = mr.date
        ORDER BY ms.date
      `;

      const monthlyResult = await pool.query(monthlyQuery, [startDate]);

      // Get role distribution
      const roleDistributionQuery = `
        SELECT 
          COALESCE(ur.role, 'learner') as role,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "user"), 1) as percentage
        FROM "user" u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        GROUP BY COALESCE(ur.role, 'learner')
        ORDER BY count DESC
      `;

      const roleDistributionResult = await pool.query(roleDistributionQuery);

      // Get activity metrics
      const activityMetricsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM "user") as total_users,
          (SELECT COUNT(DISTINCT "userId") FROM session WHERE "createdAt" >= NOW() - INTERVAL '7 days') as active_users,
          (SELECT COUNT(*) FROM "user" WHERE "createdAt" >= DATE_TRUNC('month', NOW())) as new_users_this_month,
          (SELECT COUNT(*) FROM "user" WHERE "createdAt" >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') AND "createdAt" < DATE_TRUNC('month', NOW())) as new_users_last_month
      `;

      const activityMetricsResult = await pool.query(activityMetricsQuery);
      const metrics = activityMetricsResult.rows[0];

      // Calculate growth rate
      const growthRate = metrics.new_users_last_month > 0 
        ? Math.round(((metrics.new_users_this_month - metrics.new_users_last_month) / metrics.new_users_last_month) * 100)
        : 0;

      // Format data for response
      const analyticsData = {
        userRegistrations: dailyResult.rows.map((row: any) => ({
          date: row.date,
          count: parseInt(row.count),
          total: parseInt(row.total)
        })),
        roleDistribution: roleDistributionResult.rows.map((row: any) => ({
          role: row.role,
          count: parseInt(row.count),
          percentage: parseFloat(row.percentage)
        })),
        activityMetrics: {
          totalUsers: parseInt(metrics.total_users),
          activeUsers: parseInt(metrics.active_users),
          newUsersThisMonth: parseInt(metrics.new_users_this_month),
          newUsersLastMonth: parseInt(metrics.new_users_last_month),
          growthRate
        },
        timeRangeData: {
          daily: dailyResult.rows.map((row: any) => ({
            date: row.date,
            count: parseInt(row.count),
            total: parseInt(row.total)
          })),
          weekly: weeklyResult.rows.map((row: any) => ({
            date: row.date,
            count: parseInt(row.count),
            total: parseInt(row.total)
          })),
          monthly: monthlyResult.rows.map((row: any) => ({
            date: row.date,
            count: parseInt(row.count),
            total: parseInt(row.total)
          }))
        }
      };

      return NextResponse.json(analyticsData);

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 