'use client';

import { useState } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Search,
  Users,
  PlayCircle,
  FileText,
  Settings,
  BarChart3,
  Clock,
  Star,
  ChevronRight,
  Zap,
  Eye,
  Copy,
  Trash2,
  Calendar,
  Award
} from 'lucide-react';

export default function CourseCreatorPage() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const quickActions = [
    {
      title: 'Create New Course',
      description: 'Build a new course from scratch with our course builder',
      icon: Plus,
      color: 'from-blue-600 to-indigo-600',
      href: '/course-creator/create'
    },
    {
      title: 'Manage Existing Courses',
      description: 'Edit, update, and maintain your published courses',
      icon: Edit3,
      color: 'from-purple-600 to-pink-600', 
      href: '/course-creator/manage'
    },
    {
      title: 'Course Analytics',
      description: 'View performance metrics and learner engagement data',
      icon: BarChart3,
      color: 'from-green-600 to-teal-600',
      href: '/course-creator/analytics'
    },
    {
      title: 'Content Library',
      description: 'Access shared resources, templates, and media assets',
      icon: FileText,
      color: 'from-orange-600 to-red-600',
      href: '/course-creator/library'
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'Semiconductor Manufacturing Basics',
      status: 'published',
      learners: 156,
      rating: 4.8,
      lastUpdated: '2 hours ago',
      duration: '6 weeks',
      modules: 12
    },
    {
      id: 2,
      title: 'Advanced CNC Programming',
      status: 'draft',
      learners: 0,
      rating: 0,
      lastUpdated: '1 day ago',
      duration: '8 weeks',
      modules: 15
    },
    {
      id: 3,
      title: 'Fiber Optic Installation',
      status: 'published',
      learners: 89,
      rating: 4.6,
      lastUpdated: '3 days ago',
      duration: '4 weeks',
      modules: 8
    },
    {
      id: 4,
      title: 'Solar Panel Systems',
      status: 'review',
      learners: 0,
      rating: 0,
      lastUpdated: '5 days ago',
      duration: '5 weeks',
      modules: 10
    }
  ];

  const courseStats = [
    {
      label: 'Total Courses',
      value: '24',
      change: '+3',
      trend: 'up'
    },
    {
      label: 'Active Learners',
      value: '1,247',
      change: '+89',
      trend: 'up'
    },
    {
      label: 'Completion Rate',
      value: '87%',
      change: '+5%',
      trend: 'up'
    },
    {
      label: 'Avg Rating',
      value: '4.7',
      change: '+0.2',
      trend: 'up'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
      case 'draft': return isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
      case 'review': return isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700';
      default: return isDark ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="relative mb-12 overflow-hidden">
          {/* Background with gradient and glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-blue-900/30 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/30 rounded-2xl" />
          
          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/25">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop&crop=center"
                  alt="Course Creation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/80 to-purple-600/80" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-transparent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
              Course Creator Portal
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Design engaging learning experiences with 
              <span className="text-indigo-400 font-semibold"> Industry Tools</span>, manage
              <span className="text-purple-400 font-semibold"> Content Libraries</span>, and track
              <span className="text-blue-400 font-semibold"> Learner Progress</span> with our comprehensive platform
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses, modules, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-2xl border-0 bg-slate-800/50 shadow-lg shadow-black/20 focus:ring-2 focus:ring-indigo-500/30 focus:shadow-xl backdrop-blur-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courseStats.map((stat, index) => (
            <Card key={index} className="border-0 bg-slate-800/50 shadow-lg shadow-black/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1 text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick Actions Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-slate-800/50 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 
                                group-hover:opacity-10 transition-opacity duration-300`} />
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} 
                                  flex items-center justify-center mb-4 
                                  shadow-lg shadow-black/30
                                  group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg transition-colors duration-300 group-hover:text-indigo-400">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-slate-400">
                    {action.description}
                  </CardDescription>
                  <div className="flex items-center font-medium group-hover:translate-x-1 transition-transform duration-300 text-indigo-400">
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-slate-800/50 shadow-lg shadow-black/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Recent Courses
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">
                          {course.title}
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(course.status)}`}>
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.learners} learners
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.modules} modules
                      </div>
                      {course.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-500">
                        Updated {course.lastUpdated}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Tools */}
          <div className="space-y-6">
            <Card className="border-0 bg-slate-800/50 shadow-lg shadow-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Quick Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 
                                hover:from-blue-700 hover:to-indigo-700 
                                text-white border-0 shadow-lg hover:shadow-xl
                                transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Course Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Last Course
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Import Content
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Bulk Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-slate-800/50 shadow-lg shadow-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-white">Q1 Course Review</span>
                    <span className="text-orange-600">3 days</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    5 courses pending review
                  </p>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-white">New Module Launch</span>
                    <span className="text-blue-600">1 week</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Advanced Manufacturing series
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 