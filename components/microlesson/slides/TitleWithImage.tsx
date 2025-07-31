'use client';

import React from 'react';
import { TitleWithImage as TitleWithImageType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SlideContainer } from '../SlideContainer';

interface TitleWithImageProps {
  slide: TitleWithImageType;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const TitleWithImage: React.FC<TitleWithImageProps> = ({ slide, onNext }) => {
  const isImageLeft = slide.imagePosition === 'left';

  return (
    <SlideContainer
      backgroundColor="#0F172A"
      maxWidth="xl"
      padding="md"
    >
      <div className="w-full">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${isImageLeft ? '' : 'md:grid-flow-col-dense'}`}>
          {/* Text Content */}
          <div className={`space-y-6 ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
            <motion.h1
              initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title || '' }}
            />
            
            <motion.p
              initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: slide.caption || '' }}
            />
            
            {onNext && (
              <motion.div
                initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
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
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isImageLeft ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`${isImageLeft ? 'md:order-1' : 'md:order-2'}`}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </SlideContainer>
  );
}; 