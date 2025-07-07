-- Migration: 002_tenant_tables_schema.sql
-- Description: Create detailed tenant tables for employer portal business entities
-- Database: Main (Aurora PostgreSQL Serverless v2) - Tenant Schemas
-- Author: System  
-- Created: 2025-01-06

-- UP: Apply migration

-- =============================================================================
-- TENANT SCHEMA TABLES (Per-tenant business entities)
-- =============================================================================

-- Function to create complete tenant table structure
CREATE OR REPLACE FUNCTION public.create_tenant_tables(p_schema_name VARCHAR(63)) 
RETURNS VOID AS $$
BEGIN
    
    -- =========================================================================
    -- ORGANIZATION & COMPANY PROFILE
    -- =========================================================================
    
    -- Main organization/company information
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        auth0_org_id VARCHAR(255) NOT NULL UNIQUE,
        company_name VARCHAR(255) NOT NULL,
        company_slug VARCHAR(100) UNIQUE, -- URL-friendly identifier
        description TEXT,
        website_url VARCHAR(255),
        industry VARCHAR(100),
        company_size VARCHAR(50), -- "1-10", "11-50", "51-200", "201-500", "500+"
        founded_year INTEGER,
        headquarters_location VARCHAR(255),
        
        -- Contact information
        primary_email VARCHAR(255),
        primary_phone VARCHAR(50),
        
        -- Settings and preferences
        settings JSONB DEFAULT ''{}'',
        preferences JSONB DEFAULT ''{}'',
        
        -- Status and metadata
        status VARCHAR(50) NOT NULL DEFAULT ''active'',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        CONSTRAINT valid_company_size CHECK (company_size IN (''1-10'', ''11-50'', ''51-200'', ''201-500'', ''500+'', ''1000+'')),
        CONSTRAINT valid_org_status CHECK (status IN (''active'', ''suspended'', ''archived''))
    )', p_schema_name);
    
    -- Company branding and assets
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.organization_branding (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        logo_url VARCHAR(500),
        banner_url VARCHAR(500),
        brand_colors JSONB, -- {"primary": "#123456", "secondary": "#789abc"}
        fonts JSONB, -- Font preferences
        custom_css TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )', p_schema_name, p_schema_name);
    
    -- =========================================================================
    -- USER MANAGEMENT & ROLES
    -- =========================================================================
    
    -- Detailed user profiles (extends Auth0 user data)
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        auth0_user_id VARCHAR(255) NOT NULL UNIQUE, -- Auth0 sub claim
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        
        -- Profile information
        email VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        job_title VARCHAR(150),
        department VARCHAR(100),
        phone VARCHAR(50),
        bio TEXT,
        avatar_url VARCHAR(500),
        
        -- Auth0 role integration
        auth0_roles TEXT[], -- From Auth0: ["Employer Admin", "Employer Recruiter"]
        permissions TEXT[], -- Computed permissions from roles
        
        -- Status and preferences
        status VARCHAR(50) NOT NULL DEFAULT ''active'',
        last_login_at TIMESTAMP,
        preferences JSONB DEFAULT ''{}'',
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        CONSTRAINT valid_user_status CHECK (status IN (''active'', ''suspended'', ''archived'')),
        UNIQUE(organization_id, email)
    )', p_schema_name, p_schema_name);
    
    -- =========================================================================
    -- JOB MANAGEMENT
    -- =========================================================================
    
    -- Job categories for organization
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.job_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        parent_category_id UUID REFERENCES %I.job_categories(id),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        UNIQUE(organization_id, name)
    )', p_schema_name, p_schema_name, p_schema_name);
    
    -- Job postings
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.job_postings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        created_by_user_id UUID NOT NULL REFERENCES %I.users(id),
        job_category_id UUID REFERENCES %I.job_categories(id),
        
        -- Job details
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(150) UNIQUE, -- URL-friendly identifier
        description TEXT NOT NULL,
        requirements TEXT,
        responsibilities TEXT,
        benefits TEXT,
        
        -- Position details
        employment_type VARCHAR(50) NOT NULL, -- "full-time", "part-time", "contract", "internship"
        experience_level VARCHAR(50), -- "entry", "mid", "senior", "executive"
        remote_policy VARCHAR(50), -- "remote", "hybrid", "on-site"
        
        -- Compensation
        salary_min INTEGER,
        salary_max INTEGER,
        salary_currency VARCHAR(10) DEFAULT ''USD'',
        compensation_details TEXT,
        
        -- Location
        location_type VARCHAR(50), -- "specific", "remote", "multiple"
        locations JSONB, -- [{"city": "San Francisco", "state": "CA", "country": "US"}]
        
        -- Application settings
        application_deadline TIMESTAMP,
        external_apply_url VARCHAR(500), -- If applications go to external site
        application_instructions TEXT,
        
        -- Status and workflow
        status VARCHAR(50) NOT NULL DEFAULT ''draft'',
        published_at TIMESTAMP,
        expires_at TIMESTAMP,
        application_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        
        -- SEO and marketing
        seo_title VARCHAR(200),
        seo_description TEXT,
        tags TEXT[], -- Skills, keywords
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        CONSTRAINT valid_employment_type CHECK (employment_type IN (''full-time'', ''part-time'', ''contract'', ''internship'', ''temporary'')),
        CONSTRAINT valid_experience_level CHECK (experience_level IN (''entry'', ''mid'', ''senior'', ''executive'', ''director'')),
        CONSTRAINT valid_remote_policy CHECK (remote_policy IN (''remote'', ''hybrid'', ''on-site'', ''flexible'')),
        CONSTRAINT valid_job_status CHECK (status IN (''draft'', ''published'', ''paused'', ''closed'', ''archived'')),
        CONSTRAINT valid_salary_range CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
    )', p_schema_name, p_schema_name, p_schema_name, p_schema_name);
    
    -- Job applications
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.job_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_posting_id UUID NOT NULL REFERENCES %I.job_postings(id) ON DELETE CASCADE,
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        
        -- Candidate information
        candidate_email VARCHAR(255) NOT NULL,
        candidate_first_name VARCHAR(100),
        candidate_last_name VARCHAR(100),
        candidate_phone VARCHAR(50),
        
        -- Application data
        resume_url VARCHAR(500),
        cover_letter TEXT,
        portfolio_url VARCHAR(500),
        linkedin_url VARCHAR(255),
        additional_documents JSONB, -- [{"name": "transcript.pdf", "url": "..."}]
        custom_fields JSONB, -- Custom application questions
        
        -- Application workflow
        status VARCHAR(50) NOT NULL DEFAULT ''submitted'',
        source VARCHAR(100), -- How they found the job
        referrer_name VARCHAR(255),
        
        -- Screening and evaluation
        screening_score INTEGER, -- 1-100
        screening_notes TEXT,
        interviewer_notes TEXT,
        evaluation_data JSONB,
        
        -- Timeline
        submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
        reviewed_at TIMESTAMP,
        interview_scheduled_at TIMESTAMP,
        decision_made_at TIMESTAMP,
        
        -- Communication
        last_communication_at TIMESTAMP,
        communication_log JSONB, -- Email/message history
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        CONSTRAINT valid_application_status CHECK (status IN (''submitted'', ''under_review'', ''screening'', ''interview'', ''assessment'', ''offer'', ''hired'', ''rejected'', ''withdrawn'')),
        CONSTRAINT valid_screening_score CHECK (screening_score IS NULL OR (screening_score >= 0 AND screening_score <= 100))
    )', p_schema_name, p_schema_name, p_schema_name);
    
    -- =========================================================================
    -- ANALYTICS & REPORTING
    -- =========================================================================
    
    -- User activity tracking
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.user_activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES %I.users(id),
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        
        -- Activity details
        activity_type VARCHAR(100) NOT NULL, -- "login", "create_job", "view_application", etc.
        resource_type VARCHAR(100), -- "job_posting", "application", "user", etc.
        resource_id VARCHAR(255),
        
        -- Context and metadata
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        session_id VARCHAR(255),
        
        -- Timestamps
        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        
        -- Performance analytics
        duration_ms INTEGER, -- How long the action took
        success BOOLEAN DEFAULT true,
        error_details TEXT
    )', p_schema_name, p_schema_name, p_schema_name);
    
    -- Custom analytics events
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        
        -- Event identification
        event_name VARCHAR(100) NOT NULL,
        event_category VARCHAR(100),
        
        -- Event data
        properties JSONB,
        user_id UUID REFERENCES %I.users(id),
        session_id VARCHAR(255),
        
        -- Context
        ip_address INET,
        user_agent TEXT,
        referrer VARCHAR(500),
        page_url VARCHAR(500),
        
        -- Timestamps
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
    )', p_schema_name, p_schema_name, p_schema_name);
    
    -- Report configurations (saved reports)
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.report_configurations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES %I.organizations(id) ON DELETE CASCADE,
        created_by_user_id UUID NOT NULL REFERENCES %I.users(id),
        
        -- Report definition
        name VARCHAR(200) NOT NULL,
        description TEXT,
        report_type VARCHAR(100) NOT NULL,
        
        -- Configuration
        parameters JSONB NOT NULL,
        filters JSONB,
        date_range JSONB,
        
        -- Scheduling
        is_scheduled BOOLEAN DEFAULT false,
        schedule_cron VARCHAR(100), -- Cron expression for automation
        recipients TEXT[], -- Email addresses for scheduled reports
        
        -- Status
        is_active BOOLEAN DEFAULT true,
        last_generated_at TIMESTAMP,
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )', p_schema_name, p_schema_name, p_schema_name);
    
    -- =========================================================================
    -- INDEXES FOR PERFORMANCE
    -- =========================================================================
    
    -- Organization indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_organizations_auth0_org_id ON %I.organizations(auth0_org_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_organizations_slug ON %I.organizations(company_slug)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_organizations_status ON %I.organizations(status)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    
    -- User indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_users_auth0_user_id ON %I.users(auth0_user_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_users_organization_id ON %I.users(organization_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_users_email ON %I.users(email)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_users_status ON %I.users(status)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    
    -- Job posting indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_postings_organization_id ON %I.job_postings(organization_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_postings_status ON %I.job_postings(status)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_postings_published_at ON %I.job_postings(published_at)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_postings_slug ON %I.job_postings(slug)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_postings_category ON %I.job_postings(job_category_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    
    -- Job application indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_applications_job_posting_id ON %I.job_applications(job_posting_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_applications_organization_id ON %I.job_applications(organization_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_applications_status ON %I.job_applications(status)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_applications_submitted_at ON %I.job_applications(submitted_at)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_job_applications_candidate_email ON %I.job_applications(candidate_email)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    
    -- Analytics indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_user_activities_user_id ON %I.user_activities(user_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_user_activities_timestamp ON %I.user_activities(timestamp)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_user_activities_activity_type ON %I.user_activities(activity_type)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_analytics_events_organization_id ON %I.analytics_events(organization_id)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_analytics_events_timestamp ON %I.analytics_events(timestamp)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_analytics_events_event_name ON %I.analytics_events(event_name)', replace(p_schema_name, 'tenant_', ''), p_schema_name);
    
    -- =========================================================================
    -- ROW LEVEL SECURITY (Additional protection)
    -- =========================================================================
    
    -- Enable RLS on all tenant tables
    EXECUTE format('ALTER TABLE %I.organizations ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.organization_branding ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.users ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.job_categories ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.job_postings ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.job_applications ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.user_activities ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.analytics_events ENABLE ROW LEVEL SECURITY', p_schema_name);
    EXECUTE format('ALTER TABLE %I.report_configurations ENABLE ROW LEVEL SECURITY', p_schema_name);
    
    -- Create RLS policies (allow all within schema - schema isolation is primary security)
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.organizations FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.organization_branding FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.users FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.job_categories FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.job_postings FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.job_applications FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.user_activities FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.analytics_events FOR ALL USING (true)', p_schema_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.report_configurations FOR ALL USING (true)', p_schema_name);
    
    -- =========================================================================
    -- DROP OLD PLACEHOLDER TABLE
    -- =========================================================================
    
    EXECUTE format('DROP TABLE IF EXISTS %I.tenant_info', p_schema_name);
    
    -- =========================================================================
    -- LOG MIGRATION
    -- =========================================================================
    
    INSERT INTO public.tenant_migrations (
        tenant_schema, 
        migration_version, 
        migration_name, 
        rollback_sql
    ) VALUES (
        p_schema_name,
        '002',
        'create_detailed_tenant_tables',
        format('DROP SCHEMA IF EXISTS %I CASCADE', p_schema_name)
    ) ON CONFLICT (tenant_schema, migration_version) DO NOTHING;
    
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- CREATE SAMPLE TENANT FOR TESTING
-- =============================================================================

-- Create a sample tenant for your existing Auth0 organization
SELECT public.create_tenant_schema(
    'org_ayHu5XNaTNHMasO5', -- Your Auth0 org ID
    'Baltu Technologies'     -- Organization name
);

-- Record this migration
INSERT INTO public.tenant_migrations (
    tenant_schema, 
    migration_version, 
    migration_name, 
    rollback_sql,
    checksum
) VALUES (
    'public',
    '002',
    '002_tenant_tables_schema.sql',
    'DROP FUNCTION IF EXISTS public.create_tenant_tables;',
    'tenant_tables_002_checksum'
) ON CONFLICT (tenant_schema, migration_version) DO NOTHING;

-- =============================================================================
-- DOWN: Rollback migration (commented out for safety)
-- =============================================================================

/*
-- Drop the updated function
DROP FUNCTION IF EXISTS public.create_tenant_tables(VARCHAR);

-- Remove sample tenant
DROP SCHEMA IF EXISTS tenant_org_ayHu5XNaTNHMasO5 CASCADE;
DELETE FROM public.tenant_registry WHERE auth0_org_id = 'org_ayHu5XNaTNHMasO5';
*/ 