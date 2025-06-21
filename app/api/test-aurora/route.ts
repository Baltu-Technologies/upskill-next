import { Pool } from 'pg';

export async function GET() {
    try {
        console.log('🔍 Testing Aurora PostgreSQL Connection from Production...');
        
        // Use the same connection string as Better Auth
        const connectionString = process.env.BETTER_AUTH_DATABASE_URL;
        
        if (!connectionString) {
            return Response.json({
                success: false,
                error: 'BETTER_AUTH_DATABASE_URL not found in environment variables',
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }
        
        console.log('📋 Connection String Found:', connectionString ? 'SET' : 'MISSING');
        
        // Test database connection with the same config as Better Auth
        const pool = new Pool({
            connectionString,
            ssl: connectionString.includes('rds.amazonaws.com') 
                ? { rejectUnauthorized: false } 
                : false,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000, // Increased timeout for network issues
        });
        
        const startTime = Date.now();
        console.log('⏳ Attempting to connect...');
        
        // Test basic connection
        const client = await pool.connect();
        const connectionTime = Date.now() - startTime;
        
        console.log(`✅ Connected successfully! (${connectionTime}ms)`);
        
        // Test basic query
        const versionResult = await client.query('SELECT version()');
        const dbVersion = versionResult.rows[0].version;
        
        console.log('✅ Database version:', dbVersion);
        
        // Check for Better Auth tables
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('user', 'session', 'account', 'verification')
            ORDER BY table_name
        `);
        
        const tables = tablesResult.rows.map(row => row.table_name);
        console.log('✅ Found Better Auth tables:', tables);
        
        // Test a simple Better Auth operation
        const userCountResult = await client.query('SELECT COUNT(*) as count FROM "user"');
        const userCount = userCountResult.rows[0].count;
        
        console.log('✅ User table accessible, count:', userCount);
        
        client.release();
        await pool.end();
        
        console.log('🔒 Connection pool closed');
        
        return Response.json({
            success: true,
            connectionTime: `${connectionTime}ms`,
            dbVersion,
            tables,
            userCount: parseInt(userCount),
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
                hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
                hasAuthSecret: !!process.env.BETTER_AUTH_SECRET
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Aurora connection failed:', error);
        
        return Response.json({
            success: false,
            error: (error as any)?.message || 'Unknown error',
            errorCode: (error as any)?.code,
            errorDetails: {
                name: (error as any)?.name,
                errno: (error as any)?.errno,
                syscall: (error as any)?.syscall,
                hostname: (error as any)?.hostname,
                port: (error as any)?.port
            },
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
                hasDbUrl: !!process.env.BETTER_AUTH_DATABASE_URL,
                hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
                hasAuthSecret: !!process.env.BETTER_AUTH_SECRET
            },
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 