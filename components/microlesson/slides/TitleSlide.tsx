'use client';

import React from 'react';
import { TitleSlide as TitleSlideType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import { SlideContainer } from '../SlideContainer';
import EnhancedInlineTextEditor from '../EnhancedInlineTextEditor';

interface TitleSlideProps {
  slide: TitleSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
  onSlideChange?: (updatedSlide: TitleSlideType) => void;
  isEditing?: boolean;
  isGenerating?: boolean;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({ 
  slide, 
  onNext, 
  onSlideChange, 
  isEditing = false,
  isGenerating = false 
}) => {
  
  const handleTextChange = (field: string, content: string) => {
    if (onSlideChange) {
      const updatedSlide = { ...slide, [field]: content };
      onSlideChange(updatedSlide);
    }
  };

  const renderEditableText = (field: string, value: string, className: string = '', placeholder: string = 'Click to edit...') => {
    if (isEditing) {
      return (
        <EnhancedInlineTextEditor
          content={value || ''}
          onUpdate={(content: string) => handleTextChange(field, content)}
          className={className}
          placeholder={placeholder}
          blockType="title"
        />
      );
    }
    
    // Show typing indicator when generating
    if (isGenerating && !value) {
      return (
        <span className={`${className} relative`}>
          <span className="opacity-50">{placeholder}</span>
          <span className="animate-pulse ml-1 text-blue-400">|</span>
        </span>
      );
    }
    
    // In preview mode, render HTML content properly
    const content = value || (isGenerating ? '' : placeholder);
    if (!isEditing && content && content.includes('<')) {
      // Content appears to contain HTML tags, render as HTML
      return (
        <span 
          className={className}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    
    // Fallback to plain text rendering
    return <span className={className}>{content}</span>;
  };
  return (
    <SlideContainer
      backgroundColor={slide.backgroundColor || '#0F172A'}
      backgroundImage={slide.backgroundImage}
      maxWidth="lg"
      padding="md"
    >
      {/* Content */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-8"
        >
          {renderEditableText('title', slide.title, 'text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent', 'Enter slide title...')}
        </motion.h1>
        
        {(slide.subtitle || isEditing) && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-2xl md:text-3xl text-blue-200 mb-8"
          >
            {renderEditableText('subtitle', slide.subtitle || '', 'text-2xl md:text-3xl text-blue-200', 'Enter subtitle...')}
          </motion.h2>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-12"
        >
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto mb-8" />
          
          {onNext && (
            <button
              onClick={onNext}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center space-x-2">
                <span>Get Started</span>
                <svg 
                  className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          )}
        </motion.div>
      </div>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 70, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"
        />
      </div>
    </SlideContainer>
  );
}; 