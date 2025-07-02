# CI/CD Workflows for Upskill Platform

This directory contains GitHub Actions workflows that automate the deployment and testing of the Upskill platform with AWS Amplify Gen 2 and database management.

## Workflow Overview

### 1. Database Migrations (`database-migrations.yml`)

**Purpose**: Manages database schema changes and migrations for both auth and course databases.

**Triggers**:
- Push to `main` or `develop` branches when database-related files change
- Manual trigger via `workflow_dispatch` for emergency operations

**Key Features**:
- **Multi-database Support**: Handles both auth (BetterAuth) and course data databases
- **Validation**: Validates migration syntax and performs dry-runs before applying changes
- **Safety Mechanisms**: Connection testing, rollback capabilities, post-migration validation
- **Integration**: Automatically triggers Amplify deployment after successful migrations

**Jobs**:
1. **validate-environment**: Validates migration scripts and dependencies
2. **test-connections**: Tests database connectivity with retry logic
3. **run-migrations**: Executes migrations with support for multiple actions (migrate/validate/rollback)
4. **trigger-amplify-deployment**: Deploys Amplify backend after successful migrations
5. **cleanup-and-notify**: Generates reports and handles notifications

**Manual Controls**:
- Target specific databases (auth/course/both)
- Choose action (migrate/validate/test-connection/rollback)
- Enable dry-run mode for testing

### 2. Amplify Deployment (`amplify-deployment.yml`)

**Purpose**: Deploys AWS Amplify Gen 2 backend and frontend infrastructure.

**Triggers**:
- Push to `main` or `develop` branches (excluding database-only changes)
- Manual trigger for controlled deployments

**Key Features**:
- **Migration Integration**: Waits for database migrations to complete before deploying
- **Environment Management**: Supports both sandbox and production deployments
- **Health Checks**: Validates deployment success and database connectivity
- **Test Integration**: Runs TypeScript checks, linting, and build tests

**Jobs**:
1. **pre-deployment-checks**: Validates migration status and determines deployment environment
2. **wait-for-migrations**: Waits for migration workflow if needed
3. **run-tests**: Executes code quality checks and build tests
4. **deploy-amplify**: Deploys Amplify backend infrastructure
5. **post-deployment-verification**: Performs health checks and generates deployment summary

**Smart Coordination**:
- Automatically detects if migrations are pending
- Can force deployment bypassing migration checks (emergency use)
- Supports different environments based on branch (main = production, others = sandbox)

### 3. Pull Request Validation (`pr-validation.yml`)

**Purpose**: Validates code changes and database migrations in pull requests without applying them.

**Triggers**:
- Pull request events (opened, synchronized, reopened, ready_for_review)
- Manual trigger for testing specific PRs

**Key Features**:
- **Safe Testing**: Runs all validations without making actual changes (dry-run mode)
- **Comprehensive Checks**: Code quality, TypeScript, migration syntax, security scanning
- **Change Detection**: Only tests relevant components when changes are detected
- **PR Comments**: Automatically posts validation summary to PR

**Jobs**:
1. **code-validation**: TypeScript checks, linting, security audit, build testing
2. **migration-testing**: Database migration validation with dry-run testing
3. **amplify-backend-testing**: Validates Amplify configuration changes
4. **integration-testing**: Tests database connectivity and application integration
5. **security-scanning**: Scans for vulnerabilities and potential secrets
6. **pr-summary**: Generates and posts comprehensive validation summary

**Benefits**:
- Catches issues early in the development process
- Provides confidence before merging changes
- Automated feedback reduces manual review overhead

## Workflow Interaction Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PR Created    │    │  Push to Main    │    │ Manual Trigger  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         v                        v                        v
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ PR Validation   │    │ Database         │    │ Any Workflow    │
│ (Dry Run)       │    │ Migrations       │    │ (Manual)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         │                        v
         │              ┌──────────────────┐
         │              │ Amplify          │
         │              │ Deployment       │
         │              └──────────────────┘
         │                        │
         v                        v
┌─────────────────┐    ┌──────────────────┐
│ PR Comments     │    │ Production       │
│ & Status        │    │ Deployment       │
└─────────────────┘    └──────────────────┘
```

## Database Migration Strategy

### Migration Files Organization
```
migrations/
├── auth/
│   └── 001_initial_auth_schema.sql
├── course/
│   ├── 001_initial_course_schema.sql
│   ├── 002_create_instructors.sql
│   ├── 003_create_categories.sql
│   └── ... (additional course migrations)
└── scripts/
    ├── migrate.js        # Main migration runner
    ├── test-db.js        # Database testing
    └── rollback.js       # Rollback functionality
