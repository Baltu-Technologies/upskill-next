# Multi-Tenant Database Schema Design
## Employer Portal - Upskill Next

### Overview

This document describes the multi-tenant PostgreSQL schema design for the Upskill Employer Portal, a B2B platform that enables companies to manage job postings, track applications, and analyze recruitment data.

---

## 🏗️ **Architecture: Schema-Per-Tenant**

### **Strategy Selection**
After comprehensive research, we selected the **schema-per-tenant** approach for optimal balance of:
- ✅ **Strong logical isolation** between employers
- ✅ **Manageable operational complexity**
- ✅ **Cost-effective single database**
- ✅ **Compliance-friendly tenant boundaries**
- ✅ **Scalable to hundreds of tenants**

### **Database Structure**
```
PostgreSQL Database
├── public schema (shared infrastructure)
│   ├── tenant_registry
│   ├── system_configurations  
│   ├── audit_logs
│   └── tenant_migrations
├── tenant_org_ayHu5XNaTNHMasO5 (Baltu Technologies)
│   ├── organizations
│   ├── users
│   ├── job_postings
│   └── job_applications
└── tenant_org_xyz123 (Other Companies)
    ├── organizations
    ├── users
    ├── job_postings
    └── job_applications
```

---

## 📊 **Schema Components**

### **1. Public Schema (Shared Infrastructure)**

#### `tenant_registry`
Central registry of all tenant schemas and their metadata.

```sql
- id (UUID, PK)
- schema_name (VARCHAR, UNIQUE) -- "tenant_org_ayHu5XNaTNHMasO5"
- auth0_org_id (VARCHAR, UNIQUE) -- "org_ayHu5XNaTNHMasO5"  
- organization_name (VARCHAR) -- "Baltu Technologies"
- status (active|suspended|archived|provisioning)
- created_at, updated_at
- schema_version (VARCHAR) -- For migration tracking
```

#### `audit_logs`
Cross-tenant security and compliance logging.

```sql
- id (UUID, PK)
- tenant_schema (VARCHAR) -- NULL for system events
- user_id (TEXT) -- Auth0 user ID
- action (VARCHAR) -- "login", "create_job", "delete_user"
- resource_type (VARCHAR) -- "job_posting", "user", "organization"
- details (JSONB) -- Additional context
- ip_address, user_agent, timestamp
- success (BOOLEAN), error_message
```

#### `system_configurations`
Global settings accessible to tenants.

```sql
- config_key (VARCHAR, UNIQUE) -- "max_job_postings_per_tenant"
- config_value (JSONB) -- "100"
- description, is_public (BOOLEAN)
```

### **2. Tenant Schemas (Per Organization)**

Each tenant gets a complete set of business entities within their isolated schema.

#### `organizations`
Company profile and settings.

```sql
- id (UUID, PK)
- auth0_org_id (VARCHAR, UNIQUE)
- company_name, company_slug, description
- website_url, industry, company_size
- headquarters_location, founded_year
- primary_email, primary_phone
- settings (JSONB), preferences (JSONB)
- status (active|suspended|archived)
```

#### `users`
Employer user profiles (extends Auth0 data).

```sql
- id (UUID, PK) 
- auth0_user_id (VARCHAR, UNIQUE)
- organization_id (UUID, FK)
- email, first_name, last_name, job_title
- auth0_roles (TEXT[]) -- ["Employer Admin", "Employer Recruiter"]
- permissions (TEXT[]) -- Computed from roles
- status, last_login_at, preferences (JSONB)
```

#### `job_postings`
Job listings and requirements.

```sql
- id (UUID, PK)
- organization_id (UUID, FK)
- created_by_user_id (UUID, FK)
- title, slug, description, requirements
- employment_type (full-time|part-time|contract|internship)
- experience_level (entry|mid|senior|executive)
- remote_policy (remote|hybrid|on-site)
- salary_min, salary_max, salary_currency
- locations (JSONB) -- Multiple locations supported
- status (draft|published|paused|closed|archived)
- application_count, view_count
- tags (TEXT[]) -- Skills, keywords
```

#### `job_applications`
Candidate applications and evaluation.

```sql
- id (UUID, PK)
- job_posting_id (UUID, FK)
- organization_id (UUID, FK)
- candidate_email, candidate_first_name, candidate_last_name
- resume_url, cover_letter, portfolio_url
- custom_fields (JSONB) -- Custom application questions
- status (submitted|under_review|interview|offer|hired|rejected)
- screening_score (1-100), screening_notes
- submitted_at, reviewed_at, decision_made_at
```

#### `analytics_events`
Custom analytics and tracking.

```sql
- id (UUID, PK)
- organization_id (UUID, FK)
- event_name, event_category
- properties (JSONB), user_id
- ip_address, user_agent, timestamp
```

---

## 🔐 **Security & Access Control**

### **Multi-Layer Security**

1. **Schema-Level Isolation**
   - Physical separation of tenant data
   - PostgreSQL roles per tenant: `tenant_orgid_admin`, `tenant_orgid_user`
   - Schema-level permissions enforce boundaries

2. **Row-Level Security (RLS)**
   - Additional protection layer on all tenant tables
   - Backup safeguard against application bugs

