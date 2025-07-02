-- Migration: 005_create_modules_and_lessons.sql
-- Description: Create modules and lessons tables for course content structure
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    estimated_duration_hours DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Main lesson content
    lesson_type lesson_type DEFAULT 'text',
    video_url VARCHAR(500),
    video_duration_seconds INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT FALSE,
    estimated_duration_minutes INTEGER DEFAULT 0,
    resources JSONB DEFAULT '[]', -- Additional resources as JSON array
    attachments JSONB DEFAULT '[]', -- File attachments as JSON array
    transcript TEXT, -- Video transcript for accessibility
    notes TEXT, -- Instructor notes
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(module_id, slug)
);

-- Create indexes for modules
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_sort_order ON modules(sort_order);
CREATE INDEX IF NOT EXISTS idx_modules_published ON modules(is_published);

-- Create indexes for lessons
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(module_id, slug);
CREATE INDEX IF NOT EXISTS idx_lessons_sort_order ON lessons(sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_lessons_free ON lessons(is_free);

-- Create triggers for updated_at
CREATE TRIGGER update_modules_updated_at 
    BEFORE UPDATE ON modules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at 
    BEFORE UPDATE ON lessons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '005',
    '005_create_modules_and_lessons.sql',
    'DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons; DROP TRIGGER IF EXISTS update_modules_updated_at ON modules; DROP INDEX IF EXISTS idx_lessons_free; DROP INDEX IF EXISTS idx_lessons_type; DROP INDEX IF EXISTS idx_lessons_published; DROP INDEX IF EXISTS idx_lessons_sort_order; DROP INDEX IF EXISTS idx_lessons_slug; DROP INDEX IF EXISTS idx_lessons_module_id; DROP INDEX IF EXISTS idx_modules_published; DROP INDEX IF EXISTS idx_modules_sort_order; DROP INDEX IF EXISTS idx_modules_course_id; DROP TABLE IF EXISTS lessons; DROP TABLE IF EXISTS modules;',
    'course_005_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
-- DROP TRIGGER IF EXISTS update_modules_updated_at ON modules;
-- DROP INDEX IF EXISTS idx_lessons_free;
-- DROP INDEX IF EXISTS idx_lessons_type;
-- DROP INDEX IF EXISTS idx_lessons_published;
-- DROP INDEX IF EXISTS idx_lessons_sort_order;
-- DROP INDEX IF EXISTS idx_lessons_slug;
-- DROP INDEX IF EXISTS idx_lessons_module_id;
-- DROP INDEX IF EXISTS idx_modules_published;
-- DROP INDEX IF EXISTS idx_modules_sort_order;
-- DROP INDEX IF EXISTS idx_modules_course_id;
-- DROP TABLE IF EXISTS lessons;
-- DROP TABLE IF EXISTS modules; 