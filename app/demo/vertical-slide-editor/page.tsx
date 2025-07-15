"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import VerticalSlideEditor from '@/components/microlesson/VerticalSlideEditor';
import { SlideType } from '@/types/microlesson/slide';

export default function VerticalSlideEditorDemo() {
  const router = useRouter();
  
  // Sample slides for demonstration
  const [slides, setSlides] = useState<SlideType[]>([
    {
      id: 'slide-1',
      type: 'TitleSlide',
      title: 'Welcome to Data Center Security',
      backgroundColor: '#1e293b'
    },
    {
      id: 'slide-2',
      type: 'TitleWithSubtext',
      title: 'Physical Security Fundamentals',
      subtext: 'Understanding perimeter defense systems',
      backgroundColor: '#1e293b'
    },
    {
      id: 'slide-3',
      type: 'TitleWithImage',
      title: 'Access Control Systems',
      imageUrl: '/media/semiconductor/cleanroom.jpg',
      imagePosition: 'right',
      backgroundColor: '#1e293b'
    },
    {
      id: 'slide-4',
      type: 'QuickCheckSlide',
      question: 'What is the primary purpose of a perimeter fence?',
      correctAnswer: 'To create a physical barrier and deter unauthorized access',
      backgroundColor: '#1e293b'
    },
    {
      id: 'slide-5',
      type: 'MarkdownSlide',
      title: 'Security Layers',
      content: `# Multi-Layer Security Approach

## Physical Barriers
- **Perimeter Fencing**: First line of defense
- **Access Gates**: Controlled entry points
- **Vehicle Barriers**: Prevent unauthorized vehicle access

## Detection Systems
- **Motion Sensors**: Monitor movement in restricted areas
- **Cameras**: Visual surveillance and recording
- **Alarms**: Immediate alert systems

## Access Control
- **Badge Systems**: Electronic identification
- **Biometric Scanners**: Fingerprint and facial recognition
- **Security Personnel**: Human oversight and response`,
      backgroundColor: '#1e293b'
    }
  ]);

  const handleSlideChange = (index: number, updatedSlide: SlideType) => {
    const newSlides = [...slides];
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
  };

  const handleAddSlide = (type: string, afterIndex?: number) => {
    let newSlide: SlideType;
    
    // Create slide based on type
    switch (type) {
      case 'TitleSlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleSlide',
          title: 'New Title Slide',
          backgroundColor: '#1e293b'
        };
        break;
      case 'TitleWithSubtext':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleWithSubtext',
          title: 'New Title with Subtext',
          subtext: 'Add your subtext here',
          backgroundColor: '#1e293b'
        };
        break;
      case 'MarkdownSlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'MarkdownSlide',
          title: 'New Markdown Slide',
          content: '# New Content\n\nAdd your content here...',
          backgroundColor: '#1e293b'
        };
        break;
      default:
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleSlide',
          title: 'New Slide',
          backgroundColor: '#1e293b'
        };
    }
    
    const newSlides = [...slides];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : newSlides.length;
    newSlides.splice(insertIndex, 0, newSlide);
    setSlides(newSlides);
  };

  const handleDeleteSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
  };

  const handleDuplicateSlide = (index: number) => {
    const slideToClone = slides[index];
    const newSlide: SlideType = {
      ...slideToClone,
      id: `slide-${Date.now()}`,
    };
    
    // Handle title property for slides that have it
    if ('title' in slideToClone && slideToClone.title && 'title' in newSlide) {
      (newSlide as typeof slideToClone).title = `${slideToClone.title} (Copy)`;
    }
    
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
  };

  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);
    setSlides(newSlides);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-lg font-semibold text-white">Vertical Slide Editor</h1>
              <p className="text-sm text-slate-400">Demo - Data Center Security Course</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
              <Button
                variant="default"
                size="sm"
                className="h-8 px-3"
              >
                <Layers className="w-4 h-4 mr-1" />
                Vertical View
              </Button>
            </div>
            
            <div className="text-sm text-slate-400">
              {slides.length} slides
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Slide Editor */}
      <div className="pt-20">
        <VerticalSlideEditor
          slides={slides}
          onSlideChange={handleSlideChange}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onMoveSlide={handleMoveSlide}
        />
      </div>
    </div>
  );
} 