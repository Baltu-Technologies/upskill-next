'use client';

import { useState, useEffect } from 'react';

interface RedisHealthStatus {
  connected: boolean;
  error?: string;
}

interface CacheTestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: string;
}

interface SessionTestResult {
  success: boolean;
  session?: any;
  sessions?: any[];
  stats?: any;
  error?: string;
  timestamp?: string;
}

export default function RedisTestPage() {
  const [health, setHealth] = useState<RedisHealthStatus | null>(null);
  const [cacheKey, setCacheKey] = useState('test-key');
  const [cacheValue, setCacheValue] = useState('test-value');
  const [cacheTTL, setCacheTTL] = useState(300);
  const [cacheResult, setCacheResult] = useState<CacheTestResult | null>(null);
  const [sessionResult, setSessionResult] = useState<SessionTestResult | null>(null);
  const [loading, setLoading] = useState({
    health: false,
    cacheGet: false,
    cacheSet: false,
    cacheDelete: false,
    sessionCurrent: false,
    sessionStats: false,
    sessionCreate: false,
  });
  const [sessionId, setSessionId] = useState('');

  // Check Redis health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(prev => ({ ...prev, health: true }));
    try {
      const response = await fetch('/api/redis/health', {
        headers: {
          'Authorization': `Bearer mock-token-for-testing`,
        },
      });
      const data = await response.json();
      setHealth(data.redis);
    } catch (error) {
      setHealth({ connected: false, error: 'Failed to check Redis health' });
    } finally {
      setLoading(prev => ({ ...prev, health: false }));
    }
  };

  const testCacheGet = async () => {
    setLoading(prev => ({ ...prev, cacheGet: true }));
    try {
      const response = await fetch(`/api/redis/cache?key=${encodeURIComponent(cacheKey)}`, {
        headers: {
          'Authorization': `Bearer mock-token-for-testing`,
        },
      });
      const data = await response.json();
      setCacheResult(data);
    } catch (error) {
      setCacheResult({ success: false, error: 'Failed to get cache value' });
    } finally {
      setLoading(prev => ({ ...prev, cacheGet: false }));
    }
  };

  const testCacheSet = async () => {
    setLoading(prev => ({ ...prev, cacheSet: true }));
    try {
      const response = await fetch('/api/redis/cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token-for-testing`,
        },
        body: JSON.stringify({
          key: cacheKey,
          value: cacheValue,
          ttl: cacheTTL,
        }),
      });
      const data = await response.json();
      setCacheResult(data);
    } catch (error) {
      setCacheResult({ success: false, error: 'Failed to set cache value' });
    } finally {
      setLoading(prev => ({ ...prev, cacheSet: false }));
    }
  };

  const testCacheDelete = async () => {
    setLoading(prev => ({ ...prev, cacheDelete: true }));
    try {
      const response = await fetch(`/api/redis/cache?key=${encodeURIComponent(cacheKey)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer mock-token-for-testing`,
        },
      });
      const data = await response.json();
      setCacheResult(data);
    } catch (error) {
      setCacheResult({ success: false, error: 'Failed to delete cache value' });
    } finally {
      setLoading(prev => ({ ...prev, cacheDelete: false }));
    }
  };

  const testSessionCurrent = async () => {
    setLoading(prev => ({ ...prev, sessionCurrent: true }));
    try {
      const response = await fetch('/api/redis/session?action=current', {
        headers: {
          'Authorization': `Bearer mock-token-for-testing`,
        },
      });
      const data = await response.json();
      setSessionResult(data);
    } catch (error) {
      setSessionResult({ success: false, error: 'Failed to get current session' });
    } finally {
      setLoading(prev => ({ ...prev, sessionCurrent: false }));
    }
  };

  const testSessionStats = async () => {
    setLoading(prev => ({ ...prev, sessionStats: true }));
    try {
      const response = await fetch('/api/redis/session?action=stats', {
        headers: {
          'Authorization': `Bearer mock-token-for-testing`,
        },
      });
      const data = await response.json();
      setSessionResult(data);
    } catch (error) {
      setSessionResult({ success: false, error: 'Failed to get session stats' });
    } finally {
      setLoading(prev => ({ ...prev, sessionStats: false }));
    }
  };

  const testSessionCreate = async () => {
    setLoading(prev => ({ ...prev, sessionCreate: true }));
    try {
      const response = await fetch('/api/redis/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token-for-testing`,
        },
        body: JSON.stringify({
          action: 'create',
          metadata: { testSession: true },
        }),
      });
      const data = await response.json();
      setSessionResult(data);
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
    } catch (error) {
      setSessionResult({ success: false, error: 'Failed to create session' });
    } finally {
      setLoading(prev => ({ ...prev, sessionCreate: false }));
    }
  };

  const StatusIndicator = ({ status }: { status: boolean | null }) => {
    if (status === null) return <span className="text-gray-500">Unknown</span>;
    return status ? (
      <span className="text-green-500 font-semibold">✓ Connected</span>
    ) : (
      <span className="text-red-500 font-semibold">✗ Disconnected</span>
    );
  };

  const ResultDisplay = ({ result, type }: { result: any; type: string }) => {
    if (!result) return null;
    
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <h4 className="font-semibold mb-2">{type} Result:</h4>
        <pre className="text-sm overflow-x-auto bg-white p-2 rounded border">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Redis Integration Test</h1>
          
          {/* Health Check Section */}
          <div className="mb-8 p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Redis Health Check</h2>
              <button
                onClick={checkHealth}
                disabled={loading.health}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading.health ? 'Checking...' : 'Check Health'}
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Status:</span>
              <StatusIndicator status={health?.connected ?? null} />
              {health?.error && (
                <span className="text-red-500 text-sm">({health.error})</span>
              )}
            </div>
          </div>

          {/* Cache Testing Section */}
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Cache Testing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cache Key</label>
                <input
                  type="text"
                  value={cacheKey}
                  onChange={(e) => setCacheKey(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter cache key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cache Value</label>
                <input
                  type="text"
                  value={cacheValue}
                  onChange={(e) => setCacheValue(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter cache value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">TTL (seconds)</label>
                <input
                  type="number"
                  value={cacheTTL}
                  onChange={(e) => setCacheTTL(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="300"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={testCacheGet}
                disabled={loading.cacheGet}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading.cacheGet ? 'Getting...' : 'Get Cache'}
              </button>
              <button
                onClick={testCacheSet}
                disabled={loading.cacheSet}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading.cacheSet ? 'Setting...' : 'Set Cache'}
              </button>
              <button
                onClick={testCacheDelete}
                disabled={loading.cacheDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {loading.cacheDelete ? 'Deleting...' : 'Delete Cache'}
              </button>
            </div>

            <ResultDisplay result={cacheResult} type="Cache" />
          </div>

          {/* Session Testing Section */}
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Session Testing</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={testSessionCurrent}
                disabled={loading.sessionCurrent}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {loading.sessionCurrent ? 'Getting...' : 'Get Current Session'}
              </button>
              <button
                onClick={testSessionCreate}
                disabled={loading.sessionCreate}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                {loading.sessionCreate ? 'Creating...' : 'Create Session'}
              </button>
              <button
                onClick={testSessionStats}
                disabled={loading.sessionStats}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {loading.sessionStats ? 'Getting...' : 'Get Session Stats'}
              </button>
            </div>

            {sessionId && (
              <div className="mb-4 p-2 bg-gray-100 rounded">
                <span className="text-sm font-medium">Last Created Session ID: </span>
                <span className="text-sm font-mono">{sessionId}</span>
              </div>
            )}

            <ResultDisplay result={sessionResult} type="Session" />
          </div>

          {/* Instructions */}
          <div className="mb-8 p-4 border rounded-lg bg-blue-50">
            <h2 className="text-lg font-semibold mb-2">Testing Instructions</h2>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>1. First, check Redis health to ensure connection is working</li>
              <li>2. Test cache operations: set a value, get it back, then delete it</li>
              <li>3. Test session operations: get current session, create new sessions, check stats</li>
              <li>4. All operations are tenant-isolated based on your Auth0 organization</li>
              <li>5. Check the browser console for any errors or additional logging</li>
            </ul>
          </div>

          {/* Environment Variables Notice */}
          <div className="p-4 border rounded-lg bg-yellow-50">
            <h2 className="text-lg font-semibold mb-2">Environment Setup</h2>
            <p className="text-sm text-gray-700 mb-2">
              Make sure you have the following environment variables set:
            </p>
            <ul className="text-sm space-y-1 text-gray-600 font-mono">
              <li>• UPSTASH_REDIS_REST_URL</li>
              <li>• UPSTASH_REDIS_REST_TOKEN</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 