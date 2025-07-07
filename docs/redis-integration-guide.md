# Redis Integration Guide

## Overview

This guide covers the Redis integration for the Upskill Next.js employer portal, providing session management and caching capabilities for multi-tenant applications.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Setup and Configuration](#setup-and-configuration)
3. [Session Management](#session-management)
4. [Caching System](#caching-system)
5. [API Reference](#api-reference)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Multi-Tenant Design

The Redis integration follows a multi-tenant architecture with:
- **Tenant Isolation**: All keys are prefixed with tenant ID
- **Namespace Organization**: Logical separation of different data types
- **Security**: Tenant-scoped access controls
- **Performance**: Optimized caching patterns

### Key Components

1. **Redis Configuration** (`lib/redis/config.ts`)
   - Supports both Upstash and ElastiCache
   - Environment-based configuration
   - Connection pooling and error handling

2. **Session Management** (`lib/redis/session.ts`)
   - Auth0 Organizations integration
   - Sliding expiration
   - Multi-session support per user

3. **Caching System** (`lib/redis/cache.ts`)
   - Multi-tenant cache isolation
   - Tag-based cache invalidation
   - TTL management
   - Performance metrics

## Setup and Configuration

### Prerequisites

- Node.js 18+ 
- Redis instance (Upstash or ElastiCache)
- Auth0 Organizations setup

### Installation

```bash
npm install ioredis @upstash/redis
```

### Environment Variables

Add to your `.env.local` file:

```env
# Redis Configuration
REDIS_PROVIDER=upstash

# For Upstash Redis (recommended for development)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# For ElastiCache (production)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_USERNAME=your-redis-username
REDIS_TLS=true
```

### Redis Provider Setup

#### Option 1: Upstash (Recommended for Development)

1. Create account at [Upstash](https://upstash.com)
2. Create new Redis database
3. Copy REST URL and token to environment variables
4. Set `REDIS_PROVIDER=upstash`

**Advantages:**
- No VPC configuration needed
- Global edge locations
- Built-in monitoring
- Easy setup

#### Option 2: AWS ElastiCache (Production)

1. Create ElastiCache Redis cluster
2. Configure VPC and security groups
3. Set up Lambda functions with VPC access (for Amplify)
4. Configure environment variables

**Advantages:**
- Better performance for AWS-hosted applications
- Full control over configuration
- Cost-effective for high usage
- Integration with AWS services

## Session Management

### Features

- **Multi-Tenant Sessions**: Isolated per organization
- **Sliding Expiration**: Automatic session renewal
- **Session Cleanup**: Automatic cleanup of expired sessions
- **Activity Tracking**: Last activity timestamps
- **Session Limits**: Configurable max sessions per user

### Usage

```typescript
import { 
  createSession, 
  getSession, 
  updateSession, 
  destroySession 
} from '@/lib/redis/session';

// Create session
const sessionData = {
  userId: 'user123',
  tenantId: 'org_123',
  organizationId: 'org_123',
  organizationName: 'Acme Corp',
  email: 'user@example.com',
  roles: ['admin'],
  permissions: ['manage_users']
};

const { sessionId } = await createSession(sessionData);

// Get session
const session = await getSession('org_123', sessionId);

// Update session
await updateSession('org_123', sessionId, {
  lastActivity: Date.now(),
  metadata: { feature: 'dashboard' }
});

// Destroy session
await destroySession('org_123', sessionId);
```

### Session Configuration

```typescript
const sessionConfig = {
  sessionTTL: 24 * 60 * 60, // 24 hours
  slidingExpiration: true,
  maxSessionsPerUser: 5,
  cleanupInterval: 60 * 60 // 1 hour
};
```

## Caching System

### Features

- **Multi-Tenant Caching**: Tenant-isolated cache keys
- **Namespace Organization**: Logical data separation
- **Tag-Based Invalidation**: Batch cache invalidation
- **TTL Management**: Automatic expiration
- **Performance Metrics**: Cache hit/miss tracking

### Cache Key Structure

```
cache:{tenantId}:{namespace}:{key}
```

Examples:
- `cache:org_123:users:user_456`
- `cache:org_123:jobs:job_789`
- `cache:org_123:analytics:daily_stats`

### Usage

```typescript
import { 
  setCache, 
  getCache, 
  deleteCache,
  invalidateCacheByTags 
} from '@/lib/redis/cache';

// Set cache with TTL and tags
await setCache(
  'org_123',           // tenantId
  'users',             // namespace
  'user_456',          // key
  { name: 'John Doe' }, // value
  3600,                // TTL (1 hour)
  ['user', 'profile']  // tags
);

// Get cached value
const user = await getCache('org_123', 'users', 'user_456');

// Delete specific cache
await deleteCache('org_123', 'users', 'user_456');

// Invalidate by tags
await invalidateCacheByTags('org_123', ['user']);
```

### Cache Patterns

#### 1. Cache-Aside Pattern

```typescript
import { cacheOrFetch } from '@/lib/redis/cache';

const getUserData = async (tenantId: string, userId: string) => {
  return await cacheOrFetch(
    tenantId,
    'users',
    userId,
    async () => {
      // Fetch from database
      return await db.user.findUnique({ where: { id: userId } });
    },
    3600, // 1 hour TTL
    ['user', 'profile']
  );
};
```

#### 2. Write-Through Pattern

```typescript
const updateUser = async (tenantId: string, userId: string, data: any) => {
  // Update database
  const user = await db.user.update({
    where: { id: userId },
    data
  });
  
  // Update cache
  await setCache(tenantId, 'users', userId, user, 3600, ['user']);
  
  return user;
};
```

## API Reference

### Session Management API

#### Create Session
```http
POST /api/redis/session
Authorization: Bearer {token}
Content-Type: application/json

{
  "metadata": { "feature": "dashboard" },
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

#### Get Session
```http
GET /api/redis/session?action=get&sessionId={sessionId}
Authorization: Bearer {token}
```

#### List User Sessions
```http
GET /api/redis/session?action=list
Authorization: Bearer {token}
```

#### Update Session
```http
PUT /api/redis/session
Authorization: Bearer {token}
Content-Type: application/json

{
  "sessionId": "session123",
  "updates": {
    "lastActivity": 1234567890,
    "metadata": { "page": "profile" }
  }
}
```

#### Delete Session
```http
DELETE /api/redis/session?sessionId={sessionId}
Authorization: Bearer {token}
```

### Cache Management API

#### Set Cache
```http
POST /api/redis/cache
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "set",
  "namespace": "users",
  "key": "user_123",
  "value": { "name": "John Doe" },
  "ttl": 3600,
  "tags": ["user", "profile"]
}
```

#### Get Cache
```http
GET /api/redis/cache?action=get&namespace=users&key=user_123
Authorization: Bearer {token}
```

#### Delete Cache
```http
DELETE /api/redis/cache?action=delete&namespace=users&key=user_123
Authorization: Bearer {token}
```

#### Invalidate by Tags
```http
DELETE /api/redis/cache?action=invalidateByTags&tags=user,profile
Authorization: Bearer {token}
```

## Testing

### Test Page

Visit `/redis-test` to run comprehensive tests:

- Redis connection verification
- Session management operations
- Cache CRUD operations
- Cache invalidation
- Performance metrics

### Running Tests

```bash
# Run Redis integration tests
npm run test:redis

# Run specific test suites
npm run test:redis:session
npm run test:redis:cache
```

### Test Configuration

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.redis.js'],
  testMatch: ['**/__tests__/**/*redis*.test.ts']
};
```

## Production Deployment

### AWS ElastiCache Setup

1. **Create ElastiCache Cluster**
   ```bash
   aws elasticache create-replication-group \
     --replication-group-id upskill-redis \
     --replication-group-description "Upskill Redis Cluster" \
     --num-cache-clusters 2 \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --engine-version 7.0
   ```

2. **Configure VPC Access**
   - Create VPC security group
   - Allow Redis port (6379) from Lambda subnets
   - Configure Lambda functions with VPC access

3. **Environment Variables**
   ```env
   REDIS_PROVIDER=elasticache
   REDIS_HOST=upskill-redis.abc123.cache.amazonaws.com
   REDIS_PORT=6379
   REDIS_TLS=true
   ```

### Amplify Gen 2 Configuration

```typescript
// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';

export const backend = defineBackend({
  // ... other resources
  
  // Add VPC for ElastiCache access
  vpc: {
    cidr: '10.0.0.0/16',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'Private',
        subnetType: 'Isolated',
      },
    ],
  },
  
  // Configure Lambda functions with VPC access
  functions: {
    sessionManager: {
      runtime: 'nodejs18.x',
      vpc: {
        securityGroupIds: ['sg-redis-access'],
        subnetIds: ['subnet-private-1', 'subnet-private-2'],
      },
    },
  },
});
```

### Monitoring and Alerts

```typescript
// CloudWatch alarms
const redisAlarms = {
  connectionFails: {
    metricName: 'CurrConnections',
    threshold: 100,
    comparisonOperator: 'GreaterThanThreshold',
  },
  highMemoryUsage: {
    metricName: 'DatabaseMemoryUsagePercentage',
    threshold: 80,
    comparisonOperator: 'GreaterThanThreshold',
  },
};
```

## Best Practices

### Security

1. **Use TLS**: Always enable TLS for production
2. **Authentication**: Use Redis AUTH for access control
3. **Network Security**: Restrict access via security groups
4. **Key Rotation**: Regularly rotate Redis passwords

### Performance

1. **Connection Pooling**: Reuse connections across requests
2. **Appropriate TTLs**: Set reasonable cache expiration times
3. **Batch Operations**: Use multi-get/set for bulk operations
4. **Monitor Memory**: Set up alerts for memory usage

### Reliability

1. **Error Handling**: Implement comprehensive error handling
2. **Fallback Strategies**: Graceful degradation when Redis is unavailable
3. **Circuit Breakers**: Prevent cascading failures
4. **Monitoring**: Track key metrics and performance

### Development

1. **Local Development**: Use Upstash for easy local setup
2. **Testing**: Write comprehensive tests for Redis operations
3. **Documentation**: Keep Redis schemas documented
4. **Version Control**: Track Redis configuration changes

## Troubleshooting

### Common Issues

#### Connection Errors

**Problem**: "Connection refused" or "ECONNREFUSED"
**Solution**: 
- Check Redis server status
- Verify network connectivity
- Confirm authentication credentials
- Check security group rules (for ElastiCache)

#### Authentication Failures

**Problem**: "AUTH failed" or "NOAUTH"
**Solution**:
- Verify Redis password/token
- Check AUTH command requirement
- Confirm user permissions (for ElastiCache)

#### High Memory Usage

**Problem**: Redis memory usage approaching limits
**Solution**:
- Review TTL settings
- Implement cache eviction policies
- Monitor key patterns
- Consider increasing memory allocation

#### Performance Issues

**Problem**: Slow Redis operations
**Solution**:
- Check network latency
- Review command complexity
- Monitor concurrent connections
- Consider connection pooling

### Debugging

#### Enable Debug Logging

```typescript
// lib/redis/config.ts
const redisClient = new Redis({
  // ... other options
  lazyConnect: true,
  enableReadyCheck: true,
  showFriendlyErrorStack: true,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});
```

#### Check Redis Info

```bash
# Connect to Redis CLI
redis-cli -h your-redis-host -p 6379 -a your-password

# Get Redis info
INFO memory
INFO stats
INFO clients
```

#### Monitor Commands

```bash
# Monitor Redis commands in real-time
redis-cli -h your-redis-host -p 6379 -a your-password MONITOR
```

### Support

For additional support:
- Check Redis documentation
- Review AWS ElastiCache documentation
- Consult Upstash documentation
- Contact your infrastructure team

---

## Appendix

### Redis Commands Reference

```bash
# Session management
SET session:org_123:abc123 "session_data" EX 3600
GET session:org_123:abc123
DEL session:org_123:abc123

# Cache operations
SET cache:org_123:users:user_456 "user_data" EX 3600
MGET cache:org_123:users:user_456 cache:org_123:users:user_789
EXPIRE cache:org_123:users:user_456 7200

# Cache invalidation by tags
KEYS cache:org_123:*:*
SCAN 0 MATCH cache:org_123:* COUNT 100
```

### Performance Benchmarks

| Operation | Upstash | ElastiCache |
|-----------|---------|-------------|
| GET | ~2ms | ~1ms |
| SET | ~3ms | ~1ms |
| MGET (10 keys) | ~5ms | ~2ms |
| PING | ~1ms | ~0.5ms |

*Note: Benchmarks may vary based on data size, network latency, and Redis configuration.* 