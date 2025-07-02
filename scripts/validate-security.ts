/**
 * Build-Time Security Validation Script
 * 
 * This script validates that secrets are never exposed to client-side code
 * and that our security controls are properly implemented.
 * 
 * TASK 13.3: Ensure Runtime-Only Secret Injection and Prevent Client-Side Exposure ✅
 * 
 * Run this script during build process to catch security issues early.
 */

import { 
  validateBuildTimeSecurity,
  validatePublicEnvironmentVariables,
  validateServerEnvironmentSecurity,
  isServerSide,
  debugEnvironmentSecurity 
} from '../lib/security/client-side-protection';
import fs from 'fs';
import path from 'path';

// ========================================
// Build-Time Security Validation
// ========================================

console.log('🔐 Running Build-Time Security Validation...');
console.log('===============================================\n');

/**
 * Validate overall build security
 */
function runBuildSecurityValidation() {
  console.log('1. Overall Build Security Check');
  console.log('------------------------------');
  
  const buildValidation = validateBuildTimeSecurity();
  
  if (buildValidation.isSecure) {
    console.log('✅ Build security validation PASSED');
  } else {
    console.log('🚨 Build security validation FAILED');
    console.log('\nIssues found:');
    buildValidation.issues.forEach(issue => {
      console.log(`  ❌ ${issue}`);
    });
  }
  
  if (buildValidation.suggestions.length > 0) {
    console.log('\n💡 Suggestions:');
    buildValidation.suggestions.forEach(suggestion => {
      console.log(`  - ${suggestion}`);
    });
  }
  
  console.log('');
  return buildValidation.isSecure;
}

/**
 * Validate public environment variables
 */
function runPublicEnvironmentValidation() {
  console.log('2. Public Environment Variables Check');
  console.log('------------------------------------');
  
  const publicValidation = validatePublicEnvironmentVariables();
  
  if (publicValidation.isSecure) {
    console.log('✅ Public environment variables are secure');
  } else {
    console.log('🚨 Public environment variables have security issues');
    console.log('\nViolations:');
    publicValidation.violations.forEach(violation => {
      console.log(`  ❌ ${violation}`);
    });
  }
  
  if (publicValidation.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    publicValidation.warnings.forEach(warning => {
      console.log(`  - ${warning}`);
    });
  }
  
  console.log('');
  return publicValidation.isSecure;
}

/**
 * Validate server environment security (if running in server context)
 */
