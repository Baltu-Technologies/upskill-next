#!/usr/bin/env node

/**
 * Migration Runner for Upskill Platform
 * 
 * Runs database migrations for both auth and course databases
 * Usage: node migrate.js [options]
 */

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

// Configuration
const CONFIG = {
  auth: {
    connectionString: process.env.AUTH_DB_URL || process.env.BETTER_AUTH_DATABASE_URL,
    migrationDir: path.join(__dirname, '../auth'),
    name: 'Auth Database'
  },
  course: {
    connectionString: process.env.COURSE_DB_URL,
    migrationDir: path.join(__dirname, '../course'),
    name: 'Course Database'
  }
};

// CLI Arguments parser
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    database: null, // 'auth', 'course', or null for all
    file: null,     // specific migration file
    dryRun: false,  // don't actually run, just show what would run
    verbose: false  // detailed output
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--database':
      case '-d':
        options.database = args[++i];
        break;
      case '--file':
      case '-f':
        options.file = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
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
Migration Runner for Upskill Platform

Usage: node migrate.js [options]

Options:
  -d, --database <name>   Run migrations for specific database (auth|course)
  -f, --file <filename>   Run specific migration file
  --dry-run              Show what would be migrated without running
  -v, --verbose          Show detailed output
  -h, --help             Show this help

Examples:
  node migrate.js                           # Run all pending migrations
  node migrate.js --database auth           # Run auth database migrations only
  node migrate.js --file 001_initial.sql    # Run specific migration
  node migrate.js --dry-run                 # Show pending migrations
`);
}

// Database connection helper
async function createConnection(config) {
  if (!config.connectionString) {
    throw new Error(`Missing connection string for ${config.name}. Check your environment variables.`);
  }

  const pool = new Pool({
    connectionString: config.connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  // Test connection
  try {
    const client = await pool.connect();
    client.release();
    return pool;
  } catch (error) {
    throw new Error(`Failed to connect to ${config.name}: ${error.message}`);
  }
}

// Get migration files
async function getMigrationFiles(migrationDir) {
  try {
    const files = await fs.readdir(migrationDir);
    return files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Natural sort by filename
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Get applied migrations from database
async function getAppliedMigrations(pool) {
  try {
    const result = await pool.query(
      'SELECT version, filename, applied_at FROM schema_migrations ORDER BY version'
    );
    return result.rows;
  } catch (error) {
    // Table doesn't exist yet, no migrations applied
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
}

// Get pending migrations
async function getPendingMigrations(migrationDir, pool) {
  const allFiles = await getMigrationFiles(migrationDir);
  const appliedMigrations = await getAppliedMigrations(pool);
  const appliedVersions = new Set(appliedMigrations.map(m => m.version));

  return allFiles.filter(file => {
    const version = file.split('_')[0];
    return !appliedVersions.has(version);
  });
}

// Read migration file content
async function readMigrationFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  
  // Extract UP section (everything before DOWN comment)
  const downIndex = content.indexOf('-- DOWN:');
  const upContent = downIndex !== -1 ? content.substring(0, downIndex) : content;
  
  return upContent.trim();
}

// Execute migration
async function executeMigration(pool, migrationDir, filename, options) {
  const filePath = path.join(migrationDir, filename);
  const version = filename.split('_')[0];
  
  console.log(`Running migration: ${filename}`);
  
  if (options.dryRun) {
    console.log(`  [DRY RUN] Would execute: ${filename}`);
    return;
  }

  const sql = await readMigrationFile(filePath);
  
  if (options.verbose) {
    console.log(`  SQL Preview:\n${sql.substring(0, 200)}...`);
  }

  try {
    await pool.query('BEGIN');
    
    // Execute the migration SQL
    await pool.query(sql);
    
    await pool.query('COMMIT');
    console.log(`  ✅ Migration ${filename} completed successfully`);
    
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`  ❌ Migration ${filename} failed: ${error.message}`);
    throw error;
  }
}

// Run migrations for a specific database
async function runDatabaseMigrations(dbConfig, options) {
  console.log(`\n🔧 Migrating ${dbConfig.name}...`);
  
  const pool = await createConnection(dbConfig);
  
  try {
    let pendingMigrations;
    
    if (options.file) {
      // Run specific file
      const allFiles = await getMigrationFiles(dbConfig.migrationDir);
      if (!allFiles.includes(options.file)) {
        throw new Error(`Migration file ${options.file} not found`);
      }
      pendingMigrations = [options.file];
    } else {
      // Run all pending migrations
      pendingMigrations = await getPendingMigrations(dbConfig.migrationDir, pool);
    }

    if (pendingMigrations.length === 0) {
      console.log(`  ✅ No pending migrations for ${dbConfig.name}`);
      return;
    }

    console.log(`  📋 Found ${pendingMigrations.length} pending migration(s):`);
    pendingMigrations.forEach(file => console.log(`    - ${file}`));

    if (options.dryRun) {
      console.log(`  [DRY RUN] Would run ${pendingMigrations.length} migration(s)`);
      return;
    }

    // Execute migrations in order
    for (const filename of pendingMigrations) {
      await executeMigration(pool, dbConfig.migrationDir, filename, options);
    }

    console.log(`  ✅ ${dbConfig.name} migration completed`);
    
  } finally {
    await pool.end();
  }
}

// Main execution
async function main() {
  try {
    const options = parseArgs();
    
    console.log('🚀 Starting database migrations...');
    
    if (options.dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made');
    }

    // Determine which databases to migrate
    const databasesToMigrate = [];
    
    if (options.database) {
      if (CONFIG[options.database]) {
        databasesToMigrate.push({ key: options.database, config: CONFIG[options.database] });
      } else {
        throw new Error(`Unknown database: ${options.database}. Available: ${Object.keys(CONFIG).join(', ')}`);
      }
    } else {
      // Migrate all databases
      Object.entries(CONFIG).forEach(([key, config]) => {
        databasesToMigrate.push({ key, config });
      });
    }

    // Run migrations
    for (const { key, config } of databasesToMigrate) {
      try {
        await runDatabaseMigrations(config, options);
      } catch (error) {
        console.error(`❌ Failed to migrate ${config.name}: ${error.message}`);
        if (options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    }

    console.log('\n🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runDatabaseMigrations,
  CONFIG
}; 