# Pipeline Troubleshooting Guide
## Quick Resolution for Common DevOps Issues

### Table of Contents
1. [Quick Diagnostics](#quick-diagnostics)
2. [Build Failures](#build-failures)
3. [Database Issues](#database-issues)
4. [Caching Problems](#caching-problems)
5. [Artifact Management](#artifact-management)
6. [Performance Issues](#performance-issues)
7. [Security Validation](#security-validation)
8. [Environment Configuration](#environment-configuration)
9. [Emergency Procedures](#emergency-procedures)

---

## Quick Diagnostics

### First Steps for Any Pipeline Issue

```bash
# 1. Check pipeline configuration
npm run pipeline:validate

# 2. Test database connectivity
npm run validate:db:json

# 3. Verify cache status
npm run cache:inspect

# 4. Check artifact integrity
npm run artifacts:validate:backend

# 5. Run quick pipeline tests
npm run pipeline:test:quick -- --verbose
```

### Common Error Patterns

| Error Pattern | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| `ETIMEDOUT` | Network/database timeout | Check VPC settings |
| `ENOTFOUND` | DNS resolution failed | Verify endpoint URLs |
| `ECONNREFUSED` | Service unavailable | Check service status |
| `Permission denied` | IAM/file permissions | Review access policies |
| `Module not found` | Missing dependencies | Run `npm ci` |
| `Type error` | TypeScript issues | Run `npx tsc --noEmit` |

---

## Build Failures

### TypeScript Compilation Errors

#### Symptoms
```
error TS2304: Cannot find name 'xxx'
error TS2307: Cannot find module 'xxx'
error TS2322: Type 'xxx' is not assignable to type 'yyy'
```

#### Diagnostics
```bash
# Check TypeScript configuration
npx tsc --noEmit --listFiles

# Verify dependencies
npm ls typescript @types/node @types/react

# Check for conflicting versions
npm ls --depth=0 | grep -E "(typescript|@types)"
```

#### Solutions
```bash
# 1. Clear TypeScript cache
rm -f tsconfig.tsbuildinfo

# 2. Reinstall type definitions
npm install --save-dev @types/node @types/react @types/react-dom

# 3. Update TypeScript
npm install --save-dev typescript@latest

# 4. Fix import paths
# Replace relative imports with absolute imports
# Update .env.local with correct paths
```

### Next.js Build Failures

#### Symptoms
```
Error: Build optimization failed
Error: Export default was not found in 'xxx'
Error: Module parse failed
```

#### Diagnostics
```bash
# Clear Next.js cache
rm -rf .next

# Check Next.js configuration
npm run build -- --debug

# Verify environment variables
node -e "console.log(process.env)" | grep NEXT_PUBLIC
```

#### Solutions
```bash
# 1. Clear all caches
rm -rf .next node_modules/.cache

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Check for conflicting packages
npm ls react react-dom next

# 4. Verify environment variables
cat .env.local .env.production.local
```

### Dependency Issues

#### Symptoms
```
npm ERR! peer dep missing
npm ERR! conflicting versions
Module not found: Can't resolve 'xxx'
```

#### Diagnostics
```bash
# Check for peer dependency issues
npm ls --depth=0

# Audit dependencies
npm audit

# Check for duplicate packages
npm ls react --depth=0
```

#### Solutions
```bash
# 1. Install missing peer dependencies
npm install --save-dev <missing-package>

# 2. Resolve version conflicts
npm install <package>@<specific-version>

# 3. Clear npm cache
npm cache clean --force

# 4. Use exact versions
npm install --save-exact <package>
```

---

## Database Issues

### Connection Failures

#### Symptoms
```
Error: Connection timeout
Error: ECONNREFUSED
Error: password authentication failed
```

#### Diagnostics
```bash
# Test database connectivity
npm run validate:db:verbose

# Check environment variables
echo $AUTH_DB_URL
echo $COURSE_DB_URL

# Test AWS Secrets Manager access
aws secretsmanager get-secret-value --secret-id upskill-auth-db-credentials
```

#### Solutions
```bash
# 1. Verify VPC configuration
# Check security groups allow PostgreSQL (port 5432)
# Verify subnets have proper routing

# 2. Update environment variables
# Ensure AUTH_DB_URL and COURSE_DB_URL are correct
# Check AWS Secrets Manager integration

# 3. Test RDS Proxy
# Verify proxy endpoint is accessible
# Check proxy target group health

# 4. Database permissions
# Ensure database user has required permissions
# Check Aurora cluster status
```

### Migration Failures

#### Symptoms
```
Error: relation "xxx" already exists
Error: syntax error at or near "xxx"
Error: permission denied for table xxx
```

#### Diagnostics
```bash
# Validate migration scripts
npm run migrate:dry

# Check migration tracking
node migrations/scripts/test-db.js --database=auth

# Verify SQL syntax
psql -h <host> -U <user> -d <database> -f migrations/auth/001_initial_auth_schema.sql --dry-run
```

#### Solutions
```bash
# 1. Reset migration tracking
# Drop schema_migrations table
# Re-run migrations from beginning

# 2. Fix SQL syntax errors
# Validate SQL with online tools
# Test against local PostgreSQL instance

# 3. Resolve permission issues
# Ensure migration user has CREATE, ALTER permissions
# Check database ownership

# 4. Handle existing schema
# Use IF NOT EXISTS clauses
# Implement proper rollback procedures
```

### Performance Issues

#### Symptoms
```
Slow query performance
Connection pool exhaustion
Database timeout errors
```

#### Diagnostics
```bash
# Monitor database connections
npm run validate:db:verbose

# Check RDS Proxy metrics
aws rds describe-db-proxy-targets --db-proxy-name upskill-rds-proxy

# Analyze slow queries
# Review CloudWatch metrics for Aurora
```

#### Solutions
```bash
# 1. Optimize connection pooling
# Adjust RDS Proxy configuration
# Implement connection retry logic

# 2. Index optimization
# Add indexes for frequently queried columns
# Review query execution plans

# 3. Query optimization
# Use prepared statements
# Implement query caching

# 4. Scale database resources
# Increase Aurora capacity
# Consider read replicas
```

---

## Caching Problems

### Cache Invalidation Issues

#### Symptoms
```
Build using outdated dependencies
Cache hit rate below 50%
Unexpected long build times
```

#### Diagnostics
```bash
# Inspect cache status
npm run cache:inspect

# Monitor cache performance
npm run cache:monitor

# Check cache key generation
npm run cache:key
```

#### Solutions
```bash
# 1. Clear problematic caches
npm run cache:clear --layer=dependencies
npm run cache:clear --layer=build

# 2. Optimize cache configuration
npm run cache:optimize

# 3. Update cache keys
# Ensure all relevant files are included in hash
# Check for file permission issues

# 4. Force cache rebuild
npm run cache:clear --force
rm -rf node_modules
npm ci
```

### Performance Degradation

#### Symptoms
```
Cache miss rate above 30%
Slow cache operations
Large cache sizes
```

#### Diagnostics
```bash
# Analyze cache performance
npm run cache:monitor --detailed

# Check disk space
df -h

# Monitor cache growth
du -sh ~/.npm node_modules .next/cache
```

#### Solutions
```bash
# 1. Clean up cache
npm run cache:clear --preview
npm cache clean --force

# 2. Optimize cache size
# Remove unused dependencies
# Implement cache size limits

# 3. Improve cache keys
# Use more specific cache keys
# Exclude unnecessary files from hashing

# 4. Monitor and tune
# Set up cache performance monitoring
# Adjust cache configuration based on metrics
```

---

## Artifact Management

### Collection Failures

#### Symptoms
```
Artifact collection failed
Missing build outputs
Security scan errors
```

#### Diagnostics
```bash
# Validate artifact structure
npm run artifacts:validate:backend

# Check artifact integrity
npm run artifacts:report

# Test artifact collection
npm run artifacts:collect:frontend --verbose
```

#### Solutions
```bash
# 1. Reinitialize artifacts
npm run artifacts:init --force

# 2. Check file permissions
chmod +x scripts/artifact-manager.js
chown -R $(whoami) artifacts/

# 3. Verify build outputs
test -d .next && echo "Build successful"
ls -la dist/ build/ .next/

# 4. Fix security scan issues
# Remove sensitive files from artifacts
# Update .gitignore patterns
```

### Security Scan Failures

#### Symptoms
```
Sensitive data detected
Security scan timeout
False positive alerts
```

#### Diagnostics
```bash
# Run detailed security scan
npm run artifacts:security:scan --verbose

# Check scan configuration
cat scripts/artifact-manager.js | grep -A 10 "security"

# Review detected issues
npm run artifacts:report --security
```

#### Solutions
```bash
# 1. Remove sensitive data
# Move secrets to environment variables
# Update .gitignore to exclude sensitive files

# 2. Configure scan exceptions
# Add false positives to ignore list
# Adjust scan sensitivity

# 3. Improve security practices
# Use AWS Secrets Manager
# Implement proper credential rotation

# 4. Update scan patterns
# Customize security scan rules
# Add project-specific patterns
```

---

## Performance Issues

### Slow Build Times

#### Symptoms
```
Build takes >10 minutes
High CPU/memory usage
Pipeline timeouts
```

#### Diagnostics
```bash
# Analyze build performance
npm run pipeline:performance

# Monitor resource usage
top -p $(pgrep node)

# Check for bottlenecks
time npm run build
```

#### Solutions
```bash
# 1. Optimize dependencies
# Remove unused dependencies
# Use production builds

# 2. Improve caching
npm run cache:optimize

# 3. Parallel processing
# Enable Next.js parallel builds
# Use multiple worker processes

# 4. Resource allocation
# Increase build instance size
# Optimize memory usage
```

### Memory Issues

#### Symptoms
```
JavaScript heap out of memory
Build process killed
High memory usage warnings
```

#### Diagnostics
```bash
# Monitor memory usage
node --max-old-space-size=4096 node_modules/.bin/next build

# Check memory leaks
npm run build -- --profile

# Analyze bundle size
npm run build -- --analyze
```

#### Solutions
```bash
# 1. Increase memory allocation
export NODE_OPTIONS="--max-old-space-size=4096"

# 2. Optimize bundle size
# Remove unused dependencies
# Implement code splitting

# 3. Build optimization
# Use production optimizations
# Enable tree shaking

# 4. Monitor and tune
# Set up memory monitoring
# Optimize based on usage patterns
```

---

## Security Validation

### Scan Failures

#### Symptoms
```
Security vulnerability detected
Outdated dependencies
Insecure configurations
```

#### Diagnostics
```bash
# Run security audit
npm audit

# Check for vulnerabilities
npm audit --audit-level=high

# Scan for secrets
npm run artifacts:security:scan
```

#### Solutions
```bash
# 1. Update dependencies
npm audit fix
npm update

# 2. Remove vulnerable packages
npm uninstall <vulnerable-package>
npm install <alternative-package>

# 3. Fix configuration issues
# Update security headers
# Improve access controls

# 4. Implement security best practices
# Use environment variables for secrets
# Regular security reviews
```

### Access Control Issues

#### Symptoms
```
Permission denied errors
IAM policy violations
Unauthorized access attempts
```

#### Diagnostics
```bash
# Check AWS permissions
aws sts get-caller-identity
aws iam get-role --role-name <role-name>

# Test resource access
aws s3 ls <bucket-name>
aws rds describe-db-instances
```

#### Solutions
```bash
# 1. Update IAM policies
# Grant minimum required permissions
# Remove unnecessary access

# 2. Fix role assumptions
# Verify trust relationships
# Update role policies

# 3. Implement least privilege
# Regular access reviews
# Time-limited credentials

# 4. Monitor access patterns
# Set up CloudTrail logging
# Alert on suspicious activity
```

---

## Environment Configuration

### Variable Issues

#### Symptoms
```
Environment variables not loaded
Undefined configuration values
Runtime configuration errors
```

#### Diagnostics
```bash
# Check environment variables
printenv | grep -E "(AUTH|COURSE|NEXT_PUBLIC)"

# Validate configuration
node -e "console.log(process.env)" | jq

# Test variable loading
npm run dev -- --verbose
```

#### Solutions
```bash
# 1. Fix environment files
# Verify .env.local exists
# Check variable naming (NEXT_PUBLIC_ prefix)

# 2. Update variable values
# Use AWS Secrets Manager for sensitive data
# Verify correct environment for deployment

# 3. Restart services
# Restart development server
# Clear environment cache

# 4. Validate configuration
# Check variable precedence
# Test in different environments
```

### AWS Configuration

#### Symptoms
```
AWS credentials not found
Region configuration issues
Service unavailable errors
```

#### Diagnostics
```bash
# Check AWS configuration
aws configure list
aws sts get-caller-identity

# Test service access
aws amplify list-apps
aws rds describe-db-instances
```

#### Solutions
```bash
# 1. Configure AWS credentials
aws configure
# Or use environment variables:
export AWS_ACCESS_KEY_ID=<key>
export AWS_SECRET_ACCESS_KEY=<secret>

# 2. Set correct region
export AWS_DEFAULT_REGION=us-east-1

# 3. Verify service endpoints
# Check service availability in region
# Verify VPC configuration

# 4. Update IAM policies
# Ensure required permissions
# Check resource access
```

---

## Emergency Procedures

### Rollback Procedures

#### Quick Rollback
```bash
# 1. Revert to previous deployment
git revert <commit-hash>
git push origin main

# 2. Database rollback (if needed)
npm run rollback:auth --to=<previous-version>
npm run rollback:course --to=<previous-version>

# 3. Clear problematic caches
npm run cache:clear --force

# 4. Trigger fresh deployment
# Push rollback commit
# Monitor deployment progress
```

#### Emergency Database Recovery
```bash
# 1. Stop application traffic
# Update load balancer or DNS

# 2. Restore from backup
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier upskill-auth-restored \
  --snapshot-identifier <snapshot-id>

# 3. Update connection strings
# Point application to restored database
# Update RDS Proxy configuration

# 4. Validate data integrity
npm run validate:db:verbose
# Test critical application functions
```

### Incident Response

#### Critical Build Failure
```bash
# 1. Immediate assessment
npm run pipeline:validate -- --verbose
npm run validate:db:json

# 2. Identify root cause
# Check recent commits
# Review error logs
# Test specific components

# 3. Quick fixes
# Revert problematic changes
# Clear caches if needed
# Update dependencies if required

# 4. Communication
# Notify team of issue
# Provide regular updates
# Document resolution
```

#### Performance Emergency
```bash
# 1. Immediate monitoring
npm run pipeline:performance
npm run cache:monitor

# 2. Quick optimizations
npm run cache:optimize
# Increase resource allocation
# Enable parallel processing

# 3. Load reduction
# Implement feature flags
# Reduce non-critical processes
# Scale infrastructure

# 4. Long-term fixes
# Identify bottlenecks
# Implement optimizations
# Monitor improvements
```

### Contact Information

#### Escalation Matrix
1. **Level 1**: Development Team
2. **Level 2**: DevOps Team  
3. **Level 3**: Infrastructure Team
4. **Level 4**: AWS Support

#### Emergency Contacts
- **DevOps On-call**: [contact-info]
- **Database Admin**: [contact-info]
- **Security Team**: [contact-info]
- **AWS Support**: [case-creation-process]

### Post-Incident

#### Documentation Requirements
- Root cause analysis
- Timeline of events
- Actions taken
- Lessons learned
- Prevention measures

#### Follow-up Actions
- Update monitoring
- Improve alerting
- Update documentation
- Team training
- Process improvements

---

*Troubleshooting guide last updated: 2025-07-02*
*For urgent issues, follow escalation procedures*
*Keep this guide updated with new solutions* 