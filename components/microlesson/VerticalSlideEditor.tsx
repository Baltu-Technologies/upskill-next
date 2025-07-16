'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SlideType } from '@/types/microlesson/slide';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Trash2, 
  Copy,
  Settings,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Palette,
  Type,
  Image,
  Play,
  HelpCircle,
  GripVertical,
  Layers,
  X
} from 'lucide-react';
import EditableSlideRenderer from './EditableSlideRenderer';
import TableAsColumns from './TableAsColumnsExtension';

// New imports for enhanced components
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useIntersection } from 'react-use';
import { HexColorPicker } from 'react-colorful';
import useMeasure from 'react-use-measure';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

// Slide type definitions with icons
const SLIDE_TYPES = [
  { type: 'TitleSlide', label: 'Title', icon: <Type className="w-4 h-4" /> },
  { type: 'TitleWithSubtext', label: 'Content', icon: <HelpCircle className="w-4 h-4" /> },
  { type: 'TitleWithImage', label: 'Image', icon: <Image className="w-4 h-4" /> },
  { type: 'VideoSlide', label: 'Video', icon: <Play className="w-4 h-4" /> },
  { type: 'QuickCheckSlide', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
  { type: 'CustomHTMLSlide', label: 'Custom', icon: <Layers className="w-4 h-4" /> },
];

// Card layout options - updated to match requirements
const CARD_LAYOUT_OPTIONS = [
  { value: 'none', label: 'No Layout', icon: <div className="w-5 h-5 border border-slate-400 rounded bg-slate-100"></div> },
  { value: 'top', label: 'Image Top', icon: <div className="w-5 h-5 border border-slate-400 rounded flex flex-col"><div className="w-full h-2 bg-slate-400"></div><div className="w-full h-3 bg-slate-100"></div></div> },
  { value: 'left', label: 'Image Left', icon: <div className="w-5 h-5 border border-slate-400 rounded flex"><div className="w-2 h-full bg-slate-400"></div><div className="w-3 h-full bg-slate-100"></div></div> },
  { value: 'right', label: 'Image Right', icon: <div className="w-5 h-5 border border-slate-400 rounded flex"><div className="w-3 h-full bg-slate-100"></div><div className="w-2 h-full bg-slate-400"></div></div> },
  { value: 'background', label: 'Full Image', icon: <div className="w-5 h-5 bg-slate-400 rounded border border-slate-400"></div> },
];

// Color options for slide backgrounds - both solid and gradient
const COLOR_OPTIONS = [
  // Solid colors
  { value: '#0F172A', label: 'Default Dark', preview: '#0F172A', type: 'solid' },
  { value: '#ffffff', label: 'White', preview: '#ffffff', type: 'solid' },
  { value: '#f3f4f6', label: 'Light Gray', preview: '#f3f4f6', type: 'solid' },
  { value: '#1f2937', label: 'Dark Gray', preview: '#1f2937', type: 'solid' },
  { value: '#111827', label: 'Very Dark', preview: '#111827', type: 'solid' },
  { value: '#3b82f6', label: 'Blue', preview: '#3b82f6', type: 'solid' },
  { value: '#8b5cf6', label: 'Purple', preview: '#8b5cf6', type: 'solid' },
  { value: '#10b981', label: 'Green', preview: '#10b981', type: 'solid' },
  { value: '#ef4444', label: 'Red', preview: '#ef4444', type: 'solid' },
  { value: '#f59e0b', label: 'Orange', preview: '#f59e0b', type: 'solid' },
  { value: '#06b6d4', label: 'Cyan', preview: '#06b6d4', type: 'solid' },
  { value: '#84cc16', label: 'Lime', preview: '#84cc16', type: 'solid' },
  { value: '#ec4899', label: 'Pink', preview: '#ec4899', type: 'solid' },
  
  // Gradient colors - including more darker options
  { value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', label: 'Deep Blue', preview: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', label: 'Dark Purple', preview: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #232526 0%, #414345 100%)', label: 'Dark Gray', preview: 'linear-gradient(135deg, #232526 0%, #414345 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)', label: 'Pure Black', preview: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', label: 'Midnight', preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #2c1810 0%, #3e2723 100%)', label: 'Dark Brown', preview: 'linear-gradient(135deg, #2c1810 0%, #3e2723 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', label: 'Steel Blue', preview: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)', label: 'Dark Teal', preview: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #1f4037 0%, #99f2cc 100%)', label: 'Forest Green', preview: 'linear-gradient(135deg, #1f4037 0%, #99f2cc 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Blue Purple', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Pink Red', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Blue Cyan', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'Green Cyan', preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', label: 'Pink Yellow', preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', label: 'Mint Pink', preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', label: 'Peach', preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', label: 'Purple Pink', preview: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', label: 'Sunset', preview: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', label: 'Ocean', preview: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', type: 'gradient' },
  { value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', label: 'Warm', preview: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', type: 'gradient' },
];

interface VerticalSlideEditorProps {
  slides: SlideType[];
  onSlideChange: (index: number, slide: SlideType) => void;
  onAddSlide: (type: string, afterIndex?: number) => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
}

// Helper function to get slide display information
function getSlideDisplayInfo(slide: SlideType) {
  const slideTypeInfo = SLIDE_TYPES.find(st => st.type === slide.type) || SLIDE_TYPES[0];
  
  let title: string | undefined;
  let subtitle: string | undefined;
  
  if ('title' in slide) {
    title = slide.title;
  }
  
  if ('subtext' in slide) {
    subtitle = slide.subtext;
  } else if ('content' in slide) {
    subtitle = slide.content;
  }
  
  return {
    title,
    content: subtitle, // Keep for backward compatibility
    subtitle,
    type: slideTypeInfo.label,
    icon: slideTypeInfo.icon
  };
}

// Slide settings dropdown component
function SlideSettingsDropdown({ 
  slide, 
  onSlideChange 
}: { 
  slide: SlideType; 
  onSlideChange: (slide: SlideType) => void; 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSlideTypePicker, setShowSlideTypePicker] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showColumnLayoutPicker, setShowColumnLayoutPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleTypeChange = (newType: string) => {
    // Close all pickers when changing slide type
    setShowColorPicker(false);
    setShowSlideTypePicker(false);
    setShowLayoutPicker(false);
    setShowColumnLayoutPicker(false);
    
    // Create a new slide with the minimum required properties for the new type
    const baseSlide = {
      id: slide.id,
      type: newType as SlideType['type'],
      backgroundColor: slide.backgroundColor,
      duration: slide.duration,
    };

    // Add type-specific properties
    let newSlide: SlideType;
    switch (newType) {
      case 'TitleSlide':
        newSlide = {
          ...baseSlide,
          type: 'TitleSlide',
          title: 'title' in slide ? slide.title || 'New Title' : 'New Title',
        };
        break;
      case 'TitleWithSubtext':
        newSlide = {
          ...baseSlide,
          type: 'TitleWithSubtext',
          title: 'title' in slide ? slide.title || 'New Title' : 'New Title',
          subtext: 'subtext' in slide ? slide.subtext || 'New subtext' : 'New subtext',
        };
        break;
      case 'TitleWithImage':
        newSlide = {
          ...baseSlide,
          type: 'TitleWithImage',
          title: 'title' in slide ? slide.title || 'New Title' : 'New Title',
          imageUrl: 'imageUrl' in slide ? slide.imageUrl || '' : '',
          imagePosition: 'imagePosition' in slide ? slide.imagePosition || 'left' : 'left',
          imageLayout: 'imageLayout' in slide ? slide.imageLayout || 'none' : 'none',
        };
        break;
      case 'VideoSlide':
        newSlide = {
          ...baseSlide,
          type: 'VideoSlide',
          title: 'title' in slide ? slide.title || 'New Title' : 'New Title',
          videoUrl: 'videoUrl' in slide ? slide.videoUrl || '' : '',
        };
        break;
      case 'QuickCheckSlide':
        newSlide = {
          ...baseSlide,
          type: 'QuickCheckSlide',
          question: 'question' in slide ? slide.question || 'New Question?' : 'New Question?',
          options: 'options' in slide ? slide.options || ['Option 1', 'Option 2'] : ['Option 1', 'Option 2'],
          correctAnswer: 'correctAnswer' in slide ? slide.correctAnswer || 0 : 0,
        };
        break;
      case 'CustomHTMLSlide':
        newSlide = {
          ...baseSlide,
          type: 'CustomHTMLSlide',
          rawHtml: 'rawHtml' in slide ? slide.rawHtml || 'Custom HTML content' : 'Custom HTML content',
        };
        break;
      default:
        newSlide = slide;
    }

    onSlideChange(newSlide);
  };

  const handleLayoutChange = (layout: string) => {
    // Close all pickers when changing layout
    setShowColorPicker(false);
    setShowSlideTypePicker(false);
    setShowLayoutPicker(false);
    setShowColumnLayoutPicker(false);
    
    // If we're setting a layout other than 'none' on a non-image slide, convert it
    let newSlide = { ...slide };
    
    if (layout !== 'none' && slide.type !== 'TitleWithImage') {
      // Convert to TitleWithImage to support image layouts
      const title = ('title' in slide) ? slide.title : 'Slide Title';
      newSlide = {
        ...slide,
        type: 'TitleWithImage',
        imageLayout: layout as 'none' | 'top' | 'left' | 'right' | 'bottom' | 'background',
        imageUrl: (slide as any).imageUrl || '', // Use existing image or empty string
        title: title
      } as any;
    } else {
      // Just update the layout
      newSlide = { 
        ...slide, 
        imageLayout: layout as 'none' | 'top' | 'left' | 'right' | 'bottom' | 'background'
      };
    }
    
    onSlideChange(newSlide);
  };

  const handleBackgroundColorChange = (color: string) => {
    // Close all pickers when changing background color
    setShowColorPicker(false);
    setShowSlideTypePicker(false);
    setShowLayoutPicker(false);
    setShowColumnLayoutPicker(false);
    
    const newSlide = { ...slide, backgroundColor: color };
    onSlideChange(newSlide);
  };

  const handleColumnLayoutChange = (layout: string) => {
    // Close all pickers when changing column layout
    setShowColorPicker(false);
    setShowSlideTypePicker(false);
    setShowLayoutPicker(false);
    setShowColumnLayoutPicker(false);
    
    // Check if it's a table-based column layout
    if (layout.startsWith('table-')) {
      // Enable table-based columns
      const newSlide = { ...slide, tableContent: '' };
      onSlideChange(newSlide);
    } else {
      // Handle other layouts or disable table mode
      const newSlide = { ...slide };
      delete (newSlide as any).tableContent;
      onSlideChange(newSlide);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Update slide with new image URL
      if ('imageUrl' in slide) {
        const newSlide = { ...slide, imageUrl: data.imageUrl };
        onSlideChange(newSlide);
      }
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const currentLayout = slide.imageLayout || 'none';
  const hasImage = 'imageUrl' in slide && slide.imageUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 bg-slate-800 border-slate-600 p-4 space-y-4"
      >
        <DropdownMenuLabel className="text-slate-200 font-medium px-0 pb-2">
          Slide Settings
        </DropdownMenuLabel>
        
                 {/* Slide Type Section */}
         <div className="space-y-2">
           <Label className="text-sm font-medium text-slate-300">Slide Type</Label>
           
           {/* Slide Type Picker Button */}
           <Button
             variant="outline"
             size="sm"
             onClick={() => setShowSlideTypePicker(!showSlideTypePicker)}
             className="w-full justify-between h-10 text-slate-300 border-slate-600 hover:bg-slate-700"
           >
             <div className="flex items-center gap-2">
               {SLIDE_TYPES.find(st => st.type === slide.type)?.icon}
               <span className="text-xs">
                 {SLIDE_TYPES.find(st => st.type === slide.type)?.label || 'Unknown'}
               </span>
             </div>
             <ChevronDown className={`h-4 w-4 transition-transform ${showSlideTypePicker ? 'rotate-180' : ''}`} />
           </Button>

           {/* Expandable Slide Type Options */}
           {showSlideTypePicker && (
             <div className="space-y-2 border border-slate-600 rounded-lg p-3 bg-slate-700/30">
               <div className="grid grid-cols-2 gap-2">
                 {SLIDE_TYPES.map((slideType) => (
                   <Button
                     key={slideType.type}
                     variant={slide.type === slideType.type ? "default" : "outline"}
                     size="sm"
                     onClick={() => handleTypeChange(slideType.type)}
                     className="justify-start h-8 text-xs"
                   >
                     {slideType.icon}
                     <span className="ml-2">{slideType.label}</span>
                   </Button>
                 ))}
               </div>
             </div>
           )}
         </div>

                 {/* Card Layout Section */}
         <div className="space-y-2">
           <Label className="text-sm font-medium text-slate-300">Card Layout</Label>
           
           {/* Layout Picker Button */}
           <Button
             variant="outline"
             size="sm"
             onClick={() => setShowLayoutPicker(!showLayoutPicker)}
             className="w-full justify-between h-10 text-slate-300 border-slate-600 hover:bg-slate-700"
           >
             <div className="flex items-center gap-2">
               {CARD_LAYOUT_OPTIONS.find(lo => lo.value === currentLayout)?.icon}
               <span className="text-xs">
                 {CARD_LAYOUT_OPTIONS.find(lo => lo.value === currentLayout)?.label || 'Unknown'}
               </span>
             </div>
             <ChevronDown className={`h-4 w-4 transition-transform ${showLayoutPicker ? 'rotate-180' : ''}`} />
           </Button>

           {/* Expandable Layout Options */}
           {showLayoutPicker && (
             <div className="space-y-2 border border-slate-600 rounded-lg p-3 bg-slate-700/30">
               <div className="flex gap-2 justify-center">
                 {CARD_LAYOUT_OPTIONS.map((layout) => (
                   <button
                     key={layout.value}
                     onClick={() => handleLayoutChange(layout.value)}
                     className={`p-2 rounded border-2 transition-all hover:scale-110 ${
                       currentLayout === layout.value 
                         ? 'border-blue-400 bg-blue-500/20' 
                         : 'border-slate-600 hover:border-slate-400'
                     }`}
                     title={layout.label}
                   >
                     {layout.icon}
                   </button>
                 ))}
               </div>
             </div>
           )}
         </div>

         {/* Column Layout Section */}
         <div className="space-y-2">
           <Label className="text-sm font-medium text-slate-300">Column Layout</Label>
           
           {/* Column Layout Picker Button */}
           <Button
             variant="outline"
             size="sm"
             onClick={() => setShowColumnLayoutPicker(!showColumnLayoutPicker)}
             className="w-full justify-between h-10 text-slate-300 border-slate-600 hover:bg-slate-700"
           >
             <div className="flex items-center gap-2">
               <span className="text-xs">Table-based Columns</span>
             </div>
             <ChevronDown className={`h-4 w-4 transition-transform ${showColumnLayoutPicker ? 'rotate-180' : ''}`} />
           </Button>

           {/* Expandable Column Layout Options */}
           {showColumnLayoutPicker && (
             <div className="space-y-2 border border-slate-600 rounded-lg p-3 bg-slate-700/30">
               <TableAsColumns
                 onLayoutChange={handleColumnLayoutChange}
                 className="text-slate-300"
               />
             </div>
           )}
         </div>

         {/* Card Color Section */}
         <div className="space-y-2">
           <Label className="text-sm font-medium text-slate-300">Card Color</Label>
           
           {/* Color Picker Button */}
           <Button
             variant="outline"
             size="sm"
             onClick={() => setShowColorPicker(!showColorPicker)}
             className="w-full justify-between h-10 text-slate-300 border-slate-600 hover:bg-slate-700"
           >
                           <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-slate-500"
                  style={{ 
                    background: slide.backgroundColor || '#0F172A'
                  }}
                />
                <span className="text-xs">
                  {COLOR_OPTIONS.find(c => c.value === slide.backgroundColor)?.label || 'Custom'}
                </span>
              </div>
             <ChevronDown className={`h-4 w-4 transition-transform ${showColorPicker ? 'rotate-180' : ''}`} />
           </Button>

           {/* Expandable Color Options */}
           {showColorPicker && (
             <div className="max-h-80 overflow-y-auto border border-slate-600 rounded-lg p-3 bg-slate-700/30 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
               <div className="space-y-3">
                 {/* Solid Colors */}
                 <div className="space-y-2">
                   <Label className="text-xs text-slate-400">Solid Colors</Label>
                   <div className="grid grid-cols-6 gap-2">
                     {COLOR_OPTIONS.filter(color => color.type === 'solid').map((colorOption) => (
                       <button
                         key={colorOption.value}
                         className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                           slide.backgroundColor === colorOption.value 
                             ? 'border-blue-400 ring-2 ring-blue-400/50' 
                             : 'border-slate-600 hover:border-slate-400'
                         }`}
                         style={{ backgroundColor: colorOption.preview }}
                         onClick={() => handleBackgroundColorChange(colorOption.value)}
                         title={colorOption.label}
                       />
                     ))}
                   </div>
                 </div>

                 {/* Gradient Colors */}
                 <div className="space-y-2">
                   <Label className="text-xs text-slate-400">Gradient Colors</Label>
                   <div className="grid grid-cols-4 gap-2">
                     {COLOR_OPTIONS.filter(color => color.type === 'gradient').map((colorOption) => (
                       <button
                         key={colorOption.value}
                         className={`w-full h-8 rounded border-2 transition-all hover:scale-105 ${
                           slide.backgroundColor === colorOption.value 
                             ? 'border-blue-400 ring-2 ring-blue-400/50' 
                             : 'border-slate-600 hover:border-slate-400'
                         }`}
                         style={{ background: colorOption.preview }}
                         onClick={() => handleBackgroundColorChange(colorOption.value)}
                         title={colorOption.label}
                       />
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>

         {/* Image Upload Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-300">Highlight Image</Label>
            {hasImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if ('imageUrl' in slide) {
                    const newSlide = { ...slide, imageUrl: '' };
                    onSlideChange(newSlide);
                  }
                }}
                className="h-6 px-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Remove
              </Button>
            )}
          </div>
          
          <div className="relative">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="bg-slate-700 border-slate-600 text-slate-200 file:bg-slate-600 file:text-slate-200 file:border-slate-500"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-slate-700/50 flex items-center justify-center rounded">
                <div className="text-xs text-slate-300">Uploading...</div>
              </div>
            )}
          </div>
          
          {hasImage && (
            <div className="mt-2">
              <img 
                src={slide.imageUrl} 
                alt="Slide preview" 
                className="w-full h-20 object-cover rounded border border-slate-600"
              />
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Custom color picker modal component
function ColorPickerModal({ 
  isOpen, 
  onClose, 
  color, 
  onColorChange 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  color: string; 
  onColorChange: (color: string) => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Pick a Color</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <HexColorPicker color={color} onChange={onColorChange} />
          
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded border border-slate-600" 
              style={{ backgroundColor: color }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="flex-1 bg-slate-700 text-slate-200 px-3 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide settings modal component - REMOVED (keeping for now for comparison)
function SlideSettingsModal({ 
  isOpen, 
  onClose, 
  slide, 
  onSlideChange 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  slide: SlideType; 
  onSlideChange: (slide: SlideType) => void; 
}) {
  // This component is now replaced by SlideSettingsDropdown
  return null;
}

// Sortable slide item component
function SortableSlideItem({ 
  id, 
  slide, 
  index, 
  displayInfo, 
  isActive, 
  onSlideClick, 
  onAddSlide, 
  onDeleteSlide, 
  onDuplicateSlide 
}: { 
  id: string; 
  slide: SlideType; 
  index: number; 
  displayInfo: ReturnType<typeof getSlideDisplayInfo>;
  isActive: boolean; 
  onSlideClick: (index: number) => void; 
  onAddSlide: (type: string, afterIndex?: number) => void; 
  onDeleteSlide: (index: number) => void; 
  onDuplicateSlide: (index: number) => void; 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-1.5 rounded-md border transition-all duration-200 ${
        isActive 
          ? 'border-blue-500/50 bg-blue-500/10' 
          : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
      }`}
    >
      <div className="p-1.5">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-slate-600/50 rounded"
          >
            <GripVertical className="h-3 w-3 text-slate-400" />
          </div>
          <div className="h-3 w-3 text-slate-300 flex-shrink-0">
            {displayInfo.icon}
          </div>
          <div className="flex-1 min-w-0 min-h-[2rem] flex items-center">
            <button
              onClick={() => onSlideClick(index)}
              className="text-left w-full h-full flex flex-col justify-center py-1"
            >
              <div className="text-xs font-medium text-slate-200 truncate leading-tight">
                {displayInfo.title || `Slide ${index + 1}`}
              </div>
              <div className="text-xs text-slate-400 truncate leading-tight">
                {displayInfo.subtitle || displayInfo.type}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Collapsible floating slide navigator (Flimstrip style)
function FloatingSlideNavigator({ 
  slides, 
  currentSlideIndex, 
  onSlideClick,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide
}: {
  slides: SlideType[];
  currentSlideIndex: number;
  onSlideClick: (index: number) => void;
  onAddSlide: (type: string, afterIndex?: number) => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((_, index) => `slide-${index}` === active.id);
      const newIndex = slides.findIndex((_, index) => `slide-${index}` === over.id);
      onMoveSlide(oldIndex, newIndex);
    }
  }

  // Collapsed state - small icon on the left
  if (!isExpanded) {
    return (
      <div
        className="fixed left-1 top-1/2 -translate-y-1/2 z-50"
        style={{ zIndex: 1000 }}
      >
        <Button
          onClick={() => setIsExpanded(true)}
          variant="ghost"
          size="sm"
          className="h-12 w-8 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/50 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Button>
      </div>
    );
  }

  // Expanded state - full slide navigator
  return (
    <div
      className="fixed left-1 top-1/2 -translate-y-1/2 z-50"
      style={{ zIndex: 1000 }}
    >
      <div
        className="bg-slate-800/95 border border-slate-600/50 rounded-lg shadow-2xl backdrop-blur-sm max-h-[80vh] w-64 overflow-hidden animate-in slide-in-from-left-3 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-600/50">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-200">Slides</span>
          </div>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-slate-700/50"
          >
            <ChevronLeft className="h-4 w-4 text-slate-400" />
          </Button>
        </div>

        {/* Slides List */}
        <div className="p-2 max-h-[calc(80vh-60px)] overflow-y-auto custom-scrollbar">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={slides.map((_, index) => `slide-${index}`)} strategy={verticalListSortingStrategy}>
              {slides.map((slide, index) => {
                const displayInfo = getSlideDisplayInfo(slide);
                return (
                  <SortableSlideItem
                    key={`slide-${index}`}
                    id={`slide-${index}`}
                    slide={slide}
                    index={index}
                    displayInfo={displayInfo}
                    isActive={index === currentSlideIndex}
                    onSlideClick={onSlideClick}
                    onAddSlide={onAddSlide}
                    onDeleteSlide={onDeleteSlide}
                    onDuplicateSlide={onDuplicateSlide}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>

        {/* Add Slide Button */}
        <div className="p-2 border-t border-slate-600/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-600/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Slide
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-600">
              <DropdownMenuLabel className="text-slate-300 font-medium">Slide Type</DropdownMenuLabel>
              <div className="px-2 py-1 flex flex-col gap-1">
                {SLIDE_TYPES.map((slideType) => (
                  <Button
                    key={slideType.type}
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddSlide(slideType.type)}
                    className="w-full justify-start h-8 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  >
                    {slideType.icon}
                    <span className="ml-2">{slideType.label}</span>
                  </Button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default function VerticalSlideEditor({ 
  slides, 
  onSlideChange, 
  onAddSlide, 
  onDeleteSlide, 
  onDuplicateSlide, 
  onMoveSlide 
}: VerticalSlideEditorProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Prevent body scrolling to avoid double scrollbar
  useEffect(() => {
    // Store original overflow styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Restore original overflow styles on cleanup
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // Scroll-based tracking for active slide
  useEffect(() => {
    const handleScroll = () => {
      const slideElements = slideRefs.current;
      const viewportHeight = window.innerHeight;
      
      for (let i = 0; i < slideElements.length; i++) {
        const element = slideElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          
          if (rect.top < viewportHeight / 2 && rect.bottom > viewportHeight / 2) {
            setCurrentSlideIndex(i);
            break;
          }
        }
      }
    };

    const container = slideRefs.current[0]; // Assuming the first slide is the container for scroll
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [slides.length]);



  const handleSlideSelect = (index: number) => {
    setCurrentSlideIndex(index);
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSlideSettingsChange = (index: number) => (slide: SlideType) => {
    onSlideChange(index, slide);
  };

  const handleSlideChange = useCallback((field: string, value: any) => {
    const updatedSlide = { ...slides[currentSlideIndex], [field]: value };
    onSlideChange(currentSlideIndex, updatedSlide);
  }, [slides, currentSlideIndex, onSlideChange]);

  const handleColorChange = useCallback((color: string) => {
    handleSlideChange('backgroundColor', color);
  }, [handleSlideChange]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200">
      {/* Floating slide navigator */}
      <FloatingSlideNavigator
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onSlideClick={handleSlideSelect}
        onAddSlide={onAddSlide}
        onDeleteSlide={onDeleteSlide}
        onDuplicateSlide={onDuplicateSlide}
        onMoveSlide={onMoveSlide}
      />

      {/* Main content area */}
      <div className="h-full">
        {/* Slide content area */}
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="py-8 px-4">
            {slides.map((slide, index) => (
              <div
                key={`slide-${index}`}
                ref={(el) => { slideRefs.current[index] = el; }}
                className={`mb-8 transition-all duration-300 max-w-4xl mx-auto ${
                  index === currentSlideIndex ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">
                      Slide {index + 1}
                    </span>
                    <div className="h-4 w-px bg-slate-600" />
                    <span className="text-slate-300 text-sm">
                      {getSlideDisplayInfo(slide).type}
                    </span>
                  </div>
                  
                  {/* Settings button */}
                  <SlideSettingsDropdown
                    slide={slide}
                    onSlideChange={handleSlideSettingsChange(index)}
                  />
                </div>

                {/* Slide Content */}
                <Card className="bg-slate-800/50 border-slate-700/50 shadow-xl">
                  <CardContent className="p-0">
                    <div 
                      className="relative overflow-hidden w-full"
                      style={{
                        aspectRatio: '16/9',
                      }}
                    >
                      {/* Use EditableSlideRenderer for real-time editing */}
                      <EditableSlideRenderer
                        slide={slide}
                        onSlideChange={(updatedSlide) => onSlideChange(index, updatedSlide)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
} 