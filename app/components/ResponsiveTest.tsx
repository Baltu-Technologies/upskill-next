'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleSidebar from './CollapsibleSidebar';
import { cn } from '@/lib/utils';

const ResponsiveTest = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  const screenSizes = [
    { name: 'mobile', width: '375px', label: 'Mobile (375px)' },
    { name: 'tablet', width: '768px', label: 'Tablet (768px)' },
    { name: 'desktop', width: '1024px', label: 'Desktop (1024px)' },
    { name: 'large', width: '1440px', label: 'Large (1440px)' },
  ];

  const currentSize = screenSizes.find(size => size.name === screenSize);

  return (
    <div className="min-h-screen bg-background">
      {/* Screen Size Controls */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <div className="bg-card p-4 rounded-lg border space-y-2 min-w-48">
          <h3 className="text-sm font-semibold">Responsive Test</h3>
          
          <div className="space-y-2">
            {screenSizes.map((size) => (
              <Button
                key={size.name}
                variant={screenSize === size.name ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setScreenSize(size.name)}
              >
                {size.label}
              </Button>
            ))}
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Sidebar Controls</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
            </Button>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Current: {currentSize?.label}
            </p>
            <p className="text-xs text-muted-foreground">
              Sidebar: {isSidebarCollapsed ? 'Collapsed (64px)' : 
                screenSize === 'mobile' ? 'Expanded (288px)' : 'Expanded (320px)'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Container with dynamic width */}
      <div 
        className="mx-auto border-2 border-dashed border-primary/30 transition-all duration-300"
        style={{ 
          width: currentSize?.width || '100%',
          minHeight: '100vh'
        }}
      >
        <div className="flex h-full relative">
          {/* Desktop Sidebar */}
          <div className="hidden md:block shrink-0">
            <CollapsibleSidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {!isSidebarCollapsed && screenSize === 'mobile' && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
                onClick={() => setIsSidebarCollapsed(true)} 
              />
              <div className="absolute left-0 top-0 h-full">
                <CollapsibleSidebar 
                  isCollapsed={false} 
                  onToggle={() => setIsSidebarCollapsed(true)} 
                />
              </div>
            </div>
          )}
          
          {/* Main Content Area - this is where content might get cut off */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsSidebarCollapsed(false)}
                  >
                    ☰
                  </Button>
                  
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent md:hidden">
                    🚀 Upskill
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs bg-primary/10 px-2 py-1 rounded">
                    {screenSize.toUpperCase()}
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content - Test for overflow/cutoff */}
            <main className="flex-1 p-4 space-y-6 overflow-auto">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Content Area Test</h2>
                <p className="text-muted-foreground">
                  This content should never be cut off by the sidebar at any screen size.
                </p>
              </div>

              {/* Test Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <Card key={i} className="min-w-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm truncate">Test Card {i + 1}</CardTitle>
                      <CardDescription className="text-xs">
                        This card should be fully visible
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-2">
                        <div className="h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded" />
                        <p className="text-xs text-muted-foreground">
                          Content should not be cut off by sidebar overlap.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Long content test */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Horizontal Scroll Test</h3>
                <div className="bg-card p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-4">
                    This content block has very long text that should wrap properly and not be cut off:
                  </p>
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/20 rounded w-full" />
                    <div className="h-2 bg-primary/20 rounded w-3/4" />
                    <div className="h-2 bg-primary/20 rounded w-1/2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    All content should be accessible regardless of sidebar state. 
                    The layout should be responsive and prevent horizontal scrolling.
                  </p>
                </div>
              </div>

              {/* Overflow test */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Layout Information</h3>
                <div className="bg-card p-4 rounded-lg border space-y-2">
                  <div className="text-xs space-y-1">
                    <p><strong>Screen Size:</strong> {currentSize?.label}</p>
                    <p><strong>Container Width:</strong> {currentSize?.width}</p>
                    <p><strong>Sidebar State:</strong> {isSidebarCollapsed ? 'Collapsed (64px)' : 
                      screenSize === 'mobile' ? 'Expanded (288px)' : 'Expanded (320px)'}</p>
                    <p><strong>Available Content Width:</strong> {
                      screenSize === 'mobile' ? 'Full width (mobile)' :
                      `${parseInt(currentSize?.width || '0') - (isSidebarCollapsed ? 64 : (screenSize === 'mobile' ? 288 : 320))}px`
                    }</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest; 