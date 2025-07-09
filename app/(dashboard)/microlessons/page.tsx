'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Award, Play, Users, Star, Zap, Search, Filter, ChevronDown, Brain, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleCourse, sampleLessons } from '@/data/microlesson/sampleConfig';
import { LessonConfig } from '@/types/microlesson/slide';

interface MicroLessonDisplay {
  id: string;
  title: string;
  description: string;
  course: string;
  lesson: string;
  duration: string;
  slides: number;
  xpReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnailUrl: string;
  tags: string[];
  completionRate: number;
  rating: number;
  enrolledUsers: number;
  config: LessonConfig;
}

export default function MicrolessonsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [sortBy, setSortBy] = useState('Popular');
  const [showFilters, setShowFilters] = useState(false);

  // Convert sample data to display format
  const microlessons: MicroLessonDisplay[] = sampleLessons.flatMap(lesson => 
    lesson.microlessons.map(microlesson => ({
      id: microlesson.id,
      title: microlesson.title,
      description: microlesson.description || 'Interactive microlesson with comprehensive content',
      course: microlesson.course || 'Advanced Manufacturing',
      lesson: lesson.title,
      duration: microlesson.duration || '15 minutes',
      slides: microlesson.slides.length,
      xpReward: microlesson.slides.length * 25,
      difficulty: lesson.difficulty === 'intermediate' ? 'Intermediate' : 'Beginner',
      category: getCategoryFromTags(lesson.tags || []),
      thumbnailUrl: getThumbnailFromCategory(getCategoryFromTags(lesson.tags || [])),
      tags: lesson.tags || [],
      completionRate: Math.floor(Math.random() * 20) + 80,
      rating: 4.5 + Math.random() * 0.5,
      enrolledUsers: Math.floor(Math.random() * 500) + 100,
      config: microlesson
    }))
  );

  function getCategoryFromTags(tags: string[]): string {
    if (tags.includes('semiconductors')) return 'Semiconductor & Microelectronics';
    if (tags.includes('robotics')) return 'Advanced Manufacturing';
    if (tags.includes('automation')) return 'Advanced Manufacturing';
    if (tags.includes('quality')) return 'Quality Control';
    return 'Advanced Manufacturing';
  }

  function getThumbnailFromCategory(category: string): string {
    const thumbnails: Record<string, string> = {
      'Semiconductor & Microelectronics': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      'Advanced Manufacturing': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
      'Quality Control': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
      'Green Technology': 'https://images.unsplash.com/photo-1497436072909-f5e4be1dffb4?w=600&h=400&fit=crop'
    };
    return thumbnails[category] || thumbnails['Advanced Manufacturing'];
  }

  const categories = [
    { name: 'All Categories', count: microlessons.length, color: 'bg-slate-600' },
    { name: 'Semiconductor & Microelectronics', count: microlessons.filter(m => m.category === 'Semiconductor & Microelectronics').length, color: 'bg-blue-600' },
    { name: 'Advanced Manufacturing', count: microlessons.filter(m => m.category === 'Advanced Manufacturing').length, color: 'bg-emerald-600' },
    { name: 'Quality Control', count: microlessons.filter(m => m.category === 'Quality Control').length, color: 'bg-purple-600' },
    { name: 'Green Technology', count: microlessons.filter(m => m.category === 'Green Technology').length, color: 'bg-green-600' },
  ];

  const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = ['Popular', 'Newest', 'Highest Rated', 'Shortest', 'Longest'];

  // Filter and sort microlessons
  const filteredMicrolessons = microlessons
    .filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All Categories' || lesson.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All Levels' || lesson.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Popular': return b.enrolledUsers - a.enrolledUsers;
        case 'Highest Rated': return b.rating - a.rating;
        case 'Shortest': return a.slides - b.slides;
        case 'Longest': return b.slides - a.slides;
        default: return 0;
      }
    });

  const handleStartLesson = (lessonId: string) => {
    router.push(`/microlessons/${lessonId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const totalXP = microlessons.reduce((sum, lesson) => sum + lesson.xpReward, 0);
  const totalEnrollments = microlessons.reduce((sum, lesson) => sum + lesson.enrolledUsers, 0);
  const averageRating = microlessons.reduce((sum, lesson) => sum + lesson.rating, 0) / microlessons.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">MicroLesson Hub</h1>
                <p className="text-slate-400">Specialized learning for the industrial workforce</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/study-hub')}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Study Hub
              </Button>
              <Button
                onClick={() => router.push('/courses/test')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Target className="w-4 h-4 mr-2" />
                View Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{microlessons.length}</div>
              <div className="text-blue-200 text-sm">Available Lessons</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{totalEnrollments.toLocaleString()}</div>
              <div className="text-emerald-200 text-sm">Total Enrollments</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 hover:from-yellow-500/30 hover:to-yellow-600/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</div>
              <div className="text-yellow-200 text-sm">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{totalXP.toLocaleString()}</div>
              <div className="text-purple-200 text-sm">Total XP Available</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search microlessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-800/30 rounded-lg border border-slate-700 p-6 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.name} value={category.name}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sortOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {filteredMicrolessons.length} MicroLesson{filteredMicrolessons.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          </h2>
          {searchTerm && (
            <Badge variant="outline" className="border-blue-500 text-blue-300">
              Results for "{searchTerm}"
            </Badge>
          )}
        </div>

        {/* MicroLessons Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredMicrolessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full group hover:scale-[1.02] hover:shadow-2xl">
                <div className="relative">
                  <div 
                    className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${lesson.thumbnailUrl})` }}
                  >
                    <div className="absolute inset-0 bg-black/40 rounded-t-lg" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getDifficultyColor(lesson.difficulty)} border`}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-blue-600/80 text-white">
                        {lesson.xpReward} XP
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-medium">{lesson.course}</p>
                      <p className="text-slate-300 text-xs">{lesson.lesson}</p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {lesson.duration}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {lesson.slides} slides
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400">{lesson.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {lesson.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {lesson.enrolledUsers.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleStartLesson(lesson.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-transform"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredMicrolessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No microlessons found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedDifficulty('All Levels');
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Clear filters
            </Button>
          </motion.div>
        )}

        {/* Course Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Ready for More?</h3>
                  <p className="text-slate-300 mb-4">
                    Explore our comprehensive course offerings that combine multiple microlessons into structured learning paths.
                  </p>
                  <Button
                    onClick={() => router.push('/courses/test')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 