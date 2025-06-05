'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import PathwayManagement from '../../../src/components/career-exploration/PathwayManagement';
import { mockCareerPathways } from '../../../src/data/mockCareerData';

export default function PathwayManagementDemo() {
  const handleUpdatePathway = async (pathwayId: string, updates: any) => {
    console.log('Updating pathway:', pathwayId, updates);
    // In a real app, this would update the pathway in the backend
  };

  const handleRemovePathway = async (pathwayId: string) => {
    console.log('Removing pathway:', pathwayId);
    // In a real app, this would remove the pathway from the backend
  };

  const handleReorderPathways = async (reorderedIds: string[]) => {
    console.log('Reordering pathways:', reorderedIds);
    // In a real app, this would update the pathway order in the backend
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <a 
            href="/demo" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Demos
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task 13.5: Pathway Management
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive pathway management system allowing users to remove, re-prioritize, 
            and organize their saved pathways with status controls and filtering.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ Key Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">⚙️ Pathway Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Priority management (High/Medium/Low)</li>
                <li>• Status controls (Active/Paused/Completed)</li>
                <li>• Remove pathways with confirmation</li>
                <li>• Quick action menus per pathway</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">📊 Statistics Dashboard</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Total pathway count</li>
                <li>• Active/Paused/Completed breakdown</li>
                <li>• Average progress calculation</li>
                <li>• Visual status indicators</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">🔍 Filtering & Sorting</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Filter by status (All/Active/Paused/Completed)</li>
                <li>• Sort by priority/progress/name/date</li>
                <li>• Dynamic pathway cards</li>
                <li>• Responsive grid layout</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">🎨 Interactive UI</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Color-coded status borders</li>
                <li>• Dropdown action menus</li>
                <li>• Confirmation modals</li>
                <li>• Progress bars and indicators</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">🔐 Safe Operations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Delete confirmation dialogs</li>
                <li>• Loading states during updates</li>
                <li>• Error handling and rollback</li>
                <li>• Visual feedback for all actions</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">📱 Responsive Design</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-first approach</li>
                <li>• Adaptive grid layouts</li>
                <li>• Touch-friendly interactions</li>
                <li>• Smooth animations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Demo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Live Demo</h2>
          <p className="text-gray-600 mb-6">
            Try the interactive pathway management interface with sample data. 
            Click the menu (⋯) on each pathway card to access management options:
          </p>
          
          <PathwayManagement
            pathways={mockCareerPathways}
            onUpdatePathway={handleUpdatePathway}
            onRemovePathway={handleRemovePathway}
            onReorderPathways={handleReorderPathways}
          />
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 How to Use</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">🎯 Managing Individual Pathways</h3>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li><strong>Access Options:</strong> Click the menu button (⋯) on any pathway card</li>
                <li><strong>Change Priority:</strong> Select High/Medium/Low priority from the dropdown</li>
                <li><strong>Update Status:</strong> Switch between Active/Paused/Completed</li>
                <li><strong>Remove Pathway:</strong> Click "Remove Pathway" and confirm deletion</li>
                <li><strong>Visual Feedback:</strong> Cards change color based on status</li>
              </ol>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">📊 Using Filters & Sorting</h3>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li><strong>Filter by Status:</strong> Use the "Filter" dropdown to show specific status types</li>
                <li><strong>Sort Pathways:</strong> Choose from Priority/Progress/Name/Date sorting</li>
                <li><strong>View Statistics:</strong> Check the stats grid for overview metrics</li>
                <li><strong>Responsive Layout:</strong> Cards adapt to screen size automatically</li>
                <li><strong>Real-time Updates:</strong> Changes reflect immediately in the interface</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Technical Implementation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">🏗️ Component Architecture</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>PathwayManagement:</strong> Main container with filtering and stats</li>
                <li><strong>ManagementPathwayCard:</strong> Individual pathway management interface</li>
                <li><strong>Action Dropdowns:</strong> Context menus with priority and status controls</li>
                <li><strong>Confirmation Modals:</strong> Safe deletion with user confirmation</li>
                <li><strong>Statistics Grid:</strong> Real-time calculation of pathway metrics</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">⚡ Key Features</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>Async Operations:</strong> All updates use Promise-based async functions</li>
                <li><strong>Type Safety:</strong> Full TypeScript integration with proper interfaces</li>
                <li><strong>State Management:</strong> React hooks for local state and UI interactions</li>
                <li><strong>Error Handling:</strong> Comprehensive error catching and user feedback</li>
                <li><strong>Performance:</strong> Optimized rendering with smart re-renders</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔗 Integration with MyPathways</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              The PathwayManagement component has been seamlessly integrated into the MyPathways interface 
              as a dedicated "Manage Pathways" tab, providing users with a comprehensive management experience 
              alongside the overview and progress tracking features.
            </p>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Access Management Features:</h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Navigate to the My Pathways section</li>
                <li>Click the "⚙️ Manage Pathways" tab</li>
                <li>Use all management features directly within your profile</li>
                <li>Switch back to "📊 Overview & Progress" tab for tracking</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Backend Integration Ready:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// The component accepts async handlers for backend integration
<PathwayManagement
  pathways={userPathways}
  onUpdatePathway={async (id, updates) => await pathwayAPI.update(id, updates)}
  onRemovePathway={async (id) => await pathwayAPI.remove(id)}
  onReorderPathways={async (ids) => await pathwayAPI.reorder(ids)}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 