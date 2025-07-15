'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, Code, Link as LinkIcon,
  Palette, Heading1, Heading2, Heading3
} from 'lucide-react';

interface InlineTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
}

export default function InlineTextEditor({ 
  content, 
  onChange, 
  className = '',
  placeholder = 'Click to edit...'
}: InlineTextEditorProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isInteractingWithToolbar, setIsInteractingWithToolbar] = useState(false);
  
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

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
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-lg prose-invert max-w-none focus:outline-none ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      // Debounce onChange to avoid too many updates
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(editor.getHTML());
      }, 300);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        // Text is selected, show toolbar
        showToolbarAtSelection();
      } else {
        // Only hide toolbar if not interacting with it
        if (!isInteractingWithToolbar) {
          setTimeout(() => {
            if (!isInteractingWithToolbar && !toolbarRef.current?.contains(document.activeElement)) {
              setShowToolbar(false);
              setShowColorPicker(false);
              setShowLinkDialog(false);
            }
          }, 100);
        }
      }
    },
    onFocus: () => {
      // When editor gets focus, we might want to show some indication
    },
    onBlur: () => {
      // Hide toolbar when editor loses focus, but only if not interacting with toolbar
      setTimeout(() => {
        if (!isInteractingWithToolbar && !toolbarRef.current?.contains(document.activeElement)) {
          setShowToolbar(false);
          setShowColorPicker(false);
          setShowLinkDialog(false);
        }
      }, 150);
    },
  });

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showToolbar &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node) &&
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setShowToolbar(false);
        setShowColorPicker(false);
        setShowLinkDialog(false);
        setIsInteractingWithToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showToolbar]);

  const showToolbarAtSelection = () => {
    if (!editor || !editorRef.current) return;

    const { from, to } = editor.state.selection;
    if (from === to) return;

    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    
    const editorRect = editorRef.current.getBoundingClientRect();
    
    // Position toolbar above the selection
    const x = (start.left + end.left) / 2 - editorRect.left;
    const y = start.top - editorRect.top - 10;
    
    setToolbarPosition({ x, y });
    setShowToolbar(true);
  };

  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    // Prevent the default behavior that would cause the editor to lose focus
    e.preventDefault();
    setIsInteractingWithToolbar(true);
  };

  const handleToolbarMouseUp = () => {
    setIsInteractingWithToolbar(false);
  };

  const handleLinkAdd = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkDialog(false);
  };

  const colors = [
    '#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#000000'
  ];

  if (!editor) {
    return (
      <div className={`${className} text-gray-400 italic`}>
        {placeholder}
      </div>
    );
  }

  return (
    <div className="relative" ref={editorRef}>
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="absolute z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 flex items-center space-x-1"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
          onMouseDown={handleToolbarMouseDown}
          onMouseUp={handleToolbarMouseUp}
        >
          {/* Text Formatting */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('underline') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('strike') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* Headings */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* Text Alignment */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign('left').run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign('center').run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign('right').run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* Lists */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* Quote and Code */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Quote"
          >
            <Quote size={16} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleCode().run();
            }}
            className={`p-1 rounded hover:bg-gray-800 transition-colors ${
              editor.isActive('code') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="Inline Code"
          >
            <Code size={16} />
          </button>

          {/* Text Color */}
          <div className="relative">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setShowColorPicker(!showColorPicker);
              }}
              className="p-1 rounded hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              title="Text Color"
            >
              <Palette size={16} />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 grid grid-cols-6 gap-1 z-10">
                {colors.map((color) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded border border-gray-600 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Link */}
          <div className="relative">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setShowLinkDialog(!showLinkDialog);
              }}
              className={`p-1 rounded hover:bg-gray-800 transition-colors ${
                editor.isActive('link') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              title="Add Link"
            >
              <LinkIcon size={16} />
            </button>

            {showLinkDialog && (
              <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 z-10">
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                  />
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLinkAdd();
                    }}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent 
        editor={editor}
        className="w-full min-h-[1.5rem] cursor-text"
      />
    </div>
  );
} 