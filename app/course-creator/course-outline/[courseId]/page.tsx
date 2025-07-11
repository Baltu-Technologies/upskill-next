'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Clock, BookOpen, Target, CheckCircle2, Play, ChevronDown, Zap, Trophy, FileCheck, Brain, Award, Star, X, RotateCcw, Eye, ArrowRight, ArrowDown, Timer, Plus, Save, Edit3, Upload, Camera, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface CourseData {
  title: string;
  description: string;
  industry: string;
  duration: string;
  skillLevel: 'entry' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningOutcomes: string[];
  lessons: SimpleLesson[];
  microlessons: SimpleMicrolesson[];
  assessments: SimpleAssessment[];
}

interface SimpleLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  microlessons: SimpleMicrolesson[];
}

interface SimpleMicrolesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'interactive' | 'quiz' | 'text';
  content: string;
}

interface SimpleAssessment {
  id: string;
  title: string;
  type: string;
  description: string;
  questions: number;
  duration: string;
  passingScore: number;
}

export default function CourseOutlinePage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingMicrolessonId, setEditingMicrolessonId] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState('/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg');
  const [isEditingHero, setIsEditingHero] = useState(false);
  
  // Generation state management
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneratingLesson, setCurrentGeneratingLesson] = useState<string | null>(null);
  const [generatedMicrolessons, setGeneratedMicrolessons] = useState<Set<string>>(new Set());
  const [expandedMicrolessons, setExpandedMicrolessons] = useState<Record<string, boolean>>({});
  const [generationComplete, setGenerationComplete] = useState(false);

  useEffect(() => {
    // Load course data from localStorage
    const savedData = localStorage.getItem('courseData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCourseData(parsedData);
        
        // Check if microlessons need to be generated
        const needsGeneration = parsedData.lessons.some((lesson: SimpleLesson) => 
          !lesson.microlessons || lesson.microlessons.length === 0
        );
        
        if (needsGeneration) {
          setIsGenerating(true);
        }
      } catch (error) {
        console.error('Error loading course data:', error);
        router.push('/course-creator/create');
      }
    } else {
      router.push('/course-creator/create');
    }
  }, [router]);

  // Generation effect
  useEffect(() => {
    if (!isGenerating || !courseData) return;

    const generateMicrolessons = async () => {
      const totalLessons = courseData.lessons.length;
      let processedLessons = 0;

      // Clear existing microlessons before generation
      setCourseData(prevData => {
        if (!prevData) return prevData;
        const clearedLessons = prevData.lessons.map(l => ({ ...l, microlessons: [] }));
        return { ...prevData, lessons: clearedLessons };
      });

      for (const lesson of courseData.lessons) {
        setCurrentGeneratingLesson(lesson.id);
        
        // Simulate generating 3-5 microlessons per lesson
        const numMicrolessons = Math.floor(Math.random() * 3) + 3; // 3-5 microlessons
        const newMicrolessons: SimpleMicrolesson[] = [];
        
        for (let i = 0; i < numMicrolessons; i++) {
          // Simulate generation delay
          await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
          
          const types: ('video' | 'interactive' | 'quiz' | 'text')[] = ['video', 'interactive', 'quiz', 'text'];
          const type = types[Math.floor(Math.random() * types.length)];
          
          const microlesson: SimpleMicrolesson = {
            id: `microlesson-${Date.now()}-${i}`,
            title: `${lesson.title} - Part ${i + 1}`,
            duration: '5-8 min',
            type,
            content: `Detailed content for ${lesson.title} part ${i + 1}. This microlesson covers key concepts and practical applications.`
          };
          
          newMicrolessons.push(microlesson);
          
          // Update generated set for animation
          setGeneratedMicrolessons(prev => new Set([...Array.from(prev), microlesson.id]));
        }
        
        // Update the lesson with new microlessons
        setCourseData(prevData => {
          if (!prevData) return prevData;
          
          const updatedLessons = prevData.lessons.map(l => 
            l.id === lesson.id ? { ...l, microlessons: newMicrolessons } : l
          );
          
          const newData = { ...prevData, lessons: updatedLessons };
          localStorage.setItem('courseData', JSON.stringify(newData));
          return newData;
        });
        
        processedLessons++;
        
        // Update progress based on completed lessons
        const progress = (processedLessons / totalLessons) * 100;
        setGenerationProgress(progress);
      }
      
      // Complete generation
      setCurrentGeneratingLesson(null);
      setGenerationProgress(100);
      setIsGenerating(false);
      setGenerationComplete(true);
      
      // Show completion message for 3 seconds
      setTimeout(() => {
        setGenerationComplete(false);
      }, 3000);
    };

    generateMicrolessons();
  }, [isGenerating, courseData]);

  if (!courseData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading course data...</p>
        </div>
      </div>
    );
  }

  const updateCourseData = (updates: Partial<CourseData>) => {
    const newData = { ...courseData, ...updates };
    setCourseData(newData);
    localStorage.setItem('courseData', JSON.stringify(newData));
  };

  const updateLesson = (lessonId: string, updates: Partial<SimpleLesson>) => {
    const updatedLessons = courseData.lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    );
    updateCourseData({ lessons: updatedLessons });
  };

  const updateMicrolesson = (lessonId: string, microlessonId: string, updates: Partial<SimpleMicrolesson>) => {
    const updatedLessons = courseData.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const updatedMicrolessons = lesson.microlessons.map(microlesson =>
          microlesson.id === microlessonId ? { ...microlesson, ...updates } : microlesson
        );
        return { ...lesson, microlessons: updatedMicrolessons };
      }
      return lesson;
    });
    updateCourseData({ lessons: updatedLessons });
  };

  const addMicrolesson = (lessonId: string) => {
    const newMicrolesson: SimpleMicrolesson = {
      id: `microlesson-${Date.now()}`,
      title: 'New Microlesson',
      duration: '5 min',
      type: 'text',
      content: 'Describe the microlesson content here...'
    };

    const updatedLessons = courseData.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return { ...lesson, microlessons: [...lesson.microlessons, newMicrolesson] };
      }
      return lesson;
    });
    updateCourseData({ lessons: updatedLessons });
  };

  const deleteMicrolesson = (lessonId: string, microlessonId: string) => {
    const updatedLessons = courseData.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return { 
          ...lesson, 
          microlessons: lesson.microlessons.filter(ml => ml.id !== microlessonId) 
        };
      }
      return lesson;
    });
    updateCourseData({ lessons: updatedLessons });
  };

  const handleSaveCourse = () => {
    // This would save the course to the database
    console.log('Saving course:', courseData);
    // For now, just show a success message and redirect
    alert('Course saved successfully!');
    router.push('/course-creator');
  };

  const handlePublishCourse = () => {
    // This would publish the course
    console.log('Publishing course:', courseData);
    alert('Course published successfully!');
    router.push('/course-creator');
  };

  const toggleMicrolesson = (microlessonId: string) => {
    setExpandedMicrolessons(prev => ({
      ...prev,
      [microlessonId]: !prev[microlessonId]
    }));
  };

  const totalLessons = courseData.lessons.length;
  const totalMicrolessons = courseData.lessons.reduce((total, lesson) => total + lesson.microlessons.length, 0);
  const totalXP = totalMicrolessons * 50;

  return (
    <div className="min-h-screen bg-black">
      {/* Compact Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Course hero image"
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
                  <span className="text-white font-bold text-2xl md:text-3xl">
                    {courseData.title.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Edit Hero Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingHero(!isEditingHero)}
                className="ml-auto border-white/20 text-white hover:bg-white/10"
              >
                <Camera className="w-4 h-4 mr-2" />
                Edit Hero
              </Button>
            </motion.div>
            
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4"
            >
              {isEditing ? (
                <Input
                  value={courseData.title}
                  onChange={(e) => updateCourseData({ title: e.target.value })}
                  className="text-3xl md:text-5xl lg:text-6xl font-bold bg-transparent border-2 border-white/20 text-white placeholder-white/50 mb-4"
                  placeholder="Course Title"
                />
              ) : (
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    {courseData.title}
                  </span>
                </h1>
              )}
            </motion.div>
            
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              {isEditing ? (
                <Textarea
                  value={courseData.description}
                  onChange={(e) => updateCourseData({ description: e.target.value })}
                  className="text-lg md:text-xl bg-transparent border-2 border-white/20 text-white placeholder-white/50 resize-none"
                  placeholder="Course Description"
                  rows={3}
                />
              ) : (
                <p className="text-lg md:text-xl text-slate-300 max-w-3xl">
                  {courseData.description}
                </p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 mb-8"
            >
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="font-medium">{courseData.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <BookOpen className="w-5 h-5 text-green-400" />
                <span className="font-medium">{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-medium">{totalMicrolessons} Microlessons</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">{totalXP} XP</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={() => setIsEditing(!isEditing)}
                size="lg"
                disabled={isGenerating}
                className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isEditing ? <Save className="w-5 h-5 mr-2" /> : <Edit3 className="w-5 h-5 mr-2" />}
                {isEditing ? 'Save Changes' : 'Edit Course'}
              </Button>
              
              <Button
                onClick={handleSaveCourse}
                variant="outline"
                size="lg"
                disabled={isGenerating}
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </Button>
              
              <Button
                onClick={handlePublishCourse}
                size="lg"
                disabled={isGenerating}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Publish Course
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Generation Progress */}
          <AnimatePresence>
            {(isGenerating || generationComplete) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    {isGenerating ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                          <h3 className="text-xl font-semibold text-purple-200">
                            Generating Course Content
                          </h3>
                        </div>
                        
                        <p className="text-purple-300 mb-6">
                          {currentGeneratingLesson 
                            ? `Creating microlessons for: ${courseData.lessons.find(l => l.id === currentGeneratingLesson)?.title || 'Current lesson'}`
                            : 'Preparing to generate microlessons for all lessons...'
                          }
                        </p>
                        
                        <div className="space-y-3">
                          <Progress 
                            value={generationProgress} 
                            className="h-3 bg-purple-900/50"
                          />
                          <p className="text-sm text-purple-300">
                            {Math.round(generationProgress)}% Complete
                          </p>
                        </div>
                      </div>
                    ) : generationComplete ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                          <h3 className="text-xl font-semibold text-green-200">
                            Course Generation Complete!
                          </h3>
                        </div>
                        
                        <p className="text-green-300 mb-4">
                          All microlessons have been successfully generated. Your course is ready for editing and customization.
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                          <Sparkles className="w-4 h-4" />
                          <span>Ready to edit and publish</span>
                        </div>
                      </motion.div>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lessons List */}
          <div className="space-y-6" id="lessons-list">
            {courseData.lessons.map((lesson, lessonIndex) => (
              <Card key={lesson.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                          Lesson {lessonIndex + 1}
                        </Badge>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{lesson.duration}</span>
                        </div>
                      </div>
                      
                      {editingLessonId === lesson.id ? (
                        <div className="space-y-3">
                          <Input
                            value={lesson.title}
                            onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                            className="text-xl font-bold bg-slate-700/50 border-slate-600/50 text-white"
                            placeholder="Lesson Title"
                          />
                          <Textarea
                            value={lesson.description}
                            onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                            className="bg-slate-700/50 border-slate-600/50 text-white"
                            placeholder="Lesson Description"
                            rows={3}
                          />
                        </div>
                      ) : (
                        <div>
                          <CardTitle className="text-xl text-white mb-2">{lesson.title}</CardTitle>
                          <p className="text-slate-300">{lesson.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLessonId(editingLessonId === lesson.id ? null : lesson.id)}
                        disabled={isGenerating}
                        className="text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingLessonId === lesson.id ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Microlessons Section */}
                  {lesson.microlessons.length > 0 || (currentGeneratingLesson === lesson.id && isGenerating) ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Brain className="w-4 h-4 text-blue-400" />
                          Microlessons ({lesson.microlessons.length})
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addMicrolesson(lesson.id)}
                          disabled={isGenerating}
                          className="text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {/* Show generating placeholder if this lesson is currently being generated */}
                        {currentGeneratingLesson === lesson.id && isGenerating && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-purple-900/60 to-purple-800/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                              <span className="text-sm text-purple-300">Generating microlessons...</span>
                            </div>
                            <div className="space-y-1">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="h-3 bg-purple-800/30 rounded animate-pulse"></div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        
                        {lesson.microlessons.map((microlesson, mlIndex) => {
                          const isExpanded = expandedMicrolessons[microlesson.id];
                          
                          return (
                            <motion.div
                              key={microlesson.id}
                              initial={generatedMicrolessons.has(microlesson.id) ? { opacity: 0, scale: 0.8 } : {}}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                              className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
                            >
                              {/* Microlesson Header - Always Visible */}
                              <div className="p-4">
                                <div className="flex items-center justify-between gap-4">
                                  {/* Left Section - Icon & Title */}
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {/* Status Icon */}
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
                                      <BookOpen className="w-4 h-4 text-white" />
                                    </div>

                                    {/* Title & Duration */}
                                    <div className="flex-1 min-w-0">
                                      {editingMicrolessonId === microlesson.id ? (
                                        <div className="space-y-2">
                                          <Input
                                            value={microlesson.title}
                                            onChange={(e) => updateMicrolesson(lesson.id, microlesson.id, { title: e.target.value })}
                                            className="text-sm bg-slate-600/50 border-slate-500/50 text-white"
                                            placeholder="Microlesson Title"
                                          />
                                        </div>
                                      ) : (
                                        <>
                                          <h4 className="text-sm font-semibold text-white mb-0.5 truncate">
                                            {microlesson.title}
                                          </h4>
                                          <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                              <Clock className="w-2.5 h-2.5" />
                                              <span>{microlesson.duration}</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-gray-600/20 text-gray-400 text-xs px-2 py-0.5">
                                              Not Started
                                            </Badge>
                                            {/* Show new indicator for recently generated microlessons */}
                                            {generatedMicrolessons.has(microlesson.id) && (
                                              <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 }}
                                              >
                                                <Badge className="text-xs bg-green-900/50 text-green-300 border-green-800/50">
                                                  New
                                                </Badge>
                                              </motion.div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Edit Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingMicrolessonId(editingMicrolessonId === microlesson.id ? null : microlesson.id)}
                                      disabled={isGenerating}
                                      className="px-2 py-1.5 text-slate-400 hover:text-white transition-all duration-300 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </Button>

                                    {/* Delete Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteMicrolesson(lesson.id, microlesson.id)}
                                      disabled={isGenerating}
                                      className="px-2 py-1.5 text-slate-400 hover:text-red-400 transition-all duration-300 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <X className="w-3 h-3" />
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
                                        {editingMicrolessonId === microlesson.id ? (
                                          <Textarea
                                            value={microlesson.content}
                                            onChange={(e) => updateMicrolesson(lesson.id, microlesson.id, { content: e.target.value })}
                                            className="text-xs bg-slate-600/50 border-slate-500/50 text-white"
                                            placeholder="Microlesson Content"
                                            rows={3}
                                          />
                                        ) : (
                                          <p className="text-sm text-gray-300 mb-3">
                                            {microlesson.content}
                                          </p>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 