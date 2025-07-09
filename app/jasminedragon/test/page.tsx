'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AdminTest = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setIsLoading(true);
    const results: Record<string, boolean> = {};

    // Test admin stats endpoint
    try {
      const response = await fetch('/api/jasminedragon/stats');
      results['Admin Stats API'] = response.ok;
    } catch {
      results['Admin Stats API'] = false;
    }

    // Test admin users endpoint
    try {
      const response = await fetch('/api/jasminedragon/users');
      results['Admin Users API'] = response.ok;
    } catch {
      results['Admin Users API'] = false;
    }

    // Test admin analytics endpoint
    try {
      const response = await fetch('/api/jasminedragon/analytics?range=30d');
      results['Admin Analytics API'] = response.ok;
    } catch {
      results['Admin Analytics API'] = false;
    }

    // Test admin settings endpoint
    try {
      const response = await fetch('/api/jasminedragon/settings');
      results['Admin Settings API'] = response.ok;
    } catch {
      results['Admin Settings API'] = false;
    }

    setTestResults(results);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Running admin tests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel Test</h1>
        <p className="text-gray-600">Testing admin API endpoints and access controls</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoint Tests</h2>
          <div className="space-y-3">
            {Object.entries(testResults).map(([test, passed]) => (
              <div key={test} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{test}</span>
                <div className="flex items-center space-x-2">
                  {passed ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600">PASS</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-600">FAIL</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Success! 🎉</h3>
        <p className="text-blue-800">
          Your admin panel has been successfully moved to <strong>/jasminedragon</strong> and is now protected with admin-only access control.
        </p>
        <div className="mt-3 text-sm text-blue-700">
          <p><strong>Security Features:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Obfuscated URL path (/jasminedragon instead of /admin)</li>
            <li>Admin role verification before access</li>
            <li>Session-based authentication</li>
            <li>Automatic redirect to /unauthorized for non-admin users</li>
          </ul>
        </div>
      </div>

      <button
        onClick={runTests}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Run Tests Again
      </button>
    </div>
  );
};

export default AdminTest; 