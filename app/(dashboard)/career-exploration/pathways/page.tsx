'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Server, 
  Cpu, 
  Settings, 
  TrendingUp, 
  Clock, 
  BookOpen,
  Award,
  Building2,
  Zap,
  Target,
  Play,
  CheckCircle,
  ArrowRight,
  Trophy,
  Flame,
  Crown,
  Users,
  Calendar,
  Star,
  BarChart3,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MyPathwaysPage = () => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const pathways = [
    {
      id: 'data-center-tech',
      title: 'Data Center Technician',
      description: 'Manage and maintain critical infrastructure in modern data centers',
      progress: 35,
      timeline: '8-12 months',
      salary: '$45,000 - $85,000',
      growth: '+8% annually',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&crop=center',
      gradient: 'from-blue-600 to-indigo-600',
      xpEarned: 1250,
      courses: [
        { name: 'Server Hardware Fundamentals', progress: 100, xp: 200 },
        { name: 'Network Infrastructure', progress: 85, xp: 170 },
        { name: 'Data Center Cooling Systems', progress: 60, xp: 120 },
        { name: 'Power Management', progress: 25, xp: 50 },
        { name: 'Virtualization Technologies', progress: 0, xp: 0 },
        { name: 'Security Protocols', progress: 0, xp: 0 }
      ],
      icon: Server,
      color: 'text-blue-500'
    },
    {
      id: 'semiconductor-tech',
      title: 'Semiconductor Technician',
      description: 'Work in clean room environments processing wafers and microchips',
      progress: 22,
      timeline: '6-10 months',
      salary: '$40,000 - $75,000',
      growth: '+7% annually',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center',
      gradient: 'from-purple-600 to-blue-600',
      xpEarned: 680,
      courses: [
        { name: 'Clean Room Operations', progress: 100, xp: 180 },
        { name: 'Wafer Processing', progress: 45, xp: 90 },
        { name: 'Quality Control', progress: 30, xp: 60 },
        { name: 'Equipment Maintenance', progress: 0, xp: 0 },
        { name: 'Process Documentation', progress: 0, xp: 0 }
      ],
      icon: Cpu,
      color: 'text-purple-500'
    },
    {
      id: 'cnc-operator',
      title: 'CNC Operator',
      description: 'Operate computer-controlled machines for precision manufacturing',
      progress: 58,
      timeline: '4-8 months',
      salary: '$35,000 - $65,000',
      growth: '+5% annually',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&crop=center',
      gradient: 'from-orange-600 to-red-600',
      xpEarned: 1840,
      courses: [
        { name: 'CNC Programming', progress: 100, xp: 250 },
        { name: 'Machine Setup', progress: 100, xp: 220 },
        { name: 'Tool Selection', progress: 75, xp: 150 },
        { name: 'Quality Inspection', progress: 60, xp: 120 },
        { name: 'Safety Protocols', progress: 40, xp: 80 },
        { name: 'Troubleshooting', progress: 25, xp: 50 }
      ],
      icon: Settings,
      color: 'text-orange-500'
    }
  ];

  const stats = {
    totalPathways: pathways.length,
    averageProgress: Math.round(pathways.reduce((sum, p) => sum + p.progress, 0) / pathways.length),
    totalXP: pathways.reduce((sum, p) => sum + p.xpEarned, 0),
    completedCourses: pathways.reduce((sum, p) => sum + p.courses.filter(c => c.progress === 100).length, 0),
    totalCourses: pathways.reduce((sum, p) => sum + p.courses.length, 0)
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop&crop=center"
            alt="Advanced manufacturing environment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl">
            {/* Pathway Progress Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-purple-600/90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1">
                  <span className="text-white font-bold text-sm block text-center">{stats.averageProgress}% Avg</span>
          </div>
        </div>

              {/* Progress Summary */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Overall Progress</span>
                  <span className="text-blue-400 font-bold">{stats.completedCourses} / {stats.totalCourses} Courses</span>
          </div>
                <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 rounded-full"
                    style={{ width: `${(stats.completedCourses / stats.totalCourses) * 100}%` }}
                  />
          </div>
                <div className="text-gray-400 text-sm mt-1">
                  {stats.totalCourses - stats.completedCourses} courses remaining
          </div>
        </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                My Career{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                Pathways
                </span>
            </motion.h1>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 text-gray-300 mb-8"
            >
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Target className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-medium">{stats.totalPathways} Active Pathways</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-medium">{stats.completedCourses} Courses Complete</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Zap className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-medium">{stats.totalXP.toLocaleString()} XP Earned</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-green-400" />
                <span className="text-lg font-medium">{stats.averageProgress}% Avg Progress</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative bg-gradient-to-br from-gray-950 via-blue-950/20 to-purple-950/20">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <div className="relative mb-12 overflow-hidden">
            <div className="relative p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Your Learning Pathways
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">
                Track your progress across multiple career pathways in 
                <span className="text-blue-400 font-semibold"> Advanced Manufacturing</span>,
                <span className="text-purple-400 font-semibold"> Data Centers</span>, and
                <span className="text-orange-400 font-semibold"> Semiconductor Technology</span>
              </p>
            </div>
          </div>

          {/* Pathways Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {pathways.map((pathway, index) => {
              const Icon = pathway.icon;
              const isSelected = selectedPathway === pathway.id;
              
              return (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={cn(
                      "group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10",
                      "bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20",
                      isSelected ? "ring-2 ring-blue-500/50 border-blue-500/50" : "hover:border-blue-500/50"
                    )}
                    onClick={() => setSelectedPathway(isSelected ? null : pathway.id)}
                  >
                    {/* Header Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                        <Image
                          src={pathway.image}
                          alt={pathway.title}
                          fill
                          className="object-cover"
                        />
        </div>
                      <div className={`absolute inset-0 bg-gradient-to-r ${pathway.gradient} opacity-80`} />
                      <div className="absolute inset-0 bg-black/20" />
                      
                      {/* Top badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <Badge className="bg-black/50 text-white border-white/20">
                          {pathway.timeline}
                  </Badge>
                        <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-bold text-sm">{pathway.xpEarned} XP</span>
              </div>
            </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
            <div>
                            <h3 className="text-white font-bold text-lg leading-tight">
                              {pathway.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {pathway.salary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <p className="text-gray-300 mb-4">{pathway.description}</p>
                      
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm font-bold text-white">{pathway.progress}%</span>
                        </div>
                        <Progress 
                          value={pathway.progress} 
                          className="h-2 bg-gray-700" 
                        />
            </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-4 text-center text-sm mb-4">
                        <div>
                          <div className="text-green-400 font-bold">
                            {pathway.courses.filter(c => c.progress === 100).length}
                          </div>
                          <div className="text-gray-500">Complete</div>
                        </div>
                        <div>
                          <div className="text-yellow-400 font-bold">
                            {pathway.courses.filter(c => c.progress > 0 && c.progress < 100).length}
                          </div>
                          <div className="text-gray-500">In Progress</div>
                        </div>
            <div>
                          <div className="text-gray-400 font-bold">
                            {pathway.courses.filter(c => c.progress === 0).length}
                          </div>
                          <div className="text-gray-500">Not Started</div>
                        </div>
                      </div>

                      {/* Expanded course details */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-700 pt-4 mt-4"
                        >
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Course Progress
                          </h4>
                          <div className="space-y-3">
                            {pathway.courses.map((course, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-300">{course.name}</span>
                                    <div className="flex items-center gap-2">
                                      {course.progress === 100 && (
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                      )}
                                      <span className="text-xs text-gray-400">{course.progress}%</span>
                                    </div>
                                  </div>
                                  <Progress value={course.progress} className="h-1.5 bg-gray-800" />
                                </div>
                  </div>
                ))}
              </div>
                          
                          <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        </motion.div>
                      )}

                      {/* View details button */}
                      {!isSelected && (
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500/50"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
        )}
      </CardContent>
    </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-emerald-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Completion Rate</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {Math.round((stats.completedCourses / stats.totalCourses) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">{stats.completedCourses} of {stats.totalCourses} courses</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-blue-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Pathways</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalPathways}</p>
                    <p className="text-xs text-gray-500">career tracks</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
        </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total XP Earned</p>
                    <p className="text-3xl font-bold text-purple-400">{stats.totalXP.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">experience points</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
        </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-orange-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg Progress</p>
                    <p className="text-3xl font-bold text-orange-400">{stats.averageProgress}%</p>
                    <p className="text-xs text-gray-500">across all pathways</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-400" />
                  </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPathwaysPage; 