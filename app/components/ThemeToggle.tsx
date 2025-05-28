'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export default function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, actualTheme, toggleTheme, isHydrated } = useTheme();
  const IconComponent = themeIcons[theme];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted and hydrated to prevent hydration mismatch and SSR issues
  if (!isMounted || !isHydrated) {
    return (
      <button 
        disabled
        className="inline-flex items-center justify-center h-10 w-10 rounded-md opacity-50"
      >
        <Monitor size={16} />
        <span className="sr-only">Loading theme...</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      title={`Current theme: ${themeLabels[theme]} (actual: ${actualTheme}). Click to change.`}
      aria-label={`Switch theme. Current: ${themeLabels[theme]}`}
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <IconComponent size={16} />
      
      {/* Small indicator showing actual theme */}
      <div
        className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-current"
        style={{
          backgroundColor: actualTheme === 'light' ? '#fbbf24' : '#1e293b',
        }}
        title={`Actual theme: ${actualTheme}`}
      />
      
      <span className="sr-only">{themeLabels[theme]} theme (actual: {actualTheme})</span>
    </button>
  );
} 