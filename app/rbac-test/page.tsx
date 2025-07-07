'use client'

import { useState } from 'react'

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  userRoles?: string[];
  userPermissions?: string[];
  requiredRole?: string;
  requiredPermission?: string;
}

export default function RBACTestPage() {
  const [results, setResults] = useState<Record<string, ApiResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const testEndpoint = async (name: string, url: string, method: string = 'GET', body?: any) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [name]: data }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          message: 'Network error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const testAll = async () => {
    await Promise.all([
      testEndpoint('Profile', '/api/test-auth/profile'),
      testEndpoint('Admin Only', '/api/test-auth/admin-only'),
      testEndpoint('Job Listings', '/api/test-auth/create-job'),
      testEndpoint('Create Job', '/api/test-auth/create-job', 'POST', {
        title: 'Full Stack Developer',
        description: 'Join our amazing team!'
      })
    ]);
  };

  const ResultCard = ({ title, result, testKey }: { 
    title: string; 
    result?: ApiResponse; 
    testKey: string;
  }) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{title}</h3>
        <button
          onClick={() => {
            if (testKey === 'Profile') testEndpoint('Profile', '/api/test-auth/profile');
            if (testKey === 'Admin Only') testEndpoint('Admin Only', '/api/test-auth/admin-only');
            if (testKey === 'Job Listings') testEndpoint('Job Listings', '/api/test-auth/create-job');
            if (testKey === 'Create Job') testEndpoint('Create Job', '/api/test-auth/create-job', 'POST', {
              title: 'Full Stack Developer',
              description: 'Join our amazing team!'
            });
          }}
          disabled={loading[testKey]}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {loading[testKey] ? 'Testing...' : 'Test'}
        </button>
      </div>
      
      {result && (
        <div className={`p-3 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? '✅ Success' : '❌ Failed'}
          </div>
          <div className={`mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.message}
          </div>
          
          {result.error && (
            <div className="mt-2 text-red-600 text-sm">
              <strong>Error:</strong> {result.error}
            </div>
          )}
          
          {result.userRoles && (
            <div className="mt-2 text-sm">
              <strong>Your Roles:</strong> {result.userRoles.join(', ')}
            </div>
          )}
          
          {result.userPermissions && (
            <div className="mt-2 text-sm">
              <strong>Your Permissions:</strong> {result.userPermissions.join(', ')}
            </div>
          )}
          
          {result.requiredRole && (
            <div className="mt-2 text-sm text-orange-600">
              <strong>Required Role:</strong> {result.requiredRole}
            </div>
          )}
          
          {result.requiredPermission && (
            <div className="mt-2 text-sm text-orange-600">
              <strong>Required Permission:</strong> {result.requiredPermission}
            </div>
          )}
          
          {result.data && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">View Data</summary>
              <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔐 Role-Based Access Control (RBAC) Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test the employer portal's role-based access control system. Different endpoints require different roles and permissions.
          </p>
          
          <button
            onClick={testAll}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            🚀 Test All Endpoints
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ResultCard 
            title="👤 User Profile" 
            result={results['Profile']} 
            testKey="Profile"
          />
          
          <ResultCard 
            title="🔑 Admin Only Access" 
            result={results['Admin Only']} 
            testKey="Admin Only"
          />
          
          <ResultCard 
            title="📋 View Job Postings" 
            result={results['Job Listings']} 
            testKey="Job Listings"
          />
          
          <ResultCard 
            title="➕ Create Job Posting" 
            result={results['Create Job']} 
            testKey="Create Job"
          />
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">🎭 Role Definitions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-md">
                <h3 className="font-medium text-red-800">Employer Admin</h3>
                <p className="text-sm text-red-600">Full access to all features and settings</p>
                <div className="text-xs text-red-500 mt-1">All 9 permissions</div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800">Employer Recruiter</h3>
                <p className="text-sm text-blue-600">Manage job postings and candidate pipeline</p>
                <div className="text-xs text-blue-500 mt-1">6 permissions</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-md">
                <h3 className="font-medium text-green-800">Employer Marketing</h3>
                <p className="text-sm text-green-600">Analytics and content management</p>
                <div className="text-xs text-green-500 mt-1">4 permissions</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-800">Employer Viewer</h3>
                <p className="text-sm text-gray-600">Read-only access to data and analytics</p>
                <div className="text-xs text-gray-500 mt-1">2 permissions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">🧪 Testing Notes</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Currently using mock data for testing - roles/permissions are hardcoded</li>
            <li>• In production, these will come from verified Auth0 JWT tokens</li>
            <li>• Change the mock data in API files to test different role scenarios</li>
            <li>• Green = Success, Red = Permission Denied</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 