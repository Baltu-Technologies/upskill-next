'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
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
  Type, Palette, Heading1, Heading2, Heading3
} from 'lucide-react';

interface TipTapSlideEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
}

const TipTapSlideEditor: React.FC<TipTapSlideEditorProps> = ({
  content,
  onChange,
  onSave,
  onCancel,
  placeholder = "Start typing...",
  className = ""
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
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
        class: 'prose prose-lg prose-invert max-w-none focus:outline-none min-h-[120px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
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
        className="sticky top-0 z-10 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 mb-4 flex items-center space-x-1 overflow-x-auto"
      >
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

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1 rounded hover:bg-gray-800 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          title="Heading 3"
        >
          <Heading3 size={16} />
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

      {/* Editor Content */}
      <div 
        ref={editorRef}
        className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-all bg-white"
      >
        <EditorContent 
          editor={editor} 
          className="min-h-[120px]"
        />
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
        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Cmd+Enter</kbd> to save • Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Escape</kbd> to cancel
      </div>
    </div>
  );
};

export default TipTapSlideEditor;
