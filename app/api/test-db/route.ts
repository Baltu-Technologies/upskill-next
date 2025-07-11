import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
    try {
        const pool = new Pool({
            connectionString: process.env.BETTER_AUTH_DATABASE_URL,
            ssl: false
        });
        
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        
        return NextResponse.json({ 
            success: true, 
            timestamp: result.rows[0].now,
            message: 'Database connection successful' 
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ 
            error: 'Database connection failed', 
            details: errorMessage 
        }, { status: 500 });
    }
} 