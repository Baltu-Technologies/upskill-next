# Multi-Tenant Database Migration Guide
## Employer Portal - Migration System

### Overview

This guide explains how to use the multi-tenant migration system for the Employer Portal. The system supports schema-per-tenant architecture where each organization gets its own PostgreSQL schema while sharing common infrastructure.

---

## 🏗️ **Migration Architecture**

### **Database Structure**
```
PostgreSQL Database
├── public schema (shared infrastructure)
│   ├── tenant_registry          # Track all tenants
│   ├── tenant_migrations        # Migration history per tenant
│   ├── audit_logs              # Cross-tenant audit logging
│   └── system_configurations   # Global settings
├── tenant_org_ayHu5XNaTNHMasO5 # Baltu Technologies tenant
│   ├── organizations, users, job_postings, etc.
└── tenant_org_xyz123            # Other company tenant
    ├── organizations, users, job_postings, etc.
```

### **Migration Types**
1. **Public Schema Migrations**: Shared infrastructure and tenant management
2. **Tenant Schema Migrations**: Business logic tables applied to each tenant

---

## 🚀 **Getting Started**

### **Prerequisites**
```bash
# Set environment variable for database connection
export EMPLOYER_PORTAL_DB_URL="postgresql://user:pass@host:5432/employer_portal"
# OR use the fallback
export DATABASE_URL="postgresql://user:pass@host:5432/employer_portal"
```

### **Available Commands**

#### **Core Migration Commands**
```bash
# Run all migrations (public + all tenants)
npm run migrate:employer

# Run only public schema migrations
npm run migrate:employer:public

# Run only tenant schema migrations
npm run migrate:employer:tenants

# Preview what would be migrated (dry run)
npm run migrate:employer:dry
```

#### **Tenant Management Commands**
```bash
# List all registered tenants
npm run tenant:list

# Create new tenant (requires Auth0 org ID)
npm run tenant:create org_newcompany123
```

#### **Advanced Commands**
```bash
# Run migrations for specific tenant
node migrations/scripts/migrate-employer-portal.js --tenant tenant_org_xyz123

# Create tenant with custom name
node migrations/scripts/migrate-employer-portal.js --create-tenant org_abc123

# Verbose output with SQL preview
node migrations/scripts/migrate-employer-portal.js --verbose
```

---

## 📋 **Step-by-Step Deployment**

### **1. Initial Setup (First Time)**

```bash
# 1. Run public schema migrations (creates infrastructure)
npm run migrate:employer:public

# 2. Verify setup
npm run tenant:list
# Should show: "No tenants registered yet"
```

### **2. Create Your First Tenant**

```bash
# Create tenant for Baltu Technologies (already done in migration)
npm run tenant:list

# Should show:
# 1. Baltu Technologies
#    Schema: tenant_org_ayHu5XNaTNHMasO5
#    Auth0 Org ID: org_ayHu5XNaTNHMasO5
#    Status: active
```

### **3. Run Tenant Migrations**

```bash
# Apply business logic to all tenant schemas
npm run migrate:employer:tenants

# Verify migrations completed
npm run migrate:employer:dry
# Should show: "No pending migrations"
```

### **4. Add New Tenants**

```bash
# Create new tenant
npm run tenant:create org_newcompany456

# The system will:
# 1. Create PostgreSQL schema: tenant_org_newcompany456
# 2. Apply all existing tenant migrations
# 3. Register in tenant_registry
# 4. Set up tenant-specific roles
```

---

## 🔧 **Development Workflow**

### **Creating New Migrations**

#### **Public Schema Migration**
Create file: `migrations/employer-portal/003_add_feature.sql`

```sql
-- Migration: 003_add_feature.sql
-- Description: Add new feature to public schema
-- Database: Main (Aurora PostgreSQL Serverless v2) 

-- UP: Apply migration

-- Add new table to public schema
CREATE TABLE IF NOT EXISTS public.new_feature (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Update system configurations
INSERT INTO public.system_configurations (config_key, config_value, description, is_public) VALUES
('feature_enabled', '"true"', 'Enable new feature for all tenants', true)
ON CONFLICT (config_key) DO UPDATE SET
    config_value = EXCLUDED.config_value,
    updated_at = NOW();

-- Record this migration
INSERT INTO public.tenant_migrations (
    tenant_schema, 
    migration_version, 
    migration_name,
    rollback_sql
) VALUES (
    'public',
    '003',
    '003_add_feature.sql',
    'DROP TABLE IF EXISTS public.new_feature;'
) ON CONFLICT (tenant_schema, migration_version) DO NOTHING;

-- DOWN: Rollback migration (commented for safety)
/*
DROP TABLE IF EXISTS public.new_feature;
DELETE FROM public.system_configurations WHERE config_key = 'feature_enabled';
*/
```

#### **Tenant Schema Migration**
Update the `create_tenant_tables()` function in migration 002 or create migration 004:

```sql
-- Migration: 004_add_tenant_feature.sql
-- Description: Add new feature tables to tenant schemas

-- This migration will be applied to each tenant schema
-- The migration runner handles setting the correct search_path

CREATE TABLE IF NOT EXISTS feature_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    feature_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_data_org_id ON feature_data(organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_data_type ON feature_data(feature_type);

-- Enable RLS
ALTER TABLE feature_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON feature_data FOR ALL USING (true);
```

