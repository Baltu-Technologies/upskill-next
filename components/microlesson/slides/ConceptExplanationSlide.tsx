'use client';

import React, { useState } from 'react';
import { ConceptExplanationSlide as ConceptExplanationSlideType } from '@/types/microlesson/slide';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideContainer } from '../SlideContainer';
import { Lightbulb, Book, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ConceptExplanationSlideProps {
  slide: ConceptExplanationSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const ConceptExplanationSlide: React.FC<ConceptExplanationSlideProps> = ({ 
  slide, 
  onNext, 
  onContextMenu, 
  style 
}) => {
  const [showMisconceptions, setShowMisconceptions] = useState(false);
  const [revealedTerms, setRevealedTerms] = useState<Set<number>>(new Set());

  const toggleTerm = (index: number) => {
    const newRevealed = new Set(revealedTerms);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedTerms(newRevealed);
  };

  return (
    <SlideContainer
      backgroundColor={slide.backgroundColor || "#0F172A"}
      maxWidth="xl"
      padding="lg"
      className="relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 45%, #3B82F6 47%, #3B82F6 53%, transparent 55%),
                           linear-gradient(-45deg, transparent 45%, #10B981 47%, #10B981 53%, transparent 55%)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative z-10 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h1 
              className="text-3xl md:text-4xl font-bold text-white"
              onContextMenu={onContextMenu}
              style={{ userSelect: 'text' as const, ...style }}
            >
              {slide.concept}
            </h1>
          </div>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Explanation Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Core Explanation */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-400" />
                Core Concept
              </h3>
              <div 
                className="text-slate-200 leading-relaxed text-lg"
                onContextMenu={onContextMenu}
                style={{ userSelect: 'text' as const }}
              >
                {slide.explanation}
              </div>
            </div>

            {/* Industry Example */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30">
              <h3 className="text-lg font-semibold text-white mb-4">
                Industry Application
              </h3>
              <div 
                className="text-emerald-100 leading-relaxed"
                onContextMenu={onContextMenu}
                style={{ userSelect: 'text' as const }}
              >
                {slide.industryExample}
              </div>
            </div>
          </motion.div>

          {/* Interactive Elements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Visual Aid */}
            {slide.visualAid && (
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Visual Reference
                </h3>
                <div className="bg-slate-600/20 rounded-lg p-4 border-2 border-dashed border-slate-500/40">
                  <p className="text-slate-300 text-center text-sm italic">
                    {slide.visualAid}
                  </p>
                </div>
              </div>
            )}

            {/* Key Terms (Interactive) */}
            {slide.keyTerms && slide.keyTerms.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Key Terms (Click to Learn)
                </h3>
                <div className="space-y-2">
                  {slide.keyTerms.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => toggleTerm(index)}
                      className="w-full text-left p-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-300 font-medium">{term}</span>
                        {revealedTerms.has(index) ? (
                          <EyeOff className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-indigo-400" />
                        )}
                      </div>
                      <AnimatePresence>
                        {revealedTerms.has(index) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-sm text-slate-300"
                          >
                            Industry definition and usage context would appear here.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Common Misconceptions (Toggleable) */}
        {slide.commonMisconceptions && slide.commonMisconceptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <button
              onClick={() => setShowMisconceptions(!showMisconceptions)}
              className="w-full bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/30 hover:border-red-400/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold">Common Misconceptions</span>
                  <span className="text-red-300 text-sm">
                    ({slide.commonMisconceptions.length} to avoid)
                  </span>
                </div>
                <div className="text-red-300">
                  {showMisconceptions ? '▼' : '▶'}
                </div>
              </div>
            </button>
            
            <AnimatePresence>
              {showMisconceptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  {slide.commonMisconceptions.map((misconception, index) => (
                    <div 
                      key={index}
                      className="bg-red-900/10 border border-red-500/20 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-400 text-sm font-bold">✗</span>
                        </div>
                        <p className="text-red-100 leading-relaxed">{misconception}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Learning Objective Badge */}
        {slide.learningObjective && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2">
              <span className="text-blue-200 text-sm">
                <strong>Learning Objective:</strong> {slide.learningObjective}
              </span>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
          className="text-center"
        >
          {onNext && (
            <button
              onClick={onNext}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <span className="flex items-center space-x-2">
                <span>I Understand This Concept</span>
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
    </SlideContainer>
  );
};