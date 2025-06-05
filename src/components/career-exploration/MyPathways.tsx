'use client';

import React, { useState } from 'react';
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Calendar,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  MoreHorizontal,
  Edit3,
  Trash2,
  Target,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  CareerPathway, 
  UserProfile
} from '../../data/mockCareerData';
import { useUserPathways, useUserProfile } from '../../hooks/usePathways';
import InterestAnalytics from './InterestAnalytics';
import PathwayProgressVisualization from './PathwayProgressVisualization';
import PathwayManagement from './PathwayManagement';

interface MyPathwaysProps {
  className?: string;
}

// Helper function to get emoji for rating
const getEmojiForRating = (rating: number): string => {
  switch (rating) {
    case 1: return '👎';
    case 2: return '😐';
    case 3: return '👍';
    case 4: return '❤️';
    default: return '😐';
  }
};

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-64"></div>
            <div className="h-6 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
      
      {/* Achievement cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-8 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
      
      {/* Pathways skeleton */}
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="bg-white rounded-lg border border-red-200 p-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Profile</h3>
      <p className="text-gray-500 mb-6">{error}</p>
      <button 
        onClick={onRetry}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  </div>
);

// Achievement Card Component
const AchievementCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle?: string;
  color: string;
}> = ({ icon, title, value, subtitle, color }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start space-x-4">
      <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);



