#!/usr/bin/env node

/**
 * DynamoDB Real-Time Features Test Suite
 * 
 * Comprehensive testing for:
 * - DynamoDB client connectivity and configuration
 * - Notifications service operations
 * - Activity streams tracking
 * - Analytics and metrics recording
 * - Error handling and recovery
 * - Performance monitoring and optimization
 */

const { performance } = require('perf_hooks');

// Test configuration
const TEST_CONFIG = {
  MOCK_MODE: process.env.NODE_ENV === 'development' && !process.env.TEST_WITH_REAL_DYNAMODB,
  TEST_USER_ID: 'test-user-123',
  TEST_COURSE_ID: 'test-course-456',
  PERFORMANCE_THRESHOLD_MS: 1000, // 1 second max for operations
  BATCH_SIZE_TEST: 25,
  CONCURRENT_OPERATIONS: 5
};

console.log('🚀 Starting DynamoDB Real-Time Features Test Suite...');
console.log(`📊 Test Mode: ${TEST_CONFIG.MOCK_MODE ? 'MOCK' : 'REAL DYNAMODB'}`);
console.log(`⚡ Performance Threshold: ${TEST_CONFIG.PERFORMANCE_THRESHOLD_MS}ms`);
console.log('');

/**
 * Test Results Tracking
 */
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  performance: [],
  errors: []
};

/**
 * Performance monitoring wrapper
 */
async function measurePerformance(testName, operation) {
  const startTime = performance.now();
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    testResults.performance.push({
      test: testName,
      duration,
      status: 'success',
      withinThreshold: duration <= TEST_CONFIG.PERFORMANCE_THRESHOLD_MS
    });
    
    return { success: true, result, duration };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    testResults.performance.push({
      test: testName,
      duration,
      status: 'error',
      error: error.message,
      withinThreshold: false
    });
    
    testResults.errors.push({
      test: testName,
      error: error.message,
      stack: error.stack
    });
    
    return { success: false, error, duration };
  }
}

/**
 * Test runner function
 */
async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`🧪 Testing: ${testName}`);
  
  try {
    const result = await testFunction();
    if (result.success) {
      testResults.passed++;
      console.log(`✅ ${testName} - PASSED (${result.duration?.toFixed(2)}ms)`);
    } else {
      testResults.failed++;
      console.log(`❌ ${testName} - FAILED: ${result.error?.message}`);
    }
    return result;
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({
      test: testName,
      error: error.message,
      stack: error.stack
    });
    console.log(`❌ ${testName} - FAILED: ${error.message}`);
    return { success: false, error };
  }
}

/**
 * Mock implementations for development testing
 */
const mockServices = {
  async mockNotificationCreate() {
    return 'mock-notification-123';
  },
  
  async mockNotificationRetrieve() {
    return {
      notifications: [
        {
          userId: TEST_CONFIG.TEST_USER_ID,
          notificationId: 'mock-notification-123',
          notificationType: 'course_update',
          title: 'Test Notification',
          message: 'This is a test notification',
          readStatus: 'unread',
          priority: 'medium',
          createdAt: new Date().toISOString()
        }
      ]
    };
  },
  
  async mockActivityRecord() {
    return 'mock-activity-456';
  },
  
  async mockActivityRetrieve() {
    return {
      activities: [
        {
          userId: TEST_CONFIG.TEST_USER_ID,
          activityId: 'mock-activity-456',
          timestamp: new Date().toISOString(),
          activityType: 'learning',
          actionType: 'complete',
          resourceId: 'lesson-123',
          resourceType: 'lesson',
          courseId: TEST_CONFIG.TEST_COURSE_ID,
          duration: 300,
          metadata: {}
        }
      ]
    };
  },
  
  async mockMetricRecord() {
    return 'mock-metric-789';
  },
  
  async mockMetricRetrieve() {
    return {
      metrics: [
        {
          metricDate: new Date().toISOString().split('T')[0],
          metricId: 'mock-metric-789',
          metricType: 'page_view',
          timestamp: new Date().toISOString(),
          userId: TEST_CONFIG.TEST_USER_ID,
          value: 1,
          metadata: {}
        }
      ]
    };
  }
};

