/**
 * Activity Streams Service
 * 
 * High-level service for managing user activity streams using DynamoDB.
 * Tracks user behavior, learning progress, and engagement for analytics.
 * 
 * Access Patterns:
 * 1. Record user activities (learning, engagement, system events)
 * 2. Get user activity timeline
 * 3. Get activity by type/category
 * 4. Get course-specific activities
 * 5. Track learning progress and milestones
 * 6. Generate activity reports and analytics
 */

import { 
  ActivityStreamItem, 
  putItem, 
  queryItems,
  batchPutItems,
  tableNames 
} from './dynamodb-client';

// ========================================
// Activity Recording
// ========================================

/**
 * Record a single user activity
 */
export async function recordActivity(params: {
  userId: string;
  activityType: ActivityStreamItem['activityType'];
  actionType: ActivityStreamItem['actionType'];
  resourceId?: string;
  resourceType?: ActivityStreamItem['resourceType'];
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  metadata?: Record<string, any>;
  duration?: number; // in seconds
  score?: number; // for assessments/quizzes
}): Promise<string> {
  const activityId = generateActivityId(params.activityType, params.actionType);
  const now = new Date().toISOString();
  
  const activity: ActivityStreamItem = {
    userId: params.userId,
    activityId,
    timestamp: now,
    activityType: params.activityType,
    actionType: params.actionType,
    resourceId: params.resourceId,
    resourceType: params.resourceType,
    courseId: params.courseId,
    moduleId: params.moduleId,
    lessonId: params.lessonId,
    metadata: params.metadata || {},
    duration: params.duration,
    score: params.score,
  };

  await putItem<ActivityStreamItem>(
    tableNames.activityStreams, 
    activity
  );
  
  return activityId;
}

/**
 * Record multiple activities in batch (for bulk imports or offline sync)
 */
export async function recordActivitiesBatch(
  activities: Array<Omit<ActivityStreamItem, 'activityId' | 'timestamp'>>
): Promise<{ successful: number; failed: number }> {
  const now = new Date().toISOString();
  
  const activityItems: ActivityStreamItem[] = activities.map(activity => ({
    ...activity,
    activityId: generateActivityId(activity.activityType, activity.actionType),
    timestamp: now,
    metadata: activity.metadata || {}
  }));

  try {
    await batchPutItems<ActivityStreamItem>(tableNames.activityStreams, activityItems);
    return { successful: activityItems.length, failed: 0 };
  } catch (error) {
    console.error('Failed to batch record activities:', error);
    return { successful: 0, failed: activityItems.length };
  }
}

/**
 * Generate unique activity ID
 */
function generateActivityId(activityType: string, actionType: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  return `${activityType}_${actionType}_${timestamp}_${random}`;
}

// ========================================
// Learning-Specific Activity Recording
// ========================================

/**
 * Record course enrollment activity
 */
export async function recordCourseEnrollment(
  userId: string, 
  courseId: string, 
  metadata?: Record<string, any>
): Promise<string> {
  return recordActivity({
    userId,
    activityType: 'learning',
    actionType: 'enroll',
    resourceId: courseId,
    resourceType: 'course',
    courseId,
    metadata: {
      enrollmentDate: new Date().toISOString(),
      ...metadata
    }
  });
}

/**
 * Record lesson completion activity
 */
export async function recordLessonCompletion(
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string,
  duration: number,
  metadata?: Record<string, any>
): Promise<string> {
  return recordActivity({
    userId,
    activityType: 'learning',
    actionType: 'complete',
    resourceId: lessonId,
    resourceType: 'lesson',
    courseId,
    moduleId,
    lessonId,
    duration,
    metadata: {
      completionDate: new Date().toISOString(),
      ...metadata
    }
  });
}

/**
 * Record quiz attempt activity
 */
export async function recordQuizAttempt(
  userId: string,
  courseId: string,
  quizId: string,
  score: number,
  maxScore: number,
  duration: number,
  metadata?: Record<string, any>
): Promise<string> {
  return recordActivity({
    userId,
    activityType: 'assessment',
    actionType: 'attempt',
    resourceId: quizId,
    resourceType: 'quiz',
    courseId,
    score,
    duration,
    metadata: {
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      passed: score >= (maxScore * 0.7), // 70% passing grade
      attemptDate: new Date().toISOString(),
      ...metadata
    }
  });
}

