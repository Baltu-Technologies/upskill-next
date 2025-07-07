-- Migration: 001_multi_tenant_base_schema.sql
-- Description: Create multi-tenant base infrastructure for employer portal
-- Database: Main (Aurora PostgreSQL Serverless v2) 
-- Author: System
-- Created: 2025-01-06

-- UP: Apply migration

-- =============================================================================
-- SHARED PUBLIC SCHEMA TABLES (Cross-tenant metadata and infrastructure)
-- =============================================================================

-- Track tenant schemas and their metadata (no sensitive data)
CREATE TABLE IF NOT EXISTS public.tenant_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_name VARCHAR(63) NOT NULL UNIQUE, -- PostgreSQL schema name limit
    auth0_org_id VARCHAR(255) NOT NULL UNIQUE, -- Auth0 organization ID
    organization_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, archived
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    schema_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    CONSTRAINT valid_schema_name CHECK (schema_name ~ '^tenant_[a-zA-Z0-9_]+$'),
    CONSTRAINT valid_status CHECK (status IN ('active', 'suspended', 'archived', 'provisioning'))
);

-- Global system configurations (non-sensitive)
CREATE TABLE IF NOT EXISTS public.system_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(255) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false, -- Can be accessed by tenants
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Cross-tenant audit log (security and compliance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_schema VARCHAR(63), -- NULL for system-level events
    user_id TEXT, -- From Auth0 or system
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- login, create_job, delete_user, etc.
    resource_type VARCHAR(100), -- job_posting, user, organization, etc.
    resource_id VARCHAR(255),
    details JSONB, -- Additional context
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT
);

-- Schema migration tracking for tenant schemas
CREATE TABLE IF NOT EXISTS public.tenant_migrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_schema VARCHAR(63) NOT NULL,
    migration_version VARCHAR(20) NOT NULL,
    migration_name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
    rollback_sql TEXT,
    checksum VARCHAR(255),
    UNIQUE(tenant_schema, migration_version)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_tenant_registry_auth0_org_id ON public.tenant_registry(auth0_org_id);
CREATE INDEX IF NOT EXISTS idx_tenant_registry_schema_name ON public.tenant_registry(schema_name);
CREATE INDEX IF NOT EXISTS idx_tenant_registry_status ON public.tenant_registry(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_schema ON public.audit_logs(tenant_schema);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_tenant_migrations_schema ON public.tenant_migrations(tenant_schema);
CREATE INDEX IF NOT EXISTS idx_tenant_migrations_version ON public.tenant_migrations(tenant_schema, migration_version);

-- =============================================================================
-- TENANT SCHEMA TEMPLATE FUNCTIONS
-- =============================================================================

-- Function to create a new tenant schema
CREATE OR REPLACE FUNCTION public.create_tenant_schema(
    p_auth0_org_id VARCHAR(255),
    p_organization_name VARCHAR(255)
) RETURNS VARCHAR(63) AS $$
DECLARE
    v_schema_name VARCHAR(63);
    v_clean_org_id VARCHAR(50);
BEGIN
    -- Clean Auth0 org ID for schema name (remove special chars, limit length)
    v_clean_org_id := regexp_replace(p_auth0_org_id, '[^a-zA-Z0-9]', '_', 'g');
    v_clean_org_id := substring(v_clean_org_id from 1 for 40); -- Leave room for prefix
    v_schema_name := 'tenant_' || v_clean_org_id;
    
    -- Create the schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema_name);
    
    -- Register the tenant
    INSERT INTO public.tenant_registry (
        schema_name, 
        auth0_org_id, 
        organization_name, 
        status
    ) VALUES (
        v_schema_name, 
        p_auth0_org_id, 
        p_organization_name, 
        'provisioning'
    ) ON CONFLICT (auth0_org_id) DO UPDATE SET
        schema_name = EXCLUDED.schema_name,
        organization_name = EXCLUDED.organization_name,
        updated_at = NOW();
    
    -- Create tenant tables (will be implemented in next migration)
    PERFORM public.create_tenant_tables(v_schema_name);
    
    -- Mark as active
    UPDATE public.tenant_registry 
    SET status = 'active', updated_at = NOW() 
    WHERE schema_name = v_schema_name;
    
    RETURN v_schema_name;
END;
$$ LANGUAGE plpgsql;

