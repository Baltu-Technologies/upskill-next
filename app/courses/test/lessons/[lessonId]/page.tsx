'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Target, CheckCircle2, BookOpen, ArrowLeft, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { sampleCourse } from '@/data/microlesson/sampleConfig';
import { useRouter, useParams } from 'next/navigation';

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  // Check if params exists and has required properties
  if (!params || !params.lessonId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Invalid Lesson ID</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Required lesson parameter is missing.</p>
          <Button onClick={() => router.push('/courses/test/lessons')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Card>
      </div>
    );
  }
  
  const lessonId = params.lessonId as string;
  
  // Find the lesson in the course
  const lesson = sampleCourse.lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Lesson Not Found</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">The requested lesson could not be found.</p>
          <Button onClick={() => router.push('/courses/test/lessons')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Card>
      </div>
    );
  }

  const handleStartMicrolesson = (microlessonId: string) => {
    router.push(`/courses/test/lessons/${lessonId}/microlessons/${microlessonId}`);
  };

  const handleBackToLessons = () => {
    router.push('/courses/test/lessons');
  };

  // Mock progress for demo
  const lessonProgress = 35;
  const completedMicrolessons = 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToLessons}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lessons
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {lesson.title}
                </h1>
                <Badge variant="outline">{lesson.difficulty}</Badge>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
                {lesson.description}
              </p>
              
              {/* Lesson Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="w-5 h-5" />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Play className="w-5 h-5" />
                  <span>{lesson.microlessons.length} MicroLessons</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Target className="w-5 h-5" />
                  <span>{lesson.objectives.length} Objectives</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Users className="w-5 h-5" />
                  <span>1,234 students</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>4.8 (156 reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Lesson Progress</div>
              <div className="flex items-center gap-3">
                <Progress value={lessonProgress} className="w-32" />
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {lessonProgress}%
                </span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {completedMicrolessons} of {lesson.microlessons.length} completed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Objectives */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Learning Objectives
              </h2>
              <div className="space-y-4">
                {lesson.objectives.map((objective, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 text-lg">{objective}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* MicroLessons */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  MicroLessons ({lesson.microlessons.length})
                </h2>
                <Badge variant="secondary">
                  {completedMicrolessons} completed
                </Badge>
              </div>
              
              <div className="space-y-4">
                {lesson.microlessons.map((microlesson, index) => (
                  <motion.div
                    key={microlesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-6">
                        {/* MicroLesson Number */}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            index === 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
                          }`}>
                            {index === 0 ? (
                              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            ) : (
                              <span className="text-blue-600 dark:text-blue-400 font-bold">{index + 1}</span>
                            )}
                          </div>
                        </div>

                        {/* MicroLesson Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {microlesson.title}
                              </h3>
                              {microlesson.description && (
                                <p className="text-slate-600 dark:text-slate-300 mb-3">
                                  {microlesson.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {microlesson.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  {microlesson.totalSlides} slides
                                </span>
                                {index === 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => handleStartMicrolesson(microlesson.id)}
                              className={`${
                                index === 0 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-blue-600 hover:bg-blue-700'
                              } text-white px-6`}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {index === 0 ? 'Review' : 'Start'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Completion Criteria */}
            {lesson.completionCriteria && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Completion Requirements
                </h2>
                <div className="space-y-4">
                  {lesson.completionCriteria.minimumScore && (
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-700 dark:text-slate-300">
                        Achieve minimum score of {lesson.completionCriteria.minimumScore}%
                      </span>
                    </div>
                  )}
                  {lesson.completionCriteria.requiredMicrolessons && (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-slate-700 dark:text-slate-300">
                        Complete all required MicroLessons
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleStartMicrolesson(lesson.microlessons[completedMicrolessons]?.id || lesson.microlessons[0].id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Download Materials
                </Button>
              </div>
            </Card>

            {/* Progress Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Progress Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">{lessonProgress}%</span>
                  </div>
                  <Progress value={lessonProgress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {completedMicrolessons}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                      {lesson.microlessons.length - completedMicrolessons}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Remaining
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Lesson Tags */}
            {lesson.tags && lesson.tags.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Course Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Course Navigation */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Course Navigation
              </h3>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/courses/test')}
                >
                  Course Overview
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={handleBackToLessons}
                >
                  All Lessons
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/courses/test/progress')}
                >
                  Progress Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 