'use client';

import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Import the existing components
import CourseInfoForm from './CourseInfoForm';
import CourseContextForm from './CourseContextForm';
import LessonBuilder from './LessonBuilder';



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

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGeneratingMicrolessons, setIsGeneratingMicrolessons] = useState(false);
  const [microlessonProgress, setMicrolessonProgress] = useState<{[key: number]: number}>({});

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
      // Step 1: Generate enhanced course info
      setGenerationStatus('Analyzing course requirements...');
      const courseInfoResponse = await fetch('/api/ai-course-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationType: 'courseInfo',
          courseContext: courseData.context,
          courseData: courseData
        })
      });

      if (!courseInfoResponse.ok) {
        throw new Error('Failed to generate course information');
      }

      const enhancedCourseInfoResponse = await courseInfoResponse.json();
      const enhancedCourseInfo = enhancedCourseInfoResponse.data || enhancedCourseInfoResponse;
      
      // Update course data with enhanced information
      const updatedCourseData = {
        ...courseData,
        ...enhancedCourseInfo,
        // Keep user's original title and description if they exist
        title: courseData.title || enhancedCourseInfo.title,
        description: courseData.description || enhancedCourseInfo.description
      };
      
      setCourseData(updatedCourseData);

      // Step 2: Generate lessons only (no microlessons yet)
      setGenerationStatus('Creating lesson structure...');
      const lessonsResponse = await fetch('/api/ai-course-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationType: 'lessons',
          courseContext: courseData.context,
          courseData: updatedCourseData
        })
      });

      if (!lessonsResponse.ok) {
        throw new Error('Failed to generate lessons');
      }

      const lessonsDataResponse = await lessonsResponse.json();
      const lessonsData = lessonsDataResponse.data || lessonsDataResponse;
      
      // Final update with generated lessons (microlessons will be empty initially)
      setCourseData(prev => ({
        ...prev,
        ...updatedCourseData,
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



  const canProceedToStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return true; // Info step is always accessible
      case 1: return courseData.title && courseData.description; // Need basic info
      case 2: return courseData.title && courseData.description; // Need basic info for generation
      default: return false;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (canProceedToStep(stepIndex)) return 'available';
    return 'locked';
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1 && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (canProceedToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CourseInfoForm
            courseData={courseData}
            updateCourseData={updateCourseData}
            isGenerating={isGenerating}
            generationStatus={generationStatus}
          />
        );
      case 1:
        return (
          <CourseContextForm
            courseData={courseData}
            updateCourseData={updateCourseData}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* AI Generation Section */}
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
                          Enhanced course details and learning outcomes
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

            {/* Lesson Structure Section - Only show after generation */}
            {courseData.lessons.length > 0 && (
              <LessonBuilder
                lessons={courseData.lessons}
                onLessonsUpdate={(lessons) => updateCourseData({ lessons })}
                isGenerating={isGenerating}
                generationStatus={generationStatus || undefined}
                onGenerateCourse={handleGenerateCourse}
              />
            )}
          </div>
        );
      default:
        return null;
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
                <p className="text-sm text-slate-400">Step {currentStep + 1} of {STEPS.length}</p>
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

      {/* Step Navigation */}
      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {STEPS.map((step, index) => {
                const status = getStepStatus(index);
                const Icon = step.icon;
                
                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => goToStep(index)}
                      disabled={status === 'locked'}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${status === 'current' 
                          ? 'bg-blue-600 text-white' 
                          : status === 'completed'
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                          : status === 'available'
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                          : 'text-slate-600 cursor-not-allowed'
                        }
                      `}
                    >
                      {status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{step.title}</span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <div className="w-8 h-px bg-slate-600 mx-1" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-slate-600 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < STEPS.length - 1 && (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedToStep(currentStep + 1)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 