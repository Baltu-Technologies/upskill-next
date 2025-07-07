import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { getEnvironmentSpecificConfig, getCurrentEnvironment, validateEnvironmentConfiguration } from './backend/config/environments';

/**
 * AWS Amplify Gen 2 Backend Configuration for Upskill Employer Portal
 * 
 * This backend supports multi-tenant employer portal functionality with:
 * - Environment-specific resource configurations
 * - PostgreSQL Aurora Serverless v2 integration with existing auth database
 * - GraphQL API for business operations  
 * - Auth0 Organizations integration
 * - Multi-tenant data isolation
 */

// Get environment-specific configuration
const environment = getCurrentEnvironment();
const config = getEnvironmentSpecificConfig(environment);

// Validate configuration before deployment
const validation = validateEnvironmentConfiguration(environment);
if (!validation.isValid) {
  console.error('Environment configuration validation failed:');
  validation.errors.forEach(error => console.error(`  ❌ ${error}`));
  throw new Error('Invalid environment configuration. Please fix the errors above.');
}

if (validation.warnings.length > 0) {
  console.warn('Environment configuration warnings:');
  validation.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`));
}

console.log(`🚀 Deploying Upskill Employer Portal backend for ${environment} environment`);
console.log(`💰 Estimated monthly cost: $${config.estimatedMonthlyCost.min}-$${config.estimatedMonthlyCost.max}`);

/**
 * Define the backend with environment-aware resource configurations
 * 
 * Note: Once CDK packages are installed, this configuration will be enhanced with:
 * - Aurora Serverless v2 PostgreSQL cluster
 * - RDS Proxy for connection pooling
 * - Environment-specific scaling and security settings
 * - CloudWatch monitoring and alerting
 * - S3 buckets for file storage
 * - Lambda functions with environment-specific memory/timeout
 */
const backend = defineBackend({
  data,
  // TODO: Add additional resources once CDK packages are available:
  // - auth (if using Amplify Auth instead of Auth0)
  // - database (Aurora PostgreSQL cluster)
  // - storage (S3 buckets for media files)
  // - functions (Lambda functions for business logic)
});

/**
 * Environment-specific resource configuration will be applied here:
 * 
 * Example of how resources will use environment configuration:
 * 
 * // Database cluster configuration
 * const dbConfig = config.resourceConfig.database;
 * new rds.DatabaseCluster(backend.createStack('Database'), 'EmployerPortalCluster', {
 *   engine: rds.DatabaseClusterEngine.auroraPostgres({
 *     version: rds.AuroraPostgresEngineVersion.VER_15_3,
 *   }),
 *   writer: rds.ClusterInstance.serverlessV2('Writer', {
 *     scaleWithWriter: true,
 *   }),
 *   readers: config.resourceConfig.database.multiAZ ? [
 *     rds.ClusterInstance.serverlessV2('Reader1', {
 *       scaleWithWriter: true,
 *     })
 *   ] : undefined,
 *   backup: {
 *     retention: cdk.Duration.days(dbConfig.backupRetentionPeriod),
 *   },
 *   deletionProtection: dbConfig.deletionProtection,
 *   // ... additional configuration based on environment
 * });
 * 
 * // Lambda function configuration
 * const lambdaConfig = config.resourceConfig.lambda;
 * new lambda.Function(backend.createStack('Functions'), 'BusinessLogicFunction', {
 *   runtime: lambda.Runtime.NODEJS_18_X,
 *   timeout: cdk.Duration.seconds(lambdaConfig.timeout),
 *   memorySize: lambdaConfig.memorySize,
 *   reservedConcurrencyLimit: lambdaConfig.reservedConcurrency,
 *   // ... additional configuration based on environment
 * });
 * 
 * // CloudWatch monitoring
 * const monitoringConfig = config.resourceConfig.monitoring;
 * new logs.LogGroup(backend.createStack('Monitoring'), 'ApplicationLogs', {
 *   retention: logs.RetentionDays[`DAYS_${monitoringConfig.logRetentionDays}`],
 *   // ... additional monitoring configuration
 * });
 */

// Export the backend configuration
export default backend;

/**
 * Environment Configuration Summary
 * 
 * The backend automatically adapts to the deployment environment:
 * 
 * Development (Cost-optimized):
 * - Database: db.t3.micro, single AZ, 1-day backup
 * - Lambda: 512MB memory, 30s timeout
 * - Monitoring: 7-day log retention, basic monitoring
 * - Security: Local CORS, no WAF, no MFA
 * - Estimated cost: $50-100/month
 * 
 * Staging (Testing-optimized):
 * - Database: db.t3.small, single AZ, 3-day backup
 * - Lambda: 1024MB memory, 60s timeout, reserved concurrency
 * - Monitoring: 30-day log retention, detailed monitoring
 * - Security: WAF enabled, rate limiting, SSL-only
 * - Estimated cost: $200-400/month
 * 
 * Production (Performance & reliability-optimized):
 * - Database: db.r5.large, Multi-AZ, 30-day backup
 * - Lambda: 2048MB memory, 300s timeout, provisioned concurrency
 * - Monitoring: 365-day log retention, full monitoring suite
 * - Security: Full WAF, IP restrictions, MFA required
 * - Estimated cost: $800-1500/month
 */
