'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target,
  Calendar,
  BookOpen,
  Flame,
  Zap,
  Trophy,
  BarChart3,
  Star,
  Plus,
  Sword,
  Shield,
  Crown,
  Sparkles,
  Rocket,
  Medal,
  Users,
  TrendingUp,
  Activity,
  Lock,
  CheckCircle,
  Clock,
  Gift,
  Gamepad2,
  Award,
  ThumbsUp,
  Eye,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Gaming-style mock data
const playerStats = {
  level: 42,
  xp: 15847,
  xpToNext: 2153,
  xpForNextLevel: 18000,
  rank: 'Platinum III',
  battlepassTier: 67,
  kd: 2.31,
  wins: 127,
  totalMatches: 284,
  winRate: 44.7,
  achievements: 23,
  dailyStreak: 15,
  longestStreak: 28,
  weeklyXP: 2847,
  season: 'Season 8',
  skillRating: 2847,
  favoriteSkill: 'Data Center Operations'
};

const currentChallenges = [
  {
    id: 1,
    title: 'Course Warrior',
    description: 'Complete 3 courses this week',
    progress: 2,
    maxProgress: 3,
    xpReward: 500,
    type: 'weekly',
    rarity: 'rare',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Streak Master',
    description: 'Maintain a 20-day learning streak',
    progress: 15,
    maxProgress: 20,
    xpReward: 1000,
    type: 'special',
    rarity: 'legendary',
    icon: Flame,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 3,
    title: 'Skill Collector',
    description: 'Master 5 new skills',
    progress: 3,
    maxProgress: 5,
    xpReward: 750,
    type: 'seasonal',
    rarity: 'epic',
    icon: Star,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 4,
    title: 'Daily Grind',
    description: 'Study for 2 hours today',
    progress: 90,
    maxProgress: 120,
    xpReward: 200,
    type: 'daily',
    rarity: 'common',
    icon: Clock,
    color: 'from-green-500 to-emerald-500'
  }
];

const achievements = [
  {
    id: 1,
    title: 'First Victory',
    description: 'Complete your first course',
    unlocked: true,
    icon: Trophy,
    rarity: 'common',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Speed Runner',
    description: 'Complete a course in under 4 hours',
    unlocked: true,
    icon: Rocket,
    rarity: 'rare',
    date: '2024-02-03'
  },
  {
    id: 3,
    title: 'Legendary Scholar',
    description: 'Earn 10,000 XP',
    unlocked: true,
    icon: Crown,
    rarity: 'legendary',
    date: '2024-03-12'
  },
  {
    id: 4,
    title: 'Master Technician',
    description: 'Complete all Data Center courses',
    unlocked: false,
    icon: Shield,
    rarity: 'mythic',
    date: null
  }
];

const leaderboard = [
  { rank: 1, name: 'Alex Chen', xp: 25847, avatar: '🥇' },
  { rank: 2, name: 'Sarah Kim', xp: 22456, avatar: '🥈' },
  { rank: 3, name: 'Mike Johnson', xp: 19234, avatar: '🥉' },
  { rank: 4, name: 'You', xp: 15847, avatar: '👤', isPlayer: true },
  { rank: 5, name: 'Lisa Wang', xp: 14892, avatar: '🔥' }
];

