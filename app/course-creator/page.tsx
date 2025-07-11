'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  BookOpen, 
  Edit3, 
  BarChart3, 
  Users,
  Clock,
  Award,
  TrendingUp,
  FileText,
  Settings,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CourseCreatorPage() {
  const router = useRouter();

  // Mock data for demonstration
  const mockCourses = [
    {
      id: '1',
      title: 'Semiconductor Manufacturing Fundamentals',
      status: 'published',
      enrollments: 142,
      rating: 4.8,
      lastUpdated: '2024-01-15',
      lessons: 6,
      microlessons: 24
    },
    {
      id: '2',
      title: 'Clean Room Protocols and Safety',
      status: 'draft',
      enrollments: 0,
      rating: 0,
      lastUpdated: '2024-01-10',
      lessons: 3,
      microlessons: 12
    },
    {
      id: '3',
      title: 'Advanced Wafer Processing',
      status: 'review',
      enrollments: 0,
      rating: 0,
      lastUpdated: '2024-01-08',
      lessons: 8,
      microlessons: 32
    }
  ];

  const stats = {
    totalCourses: mockCourses.length,
    totalEnrollments: mockCourses.reduce((sum, course) => sum + course.enrollments, 0),
    averageRating: 4.6,
    activeLearners: 89
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-600/20 text-green-400 border-green-500/50';
      case 'review': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50';
      case 'draft': return 'bg-slate-600/20 text-slate-400 border-slate-500/50';
      default: return 'bg-slate-600/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Course Creator Dashboard</h1>
              <p className="text-slate-400 mt-1">Create and manage your educational content</p>
            </div>
            
            <Button
              onClick={() => router.push('/course-creator/create')}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Course
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Courses</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Enrollments</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEnrollments}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Average Rating</p>
                  <p className="text-2xl font-bold text-white">{stats.averageRating}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Learners</p>
                  <p className="text-2xl font-bold text-white">{stats.activeLearners}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-slate-700 bg-slate-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 border-slate-600 hover:border-blue-500 hover:bg-blue-500/10"
                  onClick={() => router.push('/course-creator/create')}
                >
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm font-medium">Create Course</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 border-slate-600 hover:border-green-500 hover:bg-green-500/10"
                  onClick={() => router.push('/course-creator/manage')}
                >
                  <div className="text-center">
                    <Settings className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-sm font-medium">Manage Courses</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 border-slate-600 hover:border-purple-500 hover:bg-purple-500/10"
                  onClick={() => router.push('/course-creator/analytics')}
                >
                  <div className="text-center">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-sm font-medium">View Analytics</div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Your Courses</CardTitle>
                <CardDescription>Manage and track your course content</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/course-creator/manage')}
                className="border-slate-600 text-slate-300"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border border-slate-600 rounded-lg hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{course.title}</h3>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {course.microlessons} microlessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrollments} enrolled
                        </span>
                        {course.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {course.rating}/5.0
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Updated {course.lastUpdated}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {mockCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Courses Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Get started by creating your first course. Our step-by-step wizard will guide you through the process.
                </p>
                <Button
                  onClick={() => router.push('/course-creator/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 