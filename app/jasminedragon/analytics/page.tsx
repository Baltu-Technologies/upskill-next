'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Activity,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import Image from 'next/image';

interface AnalyticsData {
  registrationTrends: {
    daily: Array<{ date: string; count: number }>;
    weekly: Array<{ date: string; count: number }>;
    monthly: Array<{ date: string; count: number }>;
  };
  roleDistribution: {
    admin: number;
    guide: number;
    content_creator: number;
    learner: number;
  };
  growthMetrics: {
    totalUsers: number;
    newUsersThisMonth: number;
    newUsersLastMonth: number;
    growthRate: number;
    activeUsers: number;
    retentionRate: number;
  };
  activityData: {
    totalSessions: number;
    avgSessionDuration: number;
    bounceRate: number;
    peakHours: Array<{ hour: number; count: number }>;
  };
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jasminedragon/analytics?range=${selectedRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
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

  const formatGrowthRate = (rate: number) => {
    const isPositive = rate > 0;
    const isNegative = rate < 0;
    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
    const colorClass = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400';
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="w-3 h-3" />
        <span className="text-sm font-medium">{Math.abs(rate).toFixed(1)}%</span>
      </div>
    );
  };

  const getMaxValue = (data: Array<{ date: string; count: number }>) => {
    return Math.max(...data.map(d => d.count));
  };

  const SimpleBarChart = ({ data, title }: { data: Array<{ date: string; count: number }>, title: string }) => {
    if (!data || data.length === 0) return <div className="text-gray-400 text-center py-8">No data available</div>;
    
    const maxValue = getMaxValue(data);
    
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">{title}</h4>
        <div className="space-y-2">
          {data.slice(-10).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-20 text-xs text-gray-400 truncate">
                {new Date(item.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
              </div>
              <div className="w-8 text-xs text-gray-300 text-right">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header Banner */}
        <div className="relative h-[35vh] flex items-center justify-center overflow-hidden rounded-2xl mb-8">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&crop=center"
              alt="Analytics dashboard"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-8"
            >
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-purple-600/90 flex items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1">
                  <span className="text-white font-bold text-sm block text-center">Analytics</span>
                </div>
              </div>
              
              <div className="flex-1 max-w-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Platform Analytics
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  Comprehensive insights and user behavior analytics
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Growing Platform
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Activity className="w-3 h-3 mr-1" />
                    Real-time Data
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Time Range:</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { value: '7d', label: '7 Days' },
                      { value: '30d', label: '30 Days' },
                      { value: '90d', label: '90 Days' },
                      { value: '1y', label: '1 Year' }
                    ].map(range => (
                      <Button
                        key={range.value}
                        variant={selectedRange === range.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRange(range.value as any)}
                        className={selectedRange === range.value 
                          ? "bg-blue-600/20 text-blue-400 border-blue-600/30" 
                          : "border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                        }
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={fetchAnalytics}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="border-red-500/20 bg-red-950/20 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Analytics Content */}
        {analyticsData && (
          <>
            {/* Growth Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {analyticsData.growthMetrics.totalUsers.toLocaleString()}
                  </div>
                  {formatGrowthRate(analyticsData.growthMetrics.growthRate)}
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">New This Month</CardTitle>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {analyticsData.growthMetrics.newUsersThisMonth.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    vs {analyticsData.growthMetrics.newUsersLastMonth} last month
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {analyticsData.growthMetrics.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {analyticsData.growthMetrics.retentionRate.toFixed(1)}% retention
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">Avg Session</CardTitle>
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {Math.round(analyticsData.activityData.avgSessionDuration / 60)}m
                  </div>
                  <div className="text-sm text-gray-400">
                    {analyticsData.activityData.bounceRate.toFixed(1)}% bounce rate
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Registration Trends */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Registration Trends
                      </CardTitle>
                      <div className="flex gap-2">
                        {['daily', 'weekly', 'monthly'].map(type => (
                          <Button
                            key={type}
                            variant={viewType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewType(type as any)}
                            className={viewType === type 
                              ? "bg-blue-600/20 text-blue-400 border-blue-600/30" 
                              : "border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                            }
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart 
                      data={analyticsData.registrationTrends[viewType]} 
                      title={`${viewType.charAt(0).toUpperCase() + viewType.slice(1)} Registrations`}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Role Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      Role Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(analyticsData.roleDistribution).map(([role, count]) => {
                      const percentage = (count / analyticsData.growthMetrics.totalUsers) * 100;
                      return (
                        <div key={role} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs border ${getRoleColor(role)}`}>
                                {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">{count}</span>
                              <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 