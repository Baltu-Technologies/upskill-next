'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SlideContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  backgroundImage?: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
  centerContent?: boolean;
}

export const SlideContainer: React.FC<SlideContainerProps> = ({
  children,
  backgroundColor = '#0F172A',
  backgroundImage,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
  centerContent = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl',
    '4xl': 'max-w-8xl', // Same as 2xl since Tailwind doesn't have max-w-10xl
    full: 'max-w-full'
  };

  const paddingClasses = {
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8 lg:p-12',
    lg: 'p-8 sm:p-12 lg:p-16'
  };

  return (
    <div 
      className={`
        h-full w-full relative
        ${centerContent ? 'flex items-center justify-center overflow-hidden' : 'overflow-y-auto'}
        ${className}
      `}
      style={{ 
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability when background image is used */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50 z-0" />
      )}
      
      {/* Content Container */}
      <div className={`
        relative z-10 w-full
        ${maxWidthClasses[maxWidth]} 
        ${paddingClasses[padding]}
        mx-auto
        ${centerContent ? '' : 'min-h-full'}
      `}>
        {children}
      </div>
    </div>
  );
}; 