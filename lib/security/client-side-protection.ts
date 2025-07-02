/**
 * Client-Side Protection and Runtime-Only Secret Injection
 * 
 * This module implements comprehensive security controls to ensure:
 * 1. Secrets are never exposed to client-side code
 * 2. Runtime-only secret injection in backend code
 * 3. Build-time validation to prevent accidental exposure
 * 4. Development-time warnings and error handling
 * 
 * TASK 13.3: Ensure Runtime-Only Secret Injection and Prevent Client-Side Exposure ✅
 */

// ========================================
// Runtime Environment Detection
// ========================================

/**
 * Detect if code is running in client-side environment
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Detect if code is running in server-side environment
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined';
}

/**
 * Detect if code is running in Node.js environment
 */
export function isNodeEnvironment(): boolean {
  return typeof process !== 'undefined' && process.versions && !!process.versions.node;
}

/**
 * Detect if code is running in browser environment
 */
export function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// ========================================
// Client-Side Protection Guards
// ========================================

/**
 * Throw error if called from client-side code
 * Use this in any function that should never be called from client-side
 */
export function requireServerSide(functionName: string): void {
  if (isClientSide()) {
    throw new Error(
      `SECURITY VIOLATION: ${functionName} cannot be called from client-side code. ` +
      'This function contains sensitive operations that must only run on the server. ' +
      'Move this call to a server-side API route, server component, or middleware.'
    );
  }
}

/**
 * Warn if potentially dangerous operation is attempted on client-side
 */
export function warnClientSideOperation(operation: string): void {
  if (isClientSide()) {
    console.warn(
      `⚠️ WARNING: ${operation} attempted on client-side. ` +
      'This may indicate a security issue if sensitive data is involved. ' +
      'Ensure this operation is safe for client-side execution.'
    );
  }
}

/**
 * Assert that current execution context is server-side
 */
export function assertServerSideExecution(): void {
  if (!isServerSide()) {
    throw new Error(
      'SECURITY ASSERTION FAILED: This code must only execute on the server. ' +
      'Client-side execution detected. This is a potential security vulnerability.'
    );
  }
}

// ========================================
// Environment Variable Security Validation
// ========================================

/**
 * Validate that public environment variables don't contain sensitive data
 */
export function validatePublicEnvironmentVariables(): {
  isSecure: boolean;
  violations: string[];
  warnings: string[];
} {
  const violations: string[] = [];
  const warnings: string[] = [];
  
  // Check for dangerous patterns in NEXT_PUBLIC_ variables
  const publicEnvPattern = /^NEXT_PUBLIC_/;
  const dangerousPatterns = [
    /secret/i,
    /password/i,
    /key/i,
    /token/i,
    /credential/i,
    /private/i,
    /_arn$/i, // ARNs might be sensitive in some contexts
  ];
  
  // Get all environment variables (client-side safe check)
  const envVars: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {};
  
  Object.keys(envVars).forEach(key => {
    if (publicEnvPattern.test(key)) {
      // Check for dangerous patterns in public variable names
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(key)) {
          if (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('PRIVATE')) {
            violations.push(`Public variable ${key} contains sensitive keyword`);
          } else {
            warnings.push(`Public variable ${key} may contain sensitive data`);
          }
        }
      });
      
      // Check for dangerous patterns in public variable values
      const value = envVars[key];
      if (value) {
        // Check for ARN patterns (which might be sensitive)
        if (value.startsWith('arn:aws:secretsmanager:')) {
          violations.push(`Public variable ${key} contains Secrets Manager ARN`);
        }
        
        // Check for what looks like secret values
        if (/^[A-Za-z0-9+/]{32,}={0,2}$/.test(value)) {
          warnings.push(`Public variable ${key} value looks like an encoded secret`);
        }
      }
    }
  });
  
  return {
    isSecure: violations.length === 0,
    violations,
    warnings,
  };
}

