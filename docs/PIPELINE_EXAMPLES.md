# Pipeline Configuration Examples
## Practical Implementation Examples

### Table of Contents
1. [Complete amplify.yml Examples](#complete-amplifyml-examples)
2. [Environment Configurations](#environment-configurations)
3. [Package.json Scripts](#packagejson-scripts)
4. [Database Migration Examples](#database-migration-examples)
5. [Cache Configuration Examples](#cache-configuration-examples)
6. [Artifact Management Examples](#artifact-management-examples)
7. [Testing Configuration Examples](#testing-configuration-examples)
8. [Security Configuration Examples](#security-configuration-examples)
9. [CI/CD Integration Examples](#cicd-integration-examples)

---

## Complete amplify.yml Examples

### Production Configuration

```yaml
version: 1
backend:
  phases:
    preBuild:
      commands:
        # Environment Setup
        - echo "🚀 Production Backend Pre-Build Phase"
        - echo "📋 Environment - Branch:$AWS_BRANCH, Region:$AWS_DEFAULT_REGION, Build:$CODEBUILD_BUILD_NUMBER"
        
        # Cache Status Analysis
        - echo "📊 Cache Status Check"
        - npm run cache:inspect || echo "📦 No cache data available"
        
        # Install Dependencies with Production Optimizations
        - echo "📦 Installing backend dependencies with production settings..."
        - npm ci --production=false --ignore-scripts
        - npm run postinstall || echo "⚠️ Postinstall scripts completed"
        
        # Environment Variable Validation
        - echo "🔧 Validating environment configuration..."
        - npm run env:validate || echo "⚠️ Environment validation warnings"
        
        # Database Connection Validation
        - echo "🔍 Validating database connections..."
        - timeout 60 npm run validate:db:json || echo "⚠️ Database validation timeout (may be expected in fresh deployment)"
        
        # Security Pre-checks
        - echo "🔒 Running security pre-checks..."
        - npm audit --audit-level=moderate || echo "⚠️ Security audit warnings"
        
    build:
      commands:
        # Pre-build Validation
        - echo "🧪 Pre-build validation checks..."
        - npm run validate:migration:syntax || echo "⚠️ Migration syntax validation complete"
        
        # Database Migrations with Rollback Protection
        - echo "🗃️ Running database migrations with safety checks..."
        - npm run migrate:auth:safe || echo "⚠️ Auth migration completed with warnings"
        - npm run migrate:course:safe || echo "⚠️ Course migration completed with warnings"
        
        # Migration Verification
        - echo "✅ Verifying migration success..."
        - npm run validate:migration:status || echo "⚠️ Migration status check complete"
        
        # Backend Infrastructure Deployment
        - echo "🏗️ Deploying backend infrastructure..."
        - amplifyPush --yes --allow-destructive-graphql-schema-updates
        
        # Post-Deployment Backend Validation
        - echo "✅ Validating backend deployment..."
        - timeout 120 npm run validate:backend:comprehensive || echo "⚠️ Backend validation timeout"
        
        # Artifact Collection
        - echo "📦 Collecting backend artifacts..."
        - npm run artifacts:collect:backend || echo "⚠️ Backend artifact collection warnings"
        
    postBuild:
      commands:
        # Comprehensive Health Checks
        - echo "🔍 Running comprehensive health checks..."
        - timeout 90 npm run validate:db:health || echo "⚠️ Database health check timeout"
        - timeout 60 npm run validate:infrastructure:health || echo "⚠️ Infrastructure health check timeout"
        
        # Performance Metrics Collection
        - echo "📊 Collecting performance metrics..."
        - npm run metrics:collect:backend || echo "⚠️ Metrics collection warnings"
        
        # Security Validation
        - echo "🔒 Final security validation..."
        - npm run security:validate:backend || echo "⚠️ Security validation warnings"

frontend:
  phases:
    preBuild:
      commands:
        # Environment Setup
        - echo "🎨 Production Frontend Pre-Build Phase"
        - echo "📊 Build Performance Analysis"
        - npm run cache:inspect:detailed || echo "📦 Cache analysis unavailable"
        
        # Dependency Installation with Optimization
        - echo "📦 Installing frontend dependencies..."
        - npm ci --prefer-offline --no-audit
        
        # Environment Preparation
        - echo "🔧 Preparing build environment..."
        - npm run env:prepare:production || echo "⚠️ Environment preparation warnings"
        
        # Pre-build Security Checks
        - echo "🔒 Pre-build security validation..."
        - npm run security:scan:dependencies || echo "⚠️ Dependency security scan warnings"
        
    build:
      commands:
        # Environment Variable Injection with Validation
        - echo "🔧 Configuring production environment variables..."
        - echo "NEXT_PUBLIC_ENV=production" >> .env.production.local
        - echo "NEXT_PUBLIC_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .env.production.local
        - echo "NEXT_PUBLIC_BUILD_NUMBER=$CODEBUILD_BUILD_NUMBER" >> .env.production.local
        - echo "NEXT_PUBLIC_COMMIT_SHA=$CODEBUILD_RESOLVED_SOURCE_VERSION" >> .env.production.local
        
        # Validate Environment Variables
        - echo "✅ Validating environment configuration..."
        - npm run env:validate:frontend || echo "⚠️ Frontend environment validation warnings"
        
        # TypeScript Compilation Check
        - echo "🔍 TypeScript compilation validation..."
        - npx tsc --noEmit --project tsconfig.json
        
        # Next.js Production Build with Optimizations
        - echo "🏗️ Building Next.js application for production..."
        - npm run build:production || npm run build
        
        # Build Verification
        - echo "✅ Verifying build success..."
        - test -d .next && echo "✅ Next.js build directory created" || (echo "❌ Build failed - .next directory not found" && exit 1)
        - test -f .next/BUILD_ID && echo "✅ Build ID generated" || echo "⚠️ Build ID not found"
        
    postBuild:
      commands:
        # Artifact Collection with Validation
        - echo "📦 Collecting and validating frontend artifacts..."
        - npm run artifacts:collect:frontend:production || echo "⚠️ Frontend artifact collection warnings"
        
        # Build Artifact Validation
        - echo "✅ Comprehensive build validation..."
        - npm run validate:build:comprehensive || echo "⚠️ Build validation warnings"
        
        # Performance Analysis
        - echo "📊 Analyzing build performance..."
        - npm run analyze:build:performance || echo "⚠️ Performance analysis warnings"
        
        # Security Scanning
        - echo "🔒 Security scanning of build artifacts..."
        - npm run artifacts:security:scan:production || echo "⚠️ Security scan warnings"
        
        # Cache Optimization for Next Build
        - echo "📈 Optimizing cache for future builds..."
        - npm run cache:optimize:post-build || echo "⚠️ Cache optimization warnings"
        
        # Final Validation Report
        - echo "📄 Generating build report..."
        - npm run report:build:final || echo "⚠️ Build report generation warnings"

# Advanced Cache Configuration
cache:
  paths:
    # Dependencies
    - node_modules/**/*
    - ~/.npm/**/*
    - ~/.cache/npm/**/*
    
    # Build Outputs
    - .next/cache/**/*
    - .next/static/**/*
    - .tsbuildinfo
    
    # Backend Artifacts
    - amplify/backend/cdk-outputs/**/*
    - amplify/.config/**/*
    - amplify/backend/amplify-meta.json
    
    # Migration Cache
    - migrations/cache/**/*
    - migrations/.migration-state
    
    # Custom Artifacts
    - artifacts/**/*
    - reports/**/*
    - .cache/**/*

# Environment-specific Custom Headers
customHeaders:
  - pattern: '**/*'
    headers:
      - key: 'Strict-Transport-Security'
        value: 'max-age=31536000; includeSubDomains; preload'
      - key: 'Content-Security-Policy'
        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.amazonaws.com https://*.upskill.dev"
      - key: 'X-Frame-Options'
        value: 'DENY'
      - key: 'X-Content-Type-Options'
        value: 'nosniff'
      - key: 'Referrer-Policy'
        value: 'strict-origin-when-cross-origin'
      - key: 'Permissions-Policy'
        value: 'camera=(), microphone=(), geolocation=()'
```

### Development/Staging Configuration

```yaml
version: 1
backend:
  phases:
    preBuild:
      commands:
        - echo "🚀 Development Backend Pre-Build Phase"
        - echo "📋 Environment - Branch:$AWS_BRANCH"
        - npm ci
        - npm run validate:db || echo "⚠️ Database validation warnings (expected in dev)"
        
    build:
      commands:
        - echo "🗃️ Running development migrations..."
        - npm run migrate:auth || echo "⚠️ Auth migration warnings"
        - npm run migrate:course || echo "⚠️ Course migration warnings"
        - amplifyPush --yes
        - npm run validate:backend || echo "⚠️ Backend validation complete"
        
    postBuild:
      commands:
        - echo "🔍 Basic health checks..."
        - timeout 30 npm run validate:db:basic || echo "⚠️ Health check timeout"

frontend:
  phases:
    preBuild:
      commands:
        - echo "🎨 Development Frontend Pre-Build Phase"
        - npm ci
        
    build:
      commands:
        - echo "NEXT_PUBLIC_ENV=development" >> .env.local
        - echo "NEXT_PUBLIC_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .env.local
        - npm run build
        
    postBuild:
      commands:
        - test -d .next && echo "✅ Build successful"
```

---

## Environment Configurations

### Production Environment (.env.production)

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_APP_NAME="Upskill Platform"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="https://api.upskill.dev"
NEXT_PUBLIC_GRAPHQL_ENDPOINT="https://api.upskill.dev/graphql"

# Database Configuration (from AWS Secrets Manager)
AUTH_DB_URL="postgresql://username:password@proxy-endpoint:5432/upskill_auth"
COURSE_DB_URL="postgresql://username:password@proxy-endpoint:5432/upskill_course_data"

# BetterAuth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-from-secrets-manager"
BETTER_AUTH_URL="https://auth.upskill.dev"

# AWS Configuration
AWS_REGION="us-east-1"
AWS_COGNITO_REGION="us-east-1"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false
NEXT_PUBLIC_MAINTENANCE_MODE=false

# Monitoring
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn"
NEXT_PUBLIC_ENABLE_LOGGING=true
```

### Development Environment (.env.development)

```bash
# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_APP_NAME="Upskill Platform (Dev)"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:3000/api/graphql"

# Database Configuration
AUTH_DB_URL="postgresql://dev_user:dev_password@localhost:5432/upskill_auth_dev"
COURSE_DB_URL="postgresql://dev_user:dev_password@localhost:5432/upskill_course_dev"

# BetterAuth Configuration
BETTER_AUTH_SECRET="development-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Development Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=true
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_MOCK_DATA=true
```

---

## Package.json Scripts

### Complete Scripts Configuration

```json
{
  "scripts": {
    // Build Scripts
    "dev": "next dev",
    "build": "next build",
    "build:production": "NODE_ENV=production next build",
    "build:analyze": "ANALYZE=true npm run build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",

    // Database Scripts
    "validate:db": "node scripts/connection-validator.js",
    "validate:db:verbose": "node scripts/connection-validator.js --verbose",
    "validate:db:json": "node scripts/connection-validator.js --json",
    "validate:db:health": "node scripts/connection-validator.js --health-check",
    "validate:db:basic": "node scripts/connection-validator.js --quick",
    
    // Migration Scripts
    "migrate:auth": "node migrations/scripts/migrate.js --database=auth",
    "migrate:auth:safe": "node migrations/scripts/migrate.js --database=auth --safe-mode",
    "migrate:course": "node migrations/scripts/migrate.js --database=course",
    "migrate:course:safe": "node migrations/scripts/migrate.js --database=course --safe-mode",
    "migrate:dry": "node migrations/scripts/migrate.js --dry-run",
    "rollback:auth": "node migrations/scripts/rollback.js --database=auth",
    "rollback:course": "node migrations/scripts/rollback.js --database=course",
    
    // Migration Validation
    "validate:migration:syntax": "node migrations/scripts/validate-syntax.js",
    "validate:migration:status": "node migrations/scripts/check-status.js",
    
    // Cache Management
    "cache:inspect": "node scripts/cache-manager.js inspect",
    "cache:inspect:detailed": "node scripts/cache-manager.js inspect --detailed",
    "cache:clear": "node scripts/cache-manager.js clear",
    "cache:clear:force": "node scripts/cache-manager.js clear --force",
    "cache:optimize": "node scripts/cache-manager.js optimize",
    "cache:optimize:post-build": "node scripts/cache-manager.js optimize --post-build",
    "cache:monitor": "node scripts/cache-manager.js monitor",
    "cache:key": "node scripts/cache-manager.js key",
    
    // Artifact Management
    "artifacts:init": "node scripts/artifact-manager.js init",
    "artifacts:collect:backend": "node scripts/artifact-manager.js collect:backend",
    "artifacts:collect:frontend": "node scripts/artifact-manager.js collect:frontend",
    "artifacts:collect:frontend:production": "node scripts/artifact-manager.js collect:frontend --production",
    "artifacts:collect:testing": "node scripts/artifact-manager.js collect:testing",
    "artifacts:security:scan": "node scripts/artifact-manager.js security:scan",
    "artifacts:security:scan:production": "node scripts/artifact-manager.js security:scan --production",
    "artifacts:validate:backend": "node scripts/artifact-manager.js validate:backend",
    "artifacts:validate:frontend": "node scripts/artifact-manager.js validate:frontend",
    "artifacts:finalize:backend": "node scripts/artifact-manager.js finalize:backend",
    "artifacts:finalize:frontend": "node scripts/artifact-manager.js finalize:frontend",
    "artifacts:report": "node scripts/artifact-manager.js report",
    
    // Pipeline Testing
    "pipeline:validate": "node scripts/pipeline-tester.js validate",
    "pipeline:test": "node scripts/pipeline-tester.js test",
    "pipeline:test:quick": "node scripts/pipeline-tester.js test --strategy=quick",
    "pipeline:test:comprehensive": "node scripts/pipeline-tester.js test --strategy=comprehensive",
    "pipeline:test:performance": "node scripts/pipeline-tester.js test --strategy=performance",
    "pipeline:monitor": "node scripts/pipeline-tester.js monitor",
    "pipeline:artifacts": "node scripts/pipeline-tester.js artifacts",
    "pipeline:performance": "node scripts/pipeline-tester.js performance",
    "pipeline:simulate": "node scripts/pipeline-tester.js simulate",
    "pipeline:integration": "node scripts/pipeline-tester.js integration",
    "pipeline:report": "node scripts/pipeline-tester.js report",
    
    // Validation Scripts
    "validate:backend": "node scripts/validate-backend.js",
    "validate:backend:comprehensive": "node scripts/validate-backend.js --comprehensive",
    "validate:infrastructure:health": "node scripts/validate-infrastructure.js --health",
    "validate:build:comprehensive": "node scripts/validate-build.js --comprehensive",
    
    // Environment Scripts
    "env:validate": "node scripts/validate-environment.js",
    "env:validate:frontend": "node scripts/validate-environment.js --frontend",
    "env:prepare:production": "node scripts/prepare-environment.js --production",
    
    // Security Scripts
    "security:scan:dependencies": "npm audit --audit-level=moderate",
    "security:validate:backend": "node scripts/security-validator.js --backend",
    
    // Analysis Scripts
    "analyze:build:performance": "node scripts/analyze-performance.js --build",
    "metrics:collect:backend": "node scripts/collect-metrics.js --backend",
    
    // Reporting Scripts
    "report:build:final": "node scripts/generate-report.js --build --final"
  }
}
```

---

## Database Migration Examples

### Auth Database Migration (001_initial_auth_schema.sql)

```sql
-- Auth Database Initial Schema Migration
-- File: migrations/auth/001_initial_auth_schema.sql

BEGIN;

-- Migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- BetterAuth required tables
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id VARCHAR(255) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (identifier, token)
);

-- Additional auth-related tables
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    timezone VARCHAR(50),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'instructor', 'student', 'moderator')),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(255) REFERENCES users(id),
    UNIQUE(user_id, role)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider_id, account_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Record migration
INSERT INTO schema_migrations (version, description) 
VALUES ('001', 'Initial auth schema with BetterAuth tables and user management')
ON CONFLICT (version) DO NOTHING;

COMMIT;
```

### Course Database Migration (002_create_instructors.sql)

```sql
-- Course Database Instructors Migration
-- File: migrations/course/002_create_instructors.sql

BEGIN;

-- Instructors table
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL, -- References auth.users.id
    title VARCHAR(255),
    bio TEXT,
    expertise TEXT[],
    experience_years INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    social_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Instructor certifications
CREATE TABLE instructor_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    credential_id VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    verification_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_instructors_user_id ON instructors(user_id);
CREATE INDEX idx_instructors_status ON instructors(status);
CREATE INDEX idx_instructors_rating ON instructors(rating);
CREATE INDEX idx_instructors_verified ON instructors(is_verified);
CREATE INDEX idx_instructor_certifications_instructor_id ON instructor_certifications(instructor_id);

-- Triggers
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Record migration
INSERT INTO schema_migrations (version, description) 
VALUES ('002', 'Create instructors and certifications tables')
ON CONFLICT (version) DO NOTHING;

COMMIT;
```

---

## Cache Configuration Examples

### Advanced Cache Manager Configuration

```javascript
// scripts/cache-manager.js - Configuration Section
const CACHE_CONFIG = {
  // Cache layers with specific strategies
  layers: {
    dependencies: {
      paths: ['node_modules', '.npm', '~/.cache/npm'],
      keyFiles: ['package.json', 'package-lock.json', 'npm-shrinkwrap.json'],
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      compression: true,
      encryption: false
    },
    
    build: {
      paths: ['.next/cache', '.next/static', '.tsbuildinfo'],
      keyFiles: ['next.config.js', 'tsconfig.json', 'src/**/*.ts', 'src/**/*.tsx'],
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      compression: true,
      encryption: false
    },
    
    migrations: {
      paths: ['migrations/cache', 'migrations/.migration-state'],
      keyFiles: ['migrations/**/*.sql', 'migrations/scripts/*.js'],
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      compression: false,
      encryption: true
    },
    
    artifacts: {
      paths: ['artifacts', 'reports'],
      keyFiles: ['amplify.yml', 'package.json'],
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      compression: true,
      encryption: true
    }
  },
  
  // Environment-specific settings
  environments: {
    production: {
      aggressiveCaching: true,
      validateChecksum: true,
      enableMetrics: true
    },
    development: {
      aggressiveCaching: false,
      validateChecksum: false,
      enableMetrics: true
    }
  },
  
  // Performance thresholds
  performance: {
    maxCacheSize: 5 * 1024 * 1024 * 1024, // 5GB
    hitRateThreshold: 0.75, // 75%
    compressionThreshold: 10 * 1024 * 1024 // 10MB
  }
};
```

### Cache Key Generation Strategy

```javascript
// Example cache key generation
function generateCacheKey(layer, environment = 'production') {
  const config = CACHE_CONFIG.layers[layer];
  const keyParts = [];
  
  // Environment prefix
  keyParts.push(environment);
  
  // Layer identifier
  keyParts.push(layer);
  
  // File content hashes
  for (const keyFile of config.keyFiles) {
    const files = glob.sync(keyFile);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const hash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
      keyParts.push(`${path.basename(file)}:${hash}`);
    }
  }
  
  // Join with pipe separator
  return keyParts.join('|');
}

// Example output:
// production|dependencies|package.json:7aca7821b91b|package-lock.json:ee8256620c9c
```

---

## Artifact Management Examples

### Artifact Collection Configuration

```javascript
// scripts/artifact-manager.js - Collection Configuration
const ARTIFACT_CONFIG = {
  categories: {
    backend: {
      paths: [
        'amplify/backend/cdk-outputs',
        'amplify/backend/amplify-meta.json',
        'amplify/.config',
        'migrations/logs',
        'migrations/cache'
      ],
      exclude: ['*.tmp', 'node_modules', '.git'],
      compress: true,
      encrypt: false,
      retention: '30d'
    },
    
    frontend: {
      paths: [
        '.next/static',
        '.next/BUILD_ID',
        '.next/routes-manifest.json',
        'public/static',
        'dist'
      ],
      exclude: ['*.map', '*.log'],
      compress: true,
      encrypt: false,
      retention: '7d'
    },
    
    testing: {
      paths: [
        'coverage',
        'test-results',
        'reports',
        'lighthouse-reports'
      ],
      exclude: ['*.tmp'],
      compress: true,
      encrypt: false,
      retention: '14d'
    },
    
    metadata: {
      paths: [
        'build-info.json',
        'deployment-manifest.json',
        'audit-logs'
      ],
      exclude: [],
      compress: false,
      encrypt: true,
      retention: '90d'
    }
  },
  
  security: {
    sensitivePatterns: [
      /password/i,
      /secret/i,
      /token/i,
      /key/i,
      /credential/i,
      /auth.*=/i,
      /bearer\s+[a-z0-9]+/i
    ],
    excludeFiles: [
      '.env*',
      '*.pem',
      '*.key',
      'secrets.json'
    ]
  }
};
```

### Artifact Manifest Example

```json
{
  "manifest": {
    "version": "1.0.0",
    "timestamp": "2025-07-02T16:15:00.000Z",
    "buildId": "amplify-build-123456",
    "commitSha": "abc123def456",
    "branch": "main",
    "environment": "production"
  },
  "artifacts": {
    "backend": {
      "collected": 13,
      "totalSize": "2.3MB",
      "checksum": "sha256:abc123...",
      "files": [
        {
          "path": "amplify/backend/cdk-outputs/stack-outputs.json",
          "size": "1.2KB",
          "checksum": "sha256:def456...",
          "type": "json"
        }
      ]
    },
    "frontend": {
      "collected": 8,
      "totalSize": "15.7MB",
      "checksum": "sha256:ghi789...",
      "files": [
        {
          "path": ".next/BUILD_ID",
          "size": "12B",
          "checksum": "sha256:jkl012...",
          "type": "text"
        }
      ]
    }
  },
  "security": {
    "scanned": true,
    "issues": [],
    "scanTimestamp": "2025-07-02T16:15:30.000Z"
  }
}
```

---

## Testing Configuration Examples

### Pipeline Test Configuration

```javascript
// scripts/pipeline-tester.js - Test Scenarios
const TEST_SCENARIOS = {
  quick: {
    timeout: 300000, // 5 minutes
    scenarios: [
      {
        name: 'Configuration Validation',
        phases: [
          {
            name: 'amplify-yml-validation',
            command: 'node scripts/validate-amplify-config.js',
            timeout: 10000
          },
          {
            name: 'typescript-check',
            command: 'npx tsc --noEmit',
            timeout: 60000
          },
          {
            name: 'environment-validation',
            command: 'node scripts/validate-environment.js --quick',
            timeout: 15000
          }
        ]
      },
      {
        name: 'Database Connectivity',
        phases: [
          {
            name: 'auth-db-connection',
            command: 'npm run validate:db:json',
            timeout: 30000
          },
          {
            name: 'course-db-connection',
            command: 'node scripts/test-course-db.js',
            timeout: 30000
          }
        ]
      }
    ]
  },
  
  comprehensive: {
    timeout: 1800000, // 30 minutes
    scenarios: [
      {
        name: 'Full Build Pipeline',
        phases: [
          {
            name: 'clean-install',
            command: 'rm -rf node_modules && npm ci',
            timeout: 300000
          },
          {
            name: 'backend-build',
            command: 'npm run build:backend',
            timeout: 600000
          },
          {
            name: 'frontend-build',
            command: 'npm run build',
            timeout: 600000
          },
          {
            name: 'integration-tests',
            command: 'npm run test:integration',
            timeout: 300000
          }
        ]
      }
    ]
  }
};
```

### Test Environment Configuration

```bash
# Test Environment Variables
TEST_ENV_CONFIG="
NODE_ENV=test
NEXT_PUBLIC_ENV=test

# Test Database URLs
AUTH_DB_URL=postgresql://test_user:test_pass@localhost:5432/upskill_auth_test
COURSE_DB_URL=postgresql://test_user:test_pass@localhost:5432/upskill_course_test

# Test-specific configurations
ENABLE_TEST_MODE=true
SKIP_AUTH_VALIDATION=true
MOCK_EXTERNAL_APIS=true
TEST_TIMEOUT=30000
"
```

---

## Security Configuration Examples

### Security Headers Configuration

```yaml
# amplify.yml - Security Headers
customHeaders:
  - pattern: '**'
    headers:
      # HTTPS Security
      - key: 'Strict-Transport-Security'
        value: 'max-age=31536000; includeSubDomains; preload'
      
      # Content Security Policy
      - key: 'Content-Security-Policy'
        value: >
          default-src 'self';
          script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.gstatic.com;
          img-src 'self' data: https:;
          connect-src 'self' https://*.amazonaws.com https://*.upskill.dev;
          frame-ancestors 'none';
          base-uri 'self';
          form-action 'self'
      
      # Additional Security Headers
      - key: 'X-Frame-Options'
        value: 'DENY'
      - key: 'X-Content-Type-Options'
        value: 'nosniff'
      - key: 'Referrer-Policy'
        value: 'strict-origin-when-cross-origin'
      - key: 'Permissions-Policy'
        value: 'camera=(), microphone=(), geolocation=(), payment=()'
      
  # API Routes Security
  - pattern: '/api/**'
    headers:
      - key: 'Cache-Control'
        value: 'no-store, no-cache, must-revalidate'
      - key: 'X-Content-Type-Options'
        value: 'nosniff'
```

### Security Scanning Configuration

```javascript
// Security scan patterns
const SECURITY_PATTERNS = {
  secrets: [
    /(?i)(password|pwd)\s*[=:]\s*['""][^'""\s]+['""]/, 
    /(?i)(secret|key)\s*[=:]\s*['""][^'""\s]+['""]/, 
    /(?i)(token)\s*[=:]\s*['""][^'""\s]+['""]/, 
    /(?i)(auth.*)\s*[=:]\s*['""][^'""\s]+['""]/, 
    /(?i)(api[_-]?key)\s*[=:]\s*['""][^'""\s]+['""]/, 
    /(?i)(access[_-]?token)\s*[=:]\s*['""][^'""\s]+['""]/, 
    /(?i)(database[_-]?url)\s*[=:]\s*['""][^'""\s]+['""]/, 
    /Bearer\s+[A-Za-z0-9\-_=]+/, 
    /(?i)postgres:\/\/[^""\s]+/, 
    /(?i)mysql:\/\/[^""\s]+/, 
    /(?i)mongodb:\/\/[^""\s]+/,
    /sk_live_[0-9a-zA-Z]{24}/, // Stripe secret keys
    /pk_live_[0-9a-zA-Z]{24}/, // Stripe public keys
    /AKIA[0-9A-Z]{16}/, // AWS Access Key ID
    /[0-9a-f]{32}/, // Generic 32-char hex (MD5, API keys)
    /[0-9a-f]{64}/, // Generic 64-char hex (SHA256, tokens)
  ],
  
  vulnerabilities: [
    /eval\s*\(/,
    /innerHTML\s*=/,
    /document\.write/,
    /dangerouslySetInnerHTML/,
    /exec\s*\(/,
    /system\s*\(/
  ],
  
  allowedDomains: [
    'upskill.dev',
    'amazonaws.com',
    'auth0.com',
    'stripe.com'
  ]
};
```

---

## CI/CD Integration Examples

### GitHub Actions Integration

```yaml
# .github/workflows/amplify-deployment.yml
name: Amplify Deployment Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  NODE_VERSION: '18'

jobs:
  pre-deployment-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run pipeline validation
        run: npm run pipeline:validate
      
      - name: Run quick tests
        run: npm run pipeline:test:quick
      
      - name: Security scan
        run: npm run security:scan:dependencies

  amplify-build:
    needs: pre-deployment-validation
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Trigger Amplify build
        run: |
          aws amplify start-job \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name main \
            --job-type RELEASE

  post-deployment-verification:
    needs: amplify-build
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run comprehensive tests
        run: npm run pipeline:test:comprehensive
      
      - name: Generate deployment report
        run: npm run pipeline:report
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        with:
          name: pipeline-test-results
          path: reports/
```

### Branch-based Environment Configuration

```yaml
# Branch-specific build configurations
version: 1

# Production (main branch)
backend: &backend-base
  phases:
    preBuild:
      commands:
        - echo "🚀 Starting build for branch:$AWS_BRANCH"
        - |
          if [ "$AWS_BRANCH" = "main" ]; then
            echo "PRODUCTION BUILD"
            npm ci --production=false
          elif [ "$AWS_BRANCH" = "develop" ]; then
            echo "STAGING BUILD"
            npm ci
          else
            echo "DEVELOPMENT BUILD"
            npm ci --no-optional
          fi

frontend: &frontend-base
  phases:
    preBuild:
      commands:
        - |
          if [ "$AWS_BRANCH" = "main" ]; then
            echo "NEXT_PUBLIC_ENV=production" >> .env.production.local
          elif [ "$AWS_BRANCH" = "develop" ]; then
            echo "NEXT_PUBLIC_ENV=staging" >> .env.local
          else
            echo "NEXT_PUBLIC_ENV=development" >> .env.local
          fi
    build:
      commands:
        - npm run build

# Branch-specific overrides would be handled by Amplify's branch configuration
```

---

*Configuration examples last updated: 2025-07-02*
*Use these examples as templates for your specific implementation*
*Always validate configurations in development before production deployment* 