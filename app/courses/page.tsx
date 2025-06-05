'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star,
  Clock,
  Users,
  Play,
  ChevronRight
} from 'lucide-react';

const courseCategories = [
  {
    title: 'Programming & Development',
    count: 24,
    color: 'bg-blue-500',
    description: 'Full-stack development, APIs, and frameworks'
  },
  {
    title: 'Data Science & AI',
    count: 18,
    color: 'bg-purple-500',
    description: 'Machine learning, analytics, and AI fundamentals'
  },
  {
    title: 'Design & UX',
    count: 15,
    color: 'bg-pink-500',
    description: 'User experience, visual design, and prototyping'
  },
  {
    title: 'Business & Marketing',
    count: 21,
    color: 'bg-green-500',
    description: 'Digital marketing, strategy, and entrepreneurship'
  },
  {
    title: 'Cloud & DevOps',
    count: 12,
    color: 'bg-orange-500',
    description: 'AWS, Azure, Docker, and deployment strategies'
  },
  {
    title: 'Cybersecurity',
    count: 9,
    color: 'bg-red-500',
    description: 'Security fundamentals, ethical hacking, and compliance'
  }
];

const featuredCourses = [
  {
    id: 1,
    title: 'Full-Stack JavaScript Development',
    instructor: 'John Smith',
    duration: '12 weeks',
    students: 2543,
    rating: 4.8,
    image: '/api/placeholder/300/200',
    price: 'Free',
    level: 'Beginner',
    category: 'Programming'
  },
  {
    id: 2,
    title: 'Data Analysis with Python',
    instructor: 'Sarah Johnson',
    duration: '8 weeks',
    students: 1876,
    rating: 4.9,
    image: '/api/placeholder/300/200',
    price: '$49',
    level: 'Intermediate',
    category: 'Data Science'
  },
  {
    id: 3,
    title: 'UX Design Fundamentals',
    instructor: 'Mike Chen',
    duration: '6 weeks',
    students: 3214,
    rating: 4.7,
    image: '/api/placeholder/300/200',
    price: '$29',
    level: 'Beginner',
    category: 'Design'
  },
  {
    id: 4,
    title: 'AWS Cloud Practitioner',
    instructor: 'Emma Davis',
    duration: '10 weeks',
    students: 1543,
    rating: 4.6,
    image: '/api/placeholder/300/200',
    price: '$79',
    level: 'Intermediate',
    category: 'Cloud'
  }
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover new skills and advance your career with our comprehensive course library
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses, skills, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
          <Button variant="outline" className="md:w-auto">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Course Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {category.count} courses
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    View courses
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Courses
            </h2>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {course.price}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {course.title}
                    </h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="lg" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30">
                      <Play className="h-5 w-5 mr-2" />
                      Start Course
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>{course.instructor}</span>
                    <span className="text-blue-600 font-medium">{course.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Total Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50k+</div>
              <div className="text-gray-600 dark:text-gray-300">Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
              <div className="text-gray-600 dark:text-gray-300">Expert Instructors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 