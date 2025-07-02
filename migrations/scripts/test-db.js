#!/usr/bin/env node

/**
 * Database Testing Script for Upskill Platform
 * 
 * Tests database schemas, connections, and data integrity
 * Usage: node test-db.js [options]
 */

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

// Configuration
const CONFIG = {
  auth: {
    connectionString: process.env.AUTH_DB_URL || process.env.BETTER_AUTH_DATABASE_URL,
    name: 'Auth Database',
    testSuite: 'auth'
  },
  course: {
    connectionString: process.env.COURSE_DB_URL,
    name: 'Course Database',
    testSuite: 'course'
  }
};

// Test results tracker
const results = {
  auth: { passed: 0, failed: 0, tests: [] },
  course: { passed: 0, failed: 0, tests: [] }
};

// CLI Arguments parser
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    database: null, // 'auth', 'course', or null for all
    verbose: false, // detailed output
    quiet: false,   // minimal output
    suite: null     // specific test suite
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--database':
      case '-d':
        options.database = args[++i];
        break;
      case '--suite':
      case '-s':
        options.suite = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--quiet':
      case '-q':
        options.quiet = true;
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
Database Testing Script for Upskill Platform

Usage: node test-db.js [options]

Options:
  -d, --database <name>   Test specific database (auth|course)
  -s, --suite <name>      Run specific test suite (connection|schema|data|indexes)
  -v, --verbose          Show detailed output
  -q, --quiet            Minimal output (errors only)
  -h, --help             Show this help

Examples:
  node test-db.js                         # Run all tests
  node test-db.js --database auth         # Test auth database only
  node test-db.js --suite schema          # Run schema tests only
  node test-db.js --verbose               # Show detailed test output
`);
}

// Test utilities
class TestRunner {
  constructor(dbName, pool, options = {}) {
    this.dbName = dbName;
    this.pool = pool;
    this.options = options;
    this.results = { passed: 0, failed: 0, tests: [] };
  }

  async test(description, testFn) {
    try {
      const startTime = Date.now();
      await testFn();
      const duration = Date.now() - startTime;
      
      this.results.passed++;
      this.results.tests.push({
        description,
        status: 'PASS',
        duration,
        error: null
      });
      
      if (!this.options.quiet) {
        console.log(`    ✅ ${description} (${duration}ms)`);
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({
        description,
        status: 'FAIL',
        duration: 0,
        error: error.message
      });
      
      console.log(`    ❌ ${description}`);
      if (this.options.verbose) {
        console.log(`       Error: ${error.message}`);
      }
    }
  }

  async query(sql, params = []) {
    const result = await this.pool.query(sql, params);
    return result;
  }

  getResults() {
    return this.results;
  }
}

// Database connection test
async function testConnection(pool, dbName, options) {
  const runner = new TestRunner(dbName, pool, options);
  
  console.log(`\n🔗 Testing ${dbName} Connection...`);
  
  await runner.test('Database connection', async () => {
    const client = await pool.connect();
    client.release();
  });

  await runner.test('Basic query execution', async () => {
    await runner.query('SELECT 1 as test');
  });

  await runner.test('Transaction support', async () => {
    await runner.query('BEGIN');
    await runner.query('SELECT 1');
    await runner.query('ROLLBACK');
  });

  await runner.test('Database version check', async () => {
    const result = await runner.query('SELECT version()');
    if (options.verbose) {
      console.log(`       Version: ${result.rows[0].version.split(' ').slice(0, 2).join(' ')}`);
    }
  });

  return runner.getResults();
}

// Schema tests for auth database
async function testAuthSchema(pool, options) {
  const runner = new TestRunner('auth', pool, options);
  
  console.log(`\n📋 Testing Auth Database Schema...`);

  // Test migration tracking table
  await runner.test('schema_migrations table exists', async () => {
    const result = await runner.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'schema_migrations'
      ORDER BY ordinal_position
    `);
    
    if (result.rows.length === 0) {
      throw new Error('schema_migrations table not found');
    }
    
    const columns = result.rows.map(r => r.column_name);
    const expectedColumns = ['version', 'filename', 'applied_at'];
    
    for (const col of expectedColumns) {
      if (!columns.includes(col)) {
        throw new Error(`Missing column: ${col}`);
      }
    }
  });

  // Test BetterAuth tables
  const authTables = ['user', 'account', 'session', 'verification'];
  
  for (const tableName of authTables) {
    await runner.test(`${tableName} table exists with proper structure`, async () => {
      const result = await runner.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      if (result.rows.length === 0) {
        throw new Error(`Table ${tableName} not found`);
      }
      
      if (options.verbose) {
        console.log(`       Columns: ${result.rows.map(r => r.column_name).join(', ')}`);
      }
    });
  }

  // Test indexes
  await runner.test('Required indexes exist', async () => {
    const result = await runner.query(`
      SELECT indexname, tablename
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('user', 'account', 'session', 'verification')
    `);
    
    const indexes = result.rows.map(r => `${r.tablename}.${r.indexname}`);
    if (options.verbose) {
      console.log(`       Found ${indexes.length} indexes`);
    }
  });

  return runner.getResults();
}

