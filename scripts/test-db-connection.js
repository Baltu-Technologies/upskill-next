#!/usr/bin/env node

/**
 * Test Aurora PostgreSQL Connection
 * This script helps diagnose connection issues with your Aurora database
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    console.log('🔍 Testing Aurora PostgreSQL Connection...\n');
    
    const connectionString = process.env.BETTER_AUTH_DATABASE_URL;
    
    if (!connectionString) {
        console.error('❌ BETTER_AUTH_DATABASE_URL not found in .env.local');
        return;
    }
    
    console.log('📋 Connection Details:');
    console.log(`Database URL: ${connectionString.replace(/:[^:]*@/, ':****@')}`);
    
    const pool = new Pool({
        connectionString,
        ssl: process.env.BETTER_AUTH_NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 1, // Just one connection for testing
        idleTimeoutMillis: 5000,
        connectionTimeoutMillis: 10000, // 10 seconds timeout
    });

    try {
        console.log('\n⏳ Attempting to connect...');
        const start = Date.now();
        
        const client = await pool.connect();
        const duration = Date.now() - start;
        
        console.log(`✅ Connected successfully! (${duration}ms)`);
        
        // Test basic query
        console.log('\n🔍 Testing basic query...');
        const result = await client.query('SELECT version();');
        console.log(`✅ Database version: ${result.rows[0].version}`);
        
        // Check if our tables exist
        console.log('\n📋 Checking for Better Auth tables...');
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('user', 'session', 'account', 'verification')
            ORDER BY table_name;
        `);
        
        if (tablesResult.rows.length === 0) {
            console.log('⚠️  No Better Auth tables found - you need to run the schema initialization');
            console.log('   Run: node scripts/init-db-aurora.js');
        } else {
            console.log('✅ Found tables:', tablesResult.rows.map(r => r.table_name).join(', '));
        }
        
        client.release();
        
    } catch (error) {
        console.error('\n❌ Connection failed:');
        console.error('Error:', error.message);
        
        if (error.code === 'ENOTFOUND') {
            console.log('\n🔧 Possible fixes:');
            console.log('1. Check if the Aurora endpoint is correct');
            console.log('2. Verify the region in the endpoint matches your Aurora cluster');
        } else if (error.code === 'ECONNREFUSED' || error.message.includes('timeout')) {
            console.log('\n🔧 Possible fixes:');
            console.log('1. Check Aurora Security Group - ensure port 5432 is open to your IP');
            console.log('2. Verify "Public Access" is enabled on your Aurora cluster');
            console.log('3. Check if Aurora is in the correct VPC/subnet');
        } else if (error.message.includes('authentication')) {
            console.log('\n🔧 Possible fixes:');
            console.log('1. Verify username/password in the connection string');
            console.log('2. Check if the database name exists');
        }
    } finally {
        await pool.end();
        console.log('\n🔒 Connection pool closed');
    }
}

testConnection().catch(console.error); 