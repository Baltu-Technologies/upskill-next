import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';
import { getUserOrganization } from '@/lib/auth/middleware';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Redis configuration
export const REDIS_CONFIG = {
  defaultTTL: 60 * 60 * 24, // 24 hours
  sessionTTL: 60 * 60 * 24 * 7, // 7 days
  cacheTTL: 60 * 60, // 1 hour
  shortCacheTTL: 60 * 10, // 10 minutes
  prefixes: {
    session: 'session',
    cache: 'cache',
    user: 'user',
    organization: 'org',
  }
};

// Helper function to get tenant ID from request
export async function getTenantId(req: NextRequest): Promise<string | null> {
  try {
    return await getUserOrganization(req);
  } catch (error) {
    console.error('Error getting tenant ID:', error);
    return null;
  }
}

// Generate tenant-scoped Redis keys
export function generateTenantKey(tenantId: string, prefix: string, key: string): string {
  return `${prefix}:${tenantId}:${key}`;
}

// Generate global key (non-tenant specific)
export function generateGlobalKey(prefix: string, key: string): string {
  return `${prefix}:${key}`;
}

// Redis key patterns
export const REDIS_PATTERNS = {
  // Session keys
  session: (tenantId: string, sessionId: string) => 
    generateTenantKey(tenantId, REDIS_CONFIG.prefixes.session, sessionId),
  
  // User cache keys
  userProfile: (tenantId: string, userId: string) => 
    generateTenantKey(tenantId, REDIS_CONFIG.prefixes.user, `profile:${userId}`),
  
  userPermissions: (tenantId: string, userId: string) => 
    generateTenantKey(tenantId, REDIS_CONFIG.prefixes.user, `permissions:${userId}`),
  
  // Organization cache keys
  organizationProfile: (tenantId: string) => 
    generateTenantKey(tenantId, REDIS_CONFIG.prefixes.organization, 'profile'),
  
  organizationUsers: (tenantId: string) => 
    generateTenantKey(tenantId, REDIS_CONFIG.prefixes.organization, 'users'),
  
  // General cache keys
  cache: (tenantId: string, resource: string, id: string) => 
    generateTenantKey(tenantId, REDIS_CONFIG.prefixes.cache, `${resource}:${id}`),
  
  // List cache keys
  listCache: (tenantId: string, listType: string, filters?: string) => 
    generateTenantKey(tenantId, REDIS_CONFIG.prefixes.cache, `list:${listType}${filters ? `:${filters}` : ''}`),
};

// Health check function
export async function checkRedisHealth(): Promise<{ connected: boolean; error?: string }> {
  try {
    await redis.ping();
    return { connected: true };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Clean up expired keys (utility function)
export async function cleanupExpiredKeys(pattern: string): Promise<number> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;
    
    const deleted = await redis.del(...keys);
    return deleted;
  } catch (error) {
    console.error('Error cleaning up expired keys:', error);
    return 0;
  }
}

export default redis; 