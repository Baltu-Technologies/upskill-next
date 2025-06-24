'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Target, 
  BookOpen, 
  CheckCircle, 
  Circle,
  PlayCircle,
  Calendar,
  Trophy,
  Star,
  Zap,
  BarChart3,
  Activity,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { CareerPathway } from '../../src/data/mockCareerData';

interface ProfilePathwayProgressProps {
  pathways: CareerPathway[];
  className?: string;
}

// Progress Ring Component for circular progress display
const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showText?: boolean;
}> = ({ progress, size = 120, strokeWidth = 8, color = '#3B82F6', showText = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

// Milestone Timeline Component
const MilestoneTimeline: React.FC<{
  courses: CareerPathway['courses'];
  pathwayProgress: number;
}> = ({ courses, pathwayProgress }) => {
  const completedCourses = courses.filter(c => c.completed).length;
  const inProgressCourses = courses.filter(c => !c.completed && c.progress > 0).length;
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Target className="w-4 h-4 mr-2 text-blue-600" />
        Learning Milestones
      </h4>
      
      <div className="space-y-3">
        {courses.map((course, index) => (
          <div key={course.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {course.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : course.progress > 0 ? (
                <PlayCircle className="w-6 h-6 text-blue-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className={`font-medium ${course.completed ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {course.title}
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{course.progress}%</span>
              </div>
              
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{course.provider}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{course.duration}</span>
                {course.completed && (
                  <>
                    <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                    <Award className="w-3 h-3 text-green-500" />
                  </>
                )}
              </div>
              
              {!course.completed && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{completedCourses} of {courses.length} completed</span>
          <span>{inProgressCourses} in progress</span>
        </div>
      </div>
    </div>
  );
};

// Skills Progress Component
const SkillsProgress: React.FC<{
  requiredTechDomains: string[];
  pathwayProgress: number;
}> = ({ requiredTechDomains, pathwayProgress }) => {
  // Simulate skill progress based on pathway progress
  const skillsWithProgress = requiredTechDomains.map(skill => ({
    name: skill,
    progress: Math.min(100, pathwayProgress + Math.random() * 20 - 10),
    level: pathwayProgress > 80 ? 'Advanced' : pathwayProgress > 50 ? 'Intermediate' : 'Beginner'
  }));

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Zap className="w-4 h-4 mr-2 text-yellow-600" />
        Skill Development
      </h4>
      
      <div className="space-y-3">
        {skillsWithProgress.map((skill) => (
          <div key={skill.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  skill.level === 'Advanced' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                  skill.level === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {skill.level}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(skill.progress)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  skill.level === 'Advanced' ? 'bg-green-500' :
                  skill.level === 'Intermediate' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}
                style={{ width: `${skill.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Achievement Badges Component
const AchievementBadges: React.FC<{
  pathway: CareerPathway;
}> = ({ pathway }) => {
  const completedCourses = pathway.courses.filter(c => c.completed).length;
  const totalCourses = pathway.courses.length;
  
  const badges = [
    {
      id: 'course-starter',
      name: 'Course Starter',
      description: 'Started your first course',
      earned: completedCourses > 0,
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'halfway-hero',
      name: 'Halfway Hero',
      description: 'Completed 50% of courses',
      earned: (completedCourses / totalCourses) >= 0.5,
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'pathway-champion',
      name: 'Pathway Champion',
      description: 'Completed all courses',
      earned: completedCourses === totalCourses,
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: 'skill-builder',
      name: 'Skill Builder',
      description: 'Made significant progress',
      earned: pathway.overallProgress >= 75,
      icon: <Star className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Award className="w-4 h-4 mr-2 text-purple-600" />
        Achievement Badges
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3 rounded-lg border ${
              badge.earned
                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className={`flex items-center space-x-2 ${
              badge.earned ? 'text-purple-700 dark:text-purple-300' : 'text-gray-400 dark:text-gray-600'
            }`}>
              {badge.icon}
              <span className="text-sm font-medium">{badge.name}</span>
            </div>
            <p className={`text-xs mt-1 ${
              badge.earned ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-500'
            }`}>
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pathway Progress Card Component
const PathwayProgressCard: React.FC<{
  pathway: CareerPathway;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ pathway, isExpanded, onToggle }) => {
  const statusColors = {
    active: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    paused: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    completed: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
  };

  return (
    <div className="bg-white dark:bg-[#262626] rounded-lg border border-gray-200 dark:border-gray-600 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pathway.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[pathway.status]}`}>
              {pathway.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{pathway.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {pathway.estimatedDuration}
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {pathway.courses.length} courses
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {pathway.difficulty}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ProgressRing progress={pathway.overallProgress} size={80} />
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MilestoneTimeline courses={pathway.courses} pathwayProgress={pathway.overallProgress} />
            <SkillsProgress requiredTechDomains={pathway.requiredTechDomains} pathwayProgress={pathway.overallProgress} />
          </div>
          <AchievementBadges pathway={pathway} />
        </div>
      )}
    </div>
  );
};

// Main component
export const ProfilePathwayProgress: React.FC<ProfilePathwayProgressProps> = ({ 
  pathways, 
  className = '' 
}) => {
  const [expandedPathways, setExpandedPathways] = useState<Set<string>>(new Set());
  
  const toggleExpanded = (pathwayId: string) => {
    setExpandedPathways(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pathwayId)) {
        newSet.delete(pathwayId);
      } else {
        newSet.add(pathwayId);
      }
      return newSet;
    });
  };

  const activePathways = pathways.filter(p => p.status === 'active');
  const completedPathways = pathways.filter(p => p.status === 'completed');
  const pausedPathways = pathways.filter(p => p.status === 'paused');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#262626] p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activePathways.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#262626] p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedPathways.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#262626] p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pausedPathways.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Paused</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#262626] p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(pathways.reduce((acc, p) => acc + p.overallProgress, 0) / pathways.length) || 0}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Cards */}
      <div className="space-y-4">
        {pathways.map((pathway) => (
          <PathwayProgressCard
            key={pathway.id}
            pathway={pathway}
            isExpanded={expandedPathways.has(pathway.id)}
            onToggle={() => toggleExpanded(pathway.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePathwayProgress; 