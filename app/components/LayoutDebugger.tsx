'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LayoutDebugger() {
  const [layoutInfo, setLayoutInfo] = useState({
    windowWidth: 0,
    windowHeight: 0,
    sidebarWidth: 0,
    contentWidth: 0,
    hasHorizontalScroll: false
  });

  useEffect(() => {
    const updateLayoutInfo = () => {
      const sidebar = document.querySelector('[class*="w-16"], [class*="w-72"], [class*="w-80"]');
      const content = document.querySelector('.sidebar-content, .flex-1');
      
      setLayoutInfo({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        sidebarWidth: sidebar?.getBoundingClientRect().width || 0,
        contentWidth: content?.getBoundingClientRect().width || 0,
        hasHorizontalScroll: document.body.scrollWidth > window.innerWidth
      });
    };

    updateLayoutInfo();
    window.addEventListener('resize', updateLayoutInfo);
    
    // Also update on sidebar changes
    const observer = new MutationObserver(updateLayoutInfo);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      window.removeEventListener('resize', updateLayoutInfo);
      observer.disconnect();
    };
  }, []);

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-64 opacity-90 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Layout Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-xs">
        <div>Window: {layoutInfo.windowWidth}x{layoutInfo.windowHeight}</div>
        <div>Sidebar: {layoutInfo.sidebarWidth}px</div>
        <div>Content: {layoutInfo.contentWidth}px</div>
        <div>Available: {layoutInfo.windowWidth - layoutInfo.sidebarWidth}px</div>
        <div className={layoutInfo.hasHorizontalScroll ? "text-red-500" : "text-green-500"}>
          H-Scroll: {layoutInfo.hasHorizontalScroll ? "YES ⚠️" : "NO ✅"}
        </div>
        <div className="text-xs text-muted-foreground pt-1">
          {layoutInfo.contentWidth > (layoutInfo.windowWidth - layoutInfo.sidebarWidth) ? 
            "⚠️ Content may be cut off" : 
            "✅ Layout looks good"}
        </div>
      </CardContent>
    </Card>
  );
} 