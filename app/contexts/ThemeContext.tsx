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
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');
  const [primaryColor, setPrimaryColor] = useState('hsl(217, 91%, 60%)');
  const [accentColor, setAccentColor] = useState('hsl(142, 71%, 45%)');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const savedPrimaryColor = localStorage.getItem('primaryColor');
      const savedAccentColor = localStorage.getItem('accentColor');
      
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
      if (savedPrimaryColor) {
        setPrimaryColor(savedPrimaryColor);
      }
      if (savedAccentColor) {
        setAccentColor(savedAccentColor);
      }
      
      setIsHydrated(true);
    }
  }, []);

  // Determine the actual theme based on system preference
  useEffect(() => {
    const getSystemTheme = (): 'light' | 'dark' => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'dark';
    };

    const updateActualTheme = () => {
      if (theme === 'system') {
        const systemTheme = getSystemTheme();
        setActualTheme(systemTheme);
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();

    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (theme === 'system') {
          setActualTheme(getSystemTheme());
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Remove existing theme data attribute
      root.removeAttribute('data-theme');
      
      // Add/remove dark class for Tailwind CSS
      if (actualTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Apply theme-specific CSS variables
      if (actualTheme === 'light') {
        root.setAttribute('data-theme', 'light');
        
        // Explicitly set light theme variables
        root.style.setProperty('--background', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--background-secondary', 'hsl(0, 0%, 98%)');
        root.style.setProperty('--foreground', 'hsl(222, 84%, 5%)');
        root.style.setProperty('--card', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--card-hover', 'hsl(0, 0%, 96%)');
        root.style.setProperty('--muted', 'hsl(210, 40%, 96%)');
        root.style.setProperty('--muted-foreground', 'hsl(215, 16%, 46%)');
        root.style.setProperty('--border', 'hsl(214, 32%, 91%)');
        root.style.setProperty('--input', 'hsl(214, 32%, 91%)');
        
        // Shadcn UI Light Variables
        root.style.setProperty('--secondary', 'hsl(210, 40%, 96%)');
        root.style.setProperty('--secondary-foreground', 'hsl(222, 84%, 5%)');
        root.style.setProperty('--popover', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--popover-foreground', 'hsl(222, 84%, 5%)');
        root.style.setProperty('--card-foreground', 'hsl(222, 84%, 5%)');
        
        root.style.setProperty('--gradient-background', 'radial-gradient(ellipse at top, hsl(0, 0%, 100%) 0%, hsl(210, 40%, 98%) 100%)');
        root.style.setProperty('--gradient-card', 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)');
      } else {
        
        // Explicitly set dark theme variables
        root.style.setProperty('--background', 'hsl(222, 84%, 5%)');
        root.style.setProperty('--background-secondary', 'hsl(222, 84%, 8%)');
        root.style.setProperty('--foreground', 'hsl(210, 40%, 98%)');
        root.style.setProperty('--card', 'hsl(222, 84%, 7%)');
        root.style.setProperty('--card-hover', 'hsl(222, 84%, 10%)');
        root.style.setProperty('--muted', 'hsl(217, 33%, 17%)');
        root.style.setProperty('--muted-foreground', 'hsl(215, 20%, 65%)');
        root.style.setProperty('--border', 'hsl(217, 33%, 15%)');
        root.style.setProperty('--input', 'hsl(217, 33%, 15%)');
        
        // Shadcn UI Dark Variables
        root.style.setProperty('--secondary', 'hsl(210, 40%, 8%)');
        root.style.setProperty('--secondary-foreground', 'hsl(210, 40%, 98%)');
        root.style.setProperty('--popover', 'hsl(222, 84%, 5%)');
        root.style.setProperty('--popover-foreground', 'hsl(210, 40%, 98%)');
        root.style.setProperty('--card-foreground', 'hsl(210, 40%, 98%)');
        
        root.style.setProperty('--gradient-background', 'radial-gradient(ellipse at top, hsl(222, 84%, 8%) 0%, hsl(222, 84%, 3%) 100%)');
        root.style.setProperty('--gradient-card', 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)');
      }
      
      // Set custom colors
      root.style.setProperty('--primary', primaryColor);
      root.style.setProperty('--accent', accentColor);
      
      // Also update corresponding glow colors
      const primaryHue = primaryColor.match(/hsl\((\d+),/)?.[1] || '217';
      const accentHue = accentColor.match(/hsl\((\d+),/)?.[1] || '142';
      
      root.style.setProperty('--primary-glow', `hsl(${primaryHue}, 91%, 70%)`);
      root.style.setProperty('--accent-glow', `hsl(${accentHue}, 100%, 60%)`);
    }
  }, [actualTheme, primaryColor, accentColor]);

  // Save theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, isHydrated]);

  // Save colors to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      localStorage.setItem('primaryColor', primaryColor);
      localStorage.setItem('accentColor', accentColor);
    }
  }, [primaryColor, accentColor, isHydrated]);

  const toggleTheme = () => {
    setTheme(currentTheme => {
      switch (currentTheme) {
        case 'dark':
          return 'light';
        case 'light':
          return 'system';
        case 'system':
          return 'dark';
        default:
          return 'dark';
      }
    });
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    isDark: actualTheme === 'dark',
    setTheme,
    toggleTheme,
    primaryColor,
    accentColor,
    setPrimaryColor,
    setAccentColor,
    isHydrated,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 