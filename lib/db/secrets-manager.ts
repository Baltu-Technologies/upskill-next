/**
 * AWS Secrets Manager Client for Upskill Platform
 * 
 * This module provides secure runtime access to secrets stored in AWS Secrets Manager.
 * 
 * SECURITY FEATURES:
 * - Server-side only execution (never exposed to client)
 * - In-memory caching with TTL to reduce API calls
 * - Automatic retry with exponential backoff
 * - Connection pooling for better performance
 * - Comprehensive error handling and logging
 * - Runtime client-side protection with security assertions
 * 
 * USAGE:
 * - Only use in server-side code (API routes, server components)
 * - Never import or use in client-side components
 * - Environment variables contain ARNs only, not actual secrets
 */

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { 
  requireServerSide, 
  assertServerSideExecution, 
  getSecureEnvironmentVariable,
  validatePublicEnvironmentVariables 
} from '../security/client-side-protection';

// ========================================
// SECURITY CHECK: Server-side Only Execution
// ========================================

if (typeof window !== 'undefined') {
  throw new Error(
    'SECURITY VIOLATION: Secrets Manager client cannot be used in client-side code. ' +
    'This module must only be imported in server-side code (API routes, server components).'
  );
}

// ========================================
// Configuration and Types
// ========================================

interface SecretCacheEntry {
  value: string;
  retrievedAt: number;
  expiresAt: number;
}

interface DatabaseSecretStructure {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  dbname: string;
  dbInstanceIdentifier: string;
}

interface ApplicationSecretStructure {
  secret: string;
  algorithm?: string;
  encoding?: string;
}

type SecretValue = string | DatabaseSecretStructure | ApplicationSecretStructure;

// ========================================
// Secrets Manager Client Configuration
// ========================================

/**
 * AWS Secrets Manager Client with optimized configuration
 */
const secretsManagerClient = new SecretsManagerClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || 'us-west-2',
  maxAttempts: parseInt(process.env.SECRETS_RETRY_ATTEMPTS || '3'),
  requestHandler: {
    requestTimeout: parseInt(process.env.SECRETS_TIMEOUT || '5000'),
  },
});

// ========================================
// In-Memory Secret Caching
// ========================================

/**
 * In-memory cache for secrets to reduce API calls and improve performance
 * Cache entries expire based on SECRETS_CACHE_TTL environment variable
 */
const secretCache = new Map<string, SecretCacheEntry>();
const defaultCacheTTL = parseInt(process.env.SECRETS_CACHE_TTL || '300') * 1000; // Convert to milliseconds

/**
 * Check if a cached secret is still valid
 */
function isCacheValid(entry: SecretCacheEntry): boolean {
  return Date.now() < entry.expiresAt;
}

/**
 * Store a secret in the cache with TTL
 */
