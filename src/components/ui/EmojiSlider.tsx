"use client";

import React from 'react';
import { ThumbsDown, Meh, ThumbsUp, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmojiSliderProps {
  value: 0 | 1 | 2 | 3;
  onChange: (value: 0 | 1 | 2 | 3) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const INTEREST_OPTIONS = [
  { 
    value: 0 as const, 
    icon: ThumbsDown, 
    label: 'Not Interested', 
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  { 
    value: 1 as const, 
    icon: Meh, 
    label: 'Neutral', 
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-700'
  },
  { 
    value: 2 as const, 
    icon: ThumbsUp, 
    label: 'Interested', 
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  { 
    value: 3 as const, 
    icon: Heart, 
    label: 'Very Interested', 
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    borderColor: 'border-pink-200 dark:border-pink-800'
  },
] as const;

export const EmojiSlider: React.FC<EmojiSliderProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  className
}) => {
  const handleKeyDown = (event: React.KeyboardEvent, optionValue: 0 | 1 | 2 | 3) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onChange(optionValue);
      }
    }
  };

  const handleArrowNavigation = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    const currentIndex = INTEREST_OPTIONS.findIndex(option => option.value === value);
    let newIndex = currentIndex;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      newIndex = Math.min(INTEREST_OPTIONS.length - 1, currentIndex + 1);
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      onChange(INTEREST_OPTIONS[newIndex].value);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div 
        className="flex items-center justify-between gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        onKeyDown={handleArrowNavigation}
        role="radiogroup"
        aria-label={label || "Interest level selector"}
      >
        {INTEREST_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const IconComponent = option.icon;
          
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg transition-all duration-200 min-w-[60px] flex-1",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "hover:bg-gray-50 dark:hover:bg-gray-700",
                disabled && "opacity-50 cursor-not-allowed",
                isSelected && [option.bgColor, option.borderColor, "border-2 scale-105 shadow-md"],
                !isSelected && "border border-transparent",
                !disabled && "cursor-pointer"
              )}
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              tabIndex={isSelected ? 0 : -1}
            >
              {IconComponent && (
                <IconComponent
                  className={cn(
                    "w-5 h-5 mb-1 transition-all duration-200",
                    isSelected ? option.color : "text-gray-400 dark:text-gray-500",
                    isSelected && "scale-110"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}; 