3. **Auth0 Integration**
   - JWT claims carry organization context
   - Middleware sets database schema based on organization
   - Role-based permissions enforced at application level

### **Database Roles**

```sql
-- Per tenant roles created automatically
CREATE ROLE tenant_org_ayHu5XNaTNHMasO5_admin;
CREATE ROLE tenant_org_ayHu5XNaTNHMasO5_user;

-- Admin: Full schema access
GRANT ALL ON SCHEMA tenant_org_ayHu5XNaTNHMasO5 TO tenant_org_ayHu5XNaTNHMasO5_admin;

-- User: Read/write but no DDL
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA tenant_org_ayHu5XNaTNHMasO5 TO tenant_org_ayHu5XNaTNHMasO5_user;
```

---

## 🚀 **Tenant Provisioning**

### **Automated Schema Creation**

```sql
-- Create new tenant
SELECT public.create_tenant_schema(
    'org_xyz123',        -- Auth0 org ID
    'Example Company'    -- Organization name
);
```

**What happens:**
1. Clean Auth0 org ID → schema name (`tenant_org_xyz123`)
2. Create PostgreSQL schema
3. Register in `tenant_registry` 
4. Create all business tables
5. Set up tenant-specific roles
6. Enable RLS policies
7. Mark tenant as `active`

### **Migration Management**

- **Versioned migrations** applied to all tenant schemas
- **Rollback capabilities** for safe deployments
- **Migration tracking** per tenant
- **Template-based** schema creation for consistency

---

## 📈 **Performance Optimizations**

### **Indexing Strategy**

**Per tenant table indexes:**
- Primary keys (UUID with good randomness)
- Foreign key relationships
- Status columns for filtering
- Timestamp columns for sorting
- Search fields (email, slug, etc.)

**Cross-tenant indexes:**
- `tenant_registry.auth0_org_id` for fast tenant lookup
- `audit_logs.timestamp` for compliance queries
- `audit_logs.tenant_schema` for tenant-specific audits

### **Query Patterns**

```sql
-- 1. Get tenant schema from Auth0 org
SELECT public.get_tenant_schema('org_ayHu5XNaTNHMasO5');
-- Returns: tenant_org_ayhu5xnatNHmasO5

-- 2. Set schema context in application
SET search_path TO tenant_org_ayhu5xnatNHmasO5, public;

-- 3. Query tenant data (no tenant_id needed!)
SELECT * FROM job_postings WHERE status = 'published';
```

---

## 🔄 **Integration Points**

### **Auth0 Organizations → Database**

```
Auth0 JWT Claims:
{
  "https://employer-portal.upskill.com/organization": "org_ayHu5XNaTNHMasO5",
  "https://employer-portal.upskill.com/roles": ["Employer Admin"],
  "https://employer-portal.upskill.com/permissions": ["manage_users", "create_job_posting"]
}

Application Middleware:
1. Extract organization from JWT
2. Look up schema: public.get_tenant_schema('org_ayHu5XNaTNHMasO5')
3. Set connection schema context
4. Execute business logic
```

### **Database Connection Strategy**

- **Connection pooling** per schema context
- **Middleware** handles schema switching
- **Error handling** for missing tenants
- **Audit logging** for all tenant operations

---

## 📋 **Implementation Checklist**

- [x] **Base infrastructure schema** (migration 001)
- [x] **Tenant table definitions** (migration 002)
- [x] **Automatic tenant provisioning** functions
- [x] **Sample tenant creation** (Baltu Technologies)
- [ ] **Application middleware** for schema context
- [ ] **Connection pooling** configuration
- [ ] **Migration automation** scripts
- [ ] **Performance testing** with multiple tenants
- [ ] **Backup/restore** procedures
- [ ] **Monitoring** and alerting setup

---

## 🔧 **Development Commands**

### **Create New Tenant**
```sql
SELECT public.create_tenant_schema('org_newcompany123', 'New Company Inc');
```

### **List All Tenants**
```sql
SELECT schema_name, organization_name, status, created_at 
FROM public.tenant_registry 
ORDER BY created_at DESC;
```

### **Query Tenant Data**
```sql
-- Set context
SET search_path TO tenant_org_ayHu5XNaTNHMasO5;

-- Query as normal
SELECT title, status, created_at FROM job_postings;
```

### **Cross-Tenant Analytics**
```sql
-- Count total job postings across all tenants
SELECT 
    tr.organization_name,
    COUNT(*) as job_count
FROM public.tenant_registry tr
JOIN LATERAL (
    SELECT COUNT(*) 
    FROM (SELECT format('SELECT COUNT(*) FROM %I.job_postings', tr.schema_name)) as q
) jc ON true
WHERE tr.status = 'active';
```

---

## 🎯 **Next Steps**

1. **Implement application middleware** for automatic schema context switching
2. **Set up connection pooling** with tenant-aware configuration  
3. **Create data seeding** scripts for development/testing
4. **Build admin interface** for tenant management
5. **Implement backup strategies** per tenant
6. **Set up monitoring** for performance and security

This schema design provides a solid foundation for the multi-tenant employer portal while maintaining security, performance, and scalability requirements. 