-- Migration: 001_initial_auth_schema.sql
-- Description: Create initial BetterAuth authentication schema
-- Database: Auth (Aurora PostgreSQL Serverless v2)
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

-- Create users table for BetterAuth
CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create accounts table for OAuth/social providers
CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(provider_id, account_id)
);

-- Create sessions table for user sessions
CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMP NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create verification table for email verification, password resets, etc.
CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_account_user_id ON account(user_id);
CREATE INDEX IF NOT EXISTS idx_account_provider ON account(provider_id, account_id);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON session(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_expires_at ON verification(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);

-- Record this migration
INSERT INTO schema_migrations (version, filename, rollback_sql, checksum) 
VALUES (
    '001',
    '001_initial_auth_schema.sql',
    'DROP TABLE IF EXISTS verification; DROP TABLE IF EXISTS session; DROP TABLE IF EXISTS account; DROP TABLE IF EXISTS "user"; DROP TABLE IF EXISTS schema_migrations;',
    'auth_001_checksum'
) ON CONFLICT (version) DO NOTHING;

-- DOWN: Rollback migration (commented out for safety)
-- DROP INDEX IF EXISTS idx_user_email;
-- DROP INDEX IF EXISTS idx_verification_expires_at;
-- DROP INDEX IF EXISTS idx_verification_identifier;
-- DROP INDEX IF EXISTS idx_session_expires_at;
-- DROP INDEX IF EXISTS idx_session_token;
-- DROP INDEX IF EXISTS idx_session_user_id;
-- DROP INDEX IF EXISTS idx_account_provider;
-- DROP INDEX IF EXISTS idx_account_user_id;
-- DROP TABLE IF EXISTS verification;
-- DROP TABLE IF EXISTS session;
-- DROP TABLE IF EXISTS account;
-- DROP TABLE IF EXISTS "user";
-- DROP TABLE IF EXISTS schema_migrations; 