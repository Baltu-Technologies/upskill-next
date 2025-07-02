#!/usr/bin/env node

/**
 * Migration Rollback Script for Upskill Platform
 * 
 * Rolls back database migrations using DOWN sections
 * Usage: node rollback.js [options]
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
    database: null,    // 'auth', 'course', or null for all
    steps: 1,         // number of migrations to rollback
    to: null,         // rollback to specific version
    dryRun: false,    // don't actually run, just show what would rollback
    verbose: false,   // detailed output
    force: false      // force rollback even if data might be lost
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--database':
      case '-d':
        options.database = args[++i];
        break;
      case '--steps':
      case '-s':
        options.steps = parseInt(args[++i]);
        break;
      case '--to':
      case '-t':
        options.to = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--force':
        options.force = true;
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
Migration Rollback Script for Upskill Platform

Usage: node rollback.js [options]

Options:
  -d, --database <name>   Rollback specific database (auth|course)
  -s, --steps <number>    Number of migrations to rollback (default: 1)
  -t, --to <version>      Rollback to specific version (e.g., "001")
  --dry-run              Show what would be rolled back without executing
  -v, --verbose          Show detailed output
  --force                Force rollback even if data might be lost
  -h, --help             Show this help

Examples:
  node rollback.js                          # Rollback last migration
  node rollback.js --steps 3               # Rollback last 3 migrations
  node rollback.js --to 001                # Rollback to version 001
  node rollback.js --database auth         # Rollback auth database only
  node rollback.js --dry-run               # Show what would be rolled back

⚠️  WARNING: Rollbacks can cause data loss. Use --dry-run first!
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

// Get applied migrations from database
async function getAppliedMigrations(pool) {
  try {
    const result = await pool.query(
      'SELECT version, filename, applied_at FROM schema_migrations ORDER BY version DESC'
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

// Get migrations to rollback
async function getMigrationsToRollback(migrationDir, pool, options) {
  const appliedMigrations = await getAppliedMigrations(pool);
  
  if (appliedMigrations.length === 0) {
    return [];
  }

  let migrationsToRollback = [];

  if (options.to) {
    // Rollback to specific version
    const targetIndex = appliedMigrations.findIndex(m => m.version === options.to);
    if (targetIndex === -1) {
      throw new Error(`Version ${options.to} not found in applied migrations`);
    }
    migrationsToRollback = appliedMigrations.slice(0, targetIndex);
  } else {
    // Rollback specific number of steps
    migrationsToRollback = appliedMigrations.slice(0, options.steps);
  }

  return migrationsToRollback;
}

// Read migration file and extract DOWN section
async function readRollbackSQL(migrationDir, filename) {
  const filePath = path.join(migrationDir, filename);
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Find DOWN section
    const downIndex = content.indexOf('-- DOWN:');
    if (downIndex === -1) {
      throw new Error(`No DOWN section found in ${filename}`);
    }
    
    const downContent = content.substring(downIndex + 8).trim(); // Skip "-- DOWN:"
    
    if (!downContent) {
      throw new Error(`Empty DOWN section in ${filename}`);
    }
    
    return downContent;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Migration file ${filename} not found`);
    }
    throw error;
  }
}

// Execute rollback for a single migration
async function executeRollback(pool, migrationDir, migration, options) {
  const { version, filename } = migration;
  
  console.log(`Rolling back migration: ${filename}`);
  
  if (options.dryRun) {
    console.log(`  [DRY RUN] Would rollback: ${filename}`);
    return;
  }

  try {
    const rollbackSQL = await readRollbackSQL(migrationDir, filename);
    
    if (options.verbose) {
      console.log(`  SQL Preview:\n${rollbackSQL.substring(0, 200)}...`);
    }

    await pool.query('BEGIN');
    
    // Execute the rollback SQL
    await pool.query(rollbackSQL);
    
    // Remove from migration tracking
    await pool.query(
      'DELETE FROM schema_migrations WHERE version = $1',
      [version]
    );
    
    await pool.query('COMMIT');
    console.log(`  ✅ Rollback ${filename} completed successfully`);
    
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`  ❌ Rollback ${filename} failed: ${error.message}`);
    throw error;
  }
}

// Check for data loss warnings
async function checkDataLossWarnings(pool, migrationsToRollback, dbName) {
  const warnings = [];
  
  // Check if rolling back table creations (potential data loss)
  for (const migration of migrationsToRollback) {
    if (migration.filename.includes('create_') || migration.filename.includes('initial_')) {
      warnings.push(`${migration.filename}: This rollback will DROP TABLES and cause DATA LOSS`);
    }
  }

  // Check for actual data in tables that might be dropped
  if (dbName === 'Course Database') {
    try {
      const result = await pool.query(`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins + n_tup_upd + n_tup_del as total_changes
        FROM pg_stat_user_tables 
        WHERE n_tup_ins + n_tup_upd + n_tup_del > 0
        ORDER BY total_changes DESC
      `);
      
      if (result.rows.length > 0) {
        warnings.push(`Database has tables with data. Rolling back might cause data loss.`);
      }
    } catch (error) {
      // Ignore if we can't check stats
    }
  }

  return warnings;
}

// Run rollbacks for a specific database
async function runDatabaseRollbacks(dbConfig, options) {
  console.log(`\n🔄 Rolling back ${dbConfig.name}...`);
  
  const pool = await createConnection(dbConfig);
  
  try {
    const migrationsToRollback = await getMigrationsToRollback(
      dbConfig.migrationDir, 
      pool, 
      options
    );

    if (migrationsToRollback.length === 0) {
      console.log(`  ✅ No migrations to rollback for ${dbConfig.name}`);
      return;
    }

    console.log(`  📋 Found ${migrationsToRollback.length} migration(s) to rollback:`);
    migrationsToRollback.forEach(migration => {
      console.log(`    - ${migration.filename} (applied: ${migration.applied_at})`);
    });

    // Check for data loss warnings
    const warnings = await checkDataLossWarnings(pool, migrationsToRollback, dbConfig.name);
    
    if (warnings.length > 0 && !options.force && !options.dryRun) {
      console.log(`\n⚠️  WARNING: Potential data loss detected:`);
      warnings.forEach(warning => console.log(`    - ${warning}`));
      console.log(`\n   Use --force to proceed anyway, or --dry-run to see what would happen.`);
      console.log(`   Consider backing up your data first!`);
      return;
    }

    if (options.dryRun) {
      console.log(`  [DRY RUN] Would rollback ${migrationsToRollback.length} migration(s)`);
      if (warnings.length > 0) {
        console.log(`  [DRY RUN] Warnings that would be shown:`);
        warnings.forEach(warning => console.log(`    - ${warning}`));
      }
      return;
    }

    // Execute rollbacks in reverse order (most recent first)
    for (const migration of migrationsToRollback) {
      await executeRollback(pool, dbConfig.migrationDir, migration, options);
    }

    console.log(`  ✅ ${dbConfig.name} rollback completed`);
    
  } finally {
    await pool.end();
  }
}

// Main execution
async function main() {
  try {
    const options = parseArgs();
    
    console.log('🔄 Starting database rollbacks...');
    
    if (options.dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made');
    }

    if (!options.force && !options.dryRun) {
      console.log('⚠️  This operation can cause DATA LOSS. Use --dry-run first to preview changes.');
    }

    // Determine which databases to rollback
    const databasesToRollback = [];
    
    if (options.database) {
      if (CONFIG[options.database]) {
        databasesToRollback.push({ key: options.database, config: CONFIG[options.database] });
      } else {
        throw new Error(`Unknown database: ${options.database}. Available: ${Object.keys(CONFIG).join(', ')}`);
      }
    } else {
      // Rollback all databases
      Object.entries(CONFIG).forEach(([key, config]) => {
        databasesToRollback.push({ key, config });
      });
    }

    // Run rollbacks
    for (const { key, config } of databasesToRollback) {
      try {
        await runDatabaseRollbacks(config, options);
      } catch (error) {
        console.error(`❌ Failed to rollback ${config.name}: ${error.message}`);
        if (options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    }

    if (!options.dryRun) {
      console.log('\n🎉 All rollbacks completed successfully!');
    } else {
      console.log('\n🔍 Dry run completed. Use without --dry-run to execute.');
    }
    
  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
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
  runDatabaseRollbacks,
  CONFIG
}; 