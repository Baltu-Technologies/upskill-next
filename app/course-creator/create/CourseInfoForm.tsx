'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Loader2, Zap, CheckCircle, X, Edit3, Check } from 'lucide-react';

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

interface CourseInfoFormProps {
  courseData: {
    title: string;
    description: string;
    industry: string;
    duration: string;
    skillLevel: string;
    prerequisites: string[];
    learningOutcomes: string[];
    context?: CourseContext;
  };
  updateCourseData: (updates: Record<string, unknown>) => void;
  isGenerating: boolean;
  generationStatus: string | null;
}

const INDUSTRIES = [
  'Semiconductor & Microelectronics',
  'Advanced Manufacturing', 
  'Broadband & Fiber Optics',
  'Green Technology & Renewable Energy',
  'Data Centers (Construction & Operations)',
  'Aerospace & Aviation Technologies',
  'Energy & Power Systems',
  'Specialized Trades in Industrial MEP (Mechanical, Electrical, Plumbing)'
];

const SKILL_LEVELS = [
  { value: 'entry', label: 'Entry Level', description: 'No prior experience required' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience helpful' },
  { value: 'advanced', label: 'Advanced', description: 'Significant experience required' }
];

const DURATIONS = [
  '30 minutes',
  '1 hour',
  '2 hours',
  '4 hours',
  '8 hours',
  '1 day',
  '2 days',
  '1 week',
  '2 weeks'
];

export default function CourseInfoForm({ 
  courseData, 
  updateCourseData, 
  isGenerating, 
  generationStatus 
}: CourseInfoFormProps) {
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newLearningOutcome, setNewLearningOutcome] = useState('');
  
  // Editing state for inline editing
  const [editingPrerequisiteIndex, setEditingPrerequisiteIndex] = useState<number | null>(null);
  const [editingLearningObjectiveIndex, setEditingLearningObjectiveIndex] = useState<number | null>(null);
  const [editingPrerequisiteValue, setEditingPrerequisiteValue] = useState('');
  const [editingLearningObjectiveValue, setEditingLearningObjectiveValue] = useState('');
  
  // AI Quick Start state
  const [quickStartInput, setQuickStartInput] = useState('');
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  const [infoGenerated, setInfoGenerated] = useState(false);

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim()) {
      updateCourseData({
        prerequisites: [...courseData.prerequisites, newPrerequisite.trim()]
      });
      setNewPrerequisite('');
    }
  };

  const handleRemovePrerequisite = (index: number) => {
    updateCourseData({
      prerequisites: courseData.prerequisites.filter((_, i) => i !== index)
    });
  };

  const handleAddLearningOutcome = () => {
    if (newLearningOutcome.trim()) {
      updateCourseData({
        learningOutcomes: [...courseData.learningOutcomes, newLearningOutcome.trim()]
      });
      setNewLearningOutcome('');
    }
  };

  const handleRemoveLearningOutcome = (index: number) => {
    updateCourseData({
      learningOutcomes: courseData.learningOutcomes.filter((_, i) => i !== index)
    });
  };

  // Inline editing functions for prerequisites
  const startEditingPrerequisite = (index: number, value: string) => {
    setEditingPrerequisiteIndex(index);
    setEditingPrerequisiteValue(value);
  };

  const savePrerequisiteEdit = () => {
    if (editingPrerequisiteIndex !== null && editingPrerequisiteValue.trim()) {
      const updatedPrerequisites = [...courseData.prerequisites];
      updatedPrerequisites[editingPrerequisiteIndex] = editingPrerequisiteValue.trim();
      updateCourseData({ prerequisites: updatedPrerequisites });
    }
    setEditingPrerequisiteIndex(null);
    setEditingPrerequisiteValue('');
  };

  const cancelPrerequisiteEdit = () => {
    setEditingPrerequisiteIndex(null);
    setEditingPrerequisiteValue('');
  };

  // Inline editing functions for learning objectives
  const startEditingLearningObjective = (index: number, value: string) => {
    setEditingLearningObjectiveIndex(index);
    setEditingLearningObjectiveValue(value);
  };

  const saveLearningObjectiveEdit = () => {
    if (editingLearningObjectiveIndex !== null && editingLearningObjectiveValue.trim()) {
      const updatedOutcomes = [...courseData.learningOutcomes];
      updatedOutcomes[editingLearningObjectiveIndex] = editingLearningObjectiveValue.trim();
      updateCourseData({ learningOutcomes: updatedOutcomes });
    }
    setEditingLearningObjectiveIndex(null);
    setEditingLearningObjectiveValue('');
  };

  const cancelLearningObjectiveEdit = () => {
    setEditingLearningObjectiveIndex(null);
    setEditingLearningObjectiveValue('');
  };

  const handleQuickStartGenerate = async () => {
    if (!quickStartInput.trim()) return;

    setIsGeneratingInfo(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'course_info',
          prompt: quickStartInput.trim(),
          industry: courseData.industry || 'General',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate course information');
      }

      const data = await response.json();
      
      // Update the course data with generated information
      updateCourseData({
        title: data.title || '',
        description: data.description || '',
        industry: data.industry || '',
        duration: data.duration || '',
        skillLevel: data.skillLevel || '',
        prerequisites: data.prerequisites || [],
        learningOutcomes: data.learningOutcomes || []
      });

      setInfoGenerated(true);
      
      // Auto-hide the success state after 3 seconds
      setTimeout(() => setInfoGenerated(false), 3000);

    } catch (error) {
      console.error('Error generating course information:', error);
      // You could add error handling here
    } finally {
      setIsGeneratingInfo(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickStartGenerate();
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Quick Start Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  AI Quick Start
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Describe your course idea and let AI populate the course information fields
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  value={quickStartInput}
                  onChange={(e) => setQuickStartInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 'Create a semiconductor technician training course for entry-level workers'"
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
                <Button
                  onClick={handleQuickStartGenerate}
                  disabled={!quickStartInput.trim() || isGeneratingInfo}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isGeneratingInfo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isGeneratingInfo ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              
              <AnimatePresence>
                {infoGenerated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">
                      Course information generated! Review and edit the fields below as needed.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <p className="text-xs text-slate-500">
                💡 Tip: Be specific about the role, industry, and skill level for better results
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing Course Information Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                  Course Information
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Define the basic details and structure of your course
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                <label className="text-sm font-medium bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                  Course Title *
                </label>
              </div>
              <Input
                value={courseData.title}
                onChange={(e) => updateCourseData({ title: e.target.value })}
                placeholder="Enter course title..."
                className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-200"
              />
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                <label className="text-sm font-medium bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                  Course Description *
                </label>
              </div>
              <Textarea
                value={courseData.description}
                onChange={(e) => updateCourseData({ description: e.target.value })}
                placeholder="Describe what this course covers and who it's for..."
                className="min-h-[100px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-200"
              />
            </div>

            {/* Industry & Settings Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Industry */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                  <label className="text-sm font-medium bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    Industry
                  </label>
                </div>
                <Select value={courseData.industry} onValueChange={(value) => updateCourseData({ industry: value })}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
                  <label className="text-sm font-medium bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                    Duration
                  </label>
                </div>
                <Select value={courseData.duration} onValueChange={(value) => updateCourseData({ duration: value })}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skill Level */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                  <label className="text-sm font-medium bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Skill Level
                  </label>
                </div>
                <Select value={courseData.skillLevel} onValueChange={(value) => updateCourseData({ skillLevel: value })}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col">
                          <span>{level.label}</span>
                          <span className="text-xs text-slate-400">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Prerequisites
                </label>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  placeholder="Add a prerequisite..."
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPrerequisite()}
                />
                <Button
                  onClick={handleAddPrerequisite}
                  disabled={!newPrerequisite.trim()}
                  variant="outline"
                  className="border-blue-500/50 text-blue-400 hover:text-blue-300 hover:border-blue-400/70 hover:bg-blue-500/10"
                >
                  Add
                </Button>
              </div>
              {courseData.prerequisites.length > 0 && (
                <div className="space-y-2">
                  {courseData.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      {editingPrerequisiteIndex === index ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingPrerequisiteValue}
                            onChange={(e) => setEditingPrerequisiteValue(e.target.value)}
                            className="flex-1 bg-slate-600/50 border-slate-500/50 text-slate-200"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') savePrerequisiteEdit();
                              if (e.key === 'Escape') cancelPrerequisiteEdit();
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={savePrerequisiteEdit}
                            className="w-8 h-8 p-0 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelPrerequisiteEdit}
                            className="w-8 h-8 p-0 border-slate-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-slate-300">{prerequisite}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditingPrerequisite(index, prerequisite)}
                            className="w-8 h-8 p-0 text-slate-400 hover:text-blue-400"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemovePrerequisite(index)}
                            className="w-8 h-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Objectives */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <label className="text-sm font-medium bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Learning Objectives
                </label>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLearningOutcome}
                  onChange={(e) => setNewLearningOutcome(e.target.value)}
                  placeholder="Add a learning objective..."
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLearningOutcome()}
                />
                <Button
                  onClick={handleAddLearningOutcome}
                  disabled={!newLearningOutcome.trim()}
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/70 hover:bg-emerald-500/10"
                >
                  Add
                </Button>
              </div>
              {courseData.learningOutcomes.length > 0 && (
                <div className="space-y-2">
                  {courseData.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      {editingLearningObjectiveIndex === index ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingLearningObjectiveValue}
                            onChange={(e) => setEditingLearningObjectiveValue(e.target.value)}
                            className="flex-1 bg-slate-600/50 border-slate-500/50 text-slate-200"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveLearningObjectiveEdit();
                              if (e.key === 'Escape') cancelLearningObjectiveEdit();
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={saveLearningObjectiveEdit}
                            className="w-8 h-8 p-0 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelLearningObjectiveEdit}
                            className="w-8 h-8 p-0 border-slate-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-slate-300">{outcome}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditingLearningObjective(index, outcome)}
                            className="w-8 h-8 p-0 text-slate-400 hover:text-emerald-400"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveLearningOutcome(index)}
                            className="w-8 h-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generation Status */}
            {(isGenerating || generationStatus) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg backdrop-blur-sm"
              >
                {isGenerating && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                )}
                <span className="text-sm bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent font-medium">
                  {generationStatus || 'Processing...'}
                </span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 