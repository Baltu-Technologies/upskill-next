#!/usr/bin/env node

// Load environment variables
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development' });

const { Pool } = require('pg');

async function testRoleSystem() {
    console.log('🔍 Testing Role System');
    
    // Test database connection
    const dbPool = new Pool({
        connectionString: process.env.AUTH_DB_URL || process.env.BETTER_AUTH_DATABASE_URL,
        ssl: process.env.AUTH_DB_URL?.includes('proxy-') || process.env.BETTER_AUTH_DATABASE_URL?.includes('rds.amazonaws.com') 
            ? { rejectUnauthorized: false } 
            : false,
    });
    
    try {
        // Test basic connection
        console.log('📋 Testing database connection...');
        const result = await dbPool.query('SELECT NOW()');
        console.log('✅ Database connected:', result.rows[0]);
        
        // Check if user_roles table exists
        console.log('📋 Checking user_roles table...');
        const tableCheck = await dbPool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'user_roles'
            );
        `);
        console.log('✅ user_roles table exists:', tableCheck.rows[0].exists);
        
        // Check existing users
        console.log('📋 Checking existing users...');
        const users = await dbPool.query('SELECT id, email FROM "user" LIMIT 5');
        console.log('✅ Users found:', users.rows.length);
        users.rows.forEach(user => {
            console.log(`   - ${user.id}: ${user.email}`);
        });
        
        // Check user roles
        console.log('📋 Checking user roles...');
        const userRoles = await dbPool.query(`
            SELECT ur.user_id, ur.role, u.email 
            FROM user_roles ur 
            JOIN "user" u ON ur.user_id = u.id 
            LIMIT 10
        `);
        console.log('✅ User roles found:', userRoles.rows.length);
        userRoles.rows.forEach(row => {
            console.log(`   - ${row.email}: ${row.role}`);
        });
        
        // Test permission checking for first user
        if (users.rows.length > 0) {
            const firstUserId = users.rows[0].id;
            console.log(`📋 Testing permissions for user: ${firstUserId}`);
            
            const roles = await dbPool.query('SELECT role FROM user_roles WHERE user_id = $1', [firstUserId]);
            console.log('✅ User roles:', roles.rows.map(r => r.role));
            
            // Test if user has learner role
            const hasLearnerRole = await dbPool.query('SELECT user_has_role($1, $2)', [firstUserId, 'learner']);
            console.log('✅ Has learner role:', hasLearnerRole.rows[0].user_has_role);
        }
        
    } catch (error) {
        console.error('❌ Error testing role system:', error);
    } finally {
        await dbPool.end();
    }
}

testRoleSystem().catch(console.error); 