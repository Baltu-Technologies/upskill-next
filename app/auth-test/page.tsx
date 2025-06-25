'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRole } from '@/app/hooks/useAuth';
import { useSession } from '@/app/hooks/useAuth';
import { authClient } from '@/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { runAllSecurityTests, SecurityTestResult } from '@/lib/security-tests';

export default function AuthTestPage() {
  const { user, isLoading, error, signOut, refreshUser, isAuthenticated } = useAuth();
  const { hasRole, isAdmin, isUser, userRole } = useRole();
  const { session, refreshSession } = useSession();
  
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityResults, setSecurityResults] = useState<SecurityTestResult[]>([]);

  const addLog = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${isError ? '❌' : '✅'} ${message}`;
    setTestLogs(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  const runTest = async (testName: string, testFn: () => Promise<boolean>) => {
    try {
      addLog(`Starting test: ${testName}`);
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      addLog(`Test ${testName}: ${result ? 'PASSED' : 'FAILED'}`, !result);
      return result;
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [testName]: false }));
      addLog(`Test ${testName}: ERROR - ${error.message}`, true);
      return false;
    }
  };

  const testAuthContext = async (): Promise<boolean> => {
    try {
      // Test if auth context is working
      const hasUser = user !== null;
      const hasLoadingState = typeof isLoading === 'boolean';
      const hasErrorState = error === null || typeof error === 'string';
      const hasAuthenticatedState = typeof isAuthenticated === 'boolean';
      
      addLog(`User exists: ${hasUser}`);
      addLog(`Loading state: ${isLoading}`);
      addLog(`Error state: ${error || 'none'}`);
      addLog(`Authenticated: ${isAuthenticated}`);
      
      return hasLoadingState && hasErrorState && (hasUser === isAuthenticated);
    } catch (error: any) {
      addLog(`Auth context test failed: ${error.message}`, true);
      return false;
    }
  };

  const testRoleSystem = async (): Promise<boolean> => {
    try {
      const roleTestResults = [];
      
      // Test role functions exist
      roleTestResults.push(typeof hasRole === 'function');
      roleTestResults.push(typeof isAdmin === 'boolean');
      roleTestResults.push(typeof isUser === 'boolean');
      roleTestResults.push(typeof userRole === 'string');
      
      addLog(`Role functions exist: ${roleTestResults[0]}`);
      addLog(`Is admin: ${isAdmin}`);
      addLog(`Is user: ${isUser}`);
      addLog(`User role: ${userRole}`);
      
      // Test role checking logic
      if (user) {
        const adminCheck = hasRole('admin');
        const userCheck = hasRole('user');
        addLog(`Admin role check: ${adminCheck}`);
        addLog(`User role check: ${userCheck}`);
        roleTestResults.push(typeof adminCheck === 'boolean');
        roleTestResults.push(typeof userCheck === 'boolean');
      }
      
      return roleTestResults.every(result => result === true);
    } catch (error: any) {
      addLog(`Role system test failed: ${error.message}`, true);
      return false;
    }
  };

  const testSessionManagement = async (): Promise<boolean> => {
    try {
      // Test session refresh
      await refreshSession();
      addLog('Session refresh completed');
      
      // Test user refresh
      await refreshUser();
      addLog('User refresh completed');
      
      // Check session data
      const hasSessionData = session !== null;
      addLog(`Session data exists: ${hasSessionData}`);
      
      if (session) {
        addLog(`Session user ID: ${session.user?.id}`);
        addLog(`Session expires: ${session.session?.expiresAt}`);
      }
      
      return true;
    } catch (error: any) {
      addLog(`Session management test failed: ${error.message}`, true);
      return false;
    }
  };

  const testPasswordReset = async (): Promise<boolean> => {
    if (!resetEmail) {
      addLog('Password reset test skipped - no email provided');
      return true;
    }
    
    try {
      // Test password reset request
      const resetResult = await authClient.forgetPassword({
        email: resetEmail,
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      addLog(`Password reset request sent: ${resetResult ? 'success' : 'failed'}`);
      toast.success('Password reset email sent (check console for details)');
      
      return true;
    } catch (error: any) {
      addLog(`Password reset test failed: ${error.message}`, true);
      return false;
    }
  };

  const testSocialLogin = async (): Promise<boolean> => {
    try {
      // Test social login URL generation
      const providers = ['google', 'facebook', 'discord', 'github', 'linkedin'];
      const socialUrls = providers.map(provider => 
        `/api/auth/signin/${provider}?callbackURL=${encodeURIComponent(window.location.origin)}`
      );
      
      addLog(`Social login URLs generated for: ${providers.join(', ')}`);
      socialUrls.forEach((url, index) => {
        addLog(`${providers[index]}: ${url}`);
      });
      
      return socialUrls.length === providers.length;
    } catch (error: any) {
      addLog(`Social login test failed: ${error.message}`, true);
      return false;
    }
  };

  const testProtectedRoutes = async (): Promise<boolean> => {
    try {
      // Test if we can access this page (should be accessible)
      addLog('Protected route test: Current page accessible');
      
      // Test middleware headers (if available)
      const response = await fetch('/api/auth/session');
      const sessionData = await response.json();
      
      addLog(`Session API response: ${response.status}`);
      addLog(`Session data: ${JSON.stringify(sessionData)}`);
      
      return response.ok;
    } catch (error: any) {
      addLog(`Protected routes test failed: ${error.message}`, true);
      return false;
    }
  };

  const runSecurityTests = async () => {
    addLog('Starting security tests...');
    try {
      const results = await runAllSecurityTests();
      setSecurityResults(results);
      
      const passedTests = results.filter(r => r.passed).length;
      const totalTests = results.length;
      addLog(`Security tests completed: ${passedTests}/${totalTests} passed`);
      
      // Log critical issues
      const criticalIssues = results.filter(r => !r.passed && r.severity === 'critical');
      if (criticalIssues.length > 0) {
        addLog(`⚠️ CRITICAL SECURITY ISSUES FOUND: ${criticalIssues.length}`, true);
      }
    } catch (error: any) {
      addLog(`Security tests failed: ${error.message}`, true);
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestLogs([]);
    setTestResults({});
    setSecurityResults([]);
    
    addLog('Starting comprehensive authentication tests...');
    
    const tests = [
      { name: 'Auth Context', fn: testAuthContext },
      { name: 'Role System', fn: testRoleSystem },
      { name: 'Session Management', fn: testSessionManagement },
      { name: 'Protected Routes', fn: testProtectedRoutes },
      { name: 'Social Login URLs', fn: testSocialLogin },
      { name: 'Password Reset', fn: testPasswordReset },
    ];
    
    for (const test of tests) {
      await runTest(test.name, test.fn);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Run security tests
    await runSecurityTests();
    
    addLog('All tests completed!');
    setIsRunningTests(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      addLog('User signed out successfully');
    } catch (error: any) {
      toast.error('Sign out failed: ' + error.message);
      addLog(`Sign out failed: ${error.message}`, true);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Authentication System Test</h1>
        <p className="text-muted-foreground">
          Comprehensive testing of Better Auth integration, middleware, and security
        </p>
      </div>

      {/* User Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current User Status</CardTitle>
          <CardDescription>Authentication state and user information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Authenticated</Label>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Label>Role</Label>
              <Badge variant={isAdmin ? "destructive" : "outline"}>
                {userRole}
              </Badge>
            </div>
            <div>
              <Label>Loading</Label>
              <Badge variant={isLoading ? "secondary" : "outline"}>
                {isLoading ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Label>Error</Label>
              <Badge variant={error ? "destructive" : "default"}>
                {error ? 'Yes' : 'None'}
              </Badge>
            </div>
          </div>
          
          {user && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">User Details:</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <h4 className="font-medium text-destructive mb-2">Error:</h4>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>Run comprehensive authentication tests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="resetEmail">Test Email (for password reset)</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="test@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="resetToken">Reset Token (if testing reset)</Label>
              <Input
                id="resetToken"
                placeholder="Reset token from email"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isRunningTests}
              className="flex-1"
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              variant="outline" 
              onClick={runSecurityTests} 
              disabled={isRunningTests}
            >
              Security Tests
            </Button>
            {isAuthenticated && (
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Summary of authentication test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(testResults).map(([testName, passed]) => (
                <div key={testName} className="flex items-center gap-2">
                  <Badge variant={passed ? "default" : "destructive"}>
                    {passed ? '✅' : '❌'}
                  </Badge>
                  <span className="text-sm">{testName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Test Results */}
      {securityResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Test Results</CardTitle>
            <CardDescription>Security vulnerability assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge 
                    variant={result.passed ? "default" : "destructive"}
                    className="mt-0.5"
                  >
                    {result.passed ? '✅' : '❌'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{result.testName}</span>
                      <Badge 
                        variant={
                          result.severity === 'critical' ? 'destructive' :
                          result.severity === 'high' ? 'destructive' :
                          result.severity === 'medium' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {result.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.details}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {securityResults.filter(r => r.passed).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Passed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {securityResults.filter(r => !r.passed).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-800">
                    {securityResults.filter(r => r.severity === 'critical').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {securityResults.filter(r => r.severity === 'high').length}
                  </div>
                  <div className="text-xs text-muted-foreground">High Risk</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Logs */}
      {testLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Logs</CardTitle>
            <CardDescription>Detailed test execution logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {testLogs.join('\n')}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Test specific authentication features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Test Dashboard (Protected)
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/profile'}>
              Test Profile (Protected)
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin'}>
              Test Admin (Admin Only)
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Test Home (Public)
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/api/auth/signin/google'}
            >
              Test Google Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/api/auth/signin/facebook'}
            >
              Test Facebook Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/api/auth/signin/discord'}
            >
              Test Discord Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/api/auth/signin/github'}
            >
              Test GitHub Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/api/auth/signin/linkedin'}
            >
              Test LinkedIn Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 