export default function StatsGoalsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'achievements' | 'leaderboard'>('overview');
  const [animatedXP, setAnimatedXP] = useState(0);

  // Animate XP counter on load
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedXP(prev => {
        if (prev < playerStats.xp) {
          return Math.min(prev + 123, playerStats.xp);
        }
        return prev;
      });
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-orange-400 border-orange-400';
      case 'mythic': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-1">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <Gamepad2 className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Battle Stats
                </h1>
                <p className="text-slate-300">{playerStats.season} • {playerStats.rank}</p>
              </div>
            </div>
            
            {/* Level & XP */}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="text-2xl font-bold">Level {playerStats.level}</span>
              </div>
              <div className="text-sm text-slate-300">
                {animatedXP.toLocaleString()} / {playerStats.xpForNextLevel.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-6">
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 ease-out"
                style={{ width: `${(playerStats.xp / playerStats.xpForNextLevel) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Level {playerStats.level}</span>
              <span>{playerStats.xpToNext.toLocaleString()} XP to next level</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'leaderboard', label: 'Leaderboard', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "gap-2 transition-all duration-200",
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Win Rate */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Win Rate</p>
                        <p className="text-3xl font-bold text-green-400">{playerStats.winRate}%</p>
                        <p className="text-xs text-slate-500">{playerStats.wins} wins</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skill Rating */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Skill Rating</p>
                        <p className="text-3xl font-bold text-purple-400">{playerStats.skillRating}</p>
                        <p className="text-xs text-slate-500">{playerStats.rank}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Star className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Streak */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Daily Streak</p>
                        <p className="text-3xl font-bold text-orange-400">{playerStats.dailyStreak}</p>
                        <p className="text-xs text-slate-500">days in a row</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Flame className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly XP */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Weekly XP</p>
                        <p className="text-3xl font-bold text-blue-400">{playerStats.weeklyXP}</p>
                        <p className="text-xs text-slate-500">this week</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Battle Pass Progress */}
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Gift className="h-5 w-5 text-yellow-400" />
                    Battle Pass - {playerStats.season}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Tier Progress</span>
                    <span className="text-sm text-slate-300">
                      Tier {playerStats.battlepassTier} / 100
                    </span>
                  </div>
                  <Progress value={playerStats.battlepassTier} className="h-4" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Unlock amazing rewards as you progress!</span>
                    <span>{100 - playerStats.battlepassTier} tiers remaining</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'challenges' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentChallenges.map((challenge) => {
                const Icon = challenge.icon;
                const isCompleted = challenge.progress >= challenge.maxProgress;
                
                return (
                  <Card 
                    key={challenge.id} 
                    className={cn(
                      "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border backdrop-blur transition-all duration-200 hover:scale-105",
                      getRarityColor(challenge.rarity)
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            `bg-gradient-to-br ${challenge.color}`
                          )}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white">{challenge.title}</CardTitle>
                            <Badge variant="outline" className={cn("text-xs", getRarityColor(challenge.rarity))}>
                              {challenge.rarity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">+{challenge.xpReward} XP</div>
                          <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                            {challenge.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-300">{challenge.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-300">
                            {challenge.progress} / {challenge.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.maxProgress) * 100} 
                          className="h-2"
                        />
                        {isCompleted && (
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Challenge Complete!</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                
                return (
                  <Card 
                    key={achievement.id}
                    className={cn(
                      "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border backdrop-blur transition-all duration-200",
                      achievement.unlocked 
                        ? "border-yellow-500/50 hover:scale-105" 
                        : "border-slate-700/50 opacity-60"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          achievement.unlocked 
                            ? "bg-gradient-to-br from-yellow-500 to-orange-500" 
                            : "bg-slate-700"
                        )}>
                          {achievement.unlocked ? (
                            <Icon className="h-6 w-6 text-white" />
                          ) : (
                            <Lock className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-bold text-lg mb-1",
                            achievement.unlocked ? "text-white" : "text-slate-400"
                          )}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-slate-400 mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getRarityColor(achievement.rarity))}
                            >
                              {achievement.rarity.toUpperCase()}
                            </Badge>
                            {achievement.unlocked && achievement.date && (
                              <span className="text-xs text-slate-500">
                                {new Date(achievement.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-yellow-400" />
                  Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((player) => (
                    <div 
                      key={player.rank}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                        player.isPlayer 
                          ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30" 
                          : "bg-slate-800/30 hover:bg-slate-700/30"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                          player.rank <= 3 
                            ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-white" 
                            : "bg-slate-700 text-slate-300"
                        )}>
                          {player.rank}
                        </div>
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className={cn(
                            "font-semibold",
                            player.isPlayer ? "text-orange-400" : "text-white"
                          )}>
                            {player.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {player.xp.toLocaleString()} XP
                          </div>
                        </div>
                      </div>
                      {player.rank <= 3 && (
                        <Trophy className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 