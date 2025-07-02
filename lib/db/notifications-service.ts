/**
 * Notifications Service
 * 
 * High-level service for managing user notifications using DynamoDB.
 * Implements optimized access patterns for notification management.
 * 
 * Access Patterns:
 * 1. Get user notifications (by userId)
 * 2. Get unread notifications (GSI: readStatus)
 * 3. Get notifications by type (GSI: notificationType)
 * 4. Mark notifications as read/unread
 * 5. Create new notifications
 * 6. Delete expired notifications
 */

import { 
  NotificationItem, 
  getItem, 
  putItem, 
  updateItem, 
  deleteItem, 
  queryItems,
  tableNames 
} from './dynamodb-client';

// ========================================
// Notification Creation
// ========================================

/**
 * Create a new notification for a user
 */
export async function createNotification(params: {
  userId: string;
  notificationType: NotificationItem['notificationType'];
  title: string;
  message: string;
  priority?: NotificationItem['priority'];
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresInDays?: number;
}): Promise<string> {
  const notificationId = generateNotificationId(params.notificationType);
  const now = new Date().toISOString();
  
  const notification: NotificationItem = {
    userId: params.userId,
    notificationId,
    notificationType: params.notificationType,
    title: params.title,
    message: params.message,
    readStatus: 'unread',
    priority: params.priority || 'medium',
    createdAt: now,
    actionUrl: params.actionUrl,
    metadata: params.metadata,
  };

  // Set expiration if specified
  if (params.expiresInDays) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + params.expiresInDays);
    notification.expiresAt = expirationDate.toISOString();
  }

  await putItem<NotificationItem>(
    tableNames.notifications, 
    notification,
    // Prevent duplicate notifications
    'attribute_not_exists(notificationId)'
  );
  
  return notificationId;
}

/**
 * Generate unique notification ID
 */
