/**
 * DynamoDB Client for Real-Time Features
 * 
 * High-performance DynamoDB client for:
 * - Notifications (user alerts, system messages)
 * - Activity Streams (user behavior tracking, course progress)
 * - Analytics (metrics, engagement data, reporting)
 * 
 * Uses AWS SDK v3 with DynamoDBDocumentClient for simplified operations
 */

import { 
  DynamoDBClient, 
  DynamoDBClientConfig 
} from '@aws-sdk/client-dynamodb';

import { 
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  BatchGetCommand,
  BatchWriteCommand,
  TransactWriteCommand,
  TransactGetCommand
} from '@aws-sdk/lib-dynamodb';

// ========================================
// Configuration and Environment
// ========================================

interface DynamoDBConfig {
  region: string;
  tableName: {
    notifications: string;
    activityStreams: string;
    analytics: string;
  };
  maxRetries?: number;
  requestTimeout?: number;
}

/**
 * Get DynamoDB configuration from environment variables
 */
export function getDynamoDBConfig(): DynamoDBConfig {
  const region = process.env.AWS_REGION || 'us-west-2';
  
  return {
    region,
    tableName: {
      notifications: process.env.DYNAMODB_NOTIFICATIONS_TABLE || 'upskill-notifications',
      activityStreams: process.env.DYNAMODB_ACTIVITY_STREAMS_TABLE || 'upskill-activity-streams',
      analytics: process.env.DYNAMODB_ANALYTICS_TABLE || 'upskill-analytics'
    },
    maxRetries: parseInt(process.env.DYNAMODB_MAX_RETRIES || '3'),
    requestTimeout: parseInt(process.env.DYNAMODB_REQUEST_TIMEOUT || '5000')
  };
}

// ========================================
// Client Initialization
// ========================================

/**
 * Create optimized DynamoDB client for high-velocity operations
 */
function createDynamoDBClient(): DynamoDBDocumentClient {
  const config = getDynamoDBConfig();
  
  const clientConfig: DynamoDBClientConfig = {
    region: config.region,
    maxAttempts: config.maxRetries,
    requestHandler: {
      requestTimeout: config.requestTimeout
    },
    // Optimize for performance
    retryMode: 'adaptive'
  };

  // In development/local, use local DynamoDB if available
  if (process.env.NODE_ENV === 'development' && process.env.DYNAMODB_ENDPOINT) {
    clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
    clientConfig.credentials = {
      accessKeyId: 'fakeKey',
      secretAccessKey: 'fakeSecret'
    };
  }

  const dynamoDbClient = new DynamoDBClient(clientConfig);
  
  // Use DynamoDBDocumentClient for simplified data operations
  return DynamoDBDocumentClient.from(dynamoDbClient, {
    marshallOptions: {
      // Convert empty values (null, undefined, '') to DynamoDB NULL
      convertEmptyValues: true,
      // Remove undefined values instead of failing
      removeUndefinedValues: true,
      // Convert class instances to maps
      convertClassInstanceToMap: false
    },
    unmarshallOptions: {
      // Return numbers as numbers instead of strings
      wrapNumbers: false
    }
  });
}

// Global client instance (singleton pattern)
let dynamoDbClient: DynamoDBDocumentClient | null = null;

/**
 * Get the singleton DynamoDB client instance
 */
export function getDynamoDBClient(): DynamoDBDocumentClient {
  if (!dynamoDbClient) {
    dynamoDbClient = createDynamoDBClient();
  }
  return dynamoDbClient;
}

/**
 * Test DynamoDB connection and configuration
 */
export async function testDynamoDBConnection(): Promise<boolean> {
  try {
    const client = getDynamoDBClient();
    const config = getDynamoDBConfig();
    
    // Simple ping test - try to scan one of our tables with limit 1
    await client.send(new ScanCommand({
      TableName: config.tableName.notifications,
      Limit: 1
    }));
    
    console.log('✅ DynamoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ DynamoDB connection failed:', error);
    return false;
  }
}

// ========================================
// Type Definitions
// ========================================

/**
 * Notification item structure
 */
export interface NotificationItem {
  userId: string;
  notificationId: string;
  notificationType: 'course_update' | 'achievement' | 'reminder' | 'system' | 'assignment';
  title: string;
  message: string;
  readStatus: 'read' | 'unread';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string; // ISO timestamp
  expiresAt?: string; // Optional expiration
  metadata?: Record<string, any>;
  actionUrl?: string;
}

/**
 * Activity stream item structure
 */
export interface ActivityStreamItem {
  userId: string;
  activityId: string;
  timestamp: string; // ISO timestamp
  activityType: 'learning' | 'engagement' | 'assessment' | 'system';
  actionType: 'start' | 'complete' | 'attempt' | 'view' | 'enroll' | 'watch' | 'download' | 'login' | 'search';
  resourceId?: string;
  resourceType?: 'course' | 'lesson' | 'quiz' | 'video' | 'document';
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  duration?: number; // seconds
  score?: number; // for assessments
  metadata?: Record<string, any>;
  deviceInfo?: {
    platform: string;
    browser: string;
    isMobile: boolean;
  };
}

