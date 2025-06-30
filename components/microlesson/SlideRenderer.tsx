'use client';

import React from 'react';
import { SlideType, SlideRendererProps } from '@/types/microlesson/slide';
import { TitleSlide } from './slides/TitleSlide';
import { TitleWithSubtext } from './slides/TitleWithSubtext';
import { TitleWithImage } from './slides/TitleWithImage';
import { VideoSlide } from './slides/VideoSlide';
import { QuickCheckSlide } from './slides/QuickCheckSlide';
import { MarkdownSlide } from './slides/MarkdownSlide';
import { CustomHTMLSlide } from './slides/CustomHTMLSlide';
import { HotspotActivitySlide } from './slides/HotspotActivitySlide';
import dynamic from 'next/dynamic';

// Dynamically import 3D components to avoid SSR issues
const AR3DModelSlide = dynamic(
  () => import('./slides/AR3DModelSlide').then((mod) => ({ default: mod.AR3DModelSlide })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  isActive, 
  onNext, 
  onPrevious,
  onQuickCheckAnswered
}) => {
  if (!isActive) return null;

  const commonProps = {
    slide,
    onNext,
    onPrevious,
  };

  switch (slide.type) {
    case 'TitleSlide':
      return <TitleSlide {...commonProps} slide={slide} />;
    
    case 'TitleWithSubtext':
      return <TitleWithSubtext {...commonProps} slide={slide} />;
    
    case 'TitleWithImage':
      return <TitleWithImage {...commonProps} slide={slide} />;
    
    case 'VideoSlide':
      return <VideoSlide {...commonProps} slide={slide} />;
    
    case 'AR3DModelSlide':
      return <AR3DModelSlide {...commonProps} slide={slide} />;
    
    case 'QuickCheckSlide':
      return (
        <QuickCheckSlide 
          {...commonProps} 
          slide={slide} 
          onQuickCheckAnswered={onQuickCheckAnswered}
        />
      );
    
    case 'CustomHTMLSlide':
      return <CustomHTMLSlide {...commonProps} slide={slide} />;
    
    case 'HotspotActivitySlide':
      return <HotspotActivitySlide {...commonProps} slide={slide} />;
    
    case 'MarkdownSlide':
      return <MarkdownSlide {...commonProps} slide={slide} />;
    
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Unknown Slide Type
            </h2>
            <p className="text-gray-400">
              Slide type '{(slide as any).type}' is not supported.
            </p>
          </div>
        </div>
      );
  }
}; 