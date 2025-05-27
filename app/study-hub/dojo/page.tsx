'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sword,
  Trophy,
  Target,
  Zap,
  Clock,
  Play,
  Search,
  Filter,
  Star,
  ChevronDown,
  Code2,
  Brain,
  Timer,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Lock,
  Flame,
  BarChart3,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock dojo data
const challenges = [
  {
    id: 1,
    title: 'Two Sum Algorithm',
    difficulty: 'Easy',
    category: 'Arrays',
    points: 10,
    timeLimit: 30,
    completionRate: 85,
    attempts: 1243,
    solved: false,
    description: 'Find two numbers in an array that add up to a target sum.',
    tags: ['Arrays', 'Hash Tables', 'Algorithms'],
    estimatedTime: '15-20 min',
    language: 'JavaScript'
  },
  {
    id: 2,
    title: 'Binary Tree Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    points: 25,
    timeLimit: 45,
    completionRate: 65,
    attempts: 892,
    solved: true,
    description: 'Implement preorder, inorder, and postorder traversal of a binary tree.',
    tags: ['Trees', 'Recursion', 'Data Structures'],
    estimatedTime: '25-35 min',
    language: 'Python'
  },
  {
    id: 3,
    title: 'Dynamic Programming - Fibonacci',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    points: 15,
    timeLimit: 25,
    completionRate: 78,
    attempts: 1567,
    solved: true,
    description: 'Solve Fibonacci sequence using dynamic programming approach.',
    tags: ['Dynamic Programming', 'Optimization', 'Recursion'],
    estimatedTime: '10-15 min',
    language: 'JavaScript'
  },
  {
    id: 4,
    title: 'Graph Shortest Path',
    difficulty: 'Hard',
    category: 'Graphs',
    points: 50,
    timeLimit: 90,
    completionRate: 35,
    attempts: 456,
    solved: false,
    description: 'Find the shortest path between two nodes in a weighted graph.',
    tags: ['Graphs', 'Algorithms', 'Dijkstra'],
    estimatedTime: '60-90 min',
    language: 'Java'
  },
  {
    id: 5,
    title: 'String Manipulation',
    difficulty: 'Easy',
    category: 'Strings',
    points: 12,
    timeLimit: 20,
    completionRate: 90,
    attempts: 2134,
    solved: true,
    description: 'Reverse a string without using built-in methods.',
    tags: ['Strings', 'Algorithms', 'Basic'],
    estimatedTime: '5-10 min',
    language: 'Python'
  },
  {
    id: 6,
    title: 'System Design - Cache',
    difficulty: 'Hard',
    category: 'System Design',
    points: 75,
    timeLimit: 120,
    completionRate: 28,
    attempts: 234,
    solved: false,
    description: 'Design a distributed cache system with LRU eviction.',
    tags: ['System Design', 'Cache', 'Architecture'],
    estimatedTime: '90-120 min',
    language: 'Any'
  }
];

const leaderboard = [
  { rank: 1, name: 'Alex Chen', points: 2450, solved: 87, streak: 15, avatar: '👨‍💻' },
  { rank: 2, name: 'Sarah Kim', points: 2380, solved: 82, streak: 12, avatar: '👩‍💻' },
  { rank: 3, name: 'Mike Johnson', points: 2210, solved: 76, streak: 8, avatar: '🧑‍💻' },
  { rank: 4, name: 'Emma Wilson', points: 2150, solved: 74, streak: 23, avatar: '👩‍🔬' },
  { rank: 5, name: 'Peter Costa', points: 1980, solved: 68, streak: 5, avatar: '👨‍🎓' },
  { rank: 6, name: 'Lisa Zhang', points: 1875, solved: 65, streak: 7, avatar: '👩‍💼' },
  { rank: 7, name: 'David Lee', points: 1720, solved: 59, streak: 3, avatar: '👨‍🔧' },
  { rank: 8, name: 'Maria Garcia', points: 1650, solved: 56, streak: 9, avatar: '👩‍🎨' }
];