// Progress Bar Component
const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ progress, className = '', size = 'md' }) => {
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full ${heights[size]} ${className}`}>
      <div 
        className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

// Course Item Component
const CourseItem: React.FC<{
  course: CareerPathway['courses'][0];
  isExpanded: boolean;
}> = ({ course, isExpanded }) => (
  <div className={`border border-gray-200 rounded-lg p-4 ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h5 className="font-medium text-gray-900">{course.title}</h5>
          {course.completed && (
            <div className="flex items-center text-green-600">
              <Award className="w-4 h-4" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{course.provider} • {course.duration}</p>
        <div className="flex items-center space-x-4 mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            course.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
            course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {course.difficulty}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <ProgressBar progress={course.progress} size="sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Pathway Card Component
const PathwayCard: React.FC<{
  pathway: CareerPathway;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (pathwayId: string, status: string) => void;
  onDelete: (pathwayId: string) => void;
  actionLoading?: boolean;
}> = ({ pathway, isExpanded, onToggleExpand, onStatusChange, onDelete, actionLoading = false }) => {
  const [showActions, setShowActions] = useState(false);

  const statusColors: Record<CareerPathway['status'], string> = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700'
  };

  const priorityColors: Record<CareerPathway['priority'], string> = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-gray-500'
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${priorityColors[pathway.priority]} p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{pathway.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[pathway.status]}`}>
              {pathway.status.charAt(0).toUpperCase() + pathway.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{pathway.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Target Role:</span>
              <p className="font-medium text-gray-900">{pathway.targetRole}</p>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <p className="font-medium text-gray-900">{pathway.estimatedDuration}</p>
            </div>
            <div>
              <span className="text-gray-500">Salary Range:</span>
              <p className="font-medium text-gray-900">
                ${pathway.salary.min.toLocaleString()} - ${pathway.salary.max.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onStatusChange(pathway.id, pathway.status === 'active' ? 'paused' : 'active');
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  {pathway.status === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {pathway.status === 'active' ? 'Pause Pathway' : 'Resume Pathway'}
                </button>
                <button
                  onClick={() => {
                    // Could open edit modal
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Pathway
                </button>
                <button
                  onClick={() => {
                    onDelete(pathway.id);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Pathway
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">{pathway.overallProgress}% ({pathway.completedCourses}/{pathway.totalCourses} courses)</span>
        </div>
        <ProgressBar progress={pathway.overallProgress} />
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-center py-2 text-sm text-blue-600 hover:text-blue-700 border-t border-gray-100"
      >
        {isExpanded ? 'Hide Course Details' : 'Show Course Details'}
        {isExpanded ? 
          <ChevronUp className="w-4 h-4 ml-1" /> : 
          <ChevronDown className="w-4 h-4 ml-1" />
        }
      </button>

      {/* Expanded Course Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">Course Progress</h4>
          {pathway.courses.map((course: CareerPathway['courses'][0]) => (
            <CourseItem key={course.id} course={course} isExpanded={isExpanded} />
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
            <div>
              <span className="text-gray-500">Required Tech Domains:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {pathway.requiredTechDomains.map((domain: string) => (
                  <span key={domain} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Relevant Industries:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {pathway.relevantIndustries.map((industry: string) => (
                  <span key={industry} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
export const MyPathways: React.FC<MyPathwaysProps> = ({ className = '' }) => {
  // Use custom hooks for dynamic data
  const { 
    pathways, 
    loading: pathwaysLoading, 
    error: pathwaysError,
    refreshing,
    actions,
    updatePathwayStatus,
    removePathway,
    updateCourseProgress,
    refresh: refreshPathways,
    clearActionError
  } = useUserPathways();
  
  const {
    profile: userProfile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();

  const [expandedPathways, setExpandedPathways] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');

  // Loading state
  if (pathwaysLoading || profileLoading) {
    return <LoadingState />;
  }

  // Error state
  if (pathwaysError || profileError || !userProfile) {
    return <ErrorState 
      error={pathwaysError || profileError || 'Failed to load profile'} 
      onRetry={() => {
        refreshPathways();
      }}
    />;
  }

  const handleTogglePathway = (pathwayId: string) => {
    const newExpanded = new Set(expandedPathways);
    if (newExpanded.has(pathwayId)) {
      newExpanded.delete(pathwayId);
    } else {
      newExpanded.add(pathwayId);
    }
    setExpandedPathways(newExpanded);
  };

  const handleStatusChange = async (pathwayId: string, status: string) => {
    await updatePathwayStatus(pathwayId, status as CareerPathway['status']);
  };

  const handleDeletePathway = async (pathwayId: string) => {
    await removePathway(pathwayId);
  };

  const activePathways = pathways.filter(p => p.status === 'active');
  const pausedPathways = pathways.filter(p => p.status === 'paused');

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-gray-600">{userProfile.email}</p>
              {userProfile.selectedPersona && (
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mt-2">
                  {userProfile.selectedPersona}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={refreshPathways}
            disabled={refreshing}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {/* Action Error Display */}
        {actions.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{actions.error}</span>
            </div>
            <button
              onClick={clearActionError}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 Overview & Progress
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'manage'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚙️ Manage Pathways
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AchievementCard
          icon={<Award className="w-6 h-6" />}
          title="Courses Completed"
          value={userProfile.achievements.coursesCompleted}
          color="bg-green-500"
        />
        <AchievementCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Pathways in Progress"
          value={userProfile.achievements.pathwaysInProgress}
          color="bg-blue-500"
        />
        <AchievementCard
          icon={<Clock className="w-6 h-6" />}
          title="Learning Hours"
          value={userProfile.achievements.totalLearningHours}
          subtitle="Total time invested"
          color="bg-purple-500"
        />
      </div>

      {/* Enhanced Interests Analytics */}
      <InterestAnalytics
        interests={userProfile.capturedInterests}
        pathways={pathways}
      />

      {/* Pathway Progress Visualization */}
      {pathways.length > 0 && (
        <PathwayProgressVisualization
          pathways={pathways}
        />
      )}

      {/* Active Pathways */}
      {activePathways.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600" />
            Active Pathways ({activePathways.length})
          </h2>
          <div className="space-y-4">
            {activePathways.map((pathway) => (
              <PathwayCard
                key={pathway.id}
                pathway={pathway}
                isExpanded={expandedPathways.has(pathway.id)}
                onToggleExpand={() => handleTogglePathway(pathway.id)}
                onStatusChange={handleStatusChange}
                onDelete={handleDeletePathway}
                actionLoading={actions.updatingStatus || actions.removing}
              />
            ))}
          </div>
        </div>
      )}

      {/* Paused Pathways */}
      {pausedPathways.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Pause className="w-5 h-5 mr-2 text-yellow-600" />
            Paused Pathways ({pausedPathways.length})
          </h2>
          <div className="space-y-4">
            {pausedPathways.map((pathway) => (
              <PathwayCard
                key={pathway.id}
                pathway={pathway}
                isExpanded={expandedPathways.has(pathway.id)}
                onToggleExpand={() => handleTogglePathway(pathway.id)}
                onStatusChange={handleStatusChange}
                onDelete={handleDeletePathway}
                actionLoading={actions.updatingStatus || actions.removing}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pathways.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Pathways</h3>
          <p className="text-gray-500 mb-6">
            Start your career journey by exploring and saving pathways that match your interests.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Explore Career Pathways
          </button>
        </div>
      )}
        </div>
      )}

      {/* Management Tab */}
      {activeTab === 'manage' && (
        <PathwayManagement
          pathways={pathways}
          onUpdatePathway={async (pathwayId: string, updates: Partial<CareerPathway>) => {
            await updatePathwayStatus(pathwayId, updates.status || 'active');
            // Additional updates can be handled here
          }}
          onRemovePathway={async (pathwayId: string) => {
            await removePathway(pathwayId);
          }}
          onReorderPathways={async (reorderedIds: string[]) => {
            // Implementation for reordering pathways
            console.log('Reordering pathways:', reorderedIds);
          }}
        />
      )}
    </div>
  );
};

export default MyPathways; 