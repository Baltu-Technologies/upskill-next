/**
 * Environment Configuration Manager
 * Provides type-safe access to environment variables and handles environment-specific configuration loading
 */

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  // Application
  NODE_ENV: string;
  APP_ENV: Environment;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_API_URL: string;

  // Auth0
  AUTH0_SECRET: string;
  AUTH0_BASE_URL: string;
  AUTH0_ISSUER_BASE_URL: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_SCOPE: string;
  AUTH0_AUDIENCE: string;
  AUTH0_ORGANIZATION_ID: string;

  // Database
  DATABASE_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_SSL: boolean;
  RDS_PROXY_ENDPOINT: string;
  RDS_PROXY_PORT: number;

  // AWS
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;

  // S3
  S3_BUCKET_NAME: string;
  S3_REGION: string;
  NEXT_PUBLIC_S3_BUCKET_NAME: string;

  // Redis
  REDIS_PROVIDER: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;

  // DynamoDB
  DYNAMODB_TABLE_PREFIX: string;
  DYNAMODB_REGION: string;

  // Email
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  FROM_EMAIL: string;

  // Logging & Monitoring
  LOG_LEVEL: string;
  SENTRY_DSN: string;
  SENTRY_ENVIRONMENT: string;

  // Feature Flags
  FEATURE_ADVANCED_ANALYTICS: boolean;
  FEATURE_ENTERPRISE_SSO: boolean;
  FEATURE_CUSTOM_BRANDING: boolean;

  // Rate Limiting
  RATE_LIMIT_ENABLED: boolean;
  RATE_LIMIT_MAX_REQUESTS: number;
  RATE_LIMIT_WINDOW_MS: number;

  // File Upload
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string;

  // Cache TTL
  CACHE_TTL_SHORT: number;
  CACHE_TTL_MEDIUM: number;
  CACHE_TTL_LONG: number;

  // Development/Debug
  NEXT_PUBLIC_DEBUG_MODE: boolean;
  ENABLE_DEV_TOOLS: boolean;
  BYPASS_AUTH_FOR_TESTING: boolean;

  // Security (production only)
  SECURITY_HEADERS_ENABLED?: boolean;
  HSTS_MAX_AGE?: number;
  CSP_ENABLED?: boolean;
  FRAME_OPTIONS?: string;

  // Performance (production only)
  COMPRESSION_ENABLED?: boolean;
  CACHE_STATIC_ASSETS?: boolean;
  CDN_ENABLED?: boolean;
}

/**
 * Get the current environment
 */
export function getCurrentEnvironment(): Environment {
  const appEnv = process.env.APP_ENV || process.env.NODE_ENV || 'development';
  
  // Map NODE_ENV to APP_ENV if needed
  switch (appEnv) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    case 'development':
    case 'dev':
      return 'development';
    default:
      return 'development';
  }
}

