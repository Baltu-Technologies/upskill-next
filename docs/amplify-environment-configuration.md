# Amplify Environment-Specific Configuration Guide

## Overview
This document outlines how the Upskill Employer Portal's AWS Amplify Gen 2 backend uses environment-specific configurations to optimize resources, security, and costs across development, staging, and production environments.

## Configuration Architecture

### Environment Detection
The backend automatically detects the current environment using:
1. `process.env.NODE_ENV` (Next.js standard)
2. `process.env.APP_ENV` (custom override)
3. AWS Amplify deployment branch mapping

### Configuration Files Structure
```
amplify/
├── backend.ts                          # Main backend definition
├── backend/config/
│   └── environments.ts                 # Environment-specific configurations
├── data/
│   └── resource.ts                     # GraphQL API configuration
└── package.json                        # Backend dependencies
```

## Environment-Specific Resource Configurations

### Development Environment
**Optimized for**: Cost efficiency, rapid development, minimal resources

**Key Characteristics:**
- **Database**: `db.t3.micro` instances, single AZ, 1-day backup retention
- **Lambda**: 512MB memory, 30s timeout, no reserved concurrency
- **Monitoring**: Basic logging (7-day retention), no detailed monitoring
- **Security**: Minimal security features, local CORS origins
- **Auto Scaling**: 1-3 instances, relaxed CPU thresholds
- **Features**: Limited feature flags for faster testing

**Resource Scaling:**
```typescript
// Example configuration
database: {
  instanceClass: 'db.t3.micro',
  allocatedStorage: 20,
  multiAZ: false,
  backupRetentionPeriod: 1,
  deletionProtection: false
}
```

### Staging Environment
**Optimized for**: Testing production workloads, integration testing, performance validation

**Key Characteristics:**
- **Database**: `db.t3.small` instances, single AZ, 3-day backup retention
- **Lambda**: 1024MB memory, 60s timeout, reserved concurrency (10)
- **Monitoring**: Enhanced monitoring enabled, 30-day log retention
- **Security**: WAF enabled, rate limiting, SSL-only
- **Auto Scaling**: 2-10 instances, moderate CPU thresholds
- **Features**: All feature flags enabled for testing

**Resource Scaling:**
```typescript
// Example configuration
database: {
  instanceClass: 'db.t3.small',
  allocatedStorage: 50,
  multiAZ: false,
  backupRetentionPeriod: 3,
  deletionProtection: false
}
```

### Production Environment
**Optimized for**: High availability, performance, security, compliance

**Key Characteristics:**
- **Database**: `db.r5.large` instances, Multi-AZ, 30-day backup retention
- **Lambda**: 2048MB memory, 300s timeout, reserved + provisioned concurrency
- **Monitoring**: Full monitoring suite, 365-day log retention, X-Ray tracing
- **Security**: Full WAF, rate limiting, IP restrictions, MFA required
- **Auto Scaling**: 3-50 instances, aggressive scaling policies
- **Features**: All production features enabled

**Resource Scaling:**
```typescript
// Example configuration
database: {
  instanceClass: 'db.r5.large',
  allocatedStorage: 100,
  multiAZ: true,
  backupRetentionPeriod: 30,
  deletionProtection: true
}
```

## Service-Specific Environment Configurations

### PostgreSQL Database Configuration

#### Aurora Serverless v2 (Auth Database)
```typescript
// Development
max_connections: '200'
work_mem: '4MB'
effective_cache_size: '1GB'

// Staging  
max_connections: '300'
work_mem: '6MB'
effective_cache_size: '2GB'

// Production
max_connections: '500'
work_mem: '8MB'
effective_cache_size: '4GB'
```

#### RDS Proxy Settings
```typescript
// Development
maxConnectionsPercent: 50
idleClientTimeout: 1800

// Staging
maxConnectionsPercent: 75
idleClientTimeout: 1800

// Production
maxConnectionsPercent: 100
idleClientTimeout: 3600
```

### Lambda Function Configuration
```typescript
// Development
timeout: 30 seconds
memorySize: 512MB
concurrency: No limits

// Staging
timeout: 60 seconds
memorySize: 1024MB
reservedConcurrency: 10

// Production
timeout: 300 seconds
memorySize: 2048MB
reservedConcurrency: 50
provisionedConcurrency: 10
```

