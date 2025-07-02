#!/usr/bin/env node

/**
 * Enhanced Database Connection Validator for Upskill Platform
 * 
 * This utility provides comprehensive connection testing, migration script validation,
 * and AWS Secrets Manager integration for both auth and course databases.
 * 
 * Features:
 * - Database connectivity testing with retry logic
 * - SQL migration script validation and linting
 * - AWS Secrets Manager credential retrieval
 * - Environment validation and health checks
 * - Pre-migration connectivity verification
 * 
 * Usage: node scripts/connection-validator.js [options]
 */

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

// Configuration
const CONFIG = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    secretsPrefix: 'upskill/database'
  },
  databases: {
    auth: {
      envVar: 'AUTH_DB_URL',
      fallbackEnvVar: 'BETTER_AUTH_DATABASE_URL',
      secretName: 'upskill/database/auth',
      name: 'Auth Database',
      requiredTables: ['user', 'session', 'account', 'verification', 'schema_migrations'],
      migrationPath: 'migrations/auth'
    },
    course: {
      envVar: 'COURSE_DB_URL',
      secretName: 'upskill/database/course',
      name: 'Course Database',
      requiredTables: [
        'instructors', 'categories', 'courses', 'modules', 'lessons',
        'enrollments', 'progress', 'quizzes', 'questions', 'quiz_attempts',
        'certificates', 'reviews', 'analytics', 'schema_migrations'
      ],
      migrationPath: 'migrations/course'
    }
  },
  connection: {
    maxRetries: 3,
    retryDelay: 2000,
    timeout: 15000,
    ssl: { rejectUnauthorized: false }
  }
};

// Test results tracker
let testResults = {
  summary: { passed: 0, failed: 0, warnings: 0 },
  tests: [],
  databases: {}
};

// CLI argument parser
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    database: null,     // 'auth', 'course', or null for all
    useSecrets: false,  // Use AWS Secrets Manager
    validateMigrations: true, // Validate migration scripts
    verbose: false,     // Detailed output
    failFast: false,    // Stop on first failure
    output: 'console'   // Output format: console, json
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--database':
      case '-d':
        options.database = args[++i];
        break;
      case '--secrets':
      case '-s':
        options.useSecrets = true;
        break;
      case '--no-migrations':
        options.validateMigrations = false;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--fail-fast':
        options.failFast = true;
        break;
      case '--json':
        options.output = 'json';
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Enhanced Database Connection Validator

Usage: node scripts/connection-validator.js [options]

Options:
  -d, --database <name>     Test specific database (auth|course)
  -s, --secrets            Use AWS Secrets Manager for credentials
      --no-migrations       Skip migration script validation
  -v, --verbose            Show detailed output
      --fail-fast          Stop on first failure
      --json               Output results as JSON
  -h, --help               Show this help

Examples:
  # Basic connection test
  node scripts/connection-validator.js

  # Test auth database with secrets manager
  node scripts/connection-validator.js -d auth -s

  # Validate all with verbose output
  node scripts/connection-validator.js -v

  # JSON output for CI/CD
  node scripts/connection-validator.js --json