/**
 * Validate that server-side environment variables are properly protected
 */
export function validateServerEnvironmentSecurity(): {
  hasSecrets: boolean;
  secretCount: number;
  unprotectedSecrets: string[];
  recommendations: string[];
} {
  assertServerSideExecution();
  
  const unprotectedSecrets: string[] = [];
  const recommendations: string[] = [];
  let secretCount = 0;
  
  const envVars = process.env;
  const secretPatterns = [
    /secret/i,
    /password/i,
    /key/i,
    /token/i,
    /credential/i,
  ];
  
  Object.keys(envVars).forEach(key => {
    secretPatterns.forEach(pattern => {
      if (pattern.test(key)) {
        secretCount++;
        
        // Check if secret starts with NEXT_PUBLIC_ (dangerous)
        if (key.startsWith('NEXT_PUBLIC_')) {
          unprotectedSecrets.push(key);
        }
        
        // Check if secret value looks like it should be in Secrets Manager
        const value = envVars[key];
        if (value && !value.startsWith('arn:aws:secretsmanager:')) {
          recommendations.push(`${key} should be stored in AWS Secrets Manager`);
        }
      }
    });
  });
  
  return {
    hasSecrets: secretCount > 0,
    secretCount,
    unprotectedSecrets,
    recommendations,
  };
}

// ========================================
// Runtime Secret Access Controls
// ========================================

/**
 * Secure wrapper for environment variable access with runtime validation
 */
export function getSecureEnvironmentVariable(
  key: string,
  options: {
    required?: boolean;
    allowClientSide?: boolean;
    validatePattern?: RegExp;
    description?: string;
  } = {}
): string | undefined {
  const { required = false, allowClientSide = false, validatePattern, description } = options;
  
  // Check if we're on client-side and it's not allowed
  if (isClientSide() && !allowClientSide) {
    if (required) {
      throw new Error(
        `SECURITY ERROR: Environment variable ${key} cannot be accessed from client-side code. ` +
        `${description || 'This variable contains sensitive data that must only be accessed server-side.'}`
      );
    }
    return undefined;
  }
  
  // Get the environment variable
  const value = typeof process !== 'undefined' ? process.env[key] : undefined;
  
  // Check if required but missing
  if (required && !value) {
    throw new Error(
      `CONFIGURATION ERROR: Required environment variable ${key} is not set. ` +
      `${description || 'This variable is required for proper application functionality.'}`
    );
  }
  
  // Validate pattern if provided
  if (value && validatePattern && !validatePattern.test(value)) {
    throw new Error(
      `VALIDATION ERROR: Environment variable ${key} does not match required pattern. ` +
      `${description || 'Please check the variable format.'}`
    );
  }
  
  return value;
}

/**
 * Get secret ARN with validation
 */
export function getSecretArn(secretName: string, required: boolean = true): string {
  return getSecureEnvironmentVariable(`${secretName}_SECRET_ARN`, {
    required,
    allowClientSide: false,
    validatePattern: /^arn:aws:secretsmanager:/,
    description: `${secretName} secret ARN for AWS Secrets Manager`,
  }) || '';
}

// ========================================
// Build-Time Security Validation
// ========================================

/**
 * Validate that the build process doesn't expose secrets
 * This should be called during the build process
 */
