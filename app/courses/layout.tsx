'use client';

import { useState } from 'react';
import CollapsibleSidebar from '../components/CollapsibleSidebar';
import { cn } from '@/lib/utils';

interface CoursesLayoutProps {
  children: React.ReactNode;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="sidebar-layout">
      {/* Desktop Sidebar - Always rendered but fixed positioned */}
      <div className="hidden md:block">
        <CollapsibleSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarCollapsed && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarCollapsed(true)} />
          <div className="absolute left-0 top-0 h-full max-w-[80vw]">
            <CollapsibleSidebar 
              isCollapsed={false} 
              onToggle={() => setIsSidebarCollapsed(true)} 
            />
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className={cn("sidebar-content", isSidebarCollapsed && "collapsed")}>
        {children}
      </div>
    </div>
  );
} 