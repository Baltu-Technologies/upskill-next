"use client";

import { useState, useEffect } from 'react';

export default function TestDatabase() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check if amplify_outputs.json exists and has the right structure
        const response = await fetch('/amplify_outputs.json');
        if (!response.ok) {
          throw new Error('amplify_outputs.json not found');
        }
        
        const config = await response.json();
        console.log('Amplify config:', config);
        
        if (!config.data) {
          throw new Error('No data configuration found in amplify_outputs.json');
        }
        
        setStatus('✅ Configuration file found');
        
        // Try to import and configure Amplify
        const { Amplify } = await import('aws-amplify');
        Amplify.configure(config);
        
        setStatus('✅ Amplify configured successfully');
        
      } catch (err) {
        console.error('Connection test failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('❌ Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg mb-4">{status}</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Error Details:</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Ensure AWS credentials are configured: <code>aws configure</code></li>
              <li>Start Amplify sandbox: <code>npm run db:sandbox</code></li>
              <li>Check that amplify_outputs.json exists in the project root</li>
              <li>Verify the file contains data configuration</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 