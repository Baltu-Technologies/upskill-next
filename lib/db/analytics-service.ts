/**
 * Analytics Service
 * 
 * High-level service for managing analytics and metrics using DynamoDB.
 * Handles platform-wide metrics, user engagement analytics, and reporting data.
 * 
 * Access Patterns:
 * 1. Record metrics and events
 * 2. Get time-series analytics data
 * 3. Get aggregated metrics by date/time periods
 * 4. Generate performance reports
 * 5. Track user engagement metrics
 * 6. Course and content performance analytics
 */

import { 
  AnalyticsItem, 
  putItem, 
  queryItems,
  batchPutItems,
  tableNames 
} from './dynamodb-client';

// ========================================
// Metric Recording
// ========================================

/**
 * Record a single analytics metric
 */
export async function recordMetric(params: {
  metricType: AnalyticsItem['metricType'];
  value: number;
  userId?: string;
  courseId?: string;
  metadata?: Record<string, any>;
  timestamp?: string; // Optional custom timestamp
}): Promise<string> {
  const now = params.timestamp || new Date().toISOString();
  const metricDate = now.split('T')[0]; // YYYY-MM-DD format
  const metricId = generateMetricId(params.metricType, now, params.userId);
  
  const metric: AnalyticsItem = {
    metricDate,
    metricId,
    metricType: params.metricType,
    timestamp: now,
    userId: params.userId,
    courseId: params.courseId,
    value: params.value,
    metadata: params.metadata || {}
  };

  await putItem<AnalyticsItem>(
    tableNames.analytics, 
    metric
  );
  
  return metricId;
}

/**
 * Record multiple metrics in batch
 */
export async function recordMetricsBatch(
  metrics: Array<Omit<AnalyticsItem, 'metricDate' | 'metricId'>>
): Promise<{ successful: number; failed: number }> {
  
  const metricItems: AnalyticsItem[] = metrics.map(metric => {
    const timestamp = metric.timestamp || new Date().toISOString();
    const metricDate = timestamp.split('T')[0];
    
    return {
      ...metric,
      metricDate,
      metricId: generateMetricId(metric.metricType, timestamp, metric.userId),
      metadata: metric.metadata || {}
    };
  });

  try {
    await batchPutItems<AnalyticsItem>(tableNames.analytics, metricItems);
    return { successful: metricItems.length, failed: 0 };
  } catch (error) {
    console.error('Failed to batch record metrics:', error);
    return { successful: 0, failed: metricItems.length };
  }
}

/**
 * Generate unique metric ID
 */
function generateMetricId(metricType: string, timestamp: string, userId?: string): string {
  const timestampMs = new Date(timestamp).getTime();
  const userPart = userId ? `_${userId}` : '';
  const random = Math.random().toString(36).substring(2, 6);
  return `${metricType}_${timestampMs}${userPart}_${random}`;
}

// ========================================
// Common Metric Recording Functions
// ========================================

/**
 * Record page view metric
 */
export async function recordPageView(
  userId: string,
  pageUrl: string,
  referrer?: string,
  metadata?: Record<string, any>
): Promise<string> {
  return recordMetric({
    metricType: 'page_view',
    value: 1,
    userId,
    metadata: {
      pageUrl,
      referrer,
      ...metadata
    }
  });
}

/**
 * Record course completion metric
 */
export async function recordCourseCompletion(
  userId: string,
  courseId: string,
  completionPercentage: number,
  timeSpent: number, // in minutes
  metadata?: Record<string, any>
): Promise<string> {
  return recordMetric({
    metricType: 'course_completion',
    value: completionPercentage,
    userId,
    courseId,
    metadata: {
      timeSpent,
      completionDate: new Date().toISOString(),
      ...metadata
    }
  });
}

/**
 * Record quiz score metric
 */
