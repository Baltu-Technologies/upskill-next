'use client';

import React, { useState, useEffect } from 'react';
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
import './enhanced-tiptap-styles.css';

interface EnhancedInlineTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
  showToolbar?: boolean;
}

export default function EnhancedInlineTextEditor({ 
  content, 
  onChange, 
  className = '', 
  placeholder = 'Click to edit...',
  showToolbar = true 
}: EnhancedInlineTextEditorProps) {
  const [slashCommandState, setSlashCommandState] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  // Helper function to determine if content should be treated as placeholder
  const isPlaceholderContent = (text: string): boolean => {
    if (!text || text.trim() === '') return false;
    
    const placeholderPatterns = [
      /^Click to edit/i,
      /^New Title Slide$/i,
      /^New Title/i,
      /^Enter /i,
      /^Add /i,
      /^Type /i,
      /^Untitled/i,
      /^New Slide$/i,
      /^New Markdown Slide$/i,
      /^New Title with Subtext$/i,
      /^Add your/i
    ];
    
    return placeholderPatterns.some(pattern => pattern.test(text.trim()));
  };

  const shouldTreatAsPlaceholder = isPlaceholderContent(content);

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
        class: `enhanced-editor prose prose-lg prose-invert max-w-none focus:outline-none min-h-[40px] p-2 ${className}`,
      },
      // Handle click events to implement placeholder behavior
      handleClickOn: (view, pos, node, nodePos, event, direct) => {
        if (shouldTreatAsPlaceholder && direct) {
          // For placeholder content, always position cursor at beginning and select all
          event.preventDefault();
          // Use the editor commands to select all content
          setTimeout(() => {
            if (editor) {
              editor.commands.selectAll();
              editor.commands.focus();
            }
          }, 0);
          return true;
        }
        return false;
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
    onFocus: ({ editor }) => {
      // When focusing on placeholder content, select all text
      if (shouldTreatAsPlaceholder) {
        setTimeout(() => {
          editor.commands.selectAll();
        }, 0);
      }
    },
    onCreate: ({ editor }) => {
      // If the editor is empty or has no content, create initial block
      if (editor.isEmpty || !content) {
        setTimeout(() => {
          // Create initial block with placeholder
          const blockId = `block-${Date.now()}`;
          
          editor.commands.setContent([
            {
              type: 'enhancedBlock',
              attrs: {
                id: blockId,
                type: 'content',
                placeholder: placeholder
              },
              content: [
                {
                  type: 'paragraph',
                  content: []
                }
              ]
            }
          ]);
          
          // Focus on the block
          editor.commands.focus(1);
        }, 0);
      }
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const handleSlashCommand = (command: any) => {
    if (editor && slashCommandState) {
      const { range } = slashCommandState;
      
      // Delete the slash and query text
      editor.chain()
        .focus()
        .deleteRange({ from: range.from, to: range.to })
        .run();
      
      // Execute the command
      command.action(editor);
      
      // Clear slash command state
      setSlashCommandState(null);
      setMenuPosition(null);
    }
  };

  if (!editor) {
    return (
      <div 
        className={`enhanced-editor prose prose-lg prose-invert max-w-none min-h-[40px] p-2 ${className} text-gray-400`}
      >
        {placeholder}
      </div>
    );
  }

  // Add placeholder-like styling when content should be treated as placeholder
  const editorClassName = shouldTreatAsPlaceholder 
    ? `${className} placeholder-content cursor-text opacity-70 italic` 
    : className;

  return (
    <div className="relative w-full">
      <EnhancedDragDropContainer editor={editor}>
        <EditorContent 
          editor={editor} 
          className={`enhanced-inline-editor w-full ${editorClassName}`}
        />
      </EnhancedDragDropContainer>

      {/* Slash Command Menu */}
      {slashCommandState && menuPosition && (
        <div style={{ position: 'fixed', left: menuPosition.x, top: menuPosition.y + 20, zIndex: 1000 }}>
          <SlashCommandMenu
            items={slashCommandState.filteredCommands}
            selectedIndex={slashCommandState.selectedIndex}
            onSelect={handleSlashCommand}
            onClose={() => setSlashCommandState(null)}
          />
        </div>
      )}
    </div>
  );
} 