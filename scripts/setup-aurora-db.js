const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.BETTER_AUTH_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Connecting to Aurora database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to Aurora database successfully!');
    
    // Read the SQL schema file
    const sqlFile = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('🔄 Creating database schema...');
    
    // Execute the SQL commands
    await client.query(sql);
    
    console.log('✅ Database schema created successfully!');
    console.log('📋 Created tables:');
    console.log('   - user');
    console.log('   - session');
    console.log('   - account');
    console.log('   - verification');
    
    // Verify tables exist
    console.log('\n🔍 Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user', 'session', 'account', 'verification')
      ORDER BY table_name;
    `);
    
    console.log('✅ Verified tables:', result.rows.map(row => row.table_name));
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 