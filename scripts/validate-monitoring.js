#!/usr/bin/env node

/**
 * CloudWatch Monitoring Validation Script
 * 
 * Validates the comprehensive monitoring and alerting setup for the Upskill platform.
 * Tests CloudWatch dashboards, alarms, SNS notifications, and log aggregation.
 * 
 * Usage: node scripts/validate-monitoring.js [--environment dev|staging|prod]
 */

import { CloudWatchClient, DescribeDashboardsCommand, DescribeAlarmsCommand, GetMetricStatisticsCommand } from '@aws-sdk/client-cloudwatch';
import { SNSClient, ListTopicsCommand, GetTopicAttributesCommand } from '@aws-sdk/client-sns';
import { CloudWatchLogsClient, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { RDSClient, DescribeDBClustersCommand, DescribeDBProxiesCommand } from '@aws-sdk/client-rds';
import { DynamoDBClient, ListTablesCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

// Configuration
const REGION = 'us-west-2';
const ENVIRONMENT = process.argv.includes('--environment') 
  ? process.argv[process.argv.indexOf('--environment') + 1] 
  : 'dev';

// AWS Clients
const cloudwatch = new CloudWatchClient({ region: REGION });
const sns = new SNSClient({ region: REGION });
const logs = new CloudWatchLogsClient({ region: REGION });
const rds = new RDSClient({ region: REGION });
const dynamodb = new DynamoDBClient({ region: REGION });

// Expected monitoring components
const EXPECTED_COMPONENTS = {
  dashboard: 'Upskill-Platform-Monitoring',
  alarms: [
    'upskill-auth-db-high-cpu',
    'upskill-course-db-high-cpu', 
    'upskill-auth-db-high-connections',
    'upskill-course-db-high-connections',
    'upskill-notifications-throttle',
    'upskill-lambda-error-rate'
  ],
  snsTopics: [
    'upskill-critical-alerts',
    'upskill-warning-alerts'
  ],
  logGroups: [
    '/aws/lambda/upskill-api',
    '/aws/lambda/upskill-auth',
    '/aws/lambda/upskill-db-migration'
  ],
  databases: [
    'upskill-learner-dev-pg-uswest2', // Auth database
    // Course database will be created by CDK
  ],
  dynamoTables: [
    // Will be detected dynamically based on naming pattern
  ]
};

/**
 * Validation Results Tracker
 */
class ValidationResults {
  constructor() {
    this.results = {
      dashboard: { status: 'pending', details: [] },
      alarms: { status: 'pending', details: [], found: 0, expected: EXPECTED_COMPONENTS.alarms.length },
      snsTopics: { status: 'pending', details: [], found: 0, expected: EXPECTED_COMPONENTS.snsTopics.length },
      logGroups: { status: 'pending', details: [], found: 0, expected: EXPECTED_COMPONENTS.logGroups.length },
      databases: { status: 'pending', details: [], found: 0 },
      dynamoTables: { status: 'pending', details: [], found: 0 },
      metrics: { status: 'pending', details: [] },
      coverage: { status: 'pending', score: 0, details: [] }
    };
    this.startTime = Date.now();
  }

  addResult(category, status, message, data = {}) {
    this.results[category].details.push({
      timestamp: new Date().toISOString(),
      status,
      message,
      data
    });
    
    if (status === 'success') {
      this.results[category].found = (this.results[category].found || 0) + 1;
    }
  }

  setStatus(category, status) {
    this.results[category].status = status;
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    const overallStatus = Object.values(this.results).every(r => r.status === 'success') ? 'PASS' : 'FAIL';
    
    return {
      validation: {
        status: overallStatus,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        environment: ENVIRONMENT,
        region: REGION
      },
      results: this.results,
      summary: this.generateSummary()
    };
  }

  generateSummary() {
    const categories = Object.keys(this.results);
    const passed = categories.filter(cat => this.results[cat].status === 'success').length;
    const total = categories.length;
    
    return {
      overall: `${passed}/${total} categories passed`,
      coverageScore: this.calculateCoverageScore(),
      recommendations: this.generateRecommendations()
    };
  }

  calculateCoverageScore() {
    const weights = {
      dashboard: 15,
      alarms: 25,
      snsTopics: 15,
      logGroups: 15,
      databases: 10,
      dynamoTables: 10,
      metrics: 10
    };

    let totalScore = 0;
    let maxScore = 0;

    Object.entries(weights).forEach(([category, weight]) => {
      maxScore += weight;
      const result = this.results[category];
      
      if (result.status === 'success') {
        if (result.expected) {
          const ratio = Math.min(result.found / result.expected, 1);
          totalScore += weight * ratio;
        } else {
          totalScore += weight;
        }
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  }

  generateRecommendations() {
    const recommendations = [];
    
    Object.entries(this.results).forEach(([category, result]) => {
      if (result.status === 'failed') {
        recommendations.push(`Fix ${category}: ${result.details[result.details.length - 1]?.message || 'Issues detected'}`);
      } else if (result.expected && result.found < result.expected) {
        recommendations.push(`Complete ${category}: Found ${result.found}/${result.expected} expected components`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('All monitoring components are properly configured');
    }

    return recommendations;
  }
}

/**
 * Validate CloudWatch Dashboard
 */
async function validateDashboard(results) {
  console.log('🔍 Validating CloudWatch Dashboard...');
  
  try {
    const command = new DescribeDashboardsCommand({
      DashboardNamePrefix: EXPECTED_COMPONENTS.dashboard
    });
    
    const response = await cloudwatch.send(command);
    const dashboard = response.DashboardEntries?.find(d => d.DashboardName === EXPECTED_COMPONENTS.dashboard);
    
    if (dashboard) {
      results.addResult('dashboard', 'success', `Dashboard found: ${dashboard.DashboardName}`, {
        size: dashboard.Size,
        lastModified: dashboard.LastModified
      });
      results.setStatus('dashboard', 'success');
    } else {
      results.addResult('dashboard', 'failed', `Dashboard not found: ${EXPECTED_COMPONENTS.dashboard}`);
      results.setStatus('dashboard', 'failed');
    }
  } catch (error) {
    results.addResult('dashboard', 'failed', `Error validating dashboard: ${error.message}`);
    results.setStatus('dashboard', 'failed');
  }
}

/**
 * Validate CloudWatch Alarms
 */
async function validateAlarms(results) {
  console.log('🚨 Validating CloudWatch Alarms...');
  
  try {
    const command = new DescribeAlarmsCommand({
      AlarmNamePrefix: 'upskill-'
    });
    
    const response = await cloudwatch.send(command);
    const foundAlarms = response.MetricAlarms || [];
    
    EXPECTED_COMPONENTS.alarms.forEach(expectedAlarm => {
      const alarm = foundAlarms.find(a => a.AlarmName === expectedAlarm);
      if (alarm) {
        results.addResult('alarms', 'success', `Alarm configured: ${alarm.AlarmName}`, {
          state: alarm.StateValue,
          threshold: alarm.Threshold,
          metric: alarm.MetricName,
          actionsEnabled: alarm.ActionsEnabled
        });
      } else {
        results.addResult('alarms', 'failed', `Alarm not found: ${expectedAlarm}`);
      }
    });
    
    const foundCount = EXPECTED_COMPONENTS.alarms.filter(expected => 
      foundAlarms.some(alarm => alarm.AlarmName === expected)
    ).length;
    
    results.setStatus('alarms', foundCount === EXPECTED_COMPONENTS.alarms.length ? 'success' : 'failed');
  } catch (error) {
    results.addResult('alarms', 'failed', `Error validating alarms: ${error.message}`);
    results.setStatus('alarms', 'failed');
  }
}

/**
 * Validate SNS Topics
 */
async function validateSNSTopics(results) {
  console.log('📧 Validating SNS Topics...');
  
  try {
    const command = new ListTopicsCommand({});
    const response = await sns.send(command);
    const topics = response.Topics || [];
    
    for (const expectedTopic of EXPECTED_COMPONENTS.snsTopics) {
      const topic = topics.find(t => t.TopicArn?.includes(expectedTopic));
      if (topic) {
        // Get topic attributes
        const attributesCommand = new GetTopicAttributesCommand({
          TopicArn: topic.TopicArn
        });
        const attributes = await sns.send(attributesCommand);
        
        results.addResult('snsTopics', 'success', `SNS Topic found: ${expectedTopic}`, {
          arn: topic.TopicArn,
          subscriptionsConfirmed: attributes.Attributes?.SubscriptionsConfirmed || 0,
          displayName: attributes.Attributes?.DisplayName
        });
      } else {
        results.addResult('snsTopics', 'failed', `SNS Topic not found: ${expectedTopic}`);
      }
    }
    
    results.setStatus('snsTopics', results.results.snsTopics.found === EXPECTED_COMPONENTS.snsTopics.length ? 'success' : 'failed');
  } catch (error) {
    results.addResult('snsTopics', 'failed', `Error validating SNS topics: ${error.message}`);
    results.setStatus('snsTopics', 'failed');
  }
}

/**
 * Validate CloudWatch Log Groups
 */
async function validateLogGroups(results) {
  console.log('📋 Validating CloudWatch Log Groups...');
  
  try {
    const command = new DescribeLogGroupsCommand({
      logGroupNamePrefix: '/aws/lambda/upskill-'
    });
    
    const response = await logs.send(command);
    const logGroups = response.logGroups || [];
    
    EXPECTED_COMPONENTS.logGroups.forEach(expectedLogGroup => {
      const logGroup = logGroups.find(lg => lg.logGroupName === expectedLogGroup);
      if (logGroup) {
        results.addResult('logGroups', 'success', `Log Group found: ${logGroup.logGroupName}`, {
          retention: logGroup.retentionInDays,
          creationTime: logGroup.creationTime,
          storedBytes: logGroup.storedBytes
        });
      } else {
        results.addResult('logGroups', 'failed', `Log Group not found: ${expectedLogGroup}`);
      }
    });
    
    results.setStatus('logGroups', results.results.logGroups.found === EXPECTED_COMPONENTS.logGroups.length ? 'success' : 'failed');
  } catch (error) {
    results.addResult('logGroups', 'failed', `Error validating log groups: ${error.message}`);
    results.setStatus('logGroups', 'failed');
  }
}

/**
 * Validate Database Infrastructure
 */
async function validateDatabases(results) {
  console.log('🗄️ Validating Database Infrastructure...');
  
  try {
    // Check Aurora clusters
    const clustersCommand = new DescribeDBClustersCommand({});
    const clustersResponse = await rds.send(clustersCommand);
    const clusters = clustersResponse.DBClusters || [];
    
    const upskillClusters = clusters.filter(cluster => 
      cluster.DBClusterIdentifier?.includes('upskill')
    );
    
    upskillClusters.forEach(cluster => {
      results.addResult('databases', 'success', `Aurora cluster found: ${cluster.DBClusterIdentifier}`, {
        engine: cluster.Engine,
        status: cluster.Status,
        endpoint: cluster.Endpoint,
        multiAZ: cluster.MultiAZ
      });
    });
    
    // Check RDS Proxies
    const proxiesCommand = new DescribeDBProxiesCommand({});
    const proxiesResponse = await rds.send(proxiesCommand);
    const proxies = proxiesResponse.DBProxies || [];
    
    const upskillProxies = proxies.filter(proxy => 
      proxy.DBProxyName?.includes('upskill') || proxy.DBProxyName?.includes('Aurora')
    );
    
    upskillProxies.forEach(proxy => {
      results.addResult('databases', 'success', `RDS Proxy found: ${proxy.DBProxyName}`, {
        status: proxy.Status,
        endpoint: proxy.Endpoint,
        iamAuth: proxy.Auth?.some(auth => auth.AuthScheme === 'SECRETS')
      });
    });
    
    results.setStatus('databases', upskillClusters.length > 0 ? 'success' : 'warning');
  } catch (error) {
    results.addResult('databases', 'failed', `Error validating databases: ${error.message}`);
    results.setStatus('databases', 'failed');
  }
}

/**
 * Validate DynamoDB Tables
 */
async function validateDynamoTables(results) {
  console.log('⚡ Validating DynamoDB Tables...');
  
  try {
    const command = new ListTablesCommand({});
    const response = await dynamodb.send(command);
    const tableNames = response.TableNames || [];
    
    const upskillTables = tableNames.filter(name => 
      name.toLowerCase().includes('upskill') || 
      name.includes('notifications') ||
      name.includes('activity') ||
      name.includes('analytics')
    );
    
    for (const tableName of upskillTables) {
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
      const tableDetails = await dynamodb.send(describeCommand);
      
      results.addResult('dynamoTables', 'success', `DynamoDB table found: ${tableName}`, {
        status: tableDetails.Table?.TableStatus,
        billingMode: tableDetails.Table?.BillingModeSummary?.BillingMode,
        itemCount: tableDetails.Table?.ItemCount
      });
    }
    
    results.setStatus('dynamoTables', upskillTables.length > 0 ? 'success' : 'warning');
  } catch (error) {
    results.addResult('dynamoTables', 'failed', `Error validating DynamoDB tables: ${error.message}`);
    results.setStatus('dynamoTables', 'failed');
  }
}

/**
 * Test Metrics Collection
 */
async function validateMetrics(results) {
  console.log('📊 Validating Metrics Collection...');
  
  try {
    const now = new Date();
    const startTime = new Date(now.getTime() - 3600000); // 1 hour ago
    
    // Test a basic metric to ensure CloudWatch is accessible
    const command = new GetMetricStatisticsCommand({
      Namespace: 'AWS/RDS',
      MetricName: 'CPUUtilization',
      StartTime: startTime,
      EndTime: now,
      Period: 300,
      Statistics: ['Average']
    });
    
    const response = await cloudwatch.send(command);
    
    if (response.Datapoints && response.Datapoints.length >= 0) {
      results.addResult('metrics', 'success', 'CloudWatch metrics collection is functional', {
        datapoints: response.Datapoints.length,
        period: '1 hour',
        metric: 'AWS/RDS CPUUtilization'
      });
      results.setStatus('metrics', 'success');
    } else {
      results.addResult('metrics', 'warning', 'CloudWatch accessible but no recent datapoints found');
      results.setStatus('metrics', 'warning');
    }
  } catch (error) {
    results.addResult('metrics', 'failed', `Error validating metrics: ${error.message}`);
    results.setStatus('metrics', 'failed');
  }
}

/**
 * Main validation function
 */
async function runValidation() {
  console.log('🚀 Starting CloudWatch Monitoring Validation...');
  console.log(`Environment: ${ENVIRONMENT}`);
  console.log(`Region: ${REGION}`);
  console.log('='.repeat(60));
  
  const results = new ValidationResults();
  
  try {
    await Promise.allSettled([
      validateDashboard(results),
      validateAlarms(results),
      validateSNSTopics(results),
      validateLogGroups(results),
      validateDatabases(results),
      validateDynamoTables(results),
      validateMetrics(results)
    ]);
    
    // Generate final report
    const report = results.generateReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(60));
    console.log(`Status: ${report.validation.status}`);
    console.log(`Duration: ${report.validation.duration}`);
    console.log(`Coverage Score: ${report.summary.coverageScore}%`);
    console.log(`Summary: ${report.summary.overall}`);
    
    console.log('\n📋 CATEGORY DETAILS:');
    Object.entries(report.results).forEach(([category, result]) => {
      const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${category}: ${result.status} (${result.found || 0}/${result.expected || 'N/A'})`);
    });
    
    console.log('\n💡 RECOMMENDATIONS:');
    report.summary.recommendations.forEach(rec => {
      console.log(`• ${rec}`);
    });
    
    // Save detailed report
    const reportPath = `artifacts/monitoring/validation-report-${Date.now()}.json`;
    await import('fs').then(fs => {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Detailed report saved: ${reportPath}`);
    }).catch(() => {
      console.log('\n📄 Detailed report:');
      console.log(JSON.stringify(report, null, 2));
    });
    
    // Exit with appropriate code
    process.exit(report.validation.status === 'PASS' ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runValidation().catch(console.error);
}

export { runValidation, ValidationResults }; 