'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target,
  CheckCircle,
  Clock,
  Briefcase,
  Award,
  User,
  BookOpen,
  Play,
  TrendingUp,
  Calendar,
  Star,
  Trophy,
  Zap,
  Activity,
  MapPin,
  Building2,
  FileText,
  ArrowRight,
  ChevronRight,
  Flame,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Mock data - in a real app, this would come from your backend
const mockDashboardData = {
  user: {
    name: "Peter Costa",
    firstName: "Peter",
    level: 42,
    title: "Fiber Technician Apprentice",
    avatar: "/media/Peter_Costa_Bio_2024.jpg" // Using the actual bio image
  },
  recentActivity: {
    lastAction: "Completed Fiber Splicing Module",
    timeAgo: "2 hours ago",
    actionsToday: 5,
    dayStreak: 12
  },
  courseInProgress: {
    title: "Advanced Fiber Optic Installation",
    progress: 68,
    currentModule: 3,
    totalLessons: 24,
    completedLessons: 16,
    lessonsRemaining: 8,
    nextLesson: "Fusion Splicing Techniques"
  },
  jobOpportunities: {
    newMatches: 3,
    totalMatches: 18,
    topMatch: {
      title: "Senior Fiber Technician",
      company: "TechCorp Solutions",
      matchPercentage: 92,
      location: "Boston, MA"
    }
  },
  certifications: {
    earned: 4,
    inProgress: 2,
    available: 12,
    nextCertification: "FOA CFOT Certification",
    nextProgress: 75,
    recentCert: "Fiber Optic Safety"
  },
  profileCompletion: {
    percentage: 78,
    missingFields: [
      "Professional Experience",
      "Skills Assessment",
      "Portfolio Projects",
      "References"
    ]
  },
  careerPathway: {
    currentPathway: "Fiber Optic Technician Track",
    currentPath: "Fiber Optic Technician Track",
    currentStep: 3,
    totalSteps: 5,
    completionPercentage: 68,
    overallProgress: 68,
    estimatedCompletion: "2 months remaining",
    currentPhase: "Advanced Installation",
    nextMilestone: "Certification Exam"
  }
};

export default function LearnerDashboard() {
  const data = mockDashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Welcome Section - More space and better positioning */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
              <div className="w-full h-full rounded-xl overflow-hidden">
                <Image 
                  src={data.user.avatar} 
                  alt="Peter Costa" 
                  width={80} 
                  height={80} 
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>
            </div>
            
            {/* Welcome Text */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                Welcome, {data.user.firstName}!
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  {data.user.title}
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold">
                    Level {data.user.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics Grid - Smaller, more compact boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          
          {/* Recent Activity Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  Recent Activity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.recentActivity.lastAction}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {data.recentActivity.timeAgo}
                </p>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  Actions today: <span className="font-semibold text-green-600">{data.recentActivity.actionsToday}</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Streak: <span className="font-semibold text-orange-600">{data.recentActivity.dayStreak} days</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Course In Progress Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Course In Progress
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.courseInProgress.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Module {data.courseInProgress.currentModule}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-blue-600">{data.courseInProgress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.courseInProgress.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {data.courseInProgress.lessonsRemaining} lessons remaining
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Job Opportunities Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-purple-500" />
                  Job Opportunities
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-purple-600">{data.jobOpportunities.newMatches}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">New Matches</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data.jobOpportunities.totalMatches}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Matches</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Top Match</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{data.jobOpportunities.topMatch.title}</p>
                <p className="text-xs text-purple-600 font-semibold">{data.jobOpportunities.topMatch.matchPercentage}% Match</p>
              </div>
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-orange-500" />
                  Certifications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-orange-600">{data.certifications.earned}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Earned</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data.certifications.inProgress}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Next Certification</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{data.certifications.nextCertification}</p>
                <p className="text-xs text-orange-600 font-semibold">{data.certifications.nextProgress}% Complete</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-red-500" />
                  Profile Completion
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600 mb-1">{data.profileCompletion.percentage}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.profileCompletion.percentage}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">Missing fields:</p>
                {data.profileCompletion.missingFields.slice(0, 2).map((field, index) => (
                  <p key={index} className="text-xs text-gray-500 dark:text-gray-400">• {field}</p>
                ))}
                {data.profileCompletion.missingFields.length > 2 && (
                  <p className="text-xs text-gray-400">+{data.profileCompletion.missingFields.length - 2} more</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Career Pathway Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-indigo-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-500" />
                  Career Pathway
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.careerPathway.currentPathway}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Step {data.careerPathway.currentStep} of {data.careerPathway.totalSteps}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-indigo-600">{data.careerPathway.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.careerPathway.completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {data.careerPathway.estimatedCompletion}
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
} 