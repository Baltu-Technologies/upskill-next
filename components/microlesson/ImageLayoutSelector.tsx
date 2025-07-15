'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export type ImageLayout = 'none' | 'top' | 'left' | 'right' | 'bottom' | 'background';

interface ImageLayoutSelectorProps {
  currentLayout: ImageLayout;
  onLayoutChange: (layout: ImageLayout) => void;
  className?: string;
}

const layoutOptions = [
  {
    id: 'none' as ImageLayout,
    label: 'No Image',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100">
        <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">T</span>
        </div>
      </div>
    ),
    description: 'Text only'
  },
  {
    id: 'top' as ImageLayout,
    label: 'Image Top',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100">
        <div className="w-full h-2 bg-blue-300 rounded-t-sm"></div>
        <div className="w-full h-4 bg-gray-200 rounded-b-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">T</span>
        </div>
      </div>
    ),
    description: 'Image above text'
  },
  {
    id: 'left' as ImageLayout,
    label: 'Image Left',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100 flex">
        <div className="w-3 h-full bg-blue-300 rounded-l-sm"></div>
        <div className="w-5 h-full bg-gray-200 rounded-r-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">T</span>
        </div>
      </div>
    ),
    description: 'Image on left side'
  },
  {
    id: 'right' as ImageLayout,
    label: 'Image Right',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100 flex">
        <div className="w-5 h-full bg-gray-200 rounded-l-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">T</span>
        </div>
        <div className="w-3 h-full bg-blue-300 rounded-r-sm"></div>
      </div>
    ),
    description: 'Image on right side'
  },
  {
    id: 'bottom' as ImageLayout,
    label: 'Image Bottom',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100">
        <div className="w-full h-4 bg-gray-200 rounded-t-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">T</span>
        </div>
        <div className="w-full h-2 bg-blue-300 rounded-b-sm"></div>
      </div>
    ),
    description: 'Image below text'
  },
  {
    id: 'background' as ImageLayout,
    label: 'Background',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-blue-300 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-400 rounded-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-white font-semibold">T</span>
        </div>
      </div>
    ),
    description: 'Image as background'
  }
];

export default function ImageLayoutSelector({ 
  currentLayout, 
  onLayoutChange, 
  className = '' 
}: ImageLayoutSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">Image Layout</h3>
      <div className="grid grid-cols-3 gap-2">
        {layoutOptions.map((option) => (
          <Button
            key={option.id}
            variant={currentLayout === option.id ? "default" : "outline"}
            size="sm"
            onClick={() => onLayoutChange(option.id)}
            className={`h-auto p-3 flex flex-col items-center gap-2 transition-all duration-200 ${
              currentLayout === option.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center">
              {option.icon}
            </div>
            <div className="text-xs font-medium leading-tight text-center">
              {option.label}
            </div>
          </Button>
        ))}
      </div>
      <div className="text-xs text-gray-500 text-center">
        {layoutOptions.find(opt => opt.id === currentLayout)?.description}
      </div>
    </div>
  );
} 