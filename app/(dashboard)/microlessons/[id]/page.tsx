'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlidePlayer } from '@/components/microlesson/SlidePlayer';
import { sampleConfig, roboticsConfig } from '@/data/microlesson/sampleConfig';
import { LessonConfig } from '@/types/microlesson/slide';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Clock, BookOpen, Award } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

// Mock lesson library - in a real app this would come from an API/database
const lessonLibrary: { [key: string]: LessonConfig } = {
  'semiconductor-manufacturing': sampleConfig,
  'industrial-robotics': roboticsConfig,
};

export default function MicrolessonPage({ params }: PageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lesson, setLesson] = useState<LessonConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load lesson data
    const lessonData = lessonLibrary[params.id];
    if (lessonData) {
      setLesson(lessonData);
    }
    setLoading(false);
  }, [params.id]);

  const handleStartLesson = () => {
    setIsPlaying(true);
  };

  const handleExitLesson = () => {
    setIsPlaying(false);
  };

  const handleCompleteLesson = () => {
    // Handle lesson completion - could save progress, award points, etc.
    console.log('Lesson completed!');
    setIsPlaying(false);
    // Could redirect to a completion page or show completion modal
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-red-400">Lesson Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              The requested lesson could not be found.
            </p>
            <Button onClick={handleBackToDashboard} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If lesson is playing, show full-screen player
  if (isPlaying) {
    return (
      <SlidePlayer
        config={lesson}
        onComplete={handleCompleteLesson}
        onExit={handleExitLesson}
      />
    );
  }

  // Show lesson preview/start page
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={handleBackToDashboard}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Lesson Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">
                      {lesson.title}
                    </CardTitle>
                    {lesson.course && (
                      <p className="text-blue-400 font-medium">{lesson.course}</p>
                    )}
                    {lesson.lesson && (
                      <p className="text-slate-400">{lesson.lesson}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleStartLesson}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Lesson
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="bg-slate-700 rounded-lg p-3 mb-2">
                      <BookOpen className="w-6 h-6 text-blue-400 mx-auto" />
                    </div>
                    <div className="text-white font-semibold">{lesson.slides.length}</div>
                    <div className="text-slate-400 text-sm">Slides</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-700 rounded-lg p-3 mb-2">
                      <Clock className="w-6 h-6 text-green-400 mx-auto" />
                    </div>
                    <div className="text-white font-semibold">
                      {Math.ceil(lesson.slides.length * 1.5)} min
                    </div>
                    <div className="text-slate-400 text-sm">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-700 rounded-lg p-3 mb-2">
                      <Award className="w-6 h-6 text-yellow-400 mx-auto" />
                    </div>
                    <div className="text-white font-semibold">250</div>
                    <div className="text-slate-400 text-sm">XP Reward</div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-white text-lg font-semibold mb-3">What You'll Learn</h3>
                  <ul className="text-slate-300 space-y-1">
                    {lesson.slides
                      .filter(slide => slide.type === 'TitleWithSubtext' || slide.type === 'MarkdownSlide')
                      .slice(0, 4)
                      .map((slide, index) => (
                        <li key={index}>
                          {'title' in slide ? slide.title : 'Interactive content and activities'}
                        </li>
                      ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Preview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Lesson Outline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lesson.slides.map((slide, index) => (
                    <div key={slide.id} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {'title' in slide ? slide.title : `${slide.type.replace(/([A-Z])/g, ' $1').trim()}`}
                        </div>
                        <div className="text-slate-400 text-sm capitalize">
                          {slide.type.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                      <div className="text-slate-500 text-sm">
                        {slide.type === 'QuickCheckSlide' && '📝'}
                        {slide.type === 'VideoSlide' && '🎥'}
                        {slide.type === 'AR3DModelSlide' && '🧊'}
                        {slide.type === 'HotspotActivitySlide' && '🎯'}
                        {slide.type === 'MarkdownSlide' && '📚'}
                        {(slide.type === 'TitleSlide' || slide.type === 'TitleWithSubtext' || slide.type === 'TitleWithImage') && '📖'}
                        {slide.type === 'CustomHTMLSlide' && '🎉'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prerequisites */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Basic technical knowledge
                  </div>
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Computer literacy
                  </div>
                  <div className="flex items-center text-slate-400">
                    <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                    No prior experience required
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Path */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-slate-300 text-sm">
                    This lesson is part of the Advanced Manufacturing track.
                  </div>
                  <div className="space-y-2">
                    <div className="text-green-400 text-sm">✓ Introduction to Manufacturing</div>
                    <div className="text-blue-400 text-sm font-semibold">→ {lesson.title}</div>
                    <div className="text-slate-500 text-sm">○ Advanced Fabrication Techniques</div>
                    <div className="text-slate-500 text-sm">○ Quality Control & Testing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 