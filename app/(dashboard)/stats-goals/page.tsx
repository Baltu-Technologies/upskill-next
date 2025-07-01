'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Target,
  Calendar,
  BookOpen,
  Zap,
  Trophy,
  BarChart3,
  Star,
  Plus,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Award,
  Eye,
  ChevronRight,
  GraduationCap,
  Users,
  Lightbulb,
  Brain,
  FileCheck,
  Timer,
  Medal,
  Flame,
  Crown,
  Rocket,
  Shield,
  Swords,
  Gem,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Enhanced mock data with gamification
const learningStats = {
  level: 12,
  currentXP: 2480,
  nextLevelXP: 3000,
  totalCourses: 12,
  completedCourses: 4,
  inProgressCourses: 3,
  averageScore: 88,
  currentStreak: 7,
  longestStreak: 14,
  completedHours: 64,
  totalHours: 156,
  totalXP: 4500,
  earnedXP: 2480,
  rank: 23,
  totalLearners: 1247,
  weeklyGoal: 3
};

// Leaderboard data
const leaderboard = [
  { rank: 1, name: 'Alex Chen', xp: 4890, avatar: '👨‍💻', streak: 21, level: 15 },
  { rank: 2, name: 'Sarah Johnson', xp: 4720, avatar: '👩‍🔬', streak: 18, level: 15 },
  { rank: 3, name: 'Marcus Torres', xp: 4350, avatar: '👨‍🏭', streak: 12, level: 14 },
  { rank: 23, name: 'You (Peter)', xp: 2480, avatar: '👤', streak: 7, level: 12, isUser: true },
  { rank: 24, name: 'Jennifer Wang', xp: 2440, avatar: '👩‍💼', streak: 5, level: 12 },
  { rank: 25, name: 'David Rodriguez', xp: 2380, avatar: '👨‍🔧', streak: 9, level: 11 }
];

// Achievement data
const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first course', icon: '🎯', unlocked: true, rare: false },
  { id: 2, title: 'Streak Master', description: 'Maintain a 7-day learning streak', icon: '🔥', unlocked: true, rare: false },
  { id: 3, title: 'Knowledge Seeker', description: 'Complete 5 courses', icon: '📚', unlocked: false, rare: false },
  { id: 4, title: 'Perfect Score', description: 'Score 100% on a course assessment', icon: '⭐', unlocked: true, rare: true },
  { id: 5, title: 'Industry Expert', description: 'Master 3 skill categories', icon: '🏆', unlocked: false, rare: true },
  { id: 6, title: 'Mentor', description: 'Help 10 fellow learners', icon: '🤝', unlocked: false, rare: true }
];

// Recent courses with better gamification
const recentCourses = [
  {
    id: 1,
    title: 'Semiconductor Manufacturing Fundamentals',
    image: '/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg',
    completed: true,
    score: 92,
    xpEarned: 450,
    duration: '8h 30m',
    completedDate: '2024-01-15',
    certificate: true
  },
  {
    id: 2,
    title: 'Data Center Infrastructure',
    image: '/media/semiconductor/Semiconductor-Manufacturing-Equipment-in-Cleanroom.jpg',
    completed: true,
    score: 88,
    xpEarned: 380,
    duration: '6h 45m',
    completedDate: '2024-01-08',
    certificate: true
  },
  {
    id: 3,
    title: 'Fiber Optic Installation',
    image: '/media/semiconductor/Semiconductor-Manufacturing-Equipment-in-Cleanroom.jpg',
    completed: false,
    progress: 65,
    duration: '12h',
    estimatedCompletion: '2024-02-05'
  }
];

