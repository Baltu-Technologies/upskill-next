'use client';

import React from 'react';
import { MarkdownSlide as MarkdownSlideType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { SlideContainer } from '../SlideContainer';

interface MarkdownSlideProps {
  slide: MarkdownSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const MarkdownSlide: React.FC<MarkdownSlideProps> = ({ slide, onNext, onContextMenu, style }) => {
  const textAlignClass = slide.textAlign === 'center' ? 'text-center' : 
                        slide.textAlign === 'right' ? 'text-right' : 'text-left';
  
  // Properly handle all maxWidth values
  const maxWidth = slide.maxWidth === '2xl' ? '2xl' : 
                   slide.maxWidth === 'xl' ? 'xl' :
                   slide.maxWidth === 'lg' ? 'lg' :
                   slide.maxWidth === 'sm' ? 'sm' :
                   slide.maxWidth === '4xl' ? '4xl' :
                   'md';

  return (
    <SlideContainer
      backgroundColor={slide.backgroundColor || '#1E293B'}
      maxWidth={maxWidth as any}
      padding="lg"
      centerContent={false}
      className="relative"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
      </div>
      
      <div className="relative z-10 w-full">
        {slide.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
          >
            {slide.title}
          </motion.h1>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`prose prose-lg prose-invert max-w-none ${textAlignClass}`}
          onContextMenu={onContextMenu}
          style={{
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-body': '#e2e8f0',
            '--tw-prose-bullets': '#64748b',
            '--tw-prose-counters': '#64748b',
            '--tw-prose-hr': '#475569',
            '--tw-prose-quotes': '#cbd5e1',
            '--tw-prose-quote-borders': '#3b82f6',
            '--tw-prose-captions': '#94a3b8',
            '--tw-prose-code': '#fbbf24',
            '--tw-prose-pre-code': '#e2e8f0',
            '--tw-prose-pre-bg': '#1e293b',
            '--tw-prose-th-borders': '#475569',
            '--tw-prose-td-borders': '#374151',
            '--tw-prose-links': '#60a5fa',
            ...style
          } as React.CSSProperties}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-blue-400 mb-6 border-b border-blue-500/30 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-blue-300 mb-4 mt-8">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-medium text-blue-200 mb-3 mt-6">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-300 leading-relaxed">
                  {children}
                </li>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <code className={`${className} block bg-slate-800 rounded-lg p-4 text-sm overflow-x-auto`}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="bg-slate-800 text-yellow-400 px-2 py-1 rounded text-sm">
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-6">
                  {children}
                </blockquote>
              ),
            }}
          >
            {slide.content}
          </ReactMarkdown>
        </motion.div>
        
        {onNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-12"
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