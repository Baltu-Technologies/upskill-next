/**
 * Environment-specific configuration for AWS Amplify Gen 2 Backend
 * 
 * This file contains environment-specific settings that optimize resources,
 * security, and costs across development, staging, and production environments.
 */

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  resourceConfig: {
    database: {
      instanceClass: string;
      allocatedStorage: number;
      multiAZ: boolean;
      backupRetentionPeriod: number;
      deletionProtection: boolean;
    };
    lambda: {
      timeout: number;
      memorySize: number;
      reservedConcurrency?: number;
      provisionedConcurrency?: number;
    };
    monitoring: {
      logRetentionDays: number;
      detailedMonitoring: boolean;
      xrayTracing: boolean;
    };
  };
  securityConfig: {
    corsOrigins: string[];
    sessionTimeout: number;
    requireMFA: boolean;
    rateLimitEnabled: boolean;
    wafEnabled: boolean;
  };
  performanceConfig: {
    autoScaling: {
      minCapacity: number;
      maxCapacity: number;
      targetCPUUtilization: number;
    };
    caching: {
      cloudFrontEnabled: boolean;
      defaultTTL: number;
      redisNodeType: string;
    };
  };
  featureFlags: {
    advancedAnalytics: boolean;
    enterpriseSSO: boolean;
    customBranding: boolean;
  };
  estimatedMonthlyCost: {
    min: number;
    max: number;
  };
}

/**
 * Development Environment Configuration
 * Optimized for: Cost efficiency, rapid development, minimal resources
 */
const developmentConfig: EnvironmentConfig = {
  environment: 'development',
  resourceConfig: {
    database: {
      instanceClass: 'db.t3.micro',
      allocatedStorage: 20,
      multiAZ: false,
      backupRetentionPeriod: 1,
      deletionProtection: false,
    },
    lambda: {
      timeout: 30,
      memorySize: 512,
      // No reserved concurrency for development
    },
    monitoring: {
      logRetentionDays: 7,
      detailedMonitoring: false,
      xrayTracing: false,
    },
  },
  securityConfig: {
    corsOrigins: ['http://localhost:3000', 'https://dev.d123456.amplifyapp.com'],
    sessionTimeout: 86400, // 24 hours
    requireMFA: false,
    rateLimitEnabled: false,
    wafEnabled: false,
  },
  performanceConfig: {
    autoScaling: {
      minCapacity: 1,
      maxCapacity: 3,
      targetCPUUtilization: 70,
    },
    caching: {
      cloudFrontEnabled: false,
      defaultTTL: 300,
      redisNodeType: 'cache.t3.micro',
    },
  },
  featureFlags: {
    advancedAnalytics: false,
    enterpriseSSO: false,
    customBranding: true,
  },
  estimatedMonthlyCost: {
    min: 50,
    max: 100,
  },
};

/**
 * Staging Environment Configuration
 * Optimized for: Testing production workloads, integration testing
 */
const stagingConfig: EnvironmentConfig = {
  environment: 'staging',
  resourceConfig: {
    database: {
      instanceClass: 'db.t3.small',
      allocatedStorage: 50,
      multiAZ: false,
      backupRetentionPeriod: 3,
      deletionProtection: false,
    },
    lambda: {
      timeout: 60,
      memorySize: 1024,
      reservedConcurrency: 10,
    },
    monitoring: {
      logRetentionDays: 30,
      detailedMonitoring: true,
      xrayTracing: true,
    },
  },
  securityConfig: {
    corsOrigins: ['https://staging.d123456.amplifyapp.com'],
    sessionTimeout: 43200, // 12 hours
    requireMFA: false,
    rateLimitEnabled: true,
    wafEnabled: true,
  },
  performanceConfig: {
    autoScaling: {
      minCapacity: 2,
      maxCapacity: 10,
      targetCPUUtilization: 60,
    },
    caching: {
      cloudFrontEnabled: true,
      defaultTTL: 3600,
      redisNodeType: 'cache.t3.small',
    },
  },
  featureFlags: {
    advancedAnalytics: true,
    enterpriseSSO: true,
    customBranding: true,
  },
  estimatedMonthlyCost: {
    min: 200,
    max: 400,
  },
};

/**
 * Production Environment Configuration
 * Optimized for: High availability, performance, security, compliance
 */
const productionConfig: EnvironmentConfig = {
  environment: 'production',
  resourceConfig: {
    database: {
      instanceClass: 'db.r5.large',
      allocatedStorage: 100,
      multiAZ: true,
      backupRetentionPeriod: 30,
      deletionProtection: true,
    },
    lambda: {
      timeout: 300,
      memorySize: 2048,
      reservedConcurrency: 50,
      provisionedConcurrency: 10,
    },
    monitoring: {
      logRetentionDays: 365,
      detailedMonitoring: true,
      xrayTracing: true,
    },
  },
  securityConfig: {
    corsOrigins: ['https://employer.upskill.com'],
    sessionTimeout: 28800, // 8 hours
    requireMFA: true,
    rateLimitEnabled: true,
    wafEnabled: true,
  },
  performanceConfig: {
    autoScaling: {
      minCapacity: 3,
      maxCapacity: 50,
      targetCPUUtilization: 50,
    },
    caching: {
      cloudFrontEnabled: true,
      defaultTTL: 3600,
      redisNodeType: 'cache.r5.large',
    },
  },
  featureFlags: {
    advancedAnalytics: true,
    enterpriseSSO: true,
    customBranding: true,
  },
  estimatedMonthlyCost: {
    min: 800,
    max: 1500,
  },
};