export async function recordQuizScore(
  userId: string,
  courseId: string,
  quizId: string,
  score: number,
  maxScore: number,
  metadata?: Record<string, any>
): Promise<string> {
  const percentage = Math.round((score / maxScore) * 100);
  
  return recordMetric({
    metricType: 'quiz_score',
    value: percentage,
    userId,
    courseId,
    metadata: {
      score,
      maxScore,
      quizId,
      passed: percentage >= 70,
      ...metadata
    }
  });
}

/**
 * Record time spent on platform
 */
export async function recordTimeSpent(
  userId: string,
  sessionDuration: number, // in minutes
  courseId?: string,
  metadata?: Record<string, any>
): Promise<string> {
  return recordMetric({
    metricType: 'time_spent',
    value: sessionDuration,
    userId,
    courseId,
    metadata: {
      sessionStart: metadata?.sessionStart,
      sessionEnd: new Date().toISOString(),
      ...metadata
    }
  });
}

/**
 * Record user engagement metric (composite score)
 */
export async function recordUserEngagement(
  userId: string,
  engagementScore: number, // 0-100 score
  courseId?: string,
  metadata?: Record<string, any>
): Promise<string> {
  return recordMetric({
    metricType: 'user_engagement',
    value: engagementScore,
    userId,
    courseId,
    metadata: {
      calculatedAt: new Date().toISOString(),
      ...metadata
    }
  });
}

// ========================================
// Analytics Retrieval
// ========================================

/**
 * Get metrics by date range
 */