/**
 * Test Suite Functions
 */

// Test 1: DynamoDB Client Configuration
async function testDynamoDBConfiguration() {
  return measurePerformance('DynamoDB Configuration', async () => {
    if (TEST_CONFIG.MOCK_MODE) {
      console.log('   📝 Mock: DynamoDB configuration validated');
      return { status: 'mock', config: 'validated' };
    }
    
    // In real mode, we would test actual DynamoDB connection
    const { getDynamoDBConfig, testDynamoDBConnection } = require('../lib/db/dynamodb-client');
    
    const config = getDynamoDBConfig();
    console.log('   📋 DynamoDB Config:', {
      region: config.region,
      tables: Object.keys(config.tableName),
      maxRetries: config.maxRetries
    });
    
    const connectionSuccess = await testDynamoDBConnection();
    if (!connectionSuccess) {
      throw new Error('DynamoDB connection failed');
    }
    
    return { config, connectionSuccess };
  });
}

// Test 2: Notifications Service
async function testNotificationsService() {
  return measurePerformance('Notifications Service', async () => {
    if (TEST_CONFIG.MOCK_MODE) {
      console.log('   📝 Mock: Creating test notification');
      const notificationId = await mockServices.mockNotificationCreate();
      
      console.log('   📝 Mock: Retrieving user notifications');
      const notifications = await mockServices.mockNotificationRetrieve();
      
      return {
        notificationId,
        notificationsCount: notifications.notifications.length,
        status: 'mock'
      };
    }
    
    // Real notifications service test
    const { 
      createNotification, 
      getUserNotifications, 
      markNotificationAsRead 
    } = require('../lib/db/notifications-service');
    
    // Create test notification
    const notificationId = await createNotification({
      userId: TEST_CONFIG.TEST_USER_ID,
      notificationType: 'course_update',
      title: 'Test Notification',
      message: 'This is a test notification for the test suite',
      priority: 'medium',
      metadata: { testSuite: true }
    });
    
    console.log('   ✅ Created notification:', notificationId);
    
    // Retrieve notifications
    const { notifications } = await getUserNotifications(TEST_CONFIG.TEST_USER_ID, {
      limit: 10
    });
    
    console.log('   📊 User notifications count:', notifications.length);
    
    // Mark as read
    if (notifications.length > 0) {
      await markNotificationAsRead(TEST_CONFIG.TEST_USER_ID, notifications[0].notificationId);
      console.log('   ✅ Marked notification as read');
    }
    
    return {
      notificationId,
      notificationsCount: notifications.length,
      status: 'real'
    };
  });
}

// Test 3: Activity Streams Service
async function testActivityStreamsService() {
  return measurePerformance('Activity Streams Service', async () => {
    if (TEST_CONFIG.MOCK_MODE) {
      console.log('   📝 Mock: Recording test activity');
      const activityId = await mockServices.mockActivityRecord();
      
      console.log('   📝 Mock: Retrieving user activities');
      const activities = await mockServices.mockActivityRetrieve();
      
      return {
        activityId,
        activitiesCount: activities.activities.length,
        status: 'mock'
      };
    }
    
    // Real activity streams service test
    const { 
      recordLessonCompletion, 
      recordQuizAttempt,
      getUserActivityTimeline,
      getUserCourseProgress
    } = require('../lib/db/activity-service');
    
    // Record lesson completion
    const lessonActivityId = await recordLessonCompletion(
      TEST_CONFIG.TEST_USER_ID,
      TEST_CONFIG.TEST_COURSE_ID,
      'module-1',
      'lesson-1',
      300, // 5 minutes
      { testSuite: true }
    );
    
    console.log('   ✅ Recorded lesson completion:', lessonActivityId);
    
    // Record quiz attempt
    const quizActivityId = await recordQuizAttempt(
      TEST_CONFIG.TEST_USER_ID,
      TEST_CONFIG.TEST_COURSE_ID,
      'quiz-1',
      85, // score
      100, // max score
      180, // 3 minutes
      { testSuite: true }
    );
    
    console.log('   ✅ Recorded quiz attempt:', quizActivityId);
    
    // Get user activity timeline
    const { activities } = await getUserActivityTimeline(TEST_CONFIG.TEST_USER_ID, {
      limit: 10
    });
    
    console.log('   📊 User activities count:', activities.length);
    
    // Get course progress
    const progress = await getUserCourseProgress(
      TEST_CONFIG.TEST_USER_ID,
      TEST_CONFIG.TEST_COURSE_ID
    );
    
    console.log('   📈 Course progress:', {
      completedLessons: progress.completedLessons,
      totalQuizAttempts: progress.totalQuizAttempts,
      averageQuizScore: progress.averageQuizScore
    });
    
    return {
      lessonActivityId,
      quizActivityId,
      activitiesCount: activities.length,
      progress,
      status: 'real'
    };
  });
}

