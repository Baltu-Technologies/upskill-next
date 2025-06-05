'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import PathwayProgressVisualization from '../../../src/components/career-exploration/PathwayProgressVisualization';
import { mockCareerPathways } from '../../../src/data/mockCareerData';

export default function PathwayProgressDemo() {
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
            Task 13.4: Pathway Progress Visualization
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive progress tracking and visualization for career pathways with detailed analytics, 
            milestone tracking, skill development progress, and achievement badges.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ Key Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">📊 Progress Overview</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Overall progress summary</li>
                <li>• Circular progress rings</li>
                <li>• Quick statistics cards</li>
                <li>• Sortable pathway lists</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">🎯 Milestone Tracking</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Course completion timeline</li>
                <li>• Progress indicators</li>
                <li>• Visual status icons</li>
                <li>• Learning progress bars</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">⚡ Skill Development</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Individual skill tracking</li>
                <li>• Skill level badges</li>
                <li>• Progress bars per skill</li>
                <li>• Dynamic level assessment</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">🏆 Achievement System</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Progress-based badges</li>
                <li>• Course completion awards</li>
                <li>• Visual achievement gallery</li>
                <li>• Motivational milestones</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">📈 Analytics Dashboard</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Weekly progress tracking</li>
                <li>• Engagement scoring</li>
                <li>• Consistency metrics</li>
                <li>• Time estimation</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">🎨 Interactive UI</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Expandable pathway cards</li>
                <li>• Hover animations</li>
                <li>• Responsive design</li>
                <li>• Smooth transitions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Demo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Live Demo</h2>
          <p className="text-gray-600 mb-6">
            Explore the interactive pathway progress visualization with sample data:
          </p>
          
          <PathwayProgressVisualization
            pathways={mockCareerPathways}
          />
        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Technical Implementation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">📐 Component Architecture</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>ProgressRing:</strong> SVG-based circular progress with smooth animations</li>
                <li><strong>MilestoneTimeline:</strong> Course progress tracking with status indicators</li>
                <li><strong>SkillsProgress:</strong> Individual skill development with level badges</li>
                <li><strong>AchievementBadges:</strong> Dynamic achievement system based on progress</li>
                <li><strong>PathwayProgressCard:</strong> Expandable cards with detailed analytics</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">✨ Key Features</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>Dynamic Data:</strong> Real-time progress calculation and display</li>
                <li><strong>Smart Analytics:</strong> Engagement scoring and consistency tracking</li>
                <li><strong>Responsive Design:</strong> Mobile-first approach with adaptive layouts</li>
                <li><strong>Performance:</strong> Optimized rendering with useMemo and useState</li>
                <li><strong>Accessibility:</strong> ARIA labels and keyboard navigation support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Usage Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Basic Implementation:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import PathwayProgressVisualization from './PathwayProgressVisualization';

<PathwayProgressVisualization
  pathways={userPathways}
  className="mb-6"
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Integration with MyPathways:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Added to MyPathways.tsx after InterestAnalytics
{pathways.length > 0 && (
  <PathwayProgressVisualization
    pathways={pathways}
  />
)}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 