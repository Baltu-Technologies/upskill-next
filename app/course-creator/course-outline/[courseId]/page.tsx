'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Clock, BookOpen, Target, CheckCircle2, Play, ChevronDown, Zap, Trophy, FileCheck, Brain, Award, Star, X, RotateCcw, Eye, ArrowRight, ArrowDown, Timer, Plus, Save, Edit3, Upload, Camera, Loader2, Sparkles, Activity, ArrowUp, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useUserPermissions } from '@/app/hooks/useUserPermissions';

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
  tags?: string[];
  certifications?: {
    name: string;
    org: string;
    level: string;
  }[];
  badges?: {
    name: string;
    color: string;
  }[];
  xpPerMicrolesson?: number;
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
  objectives?: string[];
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
  const { permissions } = useUserPermissions();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingMicrolessonId, setEditingMicrolessonId] = useState<string | null>(null);
  const [editingObjectiveId, setEditingObjectiveId] = useState<string | null>(null);
  const [editingDescriptionId, setEditingDescriptionId] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState('/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg');
  const [isEditingHero, setIsEditingHero] = useState(false);
  
  // AI suggestion state management
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState<Set<string>>(new Set());
  
  // Generation state management
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneratingLesson, setCurrentGeneratingLesson] = useState<string | null>(null);
  const [generatedMicrolessons, setGeneratedMicrolessons] = useState<Set<string>>(new Set());
  const [generationComplete, setGenerationComplete] = useState(false);

  // Function to handle slide creation navigation
  const handleCreateSlides = (lessonId: string, microlessonId: string) => {
    if (!permissions.canAccessCourseCreator) {
      alert('You do not have permission to create slides. Please contact your administrator.');
      return;
    }
    
    // Navigate to slide creation page
    router.push(`/course-creator/microlesson-slides/${microlessonId}?courseId=${params.courseId}&lessonId=${lessonId}`);
  };

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
        
        // Only start generation if there are lessons that need microlessons
        if (needsGeneration && !isGenerating) {
          console.log('Starting microlesson generation for lessons that need it');
          setIsGenerating(true);
        } else if (!needsGeneration) {
          console.log('All lessons already have microlessons - no generation needed');
          setGenerationComplete(true);
          // Show completion message briefly if just loaded
          setTimeout(() => {
            setGenerationComplete(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Error loading course data:', error);
        router.push('/course-creator/create');
      }
    } else {
      router.push('/course-creator/create');
    }
  }, [router]);

  // Generation effect - Fixed to prevent regeneration loops
  useEffect(() => {
    if (!isGenerating || !courseData) return;

    const generateMicrolessons = async () => {
      const totalLessons = courseData.lessons.length;
      let processedLessons = 0;

      // Create a stable reference to the initial course data to avoid regeneration
      const initialLessons = courseData.lessons;

      try {
        // Track all previously generated microlessons for context
        let allPreviousMicrolessons: any[] = [];
        
        for (const lesson of initialLessons) {
          // Skip lessons that already have microlessons
          if (lesson.microlessons && lesson.microlessons.length > 0) {
            console.log(`Skipping lesson ${lesson.title} - already has microlessons`);
            
            // Add existing microlessons to context for future lessons
            allPreviousMicrolessons.push(...lesson.microlessons.map(ml => ({
              title: ml.title,
              objectives: ml.objectives || [],
              content: ml.content
            })));
            
            processedLessons++;
            const progress = (processedLessons / totalLessons) * 100;
            setGenerationProgress(progress);
            continue;
          }
          
          setCurrentGeneratingLesson(lesson.id);
          
          // Gather context of previously generated microlessons from all previous lessons
          const previousLessonsContext = allPreviousMicrolessons.map(ml => ({
            title: ml.title,
            objectives: ml.objectives || [],
            content: ml.content || ml.description || ''
          }));
          
          // Call AI API to generate microlessons for this lesson with context
          const response = await fetch('/api/ai-course-generation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              generationType: 'microlessons',
              courseData: courseData,
              lesson: lesson,
              previousMicrolessons: previousLessonsContext // Add context of all previous microlessons
            })
          });

          if (!response.ok) {
            throw new Error(`Failed to generate microlessons for lesson: ${lesson.title}`);
          }

          const result = await response.json();
          
          // Enhanced error handling for API response
          if (!result.success) {
            throw new Error(result.error || 'API returned error response');
          }
          
          const aiMicrolessons = result.data?.microlessons || result.microlessons || [];
          
          if (!aiMicrolessons || aiMicrolessons.length === 0) {
            console.warn(`No microlessons generated for lesson: ${lesson.title}`);
            continue;
          }
          
          // Convert AI response to our format
          const newMicrolessons: SimpleMicrolesson[] = aiMicrolessons.map((ml: any, index: number) => {
            const types: ('video' | 'interactive' | 'quiz' | 'text')[] = ['video', 'interactive', 'quiz', 'text'];
            const type = types[Math.floor(Math.random() * types.length)]; // Random type for now
            
            return {
              id: `microlesson-${lesson.id}-${Date.now()}-${index}`,
              title: ml.title,
              duration: ml.duration || '5-8 min',
              type: type,
              content: ml.content || ml.description || 'Microlesson content',
              objectives: ml.objectives || [] // Include the AI-generated learning objectives
            };
          });
          
          // FIXED: Add formatted microlessons to context, not raw AI response
          allPreviousMicrolessons.push(...newMicrolessons.map(ml => ({
            title: ml.title,
            objectives: ml.objectives || [],
            content: ml.content
          })));
          
          // Update generated set for animation as microlessons are added
          newMicrolessons.forEach(ml => {
            setGeneratedMicrolessons(prev => new Set([...Array.from(prev), ml.id]));
          });
          
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
          
          // Add a small delay between lessons to make the progression visible
          await new Promise(resolve => setTimeout(resolve, 500));
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

      } catch (error) {
        console.error('Error generating microlessons:', error);
        setCurrentGeneratingLesson(null);
        setIsGenerating(false);
        
        // Enhanced error handling with more details
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Full error details:', error);
        alert(`Error generating microlessons: ${errorMessage}`);
      }
    };

    generateMicrolessons();
  }, [isGenerating]); // FIXED: Removed courseData dependency to prevent regeneration loops

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

  const updateMicrolessonObjective = (lessonId: string, microlessonId: string, objectiveIndex: number, newObjective: string) => {
    const updatedLessons = courseData.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const updatedMicrolessons = lesson.microlessons.map(microlesson => {
          if (microlesson.id === microlessonId) {
            const updatedObjectives = microlesson.objectives?.map((obj, idx) => 
              idx === objectiveIndex ? newObjective : obj
            ) || [];
            return { ...microlesson, objectives: updatedObjectives };
          }
          return microlesson;
        });
        return { ...lesson, microlessons: updatedMicrolessons };
      }
      return lesson;
    });
    updateCourseData({ lessons: updatedLessons });
  };

  const addMicrolessonObjective = (lessonId: string, microlessonId: string) => {
    const updatedLessons = courseData.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const updatedMicrolessons = lesson.microlessons.map(microlesson => {
          if (microlesson.id === microlessonId) {
            const currentObjectives = microlesson.objectives || [];
            // Only add if we have less than 2 objectives
            if (currentObjectives.length < 2) {
              const newObjectives = [...currentObjectives, 'New learning objective'];
              return { ...microlesson, objectives: newObjectives };
            }
            return microlesson;
          }
          return microlesson;
        });
        return { ...lesson, microlessons: updatedMicrolessons };
      }
      return lesson;
    });
    updateCourseData({ lessons: updatedLessons });
  };

  const removeMicrolessonObjective = (lessonId: string, microlessonId: string, objectiveIndex: number) => {
    const updatedLessons = courseData.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const updatedMicrolessons = lesson.microlessons.map(microlesson => {
          if (microlesson.id === microlessonId) {
            const updatedObjectives = microlesson.objectives?.filter((_, idx) => idx !== objectiveIndex) || [];
            return { ...microlesson, objectives: updatedObjectives };
          }
          return microlesson;
        });
        return { ...lesson, microlessons: updatedMicrolessons };
      }
      return lesson;
    });
    updateCourseData({ lessons: updatedLessons });
  };

  const moveMicrolesson = (lessonId: string, microlessonId: string, direction: 'up' | 'down') => {
    const updatedLessons = courseData.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const microlessons = [...lesson.microlessons];
        const currentIndex = microlessons.findIndex(ml => ml.id === microlessonId);
        
        if (currentIndex === -1) return lesson;
        
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        // Check bounds
        if (newIndex < 0 || newIndex >= microlessons.length) return lesson;
        
        // Swap positions
        [microlessons[currentIndex], microlessons[newIndex]] = [microlessons[newIndex], microlessons[currentIndex]];
        
        return { ...lesson, microlessons };
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



  // AI suggestion functionality
  const generateAiSuggestion = async (type: 'title' | 'objective' | 'description', context: string, suggestionId: string) => {
    setLoadingAiSuggestions(prev => new Set([...Array.from(prev), suggestionId]));
    
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          context,
          courseData,
          currentContent: context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI suggestion');
      }

      const result = await response.json();
      
      if (result.success && result.suggestion) {
        setAiSuggestions(prev => ({
          ...prev,
          [suggestionId]: result.suggestion
        }));
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    } finally {
      setLoadingAiSuggestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestionId);
        return newSet;
      });
    }
  };

  const acceptAiSuggestion = (suggestionId: string, lessonId: string, microlessonId: string, type: 'title' | 'objective' | 'description', objectiveIndex?: number) => {
    const suggestion = aiSuggestions[suggestionId];
    if (!suggestion) return;

    if (type === 'title') {
      updateMicrolesson(lessonId, microlessonId, { title: suggestion });
      setEditingMicrolessonId(null);
    } else if (type === 'objective' && objectiveIndex !== undefined) {
      updateMicrolessonObjective(lessonId, microlessonId, objectiveIndex, suggestion);
      setEditingObjectiveId(null);
    } else if (type === 'description') {
      updateMicrolesson(lessonId, microlessonId, { content: suggestion });
      setEditingDescriptionId(null);
    }

    // Clear the suggestion
    setAiSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[suggestionId];
      return newSuggestions;
    });
  };

  const rejectAiSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[suggestionId];
      return newSuggestions;
    });
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

          {/* Course Details Section */}
          <div className="mb-8">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Course Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Basic Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Duration & Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                        <Input
                          value={courseData.duration}
                          onChange={(e) => updateCourseData({ duration: e.target.value })}
                          className="bg-slate-700/50 border-slate-600/50 text-white"
                          placeholder="e.g., 8 hours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                        <select
                          value={courseData.skillLevel}
                          onChange={(e) => updateCourseData({ skillLevel: e.target.value as 'entry' | 'intermediate' | 'advanced' })}
                          className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-md px-3 py-2"
                        >
                          <option value="entry">Entry</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    {/* XP per Microlesson */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">XP per Microlesson</label>
                      <Input
                        type="number"
                        value={courseData.xpPerMicrolesson || 50}
                        onChange={(e) => updateCourseData({ xpPerMicrolesson: parseInt(e.target.value) || 50 })}
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                        placeholder="50"
                      />
                    </div>

                    {/* Course Tags */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Course Tags</label>
                      <Textarea
                        value={courseData.tags?.join(', ') || ''}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                          updateCourseData({ tags: tags });
                        }}
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                        placeholder="Semiconductor Manufacturing, Clean Room Operations, Wafer Processing, Quality Control, Safety Protocols, Equipment Maintenance"
                        rows={3}
                      />
                      <p className="text-xs text-slate-400 mt-1">Separate tags with commas</p>
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Aligns with Certifications</label>
                      <div className="space-y-2">
                        {(courseData.certifications || []).map((cert, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-slate-900/50 rounded-lg">
                            <Input
                              value={cert.name}
                              onChange={(e) => {
                                const newCerts = [...(courseData.certifications || [])];
                                newCerts[index] = { ...cert, name: e.target.value };
                                updateCourseData({ certifications: newCerts });
                              }}
                              className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
                              placeholder="Certification Name"
                            />
                            <Input
                              value={cert.org}
                              onChange={(e) => {
                                const newCerts = [...(courseData.certifications || [])];
                                newCerts[index] = { ...cert, org: e.target.value };
                                updateCourseData({ certifications: newCerts });
                              }}
                              className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
                              placeholder="Organization"
                            />
                            <div className="flex gap-2">
                              <Input
                                value={cert.level}
                                onChange={(e) => {
                                  const newCerts = [...(courseData.certifications || [])];
                                  newCerts[index] = { ...cert, level: e.target.value };
                                  updateCourseData({ certifications: newCerts });
                                }}
                                className="bg-slate-800/50 border-slate-600/50 text-white text-sm flex-1"
                                placeholder="Level"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newCerts = courseData.certifications?.filter((_, i) => i !== index) || [];
                                  updateCourseData({ certifications: newCerts });
                                }}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newCerts = [...(courseData.certifications || []), { name: '', org: '', level: '' }];
                            updateCourseData({ certifications: newCerts });
                          }}
                          className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Certification
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Badges You'll Earn</label>
                      <div className="space-y-2">
                        {(courseData.badges || []).map((badge, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-slate-900/50 rounded-lg">
                            <Input
                              value={badge.name}
                              onChange={(e) => {
                                const newBadges = [...(courseData.badges || [])];
                                newBadges[index] = { ...badge, name: e.target.value };
                                updateCourseData({ badges: newBadges });
                              }}
                              className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
                              placeholder="Badge Name"
                            />
                            <div className="flex gap-2">
                              <select
                                value={badge.color}
                                onChange={(e) => {
                                  const newBadges = [...(courseData.badges || [])];
                                  newBadges[index] = { ...badge, color: e.target.value };
                                  updateCourseData({ badges: newBadges });
                                }}
                                className="bg-slate-800/50 border border-slate-600/50 text-white rounded-md px-3 py-2 text-sm flex-1"
                              >
                                <option value="from-blue-500 to-blue-600">Blue</option>
                                <option value="from-green-500 to-green-600">Green</option>
                                <option value="from-red-500 to-red-600">Red</option>
                                <option value="from-purple-500 to-purple-600">Purple</option>
                                <option value="from-yellow-500 to-yellow-600">Yellow</option>
                                <option value="from-indigo-500 to-indigo-600">Indigo</option>
                              </select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newBadges = courseData.badges?.filter((_, i) => i !== index) || [];
                                  updateCourseData({ badges: newBadges });
                                }}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newBadges = [...(courseData.badges || []), { name: '', color: 'from-blue-500 to-blue-600' }];
                            updateCourseData({ badges: newBadges });
                          }}
                          className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Badge
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Statistics */}
                  <div className="space-y-4">
                    <Card className="bg-slate-900/50 border-slate-600/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">Course Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span className="text-slate-400 font-medium">Lessons</span>
                            <span className="text-white font-medium">{totalLessons}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span className="text-slate-400 font-medium">Microlessons</span>
                            <span className="text-white font-medium">{totalMicrolessons}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-400 font-medium">Total XP</span>
                            <span className="text-white font-medium flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              {totalMicrolessons * (courseData.xpPerMicrolesson || 50)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tags Preview */}
                    {courseData.tags && courseData.tags.length > 0 && (
                      <Card className="bg-slate-900/50 border-slate-600/50">
                        <CardHeader>
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Tags Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {courseData.tags.slice(0, 6).map((tag, index) => (
                              <Badge key={index} variant="outline" className="border-blue-400/50 text-blue-400 bg-blue-400/5 text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {courseData.tags.length > 6 && (
                              <Badge variant="outline" className="border-slate-500/50 text-slate-400 bg-slate-500/5 text-xs">
                                +{courseData.tags.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                                      <Target className="w-4 h-4 text-white" />
                                    </div>

                                    {/* Title & Learning Objective */}
                                    <div className="flex-1 min-w-0">
                                      {/* Title Section */}
                                      <div className="mb-2">
                                        {editingMicrolessonId === microlesson.id ? (
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                              <BookOpen className="w-3 h-3 text-blue-400" />
                                              <label className="text-xs font-medium text-blue-300">Title</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Input
                                                value={microlesson.title}
                                                onChange={(e) => updateMicrolesson(lesson.id, microlesson.id, { title: e.target.value })}
                                                className="text-sm bg-slate-600/50 border-slate-500/50 text-white flex-1"
                                                placeholder="Microlesson Title"
                                              />
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                  const suggestionId = `title-${microlesson.id}`;
                                                  generateAiSuggestion('title', microlesson.title, suggestionId);
                                                }}
                                                disabled={loadingAiSuggestions.has(`title-${microlesson.id}`)}
                                                className="px-2 py-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                                title="Get AI suggestion"
                                              >
                                                {loadingAiSuggestions.has(`title-${microlesson.id}`) ? (
                                                  <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                  <Sparkles className="w-3 h-3" />
                                                )}
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingMicrolessonId(null)}
                                                className="px-2 py-1 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                              >
                                                <Save className="w-3 h-3" />
                                              </Button>
                                            </div>
                                            {/* AI Suggestion Display */}
                                            {aiSuggestions[`title-${microlesson.id}`] && (
                                              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                                                <div className="flex items-start gap-2 mb-2">
                                                  <Sparkles className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                                                  <span className="text-xs text-purple-300 font-medium">AI Suggestion:</span>
                                                </div>
                                                <p className="text-sm text-white mb-3">{aiSuggestions[`title-${microlesson.id}`]}</p>
                                                <div className="flex items-center gap-2">
                                                  <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => acceptAiSuggestion(`title-${microlesson.id}`, lesson.id, microlesson.id, 'title')}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                  >
                                                    Accept
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => rejectAiSuggestion(`title-${microlesson.id}`)}
                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                  >
                                                    Reject
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <BookOpen className="w-3 h-3 text-blue-400" />
                                            <h4 
                                              className="text-sm font-semibold text-white mb-1 truncate cursor-pointer hover:text-blue-300 transition-colors"
                                              onClick={() => setEditingMicrolessonId(microlesson.id)}
                                              title="Click to edit title"
                                            >
                                              {microlesson.title}
                                            </h4>
                                          </div>
                                        )}
                                      </div>

                                      {/* Learning Objectives Section */}
                                      <div className="space-y-1 mb-3">
                                        {/* Learning Objectives Header */}
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <label className="text-xs font-medium text-green-300">
                                              Learning Objectives
                                            </label>
                                          </div>
                                          {(!microlesson.objectives || microlesson.objectives.length < 2) && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                const currentObjectives = microlesson.objectives || [];
                                                addMicrolessonObjective(lesson.id, microlesson.id);
                                                // Auto-edit the new objective
                                                setTimeout(() => {
                                                  const newIndex = currentObjectives.length;
                                                  const newObjectiveId = `${microlesson.id}-objective-${newIndex}`;
                                                  setEditingObjectiveId(newObjectiveId);
                                                }, 100);
                                              }}
                                              className="px-1.5 py-0.5 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                              title="Add learning objective"
                                            >
                                              <Plus className="w-2.5 h-2.5" />
                                            </Button>
                                          )}
                                        </div>
                                        
                                        {/* Existing Objectives */}
                                        {microlesson.objectives && microlesson.objectives.length > 0 && (
                                          <div className="space-y-1">
                                            {microlesson.objectives.slice(0, 2).map((objective, idx) => {
                                              const objectiveId = `${microlesson.id}-objective-${idx}`;
                                              const isEditingObjective = editingObjectiveId === objectiveId;
                                              
                                              return (
                                                <div key={idx} className="flex items-center gap-2">
                                                  {isEditingObjective ? (
                                                    <div className="flex-1 space-y-2">
                                                      <div className="flex items-center gap-2">
                                                        <Input
                                                          value={objective}
                                                          onChange={(e) => updateMicrolessonObjective(lesson.id, microlesson.id, idx, e.target.value)}
                                                          className="text-xs bg-slate-600/50 border-slate-500/50 text-blue-300 flex-1"
                                                          placeholder="Learning objective"
                                                        />
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => {
                                                            const suggestionId = `objective-${microlesson.id}-${idx}`;
                                                            generateAiSuggestion('objective', objective, suggestionId);
                                                          }}
                                                          disabled={loadingAiSuggestions.has(`objective-${microlesson.id}-${idx}`)}
                                                          className="px-1.5 py-0.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                                          title="Get AI suggestion"
                                                        >
                                                          {loadingAiSuggestions.has(`objective-${microlesson.id}-${idx}`) ? (
                                                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                                          ) : (
                                                            <Sparkles className="w-2.5 h-2.5" />
                                                          )}
                                                        </Button>
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => removeMicrolessonObjective(lesson.id, microlesson.id, idx)}
                                                          className="px-1.5 py-0.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                          title="Remove objective"
                                                        >
                                                          <X className="w-2.5 h-2.5" />
                                                        </Button>
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => setEditingObjectiveId(null)}
                                                          className="px-1.5 py-0.5 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                                        >
                                                          <Save className="w-2.5 h-2.5" />
                                                        </Button>
                                                      </div>
                                                      {/* AI Suggestion for Objective */}
                                                      {aiSuggestions[`objective-${microlesson.id}-${idx}`] && (
                                                        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2">
                                                          <div className="flex items-start gap-1 mb-1">
                                                            <Sparkles className="w-2.5 h-2.5 text-purple-400 mt-0.5 flex-shrink-0" />
                                                            <span className="text-xs text-purple-300 font-medium">AI Suggestion:</span>
                                                          </div>
                                                          <p className="text-xs text-white mb-2">{aiSuggestions[`objective-${microlesson.id}-${idx}`]}</p>
                                                          <div className="flex items-center gap-1">
                                                            <Button
                                                              variant="default"
                                                              size="sm"
                                                              onClick={() => acceptAiSuggestion(`objective-${microlesson.id}-${idx}`, lesson.id, microlesson.id, 'objective', idx)}
                                                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                                                            >
                                                              Accept
                                                            </Button>
                                                            <Button
                                                              variant="outline"
                                                              size="sm"
                                                              onClick={() => rejectAiSuggestion(`objective-${microlesson.id}-${idx}`)}
                                                              className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs px-2 py-1"
                                                            >
                                                              Reject
                                                            </Button>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div className="flex items-center gap-2 flex-1">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                                                      <p 
                                                        className="text-xs text-blue-300 leading-relaxed cursor-pointer hover:text-blue-200 transition-colors flex-1"
                                                        onClick={() => setEditingObjectiveId(objectiveId)}
                                                        title="Click to edit objective"
                                                      >
                                                        {objective}
                                                      </p>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeMicrolessonObjective(lesson.id, microlesson.id, idx)}
                                                        className="px-1.5 py-0.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove objective"
                                                      >
                                                        <X className="w-2.5 h-2.5" />
                                                      </Button>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                        
                                        {/* Empty state when no objectives */}
                                        {(!microlesson.objectives || microlesson.objectives.length === 0) && (
                                          <div className="text-xs text-slate-500 italic py-2">
                                            No learning objectives yet. Click + to add one.
                                          </div>
                                        )}
                                      </div>

                                      {/* Microlesson Description - Right under learning objectives */}
                                      <div className="mb-3">
                                        {editingDescriptionId === microlesson.id ? (
                                          <div className="space-y-3">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                                <label className="text-xs font-medium text-purple-300">Description</label>
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                  const suggestionId = `description-${microlesson.id}`;
                                                  generateAiSuggestion('description', microlesson.content, suggestionId);
                                                }}
                                                disabled={loadingAiSuggestions.has(`description-${microlesson.id}`)}
                                                className="px-2 py-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                                title="Get AI suggestion"
                                              >
                                                {loadingAiSuggestions.has(`description-${microlesson.id}`) ? (
                                                  <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                  <Sparkles className="w-3 h-3" />
                                                )}
                                              </Button>
                                            </div>
                                            <Textarea
                                              value={microlesson.content}
                                              onChange={(e) => updateMicrolesson(lesson.id, microlesson.id, { content: e.target.value })}
                                              className="bg-slate-700/70 border-slate-600/50 text-white text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                              placeholder="Click to edit microlesson description - This will be used to generate slides. Provide detailed description of what this microlesson will cover..."
                                              rows={6}
                                              autoFocus
                                            />
                                            <div className="flex items-center gap-2">
                                              <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => setEditingDescriptionId(null)}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                              >
                                                <Save className="w-3 h-3 mr-1" />
                                                Save
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingDescriptionId(null)}
                                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                            {/* AI Suggestion Display - Now below the field */}
                                            {aiSuggestions[`description-${microlesson.id}`] && (
                                              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                                                <div className="flex items-start gap-2 mb-2">
                                                  <Sparkles className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                                                  <span className="text-xs text-purple-300 font-medium">AI Suggestion:</span>
                                                </div>
                                                <p className="text-sm text-white mb-3 whitespace-pre-wrap">{aiSuggestions[`description-${microlesson.id}`]}</p>
                                                <div className="flex items-center gap-2">
                                                  <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => acceptAiSuggestion(`description-${microlesson.id}`, lesson.id, microlesson.id, 'description')}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                  >
                                                    Accept
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => rejectAiSuggestion(`description-${microlesson.id}`)}
                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                  >
                                                    Reject
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <div 
                                            className="bg-slate-800/30 border border-slate-600/20 rounded-lg p-3 cursor-pointer hover:bg-slate-700/30 hover:border-slate-500/30 transition-all duration-200 group"
                                            onClick={() => setEditingDescriptionId(microlesson.id)}
                                          >
                                            {microlesson.content ? (
                                              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {microlesson.content}
                                              </p>
                                            ) : (
                                              <p className="text-xs text-slate-500 italic">
                                                Click to edit microlesson description - This will be used to generate slides
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Content Creation Buttons */}
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCreateSlides(lesson.id, microlesson.id)}
                                        disabled={isGenerating}
                                        className={`px-2 py-1.5 transition-all duration-300 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                                          (microlesson as any).hasSlides 
                                            ? 'text-green-400 border-green-500/30 hover:bg-green-500/10 hover:text-green-300' 
                                            : 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300'
                                        }`}
                                      >
                                        {(microlesson as any).hasSlides ? (
                                          <>
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Edit Slides {(microlesson as any).slideCount ? `(${(microlesson as any).slideCount})` : ''}
                                          </>
                                        ) : (
                                          <>
                                            <BookOpen className="w-3 h-3 mr-1" />
                                            Add Slides
                                          </>
                                        )}
                                      </Button>
                                      
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {/* TODO: Implement add quiz */}}
                                        disabled={isGenerating}
                                        className="px-2 py-1.5 text-green-400 border-green-500/30 hover:bg-green-500/10 hover:text-green-300 transition-all duration-300 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Add Quiz
                                      </Button>
                                      
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {/* TODO: Implement add activity */}}
                                        disabled={isGenerating}
                                        className="px-2 py-1.5 text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-300 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <Activity className="w-3 h-3 mr-1" />
                                        Add Activity
                                      </Button>
                                    </div>

                                    {/* Management Buttons */}
                                    <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-600">
                                      {/* Reorder Buttons */}
                                      <div className="flex flex-col gap-0.5">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => moveMicrolesson(lesson.id, microlesson.id, 'up')}
                                          disabled={isGenerating || mlIndex === 0}
                                          className="p-0.5 text-slate-400 hover:text-blue-400 transition-all duration-300 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                          title="Move up"
                                        >
                                          <ChevronUp className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => moveMicrolesson(lesson.id, microlesson.id, 'down')}
                                          disabled={isGenerating || mlIndex === lesson.microlessons.length - 1}
                                          className="p-0.5 text-slate-400 hover:text-blue-400 transition-all duration-300 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                          title="Move down"
                                        >
                                          <ChevronDown className="w-3 h-3" />
                                        </Button>
                                      </div>

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


                                    </div>
                                  </div>
                                </div>


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