export function validateBuildTimeSecurity(): {
  isSecure: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  try {
    // Validate public environment variables
    const publicValidation = validatePublicEnvironmentVariables();
    issues.push(...publicValidation.violations);
    
    // Add suggestions based on findings
    if (publicValidation.violations.length > 0) {
      suggestions.push('Remove sensitive data from NEXT_PUBLIC_ environment variables');
      suggestions.push('Use AWS Secrets Manager for sensitive configuration');
      suggestions.push('Move secret access to server-side API routes');
    }
    
    if (publicValidation.warnings.length > 0) {
      suggestions.push('Review environment variables flagged with warnings');
      suggestions.push('Consider using more descriptive variable names that clearly indicate non-sensitive data');
    }
    
    // Check for server-side environment security (if available)
    if (isServerSide()) {
      const serverValidation = validateServerEnvironmentSecurity();
      
      if (serverValidation.unprotectedSecrets.length > 0) {
        issues.push(`Unprotected secrets found: ${serverValidation.unprotectedSecrets.join(', ')}`);
        suggestions.push('Move exposed secrets to AWS Secrets Manager');
      }
      
      suggestions.push(...serverValidation.recommendations);
    }
    
  } catch (error) {
    issues.push(`Build-time validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    isSecure: issues.length === 0,
    issues,
    suggestions,
  };
}

// ========================================
// Development-Time Helpers
// ========================================

/**
 * Debug helper to check environment security in development
 */
export function debugEnvironmentSecurity(): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  console.log('🔍 Environment Security Debug Report');
  console.log('=====================================');
  
  // Runtime environment check
  console.log('Runtime Environment:');
  console.log(`  Client-side: ${isClientSide()}`);
  console.log(`  Server-side: ${isServerSide()}`);
  console.log(`  Node.js: ${isNodeEnvironment()}`);
  console.log(`  Browser: ${isBrowserEnvironment()}`);
  
  // Public environment variables validation
  const publicValidation = validatePublicEnvironmentVariables();
  console.log('\nPublic Environment Variables:');
  console.log(`  Secure: ${publicValidation.isSecure}`);
  console.log(`  Violations: ${publicValidation.violations.length}`);
  console.log(`  Warnings: ${publicValidation.warnings.length}`);
  
  if (publicValidation.violations.length > 0) {
    console.log('  🚨 Violations:', publicValidation.violations);
  }
  
  if (publicValidation.warnings.length > 0) {
    console.log('  ⚠️  Warnings:', publicValidation.warnings);
  }
  
  // Server-side validation (if available)
  if (isServerSide()) {
    const serverValidation = validateServerEnvironmentSecurity();
    console.log('\nServer Environment Variables:');
    console.log(`  Has secrets: ${serverValidation.hasSecrets}`);
    console.log(`  Secret count: ${serverValidation.secretCount}`);
    console.log(`  Unprotected: ${serverValidation.unprotectedSecrets.length}`);
    
    if (serverValidation.unprotectedSecrets.length > 0) {
      console.log('  🚨 Unprotected secrets:', serverValidation.unprotectedSecrets);
    }
    
    if (serverValidation.recommendations.length > 0) {
      console.log('  💡 Recommendations:', serverValidation.recommendations);
    }
  }
  
  console.log('=====================================');
}

/**
 * Assert that a function is being called in the correct environment
 */
export function assertEnvironment(
  expectedEnvironment: 'client' | 'server' | 'node' | 'browser',
  functionName: string
): void {
  const checks = {
    client: isClientSide,
    server: isServerSide,
    node: isNodeEnvironment,
    browser: isBrowserEnvironment,
  };
  
  const checkFunction = checks[expectedEnvironment];
  if (!checkFunction()) {
    throw new Error(
      `ENVIRONMENT ERROR: ${functionName} must be called in ${expectedEnvironment} environment. ` +
      `Current environment: ${Object.entries(checks).filter(([_, check]) => check()).map(([env]) => env).join(', ')}`
    );
  }
}

/**
 * SECURITY SUMMARY:
 * 
 * ✅ Runtime Environment Detection: Comprehensive environment detection utilities
 * ✅ Client-Side Protection: Guards and assertions to prevent client-side secret access
 * ✅ Environment Variable Validation: Automated checks for secure configuration
 * ✅ Build-Time Security: Validation that runs during build process
 * ✅ Development Helpers: Debug utilities for development-time security checks
 * ✅ Runtime Controls: Secure wrappers for environment variable access
 * ✅ Error Handling: Clear security error messages and guidance
 */ 