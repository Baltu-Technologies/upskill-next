const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

/**
 * Test script for TASK 10: BetterAuth RDS Proxy Integration
 * 
 * This script tests the database connection configuration for RDS Proxy
 */

console.log('🔍 Testing BetterAuth RDS Proxy Configuration...');
console.log('========================================');

// Check current environment variables
console.log('📋 Current Environment Variables:');
console.log('AUTH_DB_URL:', process.env.AUTH_DB_URL || 'NOT_SET');
console.log('BETTER_AUTH_DATABASE_URL:', process.env.BETTER_AUTH_DATABASE_URL || 'NOT_SET');
console.log('AUTH_RDS_PROXY_ENDPOINT:', process.env.AUTH_RDS_PROXY_ENDPOINT || 'NOT_SET');
console.log('AUTH_DB_MAX_CONNECTIONS:', process.env.AUTH_DB_MAX_CONNECTIONS || 'NOT_SET');
console.log('AUTH_DB_IDLE_TIMEOUT:', process.env.AUTH_DB_IDLE_TIMEOUT || 'NOT_SET');
console.log('');

// Determine which connection string to use
const connectionString = process.env.AUTH_DB_URL || process.env.BETTER_AUTH_DATABASE_URL;
if (!connectionString) {
  console.error('❌ No database connection string found!');
  console.error('   Please set AUTH_DB_URL or BETTER_AUTH_DATABASE_URL');
  process.exit(1);
}

console.log('🔗 Using Connection String:');
console.log('  ', connectionString.replace(/:[^:@]*@/, ':****@')); // Hide password
console.log('');

// Test if this is a proxy connection
const isProxyConnection = connectionString.includes('proxy-');
console.log('🔍 Connection Type:', isProxyConnection ? 'RDS PROXY ✅' : 'DIRECT RDS CONNECTION ⚠️');
console.log('');

// Test database connection
async function testConnection() {
  console.log('🧪 Testing Database Connection...');
  
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('rds.amazonaws.com') || connectionString.includes('proxy-')
      ? { 
          rejectUnauthorized: false,
          ca: undefined,
          checkServerIdentity: () => undefined,
        } 
      : false,
    max: parseInt(process.env.AUTH_DB_MAX_CONNECTIONS || '10'),
    idleTimeoutMillis: parseInt(process.env.AUTH_DB_IDLE_TIMEOUT || '5000'),
    connectionTimeoutMillis: parseInt(process.env.AUTH_DB_CONNECTION_TIMEOUT || '2000'),
    keepAlive: true,
    application_name: 'upskill-test-connection',
  });
  
  try {
    console.log('  Attempting connection...');
    const client = await pool.connect();
    
    console.log('  ✅ Connection successful!');
    
    // Test basic query
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('  📊 Database Info:');
    console.log('    PostgreSQL Version:', result.rows[0].version.split(' ').slice(0, 2).join(' '));
    console.log('    Database:', result.rows[0].current_database);
    console.log('    User:', result.rows[0].current_user);
    
    // Check if BetterAuth tables exist
    const tablesResult = await client.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' AND (table_name LIKE '%user%' OR table_name LIKE '%session%')
       ORDER BY table_name`
    );
    
    console.log('  📝 BetterAuth Tables:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log('    -', row.table_name);
      });
    } else {
      console.log('    ⚠️  No BetterAuth tables found (may need migration)');
    }
    
    client.release();
    await pool.end();
    
    console.log('');
    console.log('🎉 Database connection test completed successfully!');
    
    if (!isProxyConnection) {
      console.log('');
      console.log('⚠️  WARNING: You are connecting directly to RDS, not through RDS Proxy');
      console.log('   To use RDS Proxy, update your environment variables to use the proxy endpoint');
      console.log('   The proxy endpoint should look like:');
      console.log('   AUTH_DB_URL=postgresql://postgres@<proxy-name>.proxy-<id>.<region>.rds.amazonaws.com:5432/upskill_learner_dev');
    } else {
      console.log('');
      console.log('🎉 SUCCESS: Using RDS Proxy connection!');
      console.log('   This provides connection pooling, failover, and enhanced security.');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting Steps:');
    console.error('1. Verify the connection string is correct');
    console.error('2. Check if the RDS Proxy is deployed and accessible');
    console.error('3. Ensure security groups allow connections from your IP/Lambda');
    console.error('4. Verify database credentials in AWS Secrets Manager');
    
    await pool.end();
    process.exit(1);
  }
}

// Run tests
async function runTests() {
  try {
    await testConnection();
    
    console.log('');
    console.log('✅ Test completed!');
    console.log('');
    console.log('📋 Next Steps for TASK 10:');
    if (!connectionString.includes('proxy-')) {
      console.log('1. ⚠️  Update .env.local to use RDS Proxy endpoint');
      console.log('2. ✅ Test BetterAuth with proxy connection');
      console.log('3. ✅ Update production environment variables');
    } else {
      console.log('1. ✅ RDS Proxy configuration is working!');
      console.log('2. ✅ Test BetterAuth authentication flow');
      console.log('3. ✅ Update production environment variables');
    }
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

runTests(); 