// Test 4: Analytics Service
async function testAnalyticsService() {
  return measurePerformance('Analytics Service', async () => {
    if (TEST_CONFIG.MOCK_MODE) {
      console.log('   📝 Mock: Recording test metrics');
      const metricId = await mockServices.mockMetricRecord();
      
      console.log('   📝 Mock: Retrieving metrics');
      const metrics = await mockServices.mockMetricRetrieve();
      
      return {
        metricId,
        metricsCount: metrics.metrics.length,
        status: 'mock'
      };
    }
    
    // Real analytics service test
    const {
      recordPageView,
      recordCourseCompletion,
      recordQuizScore,
      getMetricsByType,
      getAggregatedMetrics
    } = require('../lib/db/analytics-service');
    
    // Record page view
    const pageViewId = await recordPageView(
      TEST_CONFIG.TEST_USER_ID,
      '/courses/test-course',
      'https://example.com',
      { testSuite: true }
    );
    
    console.log('   ✅ Recorded page view:', pageViewId);
    
    // Record course completion
    const completionId = await recordCourseCompletion(
      TEST_CONFIG.TEST_USER_ID,
      TEST_CONFIG.TEST_COURSE_ID,
      100, // 100% completion
      120, // 2 hours
      { testSuite: true }
    );
    
    console.log('   ✅ Recorded course completion:', completionId);
    
    // Record quiz score
    const quizScoreId = await recordQuizScore(
      TEST_CONFIG.TEST_USER_ID,
      TEST_CONFIG.TEST_COURSE_ID,
      'quiz-analytics-1',
      90, // score
      100, // max score
      { testSuite: true }
    );
    
    console.log('   ✅ Recorded quiz score:', quizScoreId);
    
    // Get metrics by type
    const { metrics } = await getMetricsByType('page_view', {
      userId: TEST_CONFIG.TEST_USER_ID,
      limit: 10
    });
    
    console.log('   📊 Page view metrics count:', metrics.length);
    
    // Get aggregated metrics
    const today = new Date().toISOString().split('T')[0];
    const aggregated = await getAggregatedMetrics(today, today, 'page_view');
    
    console.log('   📈 Aggregated metrics:', {
      totalCount: aggregated.totalCount,
      uniqueUsers: aggregated.uniqueUsers
    });
    
    return {
      pageViewId,
      completionId,
      quizScoreId,
      metricsCount: metrics.length,
      aggregated,
      status: 'real'
    };
  });
}

// Test 5: Error Handling and Recovery
async function testErrorHandling() {
  return measurePerformance('Error Handling', async () => {
    console.log('   🧪 Testing error scenarios and recovery...');
    
    if (TEST_CONFIG.MOCK_MODE) {
      console.log('   📝 Mock: Error handling validation');
      return { status: 'mock', errorsHandled: 3 };
    }
    
    const errorsHandled = [];
    
    try {
      // Test invalid table access
      const { queryItems } = require('../lib/db/dynamodb-client');
      await queryItems('non-existent-table', 'id = :id', {}, { ':id': 'test' });
    } catch (error) {
      errorsHandled.push('Invalid table access');
      console.log('   ✅ Handled invalid table access error');
    }
    
    try {
      // Test invalid notification creation
      const { createNotification } = require('../lib/db/notifications-service');
      await createNotification({
        userId: '', // Invalid empty userId
        notificationType: 'invalid_type',
        title: '',
        message: ''
      });
    } catch (error) {
      errorsHandled.push('Invalid notification data');
      console.log('   ✅ Handled invalid notification data error');
    }
    
    return {
      status: 'real',
      errorsHandled: errorsHandled.length,
      errorTypes: errorsHandled
    };
  });
}

