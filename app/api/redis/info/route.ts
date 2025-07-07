import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, getRedisInfo } from '@/lib/redis/config';

/**
 * GET /api/redis/info
 * Get Redis connection information and status
 */
export async function GET(request: NextRequest) {
  try {
    const redisInfo = await getRedisInfo();
    
    return NextResponse.json({
      success: true,
      info: redisInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Redis info error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get Redis information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 