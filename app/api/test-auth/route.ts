import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Test if BetterAuth can be imported
        const { betterAuth } = await import('better-auth');
        
        // Test if Pool can be imported
        const { Pool } = await import('pg');
        
        // Test basic auth creation without our custom config
        const testAuth = betterAuth({
            secret: 'test-secret',
            baseURL: 'http://localhost:3000'
        });
        
        return NextResponse.json({ 
            success: true, 
            message: 'BetterAuth imports and initialization successful',
            betterAuthAvailable: !!betterAuth,
            poolAvailable: !!Pool,
            testAuthCreated: !!testAuth
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ 
            error: 'BetterAuth test failed', 
            details: errorMessage 
        }, { status: 500 });
    }
} 