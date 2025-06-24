'use client';

import React, { useState, useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Star,
  Edit3,
  Lightbulb,
  ThumbsDown,
  Meh,
  ThumbsUp,
  Heart
} from 'lucide-react';
import { UserProfile, CareerPathway } from '../../src/data/mockCareerData';

interface ProfileInterestAnalyticsProps {
  interests: UserProfile['capturedInterests'];
  pathways?: CareerPathway[];
  onEditInterests?: () => void;
  className?: string;
}

// Helper function to get icon for rating
const getIconForRating = (rating: number): React.ReactNode => {
  switch (rating) {
    case 1: return <ThumbsDown className="w-4 h-4 text-red-500" />;
    case 2: return <Meh className="w-4 h-4 text-yellow-500" />;
    case 3: return <ThumbsUp className="w-4 h-4 text-blue-500" />;
    case 4: return <Heart className="w-4 h-4 text-red-500" />;
    default: return <Meh className="w-4 h-4 text-gray-500" />;
  }
};

// Helper function to get text for rating
const getTextForRating = (rating: number): string => {
  switch (rating) {
    case 1: return 'Not Interested';
    case 2: return 'Neutral';
    case 3: return 'Interested';
    case 4: return 'Very Interested';
    default: return 'Neutral';
  }
};

// Main component
export const ProfileInterestAnalytics: React.FC<ProfileInterestAnalyticsProps> = ({ 
  interests, 
  pathways = [], 
  onEditInterests,
  className = '' 
}) => {
  const [activeView, setActiveView] = useState<'summary' | 'analytics'>('summary');
  
  const techInterests = Object.entries(interests.techDomains)
    .sort(([,a], [,b]) => (b as number) - (a as number)) as [string, number][];
    
  const industryInterests = Object.entries(interests.industryDomains)
    .sort(([,a], [,b]) => (b as number) - (a as number)) as [string, number][];
  
  const lastUpdated = new Date(interests.capturedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const totalInterests = techInterests.length + industryInterests.length;
  const highInterests = [...techInterests, ...industryInterests].filter(([, rating]) => rating >= 3).length;
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Career Interest Analytics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last updated: {lastUpdated}
          </p>
        </div>
        {onEditInterests && (
          <button
            onClick={onEditInterests}
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit Interests
          </button>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#262626] p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInterests}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Interests</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#262626] p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{highInterests}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">High Interest</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#262626] p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pathways.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Saved Pathways</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {['summary', 'analytics'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === view
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="bg-white dark:bg-[#262626] rounded-lg border border-gray-200 dark:border-gray-600 p-6">
        {activeView === 'summary' && (
          <div className="space-y-6">
            {/* Top Interests */}
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Top Technology Interests
              </h4>
              <div className="space-y-2">
                {techInterests.slice(0, 5).map(([domain, rating]) => (
                  <div key={domain} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{domain}</span>
                    <div className="flex items-center space-x-2">
                      {getIconForRating(rating)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">{getTextForRating(rating)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Top Industry Interests
              </h4>
              <div className="space-y-2">
                {industryInterests.slice(0, 5).map(([domain, rating]) => (
                  <div key={domain} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{domain}</span>
                    <div className="flex items-center space-x-2">
                      {getIconForRating(rating)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">{getTextForRating(rating)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Technology Interest Levels
              </h4>
              <div className="space-y-2">
                {techInterests.map(([domain, rating]) => (
                  <div key={domain} className="flex items-center space-x-3">
                    <div className="flex items-center w-32 text-xs text-gray-600 dark:text-gray-400">
                      <span className="truncate">{domain}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(rating / 4) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getIconForRating(rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Industry Interest Levels
              </h4>
              <div className="space-y-2">
                {industryInterests.map(([domain, rating]) => (
                  <div key={domain} className="flex items-center space-x-3">
                    <div className="flex items-center w-32 text-xs text-gray-600 dark:text-gray-400">
                      <span className="truncate">{domain}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${(rating / 4) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getIconForRating(rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInterestAnalytics; 