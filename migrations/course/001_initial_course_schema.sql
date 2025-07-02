-- Migration: 001_initial_course_schema.sql
-- Description: Create initial course database schema and migration tracking
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(255) NOT NULL UNIQUE,
    filename VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT NOW(),
    rollback_sql TEXT,
    checksum VARCHAR(255)
);

-- Create custom types for better data integrity
CREATE TYPE IF NOT EXISTS course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE IF NOT EXISTS enrollment_status AS ENUM ('active', 'completed', 'dropped', 'suspended');
CREATE TYPE IF NOT EXISTS lesson_type AS ENUM ('video', 'text', 'interactive', 'quiz', 'assignment');
CREATE TYPE IF NOT EXISTS question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay');
CREATE TYPE IF NOT EXISTS difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '001',
    '001_initial_course_schema.sql',
    'DROP TYPE IF EXISTS difficulty_level; DROP TYPE IF EXISTS question_type; DROP TYPE IF EXISTS lesson_type; DROP TYPE IF EXISTS enrollment_status; DROP TYPE IF EXISTS course_status; DROP TABLE IF EXISTS schema_migrations;',
    'course_001_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TYPE IF EXISTS difficulty_level;
-- DROP TYPE IF EXISTS question_type;
-- DROP TYPE IF EXISTS lesson_type;
-- DROP TYPE IF EXISTS enrollment_status;
-- DROP TYPE IF EXISTS course_status;
-- DROP TABLE IF EXISTS schema_migrations; 