### CloudWatch Monitoring
```typescript
// Development
logRetentionDays: 7
detailedMonitoring: false
xrayTracing: false

// Staging
logRetentionDays: 30
detailedMonitoring: true
xrayTracing: true

// Production
logRetentionDays: 365
detailedMonitoring: true
xrayTracing: true
```

## Security Configuration by Environment

### CORS and Domain Configuration
```typescript
// Development
corsOrigins: ['http://localhost:3000', 'https://dev.d123456.amplifyapp.com']
sessionTimeout: 86400 // 24 hours
requireMFA: false

// Staging
corsOrigins: ['https://staging.d123456.amplifyapp.com']
sessionTimeout: 43200 // 12 hours
requireMFA: false

// Production
corsOrigins: ['https://employer.upskill.com']
sessionTimeout: 28800 // 8 hours
requireMFA: true
```

### Auth0 Integration Configuration
```typescript
// Environment-specific Auth0 domains
development: 'dev-qexcpj7a1xh3q5pe.us.auth0.com'
staging: 'upskill-employer-staging.us.auth0.com'
production: 'upskill-employer-production.us.auth0.com'
```

## Performance and Scaling Configuration

### Auto Scaling Policies
```typescript
// Development
minCapacity: 1
maxCapacity: 3
targetCPUUtilization: 70%

// Staging
minCapacity: 2
maxCapacity: 10
targetCPUUtilization: 60%

// Production
minCapacity: 3
maxCapacity: 50
targetCPUUtilization: 50%
```

### Caching Configuration
```typescript
// Development
cloudFrontEnabled: false
defaultTTL: 300
redisNodeType: 'cache.t3.micro'

// Staging
cloudFrontEnabled: true
defaultTTL: 3600
redisNodeType: 'cache.t3.small'

// Production
cloudFrontEnabled: true
defaultTTL: 3600
redisClusterMode: true
redisNodeType: 'cache.r5.large'
```

## Feature Flag Management

### Development Environment
```typescript
FEATURE_ADVANCED_ANALYTICS: false    // Reduce dev complexity
FEATURE_ENTERPRISE_SSO: false        // Not needed for dev testing
FEATURE_CUSTOM_BRANDING: true        // Test UI changes
```

### Staging Environment
```typescript
FEATURE_ADVANCED_ANALYTICS: true     // Test all features
FEATURE_ENTERPRISE_SSO: true         // Validate enterprise flows
FEATURE_CUSTOM_BRANDING: true        // Full feature testing
```

### Production Environment
```typescript
FEATURE_ADVANCED_ANALYTICS: true     // Full production features
FEATURE_ENTERPRISE_SSO: true         // Enterprise customer support
FEATURE_CUSTOM_BRANDING: true        // Customer customization
```

## Cost Optimization Strategy

### Development Environment Savings
- **Database**: Use smallest instance sizes (`t3.micro`)
- **Lambda**: No reserved concurrency, shorter timeouts
- **Monitoring**: Minimal logging and metrics
- **Auto-shutdown**: Tag resources for automated shutdown
- **Estimated Monthly Cost**: $50-100

### Staging Environment Costs
- **Database**: Moderate instance sizes (`t3.small`)
- **Lambda**: Limited reserved concurrency
- **Monitoring**: Selective detailed monitoring
- **Estimated Monthly Cost**: $200-400

### Production Environment Costs
- **Database**: High-performance instances (`r5.large`)
- **Lambda**: Full reserved/provisioned concurrency
- **Monitoring**: Complete monitoring suite
- **High Availability**: Multi-AZ deployments
- **Estimated Monthly Cost**: $800-1500

## Environment Configuration Validation

### Automated Validation Checks
The system automatically validates environment configurations:

```typescript
validateEnvironmentConfiguration('production')
// Returns:
{
  isValid: boolean,
  errors: string[],      // Critical issues that prevent deployment
  warnings: string[]     // Recommendations for optimization
}
```

### Production Environment Requirements
- ✅ Multi-AZ database deployment
- ✅ Deletion protection enabled
- ✅ WAF security enabled
- ✅ Monitoring and alerts configured
- ✅ Backup retention ≥ 7 days
- ✅ High availability (≥ 2 instances)

## Implementation Usage

