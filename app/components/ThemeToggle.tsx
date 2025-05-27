'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme, actualTheme, toggleTheme, isHydrated } = useTheme();
  const IconComponent = themeIcons[theme];

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Monitor size={16} className="opacity-50" />
        <span className="sr-only">Loading theme...</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={`Current theme: ${themeLabels[theme]} (actual: ${actualTheme}). Click to change.`}
      aria-label={`Switch theme. Current: ${themeLabels[theme]}`}
      className="relative"
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
    </Button>
  );
} 