`);
}

// Logging utilities
class Logger {
  constructor(options = {}) {
    this.verboseMode = options.verbose || false;
    this.quiet = options.output === 'json';
  }

  info(message) {
    if (!this.quiet) console.log(message);
  }

  verbose(message) {
    if (this.verboseMode && !this.quiet) console.log(`    ${message}`);
  }

  success(message) {
    if (!this.quiet) console.log(`✅ ${message}`);
  }

  warning(message) {
    if (!this.quiet) console.log(`⚠️  ${message}`);
  }

  error(message) {
    if (!this.quiet) console.log(`❌ ${message}`);
  }

  section(title) {
    if (!this.quiet) console.log(`\n�� ${title}`);
  }
}

// AWS Secrets Manager client
class SecretsManager {
  constructor() {
    this.client = new SecretsManagerClient({ region: CONFIG.aws.region });
  }

  async getSecret(secretName) {
    try {
      const command = new GetSecretValueCommand({ SecretId: secretName });
      const response = await this.client.send(command);
      return JSON.parse(response.SecretString);
    } catch (error) {
      throw new Error(`Failed to retrieve secret ${secretName}: ${error.message}`);
    }
  }

  async getDatabaseCredentials(database) {
    const config = CONFIG.databases[database];
    if (!config || !config.secretName) {
      throw new Error(`No secret configuration found for database: ${database}`);
    }

    const secret = await this.getSecret(config.secretName);
    
    // Expected secret format:
    // {
    //   "host": "proxy-endpoint",
    //   "port": 5432,
    //   "database": "postgres",
    //   "username": "postgres",
    //   "password": "password"
    // }
    
    const requiredFields = ['host', 'port', 'database', 'username', 'password'];
    for (const field of requiredFields) {
      if (!secret[field]) {
        throw new Error(`Missing required field '${field}' in secret ${config.secretName}`);
      }
    }

    return `postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.database}`;
  }
}

// Connection manager with retry logic
class ConnectionManager {
  constructor(logger) {
    this.logger = logger;
  }

  async createPool(connectionString, name) {
    return new Pool({
      connectionString,
      ssl: connectionString.includes('rds.amazonaws.com') ? CONFIG.connection.ssl : false,
      max: 2,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: CONFIG.connection.timeout,
      application_name: `upskill-connection-validator-${name}`
    });
  }

  async testConnection(pool, name, retries = CONFIG.connection.maxRetries) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.verbose(`Attempt ${attempt}/${retries} for ${name}...`);
        
        const start = Date.now();
        const client = await pool.connect();
        const duration = Date.now() - start;
        
        // Test basic query
        await client.query('SELECT 1');
        client.release();
        
        this.logger.verbose(`Connected to ${name} in ${duration}ms`);
        return { success: true, duration, attempts: attempt };
        
      } catch (error) {
        this.logger.verbose(`Attempt ${attempt} failed: ${error.message}`);
        
        if (attempt === retries) {
          return { 
            success: false, 
            error: error.message, 
            attempts: attempt,
            suggestions: this.getSuggestions(error)
          };
        }
        
        await this.sleep(CONFIG.connection.retryDelay);
      }
    }
  }

  getSuggestions(error) {
    const suggestions = [];
    
    if (error.code === 'ENOTFOUND') {
      suggestions.push('Check if the database endpoint is correct');
      suggestions.push('Verify the region matches your database cluster');
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('timeout')) {
      suggestions.push('Check security group - ensure port 5432 is open');
      suggestions.push('Verify database is publicly accessible if needed');
      suggestions.push('Check VPC/subnet configuration');
    } else if (error.message.includes('authentication')) {
      suggestions.push('Verify username/password credentials');
      suggestions.push('Check if database name exists');
      suggestions.push('Ensure IAM permissions if using IAM auth');
    }
    
    return suggestions;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// SQL script validator
class SQLValidator {
  constructor(logger) {
    this.logger = logger;
  }

  async validateMigrationScripts(migrationPath) {
    try {
      const migrationDir = path.join(process.cwd(), migrationPath);
      const files = await fs.readdir(migrationDir);
      const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

      const results = {
        totalFiles: sqlFiles.length,
        validFiles: 0,
        invalidFiles: 0,
        issues: []
      };

      for (const file of sqlFiles) {
        const filePath = path.join(migrationDir, file);
        const validation = await this.validateSQLFile(filePath, file);
        
        if (validation.valid) {
          results.validFiles++;
        } else {
          results.invalidFiles++;
          results.issues.push({
            file,
            issues: validation.issues
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to validate migration scripts: ${error.message}`);
    }
  }

  async validateSQLFile(filePath, fileName) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const issues = [];

      // Basic SQL syntax checks
      this.checkBasicSyntax(content, issues);
      this.checkMigrationStructure(content, fileName, issues);
      this.checkSecurityIssues(content, issues);

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      return {
        valid: false,
        issues: [`Failed to read file: ${error.message}`]
      };
    }
  }

  checkBasicSyntax(content, issues) {
    // Check for common SQL syntax issues
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (trimmed.startsWith('--') || trimmed === '') return;
      
      // Check for unmatched quotes
      const singleQuotes = (trimmed.match(/'/g) || []).length;
      const doubleQuotes = (trimmed.match(/"/g) || []).length;
      
      if (singleQuotes % 2 !== 0) {
        issues.push(`Line ${lineNum}: Unmatched single quote`);
      }
      if (doubleQuotes % 2 !== 0) {
        issues.push(`Line ${lineNum}: Unmatched double quote`);
      }
      
      // Check for basic SQL keywords
      if (trimmed.toLowerCase().includes('drop table') && !trimmed.toLowerCase().includes('if exists')) {
        issues.push(`Line ${lineNum}: DROP TABLE without IF EXISTS - consider adding safety check`);
      }
    });
  }

  checkMigrationStructure(content, fileName, issues) {
    const lowerContent = content.toLowerCase();
    
    // Check for migration metadata
    if (!content.includes('-- Migration:') && !content.includes('-- UP')) {
      issues.push('Missing migration metadata comments');
    }
    
    // Check for transaction usage in DDL
    if (lowerContent.includes('create table') || lowerContent.includes('alter table')) {
      if (!lowerContent.includes('begin') && !lowerContent.includes('start transaction')) {
        issues.push('Consider wrapping DDL statements in transactions');
      }
    }
    
    // Check for schema_migrations update
    if (fileName.includes('001_') && !lowerContent.includes('schema_migrations')) {
      issues.push('Initial migration should create schema_migrations table');
    }
  }

  checkSecurityIssues(content, issues) {
    const lowerContent = content.toLowerCase();
    
    // Check for potential security issues
    if (lowerContent.includes('grant all')) {
      issues.push('GRANT ALL detected - consider using principle of least privilege');
    }
    
    if (lowerContent.includes('password') && !lowerContent.includes('hash')) {
      issues.push('Plain text password detected - ensure passwords are hashed');
    }
    
    // Check for SQL injection patterns (basic)
    if (lowerContent.includes('execute') && lowerContent.includes('||')) {
      issues.push('Dynamic SQL concatenation detected - check for SQL injection risks');
    }
  }
}

// Database schema validator
class SchemaValidator {
  constructor(pool, logger) {
    this.pool = pool;
    this.logger = logger;
  }

  async validateRequiredTables(requiredTables) {
    const result = await this.pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const existingTables = result.rows.map(row => row.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    return {
      existingTables,
      missingTables,
      allTablesExist: missingTables.length === 0
    };
  }

  async validateMigrationTracking() {
    try {
      const result = await this.pool.query(`
        SELECT version, applied_at, filename 
        FROM schema_migrations 
        ORDER BY applied_at DESC 
        LIMIT 5
      `);
      
      return {
        hasTrackingTable: true,
        migrationCount: result.rowCount,
        latestMigrations: result.rows
      };
    } catch (error) {
      return {
        hasTrackingTable: false,
        error: error.message
      };
    }
  }

  async validateIndexes() {
    const result = await this.pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);
    
    return {
      indexCount: result.rowCount,
      indexes: result.rows
    };
  }

  async validateConstraints() {
    const result = await this.pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_type
    `);
    
    const constraints = {
      primary: 0,
      foreign: 0,
      unique: 0,
      check: 0,
      details: result.rows
    };
    
    result.rows.forEach(row => {
      switch (row.constraint_type) {
        case 'PRIMARY KEY':
          constraints.primary++;
          break;
        case 'FOREIGN KEY':
          constraints.foreign++;
          break;
        case 'UNIQUE':
          constraints.unique++;
          break;
        case 'CHECK':
          constraints.check++;
          break;
      }
    });
    
    return constraints;
  }
}

// Main test runner
class ConnectionValidator {
  constructor(options) {
    this.options = options;
    this.logger = new Logger(options);
    this.secretsManager = new SecretsManager();
    this.connectionManager = new ConnectionManager(this.logger);
    this.sqlValidator = new SQLValidator(this.logger);
  }

  async run() {
    try {
      this.logger.info('🚀 Starting Enhanced Database Connection Validation\n');
      
      // Determine which databases to test
      const databasesToTest = this.options.database 
        ? [this.options.database] 
        : Object.keys(CONFIG.databases);
      
      // Validate each database
      for (const dbName of databasesToTest) {
        if (this.options.failFast && testResults.summary.failed > 0) {
          this.logger.warning('Stopping due to --fail-fast option');
          break;
        }
        
        await this.validateDatabase(dbName);
      }
      
      // Output results
      this.outputResults();
      
      // Exit with appropriate code
      const exitCode = testResults.summary.failed > 0 ? 1 : 0;
      process.exit(exitCode);
      
    } catch (error) {
      this.logger.error(`Validation failed: ${error.message}`);
      if (this.options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  async validateDatabase(dbName) {
    const dbConfig = CONFIG.databases[dbName];
    if (!dbConfig) {
      this.addTestResult(dbName, 'Configuration', false, `Unknown database: ${dbName}`);
      return;
    }

    this.logger.section(`${dbConfig.name} Validation`);
    testResults.databases[dbName] = { tests: [], summary: { passed: 0, failed: 0, warnings: 0 } };

    let pool = null;
    
    try {
      // Step 1: Get connection string
      const connectionString = await this.getConnectionString(dbName);
      this.addTestResult(dbName, 'Connection String', true, 'Retrieved successfully');

      // Step 2: Test connection
      pool = await this.connectionManager.createPool(connectionString, dbName);
      const connectionResult = await this.connectionManager.testConnection(pool, dbConfig.name);
      
      if (connectionResult.success) {
        this.addTestResult(dbName, 'Database Connection', true, 
          `Connected in ${connectionResult.duration}ms (${connectionResult.attempts} attempts)`);
      } else {
        this.addTestResult(dbName, 'Database Connection', false, connectionResult.error);
        this.logger.error('Connection failed. Suggestions:');
        connectionResult.suggestions?.forEach(suggestion => 
          this.logger.info(`  • ${suggestion}`));
        return;
      }

      // Step 3: Validate schema
      await this.validateSchema(dbName, pool, dbConfig);

      // Step 4: Validate migration scripts
      if (this.options.validateMigrations) {
        await this.validateMigrations(dbName, dbConfig);
      }

    } catch (error) {
      this.addTestResult(dbName, 'General', false, error.message);
    } finally {
      if (pool) {
        await pool.end();
      }
    }
  }

  async getConnectionString(dbName) {
    const dbConfig = CONFIG.databases[dbName];
    
    if (this.options.useSecrets) {
      this.logger.verbose(`Retrieving credentials from AWS Secrets Manager...`);
      return await this.secretsManager.getDatabaseCredentials(dbName);
    } else {
      // Use environment variables
      let connectionString = process.env[dbConfig.envVar];
      
      // Try fallback environment variable if available
      if (!connectionString && dbConfig.fallbackEnvVar) {
        connectionString = process.env[dbConfig.fallbackEnvVar];
      }
      
      if (!connectionString) {
        throw new Error(`Missing connection string. Set ${dbConfig.envVar} or use --secrets option`);
      }
      
      return connectionString;
    }
  }

  async validateSchema(dbName, pool, dbConfig) {
    const validator = new SchemaValidator(pool, this.logger);
    
    // Check required tables
    const tableValidation = await validator.validateRequiredTables(dbConfig.requiredTables);
    if (tableValidation.allTablesExist) {
      this.addTestResult(dbName, 'Required Tables', true, 
        `All ${dbConfig.requiredTables.length} tables exist`);
    } else {
      this.addTestResult(dbName, 'Required Tables', false, 
        `Missing tables: ${tableValidation.missingTables.join(', ')}`);
    }

    // Check migration tracking
    const migrationTracking = await validator.validateMigrationTracking();
    if (migrationTracking.hasTrackingTable) {
      this.addTestResult(dbName, 'Migration Tracking', true, 
        `${migrationTracking.migrationCount} migrations tracked`);
    } else {
      this.addTestResult(dbName, 'Migration Tracking', false, 
        'schema_migrations table not found');
    }

    // Check indexes
    const indexes = await validator.validateIndexes();
    this.addTestResult(dbName, 'Database Indexes', true, 
      `${indexes.indexCount} indexes found`);

    // Check constraints
    const constraints = await validator.validateConstraints();
    this.addTestResult(dbName, 'Database Constraints', true, 
      `${constraints.primary} PK, ${constraints.foreign} FK, ${constraints.unique} unique`);
  }

  async validateMigrations(dbName, dbConfig) {
    try {
      const validation = await this.sqlValidator.validateMigrationScripts(dbConfig.migrationPath);
      
      if (validation.invalidFiles === 0) {
        this.addTestResult(dbName, 'Migration Scripts', true, 
          `${validation.totalFiles} files validated successfully`);
      } else {
        this.addTestResult(dbName, 'Migration Scripts', false, 
          `${validation.invalidFiles}/${validation.totalFiles} files have issues`);
        
        if (this.options.verbose) {
          validation.issues.forEach(issue => {
            this.logger.error(`  ${issue.file}:`);
            issue.issues.forEach(detail => this.logger.error(`    • ${detail}`));
          });
        }
      }
    } catch (error) {
      this.addTestResult(dbName, 'Migration Scripts', false, error.message);
    }
  }

  addTestResult(database, test, passed, message) {
    const result = {
      database,
      test,
      passed,
      message,
      timestamp: new Date().toISOString()
    };

    testResults.tests.push(result);
    testResults.databases[database].tests.push(result);

    if (passed) {
      testResults.summary.passed++;
      testResults.databases[database].summary.passed++;
      this.logger.success(`${test}: ${message}`);
    } else {
      testResults.summary.failed++;
      testResults.databases[database].summary.failed++;
      this.logger.error(`${test}: ${message}`);
    }
  }

  outputResults() {
    if (this.options.output === 'json') {
      console.log(JSON.stringify(testResults, null, 2));
    } else {
      this.logger.info('\n📊 Validation Summary:');
      this.logger.info(`✅ Passed: ${testResults.summary.passed}`);
      this.logger.info(`❌ Failed: ${testResults.summary.failed}`);
      
      if (testResults.summary.failed === 0) {
        this.logger.success('\n🎉 All validation tests passed!');
      } else {
        this.logger.error('\n💥 Some validation tests failed. Check the output above for details.');
      }
    }
  }
}

// Main execution
async function main() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const options = parseArgs();
  const validator = new ConnectionValidator(options);
  await validator.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  });
}

module.exports = { ConnectionValidator, CONFIG }; 