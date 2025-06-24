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
    title: "Advanced Fiber Optics Installation",
    progress: 68,
    totalLessons: 24,
    completedLessons: 16,
    nextLesson: "Fusion Splicing Techniques"
  },
  jobOpportunities: {
    newMatches: 3,
    totalMatches: 47,
    topMatch: {
      company: "Verizon",
      position: "Fiber Technician",
      matchPercentage: 94,
      location: "Boston, MA"
    }
  },
  certifications: {
    earned: 8,
    inProgress: 2,
    available: 15,
    recentCert: "FOA CFOT Certification"
  },
  profileCompletion: {
    percentage: 85,
    missingFields: ["Portfolio Projects", "References", "Skills Assessment"]
  },
  careerPathway: {
    currentPath: "Fiber Optic Technician",
    overallProgress: 72,
    currentPhase: "Advanced Installation",
    nextMilestone: "Certification Exam"
  }
};

export default function LearnerDashboard() {
  const [data] = useState(mockDashboardData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
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
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
            {data.user.level}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Welcome, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{data.user.firstName}!</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg mt-1">{data.user.title}</p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{data.recentActivity.lastAction}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{data.recentActivity.timeAgo}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Actions Today:</span>
              <span className="font-semibold text-green-600">{data.recentActivity.actionsToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Day Streak:</span>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-semibold text-orange-600">{data.recentActivity.dayStreak}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course In Progress */}
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Course In Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white line-clamp-2">{data.courseInProgress.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {data.courseInProgress.completedLessons} of {data.courseInProgress.totalLessons} lessons
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Progress</span>
                <span className="font-semibold text-blue-600">{data.courseInProgress.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.courseInProgress.progress}%` }}
                />
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">Next: {data.courseInProgress.nextLesson}</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mt-1">
                Continue Learning <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Job Opportunities */}
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Job Opportunities</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">{data.jobOpportunities.newMatches}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">New Matches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{data.jobOpportunities.totalMatches}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Matches</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{data.jobOpportunities.topMatch.position}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{data.jobOpportunities.topMatch.company}</p>
                </div>
                <div className="text-right">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {data.jobOpportunities.topMatch.matchPercentage}% Match
                  </span>
                </div>
              </div>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 mt-2">
                View All Jobs <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Certifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-yellow-600">{data.certifications.earned}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Earned</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-600">{data.certifications.inProgress}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-500">{data.certifications.available}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">Latest: {data.certifications.recentCert}</p>
              <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1 mt-1">
                View All Certs <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Profile Completion</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${data.profileCompletion.percentage}, 100`}
                    className="text-orange-500"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-200 dark:text-slate-700"
                  />
                </svg>
                <span className="absolute text-xl font-bold text-orange-600">{data.profileCompletion.percentage}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Missing:</p>
              <div className="space-y-1">
                {data.profileCompletion.missingFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-500 dark:text-slate-400">{field}</span>
                  </div>
                ))}
              </div>
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1 mt-2">
                Complete Profile <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Career Pathway Progress */}
        <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Career Pathway</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">{data.careerPathway.currentPath}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Current Phase: {data.careerPathway.currentPhase}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Overall Progress</span>
                <span className="font-semibold text-indigo-600">{data.careerPathway.overallProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.careerPathway.overallProgress}%` }}
                />
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">Next: {data.careerPathway.nextMilestone}</p>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 mt-1">
                View Pathway <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
} 