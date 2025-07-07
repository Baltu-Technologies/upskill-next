import { NextRequest, NextResponse } from 'next/server';
import { 
  setCache,
  getCache,
  deleteCache,
  getMultipleCache,
  setMultipleCache,
  invalidateCacheByTags,
  clearNamespaceCache,
  clearTenantCache,
  getCacheStats,
  cacheOrFetch,
  createTenantCache
} from '@/lib/redis/cache';
import { getUserInfo, getUserOrganization } from '@/lib/auth/middleware';

/**
 * GET /api/redis/cache
 * Get cache values or statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get tenant ID from auth
    const tenantId = await getUserOrganization(request);
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      );
    }
    
    const cache = createTenantCache(tenantId);
    const data = await cache.get(key);
    
    return NextResponse.json({
      success: true,
      data,
      key,
      tenantId,
      cached: data !== null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis cache GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cache retrieval failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/redis/cache
 * Set cache values
 */
export async function POST(request: NextRequest) {
  try {
    // Get tenant ID from auth
    const tenantId = await getUserOrganization(request);
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { key, value, ttl } = body;
    
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }
    
    const cache = createTenantCache(tenantId);
    const success = await cache.set(key, value, { ttl });
    
    return NextResponse.json({
      success,
      key,
      value,
      ttl,
      tenantId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis cache POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cache storage failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/redis/cache
 * Delete cache values or clear cache
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get tenant ID from auth
    const tenantId = await getUserOrganization(request);
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      );
    }
    
    const cache = createTenantCache(tenantId);
    const success = await cache.delete(key);
    
    return NextResponse.json({
      success,
      key,
      tenantId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis cache DELETE error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cache deletion failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 