const categories = ['All Categories', 'Arrays', 'Trees', 'Dynamic Programming', 'Graphs', 'Strings', 'System Design'];
const difficulties = ['All Difficulties', 'Easy', 'Medium', 'Hard'];
const languages = ['All Languages', 'JavaScript', 'Python', 'Java', 'C++', 'Go', 'Any'];

const userStats = {
  totalPoints: 1980,
  problemsSolved: 68,
  currentStreak: 5,
  longestStreak: 23,
  rank: 5,
  accuracy: 84,
  averageTime: 28,
  favoriteCategory: 'Arrays'
};

export default function DojoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All Difficulties' || challenge.difficulty === selectedDifficulty;
    const matchesLanguage = selectedLanguage === 'All Languages' || challenge.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <Sword className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dojo</h1>
              <p className="text-slate-600 dark:text-slate-300">Sharpen your coding skills with practice challenges</p>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Points</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{userStats.totalPoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Problems Solved</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{userStats.problemsSolved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Current Streak</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{userStats.currentStreak} days</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Global Rank</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">#{userStats.rank}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {selectedCategory}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {categories.map(category => (
                        <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {selectedDifficulty}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {difficulties.map(difficulty => (
                        <DropdownMenuItem key={difficulty} onClick={() => setSelectedDifficulty(difficulty)}>
                          {difficulty}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                {filteredChallenges.length} challenges found
              </div>
            </div>

            {/* Challenges */}
            <div className="space-y-4">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        challenge.solved 
                          ? "bg-green-100 dark:bg-green-900/50"
                          : "bg-slate-100 dark:bg-gray-700"
                      )}>
                        {challenge.solved ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <Code2 className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{challenge.title}</h3>
                          {challenge.solved && <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Solved</Badge>}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                          <Badge variant="outline">{challenge.category}</Badge>
                          <Badge variant="outline">{challenge.language}</Badge>
                          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                            <Trophy className="h-3 w-3" />
                            {challenge.points} pts
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                            <Timer className="h-3 w-3" />
                            {challenge.timeLimit} min
                          </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                          {challenge.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {challenge.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{challenge.attempts} attempts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span className={getCompletionColor(challenge.completionRate)}>
                              {challenge.completionRate}% success
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{challenge.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Solution
                      </Button>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        {challenge.solved ? 'Practice Again' : 'Start Challenge'}
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar for completion rate */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Community Success Rate</span>
                      <span className="font-medium text-slate-900 dark:text-white">{challenge.completionRate}%</span>
                    </div>
                    <Progress value={challenge.completionRate} className="h-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Sword className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No challenges found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Daily Challenge</h3>
                  <p className="text-indigo-100 text-sm">Extra points today!</p>
                </div>
              </div>
              <p className="text-indigo-100 mb-4">
                Solve today's featured problem and earn 2x points. Perfect for maintaining your streak!
              </p>
              <Button variant="secondary" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Take Challenge
              </Button>
            </div>

            {/* Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Leaderboard</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                >
                  {showLeaderboard ? 'Hide' : 'View All'}
                </Button>
              </div>

              <div className="space-y-3">
                {leaderboard.slice(0, showLeaderboard ? 8 : 5).map((user) => (
                  <div
                    key={user.rank}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      user.name === 'Peter Costa' 
                        ? "bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-700"
                        : "hover:bg-slate-50 dark:hover:bg-gray-700"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      user.rank <= 3 
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                        : "bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-gray-300"
                    )}>
                      {user.rank <= 3 ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        user.rank
                      )}
                    </div>
                    
                    <div className="text-2xl">{user.avatar}</div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{user.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <span>{user.points} pts</span>
                        <span>{user.solved} solved</span>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {user.streak}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Your Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Accuracy Rate</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userStats.accuracy}%</span>
                  </div>
                  <Progress value={userStats.accuracy} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Avg. Solve Time</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userStats.averageTime} min</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Favorite Category</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userStats.favoriteCategory}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Longest Streak</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userStats.longestStreak} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 