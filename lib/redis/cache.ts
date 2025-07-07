import { getRedisClient } from './config';
import { Redis as UpstashRedis } from '@upstash/redis';
import Redis from 'ioredis';
import { redis, REDIS_CONFIG, REDIS_PATTERNS } from './client';

// Cache configuration interface
export interface CacheConfig {
  defaultTTL: number; // in seconds
  maxRetries: number;
  retryDelay: number;
  compression: boolean;
  enableMetrics: boolean;
}

// Cache entry metadata
export interface CacheEntry<T = any> {
  data: T;
  createdAt: number;
  expiresAt: number;
  version: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Cache statistics
export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
  totalKeys: number;
  memoryUsage?: number;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  defaultTTL: 60 * 60, // 1 hour
  maxRetries: 3,
  retryDelay: 100,
  compression: false,
  enableMetrics: true,
};

// Cache item with metadata
export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version?: string;
}

// Cache options
export interface CacheOptions {
  ttl?: number;
  version?: string;
  compress?: boolean;
}

/**
 * Generate cache key with tenant isolation
 */
export const getCacheKey = (tenantId: string, namespace: string, key: string): string => {
  return `cache:${tenantId}:${namespace}:${key}`;
};

/**
 * Generate metrics key for cache statistics
 */
const getMetricsKey = (tenantId: string): string => {
  return `cache_metrics:${tenantId}`;
};

/**
 * Generate tag key for cache invalidation
 */
const getTagKey = (tenantId: string, tag: string): string => {
  return `cache_tags:${tenantId}:${tag}`;
};

/**
 * Serialize data for caching
 */
const serializeData = <T>(data: T, config: CacheConfig): string => {
  const entry: CacheEntry<T> = {
    data,
    createdAt: Date.now(),
    expiresAt: Date.now() + (config.defaultTTL * 1000),
    version: 1,
  };
  
  const serialized = JSON.stringify(entry);
  
  // TODO: Add compression if enabled
  return serialized;
};

/**
 * Deserialize data from cache
 */
const deserializeData = <T>(serializedData: string): CacheEntry<T> | null => {
  try {
    const entry: CacheEntry<T> = JSON.parse(serializedData);
    
    // Check if entry is expired
    if (Date.now() > entry.expiresAt) {
      return null;
    }
    
    return entry;
  } catch (error) {
    console.error('Failed to deserialize cache data:', error);
    return null;
  }
};

/**
 * Update cache metrics
 */
const updateMetrics = async (
  tenantId: string,
  operation: 'hit' | 'miss' | 'set' | 'delete' | 'error'
): Promise<void> => {
  try {
    const client = getRedisClient();
    const metricsKey = getMetricsKey(tenantId);
    
    if (client instanceof UpstashRedis) {
      await client.hincrby(metricsKey, operation + 's', 1);
      await client.expire(metricsKey, 24 * 60 * 60); // 24 hours
    } else {
      await client.hincrby(metricsKey, operation + 's', 1);
      await client.expire(metricsKey, 24 * 60 * 60); // 24 hours
    }
  } catch (error) {
    // Silently fail metrics updates to avoid affecting main operations
    console.error('Failed to update cache metrics:', error);
  }
};

/**
 * Set cache value
 */
