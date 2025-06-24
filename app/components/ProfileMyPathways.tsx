'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  Pause,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Settings,
  X,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Play,
  Trash2
} from 'lucide-react';
import { 
  CareerPathway, 
  UserProfile
} from '../../src/data/mockCareerData';
import { useUserPathways, useUserProfile } from '../../src/hooks/usePathways';
import ProfileInterestAnalytics from './ProfileInterestAnalytics';
import ProfilePathwayProgress from './ProfilePathwayProgress';
import PathwayManagement from '../../src/components/career-exploration/PathwayManagement';

interface ProfileMyPathwaysProps {
  className?: string;
}

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="animate-pulse space-y-6">
    {/* Achievement cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[#262626] rounded-lg border border-[#3a8fb7]/30 p-6">
          <div className="h-8 bg-gray-600 rounded w-24 mb-2"></div>
          <div className="h-6 bg-gray-600 rounded w-16"></div>
        </div>
      ))}
    </div>
    
    {/* Pathways skeleton */}
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-[#262626] rounded-lg border border-[#3a8fb7]/30 p-6">
          <div className="h-6 bg-gray-600 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

// Error State Component
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="bg-[#262626] rounded-lg border border-red-500/30 p-12 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-white mb-2">Unable to Load Pathways</h3>
    <p className="text-gray-400 mb-6">{error}</p>
    <button 
      onClick={onRetry}
      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center mx-auto"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </button>
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
  <div className="bg-[#262626] rounded-lg border border-[#3a8fb7]/30 p-6 hover:border-[#3a8fb7]/50 hover:shadow-lg transition-all duration-200">
    <div className="flex items-start space-x-4">
      <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
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
    <div className={`w-full bg-gray-700 rounded-full ${heights[size]} ${className}`}>
      <div 
        className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] h-full rounded-full transition-all duration-300 ease-out"
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
  <div className={`border border-[#3a8fb7]/30 rounded-lg p-4 ${
    isExpanded ? 'bg-[#1e1e1e] border-[#3a8fb7]/50' : 'bg-[#262626]'
  }`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h5 className="font-medium text-white">{course.title}</h5>
          {course.completed && (
            <div className="flex items-center text-green-400">
              <Award className="w-4 h-4" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">{course.provider} • {course.duration}</p>
        <div className="flex items-center space-x-4 mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            course.difficulty === 'Beginner' ? 'bg-green-900/50 text-green-300 border border-green-500/30' :
            course.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
            'bg-red-900/50 text-red-300 border border-red-500/30'
          }`}>
            {course.difficulty}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium text-white">{course.progress}%</span>
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
    active: 'bg-green-900/50 text-green-300 border border-green-500/30',
    paused: 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30',
    completed: 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
  };

  return (
    <div className="bg-[#262626] rounded-lg border border-[#3a8fb7]/30 p-6 hover:border-[#3a8fb7]/50 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{pathway.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[pathway.status]}`}>
              {pathway.status.charAt(0).toUpperCase() + pathway.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-400 mb-3">{pathway.description}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400 mb-3">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {pathway.estimatedDuration}
            </span>
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {pathway.courses.length} courses
            </span>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">Overall Progress</span>
              <span className="font-medium text-white">{pathway.overallProgress}%</span>
            </div>
            <ProgressBar progress={pathway.overallProgress} />
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onToggleExpand}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#3a8fb7]/20 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#3a8fb7]/20 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-[#1e1e1e] border border-[#3a8fb7]/30 rounded-lg shadow-lg z-10">
                <div className="p-1">
                  <button
                    onClick={() => {
                      onStatusChange(pathway.id, pathway.status === 'active' ? 'paused' : 'active');
                      setShowActions(false);
                    }}
                    disabled={actionLoading}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#3a8fb7]/20 hover:text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {pathway.status === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {pathway.status === 'active' ? 'Pause Pathway' : 'Resume Pathway'}
                  </button>
                  
                  <button
                    onClick={() => {
                      onDelete(pathway.id);
                      setShowActions(false);
                    }}
                    disabled={actionLoading}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Pathway
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-4 border-t border-[#3a8fb7]/30">
          <h4 className="font-medium text-white">Courses ({pathway.courses.length})</h4>
          {pathway.courses.map((course, index) => (
            <CourseItem key={index} course={course} isExpanded={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ProfileMyPathways: React.FC<ProfileMyPathwaysProps> = ({ className = '' }) => {
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
    <div className={`space-y-6 ${className}`}>
      {/* Action Error Display */}
      {actions.error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm text-red-400">{actions.error}</span>
          </div>
          <button
            onClick={clearActionError}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-[#1e1e1e] rounded-lg border border-[#3a8fb7] p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-[#3a8fb7]/20'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Progress</span>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-[#3a8fb7]/20'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Manage Pathways</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AchievementCard
              icon={<Award className="w-6 h-6" />}
              title="Courses Completed"
              value={userProfile.achievements.coursesCompleted}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <AchievementCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Pathways in Progress"
              value={userProfile.achievements.pathwaysInProgress}
              color="bg-gradient-to-br from-[#3a8fb7] to-[#6c3e9e]"
            />
            <AchievementCard
              icon={<Clock className="w-6 h-6" />}
              title="Learning Hours"
              value={userProfile.achievements.totalLearningHours}
              subtitle="Total time invested"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>

          {/* Enhanced Interests Analytics */}
          <ProfileInterestAnalytics
            interests={userProfile.capturedInterests}
            pathways={pathways}
          />

          {/* Pathway Progress Visualization */}
          {pathways.length > 0 && (
            <ProfilePathwayProgress
              pathways={pathways}
            />
          )}

          {/* Active Pathways */}
          {activePathways.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-400" />
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
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Pause className="w-5 h-5 mr-2 text-yellow-400" />
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
            <div className="bg-[#262626] rounded-lg border border-[#3a8fb7]/30 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Saved Pathways</h3>
              <p className="text-gray-400 mb-6">
                Start your career journey by exploring and saving pathways that match your interests.
              </p>
              <button className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Explore Career Pathways
              </button>
            </div>
          )}
        </div>
      )}

      {/* Management Tab */}
      {activeTab === 'manage' && (
        <div className="animate-fade-in">
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
        </div>
      )}
    </div>
  );
};

export default ProfileMyPathways; 