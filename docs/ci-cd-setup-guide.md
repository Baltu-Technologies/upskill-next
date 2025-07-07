# CI/CD Pipeline Setup Guide

This guide provides step-by-step instructions for setting up the complete CI/CD pipeline for the multi-tenant employer portal using GitHub Actions and AWS Amplify Gen 2.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Repository Setup](#github-repository-setup)
3. [AWS Amplify Configuration](#aws-amplify-configuration)
4. [GitHub Actions Secrets](#github-actions-secrets)
5. [Environment Configuration](#environment-configuration)
6. [Testing Setup](#testing-setup)
7. [Pipeline Workflow](#pipeline-workflow)
8. [Deployment Process](#deployment-process)
9. [Monitoring and Alerting](#monitoring-and-alerting)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

- AWS account with appropriate permissions
- GitHub repository with admin access
- Auth0 tenants configured for each environment (dev, staging, production)
- PostgreSQL databases for each environment
- Domain names configured for each environment

## GitHub Repository Setup

### 1. Install Dependencies

First, install all required dependencies:

```bash
# Install production dependencies
npm install

# Install development and testing dependencies
npm install --save-dev @playwright/test @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest jest jest-environment-jsdom

# Install Playwright browsers
npx playwright install
```

### 2. Environment Structure

The pipeline supports three environments:

- **Development/Preview**: Feature branches and pull requests
- **Staging**: `develop` branch
- **Production**: `main` branch

### 3. Branch Protection Rules

Configure branch protection rules in GitHub:

1. Go to **Settings** → **Branches**
2. Add rules for `main` and `develop` branches:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Include administrators

## AWS Amplify Configuration

### 1. Create Amplify Applications

Create separate Amplify applications for each environment:

```bash
# Initialize Amplify for each environment
amplify init --envName dev
amplify init --envName staging  
amplify init --envName production
```

### 2. Configure Build Settings

In the Amplify Console, configure build settings for each environment:

```yaml
# amplify.yml
version: 1
backend:
  phases:
    preBuild:
      commands:
        - cd amplify && npm ci
    build:
      commands:
        - npx amplify pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npm run migrate:employer
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 3. Environment Variables in Amplify

Configure the following environment variables in each Amplify environment:

```
NODE_ENV=production|staging|development
NEXT_PUBLIC_APP_ENV=production|staging|development
```

## GitHub Actions Secrets

Configure the following secrets in your GitHub repository:

### 1. AWS Credentials

**Development/Staging:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**Production:**
- `AWS_ACCESS_KEY_ID_PROD`
- `AWS_SECRET_ACCESS_KEY_PROD`

### 2. Amplify App IDs

- `AMPLIFY_APP_ID` (staging/preview)
- `AMPLIFY_APP_ID_PROD` (production)

### 3. Database URLs

- `DATABASE_URL_TEST` (testing database)
- `DATABASE_URL_STAGING` (staging database)
- `DATABASE_URL_PROD` (production database)

### 4. Auth0 Configuration

**Development:**
- `AUTH0_SECRET_DEV`
- `AUTH0_BASE_URL_DEV`
- `AUTH0_ISSUER_BASE_URL_DEV`
- `AUTH0_CLIENT_ID_DEV`
- `AUTH0_CLIENT_SECRET_DEV`

**Staging:**
- `AUTH0_SECRET_STAGING`
- `AUTH0_BASE_URL_STAGING`
- `AUTH0_ISSUER_BASE_URL_STAGING`
- `AUTH0_CLIENT_ID_STAGING`
- `AUTH0_CLIENT_SECRET_STAGING`

**Production:**
- `AUTH0_SECRET_PROD`
- `AUTH0_BASE_URL_PROD`
- `AUTH0_ISSUER_BASE_URL_PROD`
- `AUTH0_CLIENT_ID_PROD`
- `AUTH0_CLIENT_SECRET_PROD`

**Testing:**
- `AUTH0_SECRET_TEST`
- `AUTH0_BASE_URL_TEST`
- `AUTH0_ISSUER_BASE_URL_TEST`
- `AUTH0_CLIENT_ID_TEST`
- `AUTH0_CLIENT_SECRET_TEST`

### 5. Notification Settings (Optional)

- `SLACK_WEBHOOK` (for deployment notifications)

## Environment Configuration

### 1. Local Development

Create `.env.local` for local development:

```env
# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret-at-least-32-characters-long
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://dev-qexcpj7a1xh3q5pe.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/upskill_employer_dev

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
```

### 2. Testing Environment

Create `.env.test` for testing:

```env
# Testing Database
DATABASE_URL=postgresql://username:password@localhost:5432/upskill_employer_test

# Mock Auth0 Configuration
AUTH0_SECRET=test-secret-at-least-32-characters-long
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://test.auth0.com
AUTH0_CLIENT_ID=test_client_id
AUTH0_CLIENT_SECRET=test_client_secret

# Environment
NODE_ENV=test
```

## Testing Setup

### 1. Jest Configuration

The repository includes a complete Jest configuration in `jest.config.js` with:

- Next.js integration
- TypeScript support
- Module path mapping
- Coverage reporting
- Test environment setup

### 2. Test Structure

```
__tests__/
├── unit/           # Unit tests for individual components/functions
├── integration/    # Integration tests for API routes and database
e2e/               # End-to-end tests with Playwright
```

### 3. Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests only
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Pipeline Workflow

The CI/CD pipeline consists of the following stages:

### 1. Test Stage

- **Triggers**: All pushes and pull requests
- **Actions**:
  - Lint code with ESLint
  - Type check with TypeScript
  - Run unit tests
  - Run integration tests
  - Run E2E tests

### 2. Migration Validation

- **Triggers**: After tests pass
- **Actions**:
  - Validate database migration scripts
  - Run dry-run migrations

### 3. Deploy Preview

- **Triggers**: Pull requests and feature branches
- **Actions**:
  - Build application
  - Deploy to preview environment
  - Generate preview URL

### 4. Deploy Staging

- **Triggers**: Pushes to `develop` branch
- **Actions**:
  - Run database migrations
  - Build application
  - Deploy to staging environment

### 5. Deploy Production

- **Triggers**: Pushes to `main` branch
- **Actions**:
  - Run database migrations
  - Build application
  - Deploy to production environment

### 6. Notifications

- **Triggers**: After deployments
- **Actions**:
  - Send Slack notifications
  - Update deployment status

## Deployment Process

### 1. Feature Development

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch to trigger preview deployment
4. Create pull request to `develop`
5. Review and merge to deploy to staging

### 2. Production Release

1. Create pull request from `develop` to `main`
2. Review changes and run final tests
3. Merge to `main` to deploy to production

### 3. Hotfixes

1. Create hotfix branch from `main`
2. Make urgent fixes
3. Create pull request to `main`
4. Fast-track review and merge

## Monitoring and Alerting

### 1. GitHub Actions Monitoring

Monitor pipeline health through:

- GitHub Actions dashboard
- Email notifications for failed builds
- Slack notifications for deployment status

### 2. Application Monitoring

Set up monitoring for:

- Application performance (AWS CloudWatch)
- Error tracking (Sentry)
- Database performance
- Auth0 authentication metrics

### 3. Alerts

Configure alerts for:

- Failed deployments
- High error rates
- Performance degradation
- Database connection issues

## Troubleshooting

### Common Issues

#### 1. Migration Failures

**Symptoms**: Database migration step fails in CI/CD
**Solutions**:
- Check database connectivity
- Verify migration script syntax
- Ensure proper permissions
- Review migration logs

#### 2. Build Failures

**Symptoms**: Application build fails
**Solutions**:
- Check for TypeScript errors
- Verify environment variables
- Review build logs
- Test build locally

#### 3. Auth0 Integration Issues

**Symptoms**: Authentication failures in deployed environments
**Solutions**:
- Verify Auth0 configuration
- Check callback URLs
- Validate environment variables
- Review Auth0 logs

#### 4. Amplify Deployment Issues

**Symptoms**: Amplify deployment fails or times out
**Solutions**:
- Check AWS credentials
- Verify Amplify configuration
- Review build logs
- Check resource limits

### Debugging Steps

1. **Check GitHub Actions logs**:
   - Go to Actions tab in GitHub repository
   - Click on failed workflow
   - Review detailed logs for each step

2. **Verify environment variables**:
   - Check GitHub repository secrets
   - Validate Amplify environment variables
   - Ensure all required variables are set

3. **Test locally**:
   - Run tests locally with same environment
   - Verify database connections
   - Test build process

4. **Review external services**:
   - Check Auth0 status and logs
   - Verify AWS service status
   - Review database connectivity

### Support and Escalation

For issues that cannot be resolved:

1. Check GitHub Actions marketplace for action updates
2. Review AWS Amplify documentation
3. Consult Auth0 support documentation
4. Create support tickets with relevant logs

## Security Considerations

### 1. Secrets Management

- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Use least-privilege IAM policies
- Never commit secrets to code

### 2. Environment Isolation

- Separate AWS accounts for production
- Isolated databases per environment
- Distinct Auth0 tenants
- Network security groups

### 3. Access Control

- Limit repository access
- Use branch protection rules
- Require code reviews
- Enable audit logging

## Maintenance

### 1. Regular Updates

- Update GitHub Actions versions
- Keep dependencies current
- Review and update secrets
- Monitor security advisories

### 2. Performance Optimization

- Review build times
- Optimize test execution
- Monitor resource usage
- Cache optimization

### 3. Documentation

- Keep this guide updated
- Document configuration changes
- Maintain runbooks
- Update team procedures

---

## Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Install test dependencies: `npm install --save-dev @playwright/test @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest jest jest-environment-jsdom`
- [ ] Install Playwright browsers: `npx playwright install`
- [ ] Configure GitHub repository secrets
- [ ] Set up AWS Amplify applications
- [ ] Configure Auth0 for each environment
- [ ] Set up databases for each environment
- [ ] Configure branch protection rules
- [ ] Test the pipeline with a feature branch
- [ ] Deploy to staging
- [ ] Deploy to production

For questions or issues, refer to the [Troubleshooting](#troubleshooting) section or contact the development team. 