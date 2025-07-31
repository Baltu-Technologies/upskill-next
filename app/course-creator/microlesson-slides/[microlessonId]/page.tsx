'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Sparkles, Loader2, BookOpen, Target, FileText, Plus, Play, Eye, Save,
  GripVertical, Trash2, Edit3, Image, Video, Type, CheckSquare, MousePointer,
  Upload, Settings, Download, Share2, Copy, Move, Layout, Layers, Search,
  AlertTriangle, Brain, Wrench, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUserPermissions } from '@/app/hooks/useUserPermissions';
import { SlidePlayer } from '@/components/microlesson/SlidePlayer';
import EditableSlideRenderer from '@/components/microlesson/EditableSlideRenderer';
import VerticalSlideEditor from '@/components/microlesson/VerticalSlideEditor';
import { SlideType, LessonConfig } from '@/types/microlesson/slide';
import { useSlideGenerationStream } from '@/hooks/useSlideGenerationStream';

interface MicrolessonContext {
  id: string;
  title: string;
  content: string;
  objectives: string[];
  duration: string;
  type: string;
}

interface CourseContext {
  id: string;
  title: string;
  description: string;
  industry: string;
  skillLevel: string;
  lessons: {
    id: string;
    title: string;
    description: string;
    microlessons: MicrolessonContext[];
  }[];
}

