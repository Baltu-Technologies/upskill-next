'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  primaryColor: string;
  accentColor: string;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [primaryColor, setPrimaryColorState] = useState('blue');
  const [accentColor, setAccentColorState] = useState('purple');
  const [isHydrated, setIsHydrated] = useState(false);

  // Calculate actual theme
  const getActualTheme = (themeValue: Theme): 'light' | 'dark' => {
    if (themeValue === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeValue;
  };

  const actualTheme = getActualTheme(theme);
  const isDark = actualTheme === 'dark';

  // Initialize from localStorage after hydration
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const savedPrimaryColor = localStorage.getItem('primaryColor');
      const savedAccentColor = localStorage.getItem('accentColor');

      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      if (savedPrimaryColor) {
        setPrimaryColorState(savedPrimaryColor);
      }
      if (savedAccentColor) {
        setAccentColorState(savedAccentColor);
      }
    } catch (error) {
      console.warn('Error loading theme from localStorage:', error);
    }
    
    setIsHydrated(true);
  }, []);

  // Apply theme changes to DOM after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const root = document.documentElement;
    const newActualTheme = getActualTheme(theme);
    
    // Handle dark class
    if (newActualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set data-theme attribute
    root.setAttribute('data-theme', newActualTheme);
    
    // Apply CSS custom properties for colors
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--accent-color', accentColor);
    
    // Save to localStorage
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('primaryColor', primaryColor);
      localStorage.setItem('accentColor', accentColor);
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
  }, [theme, primaryColor, accentColor, isHydrated]);

  // Listen for system theme changes
  useEffect(() => {
    if (!isHydrated || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render by updating a state that triggers the theme effect
      setThemeState('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isHydrated]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        isDark,
        setTheme,
        toggleTheme,
        primaryColor,
        accentColor,
        setPrimaryColor,
        setAccentColor,
        isHydrated,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 