```

### Migration Workflow Process

1. **Development**: 
   - Create migration files in appropriate database directories
   - Test locally using `npm run migrate:auth` or `npm run migrate:course`

2. **Pull Request**:
   - PR validation workflow tests migration syntax and dry-run
   - No actual database changes are made
   - Validation results posted as PR comments

3. **Merge to Main**:
   - Database migrations workflow triggered automatically
   - Migrations applied to production databases
   - Amplify deployment follows successful migrations

4. **Emergency Operations**:
   - Manual workflow dispatch allows targeted operations
   - Rollback capabilities for quick recovery
   - Force deployment options for emergency scenarios

## Environment Configuration

### Required GitHub Secrets

**AWS Configuration**:
- `AWS_ACCESS_KEY_ID`: AWS access key for infrastructure operations
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AMPLIFY_APP_ID`: Amplify application ID

**Database Connection Strings**:
- `AUTH_DB_URL`: Production auth database connection
- `COURSE_DB_URL`: Production course database connection
- `BETTER_AUTH_DATABASE_URL`: BetterAuth-specific connection string

**Optional Test Database URLs** (recommended for PR validation):
- `AUTH_DB_URL_TEST`: Separate auth database for testing
- `COURSE_DB_URL_TEST`: Separate course database for testing
- `BETTER_AUTH_DATABASE_URL_TEST`: Test instance for BetterAuth

### Environment-Specific Behavior

**Main Branch**:
- Triggers production deployment
- Uses production database connections
- Generates deployment artifacts with longer retention

**Develop Branch**:
- Triggers sandbox deployment
- Can use test databases if configured
- Shorter artifact retention periods

**Pull Requests**:
- Uses test databases when available
- Performs dry-run operations only
- Generates validation reports

## Security Considerations

### Database Security
- Connection strings stored as encrypted GitHub secrets
- Separate test databases isolate PR testing from production
- Migration validation prevents SQL injection and syntax errors

### Access Control
- AWS credentials limited to necessary permissions
- Different deployment environments based on branch protection
- Manual approval workflows can be added for production deployments

### Audit Trail
- All database changes logged with timestamps
- Migration history tracked in database tables
- Deployment artifacts stored for compliance and debugging

## Monitoring and Notifications

### Success Indicators
- ✅ All workflow jobs complete successfully
- ✅ Database connections validated
- ✅ Application builds and deploys correctly
- ✅ Post-deployment health checks pass

### Failure Handling
- ❌ Failed jobs stop subsequent workflow execution
- ❌ Database connectivity issues prevent deployment
- ❌ Migration failures trigger rollback procedures
- ❌ Security vulnerabilities block deployment

### Artifacts and Logs
- Migration validation results (30 days retention)
- Deployment summaries (90 days retention)
- Build outputs and logs (7 days retention)
- Security scan results (30 days retention)

## Troubleshooting Common Issues

### Migration Failures
1. Check migration syntax validation in PR workflow
2. Review connection-validator results for database accessibility
3. Examine migration dry-run logs for SQL errors
4. Use rollback workflow if migration partially completed

### Deployment Issues
1. Verify AWS credentials and permissions
2. Check Amplify configuration validation results
3. Review database connectivity post-deployment
4. Examine amplify_outputs.json for missing configurations

### PR Validation Problems
1. Ensure test database connections are configured
2. Check for TypeScript or linting errors
3. Review security audit results for vulnerabilities
4. Verify migration file syntax and placement

## Best Practices

### Development Workflow
1. Always create PRs for database changes
2. Test migrations locally before pushing
3. Use descriptive commit messages for workflow triggering
4. Monitor workflow execution and address failures promptly

### Migration Management
1. Use sequential numbering for migration files
2. Include both UP and DOWN sections for rollbacks
3. Test migrations against representative data sets
4. Document breaking changes in migration comments

### Deployment Safety
1. Use sandbox environment for testing major changes
2. Monitor post-deployment health checks
3. Keep rollback procedures readily available
4. Coordinate database and application deployments

This CI/CD system provides a robust, automated pipeline that ensures database schema changes and application deployments are safe, tested, and properly coordinated. 