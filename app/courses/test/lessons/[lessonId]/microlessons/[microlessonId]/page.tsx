'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SlidePlayer } from '@/components/microlesson/SlidePlayer';
import { sampleCourse } from '@/data/microlesson/sampleConfig';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MicrolessonPlayerPage() {
  const router = useRouter();
  const params = useParams();
  
  // Check if params exists and has required properties
  if (!params || !params.lessonId || !params.microlessonId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Invalid Parameters</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Required lesson and microlesson parameters are missing.</p>
          <Button onClick={() => router.push('/courses/test/lessons')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Card>
      </div>
    );
  }
  
  const lessonId = params.lessonId as string;
  const microlessonId = params.microlessonId as string;
  
  // Find the lesson and microlesson
  const lesson = sampleCourse.lessons.find(l => l.id === lessonId);
  const microlesson = lesson?.microlessons.find(ml => ml.id === microlessonId);
  
  if (!lesson || !microlesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">MicroLesson Not Found</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">The requested microlesson could not be found.</p>
          <Button onClick={() => router.push('/courses/test/lessons')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Card>
      </div>
    );
  }

  const handleComplete = () => {
    // Handle microlesson completion
    console.log('MicroLesson completed:', microlessonId);
    // Navigate back to lesson or next microlesson
    router.push(`/courses/test/lessons/${lessonId}`);
  };

  const handleExit = () => {
    // Navigate back to lesson detail page
    router.push(`/courses/test/lessons/${lessonId}`);
  };

  return (
    <SlidePlayer
      config={microlesson}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
} 