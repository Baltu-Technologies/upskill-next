'use client';

import React from 'react';
import { CustomHTMLSlide as CustomHTMLSlideType } from '@/types/microlesson/slide';
import { SlideContainer } from '../SlideContainer';

interface CustomHTMLSlideProps {
  slide: CustomHTMLSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const CustomHTMLSlide: React.FC<CustomHTMLSlideProps> = ({ slide }) => {
  return (
    <SlideContainer
      backgroundColor="#0F172A"
      maxWidth="lg"
      padding="md"
    >
      <div 
        className="w-full"
        dangerouslySetInnerHTML={{ __html: slide.rawHtml }}
      />
    </SlideContainer>
  );
}; 