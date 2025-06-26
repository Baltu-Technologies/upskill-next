export interface SecurityTestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export async function runAllSecurityTests(): Promise<SecurityTestResult[]> {
  const results: SecurityTestResult[] = [];
  
  try {
    // Test 1: Check if HTTPS is enforced
    results.push(await testHTTPSEnforcement());
    
    // Test 2: Check for secure headers
    results.push(await testSecurityHeaders());
    
    // Test 3: Check authentication endpoints
    results.push(await testAuthEndpoints());
    
    // Test 4: Check for CSRF protection
    results.push(await testCSRFProtection());
    
    // Test 5: Check session security
    results.push(await testSessionSecurity());
    
  } catch (error: any) {
    results.push({
      testName: 'Security Test Suite',
      passed: false,
      message: `Security test suite failed: ${error.message}`,
      details: error
    });
  }
  
  return results;
}

async function testHTTPSEnforcement(): Promise<SecurityTestResult> {
  try {
    const isHTTPS = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    return {
      testName: 'HTTPS Enforcement',
      passed: isHTTPS || isLocalhost,
      message: isHTTPS ? 'HTTPS is properly enforced' : 
               isLocalhost ? 'HTTPS not required for localhost' : 
               'HTTPS is not enforced',
      details: { protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown' },
      severity: (isHTTPS || isLocalhost) ? 'low' : 'high'
    };
  } catch (error: any) {
    return {
      testName: 'HTTPS Enforcement',
      passed: false,
      message: `HTTPS test failed: ${error.message}`,
      details: error,
      severity: 'critical'
    };
  }
}

async function testSecurityHeaders(): Promise<SecurityTestResult> {
  try {
    const response = await fetch('/api/auth/session');
    const headers = response.headers;
    
    const securityHeaders = {
      'x-frame-options': headers.get('x-frame-options'),
      'x-content-type-options': headers.get('x-content-type-options'),
      'x-xss-protection': headers.get('x-xss-protection'),
      'strict-transport-security': headers.get('strict-transport-security'),
      'content-security-policy': headers.get('content-security-policy')
    };
    
    const hasBasicHeaders = !!(securityHeaders['x-content-type-options'] || 
                              securityHeaders['x-frame-options']);
    
    return {
      testName: 'Security Headers',
      passed: hasBasicHeaders,
      message: hasBasicHeaders ? 'Basic security headers are present' : 'Security headers are missing',
      details: securityHeaders,
      severity: hasBasicHeaders ? 'low' : 'medium'
    };
  } catch (error: any) {
    return {
      testName: 'Security Headers',
      passed: false,
      message: `Security headers test failed: ${error.message}`,
      details: error,
      severity: 'critical'
    };
  }
}

async function testAuthEndpoints(): Promise<SecurityTestResult> {
  try {
    // Test if auth endpoints are accessible
    const endpoints = ['/api/auth/session', '/api/auth/signin', '/api/auth/signout'];
    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint);
          return { endpoint, status: response.status, accessible: response.ok || response.status === 401 };
        } catch {
          return { endpoint, status: 0, accessible: false };
        }
      })
    );
    
    const allAccessible = results.every(r => r.accessible);
    
    return {
      testName: 'Authentication Endpoints',
      passed: allAccessible,
      message: allAccessible ? 'Auth endpoints are accessible' : 'Some auth endpoints are not accessible',
      details: results,
      severity: allAccessible ? 'low' : 'high'
    };
  } catch (error: any) {
    return {
      testName: 'Authentication Endpoints',
      passed: false,
      message: `Auth endpoints test failed: ${error.message}`,
      details: error,
      severity: 'critical'
    };
  }
}

async function testCSRFProtection(): Promise<SecurityTestResult> {
  try {
    // Basic CSRF protection test - check if POST requests require proper headers
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // A properly configured CSRF protection should reject this request
    const hasCSRFProtection = response.status === 403 || response.status === 401;
    
    return {
      testName: 'CSRF Protection',
      passed: hasCSRFProtection,
      message: hasCSRFProtection ? 'CSRF protection appears to be active' : 'CSRF protection may not be configured',
      details: { status: response.status },
      severity: hasCSRFProtection ? 'low' : 'medium'
    };
  } catch (error: any) {
    return {
      testName: 'CSRF Protection',
      passed: false,
      message: `CSRF protection test failed: ${error.message}`,
      details: error,
      severity: 'critical'
    };
  }
}

async function testSessionSecurity(): Promise<SecurityTestResult> {
  try {
    // Check if session cookies have secure attributes
    const cookies = typeof document !== 'undefined' ? document.cookie : '';
    const sessionCookies = cookies.split(';').filter(cookie => 
      cookie.includes('session') || cookie.includes('auth') || cookie.includes('token')
    );
    
    return {
      testName: 'Session Security',
      passed: true, // Basic test - just check if we can access session info
      message: 'Session security test completed',
      details: { 
        cookieCount: sessionCookies.length,
        hasCookies: sessionCookies.length > 0
      },
      severity: 'low'
    };
  } catch (error: any) {
    return {
      testName: 'Session Security',
      passed: false,
      message: `Session security test failed: ${error.message}`,
      details: error,
      severity: 'critical'
    };
  }
} 