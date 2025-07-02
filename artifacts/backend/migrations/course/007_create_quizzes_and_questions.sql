-- Migration: 007_create_quizzes_and_questions.sql
-- Description: Create quizzes and questions tables for assessment functionality
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    instructions TEXT,
    time_limit_minutes INTEGER, -- NULL for no time limit
    passing_score_percentage DECIMAL(5,2) DEFAULT 70.00 CHECK (passing_score_percentage >= 0 AND passing_score_percentage <= 100),
    max_attempts INTEGER DEFAULT 3, -- NULL for unlimited attempts
    shuffle_questions BOOLEAN DEFAULT TRUE,
    shuffle_answers BOOLEAN DEFAULT TRUE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    allow_review BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    is_required BOOLEAN DEFAULT FALSE, -- Required to pass the course
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT quiz_parent_check CHECK (
        (lesson_id IS NOT NULL AND course_id IS NULL) OR 
        (lesson_id IS NULL AND course_id IS NOT NULL)
    )
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type DEFAULT 'multiple_choice',
    points DECIMAL(5,2) DEFAULT 1.00,
    sort_order INTEGER DEFAULT 0,
    explanation TEXT, -- Explanation shown after answering
    image_url VARCHAR(500),
    options JSONB DEFAULT '[]', -- Answer options for multiple choice/true-false
    correct_answers JSONB DEFAULT '[]', -- Correct answer(s) 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    score_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (score_percentage >= 0 AND score_percentage <= 100),
    total_points DECIMAL(8,2) DEFAULT 0.00,
    earned_points DECIMAL(8,2) DEFAULT 0.00,
    is_passed BOOLEAN DEFAULT FALSE,
    answers JSONB DEFAULT '{}', -- User answers as JSON object
    time_spent_minutes INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(enrollment_id, quiz_id, attempt_number)
);

-- Create indexes for quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_published ON quizzes(is_published);
CREATE INDEX IF NOT EXISTS idx_quizzes_required ON quizzes(is_required);

-- Create indexes for questions
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_sort_order ON questions(sort_order);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

-- Create indexes for quiz_attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_enrollment_id ON quiz_attempts(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_attempt_number ON quiz_attempts(attempt_number);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(completed_at);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_score ON quiz_attempts(score_percentage);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_passed ON quiz_attempts(is_passed);

-- Create triggers for updated_at
CREATE TRIGGER update_quizzes_updated_at 
    BEFORE UPDATE ON quizzes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at 
    BEFORE UPDATE ON quiz_attempts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate quiz score
CREATE OR REPLACE FUNCTION calculate_quiz_score()
RETURNS TRIGGER AS $$
DECLARE
    quiz_passing_score DECIMAL(5,2);
BEGIN
    -- Get quiz passing score
    SELECT passing_score_percentage INTO quiz_passing_score
    FROM quizzes 
    WHERE id = NEW.quiz_id;
    
    -- Calculate score percentage
    IF NEW.total_points > 0 THEN
        NEW.score_percentage = (NEW.earned_points / NEW.total_points) * 100;
    ELSE
        NEW.score_percentage = 0;
    END IF;
    
    -- Determine if passed
    NEW.is_passed = NEW.score_percentage >= quiz_passing_score;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate quiz scores
CREATE TRIGGER calculate_quiz_score_trigger 
    BEFORE INSERT OR UPDATE ON quiz_attempts 
    FOR EACH ROW 
    WHEN (NEW.earned_points IS NOT NULL AND NEW.total_points IS NOT NULL)
    EXECUTE FUNCTION calculate_quiz_score();

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '007',
    '007_create_quizzes_and_questions.sql',
    'DROP TRIGGER IF EXISTS calculate_quiz_score_trigger ON quiz_attempts; DROP FUNCTION IF EXISTS calculate_quiz_score(); DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON quiz_attempts; DROP TRIGGER IF EXISTS update_questions_updated_at ON questions; DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes; DROP INDEX IF EXISTS idx_quiz_attempts_passed; DROP INDEX IF EXISTS idx_quiz_attempts_score; DROP INDEX IF EXISTS idx_quiz_attempts_completed; DROP INDEX IF EXISTS idx_quiz_attempts_attempt_number; DROP INDEX IF EXISTS idx_quiz_attempts_quiz_id; DROP INDEX IF EXISTS idx_quiz_attempts_enrollment_id; DROP INDEX IF EXISTS idx_questions_active; DROP INDEX IF EXISTS idx_questions_sort_order; DROP INDEX IF EXISTS idx_questions_type; DROP INDEX IF EXISTS idx_questions_quiz_id; DROP INDEX IF EXISTS idx_quizzes_required; DROP INDEX IF EXISTS idx_quizzes_published; DROP INDEX IF EXISTS idx_quizzes_course_id; DROP INDEX IF EXISTS idx_quizzes_lesson_id; DROP TABLE IF EXISTS quiz_attempts; DROP TABLE IF EXISTS questions; DROP TABLE IF EXISTS quizzes;',
    'course_007_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS calculate_quiz_score_trigger ON quiz_attempts;
-- DROP FUNCTION IF EXISTS calculate_quiz_score();
-- DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON quiz_attempts;
-- DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
-- DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
-- DROP INDEX IF EXISTS idx_quiz_attempts_passed;
-- DROP INDEX IF EXISTS idx_quiz_attempts_score;
-- DROP INDEX IF EXISTS idx_quiz_attempts_completed;
-- DROP INDEX IF EXISTS idx_quiz_attempts_attempt_number;
-- DROP INDEX IF EXISTS idx_quiz_attempts_quiz_id;
-- DROP INDEX IF EXISTS idx_quiz_attempts_enrollment_id;
-- DROP INDEX IF EXISTS idx_questions_active;
-- DROP INDEX IF EXISTS idx_questions_sort_order;
-- DROP INDEX IF EXISTS idx_questions_type;
-- DROP INDEX IF EXISTS idx_questions_quiz_id;
-- DROP INDEX IF EXISTS idx_quizzes_required;
-- DROP INDEX IF EXISTS idx_quizzes_published;
-- DROP INDEX IF EXISTS idx_quizzes_course_id;
-- DROP INDEX IF EXISTS idx_quizzes_lesson_id;
-- DROP TABLE IF EXISTS quiz_attempts;
-- DROP TABLE IF EXISTS questions;
-- DROP TABLE IF EXISTS quizzes; 