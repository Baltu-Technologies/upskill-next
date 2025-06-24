'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home,
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  Bot,
  User,
  Briefcase,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  Monitor,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface MobileBottomNavProps {
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  isActive?: boolean;
}

interface ProfileMenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

export default function MobileBottomNav({ className }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  // Left side navigation items
  const leftNavItems: NavItem[] = [
    {
      title: 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/' || pathname === '/dashboard'
    },
    {
      title: 'Courses',
      icon: BookOpen,
      href: '/courses',
      isActive: pathname.startsWith('/courses')
    }
  ];

  // Right side navigation items
  const rightNavItems: NavItem[] = [
    {
      title: 'Careers',
      icon: Briefcase,
      href: '/employers/search',
      badge: '5',
      isActive: pathname.startsWith('/employers')
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      href: '/study-hub/ask-ai',
      badge: '2',
      isActive: pathname.startsWith('/study-hub/ask-ai') || pathname.startsWith('/messages')
    }
  ];

  // Profile submenu items
  const profileMenuItems: ProfileMenuItem[] = [
    {
      title: 'Study Hub',
      icon: GraduationCap,
      href: '/study-hub/study-list'
    },
    {
      title: 'My Stats & Goals',
      icon: TrendingUp,
      href: '/stats-goals'
    }
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  // Theme toggle function
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const isProfileActive = pathname.startsWith('/profile') || 
                         pathname.startsWith('/study-hub/study-list') || 
                         pathname.startsWith('/stats-goals');

  return (
    <div     className={cn(
      "fixed bottom-0 left-0 right-0 z-50 tablet:hidden",
      "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
      "border-t border-gray-200/80 dark:border-gray-700/50",
      "shadow-[0_-8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)]",
      "safe-area-inset-bottom",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-2 pb-safe">
        {/* Left Navigation Items */}
        <div className="flex items-center space-x-6">
          {leftNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant="ghost"
                size="icon"
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "relative flex flex-col items-center justify-center h-12 w-12 p-1",
                  "transition-all duration-200 ease-out",
                  "hover:scale-105 active:scale-95",
                  item.isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    item.isActive && "fill-current"
                  )} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-all duration-200",
                  item.isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  {item.title}
                </span>
                {item.isActive && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Center Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative flex items-center justify-center h-16 w-16 p-0",
                "transition-all duration-200 ease-out",
                "hover:scale-105 active:scale-95",
                "rounded-full",
                isProfileActive && "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-2 mb-2" 
            align="end" 
            side="top"
            sideOffset={8}
          >
            {/* User Profile Header */}
            <DropdownMenuLabel className="font-normal p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">Peter Costa</p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">peter@example.com</p>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Quick Access Items */}
            <div className="space-y-1 mb-2">
              {profileMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem 
                    key={item.title}
                    onClick={() => handleNavClick(item.href)}
                    className="rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer p-3 border border-gray-100 dark:border-gray-800"
                  >
                    <Icon className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </div>

            <DropdownMenuSeparator className="my-2" />

            {/* Profile & Settings */}
            <DropdownMenuItem 
              onClick={() => handleNavClick('/profile')}
              className="rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer p-3 border border-gray-100 dark:border-gray-800"
            >
              <User className="mr-3 h-4 w-4 text-blue-500" />
              <span className="font-medium">My Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleNavClick('/settings')}
              className="rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer p-3 border border-gray-100 dark:border-gray-800"
            >
              <Settings className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />
            
            {/* Theme Toggle */}
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
              }}
              className="cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-lg p-3 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  {theme === 'light' ? <Sun className="mr-3 h-4 w-4 text-amber-500" /> : 
                   theme === 'dark' ? <Moon className="mr-3 h-4 w-4 text-blue-400" /> : 
                   <Monitor className="mr-3 h-4 w-4 text-gray-500" />}
                  <span className="font-medium">Theme</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border">
                  {theme}
                </span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem 
              onClick={signOut} 
              className="rounded-lg bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200 cursor-pointer p-3 text-red-600 dark:text-red-400 border border-gray-100 dark:border-gray-800"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right Navigation Items */}
        <div className="flex items-center space-x-6">
          {rightNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant="ghost"
                size="icon"
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "relative flex flex-col items-center justify-center h-12 w-12 p-1",
                  "transition-all duration-200 ease-out",
                  "hover:scale-105 active:scale-95",
                  item.isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    item.isActive && "fill-current"
                  )} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}

                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-all duration-200",
                  item.isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  {item.title}
                </span>
                {item.isActive && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 