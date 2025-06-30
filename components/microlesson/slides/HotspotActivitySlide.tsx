'use client';

import React, { useState } from 'react';
import { HotspotActivitySlide as HotspotActivitySlideType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SlideContainer } from '../SlideContainer';

interface HotspotActivitySlideProps {
  slide: HotspotActivitySlideType;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const HotspotActivitySlide: React.FC<HotspotActivitySlideProps> = ({ slide, onNext }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [completedHotspots, setCompletedHotspots] = useState<Set<string>>(new Set());

  const handleHotspotClick = (hotspotId: string) => {
    setSelectedHotspot(hotspotId);
    setCompletedHotspots(prev => new Set(prev).add(hotspotId));
  };

  const selectedHotspotData = slide.hotspots.find(h => h.id === selectedHotspot);
  const allHotspotsCompleted = completedHotspots.size === slide.hotspots.length;

  return (
    <SlideContainer
      backgroundColor="#0F172A"
      maxWidth="xl"
      padding="md"
      centerContent={false}
    >
      <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-bold text-white mb-2">{slide.title}</h2>
        <p className="text-slate-300">{slide.instruction}</p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Image
              src={slide.imageUrl || '/media/placeholder-image.jpg'}
              alt={slide.title}
              width={800}
              height={600}
              className="rounded-2xl shadow-2xl"
            />
            
            {/* Hotspots */}
            {slide.hotspots.map((hotspot, index) => (
              <motion.button
                key={hotspot.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                onClick={() => handleHotspotClick(hotspot.id)}
                className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-white font-semibold text-sm transition-all duration-300 hover:scale-110 ${
                  completedHotspots.has(hotspot.id)
                    ? 'bg-green-500 border-green-400 animate-pulse'
                    : selectedHotspot === hotspot.id
                    ? 'bg-blue-500 border-blue-400 scale-110'
                    : 'bg-blue-600 border-blue-500 hover:bg-blue-500'
                }`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {index + 1}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-800 rounded-xl p-6 min-h-[120px] flex items-center">
            {selectedHotspotData ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedHotspot}
                className="w-full"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedHotspotData.label}
                </h3>
                {selectedHotspotData.description && (
                  <p className="text-slate-300">{selectedHotspotData.description}</p>
                )}
              </motion.div>
            ) : (
              <p className="text-slate-400 text-center w-full">
                Click on any numbered hotspot to learn more
              </p>
            )}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {completedHotspots.size} / {slide.hotspots.length}
              </div>
              <div className="text-slate-400 text-sm">Hotspots Explored</div>
            </div>
            
            {allHotspotsCompleted && onNext && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onNext}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <span>Continue</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </div>
      </div>
    </SlideContainer>
  );
}; 