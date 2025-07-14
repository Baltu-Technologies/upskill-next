'use client';

import React, { useState, useRef } from 'react';
import { SlideType } from '@/types/microlesson/slide';
import RichTextToolbar from './RichTextToolbar';

interface EditableSlideRendererProps {
  slide: SlideType;
  onSlideChange: (updatedSlide: SlideType) => void;
}

export default function EditableSlideRenderer({ slide, onSlideChange }: EditableSlideRendererProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle text selection and toolbar positioning
  const handleTextSelection = (event: React.MouseEvent | React.KeyboardEvent) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    setTimeout(() => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start !== end) {
        // Text is selected - show toolbar
        setSelectionStart(start);
        setSelectionEnd(end);
        
        // Calculate position for toolbar
        const rect = textarea.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;
        
        // Position toolbar above the textarea
        setToolbarPosition({
          x: rect.left + scrollLeft + (rect.width / 2) - 150, // Center above textarea
          y: rect.top + scrollTop
        });
        
        setShowToolbar(true);
      } else {
        // No selection - hide toolbar
        setShowToolbar(false);
      }
    }, 0);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowToolbar(false);
      setEditingField(null);
      return;
    }
    
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSave();
      return;
    }
    
    // Handle selection changes with keyboard
    handleTextSelection(event);
  };

  const handleSave = () => {
    if (!editingField) return;

    const updatedSlide = { ...slide };
    const fieldPath = editingField.split('.');
    
    if (fieldPath.length === 1) {
      (updatedSlide as any)[fieldPath[0]] = editingValue;
    } else if (fieldPath.length === 2) {
      (updatedSlide as any)[fieldPath[0]][fieldPath[1]] = editingValue;
    }

    onSlideChange(updatedSlide);
    setEditingField(null);
    setShowToolbar(false);
  };

  const handleCancel = () => {
    setEditingField(null);
    setShowToolbar(false);
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditingValue(currentValue);
    setShowToolbar(false);
  };

  const renderEditableText = (field: string, value: string, className: string = '', isMultiline: boolean = false) => {
    const isEditing = editingField === field;

    if (isEditing) {
      return (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onMouseUp={handleTextSelection}
            onKeyUp={handleKeyUp}
            className={`${className} border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none w-full`}
            rows={isMultiline ? 6 : 1}
            style={{ minHeight: isMultiline ? '120px' : 'auto' }}
            autoFocus
          />
          
          {showToolbar && (
            <RichTextToolbar
              value={editingValue}
              onChange={setEditingValue}
              onClose={() => setShowToolbar(false)}
              textareaRef={textareaRef}
              selectionStart={selectionStart}
              selectionEnd={selectionEnd}
              position={toolbarPosition}
            />
          )}
          
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${className} cursor-pointer hover:border-2 hover:border-blue-300 hover:bg-blue-50 rounded p-2 transition-all group`}
        onClick={() => startEditing(field, value)}
      >
        <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(value) }} />
        <div className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 mt-1 transition-opacity">
          Click to edit
        </div>
      </div>
    );
  };

  // Convert markdown to HTML for display
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return '';
    
    let html = markdown;
    
    // First, handle existing HTML spans and preserve them
    html = html.replace(/<span style="([^"]*)">(.*?)<\/span>/g, (match, style, content) => {
      // Preserve the span with its styling
      return `<span style="${style}">${content}</span>`;
    });
    
    // Handle underline tags
    html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    
    // Handle markdown formatting (but avoid replacing content inside existing HTML tags)
    html = html.replace(/\*\*((?![^<]*>)[^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*((?![^<]*>)[^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/~~((?![^<]*>)[^~]+)~~/g, '<del>$1</del>');
    html = html.replace(/`((?![^<]*>)[^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Handle headings
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mb-4">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mb-3">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mb-2">$1</h3>');
    
    // Handle blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 italic text-gray-700 my-2">$1</blockquote>');
    
    // Handle lists
    html = html.replace(/^- (.*$)/gm, '<li class="list-disc ml-6 mb-1">$1</li>');
    html = html.replace(/^1\. (.*$)/gm, '<li class="list-decimal ml-6 mb-1">$1</li>');
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li class="list-disc[^>]*>.*?<\/li>(?:\s*<li class="list-disc[^>]*>.*?<\/li>)*)/g, '<ul class="mb-4">$1</ul>');
    html = html.replace(/(<li class="list-decimal[^>]*>.*?<\/li>(?:\s*<li class="list-decimal[^>]*>.*?<\/li>)*)/g, '<ol class="mb-4">$1</ol>');
    
    // Handle links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline hover:text-blue-800 transition-colors">$1</a>');
    
    // Handle line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'TitleSlide':
        return (
          <div className="text-center">
            {renderEditableText('title', slide.title, 'text-4xl font-bold mb-4')}
            {slide.subtitle && renderEditableText('subtitle', slide.subtitle, 'text-xl text-gray-600')}
          </div>
        );

      case 'TitleWithSubtext':
        return (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6')}
            {slide.subtext && renderEditableText('subtext', slide.subtext, 'text-lg mb-4')}
            {slide.content && renderEditableText('content', slide.content, 'text-lg', true)}
            {slide.bullets && slide.bullets.length > 0 && (
              <div className="mt-4">
                <ul className="list-disc pl-6 space-y-2">
                  {slide.bullets.map((bullet, index) => (
                    <li key={index} className="text-lg">
                      {renderEditableText(`bullets.${index}`, bullet, '')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'TitleWithImage':
        return (
          <div className="flex items-center gap-8">
            <div className="flex-1">
              {renderEditableText('title', slide.title, 'text-3xl font-bold mb-4')}
              {slide.subtitle && renderEditableText('subtitle', slide.subtitle, 'text-lg text-gray-600')}
            </div>
            <div className="flex-1">
              {slide.imageUrl ? (
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  Image placeholder
                </div>
              )}
            </div>
          </div>
        );

      case 'VideoSlide':
        return (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6')}
            {slide.description && renderEditableText('description', slide.description, 'text-lg mb-4')}
            {slide.videoUrl ? (
              <div className="aspect-video">
                <video
                  controls
                  className="w-full h-full rounded-lg"
                  src={slide.videoUrl}
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Video placeholder
              </div>
            )}
          </div>
        );

      case 'QuickCheckSlide':
        return (
          <div>
            {renderEditableText('question', slide.question || '', 'text-3xl font-bold mb-6', true)}
            <div className="space-y-4">
              <button className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors">
                True
              </button>
              <button className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors">
                False
              </button>
            </div>
          </div>
        );

      case 'MarkdownSlide':
        return (
          <div>
            {renderEditableText('content', slide.content || '', 'text-lg prose max-w-none', true)}
          </div>
        );

      case 'HotspotActivitySlide':
        return (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6')}
            <div className="bg-gray-200 rounded-lg p-8 aspect-video flex items-center justify-center">
              <p className="text-gray-600">Interactive hotspot activity</p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            {renderEditableText('title', (slide as any).title || '', 'text-3xl font-bold mb-6')}
            {(slide as any).content && renderEditableText('content', (slide as any).content, 'text-lg', true)}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {renderSlideContent()}
      </div>
    </div>
  );
} 