/**
 * Environment configuration map
 */
const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
};

/**
 * Get environment-specific configuration
 * @param environment - Target environment
 * @returns Environment configuration
 */
export function getEnvironmentSpecificConfig(environment?: Environment): EnvironmentConfig {
  // Determine current environment
  const currentEnvironment = environment || 
    (process.env.APP_ENV as Environment) || 
    (process.env.NODE_ENV as Environment) || 
    'development';
  
  const config = environmentConfigs[currentEnvironment];
  
  if (!config) {
    throw new Error(`Unknown environment: ${currentEnvironment}`);
  }
  
  return config;
}

/**
 * Validate environment configuration
 * @param environment - Environment to validate
 * @returns Validation results
 */
export function validateEnvironmentConfiguration(environment: Environment): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const config = getEnvironmentSpecificConfig(environment);
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Production environment validation
  if (environment === 'production') {
    if (!config.resourceConfig.database.multiAZ) {
      errors.push('Production environment must have Multi-AZ database deployment');
    }
    
    if (!config.resourceConfig.database.deletionProtection) {
      errors.push('Production environment must have deletion protection enabled');
    }
    
    if (!config.securityConfig.wafEnabled) {
      errors.push('Production environment must have WAF enabled');
    }
    
    if (config.resourceConfig.database.backupRetentionPeriod < 7) {
      errors.push('Production environment must have backup retention ≥ 7 days');
    }
    
    if (config.performanceConfig.autoScaling.minCapacity < 2) {
      warnings.push('Production environment should have minimum 2 instances for high availability');
    }
    
    if (!config.securityConfig.requireMFA) {
      warnings.push('Production environment should require MFA for enhanced security');
    }
  }
  
  // General validation
  if (config.resourceConfig.lambda.timeout > 900) {
    errors.push('Lambda timeout cannot exceed 15 minutes (900 seconds)');
  }
  
  if (config.resourceConfig.lambda.memorySize > 10240) {
    errors.push('Lambda memory cannot exceed 10,240 MB');
  }
  
  if (config.performanceConfig.autoScaling.minCapacity > config.performanceConfig.autoScaling.maxCapacity) {
    errors.push('Auto scaling minimum capacity cannot exceed maximum capacity');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get Auth0 domain for environment
 * @param environment - Target environment
 * @returns Auth0 domain
 */
export function getAuth0Domain(environment: Environment): string {
  const domains = {
    development: 'dev-qexcpj7a1xh3q5pe.us.auth0.com',
    staging: 'upskill-employer-staging.us.auth0.com',
    production: 'upskill-employer-production.us.auth0.com',
  };
  
  return domains[environment];
}

/**
 * Get environment-specific database parameter group settings
 * @param environment - Target environment
 * @returns Database parameter group settings
 */
export function getDatabaseParameterGroup(environment: Environment): Record<string, string> {
  const configs = {
    development: {
      max_connections: '200',
      work_mem: '4MB',
      effective_cache_size: '1GB',
    },
    staging: {
      max_connections: '300',
      work_mem: '6MB',
      effective_cache_size: '2GB',
    },
    production: {
      max_connections: '500',
      work_mem: '8MB',
      effective_cache_size: '4GB',
    },
  };
  
  return configs[environment];
}

/**
 * Get environment-specific RDS Proxy settings
 * @param environment - Target environment
 * @returns RDS Proxy configuration
 */
export function getRDSProxyConfig(environment: Environment): {
  maxConnectionsPercent: number;
  idleClientTimeout: number;
} {
  const configs = {
    development: {
      maxConnectionsPercent: 50,
      idleClientTimeout: 1800,
    },
    staging: {
      maxConnectionsPercent: 75,
      idleClientTimeout: 1800,
    },
    production: {
      maxConnectionsPercent: 100,
      idleClientTimeout: 3600,
    },
  };
  
  return configs[environment];
}

/**
 * Helper function to get current environment
 * @returns Current environment
 */
export function getCurrentEnvironment(): Environment {
  const environment = process.env.APP_ENV || process.env.NODE_ENV || 'development';
  
  if (!['development', 'staging', 'production'].includes(environment)) {
    console.warn(`Unknown environment '${environment}', defaulting to 'development'`);
    return 'development';
  }
  
  return environment as Environment;
}

/**
 * Helper function to check if current environment is production
 * @returns True if current environment is production
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === 'production';
}

/**
 * Helper function to check if current environment is development
 * @returns True if current environment is development
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === 'development';
}

/**
 * Helper function to check if current environment is staging
 * @returns True if current environment is staging
 */
export function isStaging(): boolean {
  return getCurrentEnvironment() === 'staging';
}

export default getEnvironmentSpecificConfig; 