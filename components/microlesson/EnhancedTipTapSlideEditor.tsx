'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import { FontSize } from './FontSizeExtension';
import { SlashCommandExtension, SlashCommandPlugin } from './SlashCommandExtension';
import { ALL_EXTENSIONS } from './TipTapExtensions';
import SlashCommandMenu from './SlashCommandMenu';
import { EnhancedDragDropContainer } from './EnhancedDragDropContainer';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, Code, Link as LinkIcon,
  Type, Palette, Heading1, Heading2, Heading3, ChevronDown
} from 'lucide-react';
import './enhanced-tiptap-styles.css';

interface EnhancedTipTapSlideEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
}

// Text size options with their labels, classes, and FontSize commands
const TEXT_SIZE_OPTIONS = [
  { 
    label: 'Small text', 
    value: 'small', 
    className: 'text-sm',
    action: (editor: any) => {
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().setFontSize('12px').run();
    },
    isActive: (editor: any) => {
      return !editor.isActive('heading') && editor.isActive('textStyle', { fontSize: '12px' });
    }
  },
  { 
    label: 'Normal text', 
    value: 'normal', 
    className: 'text-base',
    action: (editor: any) => {
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().setFontSize('16px').run();
    },
    isActive: (editor: any) => {
      return !editor.isActive('heading') && editor.isActive('textStyle', { fontSize: '16px' });
    }
  },
  { 
    label: 'Large text', 
    value: 'large', 
    className: 'text-lg',
    action: (editor: any) => {
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().setFontSize('20px').run();
    },
    isActive: (editor: any) => {
      return !editor.isActive('heading') && editor.isActive('textStyle', { fontSize: '20px' });
    }
  },
  { 
    label: 'Heading 1', 
    value: 'h1', 
    className: 'text-4xl font-bold',
    action: (editor: any) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor: any) => editor.isActive('heading', { level: 1 })
  },
  { 
    label: 'Heading 2', 
    value: 'h2', 
    className: 'text-3xl font-bold',
    action: (editor: any) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor: any) => editor.isActive('heading', { level: 2 })
  },
  { 
    label: 'Heading 3', 
    value: 'h3', 
    className: 'text-2xl font-bold',
    action: (editor: any) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor: any) => editor.isActive('heading', { level: 3 })
  },
];

