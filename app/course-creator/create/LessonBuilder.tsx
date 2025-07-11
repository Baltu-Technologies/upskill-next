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
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

interface LessonBuilderProps {
  lessons?: SimpleLesson[];
  microlessons?: SimpleMicrolesson[];
  onLessonsUpdate: (lessons: SimpleLesson[]) => void;
  isGenerating?: boolean;
  generationStatus?: string;
  onGenerateCourse?: () => void;
}

export default function LessonBuilder({ 
  lessons, 
  microlessons, 
  onLessonsUpdate, 
  isGenerating = false,
  generationStatus,
  onGenerateCourse
}: LessonBuilderProps) {
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<number | null>(null);
  const [newObjective, setNewObjective] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Lesson Outline</h2>
          <p className="text-slate-400">
            Generate and organize your course lessons with detailed objectives
          </p>
        </div>
        <div className="text-sm text-slate-400">
          {(lessons || []).length} lesson{(lessons || []).length !== 1 ? 's' : ''} • {(microlessons || []).length} microlesson{(microlessons || []).length !== 1 ? 's' : ''}
        </div>
      </div>

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          
          <p className="text-sm text-green-300 text-center mb-4">
            Your lesson outline is ready! You can edit titles, descriptions, and objectives below, then proceed to generate your full course outline.
          </p>
          
          {/* Generate Course Button */}
          {onGenerateCourse && (
            <div className="text-center">
              <Button
                onClick={onGenerateCourse}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Course Outline
              </Button>
            </div>
          )}
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
                      <Input
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                        className="text-lg font-semibold bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                        placeholder="Lesson title..."
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLessonId(null)}
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-white">
                        {lesson.title}
                      </h3>
                    )}

                    {/* Lesson Description */}
                    {isEditing ? (
                      <Textarea
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                        placeholder="Lesson description..."
                        rows={2}
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                      />
                    ) : (
                      <p className="text-slate-300">
                        {lesson.description}
                      </p>
                    )}

                    {/* Learning Objectives */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-slate-200">
                        Learning Objectives ({lesson.objectives.length})
                      </h4>
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
      </div>
    </div>
  );
} 