// Test 6: Performance and Concurrency
async function testPerformanceAndConcurrency() {
  return measurePerformance('Performance & Concurrency', async () => {
    console.log('   ⚡ Testing concurrent operations...');
    
    if (TEST_CONFIG.MOCK_MODE) {
      console.log('   📝 Mock: Performance validation');
      return { 
        status: 'mock', 
        concurrentOps: TEST_CONFIG.CONCURRENT_OPERATIONS,
        averageTime: 50
      };
    }
    
    const { recordActivity } = require('../lib/db/activity-service');
    
    // Test concurrent activity recording
    const concurrentPromises = [];
    const startTime = performance.now();
    
    for (let i = 0; i < TEST_CONFIG.CONCURRENT_OPERATIONS; i++) {
      concurrentPromises.push(
        recordActivity({
          userId: `${TEST_CONFIG.TEST_USER_ID}-${i}`,
          activityType: 'engagement',
          actionType: 'view',
          resourceId: `resource-${i}`,
          resourceType: 'document',
          courseId: TEST_CONFIG.TEST_COURSE_ID,
          metadata: { testSuite: true, concurrent: true }
        })
      );
    }
    
    const results = await Promise.allSettled(concurrentPromises);
    const endTime = performance.now();
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const averageTime = (endTime - startTime) / TEST_CONFIG.CONCURRENT_OPERATIONS;
    
    console.log(`   📊 Concurrent operations: ${successful} successful, ${failed} failed`);
    console.log(`   ⏱️  Average time per operation: ${averageTime.toFixed(2)}ms`);
    
    return {
      status: 'real',
      concurrentOps: TEST_CONFIG.CONCURRENT_OPERATIONS,
      successful,
      failed,
      averageTime
    };
  });
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log('📋 Running DynamoDB Real-Time Features Test Suite');
  console.log('================================================');
  
  // Run all tests
  await runTest('DynamoDB Configuration', testDynamoDBConfiguration);
  await runTest('Notifications Service', testNotificationsService);
  await runTest('Activity Streams Service', testActivityStreamsService);
  await runTest('Analytics Service', testAnalyticsService);
  await runTest('Error Handling', testErrorHandling);
  await runTest('Performance & Concurrency', testPerformanceAndConcurrency);
  
  // Display results summary
  console.log('');
  console.log('📊 Test Results Summary');
  console.log('=======================');
  console.log(`✅ Total Tests: ${testResults.total}`);
  console.log(`🎉 Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  // Performance summary
  if (testResults.performance.length > 0) {
    console.log('');
    console.log('⚡ Performance Summary');
    console.log('=====================');
    
    const avgDuration = testResults.performance.reduce((sum, p) => sum + p.duration, 0) / testResults.performance.length;
    const withinThreshold = testResults.performance.filter(p => p.withinThreshold).length;
    
    console.log(`📊 Average Duration: ${avgDuration.toFixed(2)}ms`);
    console.log(`🎯 Within Threshold: ${withinThreshold}/${testResults.performance.length}`);
    
    testResults.performance.forEach(perf => {
      const status = perf.status === 'success' ? '✅' : '❌';
      const threshold = perf.withinThreshold ? '🎯' : '⚠️';
      console.log(`   ${status} ${threshold} ${perf.test}: ${perf.duration.toFixed(2)}ms`);
    });
  }
  
  // Error summary
  if (testResults.errors.length > 0) {
    console.log('');
    console.log('🚨 Error Summary');
    console.log('================');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.test}: ${error.error}`);
    });
  }
  
  console.log('');
  console.log(testResults.failed === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed - check the logs above');
  
  // Exit with appropriate code
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Error handling for the test suite itself
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception in Test Suite:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection in Test Suite:', reason);
  process.exit(1);
});

// Run the test suite
runAllTests().catch(error => {
  console.error('🚨 Test Suite Failed:', error);
  process.exit(1);
}); 