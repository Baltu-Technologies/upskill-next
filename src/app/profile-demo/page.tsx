import React from 'react';

export default function ProfileDemoPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Profile Demo Page</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-center text-lg mb-6">
            ✅ This profile demo page is working! 
          </p>
          <p className="text-center text-gray-600">
            The UserProfile component can be restored here once we verify this route works.
          </p>
          <div className="mt-8 text-center">
            <a 
              href="/demo" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Demo Index
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 