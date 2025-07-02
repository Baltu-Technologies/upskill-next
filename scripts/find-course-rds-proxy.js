const path = require('path');
require('dotenv').config({ path: '.env.local' });

/**
 * ========================================
 * TASK 11: Find Course RDS Proxy Endpoint ✅
 * ========================================
 * 
 * Utility script to help locate the course RDS Proxy endpoint
 * and configure the environment variables for Kysely
 */

console.log('🔍 Course RDS Proxy Endpoint Finder');
console.log('===================================');

console.log('📋 Current Configuration:');
console.log(`  COURSE_DB_URL: ${process.env.COURSE_DB_URL || 'NOT_SET'}`);
console.log(`  COURSE_RDS_PROXY_ENDPOINT: ${process.env.COURSE_RDS_PROXY_ENDPOINT || 'NOT_SET'}`);
console.log('');

// Check if endpoint is already configured
const courseDbUrl = process.env.COURSE_DB_URL || process.env.COURSE_RDS_PROXY_ENDPOINT;
const isConfigured = courseDbUrl && !courseDbUrl.includes('<COURSE_PROXY_ENDPOINT>');

if (isConfigured) {
  console.log('✅ Course RDS Proxy endpoint is already configured!');
  console.log(`   Endpoint: ${courseDbUrl}`);
  console.log(`   Type: ${courseDbUrl.includes('proxy-') ? 'RDS Proxy ✅' : 'Direct Connection ⚠️'}`);
  
  if (!courseDbUrl.includes('proxy-')) {
    console.log('');
    console.log('⚠️  Warning: This appears to be a direct database connection, not an RDS Proxy.');
    console.log('   For optimal performance and connection pooling, consider using the RDS Proxy endpoint.');
  }
  
  console.log('');
  console.log('🧪 Test database connection:');
  console.log('   node scripts/test-course-crud-operations.js');
  
  return;
}

console.log('🔧 How to Find Your Course RDS Proxy Endpoint:');
console.log('');

console.log('📱 Option 1: AWS Console (Easiest)');
console.log('  1. Go to: https://console.aws.amazon.com/rds/');
console.log('  2. Click "Proxies" in the left sidebar');
console.log('  3. Find "CourseRdsProxy" (or similar name)');
console.log('  4. Copy the "Endpoint" value');
console.log('  5. It should look like: courserds-proxy.proxy-<random>.us-west-2.rds.amazonaws.com');
console.log('');

console.log('💻 Option 2: AWS CLI');
console.log('  Run this command to list RDS proxies:');
console.log('  aws rds describe-db-proxies --region us-west-2');
console.log('');
console.log('  Look for a proxy with "course" in the name and copy the "Endpoint" value.');
console.log('');

console.log('📋 Option 3: CloudFormation');
console.log('  1. Go to: https://console.aws.amazon.com/cloudformation/');
console.log('  2. Find your Amplify stack (usually starts with "amplify-")');
console.log('  3. Go to "Outputs" tab');
console.log('  4. Look for "CourseRdsProxyEndpoint" or similar');
console.log('');

console.log('⚡ Option 4: Amplify CLI');
console.log('  Run: npx ampx sandbox outputs');
console.log('  Look for course RDS proxy related outputs');
console.log('');

console.log('🔧 Once you have the endpoint:');
console.log('');

console.log('1. Update your .env.local file:');
console.log('   Replace this line:');
console.log('   COURSE_DB_URL=postgresql://postgres@<COURSE_PROXY_ENDPOINT>:5432/upskill_course_data');
console.log('');
console.log('   With:');
console.log('   COURSE_DB_URL=postgresql://postgres@YOUR_ACTUAL_ENDPOINT:5432/upskill_course_data');
console.log('');

console.log('2. Test the connection:');
console.log('   node scripts/test-course-crud-operations.js');
console.log('');

console.log('3. Deploy to make endpoint available as environment variable:');
console.log('   npx ampx sandbox deploy');
console.log('');

console.log('🎯 Example Configuration:');
console.log('If your endpoint is: courserds-proxy.proxy-abc123.us-west-2.rds.amazonaws.com');
console.log('Your .env.local should have:');
console.log('COURSE_DB_URL=postgresql://postgres@courserds-proxy.proxy-abc123.us-west-2.rds.amazonaws.com:5432/upskill_course_data');
console.log('');

console.log('💡 Pro Tips:');
console.log('  • RDS Proxy endpoints contain "proxy-" in the hostname');
console.log('  • Direct RDS endpoints typically contain the instance name');
console.log('  • Always use the RDS Proxy for production applications');
console.log('  • The proxy handles connection pooling and failover automatically');
console.log('');

console.log('🔐 Security Notes:');
console.log('  • RDS Proxy uses IAM authentication when configured');
console.log('  • Credentials are managed through AWS Secrets Manager');
console.log('  • TLS encryption is enforced by default');
console.log('  • Connection pooling prevents connection exhaustion');
console.log('');

console.log('🚀 After configuration, you can:');
console.log('  ✅ Run full CRUD operation tests');
console.log('  ✅ Test connection pooling behavior');
console.log('  ✅ Deploy your application with confidence');
console.log('  ✅ Monitor database performance through RDS Proxy metrics');

console.log('');
console.log('📞 Need help? Check the AWS documentation:');
console.log('  https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html'); 