'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useMessages } from '../contexts/MessagesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { 
  Flame,
  Zap,
  Target,
  Gamepad2,
  Bell,
  MessageSquare,
  Bot,
  X,
  BookOpen
} from 'lucide-react';
import CollapsibleSidebar from './CollapsibleSidebar';
import MobileBottomNav from './MobileBottomNav';
import MessagesModal from './MessagesModal';
import { cn } from '@/lib/utils';
import { StudyModal } from '@/components/microlesson/StudyModal';

interface PersistentLayoutProps {
  children: React.ReactNode;
}

export default function PersistentLayout({ children }: PersistentLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { showMessagesModal, openMessagesModal, closeMessagesModal } = useMessages();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Start as mobile to prevent sidebar flash
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showStudyModal, setShowStudyModal] = useState(false);

  // Check if we're in course creator mode
  const isInCourseCreator = pathname?.startsWith('/course-creator');

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
    <div className="flex h-screen bg-black dark:from-[hsl(222,84%,5%)] dark:via-[hsl(222,84%,8%)] dark:to-[hsl(222,84%,12%)]">
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
        !isMobile && (isSidebarCollapsed ? "ml-16" : "ml-80")
      )}>
        {/* Top Navigation - Mobile Only */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 z-40">
            <nav className="bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 shadow-lg">
              <div className="flex items-center justify-between">
                {/* Baltu Logo (Left) */}
                <div className="flex-1 flex justify-start">
                  <div className="w-30 h-8">
                    <Image 
                      src="/media/baltu_technologies_logo_long_upskill_white.png" 
                      alt="Upskill Logo" 
                      width={120} 
                      height={32}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Points Display (Right) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:scale-105 transition-all duration-200">
                    <Flame className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-bold text-orange-600">15</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:scale-105 transition-all duration-200">
                    <Zap className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-bold text-purple-600">1.8k</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Floating Navigation Bar - Desktop/Tablet Only */}
        {!isMobile && !isInCourseCreator && (
          <div className="fixed top-6 right-4 xl:right-6 z-40" style={{ width: 'fit-content', maxWidth: '420px' }}>
            <nav className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-background/20 before:via-transparent before:to-transparent before:backdrop-blur-[2px] before:z-[-1] before:rounded-2xl">
              <div className="flex items-center gap-4 px-4 py-3">
                {/* Points Display */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:scale-105 transition-all duration-200">
                    <Flame className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-bold text-orange-600">15</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:scale-105 transition-all duration-200">
                    <Zap className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-bold text-purple-600">1.8k</span>
                  </div>
                </div>



                {/* Enhanced Study Button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative group h-10 px-4 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 rounded-xl transition-all duration-300 hover:scale-105 border border-transparent hover:border-green-200/30 bg-muted/40"
                    onClick={() => setShowStudyModal(true)}
                  >
                    {/* Study Icon with Enhanced Styling */}
                    <div className="relative flex items-center gap-2">
                      <BookOpen className={`h-4 w-4 ${isDark ? 'text-slate-300 group-hover:text-green-400' : 'text-slate-600 group-hover:text-green-600'} transition-colors duration-300`} />
                      
                      {/* Study Items Count */}
                      <div className="absolute -top-1 -right-1 flex items-center justify-center">
                        <span className="relative flex h-4 w-4">
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-green-500 to-emerald-500 items-center justify-center shadow-lg">
                            <span className="text-[9px] font-bold text-white">5</span>
                          </span>
                        </span>
                      </div>
                      
                      {/* Label */}
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200 group-hover:text-green-400' : 'text-slate-700 group-hover:text-green-600'} transition-colors duration-300`}>
                        Study
                      </span>
                    </div>
                  </Button>
                </div>

                {/* Enhanced Messages Button */}
                <div className="relative" ref={messagesRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative group h-10 px-4 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-300 hover:scale-105 border border-transparent hover:border-blue-200/30 bg-muted/40"
                    onClick={() => openMessagesModal()}
                  >
                    {/* Message Icon with Enhanced Styling */}
                    <div className="relative flex items-center gap-2">
                      <MessageSquare className={`h-4 w-4 ${isDark ? 'text-slate-300 group-hover:text-blue-400' : 'text-slate-600 group-hover:text-blue-600'} transition-colors duration-300 fill-current`} />
                      
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
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'} transition-colors duration-300`}>
                        Messages
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Content Area */}
        <div className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          isMobile ? "pt-20" : "pt-0"
        )}>
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <MobileBottomNav />
          </div>
        )}
      </div>

      {/* Messages Modal */}
      <MessagesModal 
        isOpen={showMessagesModal} 
        onClose={closeMessagesModal} 
      />

      {/* Study Modal */}
      <StudyModal 
        isOpen={showStudyModal} 
        onClose={() => setShowStudyModal(false)} 
      />
    </div>
  );
} 