'use client';

import React from 'react';
import { TitleWithSubtext as TitleWithSubtextType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import { SlideContainer } from '../SlideContainer';

interface TitleWithSubtextProps {
  slide: TitleWithSubtextType;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const TitleWithSubtext: React.FC<TitleWithSubtextProps> = ({ slide, onNext }) => {
  return (
    <SlideContainer
      backgroundColor="#0F172A"
      maxWidth="xl"
      padding="md"
      className="relative"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${slide.accentColor || '#3B82F6'} 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="relative z-10 text-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-bold text-white mb-8"
          style={{ 
            color: slide.accentColor ? `${slide.accentColor}` : undefined 
          }}
        >
          {slide.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 max-w-4xl mx-auto"
        >
          {slide.subtext}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div 
            className="w-24 h-1 mx-auto mb-8 rounded-full"
            style={{ 
              backgroundColor: slide.accentColor || '#3B82F6' 
            }}
          />
          
          {onNext && (
            <button
              onClick={onNext}
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ 
                borderColor: `${slide.accentColor || '#3B82F6'}40` 
              }}
            >
              <span className="flex items-center space-x-2">
                <span>Continue</span>
                <svg 
                  className="w-4 h-4 transition-transform group-hover:translate-x-1" 
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
      
      {/* Accent elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full opacity-20"
        style={{ backgroundColor: slide.accentColor || '#3B82F6' }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/3 left-1/5 w-1 h-1 rounded-full opacity-30"
        style={{ backgroundColor: slide.accentColor || '#3B82F6' }}
      />
    </SlideContainer>
  );
}; 