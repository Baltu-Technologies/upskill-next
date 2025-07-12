'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  BookOpen, 
  Target, 
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Import the existing components
import CourseInfoForm from './CourseInfoForm';
import CourseContextForm from './CourseContextForm';
import LessonBuilder from './LessonBuilder';

const STEPS = [
  {
    id: 'info',
    title: 'Course Information',
    description: 'Define basic course details',
    icon: BookOpen,
    color: 'orange'
  },
  {
    id: 'context',
    title: 'Course Context',
    description: 'Provide job description and structure',
    icon: Target,
    color: 'blue'
  },
  {
    id: 'lessons',
    title: 'Lesson Outline',
    description: 'Generate and organize lessons',
    icon: Sparkles,
    color: 'purple'
  }
];



interface FileInfo {
  name: string;
  size: number;
  type: string;
  content?: string;
  uploadedAt: Date;
}

interface CourseContext {
  jobDescription?: {
    text: string;
    source: string;
    files: FileInfo[];
  };
  courseStructure?: {
    text: string;
    source: string;
    files: FileInfo[];
  };
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

interface CourseData {
  // Basic course information
  title: string;
  description: string;
  industry: string;
  duration: string;
  skillLevel: 'entry' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningOutcomes: string[];
  
  // Context for AI generation
  context?: CourseContext;
  
  // Generated content
  lessons: SimpleLesson[];
  microlessons: SimpleMicrolesson[];
  assessments: SimpleAssessment[];
  
