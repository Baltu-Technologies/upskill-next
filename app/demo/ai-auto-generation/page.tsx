'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Building2, 
  BookOpen, 
  CheckCircle,
  Clock,
  Target,
  Zap,
  FileText,
  Users,
  Award,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function AiAutoGenerationDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [context, setContext] = useState({
    jobDescription: "Semiconductor Manufacturing Technician: Responsible for operating clean room equipment, maintaining sterile environments, conducting quality control tests, and following safety protocols in wafer fabrication processes.",
    courseStructure: "Progressive skill building from basic concepts to hands-on application. Include safety protocols, equipment operation, quality control, and troubleshooting. Each lesson should build upon previous knowledge."
  });

  const steps = [
    {
      title: "Course Context",
      description: "Provide job description and course structure",
      icon: Building2,
      content: "context"
    },
    {
      title: "AI Generation",
      description: "AI analyzes context and generates course information",
      icon: Zap,
      content: "generation"
    },
    {
      title: "Course Information",
      description: "Review and edit generated course details",
      icon: FileText,
      content: "courseInfo"
    },
    {
      title: "Lesson Structure",
      description: "AI generates comprehensive lesson plan",
      icon: BookOpen,
      content: "lessons"
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Generate course info
      const courseResponse = await fetch('/api/ai-course-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationType: 'courseInfo',
          courseContext: {
            jobDescription: { text: context.jobDescription, source: 'manual' },
            courseStructure: { text: context.courseStructure, source: 'manual' }
          }
        })
      });
      
      const courseResult = await courseResponse.json();
      
      if (courseResult.success) {
        // Generate lessons
        const lessonsResponse = await fetch('/api/ai-course-generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            generationType: 'lessons',
            courseContext: {
              jobDescription: { text: context.jobDescription, source: 'manual' },
              courseStructure: { text: context.courseStructure, source: 'manual' }
            },
            courseData: courseResult.data
          })
        });
        
        const lessonsResult = await lessonsResponse.json();
        
        if (lessonsResult.success) {
          setGeneratedData({
            courseInfo: courseResult.data,
            lessons: lessonsResult.data.lessons
          });
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      handleGenerate();
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            AI Auto-Generation Demo
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-4">
            AI-Powered Course Auto-Generation
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience how AI transforms course context into comprehensive course structures in seconds
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${index <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-600 text-slate-300'
                  }
                `}>
                  <step.icon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
                             <CardTitle className="text-white flex items-center gap-2">
                 {React.createElement(steps[currentStep].icon, { className: "w-5 h-5 text-purple-400" })}
                 {steps[currentStep].title}
               </CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-white font-medium mb-2 block">Job Description & Knowledge Standards</label>
                    <Textarea
                      value={context.jobDescription}
                      onChange={(e) => setContext(prev => ({ ...prev, jobDescription: e.target.value }))}
                      placeholder="Enter job description, curriculum standards, or knowledge requirements..."
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block">Course Structure Guidelines</label>
                    <Textarea
                      value={context.courseStructure}
                      onChange={(e) => setContext(prev => ({ ...prev, courseStructure: e.target.value }))}
                      placeholder="Enter course structure guidelines, learning progression, or instructional approach..."
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="text-center py-8">
                  {isGenerating ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <h3 className="text-xl font-semibold text-white">AI is analyzing your context...</h3>
                      <p className="text-slate-300">Generating comprehensive course structure</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Zap className="w-16 h-16 text-blue-400 mx-auto" />
                      <h3 className="text-xl font-semibold text-white">Ready to Generate</h3>
                      <p className="text-slate-300">Click Next to let AI create your course structure</p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && generatedData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Course Title</h3>
                      <p className="text-slate-300">{generatedData.courseInfo.title}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Industry & Level</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{generatedData.courseInfo.industry}</Badge>
                        <Badge variant="outline">{generatedData.courseInfo.skillLevel}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2">Description</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{generatedData.courseInfo.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Learning Outcomes</h3>
                      <ul className="space-y-1">
                        {generatedData.courseInfo.learningOutcomes.map((outcome: string, index: number) => (
                          <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                            <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Prerequisites</h3>
                      <ul className="space-y-1">
                        {generatedData.courseInfo.prerequisites.map((prereq: string, index: number) => (
                          <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && generatedData && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Generated Lesson Structure</h3>
                    <p className="text-slate-300">AI created {generatedData.lessons.length} comprehensive lessons</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {generatedData.lessons.map((lesson: any, index: number) => (
                      <Card key={index} className="border-slate-600 bg-slate-700/30">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                              {lesson.order}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-1">{lesson.title}</h4>
                              <p className="text-slate-300 text-sm mb-2">{lesson.description}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.estimatedDuration}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {lesson.objectives.length} objectives
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isGenerating}
              className="border-slate-600 text-slate-300 hover:text-white"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : index < currentStep ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1 || isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 