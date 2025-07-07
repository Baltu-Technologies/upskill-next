#!/usr/bin/env node

/**
 * Multi-Tenant Migration Runner for Employer Portal
 * 
 * Manages migrations for schema-per-tenant architecture
 * Usage: node migrate-employer-portal.js [options]
 */

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

// Configuration
const CONFIG = {
  main: {
    connectionString: process.env.EMPLOYER_PORTAL_DB_URL || process.env.DATABASE_URL,
    migrationDir: path.join(__dirname, '../employer-portal'),
    name: 'Employer Portal Database'
  }
};

// CLI Arguments parser
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    file: null,        // specific migration file
    dryRun: false,     // don't actually run, just show what would run
    verbose: false,    // detailed output
    publicOnly: false, // only run public schema migrations
    tenantOnly: false, // only run tenant schema migrations
    tenant: null,      // specific tenant to migrate
    createTenant: null, // create new tenant with Auth0 org ID
    listTenants: false, // list all tenants
    force: false       // force migration even if risky
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
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
      case '--public-only':
        options.publicOnly = true;
        break;
      case '--tenant-only':
        options.tenantOnly = true;
        break;
      case '--tenant':
      case '-t':
        options.tenant = args[++i];
        break;
      case '--create-tenant':
        options.createTenant = args[++i];
        break;
      case '--list-tenants':
        options.listTenants = true;
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
Multi-Tenant Migration Runner for Employer Portal

Usage: node migrate-employer-portal.js [options]

Options:
  -f, --file <filename>      Run specific migration file
  --dry-run                  Show what would be migrated without running
  -v, --verbose              Show detailed output
  --public-only              Only run public schema migrations
  --tenant-only              Only run tenant schema migrations
  -t, --tenant <schema>      Run migrations for specific tenant schema
  --create-tenant <org_id>   Create new tenant with Auth0 org ID
  --list-tenants             List all registered tenants
  --force                    Force migration even if risky
  -h, --help                 Show this help

Examples:
  node migrate-employer-portal.js                           # Run all pending migrations
  node migrate-employer-portal.js --public-only             # Run public schema migrations only
  node migrate-employer-portal.js --tenant-only             # Run tenant migrations for all tenants
  node migrate-employer-portal.js --tenant tenant_org_xyz   # Run migrations for specific tenant
  node migrate-employer-portal.js --create-tenant org_123   # Create new tenant
  node migrate-employer-portal.js --list-tenants            # List all tenants
  node migrate-employer-portal.js --dry-run                 # Show pending migrations
