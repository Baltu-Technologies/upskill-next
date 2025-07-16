'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditableSlideRenderer from '@/components/microlesson/EditableSlideRenderer';
import { SlideType } from '@/types/microlesson/slide';

export default function SingleSlideEditorDemo() {
  const router = useRouter();
  
  // Single slide for focused testing
  const [slide, setSlide] = useState<SlideType>({
    id: 'test-slide-1',
    type: 'TitleWithSubtext',
    title: 'Click to edit - This is the main title',
    subtext: 'Click to edit - This is the subtext area',
    content: 'enter content here...',
    backgroundColor: '#0F172A'
  });

  const handleSlideChange = (updatedSlide: SlideType) => {
    setSlide(updatedSlide);
  };

  const resetSlide = () => {
    setSlide({
      id: 'test-slide-1',
      type: 'TitleWithSubtext',
      title: 'Click to edit - This is the main title',
      subtext: 'Click to edit - This is the subtext area', 
      content: 'enter content here...',
      backgroundColor: '#0F172A'
    });
  };

  const createEmptySlide = () => {
    setSlide({
      id: 'test-slide-2',
      type: 'TitleWithSubtext',
      title: '',
      subtext: '',
      content: '',
      backgroundColor: '#0F172A'
    });
  };

  const createNewTitleSlide = () => {
    setSlide({
      id: 'test-slide-3',
      type: 'TitleSlide',
      title: 'New Title Slide',
      backgroundColor: '#0F172A'
    });
  };

  const createSampleContent = () => {
    setSlide({
      id: 'test-slide-4',
      type: 'TitleWithSubtext',
      title: 'Sample Title Text',
      subtext: 'Sample subtext here',
      content: 'Sample content text',
      backgroundColor: '#0F172A'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/demo')}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Demos
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">Single Slide Editor</h1>
              <p className="text-sm text-slate-400">Focus on perfecting text editing behavior</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetSlide}
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Test Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={createEmptySlide}
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              Empty Slide
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={createNewTitleSlide}
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              "New Title Slide"
            </Button>
            <button 
              onClick={createSampleContent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Sample Content
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Slide Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Live Slide Editor</CardTitle>
                <p className="text-slate-400 text-sm">
                  Click on any text to edit. Test placeholder behavior and text selection.
                </p>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                  <EditableSlideRenderer
                    slide={slide}
                    onSlideChange={handleSlideChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testing Instructions */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Testing Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-medium">Title Blocks (Empty)</p>
                        <p className="text-slate-400 text-sm">Empty title blocks show "Untitled Card" as placeholder text.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-medium">Content Blocks (Empty)</p>
                        <p className="text-slate-400 text-sm">Empty content blocks show "Type / to add blocks or 📝 🖼️ 📊" with slash command support.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-medium">Slash Commands</p>
                        <p className="text-slate-400 text-sm">Type "/" in any block to open the slash command menu for adding different content types.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-medium">Delete to Test</p>
                        <p className="text-slate-400 text-sm">Click "Sample Content" then delete text to see placeholder behavior.</p>
                      </div>
                    </div>
                  </div>
              </CardContent>
            </Card>

            {/* Current Slide Data */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Current Slide Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 p-4 rounded-lg text-xs text-slate-300 overflow-x-auto">
                  {JSON.stringify(slide, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 