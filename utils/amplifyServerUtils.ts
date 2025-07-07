/**
 * Amplify Server-Side Context Utilities
 * 
 * This utility provides secure, per-request access to Amplify APIs from 
 * Next.js server components and API routes using the recommended 
 * `runWithAmplifyServerContext` pattern.
 */

// TODO: Install @aws-amplify/adapter-nextjs packages when ready
// import { createServerRunner } from '@aws-amplify/adapter-nextjs'
// import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import amplifyConfig from '../amplify_outputs.json'

/**
 * Configure Amplify for server-side usage
 * TODO: Uncomment when @aws-amplify/adapter-nextjs is installed
 */
// export const { runWithAmplifyServerContext } = createServerRunner({
//   config: amplifyConfig,
// })

/**
 * Get Amplify Data client for server components
 * Uses cookies for authentication context
 * TODO: Uncomment when @aws-amplify/adapter-nextjs is installed
 */
// export const getAmplifyDataClient = () => {
//   return generateServerClientUsingCookies({
//     config: amplifyConfig,
//     cookies,
//   })
// }

/**
 * Get Amplify configuration for client-side usage
 * Safe to use in components that need config access
 */
export const getAmplifyConfig = () => amplifyConfig

/**
 * Environment-specific configuration helpers
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  const customEnv = process.env.APP_ENV || env // Allow custom environment names
  
  return {
    environment: customEnv,
    isDevelopment: env === 'development',
    isStaging: customEnv === 'staging',
    isProduction: env === 'production',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    region: amplifyConfig.data.aws_region || process.env.AWS_REGION || 'us-west-2',
  }
}

/**
 * Multi-tenant context for Amplify operations
 * Extracts tenant information from Auth0 JWT claims
 */
export interface TenantContext {
  organizationId: string
  organizationName: string
  tenantSchema: string
  permissions: string[]
  roles: string[]
}

/**
 * Extract tenant context from Auth0 JWT claims
 * Used in API routes and server components for multi-tenant operations
 */
export const getTenantContext = (request?: NextRequest): TenantContext | null => {
  try {
    // In API routes, extract from request headers or JWT
    if (request) {
      const authHeader = request.headers.get('authorization')
      if (!authHeader) return null
      
      // Extract JWT claims (this would be integrated with your Auth0 middleware)
      // For now, return a placeholder structure
      return {
        organizationId: 'org_placeholder',
        organizationName: 'Default Organization',
        tenantSchema: 'tenant_default',
        permissions: [],
        roles: [],
      }
    }
    
    // In server components, extract from cookies or session
    // This would integrate with your Auth0 session handling
    return null
  } catch (error) {
    console.error('Error extracting tenant context:', error)
    return null
  }
}

/**
 * Wrapper for Amplify operations with tenant context
 * Ensures all operations are scoped to the correct tenant
 * TODO: Uncomment when @aws-amplify/adapter-nextjs is installed
 */
// export const runWithTenantContext = async <T>(
//   operation: (context: { 
//     amplify: any // ReturnType<typeof getAmplifyDataClient>
//     tenant: TenantContext 
//   }) => Promise<T>,
//   request?: NextRequest
// ): Promise<T> => {
//   const tenantContext = getTenantContext(request)
//   
//   if (!tenantContext) {
//     throw new Error('No tenant context available')
//   }
//   
//   return runWithAmplifyServerContext({
//     nextServerContext: { request },
//     operation: async (contextSpec: any) => {
//       const amplifyClient = getAmplifyDataClient()
//       
//       return operation({
//         amplify: amplifyClient,
//         tenant: tenantContext,
//       })
//     },
//   })
// }

/**
 * Environment variable validation
 * Ensures required environment variables are set for the current environment
 */
export const validateEnvironmentConfig = () => {
  const env = getEnvironmentConfig()
  const requiredVars: Record<string, string[]> = {
    development: [
      'AUTH0_SECRET',
      'AUTH0_BASE_URL',
      'AUTH0_ISSUER_BASE_URL',
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET',
    ],
    staging: [
      'AUTH0_SECRET',
      'AUTH0_BASE_URL',
      'AUTH0_ISSUER_BASE_URL',
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET',
      'AUTH_DB_URL',
      'S3_BUCKET_NAME',
      'REDIS_PROVIDER',
    ],
    production: [
      'AUTH0_SECRET',
      'AUTH0_BASE_URL',
      'AUTH0_ISSUER_BASE_URL',
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET',
      'AUTH_DB_URL',
      'S3_BUCKET_NAME',
      'REDIS_PROVIDER',
      'SENTRY_DSN',
    ],
  }
  
  const missing = requiredVars[env.environment]?.filter(
    (varName) => !process.env[varName]
  ) || []
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for ${env.environment}: ${missing.join(', ')}`
    )
  }
  
  return true
}

/**
 * Logging utility with environment-aware configuration
 */
export const createLogger = (context: string) => {
  const env = getEnvironmentConfig()
  const logLevel = process.env.LOG_LEVEL || (env.isProduction ? 'warn' : 'info')
  
  const shouldLog = (level: string) => {
    const levels = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }
  
  return {
    debug: (message: string, data?: any) => {
      if (shouldLog('debug')) {
        console.debug(`[${context}] ${message}`, data)
      }
    },
    info: (message: string, data?: any) => {
      if (shouldLog('info')) {
        console.info(`[${context}] ${message}`, data)
      }
    },
    warn: (message: string, data?: any) => {
      if (shouldLog('warn')) {
        console.warn(`[${context}] ${message}`, data)
      }
    },
    error: (message: string, data?: any) => {
      if (shouldLog('error')) {
        console.error(`[${context}] ${message}`, data)
      }
    },
  }
}

/**
 * Performance monitoring utility
 */
export const createPerformanceMonitor = () => {
  const env = getEnvironmentConfig()
  
  return {
    time: <T>(label: string, operation: () => Promise<T>): Promise<T> => {
      if (!env.isProduction) {
        console.time(label)
      }
      
      return operation().finally(() => {
        if (!env.isProduction) {
          console.timeEnd(label)
        }
      })
    },
    
    measure: async <T>(
      label: string, 
      operation: () => Promise<T>
    ): Promise<{ result: T; duration: number }> => {
      const start = Date.now()
      const result = await operation()
      const duration = Date.now() - start
      
      if (duration > 1000 && env.isProduction) {
        console.warn(`Slow operation detected: ${label} took ${duration}ms`)
      }
      
      return { result, duration }
    },
  }
}

/**
 * Export all utilities for easy importing
 */
export {
  amplifyConfig,
}

export default {
  // runWithAmplifyServerContext, // TODO: Uncomment when packages are installed
  // getAmplifyDataClient, // TODO: Uncomment when packages are installed
  getAmplifyConfig,
  getEnvironmentConfig,
  getTenantContext,
  // runWithTenantContext, // TODO: Uncomment when packages are installed
  validateEnvironmentConfig,
  createLogger,
  createPerformanceMonitor,
} 