/**
 * Next.js API Route: Secrets Manager Integration Test
 * 
 * This demonstrates how to use our AWS Secrets Manager integration
 * in a standard Next.js API route (server-side only).
 * 
 * TASK 13.2: Link AWS Secrets Manager to Amplify Backend Using CDK ✅
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { SECRET_ARNS, validateSecretConfiguration, getCacheStats } from '../../lib/db/secrets-manager';

interface SecretTestResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SecretTestResponse>
) {
  const timestamp = new Date().toISOString();

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed',
        error: 'Only GET requests are supported',
        timestamp,
      });
    }

    const action = req.query.action as string || 'status';

    switch (action) {
      case 'status':
        return handleSecretStatus(res, timestamp);
      
      case 'cache':
        return handleCacheStats(res, timestamp);
      
      case 'validate':
        return handleValidation(res, timestamp);
      
      case 'arns':
        return handleSecretArns(res, timestamp);
      
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid action parameter',
          error: `Unknown action: ${action}. Available: status, cache, validate, arns`,
          timestamp,
        });
    }

  } catch (error) {
    console.error('Secrets test API error:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
    });
  }
}

/**
 * Get status of secret configuration
 */
function handleSecretStatus(res: NextApiResponse<SecretTestResponse>, timestamp: string) {
  const secretStatus = {
    serverSideExecution: typeof window === 'undefined',
    secretsManagerClientAvailable: true,
    totalSecretsConfigured: Object.keys(SECRET_ARNS).length,
    availableSecrets: Object.keys(SECRET_ARNS),
    secretConfiguration: Object.fromEntries(
      Object.entries(SECRET_ARNS).map(([key, arn]) => [
        key,
        arn ? 'configured' : 'missing'
      ])
    ),
    environment: {
      region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION,
      nodeEnv: process.env.NODE_ENV,
      platformEnv: process.env.PLATFORM_ENVIRONMENT,
    },
    security: {
      kmsKeyConfigured: !!(process.env.SECRETS_KMS_KEY_ARN || process.env.SECRETS_KMS_KEY_ID),
      cacheEnabled: true,
      cacheTtl: process.env.SECRETS_CACHE_TTL || '300',
      iamRoleConfigured: !!(process.env.SECRETS_ACCESS_ROLE_ARN),
    }
  };

  return res.status(200).json({
    status: 'success',
    message: 'Secrets Manager integration status retrieved',
    data: secretStatus,
    timestamp,
  });
}

/**
 * Get cache statistics
 */
function handleCacheStats(res: NextApiResponse<SecretTestResponse>, timestamp: string) {
  const cacheStats = getCacheStats();
  
  return res.status(200).json({
    status: 'success',
    message: 'Secrets cache statistics retrieved',
    data: {
      ...cacheStats,
      cacheEnabled: true,
      cacheTtl: process.env.SECRETS_CACHE_TTL || '300',
      cacheType: 'in-memory',
      automaticCleanup: 'enabled',
    },
    timestamp,
  });
}

/**
 * Validate secret configuration
 */
function handleValidation(res: NextApiResponse<SecretTestResponse>, timestamp: string) {
  try {
    validateSecretConfiguration();
    
    return res.status(200).json({
      status: 'success',
      message: 'Secret configuration validation passed',
      data: {
        allSecretsConfigured: true,
        totalSecrets: Object.keys(SECRET_ARNS).length,
        configuredSecrets: Object.keys(SECRET_ARNS),
        validationPassed: true,
      },
      timestamp,
    });

  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Secret configuration validation failed',
      error: error instanceof Error ? error.message : 'Unknown validation error',
      timestamp,
    });
  }
}

/**
 * Get configured secret ARNs (safe to expose ARNs, not values)
 */
function handleSecretArns(res: NextApiResponse<SecretTestResponse>, timestamp: string) {
  const secretArns = {
    configuredArns: Object.fromEntries(
      Object.entries(SECRET_ARNS).filter(([_, arn]) => arn !== '')
    ),
    missingArns: Object.keys(SECRET_ARNS).filter(key => SECRET_ARNS[key as keyof typeof SECRET_ARNS] === ''),
    arnPattern: 'arn:aws:secretsmanager:region:account:secret:name-suffix',
    security: 'ARNs are safe to expose, secret values are never returned',
  };

  return res.status(200).json({
    status: 'success',
    message: 'Secret ARNs configuration retrieved',
    data: secretArns,
    timestamp,
  });
} 