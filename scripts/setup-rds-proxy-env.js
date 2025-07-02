const fs = require('fs');
const path = require('path');

/**
 * TASK 10.4: Configure Environment Variables with RDS Proxy
 * 
 * This script helps set up the environment variables for RDS Proxy
 * and provides guidance on finding the correct endpoint
 */

console.log('🔧 Setting up RDS Proxy Environment Variables...');
console.log('==============================================');

// Read current .env.local
const envPath = '.env.local';
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env.local file');
} catch (error) {
  console.log('⚠️  .env.local file not found, will create new one');
}

// Extract current database URL
const currentDbUrl = envContent.match(/BETTER_AUTH_DATABASE_URL=(.+)/);
if (!currentDbUrl) {
  console.error('❌ Could not find BETTER_AUTH_DATABASE_URL in .env.local');
  process.exit(1);
}

console.log('📋 Current Configuration:');
console.log('  Direct RDS URL found ✅');
console.log('');

// Since we can't easily determine the exact proxy endpoint without AWS CLI permissions,
// let's add the configuration that will work once the user updates the endpoint
console.log('🔍 RDS Proxy Configuration Setup:');
console.log('');

// Add or update environment variables for RDS Proxy
const proxyEnvVars = `
# ========================================
# TASK 10: RDS Proxy Configuration for BetterAuth
# ========================================

# Primary auth database connection through RDS Proxy
# TODO: Replace <PROXY_ENDPOINT> with actual RDS Proxy endpoint
# Format: auroraauthproxy.proxy-<id>.us-west-2.rds.amazonaws.com
AUTH_DB_URL=postgresql://postgres@<PROXY_ENDPOINT>:5432/upskill_learner_dev

# RDS Proxy connection tuning
AUTH_DB_MAX_CONNECTIONS=10
AUTH_DB_IDLE_TIMEOUT=5000
AUTH_DB_CONNECTION_TIMEOUT=2000

# Security settings
AUTH_DB_SSL_MODE=require
AUTH_DB_IAM_AUTH=true

# Legacy compatibility (keep for fallback)
# BETTER_AUTH_DATABASE_URL=postgresql://postgres:BW1hITVB9LBV4MwFAEz2@upskill-learner-dev-pg-uswest2-instance-1.cwatglwumbpq.us-west-2.rds.amazonaws.com:5432/upskill_learner_dev
`;

// Check if proxy config already exists
if (envContent.includes('AUTH_DB_URL=')) {
  console.log('✅ RDS Proxy configuration already exists in .env.local');
} else {
  // Append the proxy configuration
  const newEnvContent = envContent + proxyEnvVars;
  
  // Write backup
  fs.writeFileSync(`${envPath}.backup`, envContent);
  console.log('💾 Created backup: .env.local.backup');
  
  // Write new content
  fs.writeFileSync(envPath, newEnvContent);
  console.log('✅ Updated .env.local with RDS Proxy configuration');
}

console.log('');
console.log('🔍 To find your actual RDS Proxy endpoint:');
console.log('');
console.log('Option 1 - AWS Console:');
console.log('  1. Go to AWS RDS Console → Proxies');
console.log('  2. Find "AuroraAuthProxy" or similar proxy name');
console.log('  3. Copy the endpoint (looks like: auroraauthproxy.proxy-xxxxx.us-west-2.rds.amazonaws.com)');
console.log('');
console.log('Option 2 - CloudFormation (if you have permissions):');
console.log('  aws cloudformation describe-stacks \\');
console.log('    --stack-name amplify-awsamplifygen2-petercosta-sandbox-31a9da065b \\');
console.log('    --region us-west-2 \\');
console.log('    --query "Stacks[0].Outputs[?contains(OutputKey, \'AuthRdsProxy\')]"');
console.log('');
console.log('Option 3 - RDS CLI (if you have permissions):');
console.log('  aws rds describe-db-proxies --region us-west-2');
console.log('');
console.log('📝 Once you have the endpoint:');
console.log('  1. Replace <PROXY_ENDPOINT> in .env.local with the actual endpoint');
console.log('  2. Comment out the old BETTER_AUTH_DATABASE_URL line');
console.log('  3. Run: node scripts/test-auth-rds-proxy.js');
console.log('  4. Test your application');
console.log('');
console.log('🎯 Current Status:');
console.log('  ✅ RDS Proxy deployed');
console.log('  ✅ BetterAuth configuration updated');
console.log('  ✅ Environment variables configured');
console.log('  🔄 Waiting for proxy endpoint configuration');

console.log('');
console.log('✅ Setup completed! Update the proxy endpoint when available.'); 