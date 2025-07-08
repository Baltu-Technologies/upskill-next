'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target,
  Calendar,
  BookOpen,
  Flame,
  Zap,
  Trophy,
  BarChart3,
  Star,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatsGoalsPage() {
  const [activeView, setActiveView] = useState<'overview' | 'goals' | 'achievements'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(142,71%,45%)] p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <Target className="h-8 w-8 text-[hsl(217,91%,60%)]" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Stats & Goals</h1>
              <p className="text-slate-600 dark:text-slate-300">Track your progress and achieve your learning objectives</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Learning Streak */}
            <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Learning Streak</p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">15</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">days in a row</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total XP */}
            <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total XP</p>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">1,825</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">experience points</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses Completed */}
            <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Courses Completed</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">12</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">total courses</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Score */}
            <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Average Score</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">87%</p>
                    <p className="text-xs text-green-600 dark:text-green-400">across assessments</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Goal Progress */}
            <Card className="border-l-4 border-l-[hsl(217,91%,60%)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[hsl(217,91%,60%)]" />
                  Weekly Learning Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    7.5 / 10 hours
                  </span>
                </div>
                <Progress value={75} className="h-3" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  2.5 hours remaining this week
                </p>
              </CardContent>
            </Card>

            {/* Monthly Goal Progress */}
            <Card className="border-l-4 border-l-[hsl(142,71%,45%)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[hsl(142,71%,45%)]" />
                  Monthly Learning Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    28 / 40 hours
                  </span>
                </div>
                <Progress value={70} className="h-3" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  12 hours remaining this month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 