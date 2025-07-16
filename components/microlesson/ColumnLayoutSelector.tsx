'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ColumnLayout } from '@/types/microlesson/slide';

interface ColumnLayoutSelectorProps {
  currentLayout: ColumnLayout;
  onLayoutChange: (layout: ColumnLayout) => void;
  className?: string;
}

const columnOptions = [
  {
    id: 'none' as ColumnLayout,
    label: 'No Columns',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100">
        <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">□</span>
        </div>
      </div>
    ),
    description: 'Single content area'
  },
  {
    id: '2-equal' as ColumnLayout,
    label: '2 Columns - Equal',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100 flex gap-0.5">
        <div className="w-1/2 h-full bg-blue-300 rounded-l-sm"></div>
        <div className="w-1/2 h-full bg-blue-300 rounded-r-sm"></div>
      </div>
    ),
    description: 'Two equal columns'
  },
  {
    id: '2-left' as ColumnLayout,
    label: '2 Columns - Left',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100 flex gap-0.5">
        <div className="w-3/5 h-full bg-blue-300 rounded-l-sm"></div>
        <div className="w-2/5 h-full bg-blue-200 rounded-r-sm"></div>
      </div>
    ),
    description: 'Left column wider'
  },
  {
    id: '2-right' as ColumnLayout,
    label: '2 Columns - Right',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100 flex gap-0.5">
        <div className="w-2/5 h-full bg-blue-200 rounded-l-sm"></div>
        <div className="w-3/5 h-full bg-blue-300 rounded-r-sm"></div>
      </div>
    ),
    description: 'Right column wider'
  },
  {
    id: '3-columns' as ColumnLayout,
    label: '3 Columns',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100 flex gap-0.5">
        <div className="w-1/3 h-full bg-blue-300 rounded-l-sm"></div>
        <div className="w-1/3 h-full bg-blue-300"></div>
        <div className="w-1/3 h-full bg-blue-300 rounded-r-sm"></div>
      </div>
    ),
    description: 'Three equal columns'
  },
  {
    id: '4-columns' as ColumnLayout,
    label: '4 Columns',
    icon: (
      <div className="w-8 h-6 border-2 border-gray-400 rounded bg-gray-100 flex gap-0.5">
        <div className="w-1/4 h-full bg-blue-300 rounded-l-sm"></div>
        <div className="w-1/4 h-full bg-blue-300"></div>
        <div className="w-1/4 h-full bg-blue-300"></div>
        <div className="w-1/4 h-full bg-blue-300 rounded-r-sm"></div>
      </div>
    ),
    description: 'Four equal columns'
  }
];

export default function ColumnLayoutSelector({ 
  currentLayout, 
  onLayoutChange, 
  className = '' 
}: ColumnLayoutSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Column Layout</h3>
      <div className="grid grid-cols-2 gap-2">
        {columnOptions.map((option) => (
          <Button
            key={option.id}
            variant={currentLayout === option.id ? "default" : "outline"}
            size="sm"
            onClick={() => onLayoutChange(option.id)}
            className={`h-auto p-3 flex flex-col items-center gap-2 transition-all duration-200 ${
              currentLayout === option.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-500'
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
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {columnOptions.find(opt => opt.id === currentLayout)?.description}
      </div>
    </div>
  );
} 