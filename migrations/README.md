# Database Migration System

This directory contains migration scripts for all databases in the Upskill platform.

## Database Structure

Our application uses two PostgreSQL databases:

1. **Auth Database** (Aurora PostgreSQL Serverless v2)
   - BetterAuth authentication tables
   - Connection via RDS Proxy: `AUTH_DB_URL`

2. **Course Database** (Aurora PostgreSQL Provisioned)
   - Course data with Kysely ORM
   - Connection via RDS Proxy: `COURSE_DB_URL`

## Migration Organization

```
migrations/
├── auth/                    # Auth database migrations (BetterAuth)
│   ├── 001_initial_auth_schema.sql
│   └── ...
├── course/                  # Course database migrations (Kysely)
│   ├── 001_initial_course_schema.sql
│   ├── 002_create_instructors.sql
│   ├── 003_create_categories.sql
│   └── ...
├── scripts/                 # Migration utility scripts
│   ├── migrate.js           # Main migration runner
│   ├── rollback.js          # Rollback utility
│   └── validate.js          # Schema validation
└── README.md               # This file
```

## Usage

### Run Migrations
```bash
# Run all pending migrations
npm run migrate

# Run migrations for specific database
npm run migrate:auth
npm run migrate:course

# Run specific migration
npm run migrate -- --file 001_initial_course_schema.sql
```

### Rollback Migrations
```bash
# Rollback last migration
npm run migrate:rollback

# Rollback to specific version
npm run migrate:rollback -- --to 002
```

### Create New Migration
```bash
# Create new migration file
npm run migrate:create -- --name "add_user_preferences"
```

## Migration File Format

Each migration file should:

1. Have a descriptive filename with version prefix: `001_description.sql`
2. Include both UP and DOWN sections
3. Be idempotent (safe to run multiple times)
4. Include clear comments

Example format:
```sql
-- Migration: 001_create_users_table.sql
-- Description: Create initial users table
-- Author: System
-- Created: 2024-01-01

-- UP: Apply migration
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- DOWN: Rollback migration (for use by rollback scripts)
-- DROP TABLE IF EXISTS users;
```

## Environment Variables

Required environment variables:
- `AUTH_DB_URL` - Auth database connection string
- `COURSE_DB_URL` - Course database connection string
- `MIGRATION_TABLE` - Table name for migration tracking (default: schema_migrations)

## Migration Tracking

The system uses a `schema_migrations` table in each database to track:
- Version number
- Migration filename
- Applied timestamp
- Rollback SQL (for automated rollbacks)
- Checksum (for integrity verification) 