function cacheSecret(arn: string, value: string): void {
  const now = Date.now();
  secretCache.set(arn, {
    value,
    retrievedAt: now,
    expiresAt: now + defaultCacheTTL,
  });
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache(): void {
  const now = Date.now();
  const entries = Array.from(secretCache.entries());
  for (const [arn, entry] of entries) {
    if (now >= entry.expiresAt) {
      secretCache.delete(arn);
    }
  }
}

// Periodic cache cleanup (every 5 minutes)
setInterval(clearExpiredCache, 5 * 60 * 1000);

// ========================================
// Core Secret Retrieval Functions
// ========================================

/**
 * Retrieve a secret value from AWS Secrets Manager
 * 
 * @param secretArn - The ARN of the secret to retrieve
 * @param useCache - Whether to use cached values (default: true)
 * @returns The secret value as a string
 */
export async function getSecret(secretArn: string, useCache: boolean = true): Promise<string> {
  // TASK 13.3: Runtime security assertion
  requireServerSide('getSecret');
  
  // Validate ARN format
  if (!secretArn || !secretArn.startsWith('arn:aws:secretsmanager:')) {
    throw new Error(`Invalid secret ARN format: ${secretArn}`);
  }

  // Check cache first
  if (useCache) {
    const cached = secretCache.get(secretArn);
    if (cached && isCacheValid(cached)) {
      return cached.value;
    }
  }

  try {
    const command = new GetSecretValueCommand({
      SecretId: secretArn,
    });

    const response = await secretsManagerClient.send(command);
    
    if (!response.SecretString) {
      throw new Error(`Secret ${secretArn} contains no string value`);
    }

    // Cache the result
    if (useCache) {
      cacheSecret(secretArn, response.SecretString);
    }

    return response.SecretString;
  } catch (error) {
    console.error(`Failed to retrieve secret ${secretArn}:`, error);
    throw new Error(`Secret retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Retrieve and parse a JSON secret from AWS Secrets Manager
 * 
 * @param secretArn - The ARN of the secret to retrieve
 * @param useCache - Whether to use cached values (default: true)
 * @returns The parsed secret object
 */
export async function getJsonSecret<T = any>(secretArn: string, useCache: boolean = true): Promise<T> {
  const secretString = await getSecret(secretArn, useCache);
  
  try {
    return JSON.parse(secretString) as T;
  } catch (error) {
    throw new Error(`Failed to parse secret ${secretArn} as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ========================================
// Specialized Secret Retrieval Functions
// ========================================

/**
 * Retrieve database connection secrets
 * Returns a structured object with database connection parameters
 */
export async function getDatabaseSecret(secretArn: string): Promise<DatabaseSecretStructure> {
  return getJsonSecret<DatabaseSecretStructure>(secretArn);
}

/**
 * Retrieve application secrets (JWT, session keys, etc.)
 * Returns a structured object with application secret parameters
 */
export async function getApplicationSecret(secretArn: string): Promise<ApplicationSecretStructure> {
  return getJsonSecret<ApplicationSecretStructure>(secretArn);
}

/**
 * Get a simple string secret (for API keys, tokens, etc.)
 */
export async function getStringSecret(secretArn: string): Promise<string> {
  const secret = await getSecret(secretArn);
  
  // Handle both JSON and plain string secrets
  try {
    const parsed = JSON.parse(secret);
    // If it's a JSON object with a 'secret' field, return that
    if (typeof parsed === 'object' && parsed.secret) {
      return parsed.secret;
    }
    // Otherwise return the whole parsed value as string
    return String(parsed);
  } catch {
    // If not JSON, return as-is
    return secret;
  }
}

// ========================================
// Environment Variable to Secret ARN Mapping
// ========================================

/**
 * Get secret ARNs from environment variables
 * This provides a centralized way to access secret ARNs from environment configuration
 */
export const SECRET_ARNS = {
  // Database secrets
  AUTH_DB: process.env.AUTH_DB_SECRET_ARN || '',
  COURSE_DB: process.env.COURSE_DB_SECRET_ARN || '',
  
  // Application secrets
  JWT: process.env.JWT_SECRET_ARN || '',
  SESSION: process.env.SESSION_SECRET_ARN || '',
  
  // External service secrets
  EMAIL_API: process.env.EMAIL_API_SECRET_ARN || '',
  PAYMENT_API: process.env.PAYMENT_API_SECRET_ARN || '',
  STORAGE_API: process.env.STORAGE_API_SECRET_ARN || '',
  ANALYTICS_API: process.env.ANALYTICS_API_SECRET_ARN || '',
} as const;

/**
 * Validate that all required secret ARNs are configured
 */
export function validateSecretConfiguration(): void {
  const missingSecrets: string[] = [];
  
  Object.entries(SECRET_ARNS).forEach(([name, arn]) => {
    if (!arn) {
      missingSecrets.push(name);
    }
  });
  
  if (missingSecrets.length > 0) {
    throw new Error(`Missing secret ARN configuration for: ${missingSecrets.join(', ')}`);
  }
}

// ========================================
// Convenience Functions for Common Operations
// ========================================

/**
 * Get auth database connection string with secrets
 * Returns a complete PostgreSQL connection string
 */
export async function getAuthDatabaseUrl(): Promise<string> {
  // TASK 13.3: Runtime security assertion
  requireServerSide('getAuthDatabaseUrl');
  
  if (!SECRET_ARNS.AUTH_DB) {
    // Fallback to environment variable if secret not configured
    return getSecureEnvironmentVariable('AUTH_DB_URL', { allowClientSide: false }) || 
           getSecureEnvironmentVariable('BETTER_AUTH_DATABASE_URL', { allowClientSide: false }) || '';
  }
  
  const dbSecret = await getDatabaseSecret(SECRET_ARNS.AUTH_DB);
  return `postgresql://${dbSecret.username}:${dbSecret.password}@${dbSecret.host}:${dbSecret.port}/${dbSecret.dbname}`;
}

/**
 * Get course database connection string with secrets
 * Returns a complete PostgreSQL connection string
 */
export async function getCourseDatabaseUrl(): Promise<string> {
  // TASK 13.3: Runtime security assertion
  requireServerSide('getCourseDatabaseUrl');
  
  if (!SECRET_ARNS.COURSE_DB) {
    // Fallback to environment variable if secret not configured
    return getSecureEnvironmentVariable('COURSE_DB_URL', { allowClientSide: false }) || '';
  }
  
  const dbSecret = await getDatabaseSecret(SECRET_ARNS.COURSE_DB);
  return `postgresql://${dbSecret.username}:${dbSecret.password}@${dbSecret.host}:${dbSecret.port}/${dbSecret.dbname}`;
}

/**
 * Get JWT secret for token signing
 */
export async function getJwtSecret(): Promise<string> {
  // TASK 13.3: Runtime security assertion
  requireServerSide('getJwtSecret');
  
  if (!SECRET_ARNS.JWT) {
    throw new Error('JWT secret ARN not configured');
  }
  
  return getStringSecret(SECRET_ARNS.JWT);
}

/**
 * Get session secret for session management
 */
export async function getSessionSecret(): Promise<string> {
  // TASK 13.3: Runtime security assertion
  requireServerSide('getSessionSecret');
  
  if (!SECRET_ARNS.SESSION) {
    throw new Error('Session secret ARN not configured');
  }
  
  return getStringSecret(SECRET_ARNS.SESSION);
}

// ========================================
// Cache Management Functions
// ========================================

/**
 * Clear all cached secrets (useful for testing or forced refresh)
 */
export function clearSecretCache(): void {
  secretCache.clear();
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats(): {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
} {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  
  const values = Array.from(secretCache.values());
  for (const entry of values) {
    if (now < entry.expiresAt) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }
  
  return {
    totalEntries: secretCache.size,
    validEntries,
    expiredEntries,
  };
}

/**
 * SECURITY SUMMARY:
 * 
 * ✅ Server-side Only: Throws error if used in client-side code
 * ✅ Secure Caching: In-memory cache with TTL, no persistent storage
 * ✅ Error Handling: Comprehensive error handling and logging
 * ✅ Connection Pooling: Optimized AWS SDK configuration
 * ✅ Environment Integration: Uses environment variables for ARN configuration
 * ✅ Type Safety: TypeScript interfaces for all secret types
 * ✅ Convenience Functions: Easy-to-use functions for common operations
 * ✅ Cache Management: Automatic cleanup and monitoring capabilities
 */ 