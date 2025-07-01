'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
      case 'published': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'review': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 
                    dark:from-[hsl(222,84%,4%)] dark:via-[hsl(222,84%,6%)] dark:to-[hsl(222,84%,8%)]">
      
      {/* Header Section */}
      <div className="relative pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          bg-indigo-100/80 text-indigo-700 text-sm font-medium mb-6
                          dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              <BookOpen className="w-4 h-4" />
              Internal Team Portal
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 
                          dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6">
              Course Creator
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Design, develop, and deploy world-class training programs for semiconductor, 
              manufacturing, and emerging technology careers.
            </p>
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
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-0 
                          bg-white/80 dark:bg-slate-800/50 
                          shadow-lg shadow-slate-200/50 dark:shadow-black/20
                          focus:ring-2 focus:ring-indigo-500/30 focus:shadow-xl
                          backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courseStats.map((stat, index) => (
            <Card key={index} className="border-0 bg-white/80 dark:bg-slate-800/50 
                                       shadow-lg shadow-slate-200/50 dark:shadow-black/20
                                       backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 
                                         bg-white/80 dark:bg-slate-800/50 
                                         shadow-lg shadow-slate-200/50 dark:shadow-black/20
                                         hover:shadow-xl hover:shadow-slate-300/50 dark:hover:shadow-black/30
                                         hover:scale-105 transition-all duration-300 cursor-pointer
                                         backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 
                                group-hover:opacity-10 transition-opacity duration-300`} />
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} 
                                  flex items-center justify-center mb-4 
                                  shadow-lg shadow-slate-300/30 dark:shadow-black/30
                                  group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 
                                      transition-colors duration-300">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mb-4">
                    {action.description}
                  </CardDescription>
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium
                                group-hover:translate-x-1 transition-transform duration-300">
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
            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
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
                  <div key={course.id} className="p-4 rounded-xl
                                                bg-slate-50/80 dark:bg-slate-700/30 
                                                hover:bg-slate-100/80 dark:hover:bg-slate-700/50
                                                transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 dark:text-slate-400">
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
                      <span className="text-xs text-slate-500 dark:text-slate-500">
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
            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
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

            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">Q1 Course Review</span>
                    <span className="text-orange-600">3 days</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    5 courses pending review
                  </p>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">New Module Launch</span>
                    <span className="text-blue-600">1 week</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
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