-- Function to create tables within a tenant schema (placeholder)
CREATE OR REPLACE FUNCTION public.create_tenant_tables(p_schema_name VARCHAR(63)) 
RETURNS VOID AS $$
BEGIN
    -- This will be implemented in migration 002_tenant_tables.sql
    -- For now, just create a placeholder table
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I.tenant_info (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        schema_version VARCHAR(20) NOT NULL DEFAULT ''1.0.0''
    )', p_schema_name);
    
    -- Log the schema creation
    INSERT INTO public.tenant_migrations (
        tenant_schema, 
        migration_version, 
        migration_name, 
        rollback_sql
    ) VALUES (
        p_schema_name,
        '001',
        'create_tenant_tables_placeholder',
        format('DROP SCHEMA IF EXISTS %I CASCADE', p_schema_name)
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get schema name from Auth0 org ID
CREATE OR REPLACE FUNCTION public.get_tenant_schema(p_auth0_org_id VARCHAR(255)) 
RETURNS VARCHAR(63) AS $$
DECLARE
    v_schema_name VARCHAR(63);
BEGIN
    SELECT schema_name INTO v_schema_name
    FROM public.tenant_registry 
    WHERE auth0_org_id = p_auth0_org_id AND status = 'active';
    
    IF v_schema_name IS NULL THEN
        RAISE EXCEPTION 'No active tenant found for Auth0 org ID: %', p_auth0_org_id;
    END IF;
    
    RETURN v_schema_name;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- RBAC: Create tenant-specific roles (will be used by application)
-- =============================================================================

-- Function to create PostgreSQL roles for a tenant
CREATE OR REPLACE FUNCTION public.create_tenant_roles(p_schema_name VARCHAR(63))
RETURNS VOID AS $$
DECLARE
    v_admin_role VARCHAR(63);
    v_user_role VARCHAR(63);
BEGIN
    v_admin_role := p_schema_name || '_admin';
    v_user_role := p_schema_name || '_user';
    
    -- Create roles if they don't exist
    EXECUTE format('CREATE ROLE %I', v_admin_role);
    EXECUTE format('CREATE ROLE %I', v_user_role);
    
    -- Grant schema usage
    EXECUTE format('GRANT USAGE ON SCHEMA %I TO %I', p_schema_name, v_admin_role);
    EXECUTE format('GRANT USAGE ON SCHEMA %I TO %I', p_schema_name, v_user_role);
    
    -- Grant permissions (admin gets all, user gets select/insert/update)
    EXECUTE format('GRANT ALL ON ALL TABLES IN SCHEMA %I TO %I', p_schema_name, v_admin_role);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA %I TO %I', p_schema_name, v_user_role);
    
    -- Grant sequence permissions
    EXECUTE format('GRANT ALL ON ALL SEQUENCES IN SCHEMA %I TO %I', p_schema_name, v_admin_role);
    EXECUTE format('GRANT USAGE ON ALL SEQUENCES IN SCHEMA %I TO %I', p_schema_name, v_user_role);
    
    -- Set default privileges for future tables
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL ON TABLES TO %I', p_schema_name, v_admin_role);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT, INSERT, UPDATE ON TABLES TO %I', p_schema_name, v_user_role);
    
EXCEPTION
    WHEN duplicate_object THEN
        -- Roles already exist, just grant permissions
        EXECUTE format('GRANT USAGE ON SCHEMA %I TO %I', p_schema_name, v_admin_role);
        EXECUTE format('GRANT USAGE ON SCHEMA %I TO %I', p_schema_name, v_user_role);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SAMPLE DATA AND TESTING
-- =============================================================================

-- Insert system configurations
INSERT INTO public.system_configurations (config_key, config_value, description, is_public) VALUES
('max_job_postings_per_tenant', '"100"', 'Maximum number of active job postings per tenant', true),
('max_users_per_tenant', '"500"', 'Maximum number of users per tenant', true),
('audit_retention_days', '"365"', 'Number of days to retain audit logs', false),
('schema_version', '"1.0.0"', 'Current tenant schema version', true)
ON CONFLICT (config_key) DO UPDATE SET
    config_value = EXCLUDED.config_value,
    updated_at = NOW();

-- Record this migration
INSERT INTO public.tenant_migrations (
    tenant_schema, 
    migration_version, 
    migration_name, 
    rollback_sql,
    checksum
) VALUES (
    'public',
    '001',
    '001_multi_tenant_base_schema.sql',
    'DROP FUNCTION IF EXISTS public.create_tenant_roles; DROP FUNCTION IF EXISTS public.get_tenant_schema; DROP FUNCTION IF EXISTS public.create_tenant_tables; DROP FUNCTION IF EXISTS public.create_tenant_schema; DROP TABLE IF EXISTS public.tenant_migrations; DROP TABLE IF EXISTS public.audit_logs; DROP TABLE IF EXISTS public.system_configurations; DROP TABLE IF EXISTS public.tenant_registry;',
    'base_schema_001_checksum'
) ON CONFLICT (tenant_schema, migration_version) DO NOTHING;

-- =============================================================================
-- DOWN: Rollback migration (commented out for safety)
-- =============================================================================

/*
-- Drop functions
DROP FUNCTION IF EXISTS public.create_tenant_roles(VARCHAR);
DROP FUNCTION IF EXISTS public.get_tenant_schema(VARCHAR);
DROP FUNCTION IF EXISTS public.create_tenant_tables(VARCHAR);
DROP FUNCTION IF EXISTS public.create_tenant_schema(VARCHAR, VARCHAR);

-- Drop indexes
DROP INDEX IF EXISTS idx_tenant_migrations_version;
DROP INDEX IF EXISTS idx_tenant_migrations_schema;
DROP INDEX IF EXISTS idx_audit_logs_resource;
DROP INDEX IF EXISTS idx_audit_logs_action;
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_audit_logs_timestamp;
DROP INDEX IF EXISTS idx_audit_logs_tenant_schema;
DROP INDEX IF EXISTS idx_tenant_registry_status;
DROP INDEX IF EXISTS idx_tenant_registry_schema_name;
DROP INDEX IF EXISTS idx_tenant_registry_auth0_org_id;

-- Drop tables
DROP TABLE IF EXISTS public.tenant_migrations;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.system_configurations;
DROP TABLE IF EXISTS public.tenant_registry;
*/ 