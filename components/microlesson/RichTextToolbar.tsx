'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Type, Palette, Quote, Code } from 'lucide-react';

interface RichTextToolbarProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  selectionStart: number;
  selectionEnd: number;
  position: { x: number; y: number };
}

export default function RichTextToolbar({ 
  value, 
  onChange, 
  onClose, 
  textareaRef, 
  selectionStart, 
  selectionEnd,
  position 
}: RichTextToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Improved color palette with better organization
  const colors = [
    // Black and grays
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#374151' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Light Gray', value: '#9CA3AF' },
    
    // Primary colors
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Yellow', value: '#D97706' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Pink', value: '#DB2777' },
    
    // Lighter variants
    { name: 'Light Red', value: '#F87171' },
    { name: 'Light Orange', value: '#FB923C' },
    { name: 'Light Yellow', value: '#FBBF24' },
    { name: 'Light Green', value: '#4ADE80' },
    { name: 'Light Blue', value: '#60A5FA' },
    { name: 'Light Purple', value: '#A78BFA' },
    { name: 'Light Pink', value: '#F472B6' },
  ];

  const headingOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getSelectedText = () => {
    return value.substring(selectionStart, selectionEnd);
  };

  const applyFormatting = (prefix: string, suffix: string = '') => {
    const selectedText = getSelectedText();
    const beforeSelection = value.substring(0, selectionStart);
    const afterSelection = value.substring(selectionEnd);
    
    const newValue = beforeSelection + prefix + selectedText + suffix + afterSelection;
    onChange(newValue);
    
    // Restore focus and selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newStart = selectionStart + prefix.length;
        const newEnd = newStart + selectedText.length;
        textareaRef.current.setSelectionRange(newStart, newEnd);
      }
    }, 0);
  };

  const applyHeading = (headingType: string) => {
    const selectedText = getSelectedText();
    const beforeSelection = value.substring(0, selectionStart);
    const afterSelection = value.substring(selectionEnd);
    
    let formattedText = selectedText;
    
    switch (headingType) {
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      default:
        formattedText = selectedText.replace(/^#{1,3}\s*/, '');
    }
    
    const newValue = beforeSelection + formattedText + afterSelection;
    onChange(newValue);
    setShowHeadingPicker(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newStart = selectionStart;
        const newEnd = newStart + formattedText.length;
        textareaRef.current.setSelectionRange(newStart, newEnd);
      }
    }, 0);
  };

  const applyColor = (color: string) => {
    const selectedText = getSelectedText();
    if (!selectedText) return;
    
    applyFormatting(`<span style="color: ${color}">`, '</span>');
    setShowColorPicker(false);
  };

  const toolbarStyle = {
    position: 'fixed' as const,
    left: `${position.x}px`,
    top: `${position.y - 70}px`, // Position above the selection with more space
    zIndex: 1000,
  };

  return (
    <div 
      ref={toolbarRef}
      style={toolbarStyle}
      className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center space-x-1"
    >
      {/* Heading Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowHeadingPicker(!showHeadingPicker)}
          className="px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center space-x-1"
        >
          <Type size={16} />
          <span className="text-xs">▼</span>
        </button>
        {showHeadingPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[120px] z-10">
            {headingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => applyHeading(option.value)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Text Style Buttons */}
      <button
        onClick={() => applyFormatting('**', '**')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Bold"
      >
        <Bold size={16} />
      </button>
      
      <button
        onClick={() => applyFormatting('*', '*')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Italic"
      >
        <Italic size={16} />
      </button>
      
      <button
        onClick={() => applyFormatting('<u>', '</u>')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Underline"
      >
        <Underline size={16} />
      </button>
      
      <button
        onClick={() => applyFormatting('~~', '~~')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Text Color"
        >
          <Palette size={16} />
        </button>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 min-w-[280px]">
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => applyColor(color.value)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:scale-110 transition-transform flex items-center justify-center"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {color.value === '#000000' && <span className="text-white text-xs">A</span>}
                  {color.value === '#FFFFFF' && <span className="text-black text-xs">A</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* List Buttons */}
      <button
        onClick={() => applyFormatting('- ', '')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Bullet List"
      >
        <List size={16} />
      </button>
      
      <button
        onClick={() => applyFormatting('1. ', '')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Additional Formatting */}
      <button
        onClick={() => applyFormatting('> ', '')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Quote"
      >
        <Quote size={16} />
      </button>
      
      <button
        onClick={() => applyFormatting('`', '`')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Code"
      >
        <Code size={16} />
      </button>
      
      <button
        onClick={() => applyFormatting('[', '](url)')}
        className="p-1 hover:bg-gray-100 rounded"
        title="Link"
      >
        <Link size={16} />
      </button>
    </div>
  );
} 