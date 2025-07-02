-- Migration: 004_create_courses.sql
-- Description: Create courses table for course content management
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(1000),
    thumbnail_url VARCHAR(500),
    instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE RESTRICT,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    difficulty difficulty_level DEFAULT 'beginner',
    duration_hours DECIMAL(5,2), -- Total course duration in hours
    price DECIMAL(10,2) DEFAULT 0.00,
    discount_price DECIMAL(10,2),
    status course_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT FALSE,
    prerequisites TEXT[], -- Array of prerequisite skills
    learning_objectives TEXT[], -- Array of learning outcomes
    tags TEXT[], -- Array of tags for searchability
    syllabus JSONB DEFAULT '[]', -- Course syllabus as JSON
    requirements TEXT[], -- Array of course requirements
    target_audience TEXT[], -- Array describing target audience
    language VARCHAR(10) DEFAULT 'en',
    certificate_enabled BOOLEAN DEFAULT TRUE,
    max_enrollments INTEGER, -- NULL for unlimited
    enrollment_start_date TIMESTAMP,
    enrollment_end_date TIMESTAMP,
    course_start_date TIMESTAMP,
    course_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_is_free ON courses(is_free);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_courses_prerequisites ON courses USING GIN(prerequisites);
CREATE INDEX IF NOT EXISTS idx_courses_language ON courses(language);
CREATE INDEX IF NOT EXISTS idx_courses_enrollment_dates ON courses(enrollment_start_date, enrollment_end_date);

-- Create trigger for updated_at
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '004',
    '004_create_courses.sql',
    'DROP TRIGGER IF EXISTS update_courses_updated_at ON courses; DROP INDEX IF EXISTS idx_courses_enrollment_dates; DROP INDEX IF EXISTS idx_courses_language; DROP INDEX IF EXISTS idx_courses_prerequisites; DROP INDEX IF EXISTS idx_courses_tags; DROP INDEX IF EXISTS idx_courses_price; DROP INDEX IF EXISTS idx_courses_is_free; DROP INDEX IF EXISTS idx_courses_is_featured; DROP INDEX IF EXISTS idx_courses_difficulty; DROP INDEX IF EXISTS idx_courses_status; DROP INDEX IF EXISTS idx_courses_category_id; DROP INDEX IF EXISTS idx_courses_instructor_id; DROP INDEX IF EXISTS idx_courses_slug; DROP TABLE IF EXISTS courses;',
    'course_004_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
-- DROP INDEX IF EXISTS idx_courses_enrollment_dates;
-- DROP INDEX IF EXISTS idx_courses_language;
-- DROP INDEX IF EXISTS idx_courses_prerequisites;
-- DROP INDEX IF EXISTS idx_courses_tags;
-- DROP INDEX IF EXISTS idx_courses_price;
-- DROP INDEX IF EXISTS idx_courses_is_free;
-- DROP INDEX IF EXISTS idx_courses_is_featured;
-- DROP INDEX IF EXISTS idx_courses_difficulty;
-- DROP INDEX IF EXISTS idx_courses_status;
-- DROP INDEX IF EXISTS idx_courses_category_id;
-- DROP INDEX IF EXISTS idx_courses_instructor_id;
-- DROP INDEX IF EXISTS idx_courses_slug;
-- DROP TABLE IF EXISTS courses; 