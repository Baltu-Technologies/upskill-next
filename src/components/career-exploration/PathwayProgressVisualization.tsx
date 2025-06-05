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
  PauseCircle,
  Calendar,
  Trophy,
  Star,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  ChevronRight,
  ChevronDown,
  Filter
} from 'lucide-react';
import { CareerPathway } from '../../data/mockCareerData';

interface PathwayProgressVisualizationProps {
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
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
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
          <span className="text-lg font-bold text-gray-700">{Math.round(progress)}%</span>
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
      <h4 className="font-medium text-gray-700 flex items-center">
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
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className={`font-medium ${course.completed ? 'text-green-700' : 'text-gray-700'}`}>
                  {course.title}
                </h5>
                <span className="text-sm text-gray-500">{course.progress}%</span>
              </div>
              
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs text-gray-500">{course.provider}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{course.duration}</span>
                {course.completed && (
                  <>
                    <span className="text-xs text-gray-500">•</span>
                    <Award className="w-3 h-3 text-green-500" />
                  </>
                )}
              </div>
              
              {!course.completed && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
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
      
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
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
      <h4 className="font-medium text-gray-700 flex items-center">
        <Zap className="w-4 h-4 mr-2 text-yellow-600" />
        Skill Development
      </h4>
      
      <div className="space-y-3">
        {skillsWithProgress.map((skill) => (
          <div key={skill.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  skill.level === 'Advanced' ? 'bg-green-100 text-green-700' :
                  skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {skill.level}
                </span>
                <span className="text-sm text-gray-500">{Math.round(skill.progress)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
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
  const achievements = [];
  
  // Generate achievements based on progress
  if (pathway.overallProgress >= 10) achievements.push({ icon: <Star className="w-4 h-4" />, title: 'Getting Started', color: 'bg-blue-500' });
  if (pathway.overallProgress >= 25) achievements.push({ icon: <BookOpen className="w-4 h-4" />, title: 'Learning Path', color: 'bg-purple-500' });
  if (pathway.overallProgress >= 50) achievements.push({ icon: <Target className="w-4 h-4" />, title: 'Halfway Hero', color: 'bg-orange-500' });
  if (pathway.overallProgress >= 75) achievements.push({ icon: <TrendingUp className="w-4 h-4" />, title: 'Almost There', color: 'bg-green-500' });
  if (pathway.overallProgress >= 100) achievements.push({ icon: <Trophy className="w-4 h-4" />, title: 'Pathway Complete', color: 'bg-yellow-500' });
  
  const completedCourses = pathway.courses.filter(c => c.completed).length;
  if (completedCourses >= 3) achievements.push({ icon: <Award className="w-4 h-4" />, title: 'Course Master', color: 'bg-indigo-500' });

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 flex items-center">
        <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
        Achievements
      </h4>
      
      {achievements.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 ${achievement.color} rounded-full flex items-center justify-center text-white`}>
                {achievement.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">{achievement.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Trophy className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Complete courses to earn achievements</p>
        </div>
      )}
    </div>
  );
};

// Main Progress Card Component
const PathwayProgressCard: React.FC<{
  pathway: CareerPathway;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ pathway, isExpanded, onToggle }) => {
  const completedCourses = pathway.courses.filter(c => c.completed).length;
  const totalCourses = pathway.courses.length;
  const estimatedTimeRemaining = Math.round((100 - pathway.overallProgress) * 0.5); // weeks

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{pathway.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{pathway.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {estimatedTimeRemaining} weeks remaining
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {completedCourses}/{totalCourses} courses
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {pathway.estimatedDuration}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ProgressRing progress={pathway.overallProgress} size={80} />
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{Math.round(pathway.overallProgress)}%</div>
          <div className="text-xs text-blue-600">Complete</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedCourses}</div>
          <div className="text-xs text-green-600">Courses Done</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{pathway.requiredTechDomains.length}</div>
          <div className="text-xs text-purple-600">Skills Learning</div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <MilestoneTimeline courses={pathway.courses} pathwayProgress={pathway.overallProgress} />
              <AchievementBadges pathway={pathway} />
            </div>
            
            <div className="space-y-6">
              <SkillsProgress requiredTechDomains={pathway.requiredTechDomains} pathwayProgress={pathway.overallProgress} />
              
              {/* Progress Analytics */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-green-600" />
                  Progress Analytics
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Weekly Progress</span>
                      <span className="font-medium">+{Math.round(Math.random() * 5 + 2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full w-1/3" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Engagement Score</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Consistency</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
export const PathwayProgressVisualization: React.FC<PathwayProgressVisualizationProps> = ({ 
  pathways, 
  className = '' 
}) => {
  const [expandedPathways, setExpandedPathways] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'progress' | 'name' | 'priority'>('progress');

  const toggleExpanded = (pathwayId: string) => {
    const newExpanded = new Set(expandedPathways);
    if (newExpanded.has(pathwayId)) {
      newExpanded.delete(pathwayId);
    } else {
      newExpanded.add(pathwayId);
    }
    setExpandedPathways(newExpanded);
  };

  const sortedPathways = [...pathways].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.overallProgress - a.overallProgress;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const overallProgress = pathways.length > 0 
    ? Math.round(pathways.reduce((sum, p) => sum + p.overallProgress, 0) / pathways.length)
    : 0;

  if (pathways.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-12 text-center ${className}`}>
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Pathways</h3>
        <p className="text-gray-500">Start a career pathway to see your progress visualization.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Pathway Progress Overview
          </h2>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="progress">Sort by Progress</option>
              <option value="name">Sort by Name</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <ProgressRing progress={overallProgress} size={100} />
            <p className="text-sm text-gray-600 mt-2">Overall Progress</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{pathways.length}</div>
            <div className="text-sm text-blue-600">Active Pathways</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {pathways.reduce((sum, p) => sum + p.courses.filter(c => c.completed).length, 0)}
            </div>
            <div className="text-sm text-green-600">Courses Completed</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {pathways.filter(p => p.overallProgress >= 100).length}
            </div>
            <div className="text-sm text-purple-600">Pathways Complete</div>
          </div>
        </div>
      </div>

      {/* Individual Pathway Progress Cards */}
      <div className="space-y-4">
        {sortedPathways.map((pathway) => (
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

export default PathwayProgressVisualization; 