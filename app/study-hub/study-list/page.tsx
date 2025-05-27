'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Calendar,
  Target,
  TrendingUp,
  Brain,
  ChevronDown,
  Star,
  BookMarked,
  Users,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock study list data
const studyItems = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    category: 'React',
    type: 'Course',
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    timeSpent: '12.5 hours',
    estimatedTime: '16 hours',
    priority: 'High',
    status: 'In Progress',
    difficulty: 'Advanced',
    source: 'Upskill Platform',
    dateAdded: '2024-01-15',
    lastAccessed: '2024-01-20',
    notes: 3,
    favorite: true
  },
  {
    id: 2,
    title: 'Machine Learning Fundamentals',
    category: 'AI/ML',
    type: 'Course',
    progress: 45,
    totalLessons: 32,
    completedLessons: 14,
    timeSpent: '18.2 hours',
    estimatedTime: '40 hours',
    priority: 'High',
    status: 'In Progress',
    difficulty: 'Intermediate',
    source: 'External',
    dateAdded: '2024-01-10',
    lastAccessed: '2024-01-19',
    notes: 7,
    favorite: false
  },
  {
    id: 3,
    title: 'TypeScript Best Practices',
    category: 'TypeScript',
    type: 'Article Series',
    progress: 100,
    totalLessons: 8,
    completedLessons: 8,
    timeSpent: '6.5 hours',
    estimatedTime: '6.5 hours',
    priority: 'Medium',
    status: 'Completed',
    difficulty: 'Intermediate',
    source: 'Blog',
    dateAdded: '2024-01-05',
    lastAccessed: '2024-01-18',
    notes: 2,
    favorite: true
  },
  {
    id: 4,
    title: 'AWS Solutions Architecture',
    category: 'Cloud',
    type: 'Certification Path',
    progress: 30,
    totalLessons: 45,
    completedLessons: 13,
    timeSpent: '22.1 hours',
    estimatedTime: '75 hours',
    priority: 'High',
    status: 'In Progress',
    difficulty: 'Advanced',
    source: 'AWS Training',
    dateAdded: '2024-01-08',
    lastAccessed: '2024-01-21',
    notes: 12,
    favorite: false
  },
  {
    id: 5,
    title: 'JavaScript Interview Prep',
    category: 'JavaScript',
    type: 'Practice',
    progress: 85,
    totalLessons: 50,
    completedLessons: 42,
    timeSpent: '15.3 hours',
    estimatedTime: '18 hours',
    priority: 'Medium',
    status: 'In Progress',
    difficulty: 'Intermediate',
    source: 'LeetCode',
    dateAdded: '2024-01-12',
    lastAccessed: '2024-01-20',
    notes: 5,
    favorite: true
  },
  {
    id: 6,
    title: 'Docker Containerization',
    category: 'DevOps',
    type: 'Tutorial',
    progress: 60,
    totalLessons: 15,
    completedLessons: 9,
    timeSpent: '8.7 hours',
    estimatedTime: '14.5 hours',
    priority: 'Low',
    status: 'In Progress',
    difficulty: 'Beginner',
    source: 'YouTube',
    dateAdded: '2024-01-14',
    lastAccessed: '2024-01-17',
    notes: 1,
    favorite: false
  }
];

const categories = ['All Categories', 'React', 'AI/ML', 'TypeScript', 'Cloud', 'JavaScript', 'DevOps'];
const statuses = ['All Status', 'In Progress', 'Completed', 'Not Started', 'Paused'];
const priorities = ['All Priorities', 'High', 'Medium', 'Low'];

export default function StudyListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [filteredItems, setFilteredItems] = useState(studyItems);

  // Calculate stats
  const totalItems = studyItems.length;
  const inProgressItems = studyItems.filter(item => item.status === 'In Progress').length;
  const completedItems = studyItems.filter(item => item.status === 'Completed').length;
  const totalTimeSpent = studyItems.reduce((acc, item) => acc + parseFloat(item.timeSpent), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Paused': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      case 'Medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <BookMarked className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Study List</h1>
              <p className="text-slate-600 dark:text-slate-300">Track your learning progress and manage study materials</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Items</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{inProgressItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{completedItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Time Spent</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{totalTimeSpent.toFixed(1)}h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search study materials..."
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
                    {selectedStatus}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statuses.map(status => (
                    <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Study Items */}
        <div className="space-y-4">
          {studyItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      {item.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      <Badge className={getPriorityColor(item.priority)}>{item.priority} Priority</Badge>
                      <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant="outline">{item.source}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>{item.completedLessons}/{item.totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{item.timeSpent} spent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Last: {item.lastAccessed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        <span>{item.notes} notes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-medium text-slate-900 dark:text-white">{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Est. {item.estimatedTime} total
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Notes
                  </Button>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {item.status === 'Completed' ? 'Review' : 'Continue'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {studyItems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No study materials yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Add your first study item to start tracking your learning progress</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Study Material
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 