/**
 * Record video watch activity
 */
export async function recordVideoWatch(
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string,
  videoId: string,
  watchDuration: number,
  totalDuration: number,
  metadata?: Record<string, any>
): Promise<string> {
  const completionPercentage = Math.round((watchDuration / totalDuration) * 100);
  
  return recordActivity({
    userId,
    activityType: 'engagement',
    actionType: 'watch',
    resourceId: videoId,
    resourceType: 'video',
    courseId,
    moduleId,
    lessonId,
    duration: watchDuration,
    metadata: {
      totalDuration,
      completionPercentage,
      completed: completionPercentage >= 90, // Consider 90%+ as completed
      watchDate: new Date().toISOString(),
      ...metadata
    }
  });
}

// ========================================
// Activity Retrieval
// ========================================

/**
 * Get user activity timeline
 */
export async function getUserActivityTimeline(
  userId: string,
  options: {
    limit?: number;
    activityType?: ActivityStreamItem['activityType'];
    dateFrom?: string; // ISO string
    dateTo?: string; // ISO string
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ activities: ActivityStreamItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression: string | undefined;
  let expressionAttributeNames: Record<string, string> | undefined;
  let expressionAttributeValues: Record<string, any> = { ':userId': userId };

  const filters: string[] = [];

  // Filter by activity type
  if (options.activityType) {
    filters.push('#activityType = :activityType');
    expressionAttributeNames = { 
      ...expressionAttributeNames, 
      '#activityType': 'activityType' 
    };
    expressionAttributeValues[':activityType'] = options.activityType;
  }

  // Filter by date range
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

  if (filters.length > 0) {
    filterExpression = filters.join(' AND ');
  }

  const result = await queryItems<ActivityStreamItem>(
    tableNames.activityStreams,
    'userId = :userId',
    expressionAttributeNames,
    expressionAttributeValues,
    undefined, // indexName
    filterExpression,
    options.limit || 50,
    false, // scanIndexForward (newest first)
    options.lastEvaluatedKey
  );

  return {
    activities: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

/**
 * Get course-specific activities for a user
 */
export async function getUserCourseActivities(
  userId: string,
  courseId: string,
  options: {
    limit?: number;
    activityType?: ActivityStreamItem['activityType'];
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ activities: ActivityStreamItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression = '#courseId = :courseId';
  let expressionAttributeNames: Record<string, string> = { '#courseId': 'courseId' };
  let expressionAttributeValues: Record<string, any> = { 
    ':userId': userId,
    ':courseId': courseId 
  };

  if (options.activityType) {
    filterExpression += ' AND #activityType = :activityType';
    expressionAttributeNames['#activityType'] = 'activityType';
    expressionAttributeValues[':activityType'] = options.activityType;
  }

  const result = await queryItems<ActivityStreamItem>(
    tableNames.activityStreams,
    'userId = :userId',
    expressionAttributeNames,
    expressionAttributeValues,
    undefined, // indexName
    filterExpression,
    options.limit || 100,
    false, // newest first
    options.lastEvaluatedKey
  );

  return {
    activities: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

/**
 * Get activities by type across all users (for admin analytics)
 */
export async function getActivitiesByType(
  activityType: ActivityStreamItem['activityType'],
  options: {
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    courseId?: string;
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ activities: ActivityStreamItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression: string | undefined;
  let expressionAttributeNames: Record<string, string> | undefined;
  let expressionAttributeValues: Record<string, any> = { ':activityType': activityType };

  const filters: string[] = [];

  // Filter by date range
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

  // Filter by course
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

  const result = await queryItems<ActivityStreamItem>(
    tableNames.activityStreams,
    'activityType = :activityType',
    expressionAttributeNames,
    expressionAttributeValues,
    'ActivityTypeIndex', // GSI
    filterExpression,
    options.limit || 100,
    false, // newest first
    options.lastEvaluatedKey
  );

  return {
    activities: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

// ========================================
// Learning Progress Analytics
// ========================================

/**
 * Get user's learning progress for a course
 */
export async function getUserCourseProgress(
  userId: string,
  courseId: string
): Promise<{
  enrollmentDate?: string;
  totalActivities: number;
  completedLessons: number;
  totalQuizAttempts: number;
  averageQuizScore: number;
  totalLearningTime: number; // in minutes
  lastActivityDate?: string;
  milestones: Array<{
    type: string;
    date: string;
    details: Record<string, any>;
  }>;
}> {
  const { activities } = await getUserCourseActivities(userId, courseId, { limit: 1000 });
  
  const progress = {
    enrollmentDate: undefined as string | undefined,
    totalActivities: activities.length,
    completedLessons: 0,
    totalQuizAttempts: 0,
    averageQuizScore: 0,
    totalLearningTime: 0,
    lastActivityDate: undefined as string | undefined,
    milestones: [] as Array<{
      type: string;
      date: string;
      details: Record<string, any>;
    }>
  };

  if (activities.length === 0) {
    return progress;
  }

  let totalQuizScore = 0;
  let totalLearningTimeSeconds = 0;

  activities.forEach(activity => {
    // Track enrollment
    if (activity.activityType === 'learning' && activity.actionType === 'enroll') {
      progress.enrollmentDate = activity.timestamp;
      progress.milestones.push({
        type: 'enrollment',
        date: activity.timestamp,
        details: activity.metadata || {}
      });
    }

    // Track lesson completions
    if (activity.activityType === 'learning' && 
        activity.actionType === 'complete' && 
        activity.resourceType === 'lesson') {
      progress.completedLessons++;
      progress.milestones.push({
        type: 'lesson_completion',
        date: activity.timestamp,
        details: {
          lessonId: activity.lessonId,
          moduleId: activity.moduleId,
          ...activity.metadata
        }
      });
    }

    // Track quiz attempts
    if (activity.activityType === 'assessment' && activity.actionType === 'attempt') {
      progress.totalQuizAttempts++;
      if (activity.score !== undefined) {
        totalQuizScore += activity.score;
      }
      progress.milestones.push({
        type: 'quiz_attempt',
        date: activity.timestamp,
        details: {
          quizId: activity.resourceId,
          score: activity.score,
          ...activity.metadata
        }
      });
    }

    // Track learning time
    if (activity.duration) {
      totalLearningTimeSeconds += activity.duration;
    }
  });

  // Calculate averages
  if (progress.totalQuizAttempts > 0) {
    progress.averageQuizScore = Math.round(totalQuizScore / progress.totalQuizAttempts);
  }
  
  progress.totalLearningTime = Math.round(totalLearningTimeSeconds / 60); // Convert to minutes
  progress.lastActivityDate = activities[0]?.timestamp; // Activities are sorted newest first

  // Sort milestones by date
  progress.milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return progress;
}

/**
 * Get user's daily activity summary
 */
export async function getUserDailyActivitySummary(
  userId: string,
  date: string // YYYY-MM-DD format
): Promise<{
  date: string;
  totalActivities: number;
  learningTime: number; // in minutes
  lessonsCompleted: number;
  quizzesAttempted: number;
  coursesAccessed: Set<string>;
  activityBreakdown: Record<string, number>;
}> {
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  const { activities } = await getUserActivityTimeline(userId, {
    dateFrom: startOfDay,
    dateTo: endOfDay,
    limit: 1000
  });

  const summary = {
    date,
    totalActivities: activities.length,
    learningTime: 0,
    lessonsCompleted: 0,
    quizzesAttempted: 0,
    coursesAccessed: new Set<string>(),
    activityBreakdown: {} as Record<string, number>
  };

  activities.forEach(activity => {
    // Track learning time
    if (activity.duration) {
      summary.learningTime += Math.round(activity.duration / 60); // Convert to minutes
    }

    // Track lesson completions
    if (activity.activityType === 'learning' && 
        activity.actionType === 'complete' && 
        activity.resourceType === 'lesson') {
      summary.lessonsCompleted++;
    }

    // Track quiz attempts
    if (activity.activityType === 'assessment' && activity.actionType === 'attempt') {
      summary.quizzesAttempted++;
    }

    // Track courses accessed
    if (activity.courseId) {
      summary.coursesAccessed.add(activity.courseId);
    }

    // Activity type breakdown
    const key = `${activity.activityType}_${activity.actionType}`;
    summary.activityBreakdown[key] = (summary.activityBreakdown[key] || 0) + 1;
  });

  return summary;
} 