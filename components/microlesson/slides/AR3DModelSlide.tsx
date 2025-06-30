'use client';

import React, { Suspense } from 'react';
import { AR3DModelSlide as AR3DModelSlideType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import { SlideContainer } from '../SlideContainer';

interface AR3DModelSlideProps {
  slide: AR3DModelSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
}

// Placeholder 3D viewer component
const Model3DViewer: React.FC<{ slide: AR3DModelSlideType }> = ({ slide }) => {
  return (
    <div className="w-full h-96 bg-slate-800 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-white font-semibold mb-2">3D Model Viewer</h3>
        <p className="text-slate-400 text-sm">Model: {slide.modelUrl.split('/').pop()}</p>
        <p className="text-slate-400 text-sm">AR Enabled: {slide.arEnabled ? 'Yes' : 'No'}</p>
        <p className="text-slate-400 text-sm">Hotspots: {slide.hotspots.length}</p>
      </div>
    </div>
  );
};

export const AR3DModelSlide: React.FC<AR3DModelSlideProps> = ({ slide, onNext }) => {
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
          className="mb-8"
        >
          <Suspense fallback={
            <div className="w-full h-96 bg-slate-800 rounded-2xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          }>
            <Model3DViewer slide={slide} />
          </Suspense>
        </motion.div>

        {slide.hotspots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800 rounded-xl p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Interactive Hotspots</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {slide.hotspots.map((hotspot, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-medium">{hotspot.label}</h4>
                  <p className="text-slate-400 text-sm">
                    Position: [{hotspot.position.map(p => p.toFixed(1)).join(', ')}]
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {onNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center"
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