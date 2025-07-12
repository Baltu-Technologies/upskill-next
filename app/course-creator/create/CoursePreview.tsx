'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  BookOpen, 
  Target, 
  Clock, 
  Award,
  Building2,
  Users,
  CheckCircle,
  Save,
  Send
} from 'lucide-react';
import { Course } from '@/types/microlesson/slide';

interface CoursePreviewProps {
  courseData: Partial<Course>;
  onSave: (status: 'draft' | 'review' | 'published') => void;
}

export default function CoursePreview({ courseData, onSave }: CoursePreviewProps) {
  const totalMicrolessons = courseData.lessons?.reduce(
    (total, lesson) => total + (lesson.microlessons?.length || 0), 
    0
  ) || 0;

  const totalObjectives = courseData.lessons?.reduce(
    (total, lesson) => total + lesson.objectives.length, 
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-400" />
            Course Preview
          </CardTitle>
          <CardDescription>
            Review your course before publishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{courseData.title || 'Untitled Course'}</h2>
            <p className="text-slate-300 mb-4">{courseData.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {courseData.industry && (
                <Badge className="bg-blue-600/20 text-blue-400">
                  <Building2 className="w-3 h-3 mr-1" />
                  {courseData.industry}
                </Badge>
              )}
              {courseData.skillLevel && (
                <Badge className="bg-purple-600/20 text-purple-400">
                  <Award className="w-3 h-3 mr-1" />
                  {courseData.skillLevel} Level
                </Badge>
              )}
              {courseData.duration && (
                <Badge className="bg-orange-600/20 text-orange-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {courseData.duration}
                </Badge>
              )}
            </div>

            {courseData.tags && courseData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {courseData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-slate-600 text-slate-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="border-slate-700 bg-gradient-to-r from-slate-800/50 to-green-900/20">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white">{courseData.lessons?.length || 0}</div>
              <div className="text-sm text-slate-400">Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{totalMicrolessons}</div>
              <div className="text-sm text-slate-400">Microlessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{totalObjectives}</div>
              <div className="text-sm text-slate-400">Learning Objectives</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{courseData.prerequisites?.length || 0}</div>
              <div className="text-sm text-slate-400">Prerequisites</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      {courseData.learningOutcomes && courseData.learningOutcomes.length > 0 && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courseData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{outcome}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites */}
      {courseData.prerequisites && courseData.prerequisites.length > 0 && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {courseData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                  <span className="text-slate-300 text-sm">{prerequisite}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lessons Overview */}
      {courseData.lessons && courseData.lessons.length > 0 && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Course Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseData.lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{lesson.title}</h4>
                      {lesson.description && (
                        <p className="text-slate-400 text-sm mb-2">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{lesson.microlessons?.length || 0} microlessons</span>
                        <span>{lesson.objectives.length} objectives</span>
                        {lesson.duration && <span>{lesson.duration}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-white">Ready to Publish?</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Review your course one more time, then choose how you&apos;d like to proceed.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => onSave('draft')}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              
              <Button
                onClick={() => onSave('review')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Review
              </Button>
              
              <Button
                onClick={() => onSave('published')}
                className="bg-green-600 hover:bg-green-700"
                disabled // Enable this when user has proper permissions
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish Now
              </Button>
            </div>
            
            <p className="text-xs text-slate-500">
              Draft courses can be edited anytime. Published courses require approval for changes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 