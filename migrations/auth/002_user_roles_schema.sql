-- Migration: 002_user_roles_schema.sql
-- Description: Add user roles table and functions for learner platform RBAC
-- Database: Auth (Aurora PostgreSQL Serverless v2)
-- Author: System
-- Created: 2024-12-20

-- UP: Apply migration

-- Create user_roles table for learner platform roles
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'guide', 'content_creator', 'learner')),
    granted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    granted_by TEXT REFERENCES "user"(id), -- Who granted this role
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create user_profiles table for extended user information
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    location VARCHAR(100),
    timezone VARCHAR(50),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id TEXT)
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT role 
        FROM user_roles 
        WHERE user_id = p_user_id 
        AND is_active = true
        ORDER BY role
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION user_has_role(p_user_id TEXT, p_role VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 
        FROM user_roles 
        WHERE user_id = p_user_id 
        AND role = p_role 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_user_role(
    p_user_id TEXT, 
    p_role VARCHAR(50),
    p_granted_by TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_roles (user_id, role, granted_by)
    VALUES (p_user_id, p_role, p_granted_by)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET 
        is_active = true,
        granted_by = EXCLUDED.granted_by,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to revoke role from user
CREATE OR REPLACE FUNCTION revoke_user_role(p_user_id TEXT, p_role VARCHAR(50))
RETURNS VOID AS $$
BEGIN
    UPDATE user_roles 
    SET is_active = false, updated_at = NOW()
    WHERE user_id = p_user_id AND role = p_role;
END;
$$ LANGUAGE plpgsql;

-- Function to get or create user profile
CREATE OR REPLACE FUNCTION get_or_create_user_profile(
    p_user_id TEXT,
    p_first_name VARCHAR(100) DEFAULT NULL,
    p_last_name VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE(
    id INTEGER,
    user_id TEXT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    location VARCHAR(100),
    timezone VARCHAR(50),
    preferences JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    -- Insert if not exists
    INSERT INTO user_profiles (user_id, first_name, last_name)
    VALUES (p_user_id, p_first_name, p_last_name)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
        updated_at = NOW();
    
    -- Return the profile
    RETURN QUERY
    SELECT up.id, up.user_id, up.first_name, up.last_name, up.bio, 
           up.location, up.timezone, up.preferences, up.created_at, up.updated_at
    FROM user_profiles up
    WHERE up.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_roles_updated_at 
    BEFORE UPDATE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Assign default learner role to existing users
INSERT INTO user_roles (user_id, role, granted_by)
SELECT id, 'learner', NULL
FROM "user"
WHERE id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id, role) DO NOTHING;

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '002',
    '002_user_roles_schema.sql',
    'DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles; DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles; DROP FUNCTION IF EXISTS update_updated_at_column(); DROP FUNCTION IF EXISTS get_or_create_user_profile(TEXT, VARCHAR, VARCHAR); DROP FUNCTION IF EXISTS revoke_user_role(TEXT, VARCHAR); DROP FUNCTION IF EXISTS assign_user_role(TEXT, VARCHAR, TEXT); DROP FUNCTION IF EXISTS user_has_role(TEXT, VARCHAR); DROP FUNCTION IF EXISTS get_user_roles(TEXT); DROP INDEX IF EXISTS idx_user_profiles_user_id; DROP INDEX IF EXISTS idx_user_roles_active; DROP INDEX IF EXISTS idx_user_roles_role; DROP INDEX IF EXISTS idx_user_roles_user_id; DROP TABLE IF EXISTS user_profiles; DROP TABLE IF EXISTS user_roles;',
    'auth_002_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
-- DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP FUNCTION IF EXISTS get_or_create_user_profile(TEXT, VARCHAR, VARCHAR);
-- DROP FUNCTION IF EXISTS revoke_user_role(TEXT, VARCHAR);
-- DROP FUNCTION IF EXISTS assign_user_role(TEXT, VARCHAR, TEXT);
-- DROP FUNCTION IF EXISTS user_has_role(TEXT, VARCHAR);
-- DROP FUNCTION IF EXISTS get_user_roles(TEXT);
-- DROP INDEX IF EXISTS idx_user_profiles_user_id;
-- DROP INDEX IF EXISTS idx_user_roles_active;
-- DROP INDEX IF EXISTS idx_user_roles_role;
-- DROP INDEX IF EXISTS idx_user_roles_user_id;
-- DROP TABLE IF EXISTS user_profiles;
-- DROP TABLE IF EXISTS user_roles; 