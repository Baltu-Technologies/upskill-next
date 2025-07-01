'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Clock, BookOpen, Target, CheckCircle2, Play, ChevronDown, Zap, Trophy, FileCheck, Brain, Award, Star, X, RotateCcw, Eye, ArrowRight, ArrowDown, Timer, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { sampleCourse } from '@/data/microlesson/sampleConfig';

export default function CourseLessonsPage() {
  const router = useRouter();
  const course = sampleCourse;
  
  // Calculate totals for header
  const totalLessons = course.lessons.length;
  const totalMicrolessons = course.lessons.reduce((total, lesson) => total + lesson.microlessons.length, 0);
  const totalXP = totalMicrolessons * 50; // 50 XP per microlesson

  const handleStartCourse = () => {
    const lessonsSection = document.getElementById('lessons-list');
    if (lessonsSection) {
      lessonsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewCourseOverview = () => {
    router.push('/courses/test');
  };
  
  // Modal state for quiz results
  const [quizModal, setQuizModal] = useState<{
    type: 'lesson' | 'microlesson';
    id: string;
    title: string;
    score: number;
    isCompleted: boolean;
  } | null>(null);

  // Accordion state for microlessons
  const [expandedMicrolessons, setExpandedMicrolessons] = useState<Record<string, boolean>>({});

  const toggleMicrolesson = (microlessonId: string) => {
    setExpandedMicrolessons(prev => ({
      ...prev,
      [microlessonId]: !prev[microlessonId]
    }));
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/courses/test/lessons/${lessonId}`);
  };

  const handleStartMicrolesson = (lessonId: string, microlessonId: string) => {
    router.push(`/courses/test/lessons/${lessonId}/microlessons/${microlessonId}`);
  };

  const handlePracticeAssessment = (type: 'lesson' | 'microlesson', id: string) => {
    router.push(`/courses/test/assessments/practice/${type}/${id}`);
  };

  const handleReviewAssessment = (type: 'lesson' | 'microlesson', id: string) => {
    router.push(`/courses/test/assessments/review/${type}/${id}`);
  };

  const handleQuizClick = (type: 'lesson' | 'microlesson', id: string, title: string, score: number, isCompleted: boolean) => {
    if (isCompleted) {
      setQuizModal({ type, id, title, score, isCompleted });
    } else {
      router.push(`/courses/test/assessments/quiz/${type}/${id}`);
    }
  };

  const handleRetakeQuiz = () => {
    if (quizModal) {
      router.push(`/courses/test/assessments/quiz/${quizModal.type}/${quizModal.id}`);
      setQuizModal(null);
    }
  };

  const handleViewResults = () => {
    if (quizModal) {
      router.push(`/courses/test/assessments/results/${quizModal.type}/${quizModal.id}`);
      setQuizModal(null);
    }
  };

  const getStarRating = (score: number | null) => {
    if (score === null) return 0;
    if (score >= 100) return 3;
    if (score >= 90) return 2;
    if (score >= 80) return 1;
    return 0;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
      />
    ));
  };

  // Sample microlesson progress data for demonstration
  const getMicrolessonProgress = (lessonId: string) => {
    if (lessonId === 'semiconductor-fundamentals') {
      return [
        { id: 'clean-room-protocols', title: 'Clean Room Protocols & Safety', status: 'completed', quizCompleted: true, quizScore: 92 },
        { id: 'wafer-fabrication-basics', title: 'Wafer Fabrication Process Overview', status: 'in-progress', quizCompleted: false, quizScore: null },
        { id: 'lithography-fundamentals', title: 'Photolithography & Pattern Transfer', status: 'not-started', quizCompleted: false, quizScore: null }
      ];
    }
    return [];
  };

  // Calculate lesson progress based on microlesson completion
  const getLessonProgress = (lessonId: string) => {
    const microlessons = getMicrolessonProgress(lessonId);
    if (microlessons.length === 0) return 'not-started';
    
    const completedCount = microlessons.filter(ml => ml.status === 'completed').length;
    if (completedCount === microlessons.length) return 'completed';
    if (completedCount > 0) return 'in-progress';
    return 'not-started';
  };

  const isLessonQuizAvailable = (lessonId: string) => {
    const microlessons = getMicrolessonProgress(lessonId);
    // Only allow quiz if there are microlessons AND all are completed with quiz done
    return microlessons.length > 0 && microlessons.every(ml => ml.status === 'completed' && ml.quizCompleted);
  };

  // Calculate overall progress (mock data)
  const overallProgress: number = 35;

  // Course state logic - determines button appearance and behavior
  type CourseState = 'not-started' | 'in-progress' | 'completed';
  
  // Mock course state based on overall progress - in real app this would come from user data/API
  const getCourseState = (): CourseState => {
    if (overallProgress <= 0) return 'not-started';
    if (overallProgress >= 100) return 'completed';
    return 'in-progress';
  };
  
  const courseState = getCourseState();

  const getCourseButtonConfig = () => {
    const scrollAction = () => {
      const lessonsSection = document.getElementById('lessons-list');
      if (lessonsSection) {
        lessonsSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    switch (courseState) {
      case 'not-started':
        return {
          text: 'Start Course',
          icon: Play,
          className: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          action: scrollAction
        };
      case 'in-progress':
        return {
          text: 'Continue Course',
          icon: Play,
          className: 'bg-blue-600 hover:bg-blue-700',
          action: scrollAction
        };
      case 'completed':
        return {
          text: 'Review Course',
          icon: CheckCircle2,
          className: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700',
          action: scrollAction
        };
      default:
        return {
          text: 'Start Course',
          icon: Play,
          className: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          action: scrollAction
        };
    }
  };

  const buttonConfig = getCourseButtonConfig();

  return (
    <div className="min-h-screen bg-black">
      {/* Compact Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg"
            alt="Technician with wafer in semiconductor fabrication facility"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl">
            {/* Course Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/25">
                <Image
                  src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=100&h=100&fit=crop&crop=center"
                  alt="Course"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-600/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl md:text-3xl">SC</span>
                </div>
              </div>
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Basics of{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                Semiconductor
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mb-6"
            >
              {course.description}
            </motion.p>

            {/* Course Meta */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 text-gray-300 mb-8"
            >
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-medium">{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Target className="w-6 h-6 text-green-400" />
                <span className="text-lg font-medium">{totalMicrolessons} Microlessons</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-medium">{totalXP} XP</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-start"
            >
              <Button
                onClick={buttonConfig.action}
                className={`${buttonConfig.className} text-white font-bold px-12 py-6 text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:scale-105 group`}
              >
                <buttonConfig.icon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                {buttonConfig.text}
                <ArrowDown className="w-6 h-6 ml-3 group-hover:translate-y-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Course Progress Section */}
      <div className="relative bg-black/50 border-b border-white/10 mx-4 md:mx-8 my-4 rounded-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl">
            <div className="text-left mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Course Progress</h3>
              <p className="text-gray-400 text-sm">Complete all lessons to earn your certificate</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">Overall Progress</span>
                <span className="text-blue-400 font-bold">{overallProgress}% Complete</span>
              </div>
              <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 rounded-full"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                <span>1 of {totalLessons} lessons completed</span>
                <span>{Math.round((overallProgress / 100) * totalXP)} / {totalXP} XP earned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section - Condensed Lessons */}
      <div id="lessons-list" className="relative bg-gradient-to-br from-gray-950 via-blue-950/20 to-purple-950/20">
        <div className="container mx-auto px-4 py-6">
          {/* Lessons List */}
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              // Use the new progress tracking system
              const lessonProgress = getLessonProgress(lesson.id);
              const microlessons = getMicrolessonProgress(lesson.id);

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:border-blue-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 relative">
                    <div className="p-5">
                      {/* Lesson Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Lesson Number Badge with Status */}
                          <div className="relative flex-shrink-0">
                            <div className={
                              lessonProgress === 'completed' 
                                ? 'w-20 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-emerald-500 to-green-600 shadow-green-500/20'
                                : lessonProgress === 'in-progress'
                                ? 'w-20 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/20'
                                : 'w-20 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-600/10'
                            }>
                              <span className="text-sm font-bold text-white">Lesson {index + 1}</span>
                            </div>
                            
                            {/* Status Indicator */}
                            <div className={
                              lessonProgress === 'completed' 
                                ? 'absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center bg-emerald-400'
                                : lessonProgress === 'in-progress'
                                ? 'absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center bg-blue-400'
                                : 'absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center bg-gray-500'
                            }>
                              {lessonProgress === 'completed' ? (
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                              ) : lessonProgress === 'in-progress' ? (
                                <Timer className="w-2.5 h-2.5 text-white" />
                              ) : (
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          {/* Lesson Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {lesson.title}
                              </h2>
                              
                              {/* Elegant Status Badge */}
                              <div className={
                                lessonProgress === 'completed'
                                  ? 'px-3 py-1 rounded-full border backdrop-blur-sm transition-all duration-300 bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : lessonProgress === 'in-progress' 
                                  ? 'px-3 py-1 rounded-full border backdrop-blur-sm transition-all duration-300 bg-blue-500/10 border-blue-500/30 text-blue-400'
                                  : 'px-3 py-1 rounded-full border backdrop-blur-sm transition-all duration-300 bg-gray-500/10 border-gray-500/30 text-gray-400'
                              }>
                                <span className="text-xs font-medium">
                                  {lessonProgress === 'completed' ? 'Completed' : 
                                   lessonProgress === 'in-progress' ? 'In Progress' : 
                                   'Not Started'}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                              {lesson.description}
                            </p>
                          
                            {/* Lesson Meta Info */}
                            <div className="flex items-center gap-6 text-xs text-gray-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                <span>4 Learning Objectives</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                <span>Microlessons ({microlessons.length})</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                <span>Lesson Progress</span>
                                <span>
                                  {lessonProgress === 'completed' ? '100%' : 
                                   lessonProgress === 'in-progress' ? '33%' : 
                                   '0%'}
                                </span>
                              </div>
                              <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                                <div 
                                  className={
                                    lessonProgress === 'completed' 
                                      ? 'absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500 rounded-full'
                                      : lessonProgress === 'in-progress'
                                      ? 'absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full'
                                      : 'absolute top-0 left-0 h-full bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-500 rounded-full'
                                  }
                                  style={{ 
                                    width: lessonProgress === 'completed' ? '100%' : 
                                           lessonProgress === 'in-progress' ? '33%' : 
                                           '0%' 
                                  }}
                                />
                              </div>
                            </div>

                            {/* Lesson Actions */}
                            <div className="flex items-center gap-3 mb-4">
                              <Button
                                size="sm"
                                onClick={() => handleStartLesson(lesson.id)}
                                className={
                                  lessonProgress === 'completed'
                                    ? 'px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-all duration-300 text-sm'
                                    : lessonProgress === 'in-progress' 
                                    ? 'px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-medium transition-all duration-300 text-sm'
                                    : 'px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-full font-medium transition-all duration-300 text-sm'
                                }
                              >
                                <Play className="w-3 h-3 mr-1" />
                                {lessonProgress === 'completed' ? 'Review' : 
                                 lessonProgress === 'in-progress' ? 'Continue' : 
                                 'Start Lesson'}
                              </Button>

                              {/* Review Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReviewAssessment('lesson', lesson.id)}
                                disabled={lessonProgress !== 'completed'}
                                className={
                                  lessonProgress === 'completed'
                                    ? 'px-3 py-2 border-purple-500/50 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-300 rounded-full text-xs'
                                    : 'px-3 py-2 border-gray-600/50 text-gray-500 cursor-not-allowed transition-all duration-300 rounded-full text-xs'
                                }
                              >
                                <FileCheck className="w-3 h-3 mr-1" />
                                Review
                                {lessonProgress === 'completed' && (
                                  <Badge variant="secondary" className="ml-1 bg-yellow-500/20 text-yellow-400 text-xs">
                                    +10 XP
                                  </Badge>
                                )}
                              </Button>

                              {/* Quiz Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuizClick('lesson', lesson.id, lesson.title, 85, isLessonQuizAvailable(lesson.id))}
                                disabled={!isLessonQuizAvailable(lesson.id)}
                                className={
                                  isLessonQuizAvailable(lesson.id)
                                    ? 'px-3 py-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 rounded-full text-xs'
                                    : 'px-3 py-2 border-gray-600/50 text-gray-500 cursor-not-allowed transition-all duration-300 rounded-full text-xs'
                                }
                              >
                                <Trophy className="w-3 h-3 mr-1" />
                                Quiz
                                {isLessonQuizAvailable(lesson.id) && (
                                  <div className="ml-1 flex items-center">
                                    {renderStars(getStarRating(85))}
                                  </div>
                                )}
                              </Button>
                            </div>

                            {/* Microlessons Section */}
                            {microlessons.length > 0 && (
                              <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                  <Brain className="w-4 h-4 text-blue-400" />
                                  Microlessons ({microlessons.length})
                                </h3>

                                <div className="space-y-2">
                                  {microlessons.map((microlesson, mlIndex) => {
                                    const isExpanded = expandedMicrolessons[microlesson.id];
                                    
                                    return (
                                      <div key={microlesson.id} className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                                        {/* Microlesson Header - Always Visible */}
                                        <div className="p-4">
                                          <div className="flex items-center justify-between gap-4">
                                            {/* Left Section - Icon & Title */}
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                              {/* Status Icon */}
                                              <div className={
                                                microlesson.status === 'completed' 
                                                  ? 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500'
                                                  : microlesson.status === 'in-progress'
                                                  ? 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600'
                                                  : 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600'
                                              }>
                                                {microlesson.status === 'completed' ? (
                                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                                ) : microlesson.status === 'in-progress' ? (
                                                  <Timer className="w-4 h-4 text-white" />
                                                ) : (
                                                  <BookOpen className="w-4 h-4 text-white" />
                                                )}
                                              </div>

                                              {/* Title & Duration */}
                                              <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-white mb-0.5 truncate">
                                                  {microlesson.title}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                  <div className="flex items-center gap-1">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    <span>15 min</span>
                                                  </div>
                                                  <Badge variant="secondary" className={
                                                    microlesson.status === 'completed' 
                                                      ? 'bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5'
                                                      : microlesson.status === 'in-progress'
                                                      ? 'bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5'
                                                      : 'bg-gray-600/20 text-gray-400 text-xs px-2 py-0.5'
                                                  }>
                                                    {microlesson.status === 'completed' ? 'Completed' : 
                                                     microlesson.status === 'in-progress' ? 'In Progress' : 
                                                     'Not Started'}
                                                  </Badge>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                              {/* Main Action Button */}
                                              <Button
                                                size="sm"
                                                onClick={() => handleStartMicrolesson(lesson.id, microlesson.id)}
                                                className={
                                                  microlesson.status === 'completed'
                                                    ? 'px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all duration-300 text-xs'
                                                    : microlesson.status === 'in-progress' 
                                                    ? 'px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 text-xs'
                                                    : 'px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-lg font-medium transition-all duration-300 text-xs'
                                                }
                                              >
                                                {microlesson.status === 'completed' ? 'Complete' : 
                                                 microlesson.status === 'in-progress' ? 'Continue' : 
                                                 'Start'}
                                              </Button>

                                              {/* Review Button */}
                                              <Button
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleReviewAssessment('microlesson', microlesson.id)}
                                                disabled={microlesson.status !== 'completed'}
                                                className={
                                                  microlesson.status === 'completed'
                                                    ? 'px-2 py-1.5 border-purple-500/50 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-300 rounded-lg text-xs'
                                                    : 'px-2 py-1.5 border-gray-600/50 text-gray-500 cursor-not-allowed transition-all duration-300 rounded-lg text-xs'
                                                }
                                              >
                                                Review
                                                {microlesson.status === 'completed' && (
                                                  <Badge variant="secondary" className="ml-1 bg-yellow-500/20 text-yellow-400 text-xs">
                                                    +10
                                                  </Badge>
                                                )}
                                              </Button>

                                              {/* Quiz Button */}
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleQuizClick('microlesson', microlesson.id, microlesson.title, microlesson.quizScore || 0, microlesson.quizCompleted)}
                                                disabled={microlesson.status !== 'completed'}
                                                className={
                                                  microlesson.status === 'completed'
                                                    ? 'px-2 py-1.5 border-yellow-500/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 rounded-lg text-xs'
                                                    : 'px-2 py-1.5 border-gray-600/50 text-gray-500 cursor-not-allowed transition-all duration-300 rounded-lg text-xs'
                                                }
                                              >
                                                Quiz
                                                {microlesson.quizCompleted && (
                                                  <div className="ml-1 flex items-center">
                                                    {renderStars(getStarRating(microlesson.quizScore))}
                                                  </div>
                                                )}
                                              </Button>

                                              {/* Accordion Toggle */}
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleMicrolesson(microlesson.id)}
                                                className="p-1 text-gray-400 hover:text-white transition-colors"
                                              >
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                              </Button>
                                            </div>
                                          </div>

                                          {/* Expandable Content */}
                                          <AnimatePresence>
                                            {isExpanded && (
                                              <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                              >
                                                <div className="pt-3 border-t border-white/10 mt-3">
                                                  <p className="text-sm text-gray-300 mb-3">
                                                    Comprehensive overview of clean room protocols, safety procedures, and contamination control measures essential for semiconductor manufacturing.
                                                  </p>
                                                  
                                                  <div className="space-y-2">
                                                    <h5 className="text-sm font-semibold text-white">Learning Outcomes:</h5>
                                                    <ul className="text-xs text-gray-400 space-y-1 ml-4">
                                                      <li>• Understanding clean room classifications and standards</li>
                                                      <li>• Proper gowning and degowning procedures</li>
                                                      <li>• Contamination control and prevention strategies</li>
                                                      <li>• Emergency protocols and safety measures</li>
                                                    </ul>
                                                  </div>
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {quizModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setQuizModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Quiz Results</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuizModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">{quizModal.score}%</div>
                <div className="flex justify-center mb-3">
                  {renderStars(getStarRating(quizModal.score))}
                </div>
                <p className="text-gray-300">{quizModal.title}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleViewResults}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  View Detailed Results
                </Button>
                <Button
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz (+5 XP)
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}