'use client';

import React, { useState } from 'react';
import { ArrowLeft, Columns, Layout, Grid, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ColumnLayoutSelector from '@/components/microlesson/ColumnLayoutSelector';
import ColumnEditor from '@/components/microlesson/ColumnEditor';
import { ColumnLayout, ColumnContent } from '@/types/microlesson/slide';

export default function ColumnLayoutEditorDemo() {
  const [currentLayout, setCurrentLayout] = useState<ColumnLayout>('2-equal');
  const [columns, setColumns] = useState<ColumnContent[]>([
    {
      id: 'column-0',
      blocks: [],
      content: '<h3>Top of Rack (ToR) Switches</h3><p>Connect servers within a rack to the broader network, typically at 10/25/100 Gbps speeds</p>'
    },
    {
      id: 'column-1', 
      blocks: [],
      content: '<h3>Core Routers & Switches</h3><p>High-capacity devices forming the network backbone, often with 40/100/400 Gbps interfaces</p>'
    }
  ]);

  const handleLayoutChange = (layout: ColumnLayout) => {
    setCurrentLayout(layout);
    
    // Initialize columns based on new layout
    const columnCount = getColumnCount(layout);
    const newColumns: ColumnContent[] = [];
    
    for (let i = 0; i < columnCount; i++) {
      if (columns[i]) {
        newColumns.push(columns[i]);
      } else {
        newColumns.push({
          id: `column-${i}`,
          blocks: [],
          content: ''
        });
      }
    }
    
    setColumns(newColumns);
  };

  const getColumnCount = (layout: ColumnLayout): number => {
    switch (layout) {
      case '2-equal':
      case '2-left':
      case '2-right':
        return 2;
      case '3-columns':
        return 3;
      case '4-columns':
        return 4;
      default:
        return 1;
    }
  };

  const handleColumnsChange = (newColumns: ColumnContent[]) => {
    setColumns(newColumns);
  };

  const features = [
    {
      icon: <Columns className="w-5 h-5" />,
      title: "Multiple Column Layouts",
      description: "Support for 2, 3, and 4 column layouts with different width ratios"
    },
    {
      icon: <Layout className="w-5 h-5" />,
      title: "Flexible Column Widths",
      description: "Choose between equal columns or weighted layouts (60/40, 40/60)"
    },
    {
      icon: <Grid className="w-5 h-5" />,
      title: "Block-Based Content",
      description: "Each column supports rich text editing with our block system"
    },
    {
      icon: <Edit className="w-5 h-5" />,
      title: "Inline Editing",
      description: "Click any column to edit content directly with our rich text editor"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <a 
            href="/demo" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Demos
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Column Layout Editor
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Interactive demo of the new column-based layout system that allows course creators to organize content 
            in multiple columns with flexible layouts and rich text editing capabilities.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Interface */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Column Layout Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Column Controls</CardTitle>
                <CardDescription>
                  Select different column layouts and edit content in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColumnLayoutSelector
                  currentLayout={currentLayout}
                  onLayoutChange={handleLayoutChange}
                />
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Current Selection</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{currentLayout}</Badge>
                      <span className="text-sm text-gray-600">
                        {currentLayout === 'none' && 'No columns'}
                        {currentLayout === '2-equal' && 'Two equal columns'}
                        {currentLayout === '2-left' && 'Left column wider'}
                        {currentLayout === '2-right' && 'Right column wider'}
                        {currentLayout === '3-columns' && 'Three equal columns'}
                        {currentLayout === '4-columns' && 'Four equal columns'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getColumnCount(currentLayout)} column{getColumnCount(currentLayout) > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Column Editor</CardTitle>
                <CardDescription>
                  Click any column to edit its content. Add blocks using the + button on hover.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-96 bg-slate-900 rounded-lg p-6">
                  {currentLayout === 'none' ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Columns className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select a column layout to get started</p>
                      </div>
                    </div>
                  ) : (
                    <ColumnEditor
                      layout={currentLayout}
                      columns={columns}
                      onColumnsChange={handleColumnsChange}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Column Layout Options</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>2 Equal:</strong> Two columns with equal width (50/50)</li>
                      <li>• <strong>2 Left:</strong> Left column wider (60/40)</li>
                      <li>• <strong>2 Right:</strong> Right column wider (40/60)</li>
                      <li>• <strong>3 Columns:</strong> Three equal columns (33.33/33.33/33.33)</li>
                      <li>• <strong>4 Columns:</strong> Four equal columns (25/25/25/25)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Rich text editing with TipTap editor</li>
                      <li>• Block-based content organization</li>
                      <li>• Drag and drop support (coming soon)</li>
                      <li>• Responsive design for all screen sizes</li>
                      <li>• Integration with existing slide system</li>
                      <li>• Real-time preview and editing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 