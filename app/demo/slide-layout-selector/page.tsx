'use client';

import React, { useState } from 'react';
import { ArrowLeft, Image, Type, Layout, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImageLayoutSelector, { ImageLayout } from '@/components/microlesson/ImageLayoutSelector';
import { SlideType } from '@/types/microlesson/slide';

export default function SlideLayoutSelectorDemo() {
  const [currentLayout, setCurrentLayout] = useState<ImageLayout>('left');
  
  // Sample slide data
  const [sampleSlide, setSampleSlide] = useState<SlideType>({
    id: 'demo-slide-1',
    type: 'TitleWithSubtext',
    title: 'Introduction to Semiconductor Manufacturing',
    subtext: 'Essential processes and safety protocols',
    content: 'Learn the fundamental processes, safety protocols, and quality control measures essential for semiconductor manufacturing environments.',
    bullets: [
      'Clean room procedures and protocols',
      'Wafer handling and processing techniques',
      'Quality control testing methods',
      'Equipment maintenance and safety'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    imageLayout: 'left',
    imageCaption: 'Modern semiconductor cleanroom facility',
    backgroundColor: '#0F172A',
    duration: 60
  } as SlideType);

  const handleLayoutChange = (layout: ImageLayout) => {
    setCurrentLayout(layout);
    setSampleSlide(prev => ({
      ...prev,
      imageLayout: layout,
      imageUrl: layout === 'none' ? '' : (prev.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop')
    }));
  };

  const renderSlidePreview = () => {
    const slideWithSubtext = sampleSlide as any; // Type assertion for demo purposes
    
    const textContent = (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">{slideWithSubtext.title}</h2>
        <p className="text-lg text-gray-300">{slideWithSubtext.subtext}</p>
        <p className="text-gray-200">{slideWithSubtext.content}</p>
        {slideWithSubtext.bullets && (
          <ul className="list-disc list-inside text-gray-200 space-y-1">
            {slideWithSubtext.bullets.map((bullet: string, index: number) => (
              <li key={index} className="text-sm">{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    );

    const imageComponent = slideWithSubtext.imageUrl ? (
      <div className="relative">
        <img 
          src={slideWithSubtext.imageUrl} 
          alt={slideWithSubtext.imageCaption || 'Slide image'}
          className="w-full h-auto rounded-lg shadow-md"
        />
        {slideWithSubtext.imageCaption && (
          <div className="mt-2 text-xs text-gray-400 text-center">
            {slideWithSubtext.imageCaption}
          </div>
        )}
      </div>
    ) : (
      <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
        <Image className="w-8 h-8" />
      </div>
    );

    // Render based on layout
    switch (currentLayout) {
      case 'none':
        return textContent;
      
      case 'top':
        return (
          <div className="space-y-4">
            {imageComponent}
            {textContent}
          </div>
        );
      
      case 'left':
        return (
          <div className="flex gap-6">
            <div className="flex-1">
              {imageComponent}
            </div>
            <div className="flex-1">
              {textContent}
            </div>
          </div>
        );
      
      case 'right':
        return (
          <div className="flex gap-6">
            <div className="flex-1">
              {textContent}
            </div>
            <div className="flex-1">
              {imageComponent}
            </div>
          </div>
        );
      
      case 'bottom':
        return (
          <div className="space-y-4">
            {textContent}
            {imageComponent}
          </div>
        );
      
      case 'background':
        return (
          <div className="relative min-h-[300px] rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${slideWithSubtext.imageUrl})`,
                filter: 'brightness(0.3)'
              }}
            />
            <div className="relative z-10 p-6">
              {textContent}
            </div>
          </div>
        );
      
      default:
        return textContent;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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
            Slide Image Layout Selector
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Interactive demo of the new slide layout system that allows course creators to position images 
            in different layouts: top, left, right, bottom, background, or no image.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layout className="w-4 h-4" />
                6 Layout Options
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Choose from 6 different image positioning options for maximum flexibility
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Image className="w-4 h-4" />
                Visual Previews
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Card-style buttons with visual representations of each layout
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Type className="w-4 h-4" />
                Real-time Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              See changes instantly as you select different layout options
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Tesla-Inspired Design
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Clean, modern interface following Tesla design principles
            </CardContent>
          </Card>
        </div>

        {/* Demo Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Layout Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Layout Controls</CardTitle>
                <CardDescription>
                  Select different image layouts and see the changes in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageLayoutSelector
                  currentLayout={currentLayout}
                  onLayoutChange={handleLayoutChange}
                />
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Current Selection</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{currentLayout}</Badge>
                      <span className="text-sm text-gray-600">
                        {currentLayout === 'none' && 'Text only, no image'}
                        {currentLayout === 'top' && 'Image above text'}
                        {currentLayout === 'left' && 'Image on left side'}
                        {currentLayout === 'right' && 'Image on right side'}
                        {currentLayout === 'bottom' && 'Image below text'}
                        {currentLayout === 'background' && 'Image as background'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Slide Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Preview</CardTitle>
                <CardDescription>
                  See how your selected layout affects the slide appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="rounded-lg p-6 min-h-[400px] transition-all duration-300"
                  style={{
                    backgroundColor: sampleSlide.backgroundColor || '#0F172A'
                  }}
                >
                  {renderSlidePreview()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Details */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Implementation Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Layout Options</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>None:</strong> Text-only slide with no image</li>
                  <li>• <strong>Top:</strong> Image positioned above text content</li>
                  <li>• <strong>Left:</strong> Image on left, text on right (50/50 split)</li>
                  <li>• <strong>Right:</strong> Image on right, text on left (50/50 split)</li>
                  <li>• <strong>Bottom:</strong> Image positioned below text content</li>
                  <li>• <strong>Background:</strong> Image as background with text overlay</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">User Experience</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Visual card-style selector with icons</li>
                  <li>• Real-time preview updates</li>
                  <li>• Responsive design for all screen sizes</li>
                  <li>• Clean, intuitive interface</li>
                  <li>• Support for image captions</li>
                  <li>• Backward compatibility with existing slides</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h3 className="font-medium text-blue-900 mb-2">Technical Implementation</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Built with React and TypeScript for type safety</p>
            <p>• Uses Tailwind CSS for styling and responsive design</p>
            <p>• Integrated with existing slide editing workflow</p>
            <p>• Supports drag-and-drop image uploads</p>
            <p>• Extends existing slide type system</p>
          </div>
        </div>
      </div>
    </div>
  );
} 