### **Testing Migrations**

```bash
# Always test with dry run first
npm run migrate:employer:dry

# Test on specific tenant
node migrations/scripts/migrate-employer-portal.js --tenant tenant_org_test --dry-run

# Run with verbose output to see SQL
node migrations/scripts/migrate-employer-portal.js --verbose --dry-run
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Connection Issues**
```bash
# Test database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()')
  .then(res => console.log('✅ Connected:', res.rows[0]))
  .catch(err => console.error('❌ Connection failed:', err.message))
  .finally(() => pool.end());
"
```

#### **Migration Failures**
```bash
# Check migration status
npm run migrate:employer:dry

# Check specific tenant
node migrations/scripts/migrate-employer-portal.js --tenant tenant_org_xyz --dry-run

# Verbose error information
node migrations/scripts/migrate-employer-portal.js --verbose
```

#### **Schema Issues**
```bash
# List all schemas
psql $DATABASE_URL -c "\dn"

# Check specific tenant schema
psql $DATABASE_URL -c "\dt tenant_org_ayHu5XNaTNHMasO5.*"

# Verify tenant registry
psql $DATABASE_URL -c "SELECT * FROM public.tenant_registry;"
```

### **Recovery Procedures**

#### **Recreate Tenant**
```sql
-- If tenant schema is corrupted, recreate it
SELECT public.create_tenant_schema('org_ayHu5XNaTNHMasO5', 'Baltu Technologies');
```

#### **Reset Migration Tracking**
```sql
-- Clear migration history for problematic tenant (DANGEROUS!)
DELETE FROM public.tenant_migrations WHERE tenant_schema = 'tenant_org_xyz';
```

---

## 📊 **Monitoring & Maintenance**

### **Check Migration Status**
```bash
# Quick status check
npm run migrate:employer:dry

# Detailed tenant information
npm run tenant:list

# Check migration history
psql $DATABASE_URL -c "
SELECT 
    tenant_schema,
    COUNT(*) as migration_count,
    MAX(applied_at) as last_migration
FROM public.tenant_migrations 
GROUP BY tenant_schema 
ORDER BY tenant_schema;
"
```

### **Performance Monitoring**
```sql
-- Check schema sizes
SELECT 
    schemaname,
    pg_size_pretty(sum(pg_total_relation_size(schemaname||'.'||tablename))::bigint) as size
FROM pg_tables 
WHERE schemaname LIKE 'tenant_%' 
GROUP BY schemaname 
ORDER BY sum(pg_total_relation_size(schemaname||'.'||tablename)) DESC;

-- Check tenant activity
SELECT 
    tr.organization_name,
    tr.schema_name,
    COUNT(al.id) as activity_count
FROM public.tenant_registry tr
LEFT JOIN public.audit_logs al ON al.tenant_schema = tr.schema_name
WHERE tr.status = 'active'
GROUP BY tr.organization_name, tr.schema_name
ORDER BY activity_count DESC;
```

---

## 🔄 **CI/CD Integration**

### **Automated Deployment**
```yaml
# .github/workflows/deploy.yml
- name: Run Database Migrations
  run: |
    # Set database connection
    export DATABASE_URL=${{ secrets.DATABASE_URL }}
    
    # Run public migrations first
    npm run migrate:employer:public
    
    # Then run tenant migrations
    npm run migrate:employer:tenants
    
    # Verify completion
    npm run migrate:employer:dry
```

### **Testing Pipeline**
```yaml
- name: Test Migrations
  run: |
    # Test with dry run
    npm run migrate:employer:dry
    
    # Create test tenant
    npm run tenant:create org_test_$(date +%s)
    
    # Verify tenant created successfully
    npm run tenant:list
```

---

## 🎯 **Best Practices**

### **Migration Safety**
1. **Always use dry run** before applying migrations
2. **Test on staging** environment first
3. **Backup database** before major migrations
4. **Use transactions** for atomic operations
5. **Include rollback scripts** in migration comments

### **Tenant Management**
1. **Use Auth0 org IDs** as the source of truth
2. **Monitor tenant creation** for suspicious activity
3. **Implement tenant limits** to prevent abuse
4. **Regular cleanup** of inactive tenants

### **Performance**
1. **Index strategically** on tenant tables
2. **Monitor schema sizes** and optimize
3. **Use connection pooling** for multi-tenant operations
4. **Set up alerts** for migration failures

---

## 📚 **Additional Resources**

- [Database Schema Design Document](./database-schema-design.md)
- [Multi-Tenant Security Guide](./security-guide.md)
- [Performance Optimization Tips](./performance-guide.md)
- [Backup and Recovery Procedures](./backup-recovery.md)

---

## 🆘 **Support**

If you encounter issues with the migration system:

1. **Check the logs** with `--verbose` flag
2. **Verify database connection** settings
3. **Review migration files** for syntax errors
4. **Test with dry run** to isolate issues
5. **Check tenant registry** for corruption

For emergency issues, contact the development team with:
- Error messages and stack traces
- Migration files being executed
- Tenant information (if applicable)
- Database connection details (sanitized) 