export async function getMetricsByDateRange(
  startDate: string, // YYYY-MM-DD
  endDate: string, // YYYY-MM-DD
  options: {
    metricType?: AnalyticsItem['metricType'];
    userId?: string;
    courseId?: string;
    limit?: number;
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ metrics: AnalyticsItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  // For date range queries, we need to query each date individually
  // This is a limitation of DynamoDB's query capabilities
  const dates = getDatesBetween(startDate, endDate);
  const allMetrics: AnalyticsItem[] = [];
  
  for (const date of dates) {
    const { metrics } = await getMetricsByDate(date, {
      metricType: options.metricType,
      userId: options.userId,
      courseId: options.courseId,
      limit: 1000 // Get all for the date
    });
    
    allMetrics.push(...metrics);
  }

  // Apply additional filtering and sorting
  let filteredMetrics = allMetrics;
  
  if (options.metricType) {
    filteredMetrics = filteredMetrics.filter(m => m.metricType === options.metricType);
  }
  
  if (options.userId) {
    filteredMetrics = filteredMetrics.filter(m => m.userId === options.userId);
  }
  
  if (options.courseId) {
    filteredMetrics = filteredMetrics.filter(m => m.courseId === options.courseId);
  }

  // Sort by timestamp (newest first)
  filteredMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply limit
  if (options.limit) {
    filteredMetrics = filteredMetrics.slice(0, options.limit);
  }

  return {
    metrics: filteredMetrics,
    lastEvaluatedKey: undefined // Simplified for this implementation
  };
}

/**
 * Get metrics for a specific date
 */
export async function getMetricsByDate(
  date: string, // YYYY-MM-DD
  options: {
    metricType?: AnalyticsItem['metricType'];
    userId?: string;
    courseId?: string;
    limit?: number;
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ metrics: AnalyticsItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression: string | undefined;
  let expressionAttributeNames: Record<string, string> | undefined;
  let expressionAttributeValues: Record<string, any> = { ':metricDate': date };

  const filters: string[] = [];

  if (options.metricType) {
    filters.push('#metricType = :metricType');
    expressionAttributeNames = { 
      ...expressionAttributeNames, 
      '#metricType': 'metricType' 
    };
    expressionAttributeValues[':metricType'] = options.metricType;
  }

  if (options.userId) {
    filters.push('#userId = :userId');
    expressionAttributeNames = { 
      ...expressionAttributeNames, 
      '#userId': 'userId' 
    };
    expressionAttributeValues[':userId'] = options.userId;
  }

  if (options.courseId) {
    filters.push('#courseId = :courseId');
    expressionAttributeNames = { 
      ...expressionAttributeNames, 
      '#courseId': 'courseId' 
    };
    expressionAttributeValues[':courseId'] = options.courseId;
  }

  if (filters.length > 0) {
    filterExpression = filters.join(' AND ');
  }

  const result = await queryItems<AnalyticsItem>(
    tableNames.analytics,
    'metricDate = :metricDate',
    expressionAttributeNames,
    expressionAttributeValues,
    undefined, // indexName
    filterExpression,
    options.limit || 100,
    false, // newest first
    options.lastEvaluatedKey
  );

  return {
    metrics: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

/**
 * Get metrics by type (using GSI)
 */
export async function getMetricsByType(
  metricType: AnalyticsItem['metricType'],
  options: {
    dateFrom?: string; // ISO timestamp
    dateTo?: string; // ISO timestamp
    userId?: string;
    courseId?: string;
    limit?: number;
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ metrics: AnalyticsItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression: string | undefined;
  let expressionAttributeNames: Record<string, string> | undefined;
  let expressionAttributeValues: Record<string, any> = { ':metricType': metricType };

  const filters: string[] = [];

  // Date range filter
  if (options.dateFrom || options.dateTo) {
    if (options.dateFrom) {
      filters.push('#timestamp >= :dateFrom');
      expressionAttributeNames = { 
        ...expressionAttributeNames, 
        '#timestamp': 'timestamp' 
      };
      expressionAttributeValues[':dateFrom'] = options.dateFrom;
    }
    if (options.dateTo) {
      filters.push('#timestamp <= :dateTo');
      expressionAttributeNames = { 
        ...expressionAttributeNames, 
        '#timestamp': 'timestamp' 
      };
      expressionAttributeValues[':dateTo'] = options.dateTo;
    }
  }

  if (options.userId) {
    filters.push('#userId = :userId');
    expressionAttributeNames = { 
      ...expressionAttributeNames, 
      '#userId': 'userId' 
    };
    expressionAttributeValues[':userId'] = options.userId;
  }

  if (options.courseId) {
    filters.push('#courseId = :courseId');
    expressionAttributeNames = { 
      ...expressionAttributeNames, 
      '#courseId': 'courseId' 
    };
    expressionAttributeValues[':courseId'] = options.courseId;
  }

  if (filters.length > 0) {
    filterExpression = filters.join(' AND ');
  }

  const result = await queryItems<AnalyticsItem>(
    tableNames.analytics,
    'metricType = :metricType',
    expressionAttributeNames,
    expressionAttributeValues,
    'MetricTypeIndex', // GSI
    filterExpression,
    options.limit || 100,
    false, // newest first
    options.lastEvaluatedKey
  );

  return {
    metrics: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

// ========================================
// Analytics Aggregation and Reporting
// ========================================

/**
 * Get aggregated metrics for a date range
 */
export async function getAggregatedMetrics(
  startDate: string,
  endDate: string,
  metricType?: AnalyticsItem['metricType']
): Promise<{
  totalCount: number;
  averageValue: number;
  maxValue: number;
  minValue: number;
  sumValue: number;
  uniqueUsers: number;
  uniqueCourses: number;
  dailyBreakdown: Array<{
    date: string;
    count: number;
    sum: number;
    average: number;
  }>;
}> {
  const { metrics } = await getMetricsByDateRange(startDate, endDate, { 
    metricType,
    limit: 10000 
  });

  const aggregated = {
    totalCount: metrics.length,
    averageValue: 0,
    maxValue: 0,
    minValue: Number.MAX_VALUE,
    sumValue: 0,
    uniqueUsers: 0,
    uniqueCourses: 0,
    dailyBreakdown: [] as Array<{
      date: string;
      count: number;
      sum: number;
      average: number;
    }>
  };

  if (metrics.length === 0) {
    return { ...aggregated, minValue: 0 };
  }

  const userSet = new Set<string>();
  const courseSet = new Set<string>();
  const dailyData: Record<string, { count: number; sum: number }> = {};

  metrics.forEach(metric => {
    // Value aggregations
    aggregated.sumValue += metric.value;
    aggregated.maxValue = Math.max(aggregated.maxValue, metric.value);
    aggregated.minValue = Math.min(aggregated.minValue, metric.value);

    // Unique tracking
    if (metric.userId) {
      userSet.add(metric.userId);
    }
    if (metric.courseId) {
      courseSet.add(metric.courseId);
    }

    // Daily breakdown
    const date = metric.metricDate;
    if (!dailyData[date]) {
      dailyData[date] = { count: 0, sum: 0 };
    }
    dailyData[date].count++;
    dailyData[date].sum += metric.value;
  });

  aggregated.averageValue = aggregated.sumValue / aggregated.totalCount;
  aggregated.uniqueUsers = userSet.size;
  aggregated.uniqueCourses = courseSet.size;

  // Build daily breakdown
  aggregated.dailyBreakdown = Object.entries(dailyData).map(([date, data]) => ({
    date,
    count: data.count,
    sum: data.sum,
    average: data.sum / data.count
  })).sort((a, b) => a.date.localeCompare(b.date));

  return aggregated;
}

/**
 * Get user engagement report
 */
export async function getUserEngagementReport(
  userId: string,
  startDate: string,
  endDate: string
): Promise<{
  totalSessions: number;
  totalTimeSpent: number; // minutes
  averageSessionDuration: number; // minutes
  coursesAccessed: number;
  quizzesAttempted: number;
  averageQuizScore: number;
  completedCourses: number;
  engagementTrend: Array<{
    date: string;
    timeSpent: number;
    pageViews: number;
    quizzes: number;
  }>;
}> {
  const { metrics } = await getMetricsByDateRange(startDate, endDate, { userId, limit: 10000 });

  const report = {
    totalSessions: 0,
    totalTimeSpent: 0,
    averageSessionDuration: 0,
    coursesAccessed: 0,
    quizzesAttempted: 0,
    averageQuizScore: 0,
    completedCourses: 0,
    engagementTrend: [] as Array<{
      date: string;
      timeSpent: number;
      pageViews: number;
      quizzes: number;
    }>
  };

  const courseSet = new Set<string>();
  const dailyData: Record<string, { timeSpent: number; pageViews: number; quizzes: number }> = {};
  let totalQuizScore = 0;
  let quizCount = 0;

  metrics.forEach(metric => {
    const date = metric.metricDate;

    // Initialize daily data
    if (!dailyData[date]) {
      dailyData[date] = { timeSpent: 0, pageViews: 0, quizzes: 0 };
    }

    switch (metric.metricType) {
      case 'time_spent':
        report.totalTimeSpent += metric.value;
        dailyData[date].timeSpent += metric.value;
        report.totalSessions++;
        break;
      
      case 'page_view':
        dailyData[date].pageViews += metric.value;
        break;
      
      case 'quiz_score':
        report.quizzesAttempted++;
        totalQuizScore += metric.value;
        quizCount++;
        dailyData[date].quizzes++;
        break;
      
      case 'course_completion':
        if (metric.value >= 100) { // 100% completion
          report.completedCourses++;
        }
        break;
    }

    if (metric.courseId) {
      courseSet.add(metric.courseId);
    }
  });

  report.coursesAccessed = courseSet.size;
  report.averageSessionDuration = report.totalSessions > 0 ? 
    report.totalTimeSpent / report.totalSessions : 0;
  report.averageQuizScore = quizCount > 0 ? totalQuizScore / quizCount : 0;

  // Build engagement trend
  report.engagementTrend = Object.entries(dailyData).map(([date, data]) => ({
    date,
    timeSpent: data.timeSpent,
    pageViews: data.pageViews,
    quizzes: data.quizzes
  })).sort((a, b) => a.date.localeCompare(b.date));

  return report;
}

// ========================================
// Helper Functions
// ========================================

/**
 * Generate array of dates between start and end date
 */
function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    dates.push(dt.toISOString().split('T')[0]);
  }
  
  return dates;
} 