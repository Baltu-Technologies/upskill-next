'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import InterestAnalytics from '../../../src/components/career-exploration/InterestAnalytics';
import { mockCareerPathways, mockUserProfile } from '../../../src/data/mockCareerData';

export default function InterestAnalyticsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
            Task 13.3: Interest Analytics Demo
          </h1>
          <p className="text-gray-600">
            Enhanced display of captured interests with analytics, insights, and pathway alignment
          </p>
        </div>

        {/* Demo Component */}
        <div className="space-y-8">
          {/* Feature Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ Enhanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-700 mb-2">📊 Analytics View</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Visual distribution charts</li>
                  <li>• Interest rating breakdowns</li>
                  <li>• Interactive bar charts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-purple-700 mb-2">💡 Smart Insights</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Primary focus recommendations</li>
                  <li>• Pathway alignment analysis</li>
                  <li>• Interest diversity insights</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-green-700 mb-2">🎯 Enhanced Display</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Card-based interest layout</li>
                  <li>• Color-coded domains</li>
                  <li>• Expandable sections</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-orange-700 mb-2">🔗 Integration</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Pathway alignment matching</li>
                  <li>• Interest-based recommendations</li>
                  <li>• Historical tracking ready</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Live Demo */}
          <InterestAnalytics
            interests={mockUserProfile.capturedInterests}
            pathways={mockCareerPathways}
            onEditInterests={() => alert('Edit interests functionality would open the interest capture flow')}
          />

          {/* Implementation Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🛠️ Implementation Features</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Multi-View Interface</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Toggle between Summary, Analytics, and Insights views to explore interests from different perspectives.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm">
                    Summary: Card-based display with improved layout<br/>
                    Analytics: Visual charts showing rating distributions<br/>
                    Insights: AI-powered analysis of interest patterns
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Smart Analytics</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Automated analysis of interest patterns to provide actionable insights.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm">
                    • Primary focus identification<br/>
                    • Industry alignment recommendations<br/>
                    • Pathway compatibility scoring<br/>
                    • Interest diversity analysis
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Enhanced UX/UI</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Improved visual hierarchy and interaction patterns for better user experience.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm">
                    • Card-based layout with color coding<br/>
                    • Progressive disclosure with show more/less<br/>
                    • Interactive view switching<br/>
                    • Edit functionality integration
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Pathway Integration</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Deep integration with saved pathways to show alignment and recommendations.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm">
                    • Match interests to pathway requirements<br/>
                    • Show alignment percentage<br/>
                    • Highlight compatible pathways<br/>
                    • Generate smart recommendations
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🏗️ Technical Architecture</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-700 mb-2">Component Structure</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📁 InterestAnalytics (Main)</div>
                  <div className="ml-4">├── InterestDistributionChart</div>
                  <div className="ml-4">├── InterestInsights</div>
                  <div className="ml-4">└── View Toggle System</div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-purple-700 mb-2">Data Processing</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>🔄 Interest sorting & filtering</div>
                  <div>📊 Distribution calculations</div>
                  <div>🧠 Insight generation</div>
                  <div>🎯 Pathway matching logic</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">🚀 Ready for Integration</h2>
            <p className="text-blue-700 mb-4">
              The InterestAnalytics component is now fully integrated into the MyPathways profile and ready for production use.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">✅ Completed Features</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Enhanced visual display</li>
                  <li>• Multi-view interface</li>
                  <li>• Smart insights generation</li>
                  <li>• Pathway integration</li>
                  <li>• Edit functionality hooks</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">🔮 Future Extensions</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Interest history tracking</li>
                  <li>• Recommendation engine</li>
                  <li>• Social comparison features</li>
                  <li>• Skill gap analysis</li>
                  <li>• Career progress tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 