'use client';

import React from 'react';
import { ContextSetterSlide as ContextSetterSlideType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import { SlideContainer } from '../SlideContainer';
import { AlertTriangle, Target, Zap } from 'lucide-react';

interface ContextSetterSlideProps {
  slide: ContextSetterSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const ContextSetterSlide: React.FC<ContextSetterSlideProps> = ({ 
  slide, 
  onNext, 
  onContextMenu, 
  style 
}) => {
  return (
    <SlideContainer
      backgroundColor={slide.backgroundColor || "#0F172A"}
      maxWidth="xl"
      padding="lg"
      className="relative"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #3B82F6 2px, transparent 2px),
                           radial-gradient(circle at 80% 20%, #10B981 2px, transparent 2px)`,
          backgroundSize: '60px 60px, 40px 40px'
        }} />
      </div>
      
      <div className="relative z-10 w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white"
              onContextMenu={onContextMenu}
              style={{ userSelect: 'text' as const, ...style }}
            >
              {slide.title}
            </h1>
          </div>
          
          {slide.motivationalHook && (
            <p className="text-xl text-blue-300 font-medium italic">
              "{slide.motivationalHook}"
            </p>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Workplace Scenario */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Real Workplace Scenario</h3>
            </div>
            
            <div 
              className="text-slate-200 leading-relaxed"
              onContextMenu={onContextMenu}
              style={{ userSelect: 'text' as const }}
            >
              {slide.workplaceScenario}
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm font-medium">
                <span className="text-blue-400 font-semibold">Industry Context:</span> {slide.industryRelevance}
              </p>
            </div>
          </motion.div>

          {/* Consequences/Why It Matters */}
          {slide.consequences && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Why This Matters</h3>
              </div>
              
              <div 
                className="text-slate-200 leading-relaxed"
                onContextMenu={onContextMenu}
                style={{ userSelect: 'text' as const }}
              >
                {slide.consequences}
              </div>
            </motion.div>
          )}
        </div>

        {/* Workplace Relevance Badge */}
        {slide.workplaceRelevance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-purple-200 text-sm font-medium">
                Application: {slide.workplaceRelevance}
              </span>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="text-center"
        >
          {onNext && (
            <button
              onClick={onNext}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <span>Let's Get Started</span>
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
      
      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/6 w-3 h-3 rounded-full bg-blue-400/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-1/5 w-2 h-2 rounded-full bg-purple-400/20"
      />
    </SlideContainer>
  );
};