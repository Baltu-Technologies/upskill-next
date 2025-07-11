'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Target,
  User,
  Award,
  Play,
  CheckCircle,
  ArrowRight,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AiEnhancedInput } from '@/components/ui/ai-enhanced-input';
import CourseContextForm from '@/app/course-creator/create/CourseContextForm';

interface CourseContext {
  jobDescription?: {
    text: string;
    source: string;
    files: any[];
  };
  courseStructure?: {
    text: string;
    source: string;
    files: any[];
  };
}

export default function AiCourseCreatorDemo() {
  const [courseContext, setCourseContext] = useState<CourseContext>({});
  const [demoData, setDemoData] = useState({
    title: '',
    description: '',
    learningOutcome: '',
    prerequisite: '',
    lessonTitle: '',
    lessonDescription: '',
    lessonObjective: ''
  });

  const updateField = (field: string, value: string) => {
    setDemoData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">AI-Powered Course Creation</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Create Courses with <span className="text-blue-400">AI Assistance</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-8"
          >
            Get intelligent suggestions for every text field in your course creation workflow. 
            Our AI understands industrial training contexts and provides professional, relevant suggestions.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-blue-400" />,
              title: "Smart Suggestions",
              description: "AI generates contextual suggestions based on your industry and content"
            },
            {
              icon: <CheckCircle className="w-6 h-6 text-green-400" />,
              title: "Accept & Decline",
              description: "Review suggestions and choose what works best for your course"
            },
            {
              icon: <Target className="w-6 h-6 text-purple-400" />,
              title: "Industry-Focused",
              description: "Tailored for semiconductor, manufacturing, and technical industries"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 h-full hover:bg-slate-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Course Context Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Course Context Foundation
              </CardTitle>
              <CardDescription>
                Provide foundational context that will enhance all AI suggestions throughout the course creation process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseContextForm 
                courseData={{ context: courseContext }}
                updateCourseData={(updates) => setCourseContext(prev => ({ ...prev, ...updates.context }))}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-slate-700 bg-slate-800/50 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-400" />
                Interactive Demo - Try AI Suggestions
              </CardTitle>
              <CardDescription>
                Type some text in any field below, then click the <Sparkles className="w-4 h-4 inline text-blue-400" /> button to get AI suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course Level Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Course Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AiEnhancedInput
                    label="Course Title"
                    value={demoData.title}
                    onChange={(value) => updateField('title', value)}
                    placeholder="e.g., Semiconductor Manufacturing"
                    fieldType="courseTitle"
                    context={{
                      industry: 'Semiconductor & Microelectronics',
                      skillLevel: 'intermediate'
                    }}
                    courseContext={courseContext}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  
                  <AiEnhancedInput
                    label="Course Description"
                    value={demoData.description}
                    onChange={(value) => updateField('description', value)}
                    placeholder="Describe the course overview..."
                    fieldType="courseDescription"
                    multiline={true}
                    context={{
                      title: demoData.title,
                      industry: 'Semiconductor & Microelectronics',
                      skillLevel: 'intermediate'
                    }}
                    courseContext={courseContext}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AiEnhancedInput
                    label="Learning Outcome"
                    value={demoData.learningOutcome}
                    onChange={(value) => updateField('learningOutcome', value)}
                    placeholder="What will students be able to do?"
                    fieldType="learningOutcome"
                    context={{
                      title: demoData.title,
                      industry: 'Semiconductor & Microelectronics',
                      skillLevel: 'intermediate'
                    }}
                    courseContext={courseContext}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  
                  <AiEnhancedInput
                    label="Prerequisite"
                    value={demoData.prerequisite}
                    onChange={(value) => updateField('prerequisite', value)}
                    placeholder="What should students know beforehand?"
                    fieldType="prerequisite"
                    context={{
                      title: demoData.title,
                      industry: 'Semiconductor & Microelectronics',
                      skillLevel: 'intermediate'
                    }}
                    courseContext={courseContext}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Lesson Level Fields */}
              <div className="space-y-4 pt-6 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Lesson Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AiEnhancedInput
                    label="Lesson Title"
                    value={demoData.lessonTitle}
                    onChange={(value) => updateField('lessonTitle', value)}
                    placeholder="e.g., Clean Room Procedures"
                    fieldType="lessonTitle"
                    context={{
                      courseTitle: demoData.title,
                      industry: 'Semiconductor & Microelectronics',
                      skillLevel: 'intermediate'
                    }}
                    courseContext={courseContext}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  
                  <AiEnhancedInput
                    label="Lesson Description"
                    value={demoData.lessonDescription}
                    onChange={(value) => updateField('lessonDescription', value)}
                    placeholder="Describe what this lesson covers..."
                    fieldType="lessonDescription"
                    multiline={true}
                    context={{
                      courseTitle: demoData.title,
                      lessonTitle: demoData.lessonTitle,
                      industry: 'Semiconductor & Microelectronics',
                      skillLevel: 'intermediate'
                    }}
                    courseContext={courseContext}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                
                <AiEnhancedInput
                  label="Lesson Objective"
                  value={demoData.lessonObjective}
                  onChange={(value) => updateField('lessonObjective', value)}
                  placeholder="What specific skill will students learn?"
                  fieldType="lessonObjective"
                  context={{
                    courseTitle: demoData.title,
                    lessonTitle: demoData.lessonTitle,
                    industry: 'Semiconductor & Microelectronics',
                    skillLevel: 'intermediate'
                  }}
                  courseContext={courseContext}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Create Your Course?
              </h3>
              <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                Experience the full course creation workflow with AI-powered suggestions at every step. 
                Create professional training content faster than ever before.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => window.open('/course-creator/create', '_blank')}
              >
                Start Creating Course
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 