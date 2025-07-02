const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

/**
 * Script to find and test the RDS Proxy endpoint for TASK 10
 * 
 * This script helps identify the correct RDS Proxy endpoint and tests connectivity
 */

console.log('🔍 Finding RDS Proxy Endpoint for Auth Database...');
console.log('=============================================');

// Get the current direct RDS connection info
const currentConnection = process.env.BETTER_AUTH_DATABASE_URL;
if (!currentConnection) {
  console.error('❌ BETTER_AUTH_DATABASE_URL not found in .env.local');
  process.exit(1);
}

// Extract connection details
const urlMatch = currentConnection.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
if (!urlMatch) {
  console.error('❌ Could not parse current database URL');
  process.exit(1);
}

const [, username, password, hostname, port, database] = urlMatch;

console.log('📋 Current Direct RDS Connection:');
console.log('  Host:', hostname);
console.log('  Port:', port);
console.log('  Database:', database);
console.log('  User:', username);
console.log('');

// RDS Proxy endpoint patterns to try
// Format: <proxy-name>.proxy-<random-id>.<region>.rds.amazonaws.com
const possibleProxyNames = [
  'auroraauthproxy', // from log group name
  'aurora-auth-proxy',
  'auroraauth-proxy',
  'amplify-auroraauthproxy',
];

// We know we're in us-west-2 from the region in hostname
const region = 'us-west-2';

console.log('🔍 Searching for RDS Proxy endpoint...');
console.log('  Region:', region);
console.log('  Possible proxy names:', possibleProxyNames.join(', '));
console.log('');

// Function to test a potential proxy endpoint
async function testProxyEndpoint(proxyEndpoint) {
  const connectionString = `postgresql://${username}:${password}@${proxyEndpoint}:${port}/${database}`;
  
  console.log(`🧪 Testing: ${proxyEndpoint}`);
  
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
      ca: undefined,
      checkServerIdentity: () => undefined,
    },
    max: 5,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 3000,
    keepAlive: true,
    application_name: 'upskill-proxy-test',
  });
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT current_database(), current_user, version()');
    
    console.log('  ✅ SUCCESS! Found working RDS Proxy endpoint');
    console.log(`  📊 Connected to: ${result.rows[0].current_database}`);
    console.log(`  👤 User: ${result.rows[0].current_user}`);
    console.log('');
    
    client.release();
    await pool.end();
    
    return {
      success: true,
      endpoint: proxyEndpoint,
      connectionString: `postgresql://${username}@${proxyEndpoint}:${port}/${database}`, // Without password for env
    };
    
  } catch (error) {
    console.log(`  ❌ Failed: ${error.message.split('\n')[0]}`);
    await pool.end();
    return { success: false };
  }
}

// Function to generate possible proxy endpoints
function generateProxyEndpoints(proxyNames, region) {
  const endpoints = [];
  
  // Common patterns for AWS RDS Proxy endpoint suffixes
  const possibleSuffixes = [
    'ckihhrzw7t3s', // Common pattern
    'ckihhrzw7t3t',
    'ckihhrzw7t3u',
    'ckihhrzw7t3v',
    'ckihhrzw7t3w',
    'ckihhrzw7t3x',
    'ckihhrzw7t3y',
    'ckihhrzw7t3z',
    // Add more if needed
  ];
  
  proxyNames.forEach(proxyName => {
    possibleSuffixes.forEach(suffix => {
      endpoints.push(`${proxyName}.proxy-${suffix}.${region}.rds.amazonaws.com`);
    });
  });
  
  return endpoints;
}

// Main function to find the proxy
async function findRdsProxy() {
  const endpoints = generateProxyEndpoints(possibleProxyNames, region);
  
  console.log(`🔍 Generated ${endpoints.length} possible endpoints to test...`);
  console.log('');
  
  for (const endpoint of endpoints) {
    const result = await testProxyEndpoint(endpoint);
    
    if (result.success) {
      console.log('🎉 RDS PROXY FOUND!');
      console.log('================');
      console.log('');
      console.log('📝 Add this to your .env.local:');
      console.log(`AUTH_DB_URL=${result.connectionString}`);
      console.log('');
      console.log('🔧 Update BetterAuth configuration:');
      console.log('The auth.ts file is already configured to use AUTH_DB_URL as the primary connection string.');
      console.log('');
      console.log('✅ Next steps:');
      console.log('1. Add the AUTH_DB_URL to .env.local');
      console.log('2. Test the application with RDS Proxy');
      console.log('3. Update production environment variables');
      
      return result;
    }
    
    // Small delay to avoid overwhelming AWS
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('');
  console.log('❌ Could not find working RDS Proxy endpoint');
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('1. Verify RDS Proxy is deployed correctly');
  console.log('2. Check security groups allow connections');
  console.log('3. Verify the proxy name matches deployment');
  console.log('4. Check CloudFormation outputs for the actual endpoint');
  
  return null;
}

// Run the search
findRdsProxy().then(result => {
  if (!result) {
    console.log('');
    console.log('💡 Alternative: Check CloudFormation outputs directly:');
    console.log('aws cloudformation describe-stacks --stack-name <stack-name> --region us-west-2');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Error:', error.message);
  process.exit(1);
}); 