import { Amplify } from 'aws-amplify';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";

// Configure Amplify
Amplify.configure(outputs);

/**
 * Simple connection test script
 * Tests if Amplify can connect to DynamoDB
 */

async function testConnection() {
  console.log('🔌 Testing database connection...');

  try {
    const client = generateClient<Schema>();
    
    // Try to list candidates (should return empty array if no data)
    console.log('📡 Attempting to connect to DynamoDB...');
    const result = await client.models.Candidate.list({ limit: 1 });
    
    console.log('✅ Connection successful!');
    console.log(`Found ${result.data.length} candidate(s) in database`);
    
    if (result.data.length > 0) {
      console.log('📋 First candidate:', {
        id: result.data[0].id,
        name: `${result.data[0].firstName} ${result.data[0].lastName}`,
        email: result.data[0].email
      });
    } else {
      console.log('📭 Database is empty - ready for seeding!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure AWS credentials are configured: aws configure');
    console.log('2. Ensure Amplify sandbox is running: npm run db:sandbox');
    console.log('3. Check that amplify_outputs.json exists');
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then((success) => {
      if (success) {
        console.log('\n🎉 Ready to seed the database!');
        console.log('Run: npm run db:seed');
        process.exit(0);
      } else {
        console.log('\n⚠️  Please fix connection issues before seeding');
        process.exit(1);
      }
    });
}

export default testConnection; 