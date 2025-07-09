'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Loader2, Shield, User, Settings, Book, Briefcase, UserCheck, Edit3, Home } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  details?: any;
}

interface UserPermissions {
  canAccessHome: boolean;
  canAccessCourses: boolean;
  canAccessCareerOpportunities: boolean;
  canAccessCourseTest: boolean;
  canAccessGuideAccess: boolean;
  canAccessCourseCreator: boolean;
  canAccessProfile: boolean;
}

export default function RBACTestPage() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [testing, setTesting] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);

  const rolePermissionMapping = {
    admin: ['home', 'courses', 'career_opportunities', 'course_test', 'guide_access', 'course_creator', 'profile', 'settings', 'admin'],
    guide: ['home', 'courses', 'career_opportunities', 'guide_access', 'profile'],
    content_creator: ['home', 'courses', 'career_opportunities', 'course_creator', 'profile'],
    learner: ['home', 'courses', 'career_opportunities', 'profile']
  };

  const testCases = [
    {
      name: 'User Authentication',
      test: async () => {
        if (!user) throw new Error('User not authenticated');
        return { user: user.email };
      }
    },
    {
      name: 'User Permissions API',
      test: async () => {
        const response = await fetch('/api/user-permissions');
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const permissions = await response.json();
        setUserPermissions(permissions);
        return permissions;
      }
    },
    {
      name: 'Admin Panel Access',
      test: async () => {
        const response = await fetch('/api/jasminedragon/stats');
        if (response.status === 403) {
          return { access: false, message: 'Correctly blocked non-admin access' };
        }
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const stats = await response.json();
        setAdminStats(stats);
        return { access: true, stats };
      }
    },
    {
      name: 'User Management API',
      test: async () => {
        const response = await fetch('/api/jasminedragon/users');
        if (response.status === 403) {
          return { access: false, message: 'Correctly blocked non-admin access' };
        }
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const users = await response.json();
        setAllUsers(users);
        return { access: true, userCount: users.length };
      }
    },
    {
      name: 'Role-Based Navigation',
      test: async () => {
        if (!userPermissions) throw new Error('User permissions not loaded');
        const navigationItems = [
          { name: 'Home', permission: 'canAccessHome', icon: Home },
          { name: 'Courses', permission: 'canAccessCourses', icon: Book },
          { name: 'Career Opportunities', permission: 'canAccessCareerOpportunities', icon: Briefcase },
          { name: 'Course Test', permission: 'canAccessCourseTest', icon: Book },
          { name: 'Guide Access', permission: 'canAccessGuideAccess', icon: UserCheck },
          { name: 'Course Creator', permission: 'canAccessCourseCreator', icon: Edit3 },
          { name: 'Profile', permission: 'canAccessProfile', icon: User },
        ];
        
        const accessibleItems = navigationItems.filter(item => 
          userPermissions[item.permission as keyof UserPermissions]
        );
        
        return { 
          totalItems: navigationItems.length, 
          accessibleItems: accessibleItems.length,
          items: accessibleItems.map(item => item.name)
        };
      }
    },
    {
      name: 'Route Protection',
      test: async () => {
        const protectedRoutes = [
          '/jasminedragon',
          '/jasminedragon/users',
          '/jasminedragon/settings'
        ];
        
        const results = await Promise.all(
          protectedRoutes.map(async (route) => {
            try {
              const response = await fetch(route);
              return {
                route,
                status: response.status,
                accessible: response.status !== 403 && response.status !== 401
              };
            } catch (error) {
              return {
                route,
                status: 'error',
                accessible: false
              };
            }
          })
        );
        
        return results;
      }
    }
  ];

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    for (const testCase of testCases) {
      try {
        const result = await testCase.test();
        setTestResults(prev => [...prev, {
          name: testCase.name,
          status: 'pass',
          message: 'Test passed',
          details: result
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: testCase.name,
          status: 'fail',
          message: error instanceof Error ? error.message : 'Test failed',
          details: error
        }]);
      }
    }
    
    setTesting(false);
  };

  useEffect(() => {
    // Load current user roles
    const loadUserRoles = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user-permissions');
        if (response.ok) {
          const permissions = await response.json();
          setUserPermissions(permissions);
        }
      } catch (error) {
        console.error('Error loading user permissions:', error);
      }
    };

    loadUserRoles();
  }, [user]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              RBAC Test Suite
            </CardTitle>
            <CardDescription>
              Please sign in to test the role-based access control system
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              RBAC Test Suite
            </h1>
            <p className="text-muted-foreground">
              Comprehensive testing of Role-Based Access Control implementation
            </p>
          </div>
          <Button 
            onClick={runTests} 
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </Button>
        </div>

        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Current User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tests" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="admin">Admin Data</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Results of RBAC system tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Run All Tests" to begin testing
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{result.name}</h3>
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.message}
                          </p>
                          {result.details && (
                            <details className="mt-2">
                              <summary className="text-sm cursor-pointer text-blue-600 hover:text-blue-800">
                                View Details
                              </summary>
                              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Permissions</CardTitle>
                <CardDescription>
                  Current user's access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userPermissions ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(userPermissions).map(([key, hasPermission]) => (
                      <div key={key} className="flex items-center gap-2 p-3 rounded-lg border">
                        {hasPermission ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={hasPermission ? 'text-foreground' : 'text-muted-foreground'}>
                          {key.replace('canAccess', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Run tests to load permissions
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  All users in the system (admin access required)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allUsers.length > 0 ? (
                  <div className="space-y-3">
                    {allUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{user.name || user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex gap-1">
                          {(user.roles || []).map((role: string) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Run tests to load users (admin access required)
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Statistics</CardTitle>
                <CardDescription>
                  System statistics (admin access required)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {adminStats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">{adminStats.totalUsers}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">{adminStats.activeUsers}</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-purple-600">{adminStats.adminUsers}</div>
                      <div className="text-sm text-muted-foreground">Admin Users</div>
                    </div>
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-orange-600">{adminStats.newUsersToday}</div>
                      <div className="text-sm text-muted-foreground">New Today</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Run tests to load admin statistics (admin access required)
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 