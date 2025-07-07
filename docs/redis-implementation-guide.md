# Redis Implementation Guide

## Overview

This document outlines the Redis implementation for the Upskill Employer Portal, providing caching, session management, and real-time features for a multi-tenant B2B platform.

## Architecture

### Redis Provider Strategy

The implementation uses a **dual-provider strategy** for development and production:

- **Development**: [Upstash Redis](https://upstash.com/) (Serverless Redis)
- **Production**: AWS ElastiCache (Redis Cluster)

### Key Features

1. **Multi-tenant Cache Isolation**: Each tenant gets isolated cache namespaces
2. **Session Management**: Distributed session storage across application instances
3. **Real-time Features**: Job application notifications, analytics updates
4. **Performance Optimization**: Database query caching, API response caching

## Configuration

### Environment Variables

```bash
# Redis Provider Selection
REDIS_PROVIDER=upstash  # or 'elasticache'

# Upstash Redis (Development)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# ElastiCache (Production)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_USERNAME=your-redis-username
REDIS_TLS=true
```

### Setup Instructions

#### Development (Upstash)

1. Create a free account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and token to your `.env.local` file
4. Set `REDIS_PROVIDER=upstash`

#### Production (ElastiCache)

1. Set up ElastiCache cluster in AWS
2. Configure VPC and security groups
3. Set environment variables in AWS Amplify
4. Set `REDIS_PROVIDER=elasticache`

## Implementation Details

### Core Redis Client

The Redis client is implemented in `lib/redis/client.ts` with:

- **Automatic provider selection** based on environment
- **Connection pooling** for optimal performance
- **Error handling** with graceful degradation
- **Type safety** with TypeScript interfaces

### Cache Strategies

#### 1. Multi-tenant Cache Isolation

```typescript
// Cache key format: tenant:{org_id}:{feature}:{identifier}
const cacheKey = `tenant:${orgId}:jobs:${jobId}`;
```

#### 2. Cache Patterns

- **Job Postings**: Cache job listings with 15-minute TTL
- **Company Profiles**: Cache company data with 1-hour TTL
- **Analytics**: Cache analytics data with 5-minute TTL
- **Search Results**: Cache search results with 10-minute TTL

#### 3. Cache Invalidation

- **Event-driven invalidation** on data updates
- **TTL-based expiration** for time-sensitive data
- **Manual invalidation** for critical updates

### Session Management

#### Auth0 Session Enhancement

```typescript
// Store additional session data in Redis
const sessionKey = `session:${userId}:${orgId}`;
await redis.setex(sessionKey, 3600, JSON.stringify(sessionData));
```

#### Features

- **Distributed sessions** across multiple application instances
- **Session enrichment** with organization-specific data
- **Session invalidation** on logout or role changes

### Real-time Features

#### Job Application Notifications

- **Event publishing** when applications are submitted
- **Real-time updates** to employer dashboards
- **Notification queuing** for offline users

#### Analytics Updates

- **Real-time metrics** for job posting performance
- **Live dashboard updates** without page refresh
- **Event aggregation** for reporting

## API Endpoints

### Cache Management

```typescript
// GET /api/cache/status
// Returns cache health and statistics

// DELETE /api/cache/invalidate
// Invalidates specific cache keys

// GET /api/cache/keys
// Lists cache keys (development only)
```

### Usage Examples

#### Job Postings Cache

```typescript
// Cache job posting
await redis.setex(
  `tenant:${orgId}:job:${jobId}`,
  900, // 15 minutes
  JSON.stringify(jobData)
);

// Retrieve cached job
const cachedJob = await redis.get(`tenant:${orgId}:job:${jobId}`);
```

#### Search Results Cache

```typescript
// Cache search results
const searchKey = `tenant:${orgId}:search:${hashQuery(query)}`;
await redis.setex(searchKey, 600, JSON.stringify(results));
```

## Performance Optimizations

### 1. Connection Pooling

- **Pool size**: 10 connections for development, 50 for production
- **Connection reuse** to reduce overhead
- **Automatic reconnection** on connection loss

### 2. Pipeline Operations

```typescript
// Batch multiple operations
const pipeline = redis.pipeline();
pipeline.set(key1, value1);
pipeline.set(key2, value2);
pipeline.expire(key1, 300);
await pipeline.exec();
```

### 3. Compression

- **JSON compression** for large objects
- **Gzip compression** for cache values >1KB
- **Selective compression** based on data size

## Monitoring and Debugging

### Health Checks

```typescript
// Redis health check endpoint
export async function GET() {
  try {
    const result = await redis.ping();
    return Response.json({ status: 'healthy', result });
  } catch (error) {
    return Response.json({ status: 'unhealthy', error }, { status: 500 });
  }
}
```

### Logging

- **Connection events** (connect, disconnect, error)
- **Cache hit/miss rates** for performance monitoring
- **Error tracking** with detailed context

### Development Tools

- **Redis CLI access** for debugging
- **Cache key inspection** endpoints
- **Performance metrics** dashboard

## Security Considerations

### 1. Data Encryption

- **TLS encryption** for all Redis connections
- **At-rest encryption** for sensitive cache data
- **Key rotation** for production environments

### 2. Access Control

- **Network isolation** using VPC (production)
- **Authentication** with username/password
- **IP whitelisting** for development

### 3. Tenant Isolation

- **Namespace separation** prevents cross-tenant data access
- **Cache key validation** to ensure tenant boundaries
- **Audit logging** for cache access patterns

## Deployment

### AWS Amplify Integration

```yaml
# amplify/backend/function/redis-config/src/index.js
exports.handler = async (event) => {
  const redisConfig = {
    provider: process.env.REDIS_PROVIDER,
    upstash: {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
    elasticache: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  };
  
  return redisConfig;
};
```

### Environment-Specific Configuration

- **Development**: Upstash with relaxed security
- **Staging**: ElastiCache with production-like settings
- **Production**: ElastiCache with full security hardening

## Best Practices

### 1. Cache Key Design

- **Hierarchical namespacing**: `tenant:org:feature:id`
- **Consistent naming**: Use kebab-case for readability
- **Avoid long keys**: Keep under 250 characters

### 2. TTL Management

- **Appropriate TTL values** based on data volatility
- **Consistent TTL patterns** across similar data types
- **TTL monitoring** to prevent cache bloat

### 3. Error Handling

- **Graceful degradation** when Redis is unavailable
- **Fallback to database** for critical operations
- **Circuit breaker pattern** for Redis operations

### 4. Performance

- **Batch operations** where possible
- **Avoid blocking operations** in request handlers
- **Monitor memory usage** and optimize data structures

## Troubleshooting

### Common Issues

1. **Connection timeouts**: Check network configuration
2. **Memory usage**: Monitor Redis memory and implement eviction
3. **Performance degradation**: Analyze slow operations
4. **Cache misses**: Review TTL settings and invalidation logic

### Debug Commands

```bash
# Check Redis connection
redis-cli ping

# Monitor Redis operations
redis-cli monitor

# Check memory usage
redis-cli info memory

# List keys by pattern
redis-cli keys "tenant:*"
```

## Testing

### Unit Tests

```typescript
// Test cache operations
describe('Redis Client', () => {
  it('should cache and retrieve data', async () => {
    await redis.set('test:key', 'value');
    const result = await redis.get('test:key');
    expect(result).toBe('value');
  });
});
```

### Integration Tests

- **Multi-tenant isolation** testing
- **Performance benchmarks** under load
- **Failover scenarios** testing

## Next Steps

1. **Implement remaining cache utilities**
2. **Add performance monitoring**
3. **Set up ElastiCache for production**
4. **Add real-time features**
5. **Implement comprehensive testing**

## Resources

- [Redis Documentation](https://redis.io/docs/)
- [Upstash Documentation](https://docs.upstash.com/)
- [AWS ElastiCache Documentation](https://docs.aws.amazon.com/elasticache/)
- [Redis Best Practices](https://redis.io/docs/management/optimization/) 