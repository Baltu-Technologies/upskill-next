'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  UserPlus, 
  Search,
  BarChart3,
  BookOpen,
  Target,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  ChevronRight,
  Zap,
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function GuideAccessPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const quickActions = [
    {
      title: 'Invite Learners',
      description: 'Send invitations to students to join your learning group',
      icon: UserPlus,
      color: 'from-blue-600 to-purple-600',
      href: '/guide-access/invite'
    },
    {
      title: 'Monitor Progress',
      description: 'Track learning outcomes and completion rates',
      icon: BarChart3,
      color: 'from-green-600 to-blue-600', 
      href: '/guide-access/progress'
    },
    {
      title: 'Manage Groups',
      description: 'Organize learners into cohorts and study groups',
      icon: Users,
      color: 'from-purple-600 to-pink-600',
      href: '/guide-access/groups'
    },
    {
      title: 'Learning Resources',
      description: 'Access teaching materials and curriculum guides',
      icon: BookOpen,
      color: 'from-orange-600 to-red-600',
      href: '/guide-access/resources'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New learner joined',
      student: 'Alex Rodriguez',
      group: 'Semiconductor Basics Group',
      time: '1 hour ago',
      status: 'active'
    },
    {
      id: 2,
      action: 'Course completed',
      student: 'Maria Garcia',
      group: 'Advanced Manufacturing',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Progress milestone',
      student: 'John Smith',
      group: 'Fiber Optics Training',
      time: '5 hours ago',
      status: 'milestone'
    }
  ];

  const learnerGroups = [
    {
      id: 1,
      name: 'Semiconductor Basics',
      learners: 24,
      progress: 78,
      activeModule: 'Wafer Processing',
      instructor: 'You'
    },
    {
      id: 2,
      name: 'Advanced Manufacturing',
      learners: 18,
      progress: 65,
      activeModule: 'CNC Programming',
      instructor: 'You'
    },
    {
      id: 3,
      name: 'Green Energy Systems',
      learners: 31,
      progress: 82,
      activeModule: 'Solar Installation',
      instructor: 'You'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 
                    dark:from-[hsl(222,84%,4%)] dark:via-[hsl(222,84%,6%)] dark:to-[hsl(222,84%,8%)]">
      
      {/* Header Section */}
      <div className="relative pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          bg-green-100/80 text-green-700 text-sm font-medium mb-6
                          dark:bg-green-900/30 dark:text-green-300 border border-green-200/50 dark:border-green-800/50">
              <GraduationCap className="w-4 h-4" />
              Guide Portal
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 
                          dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6">
              Guide Access
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Empower your learners with guided instruction. Invite students, monitor their progress, 
              and help them succeed in high-demand technology careers.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search learners, groups, or modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-0 
                          bg-white/80 dark:bg-slate-800/50 
                          shadow-lg shadow-slate-200/50 dark:shadow-black/20
                          focus:ring-2 focus:ring-green-500/30 focus:shadow-xl
                          backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        
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
                  <CardTitle className="text-lg group-hover:text-green-600 dark:group-hover:text-green-400 
                                      transition-colors duration-300">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mb-4">
                    {action.description}
                  </CardDescription>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium
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
          
          {/* Learning Groups */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Your Learning Groups
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {learnerGroups.map((group) => (
                  <div key={group.id} className="p-4 rounded-xl
                                                bg-slate-50/80 dark:bg-slate-700/30 
                                                hover:bg-slate-100/80 dark:hover:bg-slate-700/50
                                                transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {group.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {group.learners} learners
                        </Badge>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {group.progress}% Complete
                      </span>
                    </div>
                    
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Current: {group.activeModule}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Activity & Stats */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Total Learners</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">73</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Active Groups</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Avg Progress</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Completions</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">47</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 
                                   ${item.status === 'completed' ? 'bg-green-500' : 
                                     item.status === 'milestone' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.action}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {item.student} • {item.group}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 