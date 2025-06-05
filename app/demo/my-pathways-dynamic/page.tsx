'use client';

import React from 'react';
import MyPathways from '../../../src/components/career-exploration/MyPathways';
import { Database, RefreshCw, Save, Trash2, Settings } from 'lucide-react';

export default function MyPathwaysDynamicDemo() {
  const handleResetData = () => {
    if (confirm('This will clear all saved data and reset to defaults. Continue?')) {
      // Clear localStorage data
      ['upskill_user_pathways', 'upskill_user_profile', 'upskill_pathway_cache'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Refresh the page to reinitialize
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Pathways - Dynamic Data Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Enhanced career profile dashboard with dynamic data fetching, state management, 
              and localStorage persistence. All changes are saved automatically.
            </p>
            
            {/* Demo Controls */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Data persisted in localStorage</span>
              </div>
              <button
                onClick={handleResetData}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Reset Demo Data</span>
              </button>
            </div>
          </div>
          
          {/* Main Component */}
          <MyPathways />
          
          {/* Feature Documentation */}
          <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Enhanced Features Implemented
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">🔄 Dynamic Data Fetching</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Real-time pathway data loading from service layer</li>
                    <li>• Automatic data synchronization</li>
                    <li>• Smart caching with localStorage</li>
                    <li>• Simulated network delays for realistic UX</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">⚡ State Management</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Loading states with skeleton UI</li>
                    <li>• Error handling with retry mechanisms</li>
                    <li>• Optimistic updates for smooth UX</li>
                    <li>• Action status tracking</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">💾 Data Persistence</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Automatic saving to localStorage</li>
                    <li>• Profile and pathway management</li>
                    <li>• Progress tracking persistence</li>
                    <li>• User preferences retention</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">🚀 User Experience</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Refresh functionality with status indicators</li>
                    <li>• Interactive pathway status management</li>
                    <li>• Real-time error feedback</li>
                    <li>• Smooth animations and transitions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical Implementation */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Technical Implementation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Service Layer</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• PathwayService class</li>
                  <li>• Error handling</li>
                  <li>• Async operations</li>
                  <li>• Data validation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-900 mb-2">Custom Hooks</h4>
                <ul className="text-purple-700 space-y-1">
                  <li>• useUserPathways</li>
                  <li>• useUserProfile</li>
                  <li>• usePathwayDiscovery</li>
                  <li>• State synchronization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-2">UI Components</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Loading skeletons</li>
                  <li>• Error boundaries</li>
                  <li>• Action feedback</li>
                  <li>• Optimistic updates</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 bg-amber-50 rounded-lg border border-amber-200 p-4">
            <h3 className="font-medium text-amber-900 mb-2">Try It Out:</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Use the refresh button to see loading states</li>
              <li>• Try changing pathway status (active/paused)</li>
              <li>• Remove and re-add pathways to test persistence</li>
              <li>• Reset demo data to see initialization process</li>
              <li>• All changes are automatically saved to localStorage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 