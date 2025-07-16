'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SlashCommandItem } from './SlashCommandExtension';
import { Command } from 'lucide-react';

interface SlashCommandMenuProps {
  items: SlashCommandItem[];
  selectedIndex: number;
  onSelect: (item: SlashCommandItem) => void;
  onClose: () => void;
  position?: { x: number; y: number };
  query?: string;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  items,
  selectedIndex,
  onSelect,
  onClose,
  position,
  query = ''
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose();
        }
      } catch (error) {
        console.error('Error in handleClickOutside:', error);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Auto-scroll to selected item
  useEffect(() => {
    try {
      if (menuRef.current && selectedIndex >= 0 && selectedIndex < items.length) {
        const selectedElement = menuRef.current.querySelector(`[data-index="${selectedIndex}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest' });
        }
      }
    } catch (error) {
      console.error('Error in auto-scroll:', error);
    }
  }, [selectedIndex, items.length]);
  
    if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900 min-w-[280px] max-w-[400px] max-h-[300px] overflow-y-auto"
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
        transform: 'translateY(-100%)',
      }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Command className="w-4 h-4" />
          <span>
            {query ? `Commands matching "${query}"` : 'Available commands'}
          </span>
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={index}
            data-index={index}
            onClick={() => onSelect(item)}
            className={`w-full px-3 py-2 flex items-start gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              index === selectedIndex 
                ? 'bg-blue-50 dark:bg-blue-900/50 border-r-2 border-blue-500 dark:border-blue-400' 
                : ''
            }`}
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-0.5 ${
              index === selectedIndex 
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {item.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${
                index === selectedIndex 
                  ? 'text-blue-900 dark:text-blue-200' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {item.title}
              </div>
              <div className={`text-xs mt-0.5 ${
                index === selectedIndex 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {item.description}
              </div>
            </div>
            
            {/* Keyboard hint */}
            {index === selectedIndex && (
              <div className="flex-shrink-0 text-xs text-blue-500 dark:text-blue-400 mt-1">
                ↵
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Use ↑↓ to navigate</span>
          <span>Enter to select • Esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default SlashCommandMenu; 