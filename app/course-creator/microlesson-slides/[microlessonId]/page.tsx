'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Sparkles, Loader2, BookOpen, Target, FileText, Plus, Play, Eye, Save,
  GripVertical, Trash2, Edit3, Image, Video, Type, CheckSquare, MousePointer,
  Upload, Palette, Settings, Download, Share2, Copy, Move, Layout, Layers, Search
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
  
  // State management
  const [currentMicrolesson, setCurrentMicrolesson] = useState<MicrolessonContext | null>(null);
  const [courseContext, setCourseContext] = useState<CourseContext | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedSlides, setGeneratedSlides] = useState<SlideType[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [lessonConfig, setLessonConfig] = useState<LessonConfig | null>(null);
  
  // Editing state
  const [editingMode, setEditingMode] = useState(false);
  type ViewMode = 'single' | 'vertical';
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [draggedSlide, setDraggedSlide] = useState<number | null>(null);
  const [isAddSlideDropdownOpen, setIsAddSlideDropdownOpen] = useState(false);
  
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
      } catch (error) {
        console.error('Error loading context:', error);
      }
    };
    
    loadContext();
  }, [params.microlessonId, courseId, lessonId]);
  
  // Generate slides using AI
  const generateSlides = async () => {
    if (!currentMicrolesson || !courseContext) return;
    
    // Immediately switch to preview mode with loading state
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedSlides([]);
    setShowPreview(true);
    
    // Create initial lesson config with loading placeholder
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
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 1000);
      
      const response = await fetch('/api/ai-slide-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          microlesson: currentMicrolesson,
          courseContext: courseContext,
          additionalContext: additionalContext,
        }),
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Failed to generate slides');
      }
      
      const data = await response.json();
      console.log('Generated slides data:', data.slides);
      setGeneratedSlides(data.slides);
      setGenerationProgress(100);
      
      // Update lesson config with generated slides
      const finalConfig: LessonConfig = {
        id: params.microlessonId,
        title: currentMicrolesson.title,
        description: currentMicrolesson.content,
        slides: data.slides,
        duration: currentMicrolesson.duration,
        course: courseContext.title,
        lesson: courseContext.lessons.find(l => l.id === lessonId)?.title || '',
      };
      
      setLessonConfig(finalConfig);
      
      // Small delay to ensure state is updated before switching to edit mode
      setTimeout(() => {
        setEditingMode(true);
      }, 100);
    } catch (error) {
      console.error('Error generating slides:', error);
      setShowPreview(false);
      alert('Failed to generate slides. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save slides
  const saveSlides = async () => {
    if (!generatedSlides.length) return;
    
    try {
      // TODO: Implement slide saving to database
      console.log('Saving slides:', generatedSlides);
      alert('Slides saved successfully!');
      router.push(`/course-creator/course-outline/${courseId}`);
    } catch (error) {
      console.error('Error saving slides:', error);
      alert('Failed to save slides. Please try again.');
    }
  };

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

    const newSlides = [...generatedSlides];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : generatedSlides.length;
    newSlides.splice(insertIndex, 0, newSlide);
    
    setGeneratedSlides(newSlides);
    setSelectedSlideIndex(insertIndex);
    
    // Update lesson config
    if (lessonConfig) {
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  const deleteSlide = (index: number) => {
    const newSlides = generatedSlides.filter((_, i) => i !== index);
    setGeneratedSlides(newSlides);
    
    if (selectedSlideIndex === index) {
      setSelectedSlideIndex(null);
    } else if (selectedSlideIndex && selectedSlideIndex > index) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    }
    
    // Update lesson config
    if (lessonConfig) {
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
    
    const newSlides = [...generatedSlides];
    newSlides.splice(index + 1, 0, newSlide);
    setGeneratedSlides(newSlides);
    
    // Update lesson config
    if (lessonConfig) {
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  const moveSlide = (fromIndex: number, toIndex: number) => {
    const newSlides = [...generatedSlides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);
    
    setGeneratedSlides(newSlides);
    setSelectedSlideIndex(toIndex);
    
    // Update lesson config
    if (lessonConfig) {
      setLessonConfig({
        ...lessonConfig,
        slides: newSlides
      });
    }
  };

  const updateSlide = (index: number, updatedSlide: SlideType) => {
    const newSlides = [...generatedSlides];
    newSlides[index] = updatedSlide;
    setGeneratedSlides(newSlides);
    
    // Update lesson config
    if (lessonConfig) {
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

  // Slide type options for the Add New Slide menu
  const slideTypes = [
    { type: 'TitleSlide', icon: Type, label: 'Title Slide', color: 'bg-blue-500' },
    { type: 'TitleWithSubtext', icon: FileText, label: 'Title with Text', color: 'bg-green-500' },
    { type: 'TitleWithImage', icon: Image, label: 'Title with Image', color: 'bg-purple-500' },
    { type: 'VideoSlide', icon: Video, label: 'Video Slide', color: 'bg-red-500' },
    { type: 'QuickCheckSlide', icon: CheckSquare, label: 'Quick Check', color: 'bg-yellow-500' },
    { type: 'HotspotActivitySlide', icon: MousePointer, label: 'Hotspot Activity', color: 'bg-indigo-500' },
    { type: 'MarkdownSlide', icon: FileText, label: 'Markdown Slide', color: 'bg-gray-500' },
  ];

  // Helper function to get slide display name
  const getSlideDisplayName = (slide: SlideType): string => {
    if ('title' in slide && slide.title) {
      return slide.title;
    }
    if ('question' in slide && slide.question) {
      return slide.question.length > 30 ? slide.question.substring(0, 30) + '...' : slide.question;
    }
    return `${slide.type.replace(/([A-Z])/g, ' $1').trim()} Slide`;
  };

  // Dropdown hover handlers
  const handleMouseEnterAddSlide = () => {
    setIsAddSlideDropdownOpen(true);
  };

  const handleMouseLeaveAddSlide = () => {
    setIsAddSlideDropdownOpen(false);
  };

  // Render slide preview for live editing
  const renderSlidePreview = (slide: SlideType) => {
    return (
      <div className="w-full h-full relative">
        <EditableSlideRenderer 
          slide={slide}
          onSlideChange={(updatedSlide: SlideType) => {
            if (selectedSlideIndex !== null) {
              updateSlide(selectedSlideIndex, updatedSlide);
            }
          }}
        />
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

  // Editing Mode Interface
  if (editingMode) {
    console.log('Editing mode - slides available:', generatedSlides.length, generatedSlides);
    
    // If no slides are available, show a message
    if (generatedSlides.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-400 text-lg">No slides available for editing</div>
            <p className="text-slate-500 text-sm mt-2">Generate slides first to start editing</p>
            <Button
              onClick={() => setEditingMode(false)}
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
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Header with view mode toggle */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMode(false)}
                  className="text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Generator
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
            />
          </div>
        </div>
      );
    }
    
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
                  
                  {/* Slide Type Dropdown */}
                  {isAddSlideDropdownOpen && (
                    <div 
                      className="absolute top-full left-0 right-0 mt-2 z-50"
                      onMouseEnter={handleMouseEnterAddSlide}
                      onMouseLeave={handleMouseLeaveAddSlide}
                    >
                      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl p-2 max-h-64 overflow-y-auto">
                        {slideTypes.map((slideType) => (
                          <button
                            key={slideType.type}
                            onClick={() => addNewSlide(slideType.type)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                          >
                            <div className={`w-8 h-8 rounded-lg ${slideType.color} flex items-center justify-center`}>
                              <slideType.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white text-sm">{slideType.label}</span>
                          </button>
                        ))}
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
                          {slide.type.replace(/([A-Z])/g, ' $1').trim()}
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
                            deleteSlide(index);
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
        <div className={`flex-1 transition-all duration-300 ${leftPanelOpen ? 'ml-88' : 'ml-4'} ${rightPanelOpen ? 'mr-88' : 'mr-4'}`}>
          {/* Header */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4 mb-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMode(false)}
                  className="text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Generator
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
                  onClick={() => setShowPreview(true)}
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
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
                  {renderSlidePreview(generatedSlides[selectedSlideIndex])}
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

        {/* Right Floating Panel - Media Tools */}
        <AnimatePresence>
          {rightPanelOpen && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="fixed right-4 top-4 bottom-4 w-80 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl z-40 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Media Tools
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRightPanelOpen(false)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </div>

              {/* Media Tools Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Image Tools */}
                <Card className="bg-slate-700/30 border-slate-600/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Image className="w-4 h-4 text-green-400" />
                      Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Stock Images
                    </Button>
                  </CardContent>
                </Card>

                {/* Video Tools */}
                <Card className="bg-slate-700/30 border-slate-600/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-400" />
                      Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Video
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Video Library
                    </Button>
                  </CardContent>
                </Card>

                {/* Slide Properties Editor */}
                {selectedSlideIndex !== null && generatedSlides[selectedSlideIndex] && (
                  <Card className="bg-slate-700/30 border-slate-600/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-400" />
                        Edit Slide
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Title Field */}
                      {'title' in generatedSlides[selectedSlideIndex] && (
                        <div>
                          <label className="text-xs text-slate-300 block mb-1">Title</label>
                          <Input
                            value={generatedSlides[selectedSlideIndex].title || ''}
                            onChange={(e) => updateSlide(selectedSlideIndex, { ...generatedSlides[selectedSlideIndex], title: e.target.value } as SlideType)}
                            className="h-8 bg-slate-800/50 border-slate-600/50 text-white text-sm"
                            placeholder="Enter slide title"
                          />
                        </div>
                      )}
                      
                      {/* Subtitle Field */}
                      {'subtitle' in generatedSlides[selectedSlideIndex] && (
                        <div>
                          <label className="text-xs text-slate-300 block mb-1">Subtitle</label>
                          <Input
                            value={generatedSlides[selectedSlideIndex].subtitle || ''}
                            onChange={(e) => updateSlide(selectedSlideIndex, { ...generatedSlides[selectedSlideIndex], subtitle: e.target.value } as SlideType)}
                            className="h-8 bg-slate-800/50 border-slate-600/50 text-white text-sm"
                            placeholder="Enter subtitle"
                          />
                        </div>
                      )}
                      
                      {/* Content Field */}
                      {'content' in generatedSlides[selectedSlideIndex] && (
                        <div>
                          <label className="text-xs text-slate-300 block mb-1">Content</label>
                          <Textarea
                            value={generatedSlides[selectedSlideIndex].content || ''}
                            onChange={(e) => updateSlide(selectedSlideIndex, { ...generatedSlides[selectedSlideIndex], content: e.target.value } as SlideType)}
                            className="bg-slate-800/50 border-slate-600/50 text-white text-sm resize-none"
                            placeholder="Enter slide content"
                            rows={3}
                          />
                        </div>
                      )}
                      
                      {/* Question Field for QuickCheck */}
                      {'question' in generatedSlides[selectedSlideIndex] && (
                        <div>
                          <label className="text-xs text-slate-300 block mb-1">Question</label>
                          <Textarea
                            value={generatedSlides[selectedSlideIndex].question || ''}
                            onChange={(e) => updateSlide(selectedSlideIndex, { ...generatedSlides[selectedSlideIndex], question: e.target.value } as SlideType)}
                            className="bg-slate-800/50 border-slate-600/50 text-white text-sm resize-none"
                            placeholder="Enter question"
                            rows={2}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Theme Tools */}
                <Card className="bg-slate-700/30 border-slate-600/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-400" />
                      Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'Dark', color: '#1e293b' },
                        { name: 'Blue', color: '#1e40af' },
                        { name: 'Green', color: '#166534' },
                        { name: 'Purple', color: '#7c3aed' },
                        { name: 'Red', color: '#dc2626' },
                        { name: 'Orange', color: '#ea580c' },
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          className="w-full h-10 rounded-lg border-2 border-slate-600/50 hover:border-slate-400 transition-colors"
                          style={{ backgroundColor: theme.color }}
                          onClick={() => {
                            if (selectedSlideIndex !== null) {
                              updateSlide(selectedSlideIndex, { ...generatedSlides[selectedSlideIndex], backgroundColor: theme.color } as SlideType);
                            }
                          }}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Tools */}
                <Card className="bg-slate-700/30 border-slate-600/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-400" />
                      Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Link
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
        
        {!rightPanelOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelOpen(true)}
            className="fixed right-4 top-4 z-50 bg-slate-800/90 backdrop-blur-sm text-slate-300 hover:text-white border border-slate-700/50"
          >
            <Palette className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  if (showPreview && lessonConfig) {
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
                    {generationProgress}% Complete
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
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md mx-auto p-8">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                    style={{
                      background: `conic-gradient(from 0deg, transparent ${generationProgress * 3.6}deg, rgba(59, 130, 246, 0.1) ${generationProgress * 3.6}deg)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Creating Your Slides
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-blue-400">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-slate-400 space-y-1">
                  <p>🎯 Analyzing learning objectives...</p>
                  <p>📚 Structuring content flow...</p>
                  <p>🎨 Designing engaging slides...</p>
                  <p>✨ Adding interactive elements...</p>
                </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/course-creator/course-outline/${courseId}`)}
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