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
      title: 'Enhanced Block Editor Demo',
      backgroundColor: '#1f2937' // Dark Gray - matches COLOR_OPTIONS
    },
    {
      id: 'slide-2',
      type: 'TitleWithSubtext',
      title: 'Smart Text Editing',
      subtext: 'Click to edit - Press Enter for new blocks - Type / for commands',
      backgroundColor: '#3b82f6' // Blue - matches COLOR_OPTIONS
    },
    {
      id: 'slide-3',
      type: 'TitleWithImage',
      title: 'Intuitive Block Management',
      imageUrl: '/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg',
      imageLayout: 'right',
      backgroundColor: '#8b5cf6' // Purple - matches COLOR_OPTIONS
    },
    {
      id: 'slide-4',
      type: 'QuickCheckSlide',
      question: 'What happens when you press Enter in a text block?',
      correctAnswer: 'Creates a new block below with placeholder text',
      backgroundColor: '#10b981' // Green - matches COLOR_OPTIONS
    },
    {
      id: 'slide-5',
      type: 'MarkdownSlide',
      title: 'Enhanced Features',
      content: `Try these features in any text area:

## Smart Placeholders
- Click anywhere on placeholder text
- Cursor automatically goes to beginning
- Start typing to replace

## Enter Key Behavior
- Press **Enter** to create new blocks
- New blocks show "Type / to add blocks..."
- Text wrapping stays within blocks

## Drag & Drop
- Hover to see drag handles
- Drag blocks to reorder content
- Visual indicators show drop positions`,
      backgroundColor: '#ef4444' // Red - matches COLOR_OPTIONS
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
          title: '',
          backgroundColor: '#0F172A'
        };
        break;
      case 'TitleWithSubtext':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleWithSubtext',
          title: '',
          subtext: '',
          backgroundColor: '#0F172A'
        };
        break;
      case 'MarkdownSlide':
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'MarkdownSlide',
          title: '',
          content: '',
          backgroundColor: '#0F172A'
        };
        break;
      default:
        newSlide = {
          id: `slide-${Date.now()}`,
          type: 'TitleSlide',
          title: '',
          backgroundColor: '#0F172A'
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
              <h1 className="text-lg font-semibold text-white">Enhanced Vertical Slide Editor</h1>
              <p className="text-sm text-slate-400">Demo - Smart Block Editing with Enter key, Placeholders & Drag/Drop</p>
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