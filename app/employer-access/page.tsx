'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Plus, 
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Settings,
  Eye,
  Calendar,
  FileText,
  Target,
  ChevronRight,
  Zap,
  Star
} from 'lucide-react';

export default function EmployerAccessPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const quickActions = [
    {
      title: 'Create Company Profile',
      description: 'Set up your organization profile and showcase your opportunities',
      icon: Building2,
      color: 'from-blue-600 to-purple-600',
      href: '/employer-access/profile/create'
    },
    {
      title: 'Manage Job Pipeline',
      description: 'Track candidates through your hiring process',
      icon: Users,
      color: 'from-purple-600 to-pink-600', 
      href: '/employer-access/pipeline'
    },
    {
      title: 'Post New Opportunity',
      description: 'Create and publish new job openings',
      icon: Plus,
      color: 'from-green-600 to-blue-600',
      href: '/employer-access/jobs/create'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View performance metrics and hiring insights',
      icon: TrendingUp,
      color: 'from-orange-600 to-red-600',
      href: '/employer-access/analytics'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New application received',
      candidate: 'Sarah Martinez',
      position: 'Semiconductor Technician',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      action: 'Interview scheduled',
      candidate: 'Michael Chen',
      position: 'Process Engineer',
      time: '4 hours ago',
      status: 'scheduled'
    },
    {
      id: 3,
      action: 'Profile updated',
      candidate: 'Your Company Profile',
      position: 'System Update',
      time: '1 day ago',
      status: 'completed'
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
                          bg-blue-100/80 text-blue-700 text-sm font-medium mb-6
                          dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
              <Building2 className="w-4 h-4" />
              Employer Portal
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 
                          dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6">
              Employer Access
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Create your company profile, manage your talent pipeline, and connect with skilled professionals
              in semiconductor, manufacturing, and emerging technology sectors.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search candidates, positions, or pipeline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-0 
                          bg-white/80 dark:bg-slate-800/50 
                          shadow-lg shadow-slate-200/50 dark:shadow-black/20
                          focus:ring-2 focus:ring-blue-500/30 focus:shadow-xl
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
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 
                                      transition-colors duration-300">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mb-4">
                    {action.description}
                  </CardDescription>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium
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
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl
                                               bg-slate-50/80 dark:bg-slate-700/30 
                                               hover:bg-slate-100/80 dark:hover:bg-slate-700/50
                                               transition-colors duration-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {item.action}
                        </span>
                        <Badge variant={item.status === 'pending' ? 'default' : 
                                      item.status === 'scheduled' ? 'secondary' : 'outline'}
                               className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.candidate} • {item.position}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {item.time}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Pipeline Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Active Positions</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Total Applications</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">84</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Interviews Scheduled</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Offers Extended</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">3</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-slate-800/50 
                           shadow-lg shadow-slate-200/50 dark:shadow-black/20
                           backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-600" />
                  Top Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                                hover:from-blue-700 hover:to-purple-700 
                                text-white border-0 shadow-lg hover:shadow-xl
                                transition-all duration-300 hover:scale-105">
                  View Recommended Candidates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 