/**
 * Analytics metric item structure
 */
export interface AnalyticsItem {
  metricDate: string; // YYYY-MM-DD format (partition key)
  metricId: string; // metricType#timestamp#userId format
  metricType: 'page_view' | 'course_completion' | 'quiz_score' | 'time_spent' | 'user_engagement';
  timestamp: string; // ISO timestamp
  userId?: string;
  courseId?: string;
  value: number;
  metadata?: Record<string, any>;
}

// ========================================
// Base Operations (Generic CRUD)
// ========================================

/**
 * Generic get item operation
 */
export async function getItem<T>(
  tableName: string, 
  key: Record<string, any>
): Promise<T | null> {
  try {
    const client = getDynamoDBClient();
    const response = await client.send(new GetCommand({
      TableName: tableName,
      Key: key
    }));
    
    return response.Item as T || null;
  } catch (error) {
    console.error(`Error getting item from ${tableName}:`, error);
    throw error;
  }
}

/**
 * Generic put item operation
 */
export async function putItem<T extends Record<string, any>>(
  tableName: string, 
  item: T,
  conditionExpression?: string,
  expressionAttributeNames?: Record<string, string>
): Promise<void> {
  try {
    const client = getDynamoDBClient();
    await client.send(new PutCommand({
      TableName: tableName,
      Item: item,
      ConditionExpression: conditionExpression,
      ExpressionAttributeNames: expressionAttributeNames
    }));
  } catch (error) {
    console.error(`Error putting item to ${tableName}:`, error);
    throw error;
  }
}

/**
 * Generic update item operation
 */
export async function updateItem(
  tableName: string,
  key: Record<string, any>,
  updateExpression: string,
  expressionAttributeNames?: Record<string, string>,
  expressionAttributeValues?: Record<string, any>,
  conditionExpression?: string
): Promise<void> {
  try {
    const client = getDynamoDBClient();
    await client.send(new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: conditionExpression
    }));
  } catch (error) {
    console.error(`Error updating item in ${tableName}:`, error);
    throw error;
  }
}

/**
 * Generic delete item operation
 */
export async function deleteItem(
  tableName: string,
  key: Record<string, any>,
  conditionExpression?: string,
  expressionAttributeNames?: Record<string, string>,
  expressionAttributeValues?: Record<string, any>
): Promise<void> {
  try {
    const client = getDynamoDBClient();
    await client.send(new DeleteCommand({
      TableName: tableName,
      Key: key,
      ConditionExpression: conditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }));
  } catch (error) {
    console.error(`Error deleting item from ${tableName}:`, error);
    throw error;
  }
}

/**
 * Generic query operation
 */
export async function queryItems<T>(
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeNames?: Record<string, string>,
  expressionAttributeValues?: Record<string, any>,
  indexName?: string,
  filterExpression?: string,
  limit?: number,
  scanIndexForward?: boolean,
  exclusiveStartKey?: Record<string, any>
): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> {
  try {
    const client = getDynamoDBClient();
    const response = await client.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      IndexName: indexName,
      FilterExpression: filterExpression,
      Limit: limit,
      ScanIndexForward: scanIndexForward,
      ExclusiveStartKey: exclusiveStartKey
    }));
    
    return {
      items: (response.Items as T[]) || [],
      lastEvaluatedKey: response.LastEvaluatedKey
    };
  } catch (error) {
    console.error(`Error querying items from ${tableName}:`, error);
    throw error;
  }
}

/**
 * Generic batch get operation
 */
export async function batchGetItems<T>(
  requestItems: Record<string, { Keys: Record<string, any>[] }>
): Promise<Record<string, T[]>> {
  try {
    const client = getDynamoDBClient();
    const response = await client.send(new BatchGetCommand({
      RequestItems: requestItems
    }));
    
    return response.Responses as Record<string, T[]> || {};
  } catch (error) {
    console.error('Error batch getting items:', error);
    throw error;
  }
}

/**
 * Generic batch put operation
 */
export async function batchPutItems<T extends Record<string, any>>(
  tableName: string,
  items: T[]
): Promise<void> {
  try {
    const client = getDynamoDBClient();
    
    // DynamoDB batch write has a limit of 25 items per request
    const batchSize = 25;
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      const requestItems = {
        [tableName]: batch.map(item => ({
          PutRequest: {
            Item: item
          }
        }))
      };

      await client.send(new BatchWriteCommand({
        RequestItems: requestItems
      }));
    }
  } catch (error) {
    console.error(`Error batch putting items to ${tableName}:`, error);
    throw error;
  }
}

// ========================================
// Export Configuration for Environment
// ========================================

/**
 * Table names for use in application code
 */
export const tableNames = getDynamoDBConfig().tableName; 