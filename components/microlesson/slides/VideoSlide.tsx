'use client';

import React from 'react';
import { VideoSlide as VideoSlideType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import { SlideContainer } from '../SlideContainer';

interface VideoSlideProps {
  slide: VideoSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoSlide: React.FC<VideoSlideProps> = ({ slide, onNext }) => {
  return (
    <SlideContainer
      backgroundColor="#0F172A"
      maxWidth="lg"
      padding="md"
    >
      <div className="w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white mb-8 text-center"
        >
          {slide.title}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
        >
          <iframe
            src={slide.videoUrl}
            title={slide.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </motion.div>
        
        {onNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={onNext}
              className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
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
          </motion.div>
        )}
      </div>
    </SlideContainer>
  );
}; 