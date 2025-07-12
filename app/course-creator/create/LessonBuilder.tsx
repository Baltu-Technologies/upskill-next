'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Edit3, 
  Save, 
  Plus, 
  X,
  Play,
  Clock,
  BookOpen,
  Loader2,
  CheckCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SimpleLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  microlessons: any[];
}

interface SimpleMicrolesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'interactive' | 'quiz' | 'text';
  content: string;
  lessonIndex: number;
  microlessonIndex: number;
}

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

interface CourseData {
  title: string;
  description: string;
  industry: string;
  duration: string;
  skillLevel: 'entry' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningOutcomes: string[];
  context?: CourseContext;
}

interface CourseInfo {
  title: string;
  description: string;
  industry: string;
  skillLevel: string;
}

interface LessonBuilderProps {
  lessons?: SimpleLesson[];
  microlessons?: SimpleMicrolesson[];
  onLessonsUpdate: (lessons: SimpleLesson[]) => void;
  isGenerating?: boolean;
  generationStatus?: string;
  onGenerateCourse?: () => void;
  courseInfo?: CourseInfo;
}

export default function LessonBuilder({ 
  lessons, 
  microlessons, 
  onLessonsUpdate, 
  isGenerating = false,
  generationStatus,
  onGenerateCourse,
  courseInfo
}: LessonBuilderProps) {
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<number | null>(null);
  const [newObjective, setNewObjective] = useState('');
  const [generatingObjectivesForLesson, setGeneratingObjectivesForLesson] = useState<string | null>(null);
  const [generatingTitleForLesson, setGeneratingTitleForLesson] = useState<string | null>(null);
  const [generatingDescriptionForLesson, setGeneratingDescriptionForLesson] = useState<string | null>(null);

  // AI Suggestion Preview states
  const [aiSuggestions, setAiSuggestions] = useState<{
    [lessonId: string]: {
      title?: string;
      description?: string;
      objectives?: string[];
    }
  }>({});

  // Group microlessons by lesson index
  const microlessonsByLesson = (microlessons || []).reduce((acc, microlesson) => {
    const lessonIndex = microlesson.lessonIndex;
    if (!acc[lessonIndex]) {
      acc[lessonIndex] = [];
    }
    acc[lessonIndex].push(microlesson);
    return acc;
  }, {} as { [key: number]: SimpleMicrolesson[] });

    const updateLesson = (lessonId: string, updates: Partial<SimpleLesson>) => {
    if (!lessons) return;
    const updatedLessons = lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    );
    onLessonsUpdate(updatedLessons);
  };

  const moveLesson = (fromIndex: number, toIndex: number) => {
    if (!lessons || toIndex < 0 || toIndex >= lessons.length) return;
    
    const newLessons = [...lessons];
    const [movedLesson] = newLessons.splice(fromIndex, 1);
    newLessons.splice(toIndex, 0, movedLesson);
    onLessonsUpdate(newLessons);
  };

  const addObjective = (lessonId: string) => {
    if (!newObjective.trim() || !lessons) return;
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      updateLesson(lessonId, {
        objectives: [...lesson.objectives, newObjective.trim()]
      });
      setNewObjective('');
    }
  };

  const updateObjective = (lessonId: string, objectiveIndex: number, newText: string) => {
    if (!lessons) return;
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      const updatedObjectives = [...lesson.objectives];
      updatedObjectives[objectiveIndex] = newText;
      updateLesson(lessonId, { objectives: updatedObjectives });
    }
  };

  const removeObjective = (lessonId: string, objectiveIndex: number) => {
    if (!lessons) return;
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      const updatedObjectives = lesson.objectives.filter((_, index) => index !== objectiveIndex);
      updateLesson(lessonId, { objectives: updatedObjectives });
    }
  };

  const addNewLesson = () => {
    const newLesson: SimpleLesson = {
      id: `lesson-${Date.now()}`,
      title: `New Lesson ${(lessons || []).length + 1}`,
      description: 'Click edit to add a description for this lesson',
      duration: '15 minutes',
      objectives: [],
      microlessons: []
    };
    
    const updatedLessons = [...(lessons || []), newLesson];
    onLessonsUpdate(updatedLessons);
    
    // Automatically enter edit mode for the new lesson
    setEditingLessonId(newLesson.id);
    
    toast.success("New Lesson Added!", {
      description: "Click edit to customize the lesson details"
    });
  };

  // AI Suggestion functions
  const acceptSuggestion = (lessonId: string, type: 'title' | 'description' | 'objectives') => {
    const suggestion = aiSuggestions[lessonId]?.[type];
    if (!suggestion) return;

    if (type === 'objectives' && Array.isArray(suggestion)) {
      updateLesson(lessonId, { objectives: suggestion });
    } else if ((type === 'title' || type === 'description') && typeof suggestion === 'string') {
      updateLesson(lessonId, { [type]: suggestion });
    }

    // Clear the suggestion after accepting
    setAiSuggestions(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        [type]: undefined
      }
    }));

    toast.success("Suggestion Applied!", {
      description: `Updated lesson ${type} with AI suggestion`
    });
  };

  const declineSuggestion = (lessonId: string, type: 'title' | 'description' | 'objectives') => {
    setAiSuggestions(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        [type]: undefined
      }
    }));

    toast.info("Suggestion Declined", {
      description: "You can generate a new suggestion anytime"
    });
  };

  const getMicrolessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'interactive': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getMicrolessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-900/50 text-red-300 border-red-800/50';
      case 'interactive': return 'bg-blue-900/50 text-blue-300 border-blue-800/50';
      case 'quiz': return 'bg-green-900/50 text-green-300 border-green-800/50';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  const generateLearningObjectives = async (lessonId: string) => {
    if (!courseInfo || !lessons) return;
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.title || !lesson.description) {
      toast.error("Missing Information", {
        description: "Please complete the lesson title and description before generating objectives."
      });
      return;
    }

    setGeneratingObjectivesForLesson(lessonId);
    
    try {
      const response = await fetch('/api/ai-course-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationType: 'learningObjectives',
          courseData: courseInfo,
          lessonData: {
            title: lesson.title,
            description: lesson.description,
            currentObjectives: lesson.objectives
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning objectives');
      }

      const result = await response.json();
      
      if (result.success && result.objectives) {
        // Store suggestion for preview instead of directly updating
        setAiSuggestions(prev => ({
          ...prev,
          [lessonId]: {
            ...prev[lessonId],
            objectives: result.objectives
          }
        }));
        
        toast.success("Learning Objectives Generated!", {
          description: `Generated ${result.objectives.length} learning objectives for "${lesson.title}". Review and accept below.`
        });
      } else {
        throw new Error(result.error || 'Failed to generate objectives');
      }
    } catch (error) {
      console.error('Error generating learning objectives:', error);
      toast.error("Generation Failed", {
        description: "There was an error generating learning objectives. Please try again."
      });
    } finally {
      setGeneratingObjectivesForLesson(null);
    }
  };

  const generateLessonTitle = async (lessonId: string) => {
    if (!courseInfo) return;
    
    const lesson = lessons?.find(l => l.id === lessonId);
    if (!lesson) return;

    setGeneratingTitleForLesson(lessonId);
    
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lesson_title',
          context: {
            courseTitle: courseInfo.title,
            courseDescription: courseInfo.description,
            industry: courseInfo.industry,
            skillLevel: courseInfo.skillLevel,
            currentTitle: lesson.title,
            currentDescription: lesson.description,
            allLessons: lessons?.map(l => ({ title: l.title, description: l.description })) || []
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate title suggestions');
      }

      const result = await response.json();
      
      if (result.success && result.suggestions && result.suggestions.length > 0) {
        // Store suggestion for preview instead of directly updating
        setAiSuggestions(prev => ({
          ...prev,
          [lessonId]: {
            ...prev[lessonId],
            title: result.suggestions[0]
          }
        }));
        
        toast.success("Title Generated!", {
          description: `Generated new title suggestion for the lesson. Review and accept below.`
        });
      } else {
        throw new Error(result.error || 'Failed to generate title');
      }
    } catch (error) {
      console.error('Error generating lesson title:', error);
      toast.error("Generation Failed", {
        description: "There was an error generating the title. Please try again."
      });
    } finally {
      setGeneratingTitleForLesson(null);
    }
  };

  const generateLessonDescription = async (lessonId: string) => {
    if (!courseInfo) return;
    
    const lesson = lessons?.find(l => l.id === lessonId);
    if (!lesson || !lesson.title) {
      toast.error("Missing Information", {
        description: "Please add a lesson title before generating the description."
      });
      return;
    }

    setGeneratingDescriptionForLesson(lessonId);
    
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lesson_description',
          context: {
            courseTitle: courseInfo.title,
            courseDescription: courseInfo.description,
            industry: courseInfo.industry,
            skillLevel: courseInfo.skillLevel,
            lessonTitle: lesson.title,
            currentDescription: lesson.description,
            allLessons: lessons?.map(l => ({ title: l.title, description: l.description })) || []
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate description suggestions');
      }

      const result = await response.json();
      
      if (result.success && result.suggestions && result.suggestions.length > 0) {
        // Store suggestion for preview instead of directly updating
        setAiSuggestions(prev => ({
          ...prev,
          [lessonId]: {
            ...prev[lessonId],
            description: result.suggestions[0]
          }
        }));
        
        toast.success("Description Generated!", {
          description: `Generated new description for "${lesson.title}". Review and accept below.`
        });
      } else {
        throw new Error(result.error || 'Failed to generate description');
      }
    } catch (error) {
      console.error('Error generating lesson description:', error);
      toast.error("Generation Failed", {
        description: "There was an error generating the description. Please try again."
      });
    } finally {
      setGeneratingDescriptionForLesson(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Real-time Generation Display */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            <h3 className="text-lg font-semibold text-purple-200">
              Generating Lesson Outline
            </h3>
          </div>
          
          {generationStatus && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-300 font-medium">{generationStatus}</p>
            </div>
          )}
          
          <div className="text-sm text-purple-300">
            <p className="mb-2">AI is creating comprehensive lessons with:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                Lesson titles and descriptions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                Learning objectives for each lesson
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                Course structure and organization
              </li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Show generation success message */}
      {!isGenerating && (lessons || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-green-200">
              Lesson Outline Generated Successfully!
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-200">{(lessons || []).length}</div>
              <div className="text-sm text-green-300">Lessons Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-200">
                {(lessons || []).reduce((total, lesson) => total + (lesson.objectives?.length || 0), 0)}
              </div>
              <div className="text-sm text-green-300">Learning Objectives</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {(lessons || []).map((lesson, lessonIndex) => {
          const isEditing = editingLessonId === lesson.id;
          const lessonMicrolessons = microlessonsByLesson[lessonIndex] || [];

          return (
            <motion.div
              key={lesson.id}
              layout
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm"
            >
              {/* Lesson Header */}
              <div className="p-6 border-b border-slate-700/50 bg-slate-700/30">
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <GripVertical className="h-4 w-4 text-slate-500" />
                    <Badge variant="outline" className="text-xs px-2 border-slate-600/50 text-slate-400">
                      {lessonIndex + 1}
                    </Badge>
                  </div>

                  {/* Lesson Content */}
                  <div className="flex-1 space-y-3">
                    {/* Lesson Title */}
                    {isEditing ? (
                      <div className="relative">
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                          className="text-lg font-semibold bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 pr-10"
                          placeholder="Lesson title..."
                          onKeyDown={(e) => e.key === 'Enter' && setEditingLessonId(null)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => generateLessonTitle(lesson.id)}
                          disabled={generatingTitleForLesson === lesson.id}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 disabled:opacity-50"
                          title="Generate AI title suggestion"
                        >
                          {generatingTitleForLesson === lesson.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-white">
                        {lesson.title}
                      </h3>
                    )}

                    {/* AI Title Suggestion Preview */}
                    {aiSuggestions[lesson.id]?.title && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mt-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-purple-300 font-medium mb-1">AI Suggested Title:</p>
                            <p className="text-sm text-white font-medium">{aiSuggestions[lesson.id].title}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => acceptSuggestion(lesson.id, 'title')}
                              className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => declineSuggestion(lesson.id, 'title')}
                              className="h-7 px-2 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 text-xs"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Lesson Description */}
                    {isEditing ? (
                      <div className="relative">
                        <Textarea
                          value={lesson.description}
                          onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                          placeholder="Lesson description..."
                          rows={2}
                          className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 pr-10"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => generateLessonDescription(lesson.id)}
                          disabled={generatingDescriptionForLesson === lesson.id || !lesson.title}
                          className="absolute right-1 top-1 h-7 w-7 p-0 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 disabled:opacity-50"
                          title="Generate AI description suggestion"
                        >
                          {generatingDescriptionForLesson === lesson.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <p className="text-slate-300">
                        {lesson.description}
                      </p>
                    )}

                    {/* AI Description Suggestion Preview */}
                    {aiSuggestions[lesson.id]?.description && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mt-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-purple-300 font-medium mb-1">AI Suggested Description:</p>
                            <p className="text-sm text-slate-200">{aiSuggestions[lesson.id].description}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => acceptSuggestion(lesson.id, 'description')}
                              className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => declineSuggestion(lesson.id, 'description')}
                              className="h-7 px-2 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 text-xs"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Learning Objectives */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-slate-200">
                          Learning Objectives ({lesson.objectives.length})
                        </h4>
                        {lesson.title && lesson.description && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateLearningObjectives(lesson.id)}
                            disabled={generatingObjectivesForLesson === lesson.id}
                            className="text-xs border-purple-500/50 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 disabled:opacity-50"
                          >
                            {generatingObjectivesForLesson === lesson.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3 mr-1" />
                                Generate Learning Objectives
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      <div className="space-y-1">
                        {lesson.objectives.map((objective, objIndex) => (
                          <div key={objIndex} className="flex items-center gap-2">
                            {editingObjectiveIndex === objIndex && editingLessonId === lesson.id ? (
                              <>
                                <Input
                                  value={objective}
                                  onChange={(e) => updateObjective(lesson.id, objIndex, e.target.value)}
                                  className="text-sm bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setEditingObjectiveIndex(null);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingObjectiveIndex(null)}
                                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Badge 
                                  variant="secondary" 
                                  className="cursor-pointer hover:bg-slate-600/50 flex-1 justify-start text-left bg-slate-700/50 text-slate-200 border-slate-600/50"
                                  onClick={() => {
                                    setEditingLessonId(lesson.id);
                                    setEditingObjectiveIndex(objIndex);
                                  }}
                                >
                                  • {objective}
                                </Badge>
                                {isEditing && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeObjective(lesson.id, objIndex)}
                                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                        
                        {/* Add New Objective */}
                        {isEditing && (
                          <div className="flex items-center gap-2">
                            <Input
                              value={newObjective}
                              onChange={(e) => setNewObjective(e.target.value)}
                              placeholder="Add learning objective..."
                              className="text-sm bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addObjective(lesson.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => addObjective(lesson.id)}
                              disabled={!newObjective.trim()}
                              className="text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Learning Objectives Suggestion Preview */}
                    {aiSuggestions[lesson.id]?.objectives && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mt-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-purple-300 font-medium mb-2">AI Suggested Learning Objectives:</p>
                            <div className="space-y-1">
                              {aiSuggestions[lesson.id]?.objectives?.map((objective: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                  <span className="text-sm text-slate-200">{objective}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => acceptSuggestion(lesson.id, 'objectives')}
                              className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => declineSuggestion(lesson.id, 'objectives')}
                              className="h-7 px-2 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 text-xs"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Lesson Controls */}
                  <div className="flex flex-col items-center gap-2">
                    {/* Edit Toggle */}
                    <Button
                      size="sm"
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setEditingLessonId(isEditing ? null : lesson.id)}
                      className={isEditing ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600/50 text-slate-400 hover:text-white hover:bg-slate-700/50"}
                    >
                      {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    </Button>

                    {/* Move Controls */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveLesson(lessonIndex, lessonIndex - 1)}
                        disabled={lessonIndex === 0}
                        className="text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveLesson(lessonIndex, lessonIndex + 1)}
                        disabled={lessonIndex === (lessons || []).length - 1}
                        className="text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Microlessons Section */}
              {lessonMicrolessons.length > 0 && (
                <div className="p-6">
                  <h4 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Microlessons ({lessonMicrolessons.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessonMicrolessons.map((microlesson) => (
                      <Card key={microlesson.id} className="relative bg-slate-700/50 border-slate-600/50">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium text-slate-200">
                              {microlesson.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs border ${getMicrolessonTypeColor(microlesson.type)}`}>
                                {getMicrolessonIcon(microlesson.type)}
                                <span className="ml-1">{microlesson.type}</span>
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-slate-300 mb-2">
                            {microlesson.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{microlesson.duration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
        
        {/* Add New Lesson Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={addNewLesson}
            size="lg"
            variant="outline"
            className="border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 border-dashed py-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Lesson
          </Button>
        </motion.div>
      </div>

      {/* Completion Block - Ready to Generate Course */}
      {!isGenerating && (lessons || []).length > 0 && onGenerateCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-7 h-7 text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-200">
                Ready to Generate Your Course!
              </h3>
            </div>
            
            <p className="text-blue-300 max-w-2xl mx-auto">
              Your lesson outline is ready! You can edit titles, descriptions, and objectives above, then proceed to generate your full course outline.
            </p>
            
            <div className="pt-4">
              <Button
                onClick={onGenerateCourse}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Generate Full Course Outline
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 