export default function MicrolessonSlideCreator({ params }: { params: { microlessonId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { permissions, loading: permissionsLoading } = useUserPermissions();
  
  const courseId = searchParams?.get('courseId');
  const lessonId = searchParams?.get('lessonId');
  const mode = searchParams?.get('mode'); // 'edit' or null
  
  // Debug logging for navigation - REDUCED FREQUENCY
  // console.log('🔍 Navigation params:', { courseId, lessonId, mode });
  
  // State management
  const [currentMicrolesson, setCurrentMicrolesson] = useState<MicrolessonContext | null>(null);
  const [courseContext, setCourseContext] = useState<CourseContext | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [lessonConfig, setLessonConfig] = useState<LessonConfig | null>(null);
  
  // Streaming generation hook
  const {
    isStreaming,
    slides: generatedSlides,
    currentStreamingSlide,
    currentStreamingField,
    streamingContent,
    error: streamingError,
    startGeneration,
    stopGeneration,
    regenerateSlide,
    addSlide,
    updateSlide,
    deleteSlide,
    initializeSlides,
  } = useSlideGenerationStream();
  
  // Legacy support for existing code that expects isGenerating
  const isGenerating = isStreaming;
  
  // Navigation helper function
  const navigateBackToCourseOutline = useCallback(() => {
    console.log('🚀 Navigating back to course outline...', { courseId });
    console.log('   - Router available:', !!router);
    console.log('   - Current URL params:', { courseId, lessonId, mode });
    
    if (courseId) {
      console.log('   - Using primary navigation path');
      router.push(`/course-creator/course-outline/${courseId}`);
    } else {
      // Fallback: try to get courseId from localStorage
      try {
        const savedData = localStorage.getItem('courseData');
        if (savedData) {
          const courseData = JSON.parse(savedData);
          const fallbackCourseId = courseData.id;
          if (fallbackCourseId) {
            console.log('📦 Using fallback courseId from localStorage:', fallbackCourseId);
            router.push(`/course-creator/course-outline/${fallbackCourseId}`);
            return;
          }
        }
      } catch (error) {
        console.error('❌ Error getting fallback courseId:', error);
      }
      
      // Final fallback: go to course creator home
      console.log('⚠️ No courseId available, going to course creator home');
      router.push('/course-creator');
    }
  }, [router, courseId]);
  
  // Calculate generation progress based on streaming state
  const generationProgress = useMemo(() => {
    if (!isStreaming) return 0;
    if (generatedSlides.length === 0) return 10;
    // Rough progress estimation: each slide represents progress toward completion
    const estimatedTotalSlides = 10; // Rough estimate
    return Math.min(90, (generatedSlides.length / estimatedTotalSlides) * 100);
  }, [isStreaming, generatedSlides.length]);
  
  // Editing state
  const [editingMode, setEditingMode] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'vertical'>('single');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [draggedSlide, setDraggedSlide] = useState<number | null>(null);
  const [isAddSlideDropdownOpen, setIsAddSlideDropdownOpen] = useState(false);

  // Debug logging for component state (after all variables are declared) - REDUCED FREQUENCY
  useEffect(() => {
    // Only log state changes, not on every render
    console.log('🔍 Component state update:', { 
      showPreview, 
      editingMode, 
      slidesCount: generatedSlides.length,
      isStreaming,
      lessonConfigExists: !!lessonConfig,
      currentMicrolessonExists: !!currentMicrolesson,
      previewButtonDisabled: generatedSlides.length === 0 || isStreaming
    });
    
    // Debug preview state specifically
    if (showPreview) {
      console.log('🎬 PREVIEW STATE IS TRUE - should render preview mode');
      console.log('   - lessonConfig exists:', !!lessonConfig);
      console.log('   - Preview condition (showPreview && lessonConfig):', showPreview && !!lessonConfig);
    }
  }, [showPreview, editingMode, generatedSlides.length, isStreaming, lessonConfig]);
  
  // Check permissions
  useEffect(() => {
    if (!permissionsLoading && !permissions.canAccessCourseCreator) {
      router.push('/unauthorized');
      return;
    }
  }, [permissions, permissionsLoading, router]);
  
  // Load microlesson and course context
  useEffect(() => {
    const loadContext = async () => {
      try {
        // Load course data from localStorage
        const savedData = localStorage.getItem('courseData');
        if (!savedData) {
          console.error('No course data found in localStorage');
          return;
        }

        const parsedCourseData = JSON.parse(savedData);
        
        // Find the specific lesson and microlesson
        let foundMicrolesson: MicrolessonContext | null = null;
        let foundLesson: any = null;
        
        for (const lesson of parsedCourseData.lessons || []) {
          for (const microlesson of lesson.microlessons || []) {
            if (microlesson.id === params.microlessonId) {
              foundMicrolesson = {
                id: microlesson.id,
                title: microlesson.title,
                content: microlesson.content || microlesson.description || '',
                objectives: microlesson.objectives || [],
                duration: microlesson.duration || '10 minutes',
                type: microlesson.type || 'interactive'
              };
              foundLesson = lesson;
              break;
            }
          }
          if (foundMicrolesson) break;
        }

        if (!foundMicrolesson) {
          console.error('Microlesson not found:', params.microlessonId);
          return;
        }

        // Create course context from real data
        const realCourseContext: CourseContext = {
          id: courseId || parsedCourseData.id || 'course',
          title: parsedCourseData.title || 'Untitled Course',
          description: parsedCourseData.description || '',
          industry: parsedCourseData.industry || 'General',
          skillLevel: parsedCourseData.courseLevel || parsedCourseData.skillLevel || 'intermediate',
          lessons: parsedCourseData.lessons?.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || '',
            microlessons: lesson.microlessons || []
          })) || []
        };
        
        // Extract additional context from course data
        let additionalContextText = '';
        if (parsedCourseData.context) {
          const contextParts = [];
          
          if (parsedCourseData.context.jobDescription?.text) {
            contextParts.push(`**Job Description/Requirements:**\n${parsedCourseData.context.jobDescription.text}`);
          }
          
          if (parsedCourseData.context.courseStructure?.text) {
            contextParts.push(`**Course Structure Guidelines:**\n${parsedCourseData.context.courseStructure.text}`);
          }
          
          additionalContextText = contextParts.join('\n\n');
        }

        console.log('🔍 Loading real course context:', {
          courseTitle: realCourseContext.title,
          microlessonTitle: foundMicrolesson.title,
          industry: realCourseContext.industry,
          skillLevel: realCourseContext.skillLevel,
          hasAdditionalContext: !!additionalContextText
        });
        
        setCurrentMicrolesson(foundMicrolesson);
        setCourseContext(realCourseContext);
        setAdditionalContext(additionalContextText);
        
        // Check for existing slides in localStorage
        const slideKey = `microlesson_slides_${params.microlessonId}`;
        const existingSlidesData = localStorage.getItem(slideKey);
        let existingSlides: SlideType[] = [];
        
        console.log(`🔍 Loading slides for microlesson ${params.microlessonId}:`);
        console.log(`   - Slide key: ${slideKey}`);
        console.log(`   - Raw data exists: ${!!existingSlidesData}`);
        
        if (existingSlidesData) {
          try {
            const parsedSlideData = JSON.parse(existingSlidesData);
            existingSlides = parsedSlideData.slides || [];
            console.log(`✅ Found ${existingSlides.length} existing slides for microlesson ${params.microlessonId}`);
            console.log(`   - Last updated: ${parsedSlideData.lastUpdated}`);
            console.log(`   - Slide data:`, parsedSlideData);
          } catch (error) {
            console.error('❌ Error parsing existing slides data:', error);
          }
        } else {
          console.log(`❌ No existing slides found in localStorage for key: ${slideKey}`);
        }

        // If mode=edit parameter is present, force edit mode if slides exist
        if (mode === 'edit') {
          if (existingSlides.length > 0) {
            initializeSlides(existingSlides);
            setShowPreview(true);
            setEditingMode(true);
            console.log('Forced edit mode due to URL parameter');
          } else {
            // No slides exist but edit mode was requested - show a helpful message
            console.log('Edit mode requested but no slides exist - staying in creation mode');
          }
        } else if (existingSlides.length > 0) {
          // Auto-enter edit mode if slides exist and no specific mode is set
          initializeSlides(existingSlides);
          setShowPreview(true);
          setEditingMode(true);
          console.log('Auto-entered edit mode due to existing slides');
        }

        // Create initial lesson config for preview functionality
        const initialConfig: LessonConfig = {
          id: params.microlessonId,
          title: foundMicrolesson.title,
          description: foundMicrolesson.content,
          slides: existingSlides, // Use existing slides if available
          duration: foundMicrolesson.duration,
          course: realCourseContext.title,
          lesson: realCourseContext.lessons.find(l => l.id === lessonId)?.title || '',
        };
        
        setLessonConfig(initialConfig);
      } catch (error) {
        console.error('Error loading context:', error);
      }
    };
    
    loadContext();
  }, [params.microlessonId, courseId, lessonId, mode, initializeSlides]);
  
  // Generate slides using AI streaming
  const generateSlides = async () => {
    if (!currentMicrolesson || !courseContext) return;
    
    // Switch to preview mode and start streaming generation
    setShowPreview(true);
    setEditingMode(true);
    
    // Create initial lesson config
    const initialConfig: LessonConfig = {
      id: params.microlessonId,
      title: currentMicrolesson.title,
      description: currentMicrolesson.content,
      slides: [],
      duration: currentMicrolesson.duration,
      course: courseContext.title,
      lesson: courseContext.lessons.find(l => l.id === lessonId)?.title || '',
    };
    
    setLessonConfig(initialConfig);
    
    try {
      // Start streaming generation with proper context format
      await startGeneration(
        {
          title: currentMicrolesson.title,
          content: currentMicrolesson.content,
          objectives: currentMicrolesson.objectives,
          duration: currentMicrolesson.duration,
          type: currentMicrolesson.type,
        },
        {
          title: courseContext.title,
          description: courseContext.description,
          industry: courseContext.industry,
          skillLevel: courseContext.skillLevel,
        }
      );
      
    } catch (error) {
      console.error('Error generating slides:', error);
      setShowPreview(false);
      alert('Failed to generate slides. Please try again.');
    }
  };
  
  // Auto-save slides to localStorage (called automatically when slides are generated)
  const autoSaveSlides = useCallback(() => {
    if (!generatedSlides.length || !currentMicrolesson || !courseContext) return;
    
    try {
      // Save slides to localStorage with microlesson ID as key
      const slideKey = `microlesson_slides_${params.microlessonId}`;
      const slideData = {
        microlessonId: params.microlessonId,
        courseId: courseId,
        lessonId: lessonId,
        slides: generatedSlides,
        lessonConfig: lessonConfig,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(slideKey, JSON.stringify(slideData));
      // console.log(`Auto-saved ${generatedSlides.length} slides for microlesson ${params.microlessonId}`);
    } catch (error) {
      console.error('Error auto-saving slides:', error);
    }
  }, [generatedSlides, currentMicrolesson, courseContext, params.microlessonId, courseId, lessonId]);

  // Update lesson config when slides change and auto-save slides
  useEffect(() => {
    if (generatedSlides.length > 0 && currentMicrolesson && courseContext) {
      const updatedConfig: LessonConfig = {
        id: params.microlessonId,
        title: currentMicrolesson.title,
        description: currentMicrolesson.content,
        slides: generatedSlides,
        duration: currentMicrolesson.duration,
        course: courseContext.title,
        lesson: courseContext.lessons.find(l => l.id === lessonId)?.title || '',
      };
      setLessonConfig(updatedConfig);
      
      // Auto-save slides to localStorage when they're generated
      autoSaveSlides();
      
      // Update course data in localStorage to mark slides as generated
      updateCourseDataWithSlides();
    }
  }, [generatedSlides, currentMicrolesson, courseContext, params.microlessonId, lessonId, courseId]);

  // Update course data in localStorage to mark slides as generated
  const updateCourseDataWithSlides = () => {
    if (!courseId || !lessonId || !params.microlessonId || !generatedSlides.length) return;
    
    try {
      const savedData = localStorage.getItem('courseData');
      if (!savedData) return;
      
      const courseData = JSON.parse(savedData);
      
      // Find and update the microlesson
      const lesson = courseData.lessons?.find((l: any) => l.id === lessonId);
      if (lesson) {
        const microlesson = lesson.microlessons?.find((ml: any) => ml.id === params.microlessonId);
        if (microlesson) {
          microlesson.hasSlides = true;
          microlesson.slideCount = generatedSlides.length;
          microlesson.lastSlideUpdate = new Date().toISOString();
          
          // Save updated course data
          localStorage.setItem('courseData', JSON.stringify(courseData));
          // console.log(`Updated course data: microlesson ${params.microlessonId} now has ${generatedSlides.length} slides`);
        }
      }
    } catch (error) {
      console.error('Error updating course data with slides:', error);
    }
  };

  // Save slides to localStorage and update course data
  const saveSlides = useCallback(async () => {
    if (!generatedSlides.length) return;
    
    try {
      // Save slides to localStorage with microlesson ID as key
      const slideKey = `microlesson_slides_${params.microlessonId}`;
      const slideData = {
        microlessonId: params.microlessonId,
        courseId: courseId,
        lessonId: lessonId,
        slides: generatedSlides,
        lessonConfig: lessonConfig,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(slideKey, JSON.stringify(slideData));
      
      // Update course data to mark slides as generated (if not already done)
      updateCourseDataWithSlides();
      
      console.log('Slides saved successfully:', generatedSlides);
      alert('Slides saved successfully!');
      // Stay on the slide editor page after saving
    } catch (error) {
      console.error('Error saving slides:', error);
      alert('Failed to save slides. Please try again.');
    }
  }, [generatedSlides, params.microlessonId, courseId, lessonId, lessonConfig]);

  // Slide editing functions
  const addNewSlide = (type: string, afterIndex?: number) => {
    let newSlide: SlideType;
    
    // Create slide based on type with proper typing
    switch (type) {
      case 'TitleSlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleSlide',
          title: 'New Title Slide',
          backgroundColor: '#1e293b'
        } as SlideType;
        break;
      case 'TitleWithSubtext':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleWithSubtext',
          title: 'New Title with Subtext',
          backgroundColor: '#1e293b'
        } as SlideType;
        break;
      case 'TitleWithImage':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleWithImage',
          title: 'New Title with Image',
          imageUrl: '',
          imagePosition: 'left',
          backgroundColor: '#1e293b'
        } as SlideType;
        break;
      case 'VideoSlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'VideoSlide',
          title: 'New Video Slide',
          videoUrl: '',
          backgroundColor: '#1e293b'
        } as SlideType;
        break;
      case 'QuickCheckSlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'QuickCheckSlide',
          question: 'New Question',
          correctAnswer: '',
          backgroundColor: '#1e293b'
        } as SlideType;
        break;
      case 'HotspotActivitySlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'HotspotActivitySlide',
          title: 'New Hotspot Activity',
          hotspots: [],
          backgroundColor: '#1e293b'
        } as SlideType;
        break;
      case 'MarkdownSlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'MarkdownSlide',
          content: '# New Markdown Slide',
          backgroundColor: '#1e293b'
        } as SlideType;
        break;
      default:
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleSlide',
          title: 'New Slide',
          backgroundColor: '#1e293b'
        } as SlideType;
    }

    // Determine where to insert the new slide
    let insertIndex: number;
    if (afterIndex !== undefined) {
      insertIndex = afterIndex + 1;
    } else if (selectedSlideIndex !== null) {
      // Add after the currently selected slide
      insertIndex = selectedSlideIndex + 1;
    } else {
      // Add at the end if no slide is selected
      insertIndex = generatedSlides.length;
    }
    
    // Add the slide using the streaming hook
    addSlide(newSlide, insertIndex);
    setSelectedSlideIndex(insertIndex);
    
    // Update lesson config
    if (lessonConfig) {
      const newSlides = [...generatedSlides];
      newSlides.splice(insertIndex, 0, newSlide);
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  const deleteSlideAt = (index: number) => {
    // Use the streaming hook's delete function
    deleteSlide(index);
    
    // Update selected slide index
    if (selectedSlideIndex === index) {
      setSelectedSlideIndex(null);
    } else if (selectedSlideIndex !== null && selectedSlideIndex > index) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    }
    
    // Update lesson config
    if (lessonConfig) {
      const newSlides = generatedSlides.filter((_, i) => i !== index);
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  const duplicateSlide = (index: number) => {
    const slideToClone = generatedSlides[index];
    const newSlide = {
      ...slideToClone,
      id: `slide-${Date.now()}`,
    } as SlideType;
    
    // Update title for slides that have it
    if ('title' in newSlide && newSlide.title) {
      (newSlide as any).title = `${newSlide.title} (Copy)`;
    }
    
    // Add the duplicated slide after the original using the streaming hook
    addSlide(newSlide, index + 1);
    
    // Update lesson config
    if (lessonConfig) {
      const newSlides = [...generatedSlides];
      newSlides.splice(index + 1, 0, newSlide);
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  const moveSlide = (fromIndex: number, toIndex: number) => {
    // Get the slide to move
    const slideToMove = generatedSlides[fromIndex];
    
    // Remove from old position and add to new position using the streaming hook
    deleteSlide(fromIndex);
    // Adjust toIndex if we're moving forward (since we just deleted an item)
    const adjustedToIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
    addSlide(slideToMove, adjustedToIndex);
    
    setSelectedSlideIndex(adjustedToIndex);
    
    // Update lesson config
    if (lessonConfig) {
      const newSlides = [...generatedSlides];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  const updateSlideAt = (index: number, updatedSlide: SlideType) => {
    // Use the streaming hook's update function
    updateSlide(index, updatedSlide);
    
    // Update lesson config
    if (lessonConfig) {
      const newSlides = [...generatedSlides];
      newSlides[index] = updatedSlide;
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSlide(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedSlide !== null && draggedSlide !== dropIndex) {
      moveSlide(draggedSlide, dropIndex);
    }
    setDraggedSlide(null);
  };

  // Learning-focused slide type options
  const slideTypes = [
    // Foundation Slides
    { type: 'ContextSetterSlide', icon: Target, label: 'Context Setter', color: 'bg-emerald-600', category: 'Foundation' },
    { type: 'LearningObjectivesSlide', icon: BookOpen, label: 'Learning Objectives', color: 'bg-blue-600', category: 'Foundation' },
    
    // Content Delivery Slides
    { type: 'ConceptExplanationSlide', icon: FileText, label: 'Concept Explanation', color: 'bg-indigo-600', category: 'Content' },
    { type: 'StepByStepProcedure', icon: Edit3, label: 'Step-by-Step', color: 'bg-purple-600', category: 'Content' },
    { type: 'ComparisonSlide', icon: ArrowLeft, label: 'Comparison', color: 'bg-teal-600', category: 'Content' },
    { type: 'CaseStudySlide', icon: FileText, label: 'Case Study', color: 'bg-orange-600', category: 'Content' },
    { type: 'SafetyProtocolSlide', icon: AlertTriangle, label: 'Safety Protocol', color: 'bg-red-600', category: 'Content' },
    
    // Interactive Learning Slides
    { type: 'HotspotActivitySlide', icon: MousePointer, label: 'Hotspot Activity', color: 'bg-indigo-500', category: 'Interactive' },
    { type: 'PracticeScenarioSlide', icon: Play, label: 'Practice Scenario', color: 'bg-green-600', category: 'Interactive' },
    { type: 'ReflectionSlide', icon: Brain, label: 'Reflection', color: 'bg-purple-500', category: 'Interactive' },
    { type: 'QuickCheckSlide', icon: CheckSquare, label: 'Quick Check', color: 'bg-yellow-500', category: 'Interactive' },
    
    // Application & Assessment Slides
    { type: 'RealWorldApplicationSlide', icon: Settings, label: 'Real-World Application', color: 'bg-blue-500', category: 'Application' },
    { type: 'TroubleshootingSlide', icon: Wrench, label: 'Troubleshooting', color: 'bg-red-500', category: 'Application' },
    { type: 'SummarySlide', icon: CheckCircle, label: 'Summary', color: 'bg-green-500', category: 'Application' },
    
    // Legacy Slides (still available)
    { type: 'TitleSlide', icon: Type, label: 'Title Slide', color: 'bg-slate-500', category: 'Legacy' },
    { type: 'TitleWithImage', icon: Image, label: 'Title with Image', color: 'bg-slate-600', category: 'Legacy' },
    { type: 'VideoSlide', icon: Video, label: 'Video Slide', color: 'bg-slate-700', category: 'Legacy' },
    { type: 'MarkdownSlide', icon: FileText, label: 'Markdown Slide', color: 'bg-slate-800', category: 'Legacy' },
  ];

  // Helper function to strip HTML tags for display
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    // Create a temporary div element to leverage browser's HTML parsing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Helper function to get slide display name
  const getSlideDisplayName = (slide: SlideType): string => {
    if ('title' in slide && slide.title) {
      return stripHtmlTags(slide.title);
    }
    if ('question' in slide && slide.question) {
      const cleanQuestion = stripHtmlTags(slide.question);
      return cleanQuestion.length > 30 ? cleanQuestion.substring(0, 30) + '...' : cleanQuestion;
    }
    if (slide.type) {
      return `${slide.type.replace(/([A-Z])/g, ' $1').trim()} Slide`;
    }
    return 'Loading Slide...';
  };

  // Dropdown hover handlers
  const handleMouseEnterAddSlide = () => {
    setIsAddSlideDropdownOpen(true);
  };

  const handleMouseLeaveAddSlide = () => {
    setIsAddSlideDropdownOpen(false);
  };

  // Render slide preview for live editing
  const renderSlidePreview = (slide: SlideType, slideIndex?: number) => {
    const isCurrentlyStreaming = isStreaming && currentStreamingSlide === slideIndex;
    
    return (
      <div className="w-full h-full relative">
        <EditableSlideRenderer 
          slide={slide}
          onSlideChange={(updatedSlide: SlideType) => {
            if (selectedSlideIndex !== null) {
              updateSlideAt(selectedSlideIndex, updatedSlide);
            }
          }}
          isEditing={editingMode}
          isGenerating={isCurrentlyStreaming}
        />
        
        {/* Streaming indicator */}
        {isCurrentlyStreaming && (
          <div className="absolute top-4 right-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            AI Typing...
          </div>
        )}
      </div>
    );
  };

  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentMicrolesson || !courseContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading microlesson context...</p>
        </div>
      </div>
    );
  }

  // PREVIEW MODE TAKES PRECEDENCE - Check this FIRST
  if (showPreview && lessonConfig) {
    console.log('🎯 RENDERING: Preview mode - PREVIEW INTERFACE SHOULD APPEAR NOW');
    console.log('   - showPreview:', showPreview);
    console.log('   - lessonConfig:', !!lessonConfig);
    console.log('   - lessonConfig details:', lessonConfig);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Preview Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="text-slate-300 hover:text-white"
                disabled={isGenerating}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Back to Editor'}
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-white">{lessonConfig.title}</h1>
                <p className="text-sm text-slate-400">
                  {isGenerating ? 'Generating slides...' : 'Preview Mode'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isGenerating && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-sm text-slate-300">
                    {0}% Complete
                  </span>
                </div>
              )}
              {!isGenerating && generatedSlides.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPreview(false);
                    setEditingMode(true);
                  }}
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Slides
                </Button>
              )}
              {!isGenerating && generatedSlides.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveSlides}
                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Slides
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Generation Progress Overlay */}
        {isGenerating && (
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Generating Your Slides</h2>
              <p className="text-slate-300 mb-6">Creating an engaging learning experience...</p>
              
              <div className="text-sm text-slate-400 space-y-1">
                <p>🎯 Analyzing learning objectives...</p>
                <p>📚 Structuring content flow...</p>
                <p>🎨 Designing engaging slides...</p>
                <p>✨ Adding interactive elements...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Slide Preview */}
        {!isGenerating && generatedSlides.length > 0 ? (
          <SlidePlayer
            config={lessonConfig}
            onComplete={() => {}}
            onExit={() => setShowPreview(false)}
          />
        ) : !isGenerating && generatedSlides.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-slate-400">
              <p>No slides generated yet</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // Editing Mode Interface
  if (editingMode) {
    // console.log('🎯 RENDERING: Editing mode interface');
    
    // If no slides are available, show a message
    if (generatedSlides.length === 0) {
      console.log('❌ RENDERING: No slides available message');
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-400 text-lg">No slides available for editing</div>
            <p className="text-slate-500 text-sm mt-2">Generate slides first to start editing</p>
            <Button
              onClick={() => {
                setEditingMode(false);
                setShowPreview(false);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Back to Generator
            </Button>
          </div>
        </div>
      );
    }
    
    // Use vertical editor mode if selected
    if (viewMode === 'vertical') {
      // console.log('🎯 RENDERING: Vertical editor mode');
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Header with view mode toggle */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateBackToCourseOutline}
                  className="text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course Outline
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-white">Edit Slides</h1>
                  <p className="text-sm text-slate-400">{currentMicrolesson.title}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
                  <Button
                    // @ts-ignore - TypeScript false positive on variant comparison
                    variant={viewMode === 'single' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('single')}
                    className="h-8 px-3"
                  >
                    <Layout className="w-4 h-4 mr-1" />
                    Single
                  </Button>
                  <Button
                    variant={viewMode === 'vertical' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('vertical')}
                    className="h-8 px-3"
                  >
                    <Layers className="w-4 h-4 mr-1" />
                    Vertical
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveSlides}
                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Slides
                </Button>
              </div>
            </div>
          </div>

          {/* Vertical Slide Editor */}
          <div className="pt-20">
            <VerticalSlideEditor
              slides={generatedSlides}
              onSlideChange={updateSlide}
              onAddSlide={addNewSlide}
              onDeleteSlide={deleteSlide}
              onDuplicateSlide={duplicateSlide}
              onMoveSlide={moveSlide}
              isStreaming={isStreaming}
              currentStreamingSlide={currentStreamingSlide}
            />
          </div>
        </div>
      );
    }
    
    // console.log('🎯 RENDERING: Single slide editor mode (where the buttons are!)');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
        {/* Left Floating Panel - Slide Management */}
        <AnimatePresence>
          {leftPanelOpen && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              className="fixed left-4 top-4 bottom-4 w-80 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl z-40 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Slide Manager
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                      {generatedSlides.length} slides
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLeftPanelOpen(false)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add New Slide Button */}
              <div className="p-4 border-b border-slate-700/50">
                <div className="relative">
                  <Button
                    onClick={() => addNewSlide('TitleSlide')}
                    onMouseEnter={handleMouseEnterAddSlide}
                    onMouseLeave={handleMouseLeaveAddSlide}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Slide
                  </Button>
                  
                  {/* Slide Type Dropdown with Categories */}
                  {isAddSlideDropdownOpen && (
                    <div 
                      className="absolute top-full left-0 right-0 z-50"
                      onMouseEnter={handleMouseEnterAddSlide}
                      onMouseLeave={handleMouseLeaveAddSlide}
                    >
                      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl p-2 max-h-96 overflow-y-auto mt-1">
                        {/* Group slides by category */}
                        {['Foundation', 'Content', 'Interactive', 'Application', 'Legacy'].map((category) => {
                          const categorySlides = slideTypes.filter(slide => slide.category === category);
                          if (categorySlides.length === 0) return null;
                          
                          return (
                            <div key={category} className="mb-3">
                              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                                {category} Slides
                              </div>
                              {categorySlides.map((slideType) => (
                                <button
                                  key={slideType.type}
                                  onClick={() => {
                                    addNewSlide(slideType.type);
                                    setIsAddSlideDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-left mb-1"
                                >
                                  <div className={`w-7 h-7 rounded-lg ${slideType.color} flex items-center justify-center`}>
                                    <slideType.icon className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <span className="text-white text-sm">{slideType.label}</span>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Slide List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {generatedSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`relative group p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedSlideIndex === index
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                    }`}
                    onClick={() => setSelectedSlideIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Drag Handle */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-slate-400" />
                      </div>
                      
                      {/* Slide Number */}
                      <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{index + 1}</span>
                      </div>
                      
                      {/* Slide Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {getSlideDisplayName(slide)}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {slide.type ? slide.type.replace(/([A-Z])/g, ' $1').trim() : 'Loading...'}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSlide(index);
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          title="Duplicate slide"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlideAt(index);
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          title="Delete slide"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${leftPanelOpen ? 'ml-88' : 'ml-4'} mr-4`}>
          {/* Header */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4 mb-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('🏠 Back to Course Outline button clicked (slide editor)');
                    navigateBackToCourseOutline();
                  }}
                  className="text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course Outline
                </Button>
                
                {!leftPanelOpen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLeftPanelOpen(true)}
                    className="text-slate-300 hover:text-white"
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Show Slides
                  </Button>
                )}
                
                <div>
                  <h1 className="text-lg font-semibold text-white">Slide Editor</h1>
                  <p className="text-sm text-slate-400">{currentMicrolesson.title}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('🎬 Preview button clicked - switching to preview mode');
                    setShowPreview(true);
                  }}
                  disabled={generatedSlides.length === 0 || isStreaming}
                  className={
                    generatedSlides.length === 0 || isStreaming
                      ? "border-slate-600 text-slate-500 cursor-not-allowed"
                      : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                  }
                  title={
                    generatedSlides.length === 0 
                      ? "Generate slides first to enable preview"
                      : isStreaming 
                      ? "Wait for generation to complete"
                      : "Preview slides"
                  }
                >
                  <Eye 
                    className={`w-4 h-4 mr-2 ${
                      generatedSlides.length === 0 || isStreaming 
                        ? "text-slate-500" 
                        : ""
                    }`} 
                  />
                  Preview
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveSlides}
                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Slides
                </Button>
              </div>
            </div>
          </div>

          {/* Slide Canvas - Live Preview */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            {selectedSlideIndex !== null && generatedSlides[selectedSlideIndex] ? (
              <div className="space-y-0">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 border-b border-slate-600/50">
                  <h2 className="text-white text-lg font-semibold">
                    Slide {selectedSlideIndex + 1}: {generatedSlides[selectedSlideIndex].type}
                  </h2>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    {generatedSlides[selectedSlideIndex].type.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                </div>
                
                {/* Live Slide Preview */}
                <div className="aspect-video bg-white relative overflow-hidden">
                  {renderSlidePreview(generatedSlides[selectedSlideIndex], selectedSlideIndex)}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-slate-400 text-lg">Select a slide to edit</div>
                <p className="text-slate-500 text-sm mt-2">
                  Choose a slide from the panel on the left to start editing
                </p>
              </div>
            )}
          </div>
        </div>



        {/* Toggle buttons for closed panels */}
        {!leftPanelOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftPanelOpen(true)}
            className="fixed left-4 top-4 z-50 bg-slate-800/90 backdrop-blur-sm text-slate-300 hover:text-white border border-slate-700/50"
          >
            <Layers className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }



  // Debug: Preview not being shown
  if (showPreview && !lessonConfig) {
    console.log('❌ Preview requested but lessonConfig missing:', { showPreview, lessonConfig: !!lessonConfig });
  } else if (!showPreview) {
    console.log('ℹ️ Not showing preview:', { showPreview, editingMode, lessonConfig: !!lessonConfig });
  }

  // console.log('🎯 RENDERING: Create Slides page (fallback)');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateBackToCourseOutline}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course Outline
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">Create Slides</h1>
              <p className="text-sm text-slate-400">{currentMicrolesson.title}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
            AI-Powered Generation
          </Badge>
        </div>
      </div>
      
      {/* Edit Mode Message */}
      {mode === 'edit' && generatedSlides.length === 0 && (
        <div className="max-w-4xl mx-auto p-6 pb-0">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-amber-200 font-medium">No slides found for editing</p>
                <p className="text-amber-300/80 text-sm mt-1">
                  This microlesson doesn't have any slides yet. Generate slides first to start editing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Microlesson Context Card */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Microlesson Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Title</h3>
                <p className="text-white bg-slate-700/30 p-3 rounded-lg">{currentMicrolesson.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Description</h3>
                <p className="text-white bg-slate-700/30 p-3 rounded-lg">{currentMicrolesson.content}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Learning Objectives</h3>
                <div className="bg-slate-700/30 p-3 rounded-lg space-y-2">
                  {currentMicrolesson.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                      <p className="text-white text-sm">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Duration</h3>
                  <p className="text-white bg-slate-700/30 p-3 rounded-lg">{currentMicrolesson.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Type</h3>
                  <p className="text-white bg-slate-700/30 p-3 rounded-lg capitalize">{currentMicrolesson.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Course Context Card */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Course Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Course Title</h3>
                  <p className="text-white bg-slate-700/30 p-3 rounded-lg">{courseContext.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Industry</h3>
                  <p className="text-white bg-slate-700/30 p-3 rounded-lg">{courseContext.industry}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Course Description</h3>
                <p className="text-white bg-slate-700/30 p-3 rounded-lg">{courseContext.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Skill Level</h3>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 capitalize">
                  {courseContext.skillLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Context Input */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Additional Context
              </CardTitle>
              <p className="text-sm text-slate-400">
                Provide any additional information to help create more targeted slides
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Enter any specific requirements, examples, or focus areas for the slides..."
                className="bg-slate-700/30 border-slate-600/50 text-white placeholder-slate-400 min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={generateSlides}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Slides with AI
                </>
              )}
            </Button>
            
            {generatedSlides.length > 0 && !isGenerating && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="border-green-500/30 text-green-400 hover:bg-green-500/10"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Generated Slides
              </Button>
            )}
            
            {generatedSlides.length > 0 && !isGenerating && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  console.log('Edit Slides clicked - slides available:', generatedSlides.length);
                  setEditingMode(true);
                }}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Edit Slides ({generatedSlides.length})
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 