### In Backend Code
```typescript
import { getEnvironmentSpecificConfig } from './backend/config/environments';

// Get current environment configuration
const config = getEnvironmentSpecificConfig(
  process.env.APP_ENV as Environment || 'development'
);

// Use in Aurora cluster definition
new rds.DatabaseCluster(stack, 'CourseAuroraCluster', {
  writer: rds.ClusterInstance.provisioned('Writer', {
    instanceType: ec2.InstanceType.of(
      ec2.InstanceClass.from(config.resourceConfig.database.instanceClass)
    ),
    // ... other configurations from environment config
  }),
  // ... rest of cluster configuration
});
```

### In Lambda Functions
```typescript
// Access environment-specific settings
const config = getEnvironmentSpecificConfig();
const performanceConfig = config.performanceConfig;

// Use rate limiting based on environment
if (performanceConfig.rateLimitEnabled) {
  // Apply rate limiting logic
}
```

### In Next.js Application
```typescript
import { getEnvironmentSpecificConfig } from '@/lib/config/environment';

// Get client-safe environment configuration
const config = getEnvironmentSpecificConfig();
const securityConfig = config.securityConfig;

// Use CORS origins for API calls
const allowedOrigins = securityConfig.corsOrigins;
```

## Deployment Pipeline Integration

### GitHub Actions Workflow
```yaml
- name: Validate Environment Configuration
  run: |
    npm run validate:env -- --environment=${{ env.ENVIRONMENT }}
    
- name: Deploy with Environment Config
  run: |
    npx amplify pipeline-deploy \
      --branch $AWS_BRANCH \
      --app-id $AWS_APP_ID \
      --environment ${{ env.ENVIRONMENT }}
```

### Environment Variable Mapping
```yaml
# .github/workflows/ci-cd.yml
env:
  ENVIRONMENT: ${{ 
    github.ref_name == 'main' && 'production' ||
    github.ref_name == 'staging' && 'staging' ||
    'development' 
  }}
```

## Monitoring and Alerting

### Environment-Specific Monitoring
Each environment has tailored monitoring based on its purpose:

- **Development**: Basic error tracking, minimal alerts
- **Staging**: Full monitoring for testing, alert validation
- **Production**: Complete monitoring suite, immediate alerts

### CloudWatch Dashboard Configuration
Dashboards automatically adjust widgets and thresholds based on environment:
- Development: Basic metrics, longer time periods
- Staging: Detailed metrics, medium time periods  
- Production: Real-time metrics, short time periods, SLA tracking

## Best Practices

### Configuration Management
1. **Never hardcode environment values** in backend.ts
2. **Use validation functions** before deployment
3. **Keep environment configs in sync** with actual requirements
4. **Document configuration changes** in this file

### Security Considerations
1. **Validate production security requirements** automatically
2. **Use different encryption keys** per environment
3. **Implement proper CORS policies** for each environment
4. **Enable audit logging** in staging and production

### Cost Management
1. **Tag all resources** with environment and cost center
2. **Implement auto-shutdown** for development resources
3. **Monitor costs** across environments
4. **Right-size resources** based on actual usage

## Troubleshooting

### Common Configuration Issues

#### Database Connection Limits
**Symptom**: Connection pool exhaustion
**Solution**: Adjust `max_connections` parameter group setting

#### Lambda Timeout Issues
**Symptom**: Function timeouts in production
**Solution**: Increase timeout and memory based on environment config

#### CORS Errors
**Symptom**: Cross-origin request blocked
**Solution**: Verify environment-specific CORS origins configuration

### Configuration Validation Errors
```bash
# Check environment configuration
npm run validate:env -- --environment=production

# Common fixes:
# 1. Enable Multi-AZ for production
# 2. Set deletion protection
# 3. Configure proper backup retention
# 4. Enable monitoring and alerting
```

## Migration Guide

### From Single Environment to Multi-Environment
1. Update backend.ts to import environment configurations
2. Replace hardcoded values with environment-specific configs
3. Update deployment scripts to pass environment parameter
4. Validate each environment configuration
5. Deploy to each environment sequentially

### Updating Environment Configurations
1. Modify `amplify/backend/config/environments.ts`
2. Run validation: `npm run validate:env`
3. Test in development environment first
4. Deploy to staging for validation
5. Deploy to production with approval

---

This environment-specific configuration approach ensures optimal resource utilization, security, and cost management across all deployment environments while maintaining consistency and reliability. 