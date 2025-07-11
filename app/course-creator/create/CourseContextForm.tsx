'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Sparkles, Target } from 'lucide-react';

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

interface FileInfo {
  name: string;
  size: number;
  type: string;
  content?: string;
  uploadedAt: Date;
}

interface CourseContextFormProps {
  courseData: {
    context?: CourseContext;
  };
  updateCourseData: (updates: Record<string, unknown>) => void;
}

export default function CourseContextForm({ courseData, updateCourseData }: CourseContextFormProps) {
  const [jobDescription, setJobDescription] = useState(courseData.context?.jobDescription?.text || '');
  const [courseStructure, setCourseStructure] = useState(courseData.context?.courseStructure?.text || '');

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    updateCourseData({
      context: {
        ...courseData.context,
        jobDescription: {
          text: value,
          source: 'manual',
          files: []
        }
      }
    });
  };

  const handleCourseStructureChange = (value: string) => {
    setCourseStructure(value);
    updateCourseData({
      context: {
        ...courseData.context,
        courseStructure: {
          text: value,
          source: 'manual',
          files: []
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Course Context
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Provide foundational information to help generate targeted course content
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skill Requirement Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <h3 className="text-lg font-semibold text-slate-200">Skill Requirement or Learning Standards</h3>
                <span className="text-xs text-slate-400">(Optional)</span>
              </div>
              <p className="text-sm text-slate-400">
                Enter the specific skill requirement or learning standard this course addresses. This could be extracted from a job description, curriculum standard, or certification requirement.
              </p>
              <Textarea
                value={jobDescription}
                onChange={(e) => handleJobDescriptionChange(e.target.value)}
                placeholder="Enter the specific skill requirement... (e.g., 'Ability to operate semiconductor fabrication equipment safely and efficiently' or 'Understanding of basic electrical safety protocols')"
                className="min-h-[120px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>

            {/* Course Structure Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <h3 className="text-lg font-semibold text-slate-200">Course Structure Guidelines</h3>
                <span className="text-xs text-slate-400">(Optional)</span>
              </div>
              <p className="text-sm text-slate-400">
                Describe any specific structure, topics, or requirements for the course content.
              </p>
              <Textarea
                value={courseStructure}
                onChange={(e) => handleCourseStructureChange(e.target.value)}
                placeholder="Describe course structure requirements... (e.g., 'Focus on hands-on practical skills, include safety protocols, cover basic to advanced topics...')"
                className="min-h-[120px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-500 focus:border-green-500/50 focus:ring-green-500/20"
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                <h3 className="text-lg font-semibold text-slate-200">Upload Reference Files</h3>
                <span className="text-xs text-slate-400">(Coming Soon)</span>
              </div>
              <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">File upload functionality will be added soon</p>
                <p className="text-xs text-slate-500">
                  Upload PDFs, documents, or training materials to provide additional context
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            {(jobDescription || courseStructure) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">
                  Context information provided - ready to proceed to next step
                </span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 