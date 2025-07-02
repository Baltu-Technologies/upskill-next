-- Migration: 008_create_certificates_reviews_analytics.sql
-- Description: Create certificates, reviews, and analytics tables for course completion and feedback
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    certificate_number VARCHAR(255) NOT NULL UNIQUE,
    issued_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP, -- NULL for non-expiring certificates
    certificate_url VARCHAR(500), -- URL to the generated certificate
    verification_code VARCHAR(100) UNIQUE,
    metadata JSONB DEFAULT '{}', -- Additional certificate data
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(enrollment_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE, -- Verified purchase/completion
    instructor_response TEXT,
    instructor_response_at TIMESTAMP,
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(enrollment_id)
);

-- Create analytics table for course metrics
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL, -- e.g., 'enrollments', 'completions', 'avg_rating'
    metric_value DECIMAL(15,2) NOT NULL,
    metric_date DATE NOT NULL,
    additional_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, metric_name, metric_date)
);

-- Create indexes for certificates
CREATE INDEX IF NOT EXISTS idx_certificates_enrollment_id ON certificates(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_at ON certificates(issued_at);
CREATE INDEX IF NOT EXISTS idx_certificates_expires_at ON certificates(expires_at);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_enrollment_id ON reviews(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(is_verified);
CREATE INDEX IF NOT EXISTS idx_reviews_hidden ON reviews(is_hidden);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_course_id ON analytics(course_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_date ON analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_analytics_course_metric_date ON analytics(course_id, metric_name, metric_date);

-- Create triggers for updated_at
CREATE TRIGGER update_certificates_updated_at 
    BEFORE UPDATE ON certificates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.certificate_number IS NULL THEN
        NEW.certificate_number = 'CERT-' || 
                                 TO_CHAR(NOW(), 'YYYY') || '-' ||
                                 LPAD(NEW.id::TEXT, 8, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.verification_code IS NULL THEN
        NEW.verification_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for certificate generation
CREATE TRIGGER generate_certificate_number_trigger 
    BEFORE INSERT ON certificates 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_certificate_number();

CREATE TRIGGER generate_verification_code_trigger 
    BEFORE INSERT ON certificates 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_verification_code();

-- Create function to update course analytics when reviews are added/updated
CREATE OR REPLACE FUNCTION update_course_rating_analytics()
RETURNS TRIGGER AS $$
DECLARE
    course_id_val INTEGER;
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Get course_id from enrollment
    SELECT c.id INTO course_id_val
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.id = COALESCE(NEW.enrollment_id, OLD.enrollment_id);
    
    -- Calculate new average rating and count
    SELECT 
        ROUND(AVG(rating)::NUMERIC, 2),
        COUNT(*)
    INTO avg_rating, review_count
    FROM reviews r
    JOIN enrollments e ON r.enrollment_id = e.id
    WHERE e.course_id = course_id_val
    AND r.is_hidden = FALSE;
    
    -- Update or insert analytics record for today
    INSERT INTO analytics (course_id, metric_name, metric_value, metric_date, additional_data)
    VALUES (
        course_id_val,
        'avg_rating',
        avg_rating,
        CURRENT_DATE,
        jsonb_build_object('review_count', review_count)
    )
    ON CONFLICT (course_id, metric_name, metric_date)
    DO UPDATE SET
        metric_value = EXCLUDED.metric_value,
        additional_data = EXCLUDED.additional_data;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update course rating analytics
CREATE TRIGGER update_course_rating_analytics_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_course_rating_analytics();

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '008',
    '008_create_certificates_reviews_analytics.sql',
    'DROP TRIGGER IF EXISTS update_course_rating_analytics_trigger ON reviews; DROP FUNCTION IF EXISTS update_course_rating_analytics(); DROP TRIGGER IF EXISTS generate_verification_code_trigger ON certificates; DROP TRIGGER IF EXISTS generate_certificate_number_trigger ON certificates; DROP FUNCTION IF EXISTS generate_verification_code(); DROP FUNCTION IF EXISTS generate_certificate_number(); DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews; DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates; DROP INDEX IF EXISTS idx_analytics_course_metric_date; DROP INDEX IF EXISTS idx_analytics_metric_date; DROP INDEX IF EXISTS idx_analytics_metric_name; DROP INDEX IF EXISTS idx_analytics_course_id; DROP INDEX IF EXISTS idx_reviews_created_at; DROP INDEX IF EXISTS idx_reviews_hidden; DROP INDEX IF EXISTS idx_reviews_verified; DROP INDEX IF EXISTS idx_reviews_featured; DROP INDEX IF EXISTS idx_reviews_rating; DROP INDEX IF EXISTS idx_reviews_enrollment_id; DROP INDEX IF EXISTS idx_certificates_expires_at; DROP INDEX IF EXISTS idx_certificates_issued_at; DROP INDEX IF EXISTS idx_certificates_verification_code; DROP INDEX IF EXISTS idx_certificates_number; DROP INDEX IF EXISTS idx_certificates_enrollment_id; DROP TABLE IF EXISTS analytics; DROP TABLE IF EXISTS reviews; DROP TABLE IF EXISTS certificates;',
    'course_008_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS update_course_rating_analytics_trigger ON reviews;
-- DROP FUNCTION IF EXISTS update_course_rating_analytics();
-- DROP TRIGGER IF EXISTS generate_verification_code_trigger ON certificates;
-- DROP TRIGGER IF EXISTS generate_certificate_number_trigger ON certificates;
-- DROP FUNCTION IF EXISTS generate_verification_code();
-- DROP FUNCTION IF EXISTS generate_certificate_number();
-- DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
-- DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;
-- DROP INDEX IF EXISTS idx_analytics_course_metric_date;
-- DROP INDEX IF EXISTS idx_analytics_metric_date;
-- DROP INDEX IF EXISTS idx_analytics_metric_name;
-- DROP INDEX IF EXISTS idx_analytics_course_id;
-- DROP INDEX IF EXISTS idx_reviews_created_at;
-- DROP INDEX IF EXISTS idx_reviews_hidden;
-- DROP INDEX IF EXISTS idx_reviews_verified;
-- DROP INDEX IF EXISTS idx_reviews_featured;
-- DROP INDEX IF EXISTS idx_reviews_rating;
-- DROP INDEX IF EXISTS idx_reviews_enrollment_id;
-- DROP INDEX IF EXISTS idx_certificates_expires_at;
-- DROP INDEX IF EXISTS idx_certificates_issued_at;
-- DROP INDEX IF EXISTS idx_certificates_verification_code;
-- DROP INDEX IF EXISTS idx_certificates_number;
-- DROP INDEX IF EXISTS idx_certificates_enrollment_id;
-- DROP TABLE IF EXISTS analytics;
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS certificates; 