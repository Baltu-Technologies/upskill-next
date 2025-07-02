-- Migration: 006_create_enrollments_and_progress.sql
-- Description: Create enrollments and progress tables for student tracking
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL, -- Reference to auth database user.id
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'active',
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed_at TIMESTAMP,
    total_time_spent_minutes INTEGER DEFAULT 0,
    certificate_issued_at TIMESTAMP,
    payment_reference VARCHAR(255), -- Reference to payment system
    enrollment_source VARCHAR(100), -- How user enrolled (e.g., 'direct', 'referral', 'promotion')
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create progress table for detailed lesson tracking
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_position_seconds INTEGER DEFAULT 0, -- For video lessons
    notes TEXT, -- Student notes for this lesson
    bookmarked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(enrollment_id, lesson_id)
);

-- Create indexes for enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_progress ON enrollments(progress_percentage);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_completed_at ON enrollments(completed_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_last_accessed ON enrollments(last_accessed_at);

-- Create indexes for progress
CREATE INDEX IF NOT EXISTS idx_progress_enrollment_id ON progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_progress_bookmarked ON progress(bookmarked);
CREATE INDEX IF NOT EXISTS idx_progress_completion_percentage ON progress(completion_percentage);

-- Create triggers for updated_at
CREATE TRIGGER update_enrollments_updated_at 
    BEFORE UPDATE ON enrollments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at 
    BEFORE UPDATE ON progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update enrollment progress when lesson progress changes
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the enrollment progress percentage and completion status
    UPDATE enrollments 
    SET 
        progress_percentage = (
            SELECT COALESCE(AVG(completion_percentage), 0)
            FROM progress 
            WHERE enrollment_id = NEW.enrollment_id
        ),
        last_accessed_at = NOW(),
        completed_at = CASE 
            WHEN (
                SELECT AVG(completion_percentage) 
                FROM progress 
                WHERE enrollment_id = NEW.enrollment_id
            ) = 100 THEN NOW()
            ELSE NULL
        END,
        status = CASE 
            WHEN (
                SELECT AVG(completion_percentage) 
                FROM progress 
                WHERE enrollment_id = NEW.enrollment_id
            ) = 100 THEN 'completed'::enrollment_status
            ELSE status
        END
    WHERE id = NEW.enrollment_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update enrollment progress
CREATE TRIGGER update_enrollment_progress_trigger 
    AFTER INSERT OR UPDATE ON progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_enrollment_progress();

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '006',
    '006_create_enrollments_and_progress.sql',
    'DROP TRIGGER IF EXISTS update_enrollment_progress_trigger ON progress; DROP FUNCTION IF EXISTS update_enrollment_progress(); DROP TRIGGER IF EXISTS update_progress_updated_at ON progress; DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments; DROP INDEX IF EXISTS idx_progress_completion_percentage; DROP INDEX IF EXISTS idx_progress_bookmarked; DROP INDEX IF EXISTS idx_progress_completed; DROP INDEX IF EXISTS idx_progress_lesson_id; DROP INDEX IF EXISTS idx_progress_enrollment_id; DROP INDEX IF EXISTS idx_enrollments_last_accessed; DROP INDEX IF EXISTS idx_enrollments_completed_at; DROP INDEX IF EXISTS idx_enrollments_enrolled_at; DROP INDEX IF EXISTS idx_enrollments_progress; DROP INDEX IF EXISTS idx_enrollments_status; DROP INDEX IF EXISTS idx_enrollments_course_id; DROP INDEX IF EXISTS idx_enrollments_user_id; DROP TABLE IF EXISTS progress; DROP TABLE IF EXISTS enrollments;',
    'course_006_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS update_enrollment_progress_trigger ON progress;
-- DROP FUNCTION IF EXISTS update_enrollment_progress();
-- DROP TRIGGER IF EXISTS update_progress_updated_at ON progress;
-- DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
-- DROP INDEX IF EXISTS idx_progress_completion_percentage;
-- DROP INDEX IF EXISTS idx_progress_bookmarked;
-- DROP INDEX IF EXISTS idx_progress_completed;
-- DROP INDEX IF EXISTS idx_progress_lesson_id;
-- DROP INDEX IF EXISTS idx_progress_enrollment_id;
-- DROP INDEX IF EXISTS idx_enrollments_last_accessed;
-- DROP INDEX IF EXISTS idx_enrollments_completed_at;
-- DROP INDEX IF EXISTS idx_enrollments_enrolled_at;
-- DROP INDEX IF EXISTS idx_enrollments_progress;
-- DROP INDEX IF EXISTS idx_enrollments_status;
-- DROP INDEX IF EXISTS idx_enrollments_course_id;
-- DROP INDEX IF EXISTS idx_enrollments_user_id;
-- DROP TABLE IF EXISTS progress;
-- DROP TABLE IF EXISTS enrollments; 