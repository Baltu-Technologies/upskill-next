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
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  // Refs for click outside detection
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block">
        <CollapsibleSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 overflow-hidden",
        "lg:ml-16",
        !isSidebarCollapsed && "lg:ml-80"
      )}>
        {/* Floating Top Navigation */}
        <div className="absolute top-4 right-4 z-50">
          <nav className="bg-white/80 dark:bg-[hsl(222,84%,8%)]/80 backdrop-blur-xl rounded-2xl border border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30 px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]
                       before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:via-transparent before:to-transparent before:backdrop-blur-[2px] before:z-[-1] before:rounded-2xl
                       dark:before:from-black/20">
            <div className="flex items-center gap-3">

                        {/* Gamification Stats + Toggle */}
            {/* Desktop Gamification Stats with Swipe Animation */}
            {showStatsPanel && (
              <div className="hidden lg:flex items-center gap-3 transition-all duration-500 ease-in-out transform animate-in slide-in-from-right-4 fade-in">
              {/* Learning Streak */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] backdrop-blur-sm hover:scale-105 transition-all duration-200">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Flame className="h-3 w-3 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-orange-600">15</div>
                  <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/70">Streak</div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] backdrop-blur-sm hover:scale-105 transition-all duration-200">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                  <Zap className="h-3 w-3 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">1,825</div>
                  <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/70">Total XP</div>
                </div>
              </div>

              {/* Weekly Goal Progress */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] backdrop-blur-sm hover:scale-105 transition-all duration-200">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Target className="h-3 w-3 text-green-600" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/70">Weekly Goal</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-300/60 dark:bg-[hsl(222,84%,15%)] rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-green-600">75%</span>
                  </div>
                </div>
              </div>
              </div>
            )}

            {/* Mobile Stats with Swipe Animation */}
            {showStatsPanel && (
              <div className="lg:hidden flex items-center gap-2 transition-all duration-500 ease-in-out transform animate-in slide-in-from-right-2 fade-in">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] hover:scale-105 transition-all duration-200">
                <Flame className="h-3 w-3 text-orange-600" />
                <span className="text-xs font-bold text-orange-600">15</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] hover:scale-105 transition-all duration-200">
                <Zap className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-bold text-purple-600">1.8k</span>
              </div>
              </div>
            )}

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
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                            <Bell className="h-4 w-4 text-white fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New course available!</p>
                            <p className="text-xs text-muted-foreground mt-1">Advanced React Patterns is now live</p>
                            <p className="text-xs text-blue-600 mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                            <Target className="h-4 w-4 text-white fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Weekly goal achieved!</p>
                            <p className="text-xs text-muted-foreground mt-1">You've completed 5 lessons this week</p>
                            <p className="text-xs text-green-600 mt-1">1 hour ago</p>
                          </div>
                        </div>
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
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                            <MessageSquare className="h-4 w-4 text-white fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Sarah from DevTeam</p>
                            <p className="text-xs text-muted-foreground mt-1">Great work on the React project! Let's discuss the next steps...</p>
                            <p className="text-xs text-purple-600 mt-1">5 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                            <MessageSquare className="h-4 w-4 text-white fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Course Instructor</p>
                            <p className="text-xs text-muted-foreground mt-1">Assignment feedback is ready for review</p>
                            <p className="text-xs text-indigo-600 mt-1">1 hour ago</p>
                          </div>
                        </div>
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
          </nav>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pt-6 pr-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
} 