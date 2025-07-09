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
  const { theme, setTheme, isDark } = useTheme();
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
        <Card className={`w-full max-w-md ${isDark ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-white/20'} backdrop-blur-sm shadow-2xl border`}>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    My Account
                  </h2>
                  {user && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email || user.name || 'User'}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={`h-8 w-8 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Theme Settings */}
              <div>
                <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Theme
                </h3>
                <Button
                  variant="outline"
                  onClick={cycleTheme}
                  className={cn(
                    "w-full justify-between h-12 px-4",
                    isDark ? "bg-slate-800 hover:bg-slate-700 border-slate-600" : "bg-white hover:bg-slate-50 border-slate-300",
                    "border transition-all duration-200 hover:scale-[1.02]",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  <div className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span>{getThemeIcon()}</span>
                    <span className="text-sm font-medium">{getThemeLabel()}</span>
                  </div>
                </Button>
              </div>

              {/* Language Settings */}
              <div className="relative" ref={dropdownRef}>
                <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Language
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={cn(
                    "w-full justify-between h-12 px-4",
                    isDark ? "bg-slate-800 hover:bg-slate-700 border-slate-600" : "bg-white hover:bg-slate-50 border-slate-300",
                    "border transition-all duration-200 hover:scale-[1.02]",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  <div className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Globe className={`h-4 w-4 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
                      <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === selectedLanguage)?.name}</span>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    `h-4 w-4 transition-transform duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`,
                    showLanguageDropdown && "rotate-180"
                  )} />
                </Button>
                
                {/* Dropdown */}
                {showLanguageDropdown && (
                  <div className={`absolute top-full left-0 right-0 mt-2 ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'} border rounded-lg shadow-lg z-10`}>
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
                            `w-full justify-between h-10 px-4 rounded-none ${isDark ? 'text-white' : 'text-gray-900'}`,
                            isDark ? "hover:bg-slate-700" : "hover:bg-slate-50",
                            selectedLanguage === language.code && (isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600")
                          )}
                        >
                          <div className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
              <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                {/* Settings */}
                <Button
                  variant="outline"
                  onClick={handleSettings}
                  className={cn(
                    "w-full justify-start h-12 px-4",
                    isDark ? "bg-slate-800 hover:bg-slate-700 border-slate-600" : "bg-white hover:bg-slate-50 border-slate-300",
                    "border transition-all duration-200 hover:scale-[1.02]",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  <Settings className={`h-4 w-4 mr-3 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</span>
                </Button>

                {/* Login/Logout */}
                {user ? (
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className={cn(
                      "w-full justify-start h-12 px-4",
                      isDark ? "bg-slate-800 hover:bg-red-900/20 border-slate-600 hover:border-red-600" : "bg-white hover:bg-red-50 border-slate-300 hover:border-red-300",
                      isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700",
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
                      isDark ? "bg-slate-800 hover:bg-green-900/20 border-slate-600 hover:border-green-600" : "bg-white hover:bg-green-50 border-slate-300 hover:border-green-300",
                      isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700",
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