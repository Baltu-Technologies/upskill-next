'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Settings,
  Sun,
  Moon,
  Monitor,
  Globe,
  LogOut,
  LogIn,
  User,
  X,
  Check,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface MyAccountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function MyAccountPopup({ isOpen, onClose, anchorEl }: MyAccountPopupProps) {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLanguageDropdown, isOpen]);

  if (!isOpen) return null;



  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  const handleLogin = () => {
    onClose();
    router.push('/auth');
  };

  const handleSettings = () => {
    onClose();
    router.push('/settings');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-2xl border border-white/20 dark:border-slate-700/50">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    My Account
                  </h2>
                  {user && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email || user.name || 'User'}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Theme Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Theme
                </h3>
                <Button
                  variant="outline"
                  onClick={cycleTheme}
                  className={cn(
                    "w-full justify-between h-12 px-4",
                    "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700",
                    "border border-slate-300 dark:border-slate-600",
                    "transition-all duration-200 hover:scale-[1.02]",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getThemeIcon()}
                    <span className="text-sm font-medium">{getThemeLabel()}</span>
                  </div>
                </Button>
              </div>

              {/* Language Settings */}
              <div className="relative" ref={dropdownRef}>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Language
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={cn(
                    "w-full justify-between h-12 px-4",
                    "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700",
                    "border border-slate-300 dark:border-slate-600",
                    "transition-all duration-200 hover:scale-[1.02]",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
                      <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === selectedLanguage)?.name}</span>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    showLanguageDropdown && "rotate-180"
                  )} />
                </Button>
                
                {/* Dropdown */}
                {showLanguageDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      {LANGUAGES.map((language) => (
                        <Button
                          key={language.code}
                          variant="ghost"
                          onClick={() => {
                            setSelectedLanguage(language.code);
                            setShowLanguageDropdown(false);
                          }}
                          className={cn(
                            "w-full justify-between h-10 px-4 rounded-none",
                            "hover:bg-slate-50 dark:hover:bg-slate-700",
                            selectedLanguage === language.code && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{language.flag}</span>
                            <span className="text-sm">{language.name}</span>
                          </div>
                          {selectedLanguage === language.code && (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                {/* Settings */}
                <Button
                  variant="outline"
                  onClick={handleSettings}
                  className={cn(
                    "w-full justify-start h-12 px-4",
                    "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700",
                    "border border-slate-300 dark:border-slate-600",
                    "transition-all duration-200 hover:scale-[1.02]",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Settings</span>
                </Button>

                {/* Login/Logout */}
                {user ? (
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className={cn(
                      "w-full justify-start h-12 px-4",
                      "bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20",
                      "border border-slate-300 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-600",
                      "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
                      "transition-all duration-200 hover:scale-[1.02]",
                      "shadow-sm hover:shadow-md"
                    )}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span className="text-sm font-medium">Log Out</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleLogin}
                    className={cn(
                      "w-full justify-start h-12 px-4",
                      "bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20",
                      "border border-slate-300 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-600",
                      "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300",
                      "transition-all duration-200 hover:scale-[1.02]",
                      "shadow-sm hover:shadow-md"
                    )}
                  >
                    <LogIn className="h-4 w-4 mr-3" />
                    <span className="text-sm font-medium">Log In</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 