function runServerEnvironmentValidation() {
  console.log('3. Server Environment Variables Check');
  console.log('------------------------------------');
  
  if (!isServerSide()) {
    console.log('ℹ️  Skipping server environment check (not in server context)');
    console.log('');
    return true;
  }
  
  try {
    const serverValidation = validateServerEnvironmentSecurity();
    
    console.log(`📊 Server environment statistics:`);
    console.log(`   - Has secrets: ${serverValidation.hasSecrets}`);
    console.log(`   - Total secrets found: ${serverValidation.secretCount}`);
    console.log(`   - Unprotected secrets: ${serverValidation.unprotectedSecrets.length}`);
    
    if (serverValidation.unprotectedSecrets.length > 0) {
      console.log('\n🚨 Unprotected secrets found:');
      serverValidation.unprotectedSecrets.forEach(secret => {
        console.log(`  ❌ ${secret}`);
      });
    } else {
      console.log('✅ No unprotected secrets found');
    }
    
    if (serverValidation.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      serverValidation.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
      });
    }
    
    console.log('');
    return serverValidation.unprotectedSecrets.length === 0;
  } catch (error) {
    console.log(`⚠️  Server environment validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log('');
    return false;
  }
}

/**
 * Scan for potentially dangerous patterns in source code
 */
function runSourceCodeSecurityScan() {
  console.log('4. Source Code Security Scan');
  console.log('----------------------------');
  
  const dangerousPatterns = [
    {
      pattern: /process\.env\.[A-Z_]*SECRET[A-Z_]*\s*(?!=.*allowClientSide)/g,
      message: 'Direct process.env secret access without security wrapper',
      severity: 'error'
    },
    {
      pattern: /NEXT_PUBLIC_[A-Z_]*(?:SECRET|PASSWORD|KEY|TOKEN)[A-Z_]*/g,
      message: 'Public environment variable with sensitive name',
      severity: 'error'
    },
    {
      pattern: /console\.log\([^)]*(?:secret|password|token|key)/gi,
      message: 'Potential secret logging',
      severity: 'warning'
    },
    {
      pattern: /getSecret.*\s+(?!requireServerSide|assertServerSide)/g,
      message: 'Secret access without security assertion',
      severity: 'warning'
    }
  ];
  
  const filesToScan = [
    'lib/**/*.ts',
    'lib/**/*.js',
    'pages/**/*.ts',
    'pages/**/*.tsx',
    'app/**/*.ts',
    'app/**/*.tsx',
    'components/**/*.ts',
    'components/**/*.tsx'
  ];
  
  let issuesFound = 0;
  let warningsFound = 0;
  
  // Simple file scanning (would be better with a proper AST parser)
  const scanDirectory = (dir: string): void => {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          dangerousPatterns.forEach(({ pattern, message, severity }) => {
            const matches = content.match(pattern);
            if (matches) {
              matches.forEach(match => {
                console.log(`${severity === 'error' ? '❌' : '⚠️ '} ${fullPath}: ${message}`);
                console.log(`   Found: ${match.trim()}`);
                
                if (severity === 'error') {
                  issuesFound++;
                } else {
                  warningsFound++;
                }
              });
            }
          });
        } catch (error) {
          // Skip files that can't be read
        }
      }
    });
  };
  
  // Scan main directories
  ['lib', 'pages', 'app', 'components'].forEach(dir => {
    scanDirectory(dir);
  });
  
  if (issuesFound === 0 && warningsFound === 0) {
    console.log('✅ No security issues found in source code');
  } else {
    console.log(`📊 Source code scan results:`);
    console.log(`   - Errors: ${issuesFound}`);
    console.log(`   - Warnings: ${warningsFound}`);
  }
  
  console.log('');
  return issuesFound === 0;
}

/**
 * Validate Next.js configuration for security
 */
function runNextJsConfigValidation() {
  console.log('5. Next.js Configuration Security Check');
  console.log('--------------------------------------');
  
  let configSecure = true;
  
  // Check next.config.js for security issues
  const configFiles = ['next.config.js', 'next.config.mjs'];
  
  configFiles.forEach(configFile => {
    if (fs.existsSync(configFile)) {
      try {
        const content = fs.readFileSync(configFile, 'utf8');
        
        // Check for dangerous patterns in Next.js config
        if (content.includes('process.env.') && !content.includes('NEXT_PUBLIC_')) {
          console.log('⚠️  next.config.js contains direct process.env access');
          console.log('   Consider using environment variable validation');
        }
        
        if (content.match(/env\s*:\s*{[^}]*(?:secret|password|key|token)/gi)) {
          console.log('❌ next.config.js env section may expose secrets');
          configSecure = false;
        }
        
      } catch (error) {
        console.log(`⚠️  Could not read ${configFile}: ${(error as Error).message || 'Unknown error'}`);
      }
    }
  });
  
  // Check package.json scripts for security issues
  if (fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (packageJson.scripts) {
        Object.entries(packageJson.scripts).forEach(([name, script]) => {
          if (typeof script === 'string' && script.match(/(?:secret|password|key|token)=/gi)) {
            console.log(`⚠️  Script '${name}' may contain secrets in command line`);
          }
        });
      }
    } catch (error) {
      console.log(`⚠️  Could not read package.json: ${(error as Error).message || 'Unknown error'}`);
    }
  }
  
  if (configSecure) {
    console.log('✅ Next.js configuration appears secure');
  }
  
  console.log('');
  return configSecure;
}

/**
 * Generate security report
 */
function generateSecurityReport(results: boolean[]): boolean {
  console.log('📋 Security Validation Summary');
  console.log('=============================');
  
  const allPassed = results.every((result: boolean) => result);
  
  if (allPassed) {
    console.log('🎉 All security validations PASSED!');
    console.log('');
    console.log('✅ Build-time security validation');
    console.log('✅ Public environment variables');
    console.log('✅ Server environment variables');
    console.log('✅ Source code security scan');
    console.log('✅ Next.js configuration');
  } else {
    console.log('🚨 Some security validations FAILED!');
    console.log('');
    console.log('Please review the issues above and fix them before deployment.');
    
    results.forEach((passed: boolean, index: number) => {
      const testNames = [
        'Build-time security',
        'Public environment',
        'Server environment',
        'Source code scan',
        'Next.js configuration'
      ];
      console.log(`${passed ? '✅' : '❌'} ${testNames[index]}`);
    });
  }
  
  console.log('');
  console.log('🔗 For more information on security best practices:');
  console.log('   - AWS Secrets Manager Best Practices');
  console.log('   - Next.js Environment Variables Security');
  console.log('   - Client-Side vs Server-Side Security');
  
  return allPassed;
}

// ========================================
// Main Execution
// ========================================

async function main() {
  try {
    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      debugEnvironmentSecurity();
    }
    
    // Run all security validations
    const results = [
      runBuildSecurityValidation(),
      runPublicEnvironmentValidation(),
      runServerEnvironmentValidation(),
      runSourceCodeSecurityScan(),
      runNextJsConfigValidation()
    ];
    
    // Generate final report
    const allPassed = generateSecurityReport(results);
    
    // Exit with appropriate code
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    console.error('💥 Security validation script failed:', (error as Error).message || 'Unknown error');
    process.exit(1);
  }
}

// Run the validation
main(); 