function generateNotificationId(notificationType: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${notificationType}_${timestamp}_${random}`;
}

// ========================================
// Notification Retrieval
// ========================================

/**
 * Get notifications for a specific user
 */
export async function getUserNotifications(
  userId: string,
  options: {
    limit?: number;
    unreadOnly?: boolean;
    notificationType?: NotificationItem['notificationType'];
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ notifications: NotificationItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression: string | undefined;
  let expressionAttributeNames: Record<string, string> | undefined;
  let expressionAttributeValues: Record<string, any> | undefined;

  // Apply filters
  const filters: string[] = [];
  if (options.unreadOnly) {
    filters.push('#readStatus = :unread');
    expressionAttributeNames = { '#readStatus': 'readStatus' };
    expressionAttributeValues = { ':unread': 'unread' };
  }
  
  if (options.notificationType) {
    filters.push('#notificationType = :notificationType');
    expressionAttributeNames = { 
      ...expressionAttributeNames, 
      '#notificationType': 'notificationType' 
    };
    expressionAttributeValues = { 
      ...expressionAttributeValues, 
      ':notificationType': options.notificationType 
    };
  }

  if (filters.length > 0) {
    filterExpression = filters.join(' AND ');
  }

  const result = await queryItems<NotificationItem>(
    tableNames.notifications,
    'userId = :userId',
    expressionAttributeNames,
    { ...expressionAttributeValues, ':userId': userId },
    undefined, // indexName
    filterExpression,
    options.limit || 50,
    false, // scanIndexForward (newest first)
    options.lastEvaluatedKey
  );

  return {
    notifications: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

/**
 * Get unread notifications across all users (for admin dashboard)
 */
export async function getUnreadNotifications(options: {
  limit?: number;
  priority?: NotificationItem['priority'];
  lastEvaluatedKey?: Record<string, any>;
} = {}): Promise<{ notifications: NotificationItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression: string | undefined;
  let expressionAttributeNames: Record<string, string> | undefined;
  let expressionAttributeValues: Record<string, any> = { ':unread': 'unread' };

  if (options.priority) {
    filterExpression = '#priority = :priority';
    expressionAttributeNames = { '#priority': 'priority' };
    expressionAttributeValues = { ...expressionAttributeValues, ':priority': options.priority };
  }

  const result = await queryItems<NotificationItem>(
    tableNames.notifications,
    'readStatus = :unread',
    expressionAttributeNames,
    expressionAttributeValues,
    'ReadStatusIndex', // GSI
    filterExpression,
    options.limit || 100,
    false, // newest first
    options.lastEvaluatedKey
  );

  return {
    notifications: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

/**
 * Get notifications by type (for analytics/monitoring)
 */
export async function getNotificationsByType(
  notificationType: NotificationItem['notificationType'],
  options: {
    limit?: number;
    dateFrom?: string; // ISO string
    dateTo?: string; // ISO string
    lastEvaluatedKey?: Record<string, any>;
  } = {}
): Promise<{ notifications: NotificationItem[]; lastEvaluatedKey?: Record<string, any> }> {
  
  let filterExpression: string | undefined;
  let expressionAttributeNames: Record<string, string> | undefined;
  let expressionAttributeValues: Record<string, any> = { ':notificationType': notificationType };

  // Apply date range filter
  if (options.dateFrom || options.dateTo) {
    const dateFilters: string[] = [];
    if (options.dateFrom) {
      dateFilters.push('#createdAt >= :dateFrom');
      expressionAttributeValues[':dateFrom'] = options.dateFrom;
    }
    if (options.dateTo) {
      dateFilters.push('#createdAt <= :dateTo');
      expressionAttributeValues[':dateTo'] = options.dateTo;
    }
    
    if (dateFilters.length > 0) {
      filterExpression = dateFilters.join(' AND ');
      expressionAttributeNames = { '#createdAt': 'createdAt' };
    }
  }

  const result = await queryItems<NotificationItem>(
    tableNames.notifications,
    'notificationType = :notificationType',
    expressionAttributeNames,
    expressionAttributeValues,
    'NotificationTypeIndex', // GSI
    filterExpression,
    options.limit || 100,
    false, // newest first
    options.lastEvaluatedKey
  );

  return {
    notifications: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  };
}

// ========================================
// Notification Updates
// ========================================

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  userId: string, 
  notificationId: string
): Promise<void> {
  await updateItem(
    tableNames.notifications,
    { userId, notificationId },
    'SET readStatus = :read, updatedAt = :now',
    undefined,
    { 
      ':read': 'read',
      ':now': new Date().toISOString()
    },
    'attribute_exists(notificationId)' // Ensure notification exists
  );
}

/**
 * Mark multiple notifications as read
 */
export async function markNotificationsAsRead(
  userId: string, 
  notificationIds: string[]
): Promise<{ successful: string[]; failed: string[] }> {
  const results = {
    successful: [] as string[],
    failed: [] as string[]
  };

  // Process in parallel with error handling
  await Promise.allSettled(
    notificationIds.map(async (notificationId) => {
      try {
        await markNotificationAsRead(userId, notificationId);
        results.successful.push(notificationId);
      } catch (error) {
        console.error(`Failed to mark notification ${notificationId} as read:`, error);
        results.failed.push(notificationId);
      }
    })
  );

  return results;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  let count = 0;
  let lastEvaluatedKey: Record<string, any> | undefined;

  do {
    // Get unread notifications for the user
    const result = await getUserNotifications(userId, {
      unreadOnly: true,
      limit: 25, // Process in batches
      lastEvaluatedKey
    });

    if (result.notifications.length === 0) {
      break;
    }

    // Mark each notification as read
    const notificationIds = result.notifications.map(n => n.notificationId);
    const updateResult = await markNotificationsAsRead(userId, notificationIds);
    count += updateResult.successful.length;
    
    lastEvaluatedKey = result.lastEvaluatedKey;
  } while (lastEvaluatedKey);

  return count;
}

/**
 * Update notification metadata
 */
export async function updateNotificationMetadata(
  userId: string,
  notificationId: string,
  metadata: Record<string, any>
): Promise<void> {
  await updateItem(
    tableNames.notifications,
    { userId, notificationId },
    'SET metadata = :metadata, updatedAt = :now',
    undefined,
    {
      ':metadata': metadata,
      ':now': new Date().toISOString()
    },
    'attribute_exists(notificationId)'
  );
}

// ========================================
// Notification Deletion
// ========================================

/**
 * Delete a specific notification
 */
export async function deleteNotification(
  userId: string, 
  notificationId: string
): Promise<void> {
  await deleteItem(
    tableNames.notifications,
    { userId, notificationId },
    'attribute_exists(notificationId)' // Ensure notification exists
  );
}

/**
 * Delete expired notifications (cleanup job)
 */
export async function deleteExpiredNotifications(): Promise<number> {
  // This would typically be run as a scheduled job
  // For now, we'll implement a scan-based approach
  // In production, consider using DynamoDB TTL instead
  
  // Note: This is a simplified implementation
  // In production, you'd use DynamoDB TTL or a more efficient cleanup strategy
  console.log('Expired notification cleanup should be implemented as a scheduled job');
  return 0;
}

// ========================================
// Notification Statistics
// ========================================

/**
 * Get notification statistics for a user
 */
export async function getUserNotificationStats(userId: string): Promise<{
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}> {
  // Get all notifications for the user
  const { notifications } = await getUserNotifications(userId, { limit: 1000 });
  
  const stats = {
    total: notifications.length,
    unread: 0,
    byType: {} as Record<string, number>,
    byPriority: {} as Record<string, number>
  };

  notifications.forEach(notification => {
    // Count unread
    if (notification.readStatus === 'unread') {
      stats.unread++;
    }

    // Count by type
    stats.byType[notification.notificationType] = 
      (stats.byType[notification.notificationType] || 0) + 1;

    // Count by priority
    stats.byPriority[notification.priority] = 
      (stats.byPriority[notification.priority] || 0) + 1;
  });

  return stats;
} 