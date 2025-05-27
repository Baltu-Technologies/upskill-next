'use client';

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  sidebarCollapsed?: boolean;
  className?: string;
}

export default function ResponsiveLayout({ 
  children, 
  sidebar, 
  sidebarCollapsed = false,
  className 
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className={cn("min-h-screen bg-background flex overflow-hidden", className)}>
      {/* Sidebar */}
      {sidebar && (
        <div className="hidden md:block shrink-0">
          {sidebar}
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// Hook for getting sidebar-aware container padding
export function useSidebarPadding(sidebarCollapsed: boolean = false) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Return responsive padding classes
  return {
    isMobile,
    containerClass: cn(
      "w-full px-4 md:px-6",
      // Ensure content doesn't get too close to edges on smaller screens
      "max-w-full",
      // Prevent horizontal scrolling
      "overflow-x-hidden"
    ),
    mainClass: cn(
      "flex-1 py-6 overflow-auto",
      // Handle sidebar spacing on desktop
      !isMobile && sidebarCollapsed ? "pl-2" : "pl-0"
    )
  };
} 