export const setCache = async <T>(
  tenantId: string,
  namespace: string,
  key: string,
  value: T,
  ttl?: number,
  tags?: string[],
  config: Partial<CacheConfig> = {}
): Promise<boolean> => {
  const client = getRedisClient();
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
  const cacheKey = getCacheKey(tenantId, namespace, key);
  const effectiveTTL = ttl || cacheConfig.defaultTTL;
  
  try {
    const entry: CacheEntry<T> = {
      data: value,
      createdAt: Date.now(),
      expiresAt: Date.now() + (effectiveTTL * 1000),
      version: 1,
      tags,
    };
    
    const serializedData = JSON.stringify(entry);
    
    if (client instanceof UpstashRedis) {
      await client.setex(cacheKey, effectiveTTL, serializedData);
    } else {
      await client.setex(cacheKey, effectiveTTL, serializedData);
    }
    
    // Add to tag sets for invalidation
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        const tagKey = getTagKey(tenantId, tag);
        if (client instanceof UpstashRedis) {
          await client.sadd(tagKey, cacheKey);
          await client.expire(tagKey, effectiveTTL);
        } else {
          await client.sadd(tagKey, cacheKey);
          await client.expire(tagKey, effectiveTTL);
        }
      }
    }
    
    if (cacheConfig.enableMetrics) {
      await updateMetrics(tenantId, 'set');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to set cache:', error);
    if (cacheConfig.enableMetrics) {
      await updateMetrics(tenantId, 'error');
    }
    return false;
  }
};

/**
 * Get cache value
 */
export const getCache = async <T>(
  tenantId: string,
  namespace: string,
  key: string,
  config: Partial<CacheConfig> = {}
): Promise<T | null> => {
  const client = getRedisClient();
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
  const cacheKey = getCacheKey(tenantId, namespace, key);
  
  try {
    let serializedData: string | null = null;
    
    if (client instanceof UpstashRedis) {
      serializedData = await client.get(cacheKey);
    } else {
      serializedData = await client.get(cacheKey);
    }
    
    if (!serializedData) {
      if (cacheConfig.enableMetrics) {
        await updateMetrics(tenantId, 'miss');
      }
      return null;
    }
    
    const entry = deserializeData<T>(serializedData);
    
    if (!entry) {
      // Entry expired or invalid, remove it
      await deleteCache(tenantId, namespace, key);
      if (cacheConfig.enableMetrics) {
        await updateMetrics(tenantId, 'miss');
      }
      return null;
    }
    
    if (cacheConfig.enableMetrics) {
      await updateMetrics(tenantId, 'hit');
    }
    
    return entry.data;
  } catch (error) {
    console.error('Failed to get cache:', error);
    if (cacheConfig.enableMetrics) {
      await updateMetrics(tenantId, 'error');
    }
    return null;
  }
};

/**
 * Delete cache value
 */
