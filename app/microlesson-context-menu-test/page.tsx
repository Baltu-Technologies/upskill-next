'use client';

import React, { useState } from 'react';
import { SlidePlayer } from '@/components/microlesson/SlidePlayer';
import { MarkdownSlide, LessonConfig } from '@/types/microlesson/slide';

export default function ContextMenuTestPage() {
  const testSlide: MarkdownSlide = {
    id: 'context-menu-demo',
    type: 'MarkdownSlide',
    title: 'Context Menu Testing',
    duration: 120,
    backgroundColor: '#1E293B',
    content: `
# Context Menu Feature Testing

This slide demonstrates the **context menu functionality** for microlessons.

## Features to Test:

1. **Right-click anywhere** to open the context menu
2. **Define Word** - Try right-clicking on "photolithography" or "semiconductor"
3. **Save to Study List** - Add important terms to your study hub
4. **Add to Notes** - Take notes on specific content
5. **Ask AI** - Get help understanding concepts

## Test Words:
- **Photolithography**: The process of transferring patterns onto semiconductor wafers
- **Clean Room**: A controlled environment with minimal contaminants
- **Wafer**: A thin slice of semiconductor material used as substrate
- **Fabrication**: The manufacturing process of electronic devices

Try highlighting any text and right-clicking to see the context menu in action!

## Navigation Testing:
Notice the breadcrumb in the header showing: **Advanced Manufacturing > Context Menu Features > Context Menu Test Microlesson**

Also check out the new **Study icon** next to the Messages icon in the top right!
    `,
    maxWidth: 'lg'
  };

  const testConfig: LessonConfig = {
    id: 'context-menu-test',
    title: 'Context Menu Test Microlesson',
    description: 'Testing the context menu functionality',
    course: 'Advanced Manufacturing',
    lesson: 'Context Menu Features',
    slides: [
      testSlide
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Context Menu Test Page
          </h1>
          <p className="text-slate-300">
            Testing the new context menu, study icon, and breadcrumb features
          </p>
        </div>
        
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
          <SlidePlayer 
            config={testConfig}
            onComplete={() => console.log('Test completed')}
            onExit={() => window.history.back()}
          />
        </div>
      </div>
    </div>
  );
} 