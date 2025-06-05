'use client';

import React from 'react';
import MyPathways from '../../../src/components/career-exploration/MyPathways';

export default function MyPathwaysDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Pathways Profile
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive profile dashboard showing captured interests, active career pathways, 
              progress tracking, and pathway management capabilities.
            </p>
          </div>
          
          <MyPathways />
          
          <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Profile Overview</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• User profile with avatar and persona</li>
                  <li>• Achievement statistics cards</li>
                  <li>• Captured interests summary (from Task 6)</li>
                  <li>• Expandable interest details</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Pathway Management</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Active and paused pathways separation</li>
                  <li>• Overall progress visualization</li>
                  <li>• Individual course progress tracking</li>
                  <li>• Pathway status management (pause/resume)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Interactive Features</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Expandable pathway course details</li>
                  <li>• Priority indicators (red/yellow/gray borders)</li>
                  <li>• Action menus with edit/remove options</li>
                  <li>• Responsive design for all screen sizes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Progress Tracking</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Course completion indicators</li>
                  <li>• Progress bars with percentages</li>
                  <li>• Difficulty level badges</li>
                  <li>• Learning time tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 