/**
 * Get required environment variable
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get optional environment variable with default
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) return defaultValue;
  return num;
}

/**
 * Load environment configuration
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  const currentEnv = getCurrentEnvironment();

  // Base configuration required for all environments
  const baseConfig: EnvironmentConfig = {
    // Application
    NODE_ENV: getRequiredEnv('NODE_ENV'),
    APP_ENV: currentEnv,
    NEXT_PUBLIC_APP_URL: getRequiredEnv('NEXT_PUBLIC_APP_URL'),
    NEXT_PUBLIC_API_URL: getRequiredEnv('NEXT_PUBLIC_API_URL'),

    // Auth0
    AUTH0_SECRET: getRequiredEnv('AUTH0_SECRET'),
    AUTH0_BASE_URL: getRequiredEnv('AUTH0_BASE_URL'),
    AUTH0_ISSUER_BASE_URL: getRequiredEnv('AUTH0_ISSUER_BASE_URL'),
    AUTH0_CLIENT_ID: getRequiredEnv('AUTH0_CLIENT_ID'),
    AUTH0_CLIENT_SECRET: getRequiredEnv('AUTH0_CLIENT_SECRET'),
    AUTH0_SCOPE: getOptionalEnv('AUTH0_SCOPE', 'openid profile email'),
    AUTH0_AUDIENCE: getRequiredEnv('AUTH0_AUDIENCE'),
    AUTH0_ORGANIZATION_ID: getRequiredEnv('AUTH0_ORGANIZATION_ID'),

    // Database
    DATABASE_URL: getRequiredEnv('DATABASE_URL'),
    DB_HOST: getRequiredEnv('DB_HOST'),
    DB_PORT: getNumberEnv('DB_PORT', 5432),
    DB_NAME: getRequiredEnv('DB_NAME'),
    DB_USER: getRequiredEnv('DB_USER'),
    DB_PASSWORD: getRequiredEnv('DB_PASSWORD'),
    DB_SSL: getBooleanEnv('DB_SSL', true),
    RDS_PROXY_ENDPOINT: getRequiredEnv('RDS_PROXY_ENDPOINT'),
    RDS_PROXY_PORT: getNumberEnv('RDS_PROXY_PORT', 5432),

    // AWS
    AWS_REGION: getOptionalEnv('AWS_REGION', 'us-west-2'),
    AWS_ACCESS_KEY_ID: getRequiredEnv('AWS_ACCESS_KEY_ID'),
    AWS_SECRET_ACCESS_KEY: getRequiredEnv('AWS_SECRET_ACCESS_KEY'),

    // S3
    S3_BUCKET_NAME: getRequiredEnv('S3_BUCKET_NAME'),
    S3_REGION: getOptionalEnv('S3_REGION', 'us-west-2'),
    NEXT_PUBLIC_S3_BUCKET_NAME: getRequiredEnv('NEXT_PUBLIC_S3_BUCKET_NAME'),

    // Redis
    REDIS_PROVIDER: getOptionalEnv('REDIS_PROVIDER', 'upstash'),
    UPSTASH_REDIS_REST_URL: getRequiredEnv('UPSTASH_REDIS_REST_URL'),
    UPSTASH_REDIS_REST_TOKEN: getRequiredEnv('UPSTASH_REDIS_REST_TOKEN'),

    // DynamoDB
    DYNAMODB_TABLE_PREFIX: getRequiredEnv('DYNAMODB_TABLE_PREFIX'),
    DYNAMODB_REGION: getOptionalEnv('DYNAMODB_REGION', 'us-west-2'),

    // Email
    SMTP_HOST: getRequiredEnv('SMTP_HOST'),
    SMTP_PORT: getNumberEnv('SMTP_PORT', 587),
    SMTP_USER: getRequiredEnv('SMTP_USER'),
    SMTP_PASS: getRequiredEnv('SMTP_PASS'),
    FROM_EMAIL: getRequiredEnv('FROM_EMAIL'),

    // Logging & Monitoring
    LOG_LEVEL: getOptionalEnv('LOG_LEVEL', 'info'),
    SENTRY_DSN: getOptionalEnv('SENTRY_DSN', ''),
    SENTRY_ENVIRONMENT: getOptionalEnv('SENTRY_ENVIRONMENT', currentEnv),

    // Feature Flags
    FEATURE_ADVANCED_ANALYTICS: getBooleanEnv('FEATURE_ADVANCED_ANALYTICS', false),
    FEATURE_ENTERPRISE_SSO: getBooleanEnv('FEATURE_ENTERPRISE_SSO', false),
    FEATURE_CUSTOM_BRANDING: getBooleanEnv('FEATURE_CUSTOM_BRANDING', false),

    // Rate Limiting
    RATE_LIMIT_ENABLED: getBooleanEnv('RATE_LIMIT_ENABLED', false),
    RATE_LIMIT_MAX_REQUESTS: getNumberEnv('RATE_LIMIT_MAX_REQUESTS', 100),
    RATE_LIMIT_WINDOW_MS: getNumberEnv('RATE_LIMIT_WINDOW_MS', 60000),

    // File Upload
    MAX_FILE_SIZE: getNumberEnv('MAX_FILE_SIZE', 10485760), // 10MB
    ALLOWED_FILE_TYPES: getOptionalEnv('ALLOWED_FILE_TYPES', 'jpg,jpeg,png,pdf,doc,docx'),

    // Cache TTL
    CACHE_TTL_SHORT: getNumberEnv('CACHE_TTL_SHORT', 300), // 5 minutes
    CACHE_TTL_MEDIUM: getNumberEnv('CACHE_TTL_MEDIUM', 1800), // 30 minutes
    CACHE_TTL_LONG: getNumberEnv('CACHE_TTL_LONG', 3600), // 1 hour

    // Development/Debug
    NEXT_PUBLIC_DEBUG_MODE: getBooleanEnv('NEXT_PUBLIC_DEBUG_MODE', false),
    ENABLE_DEV_TOOLS: getBooleanEnv('ENABLE_DEV_TOOLS', false),
    BYPASS_AUTH_FOR_TESTING: getBooleanEnv('BYPASS_AUTH_FOR_TESTING', false),
  };

  // Add production-specific configuration
  if (currentEnv === 'production') {
    return {
      ...baseConfig,
      SECURITY_HEADERS_ENABLED: getBooleanEnv('SECURITY_HEADERS_ENABLED', true),
      HSTS_MAX_AGE: getNumberEnv('HSTS_MAX_AGE', 31536000),
      CSP_ENABLED: getBooleanEnv('CSP_ENABLED', true),
      FRAME_OPTIONS: getOptionalEnv('FRAME_OPTIONS', 'DENY'),
      COMPRESSION_ENABLED: getBooleanEnv('COMPRESSION_ENABLED', true),
      CACHE_STATIC_ASSETS: getBooleanEnv('CACHE_STATIC_ASSETS', true),
      CDN_ENABLED: getBooleanEnv('CDN_ENABLED', true),
    };
  }

  return baseConfig;
}

/**
 * Global environment configuration instance
 */