`);
}

// Database connection helper
async function createConnection(config) {
  if (!config.connectionString) {
    throw new Error(`Missing connection string for ${config.name}. Set EMPLOYER_PORTAL_DB_URL or DATABASE_URL.`);
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

// Get applied migrations from public schema
async function getAppliedMigrations(pool, tenantSchema = 'public') {
  try {
    const query = tenantSchema === 'public' 
      ? 'SELECT migration_version, migration_name, applied_at FROM public.tenant_migrations WHERE tenant_schema = $1 ORDER BY migration_version'
      : 'SELECT migration_version, migration_name, applied_at FROM public.tenant_migrations WHERE tenant_schema = $1 ORDER BY migration_version';
    
    const result = await pool.query(query, [tenantSchema]);
    return result.rows;
  } catch (error) {
    // Table doesn't exist yet, no migrations applied
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
}

// Get all registered tenants
async function getRegisteredTenants(pool) {
  try {
    const result = await pool.query(
      'SELECT schema_name, auth0_org_id, organization_name, status, created_at FROM public.tenant_registry WHERE status = $1 ORDER BY created_at',
      ['active']
    );
    return result.rows;
  } catch (error) {
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
}

// Get pending migrations for a schema
async function getPendingMigrations(migrationDir, pool, tenantSchema = 'public') {
  const allFiles = await getMigrationFiles(migrationDir);
  const appliedMigrations = await getAppliedMigrations(pool, tenantSchema);
  const appliedVersions = new Set(appliedMigrations.map(m => m.migration_version));

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
async function executeMigration(pool, migrationDir, filename, tenantSchema = 'public', options) {
  const filePath = path.join(migrationDir, filename);
  const version = filename.split('_')[0];
  
  console.log(`Running migration: ${filename} (${tenantSchema})`);
  
  if (options.dryRun) {
    console.log(`  [DRY RUN] Would execute: ${filename} on ${tenantSchema}`);
    return;
  }

  const sql = await readMigrationFile(filePath);
  
  if (options.verbose) {
    console.log(`  SQL Preview:\n${sql.substring(0, 200)}...`);
  }

  try {
    await pool.query('BEGIN');
    
    // Set search path if not public schema
    if (tenantSchema !== 'public') {
      await pool.query(`SET search_path TO ${tenantSchema}, public`);
    }
    
    // Execute the migration SQL
    await pool.query(sql);
    
    // Record the migration
    await pool.query(
      'INSERT INTO public.tenant_migrations (tenant_schema, migration_version, migration_name, rollback_sql) VALUES ($1, $2, $3, $4)',
      [tenantSchema, version, filename, `-- Rollback for ${filename}`]
    );
    
    await pool.query('COMMIT');
    console.log(`  ✅ Migration ${filename} completed successfully on ${tenantSchema}`);
    
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`  ❌ Migration ${filename} failed on ${tenantSchema}: ${error.message}`);
    throw error;
  }
}

// Create new tenant
async function createTenant(pool, auth0OrgId, organizationName, options) {
  console.log(`\n🏢 Creating new tenant: ${organizationName} (${auth0OrgId})`);
  
  if (options.dryRun) {
    console.log(`  [DRY RUN] Would create tenant: ${organizationName}`);
    return;
  }

  try {
    const result = await pool.query(
      'SELECT public.create_tenant_schema($1, $2) as schema_name',
      [auth0OrgId, organizationName]
    );
    
    const schemaName = result.rows[0].schema_name;
    console.log(`  ✅ Tenant created successfully: ${schemaName}`);
    
    return schemaName;
    
  } catch (error) {
    console.error(`  ❌ Failed to create tenant: ${error.message}`);
    throw error;
  }
}

// List tenants
async function listTenants(pool) {
  console.log('\n🏢 Registered Tenants:');
  
  const tenants = await getRegisteredTenants(pool);
  
  if (tenants.length === 0) {
    console.log('  No tenants registered yet.');
    return;
  }
  
  console.log(`  Found ${tenants.length} active tenant(s):\n`);
  
  tenants.forEach((tenant, index) => {
    console.log(`  ${index + 1}. ${tenant.organization_name}`);
    console.log(`     Schema: ${tenant.schema_name}`);
    console.log(`     Auth0 Org ID: ${tenant.auth0_org_id}`);
    console.log(`     Status: ${tenant.status}`);
    console.log(`     Created: ${tenant.created_at}\n`);
  });
}

// Run migrations for public schema
async function runPublicMigrations(pool, migrationDir, options) {
  console.log('\n🔧 Running public schema migrations...');
  
  const pendingMigrations = await getPendingMigrations(migrationDir, pool, 'public');
  
  if (pendingMigrations.length === 0) {
    console.log('  ✅ No pending public schema migrations');
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
    await executeMigration(pool, migrationDir, filename, 'public', options);
  }
  
  console.log('  ✅ Public schema migrations completed');
}

// Run migrations for all tenant schemas
async function runTenantMigrations(pool, migrationDir, options) {
  console.log('\n🔧 Running tenant schema migrations...');
  
  const tenants = await getRegisteredTenants(pool);
  
  if (tenants.length === 0) {
    console.log('  ⚠️  No tenants registered yet. Run public migrations first.');
    return;
  }
  
  console.log(`  📋 Found ${tenants.length} tenant(s) to migrate:`);
  tenants.forEach(tenant => console.log(`    - ${tenant.schema_name} (${tenant.organization_name})`));
  
  // Run migrations for each tenant
  for (const tenant of tenants) {
    console.log(`\n  🏢 Migrating tenant: ${tenant.organization_name}`);
    
    const pendingMigrations = await getPendingMigrations(migrationDir, pool, tenant.schema_name);
    
    if (pendingMigrations.length === 0) {
      console.log(`    ✅ No pending migrations for ${tenant.schema_name}`);
      continue;
    }
    
    console.log(`    📋 Found ${pendingMigrations.length} pending migration(s):`);
    pendingMigrations.forEach(file => console.log(`      - ${file}`));
    
    if (options.dryRun) {
      console.log(`    [DRY RUN] Would run ${pendingMigrations.length} migration(s)`);
      continue;
    }
    
    // Execute migrations in order
    for (const filename of pendingMigrations) {
      await executeMigration(pool, migrationDir, filename, tenant.schema_name, options);
    }
    
    console.log(`    ✅ Tenant ${tenant.schema_name} migrations completed`);
  }
  
  console.log('\n  ✅ All tenant migrations completed');
}

// Run migrations for specific tenant
async function runSpecificTenantMigrations(pool, migrationDir, tenantSchema, options) {
  console.log(`\n🔧 Running migrations for tenant: ${tenantSchema}`);
  
  // Verify tenant exists
  const tenant = await pool.query(
    'SELECT schema_name, organization_name FROM public.tenant_registry WHERE schema_name = $1 AND status = $2',
    [tenantSchema, 'active']
  );
  
  if (tenant.rows.length === 0) {
    throw new Error(`Tenant ${tenantSchema} not found or inactive`);
  }
  
  const pendingMigrations = await getPendingMigrations(migrationDir, pool, tenantSchema);
  
  if (pendingMigrations.length === 0) {
    console.log(`  ✅ No pending migrations for ${tenantSchema}`);
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
    await executeMigration(pool, migrationDir, filename, tenantSchema, options);
  }
  
  console.log(`  ✅ Tenant ${tenantSchema} migrations completed`);
}

// Main execution
async function main() {
  try {
    const options = parseArgs();
    
    console.log('🚀 Starting multi-tenant database migrations...');
    
    if (options.dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made');
    }
    
    // For dry-run mode, just show migration files without connecting
    if (options.dryRun && !CONFIG.main.connectionString) {
      const migrationFiles = await getMigrationFiles(CONFIG.main.migrationDir);
      console.log(`\n📋 Found ${migrationFiles.length} migration file(s):`);
      migrationFiles.forEach(file => console.log(`  - ${file}`));
      console.log('\n🔍 [DRY RUN] Would apply these migrations to:');
      console.log('  - Public schema');
      console.log('  - All tenant schemas');
      console.log('\n💡 Set EMPLOYER_PORTAL_DB_URL or DATABASE_URL to connect to database');
      return;
    }
    
    const pool = await createConnection(CONFIG.main);
    
    try {
      // Handle special commands
      if (options.listTenants) {
        await listTenants(pool);
        return;
      }
      
      if (options.createTenant) {
        const orgName = options.createTenant.replace(/^org_/, '').replace(/_/g, ' ');
        await createTenant(pool, options.createTenant, orgName, options);
        return;
      }
      
      // Run migrations based on options
      if (options.publicOnly) {
        await runPublicMigrations(pool, CONFIG.main.migrationDir, options);
      } else if (options.tenantOnly) {
        await runTenantMigrations(pool, CONFIG.main.migrationDir, options);
      } else if (options.tenant) {
        await runSpecificTenantMigrations(pool, CONFIG.main.migrationDir, options.tenant, options);
      } else {
        // Run all migrations (public first, then tenants)
        await runPublicMigrations(pool, CONFIG.main.migrationDir, options);
        await runTenantMigrations(pool, CONFIG.main.migrationDir, options);
      }
      
    } finally {
      await pool.end();
    }
    
    console.log('\n🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    // Check if options is defined and verbose is enabled
    if (typeof options !== 'undefined' && options.verbose) {
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
  runPublicMigrations,
  runTenantMigrations,
  runSpecificTenantMigrations,
  createTenant,
  listTenants,
  CONFIG
}; 