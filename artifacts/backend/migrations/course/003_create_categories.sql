-- Migration: 003_create_categories.sql
-- Description: Create categories table for course organization
-- Database: Course (Aurora PostgreSQL Provisioned)
-- Author: System
-- Created: 2024-12-19

-- UP: Apply migration

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100), -- Icon identifier (e.g., 'code', 'design', 'business')
    color VARCHAR(7), -- Hex color code
    parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Create trigger for updated_at using existing function
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '003',
    '003_create_categories.sql',
    'DROP TRIGGER IF EXISTS update_categories_updated_at ON categories; DROP INDEX IF EXISTS idx_categories_sort_order; DROP INDEX IF EXISTS idx_categories_active; DROP INDEX IF EXISTS idx_categories_parent_id; DROP INDEX IF EXISTS idx_categories_slug; DROP TABLE IF EXISTS categories;',
    'course_003_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
-- DROP INDEX IF EXISTS idx_categories_sort_order;
-- DROP INDEX IF EXISTS idx_categories_active;
-- DROP INDEX IF EXISTS idx_categories_parent_id;
-- DROP INDEX IF EXISTS idx_categories_slug;
-- DROP TABLE IF EXISTS categories; 