export const deleteCache = async (
  tenantId: string,
  namespace: string,
  key: string,
  config: Partial<CacheConfig> = {}
): Promise<boolean> => {
  const client = getRedisClient();
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
  const cacheKey = getCacheKey(tenantId, namespace, key);
  
  try {
    if (client instanceof UpstashRedis) {
      await client.del(cacheKey);
    } else {
      await client.del(cacheKey);
    }
    
    if (cacheConfig.enableMetrics) {
      await updateMetrics(tenantId, 'delete');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete cache:', error);
    if (cacheConfig.enableMetrics) {
      await updateMetrics(tenantId, 'error');
    }
    return false;
  }
};

/**
 * Get multiple cache values
 */
export const getMultipleCache = async <T>(
  tenantId: string,
  namespace: string,
  keys: string[],
  config: Partial<CacheConfig> = {}
): Promise<Record<string, T | null>> => {
  const client = getRedisClient();
  const cacheKeys = keys.map(key => getCacheKey(tenantId, namespace, key));
  const result: Record<string, T | null> = {};
  
  try {
    let values: (string | null)[] = [];
    
    if (client instanceof UpstashRedis) {
      // Upstash doesn't support mget, so we'll get them individually
      values = await Promise.all(cacheKeys.map(async key => {
        const result = await client.get(key);
        return result as string | null;
      }));
    } else {
      values = await client.mget(...cacheKeys) as (string | null)[];
    }
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const serializedData = values[i];
      
      if (serializedData) {
        const entry = deserializeData<T>(serializedData);
        result[key] = entry ? entry.data : null;
      } else {
        result[key] = null;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Failed to get multiple cache values:', error);
    
    // Return object with all null values
    for (const key of keys) {
      result[key] = null;
    }
    
    return result;
  }
};

/**
 * Set multiple cache values
 */
export const setMultipleCache = async <T>(
  tenantId: string,
  namespace: string,
  data: Record<string, T>,
  ttl?: number,
  config: Partial<CacheConfig> = {}
): Promise<boolean> => {
  const client = getRedisClient();
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
  const effectiveTTL = ttl || cacheConfig.defaultTTL;
  
  try {
    const pipeline = client instanceof UpstashRedis ? null : client.pipeline();
    
    for (const [key, value] of Object.entries(data)) {
      const cacheKey = getCacheKey(tenantId, namespace, key);
      const entry: CacheEntry<T> = {
        data: value,
        createdAt: Date.now(),
        expiresAt: Date.now() + (effectiveTTL * 1000),
        version: 1,
      };
      const serializedData = JSON.stringify(entry);
      
      if (client instanceof UpstashRedis) {
        await client.setex(cacheKey, effectiveTTL, serializedData);
      } else {
        pipeline!.setex(cacheKey, effectiveTTL, serializedData);
      }
    }
    
    if (pipeline) {
      await pipeline.exec();
    }
    
    return true;
  } catch (error) {
    console.error('Failed to set multiple cache values:', error);
    return false;
  }
};

/**
 * Invalidate cache by tags
 */
export const invalidateCacheByTags = async (
  tenantId: string,
  tags: string[],
  config: Partial<CacheConfig> = {}
): Promise<number> => {
  const client = getRedisClient();
  let deletedCount = 0;
  
  try {
    for (const tag of tags) {
      const tagKey = getTagKey(tenantId, tag);
      let cacheKeys: string[] = [];
      
      if (client instanceof UpstashRedis) {
        cacheKeys = await client.smembers(tagKey);
      } else {
        cacheKeys = await client.smembers(tagKey);
      }
      
      if (cacheKeys.length > 0) {
        if (client instanceof UpstashRedis) {
          // Delete keys individually for Upstash
          for (const cacheKey of cacheKeys) {
            await client.del(cacheKey);
            deletedCount++;
          }
        } else {
          const deleted = await client.del(...cacheKeys);
          deletedCount += deleted;
        }
        
        // Remove the tag set
        if (client instanceof UpstashRedis) {
          await client.del(tagKey);
        } else {
          await client.del(tagKey);
        }
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Failed to invalidate cache by tags:', error);
    return 0;
  }
};

/**
 * Clear all cache for a tenant namespace
 */
export const clearNamespaceCache = async (
  tenantId: string,
  namespace: string
): Promise<number> => {
  const client = getRedisClient();
  let deletedCount = 0;
  
  try {
    if (client instanceof UpstashRedis) {
      // Upstash doesn't support SCAN, so we can't clear by pattern
      console.warn('Namespace cache clearing not supported with Upstash Redis');
      return 0;
    } else {
      const pattern = `cache:${tenantId}:${namespace}:*`;
      const stream = client.scanStream({ match: pattern });
      
      for await (const keys of stream) {
        if (keys.length > 0) {
          const deleted = await client.del(...keys);
          deletedCount += deleted;
        }
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Failed to clear namespace cache:', error);
    return 0;
  }
};

/**
 * Clear all cache for a tenant
 */
export const clearTenantCache = async (tenantId: string): Promise<number> => {
  const client = getRedisClient();
  let deletedCount = 0;
  
  try {
    if (client instanceof UpstashRedis) {
      // Upstash doesn't support SCAN, so we can't clear by pattern
      console.warn('Tenant cache clearing not supported with Upstash Redis');
      return 0;
    } else {
      const pattern = `cache:${tenantId}:*`;
      const stream = client.scanStream({ match: pattern });
      
      for await (const keys of stream) {
        if (keys.length > 0) {
          const deleted = await client.del(...keys);
          deletedCount += deleted;
        }
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Failed to clear tenant cache:', error);
    return 0;
  }
};

/**
 * Get cache statistics for a tenant
 */
export const getCacheStats = async (tenantId: string): Promise<CacheStats> => {
  const client = getRedisClient();
  const metricsKey = getMetricsKey(tenantId);
  
  try {
    let metrics: Record<string, string> = {};
    
    if (client instanceof UpstashRedis) {
      const result = await client.hgetall(metricsKey);
      metrics = (result || {}) as Record<string, string>;
    } else {
      metrics = await client.hgetall(metricsKey);
    }
    
    return {
      hits: parseInt(metrics.hits || '0', 10),
      misses: parseInt(metrics.misses || '0', 10),
      sets: parseInt(metrics.sets || '0', 10),
      deletes: parseInt(metrics.deletes || '0', 10),
      errors: parseInt(metrics.errors || '0', 10),
      totalKeys: 0, // Would need SCAN to calculate accurately
    };
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      totalKeys: 0,
    };
  }
};

/**
 * Cache with automatic fallback to function
 */
export const cacheOrFetch = async <T>(
  tenantId: string,
  namespace: string,
  key: string,
  fetchFunction: () => Promise<T>,
  ttl?: number,
  tags?: string[],
  config: Partial<CacheConfig> = {}
): Promise<T> => {
  // Try to get from cache first
  const cached = await getCache<T>(tenantId, namespace, key, config);
  
  if (cached !== null) {
    return cached;
  }
  
  // Fetch fresh data
  try {
    const freshData = await fetchFunction();
    
    // Store in cache for next time
    await setCache(tenantId, namespace, key, freshData, ttl, tags, config);
    
    return freshData;
  } catch (error) {
    console.error('Failed to fetch fresh data:', error);
    throw error;
  }
};

/**
 * Cache with refresh-ahead pattern
 */
export const cacheWithRefreshAhead = async <T>(
  tenantId: string,
  namespace: string,
  key: string,
  fetchFunction: () => Promise<T>,
  ttl: number = 300, // 5 minutes
  refreshThreshold: number = 0.8, // Refresh when 80% of TTL is reached
  config: Partial<CacheConfig> = {}
): Promise<T> => {
  const cacheKey = getCacheKey(tenantId, namespace, key);
  const client = getRedisClient();
  
  try {
    let serializedData: string | null = null;
    
    if (client instanceof UpstashRedis) {
      serializedData = await client.get(cacheKey);
    } else {
      serializedData = await client.get(cacheKey);
    }
    
    if (serializedData) {
      const entry = deserializeData<T>(serializedData);
      
      if (entry) {
        const timeRemaining = entry.expiresAt - Date.now();
        const refreshTime = ttl * 1000 * (1 - refreshThreshold);
        
        // If we're past the refresh threshold, trigger background refresh
        if (timeRemaining < refreshTime) {
          // Fire and forget background refresh
          fetchFunction()
            .then(freshData => {
              setCache(tenantId, namespace, key, freshData, ttl, undefined, config);
            })
            .catch(error => {
              console.error('Background cache refresh failed:', error);
            });
        }
        
        return entry.data;
      }
    }
    
    // Cache miss, fetch fresh data
    const freshData = await fetchFunction();
    await setCache(tenantId, namespace, key, freshData, ttl, undefined, config);
    
    return freshData;
  } catch (error) {
    console.error('Cache with refresh-ahead failed:', error);
    throw error;
  }
};

// Multi-tenant cache operations
export class TenantCache {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  // Generic cache operations
  async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = REDIS_PATTERNS.cache(this.tenantId, 'generic', key);
      const cached = await redis.get(cacheKey);
      
      if (!cached) return null;
      
      const item = cached as CacheItem<T>;
      
      // Check if item has expired
      if (Date.now() > item.timestamp + (item.ttl * 1000)) {
        await this.delete(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Redis cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<boolean> {
    try {
      const cacheKey = REDIS_PATTERNS.cache(this.tenantId, 'generic', key);
      const ttl = options.ttl || REDIS_CONFIG.cacheTTL;
      
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        version: options.version
      };
      
      await redis.set(cacheKey, item, { ex: ttl });
      return true;
    } catch (error) {
      console.error('Redis cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const cacheKey = REDIS_PATTERNS.cache(this.tenantId, 'generic', key);
      await redis.del(cacheKey);
      return true;
    } catch (error) {
      console.error('Redis cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const cacheKey = REDIS_PATTERNS.cache(this.tenantId, 'generic', key);
      const exists = await redis.exists(cacheKey);
      return exists === 1;
    } catch (error) {
      console.error('Redis cache exists error:', error);
      return false;
    }
  }

  // User-specific cache operations
  async getUserProfile(userId: string): Promise<any | null> {
    try {
      const cacheKey = REDIS_PATTERNS.userProfile(this.tenantId, userId);
      return await redis.get(cacheKey);
    } catch (error) {
      console.error('Redis get user profile error:', error);
      return null;
    }
  }

  async setUserProfile(userId: string, profile: any, ttl?: number): Promise<boolean> {
    try {
      const cacheKey = REDIS_PATTERNS.userProfile(this.tenantId, userId);
      const expiry = ttl || REDIS_CONFIG.cacheTTL;
      await redis.set(cacheKey, profile, { ex: expiry });
      return true;
    } catch (error) {
      console.error('Redis set user profile error:', error);
      return false;
    }
  }

  async getUserPermissions(userId: string): Promise<string[] | null> {
    try {
      const cacheKey = REDIS_PATTERNS.userPermissions(this.tenantId, userId);
      const cached = await redis.get(cacheKey);
      return cached ? (cached as string[]) : null;
    } catch (error) {
      console.error('Redis get user permissions error:', error);
      return null;
    }
  }

  async setUserPermissions(userId: string, permissions: string[], ttl?: number): Promise<boolean> {
    try {
      const cacheKey = REDIS_PATTERNS.userPermissions(this.tenantId, userId);
      const expiry = ttl || REDIS_CONFIG.cacheTTL;
      await redis.set(cacheKey, permissions, { ex: expiry });
      return true;
    } catch (error) {
      console.error('Redis set user permissions error:', error);
      return false;
    }
  }

  // Organization-specific cache operations
  async getOrganizationProfile(): Promise<any | null> {
    try {
      const cacheKey = REDIS_PATTERNS.organizationProfile(this.tenantId);
      return await redis.get(cacheKey);
    } catch (error) {
      console.error('Redis get organization profile error:', error);
      return null;
    }
  }

  async setOrganizationProfile(profile: any, ttl?: number): Promise<boolean> {
    try {
      const cacheKey = REDIS_PATTERNS.organizationProfile(this.tenantId);
      const expiry = ttl || REDIS_CONFIG.cacheTTL;
      await redis.set(cacheKey, profile, { ex: expiry });
      return true;
    } catch (error) {
      console.error('Redis set organization profile error:', error);
      return false;
    }
  }

  async getOrganizationUsers(): Promise<any[] | null> {
    try {
      const cacheKey = REDIS_PATTERNS.organizationUsers(this.tenantId);
      const cached = await redis.get(cacheKey);
      return cached ? (cached as any[]) : null;
    } catch (error) {
      console.error('Redis get organization users error:', error);
      return null;
    }
  }

  async setOrganizationUsers(users: any[], ttl?: number): Promise<boolean> {
    try {
      const cacheKey = REDIS_PATTERNS.organizationUsers(this.tenantId);
      const expiry = ttl || REDIS_CONFIG.cacheTTL;
      await redis.set(cacheKey, users, { ex: expiry });
      return true;
    } catch (error) {
      console.error('Redis set organization users error:', error);
      return false;
    }
  }

  // List cache operations with filtering
  async getList(listType: string, filters?: Record<string, any>): Promise<any[] | null> {
    try {
      const filterString = filters ? JSON.stringify(filters) : undefined;
      const cacheKey = REDIS_PATTERNS.listCache(this.tenantId, listType, filterString);
      const cached = await redis.get(cacheKey);
      return cached ? (cached as any[]) : null;
    } catch (error) {
      console.error('Redis get list error:', error);
      return null;
    }
  }

  async setList(listType: string, data: any[], filters?: Record<string, any>, ttl?: number): Promise<boolean> {
    try {
      const filterString = filters ? JSON.stringify(filters) : undefined;
      const cacheKey = REDIS_PATTERNS.listCache(this.tenantId, listType, filterString);
      const expiry = ttl || REDIS_CONFIG.shortCacheTTL;
      await redis.set(cacheKey, data, { ex: expiry });
      return true;
    } catch (error) {
      console.error('Redis set list error:', error);
      return false;
    }
  }

  // Invalidate patterns
  async invalidateUserCache(userId: string): Promise<number> {
    try {
      const pattern = `user:${this.tenantId}:*${userId}*`;
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      return await redis.del(...keys);
    } catch (error) {
      console.error('Redis invalidate user cache error:', error);
      return 0;
    }
  }

  async invalidateOrganizationCache(): Promise<number> {
    try {
      const pattern = `org:${this.tenantId}:*`;
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      return await redis.del(...keys);
    } catch (error) {
      console.error('Redis invalidate organization cache error:', error);
      return 0;
    }
  }

  async invalidateListCache(listType: string): Promise<number> {
    try {
      const pattern = `cache:${this.tenantId}:list:${listType}*`;
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      return await redis.del(...keys);
    } catch (error) {
      console.error('Redis invalidate list cache error:', error);
      return 0;
    }
  }

  // Clear all tenant cache
  async clearTenantCache(): Promise<number> {
    try {
      const patterns = [
        `cache:${this.tenantId}:*`,
        `user:${this.tenantId}:*`,
        `org:${this.tenantId}:*`
      ];
      
      let deletedCount = 0;
      for (const pattern of patterns) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          deletedCount += await redis.del(...keys);
        }
      }
      return deletedCount;
    } catch (error) {
      console.error('Redis clear tenant cache error:', error);
      return 0;
    }
  }
}

// Factory function to create tenant cache
export function createTenantCache(tenantId: string): TenantCache {
  return new TenantCache(tenantId);
}

// Helper function for cache-aside pattern
export async function withCache<T>(
  tenantId: string,
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cache = createTenantCache(tenantId);
  
  // Try to get from cache first
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch from source
  const data = await fetcher();
  
  // Cache the result
  await cache.set(key, data, options);
  
  return data;
}

// Helper function for write-through pattern
export async function writeThrough<T>(
  tenantId: string,
  key: string,
  data: T,
  writer: (data: T) => Promise<void>,
  options: CacheOptions = {}
): Promise<void> {
  const cache = createTenantCache(tenantId);
  
  // Write to source first
  await writer(data);
  
  // Then update cache
  await cache.set(key, data, options);
}

// Helper function for write-behind pattern
export async function writeBehind<T>(
  tenantId: string,
  key: string,
  data: T,
  writer: (data: T) => Promise<void>,
  options: CacheOptions = {}
): Promise<void> {
  const cache = createTenantCache(tenantId);
  
  // Update cache first
  await cache.set(key, data, options);
  
  // Schedule write to source (in background)
  setImmediate(async () => {
    try {
      await writer(data);
    } catch (error) {
      console.error('Write-behind error:', error);
      // Optionally: invalidate cache on write failure
      await cache.delete(key);
    }
  });
}

export default TenantCache; 