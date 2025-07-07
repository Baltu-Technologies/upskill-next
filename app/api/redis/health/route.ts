import { NextRequest, NextResponse } from 'next/server';
import { checkRedisHealth } from '@/lib/redis/client';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = await checkRedisHealth();
    
    return NextResponse.json({
      success: true,
      redis: healthStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis health check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Redis health check failed',
        redis: { connected: false, error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 