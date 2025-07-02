-- Migration: 002_create_instructors.sql
-- Description: Create instructors table for course management
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    expertise TEXT[], -- Array of expertise areas
    website VARCHAR(500),
    social_links JSONB DEFAULT '{}', -- Social media links as JSON
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_instructors_email ON instructors(email);
CREATE INDEX IF NOT EXISTS idx_instructors_active ON instructors(is_active);
CREATE INDEX IF NOT EXISTS idx_instructors_verified ON instructors(is_verified);
CREATE INDEX IF NOT EXISTS idx_instructors_expertise ON instructors USING GIN(expertise);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_instructors_updated_at 
    BEFORE UPDATE ON instructors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '002',
    '002_create_instructors.sql',
    'DROP TRIGGER IF EXISTS update_instructors_updated_at ON instructors; DROP FUNCTION IF EXISTS update_updated_at_column(); DROP INDEX IF EXISTS idx_instructors_expertise; DROP INDEX IF EXISTS idx_instructors_verified; DROP INDEX IF EXISTS idx_instructors_active; DROP INDEX IF EXISTS idx_instructors_email; DROP TABLE IF EXISTS instructors;',
    'course_002_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS update_instructors_updated_at ON instructors;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP INDEX IF EXISTS idx_instructors_expertise;
-- DROP INDEX IF EXISTS idx_instructors_verified;
-- DROP INDEX IF EXISTS idx_instructors_active;
-- DROP INDEX IF EXISTS idx_instructors_email;
-- DROP TABLE IF EXISTS instructors; 