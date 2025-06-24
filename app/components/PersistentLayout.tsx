'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  Flame,
  Zap,
  Target,
  Gamepad2,
  Bell,
  MessageSquare,
  Bot,
  X
} from 'lucide-react';
import CollapsibleSidebar from './CollapsibleSidebar';
import MobileBottomNav from './MobileBottomNav';
import { cn } from '@/lib/utils';

interface PersistentLayoutProps {
  children: React.ReactNode;
}

export default function PersistentLayout({ children }: PersistentLayoutProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  // Refs for click outside detection
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[hsl(222,84%,5%)] dark:via-[hsl(222,84%,8%)] dark:to-[hsl(222,84%,12%)]">
      {/* Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <CollapsibleSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      )}

      {/* Main Content */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out",
        !isMobile && (isSidebarCollapsed ? "lg:ml-16" : "lg:ml-72")
      )}>
        {/* Top Navigation */}
        <div className="fixed top-0 left-0 right-0 z-40 lg:relative lg:top-auto lg:left-auto lg:right-auto lg:z-auto lg:mx-6 lg:mt-6">
          <nav className="bg-white/95 dark:bg-[hsl(222,84%,8%)]/95 backdrop-blur-xl border-b border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30 px-4 py-3 shadow-lg 
                       lg:bg-white/80 lg:dark:bg-[hsl(222,84%,8%)]/80 lg:rounded-2xl lg:border lg:hover:shadow-xl lg:transition-all lg:duration-300 lg:hover:scale-[1.02]
                       lg:before:content-[''] lg:before:absolute lg:before:inset-0 lg:before:bg-gradient-to-b lg:before:from-white/20 lg:before:via-transparent lg:before:to-transparent lg:before:backdrop-blur-[2px] lg:before:z-[-1] lg:before:rounded-2xl
                       lg:dark:before:from-black/20">
            <div className="flex items-center justify-between">
              {/* Navigation Rules Space (Left) */}
              <div className="flex-1">
                {/* Reserved for navigation rules */}
              </div>

              {/* Points Display (Right) */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] hover:scale-105 transition-all duration-200">
                  <Flame className="h-3 w-3 text-orange-600" />
                  <span className="text-xs font-bold text-orange-600">15</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] hover:scale-105 transition-all duration-200">
                  <Zap className="h-3 w-3 text-purple-600" />
                  <span className="text-xs font-bold text-purple-600">1.8k</span>
                </div>
              </div>

              {/* Desktop Only - Additional Navigation */}
              <div className="hidden lg:flex items-center gap-3 ml-4">
                {/* Gamification Toggle Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 hover:text-[hsl(217,91%,60%)] dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)] transition-all duration-300 hover:scale-105 group border border-border/50"
                  onClick={() => setShowStatsPanel(!showStatsPanel)}
                >
                  <Gamepad2 className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[360deg]" />
                </Button>

                {/* Notifications Button with Dropdown */}
                <div className="relative" ref={notificationsRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 hover:text-[hsl(217,91%,60%)] dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)] transition-all duration-300 hover:scale-105 group border border-border/50 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-4 w-4 fill-current" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </Button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-b border-border">
                        <div className="flex items-center gap-3 mb-3">
                          <Bell className="h-5 w-5 text-red-500 fill-current" />
                          <h3 className="font-semibold text-lg">Notifications</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-white dark:hover:bg-black rounded-full transition-all duration-200 ml-auto" 
                            onClick={() => setShowNotifications(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">New course available</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Advanced React Patterns is now live</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">Achievement unlocked</p>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">You've completed 10 lessons this week!</p>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages Button with Dropdown */}
                <div className="relative" ref={messagesRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 hover:text-[hsl(217,91%,60%)] dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)] transition-all duration-300 hover:scale-105 group border border-border/50 relative"
                    onClick={() => setShowMessages(!showMessages)}
                  >
                    <MessageSquare className="h-4 w-4 fill-current" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
                  </Button>
                  
                  {/* Messages Dropdown */}
                  {showMessages && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-b border-border">
                        <div className="flex items-center gap-3 mb-3">
                          <MessageSquare className="h-5 w-5 text-blue-500 fill-current" />
                          <h3 className="font-semibold text-lg">Messages</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-white dark:hover:bg-black rounded-full transition-all duration-200 ml-auto" 
                            onClick={() => setShowMessages(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            AI
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">AI Study Assistant</p>
                            <p className="text-xs text-muted-foreground mt-1">Ready to help with your learning goals</p>
                            <p className="text-xs text-muted-foreground mt-1">Online now</p>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            JD
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Course Instructor</p>
                            <p className="text-xs text-muted-foreground mt-1">Great progress on the React module!</p>
                            <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Assistant Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 hover:bg-transparent text-slate-600 hover:text-[hsl(217,91%,60%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)] transition-all duration-300 hover:scale-110 group border-none relative bg-transparent"
                  onClick={() => {
                    // Navigate to Ask AI page
                    router.push('/study-hub/ask-ai');
                  }}
                >
                  <div className="relative">
                    {/* AI Avatar with gradient background */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-0.5 group-hover:from-purple-400 group-hover:via-blue-400 group-hover:to-cyan-400 transition-all duration-300 group-hover:scale-105">
                      <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[hsl(222,84%,12%)] flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[hsl(222,84%,8%)] transition-all duration-300">
                        <Bot className="h-4 w-4 text-purple-600 group-hover:text-purple-500 transition-all duration-300" />
                      </div>
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-200 dark:border-[hsl(222,84%,12%)] group-hover:bg-green-300 transition-all duration-300">
                      <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </nav>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pt-20 lg:pt-6 px-6 pb-20 lg:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation - Only show on mobile */}
        {isMobile && <MobileBottomNav />}
      </div>
    </div>
  );
} 