const EnhancedTipTapSlideEditor: React.FC<EnhancedTipTapSlideEditorProps> = ({
  content,
  onChange,
  onSave,
  onCancel,
  placeholder = "Start typing...",
  className = ""
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTextSizeDropdown, setShowTextSizeDropdown] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [slashCommandState, setSlashCommandState] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Keep paragraph enabled but let enhanced blocks handle structure
        paragraph: {
          HTMLAttributes: {
            class: 'my-2',
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      FontSize,
      Link.configure({
        openOnClick: false,
      }),
      SlashCommandExtension,
      ...ALL_EXTENSIONS,
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'enhanced-editor prose prose-lg prose-invert max-w-none focus:outline-none min-h-[120px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Handle slash command state updates
      const pluginState = SlashCommandPlugin.getState(editor.state);
      if (pluginState?.active && pluginState.filteredCommands.length > 0) {
        setSlashCommandState(pluginState);
        
        // Calculate menu position
        const { from } = pluginState.range;
        const coords = editor.view.coordsAtPos(from);
        setMenuPosition({ x: coords.left, y: coords.top });
      } else {
        setSlashCommandState(null);
        setMenuPosition(null);
      }
    },
    onCreate: ({ editor }) => {
      // If the editor is empty or has no content, create initial blocks
      if (editor.isEmpty || !content) {
        setTimeout(() => {
          // Create initial heading block with "Untitled Card" placeholder
          const titleBlockId = `block-title-${Date.now()}`;
          const contentBlockId = `block-content-${Date.now() + 1}`;
          
          editor.commands.setContent([
            {
              type: 'enhancedBlock',
              attrs: {
                id: titleBlockId,
                type: 'title',
                placeholder: 'Untitled Card'
              },
              content: [
                {
                  type: 'heading',
                  attrs: { level: 1 },
                  content: []
                }
              ]
            },
            {
              type: 'enhancedBlock',
              attrs: {
                id: contentBlockId,
                type: 'content',
                placeholder: 'Type / to add blocks...'
              },
              content: [
                {
                  type: 'paragraph',
                  content: []
                }
              ]
            }
          ]);
          
          // Focus on the first block (title)
          editor.commands.focus(1);
        }, 0);
      }
    },
  });

  // Improved color palette
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#374151' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Light Gray', value: '#9CA3AF' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Yellow', value: '#D97706' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Pink', value: '#DB2777' },
    { name: 'Light Red', value: '#F87171' },
    { name: 'Light Orange', value: '#FB923C' },
    { name: 'Light Yellow', value: '#FBBF24' },
    { name: 'Light Green', value: '#4ADE80' },
    { name: 'Light Blue', value: '#60A5FA' },
    { name: 'Light Purple', value: '#A78BFA' },
    { name: 'Light Pink', value: '#F472B6' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, onSave]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
        setShowLinkDialog(false);
        setShowTextSizeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
    setShowLinkDialog(false);
  };

  const handleTextSizeChange = (option: typeof TEXT_SIZE_OPTIONS[0]) => {
    option.action(editor);
    setShowTextSizeDropdown(false);
  };

  const getCurrentTextSize = () => {
    if (!editor) return TEXT_SIZE_OPTIONS[1]; // Default to normal text
    
    const activeOption = TEXT_SIZE_OPTIONS.find(option => option.isActive(editor));
    return activeOption || TEXT_SIZE_OPTIONS[1];
  };

  const handleSlashCommandSelect = (command: any) => {
    if (editor && slashCommandState) {
      command.command(editor, slashCommandState.range);
      setSlashCommandState(null);
      setMenuPosition(null);
    }
  };

  const handleSlashCommandClose = () => {
    setSlashCommandState(null);
    setMenuPosition(null);
  };

  if (!editor) {
    return (
      <div className="w-full">
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 mb-4 flex items-center justify-center">
          <div className="text-gray-300 text-sm">Loading editor...</div>
        </div>
        <div className="border border-gray-300 rounded-lg min-h-[120px] flex items-center justify-center bg-white">
          <div className="text-gray-500">Initializing rich text editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Floating Toolbar */}
      <div 
        ref={toolbarRef}
        className="sticky top-0 z-[9999] bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 mb-4 flex items-center space-x-1 overflow-x-auto"
      >
        {/* Text Size Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTextSizeDropdown(!showTextSizeDropdown)}
            className="p-1 px-2 rounded hover:bg-gray-800 transition-colors text-gray-300 hover:text-white flex items-center space-x-1"
            title="Text Size"
          >
            <Type size={16} />
            <span className="text-xs">{getCurrentTextSize().label}</span>
            <ChevronDown size={12} />
          </button>

          {showTextSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-1 z-[10000] min-w-[160px]">
              {TEXT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTextSizeChange(option)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors ${
                    option.isActive(editor) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className={`${option.className} block truncate`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('underline') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('strike') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 rounded hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
            title="Text Color"
          >
            <Palette size={16} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-3 z-20 min-w-[280px]">
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setColor(color.value)}
                    className="w-8 h-8 rounded-full border-2 border-gray-600 hover:border-gray-400 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* Other Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Quote"
        >
          <Quote size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('code') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Inline Code"
        >
          <Code size={16} />
        </button>

        {/* Link */}
        <div className="relative">
          <button
            onClick={() => setShowLinkDialog(!showLinkDialog)}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('link') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Add Link"
          >
            <LinkIcon size={16} />
          </button>
          {showLinkDialog && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-3 z-20 min-w-[200px]">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                className="w-full p-2 border border-gray-600 rounded text-sm mb-2 bg-gray-700 text-white placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addLink();
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={removeLink}
                  className="px-2 py-1 text-xs text-red-400 hover:bg-red-900 rounded"
                >
                  Remove
                </button>
                <button
                  onClick={addLink}
                  className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content wrapped in DragDropContainer */}
      <div 
        ref={editorRef}
        className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-all bg-white"
      >
        <EnhancedDragDropContainer 
          editor={editor}
          className="min-h-[120px] px-4 py-2"
        >
          <EditorContent 
            editor={editor} 
            className="min-h-[120px]"
          />
        </EnhancedDragDropContainer>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors bg-white border border-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
        >
          Save
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="text-xs text-gray-600 mt-2">
        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Cmd+Enter</kbd> to save • Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Escape</kbd> to cancel • Type <kbd className="px-1 py-0.5 bg-gray-100 rounded border">/</kbd> for commands • Drag <kbd className="px-1 py-0.5 bg-gray-100 rounded border">⋮⋮</kbd> to reorder blocks
      </div>

      {/* Slash Command Menu */}
      {slashCommandState && slashCommandState.active && menuPosition && (
        <SlashCommandMenu
          items={slashCommandState.filteredCommands}
          selectedIndex={slashCommandState.selectedIndex}
          onSelect={handleSlashCommandSelect}
          onClose={handleSlashCommandClose}
          position={menuPosition}
          query={slashCommandState.query}
        />
      )}
    </div>
  );
};

export default EnhancedTipTapSlideEditor; 