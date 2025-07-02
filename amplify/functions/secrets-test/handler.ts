/**
 * Amplify Function: Secrets Manager Integration Test
 * 
 * This function demonstrates secure access to AWS Secrets Manager
 * using our comprehensive secrets management implementation.
 * 
 * TASK 13.2: Link AWS Secrets Manager to Amplify Backend Using CDK ✅
 */

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { getSecret, getApplicationSecret, validateSecretConfiguration, getCacheStats, SECRET_ARNS } from '../../../lib/db/secrets-manager.js';

/**
 * Handler function that demonstrates secure secret access
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  try {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    const action = event.queryStringParameters?.action || 'status';

    switch (action) {
      case 'status':
        return handleSecretStatus();
      
      case 'jwt':
        return await handleJwtSecret();
      
      case 'cache':
        return handleCacheStats();
      
      case 'validate':
        return handleValidation();
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid action',
            availableActions: ['status', 'jwt', 'cache', 'validate']
          }),
        };
    }

  } catch (error) {
    console.error('Secrets test function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

/**
 * Get status of secret configuration
 */
function handleSecretStatus() {
  const secretStatus = {
    timestamp: new Date().toISOString(),
    configuration: {
      totalSecretsConfigured: Object.keys(SECRET_ARNS).length,
      availableSecrets: Object.keys(SECRET_ARNS),
      secretArns: Object.fromEntries(
        Object.entries(SECRET_ARNS).map(([key, arn]) => [
          key,
          arn ? 'configured' : 'missing'
        ])
      ),
    },
    environment: {
      region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION,
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      runtime: process.env.AWS_EXECUTION_ENV,
    },
    security: {
      serverSideOnly: typeof window === 'undefined',
      kmsKeyConfigured: !!(process.env.SECRETS_KMS_KEY_ARN || process.env.SECRETS_KMS_KEY_ID),
      cacheEnabled: true,
      cacheTtl: process.env.SECRETS_CACHE_TTL || '300',
    }
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'success',
      message: 'Secrets Manager integration status',
      data: secretStatus,
    }, null, 2),
  };
}

/**
 * Test JWT secret retrieval (safe demonstration)
 */
async function handleJwtSecret() {
  if (!SECRET_ARNS.JWT) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'JWT secret ARN not configured',
        secretsAvailable: Object.keys(SECRET_ARNS),
      }),
    };
  }

  try {
    // Get JWT secret (this would be used for actual JWT signing)
    const jwtSecretData = await getApplicationSecret(SECRET_ARNS.JWT);
    
    // Return metadata only (never expose actual secret value)
    const safeMetadata = {
      secretRetrieved: true,
      hasSecret: !!(jwtSecretData.secret),
      algorithm: jwtSecretData.algorithm || 'not-specified',
      secretLength: jwtSecretData.secret ? jwtSecretData.secret.length : 0,
      retrievedAt: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'success',
        message: 'JWT secret retrieved successfully (metadata only)',
        data: safeMetadata,
      }, null, 2),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to retrieve JWT secret',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

/**
 * Get cache statistics
 */
function handleCacheStats() {
  const cacheStats = getCacheStats();
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'success',
      message: 'Secrets cache statistics',
      data: {
        ...cacheStats,
        cacheEnabled: true,
        cacheTtl: process.env.SECRETS_CACHE_TTL || '300',
        timestamp: new Date().toISOString(),
      },
    }, null, 2),
  };
}

/**
 * Validate secret configuration
 */
function handleValidation() {
  try {
    validateSecretConfiguration();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'success',
        message: 'Secret configuration validation passed',
        data: {
          allSecretsConfigured: true,
          totalSecrets: Object.keys(SECRET_ARNS).length,
          configuredSecrets: Object.keys(SECRET_ARNS),
          timestamp: new Date().toISOString(),
        },
      }, null, 2),
    };

  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'error',
        message: 'Secret configuration validation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
    };
  }
} 