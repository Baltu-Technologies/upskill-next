#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development' });

async function runMigration() {
    // Database connection configuration
    const databaseUrl = process.env.BETTER_AUTH_DATABASE_URL;
    
    if (!databaseUrl) {
        console.error('❌ BETTER_AUTH_DATABASE_URL environment variable is not set');
        console.log('Available environment variables:');
        console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
        console.log('- BETTER_AUTH_DATABASE_URL:', process.env.BETTER_AUTH_DATABASE_URL ? 'SET' : 'NOT SET');
        process.exit(1);
    }

    console.log('🚀 Starting user roles migration...');
    console.log('📍 Database URL:', databaseUrl.substring(0, 50) + '...');
    
    // Create database pool
    const pool = new Pool({
        connectionString: databaseUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        // Test connection
        const client = await pool.connect();
        console.log('✅ Database connection successful');
        
        // Read migration file
        const migrationPath = path.join(__dirname, '../migrations/auth/002_user_roles_schema.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        console.log('📄 Running migration: 002_user_roles_schema.sql');
        
        // Execute migration
        await client.query(migrationSQL);
        
        console.log('✅ Migration completed successfully!');
        
        // Verify the migration worked
        const roleCheck = await client.query('SELECT COUNT(*) FROM user_roles');
        console.log(`📊 User roles created: ${roleCheck.rows[0].count}`);
        
        const userCheck = await client.query('SELECT COUNT(*) FROM "user"');
        console.log(`👥 Total users: ${userCheck.rows[0].count}`);
        
        client.release();
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the migration
runMigration().catch(console.error); 