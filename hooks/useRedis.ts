import { useState, useCallback, useEffect } from 'react';

interface RedisHookOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

interface CacheOptions {
  ttl?: number;
  tags?: string[];
  namespace?: string;
}

interface SessionOptions {
  metadata?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
}

export function useRedis(options: RedisHookOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [redisInfo, setRedisInfo] = useState<any>(null);

  const { autoRefresh = false, refreshInterval = 30000, onError } = options;

  const handleError = useCallback((err: Error) => {
    setError(err);
    if (onError) {
      onError(err);
    }
  }, [onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get Redis connection info
  const getRedisInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await fetch('/api/redis/info');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get Redis info');
      }
      
      setRedisInfo(data.info);
      return data.info;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearError]);

  // Auto-refresh Redis info
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        getRedisInfo().catch(() => {
          // Errors are handled by the getRedisInfo function
        });
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, getRedisInfo]);

  return {
    isLoading,
    error,
    redisInfo,
    getRedisInfo,
    clearError,
  };
}

export function useRedisSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSession = useCallback(async (options: SessionOptions = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/redis/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session');
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/redis/session?action=get&sessionId=${sessionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get session');
      }
      
      return data.session;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSession = useCallback(async (sessionId: string, updates: Record<string, any>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/redis/session', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, updates }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update session');
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const destroySession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/redis/session?sessionId=${sessionId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to destroy session');
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/redis/session?action=list');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to list sessions');
      }
      
      return data.sessions;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSessionStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/redis/session?action=stats');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get session stats');
      }
      
      return data.stats;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createSession,
    getSession,
    updateSession,
    destroySession,
    listSessions,
    getSessionStats,
  };
}

export function useRedisCache(defaultNamespace: string = 'default') {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setCache = useCallback(async (
    key: string,
    value: any,
    options: CacheOptions = {}
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { ttl, tags, namespace = defaultNamespace } = options;
      
      const response = await fetch('/api/redis/cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'set',
          namespace,
          key,
          value,
          ttl,
          tags,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set cache');
      }
      
      return data.success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [defaultNamespace]);

  const getCache = useCallback(async (key: string, namespace: string = defaultNamespace) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/redis/cache?action=get&namespace=${namespace}&key=${key}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get cache');
      }
      
      return data.value;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [defaultNamespace]);

  const getMultipleCache = useCallback(async (keys: string[], namespace: string = defaultNamespace) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/redis/cache?action=getMultiple&namespace=${namespace}&keys=${keys.join(',')}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get multiple cache');
      }
      
      return data.values;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [defaultNamespace]);

  const deleteCache = useCallback(async (key: string, namespace: string = defaultNamespace) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/redis/cache?action=delete&namespace=${namespace}&key=${key}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete cache');
      }
      
      return data.success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [defaultNamespace]);

  const invalidateByTags = useCallback(async (tags: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/redis/cache?action=invalidateByTags&tags=${tags.join(',')}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to invalidate cache by tags');
      }
      
      return data.deletedCount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearNamespace = useCallback(async (namespace: string = defaultNamespace) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/redis/cache?action=clearNamespace&namespace=${namespace}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear namespace');
      }
      
      return data.deletedCount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [defaultNamespace]);

  const getCacheStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/redis/cache?action=stats');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get cache stats');
      }
      
      return data.stats;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    setCache,
    getCache,
    getMultipleCache,
    deleteCache,
    invalidateByTags,
    clearNamespace,
    getCacheStats,
  };
}

// Combined hook with all Redis functionality
export function useRedisOperations(options: RedisHookOptions & { defaultNamespace?: string } = {}) {
  const { defaultNamespace = 'default', ...redisOptions } = options;
  
  const redis = useRedis(redisOptions);
  const session = useRedisSession();
  const cache = useRedisCache(defaultNamespace);

  return {
    redis,
    session,
    cache,
    isLoading: redis.isLoading || session.isLoading || cache.isLoading,
    error: redis.error || session.error || cache.error,
  };
} 