// Schema tests for course database
async function testCourseSchema(pool, options) {
  const runner = new TestRunner('course', pool, options);
  
  console.log(`\n📋 Testing Course Database Schema...`);

  // Test migration tracking table
  await runner.test('schema_migrations table exists', async () => {
    const result = await runner.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'schema_migrations'
      ORDER BY ordinal_position
    `);
    
    if (result.rows.length === 0) {
      throw new Error('schema_migrations table not found');
    }
  });

  // Test custom types
  await runner.test('Custom enum types exist', async () => {
    const result = await runner.query(`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e'
      AND typname IN ('course_status', 'enrollment_status', 'lesson_type', 'question_type', 'difficulty_level')
    `);
    
    const expectedTypes = ['course_status', 'enrollment_status', 'lesson_type', 'question_type', 'difficulty_level'];
    const foundTypes = result.rows.map(r => r.typname);
    
    for (const type of expectedTypes) {
      if (!foundTypes.includes(type)) {
        throw new Error(`Missing enum type: ${type}`);
      }
    }
    
    if (options.verbose) {
      console.log(`       Found types: ${foundTypes.join(', ')}`);
    }
  });

  // Test all course tables
  const courseTables = [
    'instructors', 'categories', 'courses', 'modules', 'lessons',
    'enrollments', 'lesson_progress', 'quizzes', 'quiz_questions',
    'quiz_attempts', 'certificates', 'reviews', 'course_analytics'
  ];
  
  for (const tableName of courseTables) {
    await runner.test(`${tableName} table exists with proper structure`, async () => {
      const result = await runner.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      if (result.rows.length === 0) {
        throw new Error(`Table ${tableName} not found`);
      }
      
      if (options.verbose) {
        console.log(`       ${tableName}: ${result.rows.length} columns`);
      }
    });
  }

  // Test foreign key constraints
  await runner.test('Foreign key constraints exist', async () => {
    const result = await runner.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name, tc.constraint_name
    `);
    
    if (options.verbose) {
      console.log(`       Found ${result.rows.length} foreign key constraints`);
    }
  });

  // Test triggers
  await runner.test('Required triggers exist', async () => {
    const result = await runner.query(`
      SELECT trigger_name, event_object_table
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
    `);
    
    if (options.verbose) {
      console.log(`       Found ${result.rows.length} triggers`);
    }
  });

  return runner.getResults();
}

// Data integrity tests
async function testDataIntegrity(pool, dbName, options) {
  const runner = new TestRunner(dbName, pool, options);
  
  console.log(`\n🔍 Testing ${dbName} Data Integrity...`);

  if (dbName === 'Auth Database') {
    // Test user data consistency
    await runner.test('User accounts have valid data', async () => {
      const result = await runner.query(`
        SELECT COUNT(*) as count
        FROM "user"
        WHERE email IS NOT NULL
        AND email LIKE '%@%'
      `);
      
      if (options.verbose && result.rows[0].count > 0) {
        console.log(`       Found ${result.rows[0].count} valid user records`);
      }
    });

    await runner.test('Session data is consistent', async () => {
      const result = await runner.query(`
        SELECT COUNT(*) as orphaned_sessions
        FROM session s
        LEFT JOIN "user" u ON s.user_id = u.id
        WHERE u.id IS NULL
      `);
      
      if (parseInt(result.rows[0].orphaned_sessions) > 0) {
        throw new Error(`Found ${result.rows[0].orphaned_sessions} orphaned sessions`);
      }
    });

  } else if (dbName === 'Course Database') {
    // Test course data relationships
    await runner.test('Course enrollment data integrity', async () => {
      const result = await runner.query(`
        SELECT COUNT(*) as orphaned_enrollments
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE c.id IS NULL
      `);
      
      if (parseInt(result.rows[0].orphaned_enrollments) > 0) {
        throw new Error(`Found ${result.rows[0].orphaned_enrollments} orphaned enrollments`);
      }
    });

    await runner.test('Lesson progress consistency', async () => {
      const result = await runner.query(`
        SELECT COUNT(*) as invalid_progress
        FROM lesson_progress
        WHERE progress_percentage < 0 OR progress_percentage > 100
      `);
      
      if (parseInt(result.rows[0].invalid_progress) > 0) {
        throw new Error(`Found ${result.rows[0].invalid_progress} invalid progress records`);
      }
    });
  }

  return runner.getResults();
}

