'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Trophy, Target, TrendingUp, Calendar, Award, BookOpen, Play, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { sampleCourse } from '@/data/microlesson/sampleConfig';
import { useRouter } from 'next/navigation';

export default function CourseProgressPage() {
  const router = useRouter();
  const course = sampleCourse;

  // Mock progress data
  const overallProgress = 45;
  const completedLessons = 1;
  const completedMicrolessons = 3;
  const totalMicrolessons = course.lessons.reduce((total, lesson) => total + lesson.microlessons.length, 0);
  const timeSpent = '12h 30m';
  const averageScore = 87;
  const streak = 5;

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first microlesson', earned: true, date: '2024-01-15' },
    { id: 2, title: 'Quick Learner', description: 'Complete 3 microlessons in one day', earned: true, date: '2024-01-16' },
    { id: 3, title: 'Knowledge Seeker', description: 'Maintain a 5-day learning streak', earned: true, date: '2024-01-20' },
    { id: 4, title: 'Lesson Master', description: 'Complete your first lesson with 100% score', earned: false },
    { id: 5, title: 'Course Conqueror', description: 'Complete the entire course', earned: false },
  ];

  const recentActivity = [
    { date: '2024-01-20', action: 'Completed', item: 'Introduction to Semiconductor Manufacturing', type: 'microlesson' },
    { date: '2024-01-20', action: 'Started', item: 'Manufacturing Process Deep Dive', type: 'lesson' },
    { date: '2024-01-19', action: 'Earned', item: 'Knowledge Seeker Achievement', type: 'achievement' },
    { date: '2024-01-18', action: 'Completed', item: 'Wafer Processing Fundamentals', type: 'microlesson' },
  ];

  const handleBackToCourse = () => {
    router.push('/courses/test');
  };

  const handleContinueLearning = () => {
    router.push('/courses/test/lessons');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToCourse}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Progress Report
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                {course.title}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Overall Progress</div>
              <div className="flex items-center gap-3">
                <Progress value={overallProgress} className="w-32" />
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {overallProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {completedLessons}/{course.lessons.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Lessons Completed
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Play className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {completedMicrolessons}/{totalMicrolessons}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    MicroLessons Done
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {timeSpent}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Time Spent
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {averageScore}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Average Score
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Lesson Progress */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Lesson Progress
              </h2>
              <div className="space-y-6">
                {course.lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {index === 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {lesson.title}
                        </h3>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {index === 0 ? 'Completed' : index === 1 ? 'In Progress' : 'Not Started'}
                        </Badge>
                      </div>
                      <Progress 
                        value={index === 0 ? 100 : index === 1 ? 35 : 0} 
                        className="h-2 mb-2" 
                      />
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span>{lesson.microlessons.length} MicroLessons</span>
                        <span>{lesson.duration}</span>
                        {index === 0 && <span className="text-green-600 dark:text-green-400">100% • Completed Jan 18</span>}
                        {index === 1 && <span className="text-blue-600 dark:text-blue-400">35% • Started Jan 19</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'microlesson' ? 'bg-blue-100 dark:bg-blue-900' :
                      activity.type === 'lesson' ? 'bg-green-100 dark:bg-green-900' :
                      'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      {activity.type === 'microlesson' ? (
                        <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : activity.type === 'lesson' ? (
                        <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-slate-900 dark:text-white font-medium">
                        {activity.action} {activity.item}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {activity.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Learning Streak */}
            <Card className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {streak} Days
                </div>
                <div className="text-slate-600 dark:text-slate-400 mb-4">
                  Learning Streak
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Keep it up! You're on fire 🔥
                </p>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.earned 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
                        : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.earned 
                        ? 'bg-yellow-100 dark:bg-yellow-900' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      <Trophy className={`w-4 h-4 ${
                        achievement.earned 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-slate-400 dark:text-slate-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${
                        achievement.earned 
                          ? 'text-slate-900 dark:text-white' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {achievement.description}
                      </div>
                      {achievement.earned && achievement.date && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          Earned {achievement.date}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleContinueLearning}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" className="w-full">
                  <Award className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
                <Button variant="outline" className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Set Learning Goals
                </Button>
              </div>
            </Card>

            {/* Next Milestone */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <Target className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Next Milestone
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  Complete 2 more lessons to unlock the Course Completion badge
                </p>
                <Progress value={33} className="h-2 mb-2" />
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  33% to next achievement
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 