export const env = loadEnvironmentConfig();

/**
 * Environment-specific configuration helpers
 */
export const envHelpers = {
  isDevelopment: () => env.APP_ENV === 'development',
  isStaging: () => env.APP_ENV === 'staging',
  isProduction: () => env.APP_ENV === 'production',
  isServer: () => typeof window === 'undefined',
  isClient: () => typeof window !== 'undefined',
  
  // Database helpers
  getDatabaseUrl: () => env.DATABASE_URL,
  getRedisUrl: () => env.UPSTASH_REDIS_REST_URL,
  
  // Auth0 helpers
  getAuth0Config: () => ({
    domain: env.AUTH0_ISSUER_BASE_URL,
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    audience: env.AUTH0_AUDIENCE,
    organizationId: env.AUTH0_ORGANIZATION_ID,
  }),
  
  // S3 helpers
  getS3Config: () => ({
    bucketName: env.S3_BUCKET_NAME,
    region: env.S3_REGION,
    publicBucketName: env.NEXT_PUBLIC_S3_BUCKET_NAME,
  }),
  
  // Feature flag helpers
  isFeatureEnabled: (feature: keyof Pick<EnvironmentConfig, 'FEATURE_ADVANCED_ANALYTICS' | 'FEATURE_ENTERPRISE_SSO' | 'FEATURE_CUSTOM_BRANDING'>) => {
    return env[feature];
  },
  
  // Email helpers
  getEmailConfig: () => ({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.FROM_EMAIL,
  }),
  
  // Logging helpers
  shouldLogLevel: (level: 'debug' | 'info' | 'warn' | 'error') => {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[env.LOG_LEVEL as keyof typeof levels];
  },
};

/**
 * Validate environment configuration
 */
export function validateEnvironmentConfig(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  try {
    // Validate required environment variables
    const requiredVars = [
      'AUTH0_SECRET',
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET',
      'AUTH0_ISSUER_BASE_URL',
      'DATABASE_URL',
      'S3_BUCKET_NAME',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ];
    
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    }
    
    // Validate URL formats
    const urlVars = [
      'NEXT_PUBLIC_APP_URL',
      'NEXT_PUBLIC_API_URL',
      'AUTH0_BASE_URL',
      'AUTH0_ISSUER_BASE_URL',
      'DATABASE_URL',
      'UPSTASH_REDIS_REST_URL',
    ];
    
    for (const varName of urlVars) {
      const value = process.env[varName];
      if (value) {
        try {
          new URL(value);
        } catch {
          errors.push(`Invalid URL format for ${varName}: ${value}`);
        }
      }
    }
    
    // Validate Auth0 secret length
    if (process.env.AUTH0_SECRET && process.env.AUTH0_SECRET.length < 32) {
      errors.push('AUTH0_SECRET must be at least 32 characters long');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Environment validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Log environment configuration (safe for production)
 */
export function logEnvironmentInfo(): void {
  if (envHelpers.isServer()) {
    console.log('🚀 Environment Configuration:', {
      environment: env.APP_ENV,
      nodeEnv: env.NODE_ENV,
      appUrl: env.NEXT_PUBLIC_APP_URL,
      databaseHost: env.DB_HOST,
      redisProvider: env.REDIS_PROVIDER,
      logLevel: env.LOG_LEVEL,
      featuresEnabled: {
        analytics: env.FEATURE_ADVANCED_ANALYTICS,
        sso: env.FEATURE_ENTERPRISE_SSO,
        branding: env.FEATURE_CUSTOM_BRANDING,
      },
      rateLimitEnabled: env.RATE_LIMIT_ENABLED,
      debugMode: env.NEXT_PUBLIC_DEBUG_MODE,
    });
  }
} 