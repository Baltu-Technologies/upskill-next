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

// Image layout options with custom SVG icons
const IMAGE_LAYOUT_OPTIONS = [
  { value: 'none', label: 'None', icon: <div className="w-5 h-5 border border-slate-400 rounded"></div> },
  { value: 'background', label: 'Background', icon: <div className="w-5 h-5 bg-slate-400 rounded"></div> },
  { value: 'left', label: 'Left', icon: <div className="w-5 h-5 border border-slate-400 rounded flex"><div className="w-2 h-full bg-slate-400"></div></div> },
  { value: 'right', label: 'Right', icon: <div className="w-5 h-5 border border-slate-400 rounded flex"><div className="w-3 h-full"></div><div className="w-2 h-full bg-slate-400"></div></div> },
  { value: 'bottom', label: 'Bottom', icon: <div className="w-5 h-5 border border-slate-400 rounded flex flex-col"><div className="w-full h-3"></div><div className="w-full h-2 bg-slate-400"></div></div> },
  { value: 'top', label: 'Top', icon: <div className="w-5 h-5 border border-slate-400 rounded flex flex-col"><div className="w-full h-2 bg-slate-400"></div></div> },
];

// Color options for slide backgrounds
const COLOR_OPTIONS = [
  { value: 'bg-white', label: 'White', preview: '#ffffff' },
  { value: 'bg-gray-100', label: 'Light Gray', preview: '#f3f4f6' },
  { value: 'bg-gray-800', label: 'Dark', preview: '#1f2937' },
  { value: 'bg-gray-900', label: 'Very Dark', preview: '#111827' },
  { value: 'bg-blue-500', label: 'Blue', preview: '#3b82f6' },
  { value: 'bg-purple-500', label: 'Purple', preview: '#8b5cf6' },
  { value: 'bg-green-500', label: 'Green', preview: '#10b981' },
  { value: 'bg-red-500', label: 'Red', preview: '#ef4444' },
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

// Slide settings modal component
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
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!isOpen) return null;

  const handleTypeChange = (newType: string) => {
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

  const handleBackgroundColorChange = (color: string) => {
    const newSlide = { ...slide, backgroundColor: color };
    onSlideChange(newSlide);
  };

  const handleLayoutChange = (layout: string) => {
    if ('imageLayout' in slide) {
      const newSlide = { 
        ...slide, 
        imageLayout: layout as 'none' | 'top' | 'left' | 'right' | 'bottom' | 'background'
      };
      onSlideChange(newSlide);
    }
  };

  const currentLayout = ('imageLayout' in slide) ? slide.imageLayout : 'none';

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Slide Settings</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Slide Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Slide Type</label>
              <div className="grid grid-cols-2 gap-2">
                {SLIDE_TYPES.map((slideType) => (
                  <Button
                    key={slideType.type}
                    variant={slide.type === slideType.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTypeChange(slideType.type)}
                    className="justify-start"
                  >
                    {slideType.icon}
                    <span className="ml-2 text-xs">{slideType.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Background Color</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
                  style={{ backgroundColor: slide.backgroundColor || '#1e293b' }}
                  onClick={() => setShowColorPicker(true)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColorPicker(true)}
                  className="flex-1"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Pick Color
                </Button>
              </div>
              
              {/* Preset Colors */}
              <div className="grid grid-cols-8 gap-1 mt-2">
                {COLOR_OPTIONS.slice(0, 16).map((colorOption) => (
                  <button
                    key={colorOption.value}
                    className="w-6 h-6 rounded border border-slate-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: colorOption.preview }}
                    onClick={() => handleBackgroundColorChange(colorOption.preview)}
                    title={colorOption.label}
                  />
                ))}
              </div>
            </div>

            {/* Image Layout (only for slides with images) */}
            {('imageLayout' in slide) && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Image Layout</label>
                <div className="grid grid-cols-3 gap-2">
                  {IMAGE_LAYOUT_OPTIONS.map((layout) => (
                    <Button
                      key={layout.value}
                      variant={currentLayout === layout.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLayoutChange(layout.value)}
                      className="justify-start"
                    >
                      {layout.icon}
                      <span className="ml-2 text-xs">{layout.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        color={slide.backgroundColor || '#1e293b'}
        onColorChange={handleBackgroundColorChange}
      />
    </>
  );
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
  const [settingsSlideIndex, setSettingsSlideIndex] = useState<number | null>(null);
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

  const handleSlideSettingsOpen = (index: number) => {
    setSettingsSlideIndex(index);
  };

  const handleSlideSettingsClose = () => {
    setSettingsSlideIndex(null);
  };

  const handleSlideSettingsChange = (slide: SlideType) => {
    if (settingsSlideIndex !== null) {
      onSlideChange(settingsSlideIndex, slide);
    }
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSlideSettingsOpen(index)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {/* Slide Content */}
                <Card className="bg-slate-800/50 border-slate-700/50 shadow-xl">
                  <CardContent className="p-0">
                    <div 
                      className="relative overflow-hidden w-full"
                      style={{
                        aspectRatio: '16/9',
                        backgroundColor: slide.backgroundColor || '#1e293b'
                      }}
                    >
                      {/* Slide content based on type */}
                      {slide.type === 'TitleSlide' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h1 className="text-4xl font-bold text-white text-center px-8">
                            {slide.title || 'Slide Title'}
                          </h1>
                        </div>
                      )}

                      {slide.type === 'TitleWithSubtext' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                          <h1 className="text-4xl font-bold text-white mb-4">
                            {slide.title || 'Slide Title'}
                          </h1>
                          <p className="text-xl text-slate-300">
                            {slide.subtext || 'Slide subtext'}
                          </p>
                        </div>
                      )}

                      {slide.type === 'TitleWithImage' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-4">
                              {slide.title || 'Slide Title'}
                            </h1>
                            {slide.imageUrl && (
                              <img 
                                src={slide.imageUrl} 
                                alt="Slide" 
                                className="max-h-64 mx-auto rounded-lg shadow-lg"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {slide.type === 'VideoSlide' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-4">
                              {slide.title || 'Video Title'}
                            </h1>
                            <div className="bg-black/50 p-8 rounded-lg">
                              <Play className="h-16 w-16 text-white mx-auto" />
                              <p className="text-slate-300 mt-2">Video Content</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {slide.type === 'QuickCheckSlide' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-4">
                              {slide.question || 'Question'}
                            </h1>
                            <div className="space-y-2">
                              {slide.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="bg-slate-700/50 p-2 rounded">
                                  {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {slide.type === 'CustomHTMLSlide' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-4">
                              Custom HTML
                            </h1>
                            <div className="bg-slate-700/50 p-4 rounded-lg">
                              <p className="text-slate-300">{slide.rawHtml || 'Custom HTML Content'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide settings modal */}
      {settingsSlideIndex !== null && (
        <SlideSettingsModal
          isOpen={settingsSlideIndex !== null}
          onClose={handleSlideSettingsClose}
          slide={slides[settingsSlideIndex]}
          onSlideChange={handleSlideSettingsChange}
        />
      )}
    </div>
  );
} 