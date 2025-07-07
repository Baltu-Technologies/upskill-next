import Redis from 'ioredis';
import { Redis as UpstashRedis } from '@upstash/redis';

// Redis configuration types
export interface RedisConfig {
  provider: 'upstash' | 'elasticache';
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  username?: string;
  tls?: boolean;
  maxRetriesPerRequest?: number;
  retryDelayOnFailover?: number;
  connectTimeout?: number;
  commandTimeout?: number;
  maxmemoryPolicy?: string;
}

// Environment-based configuration
const getRedisConfig = (): RedisConfig => {
  const provider = (process.env.REDIS_PROVIDER || 'upstash') as 'upstash' | 'elasticache';
  
  const config: RedisConfig = {
    provider,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    connectTimeout: 10000,
    commandTimeout: 5000,
  };

  if (provider === 'upstash') {
    config.url = process.env.UPSTASH_REDIS_REST_URL;
    config.password = process.env.UPSTASH_REDIS_REST_TOKEN;
  } else {
    config.host = process.env.REDIS_HOST || 'localhost';
    config.port = parseInt(process.env.REDIS_PORT || '6379', 10);
    config.password = process.env.REDIS_PASSWORD;
    config.username = process.env.REDIS_USERNAME;
    config.tls = process.env.REDIS_TLS === 'true';
  }

  return config;
};

// Redis client instances
let redisClient: Redis | null = null;
let upstashClient: UpstashRedis | null = null;

/**
 * Get Redis client based on configuration
 */
export const getRedisClient = (): Redis | UpstashRedis => {
  const config = getRedisConfig();

  if (config.provider === 'upstash') {
    if (!upstashClient) {
      if (!config.url || !config.password) {
        throw new Error('Upstash Redis URL and token are required');
      }
      upstashClient = new UpstashRedis({
        url: config.url,
        token: config.password,
      });
    }
    return upstashClient;
  } else {
    if (!redisClient) {
      if (!config.host) {
        throw new Error('Redis host is required for ElastiCache');
      }
      
      const redisOptions: any = {
        host: config.host,
        port: config.port,
        password: config.password,
        username: config.username,
        maxRetriesPerRequest: config.maxRetriesPerRequest,
        retryDelayOnFailover: config.retryDelayOnFailover,
        connectTimeout: config.connectTimeout,
        commandTimeout: config.commandTimeout,
        lazyConnect: true,
        keepAlive: 30000,
        maxmemoryPolicy: config.maxmemoryPolicy || 'allkeys-lru',
      };

      if (config.tls) {
        redisOptions.tls = {};
      }

      redisClient = new Redis(redisOptions);

      // Error handling
      redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
      });

      redisClient.on('connect', () => {
        console.log('Redis connected successfully');
      });

      redisClient.on('ready', () => {
        console.log('Redis ready to accept commands');
      });

      redisClient.on('reconnecting', (delay: number) => {
        console.log(`Redis reconnecting in ${delay}ms`);
      });
    }
    return redisClient;
  }
};

/**
 * Close Redis connections
 */
export const closeRedisConnections = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  // Upstash client doesn't need explicit closing
  upstashClient = null;
};

/**
 * Test Redis connection
 */
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    const client = getRedisClient();
    
    if (client instanceof UpstashRedis) {
      await client.ping();
    } else {
      await client.ping();
    }
    
    return true;
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return false;
  }
};

/**
 * Get Redis client info
 */
export const getRedisInfo = async (): Promise<any> => {
  try {
    const client = getRedisClient();
    const config = getRedisConfig();
    
    if (client instanceof UpstashRedis) {
      return {
        provider: 'upstash',
        connected: await client.ping() === 'PONG',
        url: config.url ? config.url.replace(/\/\/.*@/, '//***@') : undefined,
      };
    } else {
      const info = await client.info();
      return {
        provider: 'elasticache',
        connected: client.status === 'ready',
        host: config.host,
        port: config.port,
        info: info.split('\n').slice(0, 5).join('\n'), // First 5 lines only
      };
    }
  } catch (error) {
    return {
      provider: getRedisConfig().provider,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export { Redis, UpstashRedis }; 