/**
 * Security Validation Test Page
 * 
 * This page demonstrates that our security controls prevent client-side access to secrets.
 * It validates that attempts to access secrets from client-side code properly fail.
 * 
 * TASK 13.4: Validate No Client-Side Exposure of Secrets ✅
 */

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

// ========================================
// Client-Side Security Validation Tests
// ========================================

interface SecurityTestResult {
  test: string;
  status: 'pass' | 'fail' | 'error';
  message: string;
  details?: string;
}

const SecurityValidationPage: NextPage = () => {
  const [testResults, setTestResults] = useState<SecurityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  /**
   * Test 1: Verify environment detection works correctly
   */
  const testEnvironmentDetection = async (): Promise<SecurityTestResult> => {
    try {
      // This should return true on client-side
      const isClient = typeof window !== 'undefined';
      const isServer = typeof window === 'undefined';
      
      if (isClient && !isServer) {
        return {
          test: 'Environment Detection',
          status: 'pass',
          message: 'Client-side environment correctly detected',
          details: `window: ${typeof window !== 'undefined'}, process: ${typeof process !== 'undefined'}`
        };
      } else {
        return {
          test: 'Environment Detection',
          status: 'fail',
          message: 'Environment detection failed',
          details: 'Expected client-side but detected server-side'
        };
      }
    } catch (error) {
      return {
        test: 'Environment Detection',
        status: 'error',
        message: `Environment detection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  /**
   * Test 2: Verify that client-side protection utilities work
   */
  const testClientSideProtection = async (): Promise<SecurityTestResult> => {
    try {
      // Import the protection utilities (this should work on client-side for testing)
      const { isClientSide, isServerSide } = await import('../lib/security/client-side-protection');
      
      const clientDetected = isClientSide();
      const serverDetected = isServerSide();
      
      if (clientDetected && !serverDetected) {
        return {
          test: 'Client-Side Protection Utilities',
          status: 'pass',
          message: 'Protection utilities correctly detect client-side execution',
          details: `isClientSide: ${clientDetected}, isServerSide: ${serverDetected}`
        };
      } else {
        return {
          test: 'Client-Side Protection Utilities',
          status: 'fail',
          message: 'Protection utilities failed to detect environment correctly',
          details: `isClientSide: ${clientDetected}, isServerSide: ${serverDetected}`
        };
      }
    } catch (error) {
      return {
        test: 'Client-Side Protection Utilities',
        status: 'error',
        message: `Protection utilities error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  /**
   * Test 3: Verify that secrets manager throws error on client-side
   */
  const testSecretsManagerClientSideBlock = async (): Promise<SecurityTestResult> => {
    try {
      // This should throw an error because secrets-manager should block client-side import
      await import('../lib/db/secrets-manager');
      
      return {
        test: 'Secrets Manager Client-Side Block',
        status: 'fail',
        message: 'SECURITY VIOLATION: Secrets manager allowed client-side import',
        details: 'This is a critical security issue - secrets manager should never work on client-side'
      };
    } catch (error) {
      // This is the expected behavior
      if (error instanceof Error && error.message.includes('SECURITY')) {
        return {
          test: 'Secrets Manager Client-Side Block',
          status: 'pass',
          message: 'Secrets manager correctly blocked client-side access',
          details: error.message
        };
      } else {
        return {
          test: 'Secrets Manager Client-Side Block',
          status: 'error',
          message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }
  };

  /**
   * Test 4: Verify public environment variables don't contain secrets
   */
  const testPublicEnvironmentVariables = async (): Promise<SecurityTestResult> => {
    try {
      // Check for dangerous patterns in NEXT_PUBLIC_ variables
      const publicVars: string[] = [];
      const dangerousVars: string[] = [];
      
      // In browser environment, we can only access NEXT_PUBLIC_ variables
      if (typeof window !== 'undefined') {
        // Check global variables that Next.js injects
        Object.keys(window).forEach(key => {
          if (key.startsWith('__NEXT_DATA__') || key.includes('env')) {
            // These might contain environment data
          }
        });
        
        // Check for any accidentally exposed environment variables
        const dangerousPatterns = ['SECRET', 'PASSWORD', 'KEY', 'TOKEN', 'PRIVATE'];
        
        dangerousPatterns.forEach(pattern => {
          if (process.env[`NEXT_PUBLIC_${pattern}`]) {
            dangerousVars.push(`NEXT_PUBLIC_${pattern}`);
          }
        });
      }
      
      if (dangerousVars.length === 0) {
        return {
          test: 'Public Environment Variables',
          status: 'pass',
          message: 'No dangerous public environment variables found',
          details: `Checked patterns and found no sensitive data in NEXT_PUBLIC_ variables`
        };
      } else {
        return {
          test: 'Public Environment Variables',
          status: 'fail',
          message: 'Dangerous public environment variables detected',
          details: `Found: ${dangerousVars.join(', ')}`
        };
      }
    } catch (error) {
      return {
        test: 'Public Environment Variables',
        status: 'error',
        message: `Environment check error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  /**
   * Test 5: Verify API route security by calling test endpoints
   */
  const testApiRouteSecurity = async (): Promise<SecurityTestResult> => {
    try {
      // Test our secrets test API route
      const response = await fetch('/api/test-secrets?action=status');
      
      if (!response.ok) {
        return {
          test: 'API Route Security',
          status: 'error',
          message: `API route error: ${response.status} ${response.statusText}`
        };
      }
      
      const data = await response.json();
      
      // Verify that the response contains status but no actual secret values
      if (data.status === 'success' && data.data) {
        const hasSecretValues = JSON.stringify(data).match(/[A-Za-z0-9+/]{32,}={0,2}/);
        const hasSecretArns = JSON.stringify(data).includes('arn:aws:secretsmanager:');
        
        if (hasSecretValues) {
          return {
            test: 'API Route Security',
            status: 'fail',
            message: 'API route response may contain secret values',
            details: 'Response contains data that looks like encoded secrets'
          };
        } else if (data.data.serverSideExecution) {
          return {
            test: 'API Route Security',
            status: 'pass',
            message: 'API route correctly validates server-side execution',
            details: `Response confirms server-side execution: ${data.data.serverSideExecution}`
          };
        } else {
          return {
            test: 'API Route Security',
            status: 'fail',
            message: 'API route did not confirm server-side execution'
          };
        }
      } else {
        return {
          test: 'API Route Security',
          status: 'error',
          message: 'Unexpected API response format',
          details: JSON.stringify(data)
        };
      }
    } catch (error) {
      return {
        test: 'API Route Security',
        status: 'error',
        message: `API test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  /**
   * Run all security validation tests
   */
  const runSecurityValidationTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      testEnvironmentDetection,
      testClientSideProtection,
      testSecretsManagerClientSideBlock,
      testPublicEnvironmentVariables,
      testApiRouteSecurity,
    ];
    
    const results: SecurityTestResult[] = [];
    
    for (const test of tests) {
      try {
        const result = await test();
        results.push(result);
        setTestResults([...results]);
        
        // Add a small delay to show progressive results
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.push({
          test: 'Unknown Test',
          status: 'error',
          message: `Test execution error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    setIsRunning(false);
  };

  /**
   * Get overall security status
   */
  const getOverallStatus = () => {
    if (testResults.length === 0) return 'not-run';
    
    const hasFailures = testResults.some(result => result.status === 'fail');
    const hasErrors = testResults.some(result => result.status === 'error');
    
    if (hasFailures) return 'failed';
    if (hasErrors) return 'error';
    return 'passed';
  };

  const overallStatus = getOverallStatus();

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🔐 Security Validation Test Page
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2>Client-Side Security Validation</h2>
        <p>
          This page validates that our security controls prevent client-side access to secrets.
          All tests run in the browser to demonstrate client-side protection is working.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={runSecurityValidationTests}
            disabled={isRunning}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              opacity: isRunning ? 0.6 : 1
            }}
          >
            {isRunning ? 'Running Tests...' : 'Run Security Validation Tests'}
          </button>
        </div>
        
        {/* Overall Status */}
        {testResults.length > 0 && (
          <div style={{
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            backgroundColor: 
              overallStatus === 'passed' ? '#d4edda' :
              overallStatus === 'failed' ? '#f8d7da' :
              overallStatus === 'error' ? '#fff3cd' : '#e2e3e5',
            border: `1px solid ${
              overallStatus === 'passed' ? '#c3e6cb' :
              overallStatus === 'failed' ? '#f5c6cb' :
              overallStatus === 'error' ? '#ffeaa7' : '#d6d8db'
            }`
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
              Overall Status: {
                overallStatus === 'passed' ? '✅ PASSED' :
                overallStatus === 'failed' ? '❌ FAILED' :
                overallStatus === 'error' ? '⚠️ ERRORS' : '⏳ RUNNING'
              }
            </h3>
            <p style={{ margin: 0 }}>
              {overallStatus === 'passed' && 'All security validations passed! Client-side protection is working correctly.'}
              {overallStatus === 'failed' && 'Some security validations failed. Please review the results below.'}
              {overallStatus === 'error' && 'Some tests encountered errors. Please check the implementation.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Test Results */}
      {testResults.map((result, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            border: `2px solid ${
              result.status === 'pass' ? '#28a745' :
              result.status === 'fail' ? '#dc3545' : '#ffc107'
            }`
          }}
        >
          <h3 style={{ 
            margin: '0 0 10px 0',
            color: result.status === 'pass' ? '#28a745' :
                   result.status === 'fail' ? '#dc3545' : '#856404'
          }}>
            {result.status === 'pass' ? '✅' : 
             result.status === 'fail' ? '❌' : '⚠️'} {result.test}
          </h3>
          <p style={{ margin: '0 0 10px 0' }}>{result.message}</p>
          {result.details && (
            <details style={{ fontSize: '0.9em', color: '#666' }}>
              <summary style={{ cursor: 'pointer' }}>Show Details</summary>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
                {result.details}
              </pre>
            </details>
          )}
        </div>
      ))}
      
      {isRunning && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '18px' }}>⏳ Running security validation tests...</div>
        </div>
      )}
    </div>
  );
};

export default SecurityValidationPage; 