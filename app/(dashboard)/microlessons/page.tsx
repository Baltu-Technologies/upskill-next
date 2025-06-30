'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Award, Play, Users, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  course: string;
  duration: number; // minutes
  slides: number;
  xpReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnailUrl: string;
  tags: string[];
  prerequisites: string[];
  completionRate: number;
  rating: number;
  enrolledUsers: number;
}

const featuredLessons: MicroLesson[] = [
  {
    id: 'semiconductor-manufacturing',
    title: 'Introduction to Semiconductor Manufacturing',
    description: 'Discover the intricate processes behind semiconductor manufacturing, from wafer processing to chip packaging. Learn about clean room procedures, photolithography, and quality control.',
    course: 'Upskill Academy: Advanced Manufacturing',
    duration: 12,
    slides: 7,
    xpReward: 250,
    difficulty: 'Intermediate',
    category: 'Semiconductor & Microelectronics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    tags: ['Semiconductors', 'Manufacturing', 'Clean Room', 'Photolithography'],
    prerequisites: ['Basic technical knowledge', 'Computer literacy'],
    completionRate: 89,
    rating: 4.8,
    enrolledUsers: 1247
  },
  {
    id: 'industrial-robotics',
    title: 'Industrial Robotics Fundamentals',
    description: 'Learn how industrial robots are programmed and controlled to perform precise manufacturing tasks with repeatability and accuracy in modern factories.',
    course: 'Upskill Academy: Smart Manufacturing',
    duration: 8,
    slides: 3,
    xpReward: 180,
    difficulty: 'Beginner',
    category: 'Advanced Manufacturing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    tags: ['Robotics', 'Automation', 'Programming', 'Control Systems'],
    prerequisites: ['No prior experience required'],
    completionRate: 94,
    rating: 4.9,
    enrolledUsers: 892
  }
];

const categories = [
  { name: 'All Categories', count: 2, color: 'bg-slate-600' },
  { name: 'Semiconductor & Microelectronics', count: 1, color: 'bg-blue-600' },
  { name: 'Advanced Manufacturing', count: 1, color: 'bg-emerald-600' },
  { name: 'Broadband & Fiber Optics', count: 0, color: 'bg-purple-600' },
  { name: 'Green Technology', count: 0, color: 'bg-green-600' },
];

export default function MicrolessonsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');

  const filteredLessons = selectedCategory === 'All Categories' 
    ? featuredLessons 
    : featuredLessons.filter(lesson => lesson.category === selectedCategory);

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

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">MicroLessons</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Dive deep into specialized topics with interactive, bite-sized lessons designed for the industrial workforce. 
            Master advanced skills through immersive content, 3D models, and hands-on activities.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-blue-200 text-sm">Available Lessons</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">2,139</div>
              <div className="text-emerald-200 text-sm">Total Enrollments</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">4.85</div>
              <div className="text-yellow-200 text-sm">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">430</div>
              <div className="text-purple-200 text-sm">Total XP Available</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                {category.count > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-slate-600 text-white">
                    {category.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === 'All Categories' ? 'Featured Lessons' : selectedCategory}
            </h2>
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              {filteredLessons.length} lessons
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 group overflow-hidden">
                  <div className="relative">
                    <div 
                      className="h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${lesson.thumbnailUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getDifficultyColor(lesson.difficulty)} border`}>
                          {lesson.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm font-medium">{lesson.rating}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button
                          onClick={() => handleStartLesson(lesson.id)}
                          size="lg"
                          className="w-full bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Start Lesson
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl mb-2 line-clamp-2">
                          {lesson.title}
                        </CardTitle>
                        <p className="text-blue-400 text-sm font-medium mb-1">{lesson.course}</p>
                        <p className="text-slate-400 text-sm">{lesson.category}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                      {lesson.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{lesson.slides} slides</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400">{lesson.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {lesson.tags.length > 3 && (
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                          +{lesson.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{lesson.enrolledUsers.toLocaleString()} enrolled</span>
                      </div>
                      <div>
                        {lesson.completionRate}% completion rate
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Lessons Available</h3>
                <p className="text-slate-400">
                  There are currently no lessons available in this category. Check back soon for new content!
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
} 