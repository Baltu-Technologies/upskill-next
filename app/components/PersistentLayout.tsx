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
  const [isMobile, setIsMobile] = useState(true); // Start as mobile to prevent sidebar flash
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  
  // Refs for click outside detection
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Mobile detection - anything under 900px uses bottom nav and fixed top navbar
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 900); // Custom breakpoint: <900px = mobile, ≥900px = desktop
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
        !isMobile && (isSidebarCollapsed ? "tablet:ml-16" : "tablet:ml-72")
      )}>
        {/* Top Navigation - Mobile Only */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 z-40">
            <nav className="bg-white/95 dark:bg-[hsl(222,84%,8%)]/95 backdrop-blur-xl border-b border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30 px-4 py-3 shadow-lg">
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
              </div>
            </nav>
          </div>
        )}

        {/* Floating Navigation Bar - Desktop/Tablet Only */}
        {!isMobile && (
          <div className="fixed top-6 right-6 z-40">
            <nav className="bg-white/80 dark:bg-[hsl(222,84%,8%)]/80 backdrop-blur-xl rounded-2xl border border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:via-transparent before:to-transparent before:backdrop-blur-[2px] before:z-[-1] before:rounded-2xl dark:before:from-black/20">
              <div className="flex items-center gap-4 px-4 py-3">
                {/* Points Display */}
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

                {/* Enhanced Messages Button */}
                <div className="relative" ref={messagesRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative group h-10 px-4 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 dark:hover:from-blue-400/10 dark:hover:to-purple-400/10 rounded-xl transition-all duration-300 hover:scale-105 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-400/20 bg-slate-200/40 dark:bg-[hsl(222,84%,12%)]"
                    onClick={() => router.push('/messages')}
                  >
                    {/* Message Icon with Enhanced Styling */}
                    <div className="relative flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 fill-current" />
                      
                      {/* New Message Count */}
                      <div className="absolute -top-1 -right-1 flex items-center justify-center">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-blue-500 to-purple-500 items-center justify-center shadow-lg">
                            <span className="text-[9px] font-bold text-white">3</span>
                          </span>
                        </span>
                      </div>
                      
                      {/* Label */}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        Messages
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className={cn(
          "flex-1 overflow-auto",
          isMobile ? "pt-[68px] pb-20 px-6" : "pt-4"
        )}>
          {children}
        </main>

        {/* Mobile Bottom Navigation - Only show on mobile */}
        {isMobile && <MobileBottomNav />}
      </div>
    </div>
  );
} 