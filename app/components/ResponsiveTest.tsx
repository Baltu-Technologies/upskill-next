'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ResponsiveTest = () => {
  return (
    <div className="space-y-6">
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

      {/* Layout Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Layout Information</h3>
        <div className="bg-card p-4 rounded-lg border space-y-2">
          <div className="text-xs space-y-1">
            <p><strong>Layout:</strong> Using PersistentLayout</p>
            <p><strong>Navigation:</strong> Responsive sidebar + bottom nav</p>
            <p><strong>Mobile:</strong> Bottom navigation only</p>
            <p><strong>Desktop:</strong> Sidebar navigation only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest; 