  // Metadata
  tags?: string[];
  estimatedDuration?: string;
  courseLevel?: string;
}

const SECTIONS = [
  {
    id: 'info',
    title: 'Course Information',
    description: 'Define basic course details',
    icon: BookOpen,
    color: 'orange'
  },
  {
    id: 'context',
    title: 'Course Context',
    description: 'Provide job description and structure',
    icon: Target,
    color: 'blue'
  },
  {
    id: 'lessons',
    title: 'Lesson Outline',
    description: 'Generate and organize lessons',
    icon: Sparkles,
    color: 'purple'
  }
];

export default function CreateCoursePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('info');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGeneratingMicrolessons, setIsGeneratingMicrolessons] = useState(false);
  const [microlessonProgress, setMicrolessonProgress] = useState<{[key: number]: number}>({});
  
  // Refs for scrolling to sections
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    industry: '',
    duration: '',
    skillLevel: 'entry',
    prerequisites: [],
    learningOutcomes: [],
    lessons: [],
    microlessons: [],
    assessments: [],
    context: {
      jobDescription: {
        text: '',
        source: 'manual',
        files: []
      },
      courseStructure: {
        text: '',
        source: 'manual',
        files: []
      }
    }
  });

  const updateCourseData = (updates: Partial<CourseData>) => {
    setCourseData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleGenerateCourse = () => {
    // Navigate to Course Outline page with the current course data
    const courseId = 'temp-' + Date.now(); // Temporary ID for the course
    localStorage.setItem('courseData', JSON.stringify(courseData));
    router.push(`/course-creator/course-outline/${courseId}`);
  };

  const generateCourseContent = async () => {
    if (!courseData.title || !courseData.description) {
      toast.error("Missing Information", {
        description: "Please complete the course information before generating content."
      });
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      // Generate lessons directly using existing course information
      setGenerationStatus('Creating lesson structure...');
      const lessonsResponse = await fetch('/api/ai-course-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationType: 'lessons',
          courseContext: courseData.context,
          courseData: courseData
        })
      });

      if (!lessonsResponse.ok) {
        throw new Error('Failed to generate lessons');
      }

      const lessonsDataResponse = await lessonsResponse.json();
      const lessonsData = lessonsDataResponse.data || lessonsDataResponse;
      
      // Update with generated lessons (microlessons will be empty initially)
      setCourseData(prev => ({
        ...prev,
        lessons: lessonsData.lessons || [],
        microlessons: [], // No microlessons generated yet
        assessments: [] // No assessments generated yet
      }));

      setGenerationStatus('Lesson outline generated successfully!');
      
      toast.success("Lesson Outline Generated!", {
        description: "Your lesson structure has been created. You can now customize each lesson."
      });

      // Stay on current step - no automatic navigation
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStatus(null);
      }, 1500);

    } catch (error) {
      console.error('Generation error:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate course content');
      setIsGenerating(false);
      setGenerationStatus(null);
      
      toast.error("Generation Failed", {
        description: "There was an error generating your course content. Please try again."
      });
    }
  };

  const generateMicrolessons = async () => {
    if (!courseData.lessons.length) return;

    setIsGeneratingMicrolessons(true);
    setMicrolessonProgress({});

    try {
      const allMicrolessons: any[] = [];

      // Generate microlessons for each lesson
      for (let i = 0; i < courseData.lessons.length; i++) {
        const lesson = courseData.lessons[i];
        setMicrolessonProgress(prev => ({ ...prev, [i]: 0 }));

        const response = await fetch('/api/ai-course-generation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'microlessons',
            courseInfo: courseData,
            lesson: lesson,
            lessonIndex: i
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to generate microlessons for lesson ${i + 1}`);
        }

        const data = await response.json();
        const lessonMicrolessons = data.data?.microlessons || [];
        
        // Add lesson index to each microlesson for tracking
        const indexedMicrolessons = lessonMicrolessons.map((ml: any, mlIndex: number) => ({
          ...ml,
          lessonIndex: i,
          microlessonIndex: mlIndex
        }));

        allMicrolessons.push(...indexedMicrolessons);
        setMicrolessonProgress(prev => ({ ...prev, [i]: 100 }));

        // Update microlessons in real-time
        setCourseData(prev => ({
          ...prev,
          microlessons: [...prev.microlessons, ...indexedMicrolessons]
        }));
      }

             toast.success("Microlessons Generated!", {
         description: `Generated ${allMicrolessons.length} microlessons across ${courseData.lessons.length} lessons.`,
       });

     } catch (error) {
       console.error('Microlesson generation error:', error);
       toast.error("Generation Failed", {
         description: "Failed to generate microlessons. Please try again.",
       });
    } finally {
      setIsGeneratingMicrolessons(false);
      setMicrolessonProgress({});
    }
  };



  const getSectionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'info':
        return courseData.title && courseData.description ? 'completed' : 'active';
      case 'context':
        return courseData.context?.jobDescription?.text && courseData.context?.courseStructure?.text ? 'completed' : 
               courseData.title && courseData.description ? 'active' : 'pending';
      case 'lessons':
        return courseData.lessons.length > 0 ? 'completed' :
               courseData.title && courseData.description ? 'active' : 'pending';
      default:
        return 'pending';
    }
  };

  const canAccessSection = (sectionId: string) => {
    switch (sectionId) {
      case 'info':
        return true; // Always accessible
      case 'context':
        return courseData.title && courseData.description; // Requires basic info
      case 'lessons':
        return courseData.title && courseData.description; // Only requires Course Information to be complete
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/course-creator')}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-slate-600" />
              <div>
                <h1 className="text-xl font-bold text-white">Create New Course</h1>
                <p className="text-sm text-slate-400">Complete each section below</p>
              </div>
            </div>
            
            {courseData.title && (
              <div className="hidden md:block">
                <p className="text-sm text-slate-400">Course Title:</p>
                <p className="text-white font-medium">{courseData.title}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="w-64 border-r border-slate-700 bg-slate-900/50 sticky top-[72px] h-screen overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-400 mb-4">Course Creation</h2>
            <nav className="space-y-2">
                             {STEPS.map((step: any) => {
                 const status = getSectionStatus(step.id);
                 const Icon = step.icon;
                 const isAccessible = canAccessSection(step.id);
                
                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && scrollToSection(step.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isAccessible 
                        ? 'hover:bg-slate-800/50 cursor-pointer' 
                        : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${status === 'completed' ? 'bg-green-500 border-green-500' : 
                        status === 'active' ? 'bg-blue-500 border-blue-500' : 
                        status === 'pending' ? 'border-slate-600' : 
                        'border-slate-600'}
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className={`w-3 h-3 ${
                          status === 'active' ? 'text-white' : 
                          status === 'pending' ? 'text-slate-600' : 
                          'text-slate-600'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        status === 'completed' ? 'text-green-400' : 
                        status === 'active' ? 'text-blue-400' : 
                        status === 'pending' ? 'text-slate-600' : 
                        'text-slate-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-slate-600">
                        {step.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Course Information Section */}
              <section id="info" ref={(el: HTMLDivElement | null) => { if (el) sectionRefs.current['info'] = el; }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Course Information</h2>
                  <p className="text-slate-400">Define the basic details of your course</p>
                </div>
                <CourseInfoForm
                  courseData={courseData}
                  updateCourseData={updateCourseData}
                  isGenerating={isGenerating}
                  generationStatus={generationStatus}
                />
              </section>

              {/* Course Context Section */}
              <section id="context" ref={(el: HTMLDivElement | null) => { if (el) sectionRefs.current['context'] = el; }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Course Context</h2>
                  <p className="text-slate-400">Provide job description and structure for AI generation</p>
                </div>
                <CourseContextForm
                  courseData={courseData}
                  updateCourseData={updateCourseData}
                />
              </section>

              {/* Lesson Outline Section */}
              <section id="lessons" ref={(el: HTMLDivElement | null) => { if (el) sectionRefs.current['lessons'] = el; }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Lesson Outline</h2>
                  <p className="text-slate-400">Generate and organize your course lessons</p>
                </div>
                
                {/* AI Generation Section */}
                {canAccessSection('lessons') && (
                  <div className="space-y-6">
                    <Card className="border-purple-500/50 bg-purple-500/5">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                              Generate Lesson Outline
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                              Generate comprehensive lesson structure using AI
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {!isGenerating && !courseData.lessons.length && (
                          <>
                            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                              <h3 className="text-lg font-semibold text-white mb-4">Ready to Generate!</h3>
                              <p className="text-slate-300 mb-4">
                                Based on your course information and context, AI will generate:
                              </p>
                              <ul className="space-y-2 text-sm text-slate-400 mb-6">
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  Enhanced course details and learning objectives
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  Structured lesson plan with clear objectives
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  Lesson titles, descriptions, and learning objectives
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  Editable lesson structure ready for customization
                                </li>
                              </ul>
                              <Button
                                onClick={generateCourseContent}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                size="lg"
                              >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Lesson Outline
                              </Button>
                            </div>
                          </>
                        )}

                        {isGenerating && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                          >
                            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Generating Your Course</h3>
                            <p className="text-slate-400 mb-4">
                              This may take a few moments as we create comprehensive content...
                            </p>
                            {generationStatus && (
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mx-auto">
                                <p className="text-sm text-blue-400 font-medium">{generationStatus}</p>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {generationError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="w-5 h-5 text-red-400" />
                              <h3 className="text-red-400 font-medium">Generation Failed</h3>
                            </div>
                            <p className="text-sm text-red-300 mb-4">{generationError}</p>
                            <Button
                              onClick={generateCourseContent}
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                              Try Again
                            </Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Generated Lessons - Edit and organize your lesson structure */}
                    {courseData.lessons.length > 0 && (
                      <div className="space-y-6">
                        <div className="border-t border-slate-700/50 pt-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">Generated Lessons</h3>
                              <p className="text-sm text-slate-400">
                                {courseData.lessons.length} lesson{courseData.lessons.length !== 1 ? 's' : ''} created • Click to edit titles, descriptions, and objectives
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <LessonBuilder
                          lessons={courseData.lessons}
                          onLessonsUpdate={(lessons) => updateCourseData({ lessons })}
                          isGenerating={isGenerating}
                          generationStatus={generationStatus || undefined}
                          onGenerateCourse={handleGenerateCourse}
                          courseInfo={{
                            title: courseData.title,
                            description: courseData.description,
                            industry: courseData.industry,
                            skillLevel: courseData.skillLevel
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {!canAccessSection('lessons') && (
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Complete Previous Sections</h3>
                    <p className="text-slate-400">
                      You need to complete the Course Information and Course Context sections before proceeding to lesson generation.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 