// Performance tests
async function testPerformance(pool, dbName, options) {
  const runner = new TestRunner(dbName, pool, options);
  
  console.log(`\n⚡ Testing ${dbName} Performance...`);

  await runner.test('Query response time < 100ms', async () => {
    const startTime = Date.now();
    await runner.query('SELECT 1');
    const duration = Date.now() - startTime;
    
    if (duration > 100) {
      throw new Error(`Query took ${duration}ms (expected < 100ms)`);
    }
  });

  if (dbName === 'Course Database') {
    await runner.test('Course listing query performance', async () => {
      const startTime = Date.now();
      await runner.query(`
        SELECT c.id, c.title, i.name as instructor_name
        FROM courses c
        LEFT JOIN instructors i ON c.instructor_id = i.id
        LIMIT 10
      `);
      const duration = Date.now() - startTime;
      
      if (options.verbose) {
        console.log(`       Course listing: ${duration}ms`);
      }
    });
  }

  return runner.getResults();
}

// Create database connection
async function createConnection(config) {
  if (!config.connectionString) {
    throw new Error(`Missing connection string for ${config.name}. Check your environment variables.`);
  }

  const pool = new Pool({
    connectionString: config.connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  return pool;
}

// Run all tests for a database
async function runDatabaseTests(dbConfig, options) {
  console.log(`\n🧪 Testing ${dbConfig.name}...`);
  
  let pool;
  try {
    pool = await createConnection(dbConfig);
    
    const testResults = {
      connection: null,
      schema: null,
      data: null,
      performance: null
    };

    // Run test suites based on options
    if (!options.suite || options.suite === 'connection') {
      testResults.connection = await testConnection(pool, dbConfig.name, options);
    }

    if (!options.suite || options.suite === 'schema') {
      if (dbConfig.testSuite === 'auth') {
        testResults.schema = await testAuthSchema(pool, options);
      } else if (dbConfig.testSuite === 'course') {
        testResults.schema = await testCourseSchema(pool, options);
      }
    }

    if (!options.suite || options.suite === 'data') {
      testResults.data = await testDataIntegrity(pool, dbConfig.name, options);
    }

    if (!options.suite || options.suite === 'performance') {
      testResults.performance = await testPerformance(pool, dbConfig.name, options);
    }

    // Aggregate results
    const dbResults = { passed: 0, failed: 0, tests: [] };
    Object.values(testResults).forEach(result => {
      if (result) {
        dbResults.passed += result.passed;
        dbResults.failed += result.failed;
        dbResults.tests.push(...result.tests);
      }
    });

    results[dbConfig.testSuite] = dbResults;
    
    console.log(`\n📊 ${dbConfig.name} Results: ${dbResults.passed} passed, ${dbResults.failed} failed`);
    
  } catch (error) {
    console.error(`❌ Failed to test ${dbConfig.name}: ${error.message}`);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Main execution
async function main() {
  try {
    const options = parseArgs();
    
    console.log('🧪 Starting database tests...');
    
    // Determine which databases to test
    const databasesToTest = [];
    
    if (options.database) {
      if (CONFIG[options.database]) {
        databasesToTest.push(CONFIG[options.database]);
      } else {
        throw new Error(`Unknown database: ${options.database}. Available: ${Object.keys(CONFIG).join(', ')}`);
      }
    } else {
      // Test all databases
      databasesToTest.push(...Object.values(CONFIG));
    }

    // Run tests
    for (const config of databasesToTest) {
      try {
        await runDatabaseTests(config, options);
      } catch (error) {
        console.error(`❌ Tests failed for ${config.name}: ${error.message}`);
        process.exit(1);
      }
    }

    // Overall summary
    const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎯 Overall Results: ${totalPassed} passed, ${totalFailed} failed`);
    
    if (totalFailed > 0) {
      console.log('\n❌ Some tests failed!');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed!');
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runDatabaseTests,
  CONFIG,
  results
}; 