export default function StatsGoalsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'leaderboard' | 'achievements'>('overview');
  const [animatedXP, setAnimatedXP] = useState(0);

  // Animate XP counter on load
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedXP(prev => {
        if (prev < learningStats.earnedXP) {
          return Math.min(prev + 47, learningStats.earnedXP);
        }
        return prev;
      });
    }, 10);
    return () => clearInterval(interval);
  }, []);

  const xpProgress = (learningStats.currentXP / learningStats.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg"
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
            {/* Level Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-blue-600/90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1">
                  <span className="text-white font-bold text-sm block text-center">Level {learningStats.level}</span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Experience Points</span>
                  <span className="text-purple-400 font-bold">{learningStats.currentXP.toLocaleString()} / {learningStats.nextLevelXP.toLocaleString()} XP</span>
                </div>
                <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-1000 rounded-full"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {learningStats.nextLevelXP - learningStats.currentXP} XP to Level {learningStats.level + 1}
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
              <span className="bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                Learning{" "}
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                Dashboard
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
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-medium">{learningStats.completedCourses} Courses Completed</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Flame className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-medium">{learningStats.currentStreak} Day Streak</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Target className="w-6 h-6 text-green-400" />
                <span className="text-lg font-medium">{learningStats.averageScore}% Avg Score</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-medium">Rank #{learningStats.rank}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative bg-gradient-to-br from-gray-950 via-blue-950/20 to-purple-950/20">
        <div className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'courses', label: 'Course Progress', icon: BookOpen },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "gap-2 transition-all duration-200 whitespace-nowrap",
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-emerald-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Completion Rate</p>
                          <p className="text-3xl font-bold text-emerald-400">
                            {Math.round((learningStats.completedCourses / learningStats.totalCourses) * 100)}%
                          </p>
                          <p className="text-xs text-gray-500">{learningStats.completedCourses} of {learningStats.totalCourses} courses</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-orange-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Current Streak</p>
                          <p className="text-3xl font-bold text-orange-400">{learningStats.currentStreak}</p>
                          <p className="text-xs text-gray-500">days • best: {learningStats.longestStreak}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Flame className="h-6 w-6 text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-yellow-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Leaderboard Rank</p>
                          <p className="text-3xl font-bold text-yellow-400">#{learningStats.rank}</p>
                          <p className="text-xs text-gray-500">of {learningStats.totalLearners.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <Crown className="h-6 w-6 text-yellow-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 hover:border-purple-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total XP Earned</p>
                          <p className="text-3xl font-bold text-purple-400">{animatedXP.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Level {learningStats.level}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Zap className="h-6 w-6 text-purple-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Weekly Goals */}
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-400" />
                      Weekly Learning Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300">Complete courses this week</span>
                          <span className="text-green-400 font-bold">2 / 3</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300">Study time this week</span>
                          <span className="text-blue-400 font-bold">8h / 12h</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recentCourses.map((course) => (
                  <Card key={course.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="relative h-48">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {course.completed && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-emerald-500/90 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                      {course.completed ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Final Score</span>
                            <span className="text-green-400 font-bold">{course.score}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">XP Earned</span>
                            <span className="text-purple-400 font-bold">+{course.xpEarned} XP</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Duration</span>
                            <span className="text-blue-400">{course.duration}</span>
                          </div>
                          {course.certificate && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              <Award className="w-3 h-3 mr-1" />
                              Certificate Earned
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-blue-400 font-bold">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Duration: {course.duration}</span>
                            <span className="text-gray-500">Est. completion: {course.estimatedCompletion}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Weekly Leaderboard - Advanced Manufacturing
                  </CardTitle>
                  <p className="text-gray-400">Compete with learners in your industry</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.map((learner) => (
                      <div 
                        key={learner.rank} 
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                          learner.isUser 
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30" 
                            : "bg-gray-800/50 hover:bg-gray-700/50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          learner.rank <= 3 ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" : "bg-gray-600 text-gray-300"
                        )}>
                          {learner.rank <= 3 ? (learner.rank === 1 ? '🥇' : learner.rank === 2 ? '🥈' : '🥉') : learner.rank}
                        </div>
                        <div className="text-2xl">{learner.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("font-medium", learner.isUser ? "text-blue-400" : "text-white")}>{learner.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Level {learner.level}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">
                            {learner.xp.toLocaleString()} XP • {learner.streak} day streak
                          </div>
                        </div>
                        {learner.rank <= 3 && (
                          <Crown className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={cn(
                      "bg-gradient-to-br backdrop-blur-xl border transition-all duration-300 relative overflow-hidden",
                      achievement.unlocked 
                        ? achievement.rare
                          ? "from-yellow-900/80 to-orange-800/60 border-yellow-500/50 shadow-lg shadow-yellow-500/20"
                          : "from-gray-900/80 to-gray-800/60 border-green-500/50"
                        : "from-gray-900/50 to-gray-800/30 border-gray-700/50"
                    )}
                  >
                    {achievement.rare && achievement.unlocked && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                          <Gem className="w-3 h-3 mr-1" />
                          Rare
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        "text-4xl mb-4 p-4 rounded-full mx-auto w-fit",
                        achievement.unlocked ? "bg-white/10" : "bg-gray-800/50 grayscale"
                      )}>
                        {achievement.icon}
                      </div>
                      <h3 className={cn(
                        "text-lg font-bold mb-2",
                        achievement.unlocked ? "text-white" : "text-gray-500"
                      )}>
                        {achievement.title}
                      </h3>
                      <p className={cn(
                        "text-sm",
                        achievement.unlocked ? "text-gray-300" : "text-gray-600"
                      )}>
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <Badge variant="outline" className="mt-3 text-gray-500 border-gray-600">
                          Locked
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 