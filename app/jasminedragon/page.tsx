'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  Activity, 
  Shield, 
  TrendingUp, 
  Brain,
  Award,
  Globe,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

interface UserStats {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  adminUsers: number;
  guideUsers: number;
  contentCreatorUsers: number;
  learnerUsers: number;
  recentUsers: Array<{
    id: string;
    email: string;
    name: string;
    createdAt: string;
    roles?: string[]; // Make roles optional
  }>;
}

export default function AdminDashboard() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/jasminedragon/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setUserStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-500/10 text-red-400 border-red-500/20',
      guide: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      content_creator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      learner: 'bg-green-500/10 text-green-400 border-green-500/20'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: Shield,
      guide: Users,
      content_creator: Brain,
      learner: Award
    };
    const IconComponent = icons[role as keyof typeof icons] || Users;
    return <IconComponent className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-8">
          <Card className="border-red-500/20 bg-red-950/20 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Admin Header Banner */}
        <div className="relative h-[40vh] flex items-center justify-center overflow-hidden rounded-2xl mb-8">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop&crop=center"
              alt="Admin control center"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          </div>

          {/* Admin Content */}
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-8 mb-8"
              >
                {/* Admin Icon Badge */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-purple-600/90 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1 z-20">
                    <span className="text-white font-bold text-sm block text-center">Admin</span>
                  </div>
                </div>
                
                {/* Admin Summary */}
                <div className="flex-1 max-w-lg">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    System Control Center
                  </h1>
                  <p className="text-xl text-gray-300 mb-6">
                    Monitor, manage, and optimize the learning platform
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      System Online
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Activity className="w-3 h-3 mr-1" />
                      {userStats?.totalUsers || 0} Total Users
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats?.totalUsers || 0}</div>
              <p className="text-xs text-gray-400">+{userStats?.newUsersToday || 0} today</p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats?.activeUsers || 0}</div>
              <p className="text-xs text-gray-400">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats?.adminUsers || 0}</div>
              <p className="text-xs text-gray-400">System administrators</p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">New Today</CardTitle>
              <UserPlus className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats?.newUsersToday || 0}</div>
              <p className="text-xs text-gray-400">User registrations</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role Distribution & Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  Role Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-gray-300">Administrators</span>
                    </div>
                    <span className="text-white font-medium">{userStats?.adminUsers || 0}</span>
                  </div>
                  <Progress value={((userStats?.adminUsers || 0) / (userStats?.totalUsers || 1)) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Guides</span>
                    </div>
                    <span className="text-white font-medium">{userStats?.guideUsers || 0}</span>
                  </div>
                  <Progress value={((userStats?.guideUsers || 0) / (userStats?.totalUsers || 1)) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">Content Creators</span>
                    </div>
                    <span className="text-white font-medium">{userStats?.contentCreatorUsers || 0}</span>
                  </div>
                  <Progress value={((userStats?.contentCreatorUsers || 0) / (userStats?.totalUsers || 1)) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Learners</span>
                    </div>
                    <span className="text-white font-medium">{userStats?.learnerUsers || 0}</span>
                  </div>
                  <Progress value={((userStats?.learnerUsers || 0) / (userStats?.totalUsers || 1)) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Recent Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats?.recentUsers?.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + (index * 0.1) }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{user.name || user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(user.roles || []).map((role) => (
                            <Badge key={role} className={`text-xs border ${getRoleColor(role)}`}>
                              {getRoleIcon(role)}
                              <span className="ml-1 capitalize">{role.replace('_', ' ')}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  )) || (
                    <div className="text-center text-gray-400 py-8">
                      No recent users found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 