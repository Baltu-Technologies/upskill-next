'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import { FontSize } from './FontSizeExtension';
import { SlashCommandExtension, SlashCommandPlugin } from './SlashCommandExtension';
import SlashCommandMenu from './SlashCommandMenu';
import './enhanced-tiptap-styles.css';

interface EnhancedInlineTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
  showToolbar?: boolean;
  blockType?: 'title' | 'content' | 'subtitle' | 'other';
}

export default function EnhancedInlineTextEditor({ 
  content, 
  onChange, 
  className = '', 
  placeholder = 'Click to edit...',
  showToolbar = true,
  blockType = 'other'
}: EnhancedInlineTextEditorProps) {
  const [slashCommandState, setSlashCommandState] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to determine if content should be treated as placeholder
  const isPlaceholderContent = useCallback((text: string): boolean => {
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
      /^Add your/i,
      /^enter content here/i
    ];
    
    return placeholderPatterns.some(pattern => pattern.test(text.trim()));
  }, []);

  const shouldTreatAsPlaceholder = isPlaceholderContent(content);

  // Get the appropriate placeholder text based on blockType
  const getPlaceholderText = useCallback(() => {
    if (blockType === 'title') {
      return 'Untitled Card';
    } else if (blockType === 'content') {
      return 'Type / to add blocks or 📝 🖼️ 📊';
    } else if (blockType === 'subtitle') {
      return 'Add subtitle...';
    } else {
      return placeholder;
    }
  }, [blockType, placeholder]);

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
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `enhanced-editor prose prose-lg prose-invert max-w-none focus:outline-none min-h-[40px] p-2 ${className}`,
      },
      // Handle click events to implement placeholder behavior
      handleClickOn: (view, pos, node, nodePos, event, direct) => {
        try {
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
        } catch (error) {
          console.error('Error in handleClickOn:', error);
          return false;
        }
      },
    },
    onUpdate: ({ editor }) => {
      try {
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
      } catch (error) {
        console.error('Error in onUpdate:', error);
      }
    },
    onFocus: ({ editor }) => {
      try {
        // When focusing on placeholder content, select all text
        if (shouldTreatAsPlaceholder) {
          setTimeout(() => {
            editor.commands.selectAll();
          }, 0);
        }
      } catch (error) {
        console.error('Error in onFocus:', error);
      }
    },
    onCreate: ({ editor }) => {
      try {
        console.log('EnhancedInlineTextEditor onCreate called', {
          isEmpty: editor.isEmpty,
          content: content,
          blockType: blockType
        });
        
        setIsInitialized(true);
        
        // Focus the editor to make it ready for input
        setTimeout(() => {
          if (editor) {
            editor.commands.focus();
          }
        }, 0);
      } catch (error) {
        console.error('Error in onCreate:', error);
      }
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== undefined && isInitialized) {
      try {
        const currentContent = editor.getHTML();
        
        console.log('Content useEffect triggered', {
          content: content,
          currentContent: currentContent,
          blockType: blockType,
          isInitialized: isInitialized
        });
        
        // Only update if content is different and editor is initialized
        if (content !== currentContent) {
          if (content && content.trim() !== '') {
            console.log('Setting editor content to:', content);
            // If content is provided, set it normally
            editor.commands.setContent(content);
          } else if (content === '' && currentContent !== '') {
            console.log('Clearing editor content');
            // If content is explicitly set to empty, clear the editor
            editor.commands.clearContent();
          }
        }
      } catch (error) {
        console.error('Error in content useEffect:', error);
      }
    }
  }, [content, editor, blockType, isInitialized]);

  const handleSlashCommand = useCallback((command: any) => {
    try {
      if (editor && slashCommandState) {
        const { range } = slashCommandState;
        
        // Delete the slash and query text
        editor.chain()
          .focus()
          .deleteRange({ from: range.from, to: range.to })
          .run();
        
        // Execute the command
        if (command.command) {
          command.command(editor, range);
        } else if (command.action) {
          command.action(editor);
        }
        
        // Clear slash command state
        setSlashCommandState(null);
        setMenuPosition(null);
      }
    } catch (error) {
      console.error('Error executing slash command:', error);
    }
  }, [editor, slashCommandState]);

  if (!editor) {
    return (
      <div 
        className={`enhanced-editor prose prose-lg prose-invert max-w-none min-h-[40px] p-2 ${className} text-gray-400`}
      >
        {getPlaceholderText()}
      </div>
    );
  }

  // Check if editor is truly empty (no content at all)
  const isEmpty = editor.isEmpty;

  return (
    <div className="relative w-full">
      {/* Show placeholder overlay ONLY when editor is truly empty */}
      {isEmpty && (
        <div 
          className={`absolute inset-0 pointer-events-none flex items-start justify-start p-2 ${
            blockType === 'title' 
              ? 'text-2xl font-bold' 
              : blockType === 'subtitle' 
                ? 'text-lg font-semibold' 
                : ''
          }`}
          style={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            fontStyle: 'italic',
            fontSize: blockType === 'title' ? '2rem' : blockType === 'subtitle' ? '1.125rem' : 'inherit',
            lineHeight: blockType === 'title' ? '2.5rem' : blockType === 'subtitle' ? '1.75rem' : 'inherit',
            fontWeight: blockType === 'title' ? '700' : blockType === 'subtitle' ? '600' : 'inherit'
          }}
        >
          {getPlaceholderText()}
        </div>
      )}
      
      <EditorContent 
        editor={editor} 
        className={`enhanced-inline-editor w-full ${className} ${shouldTreatAsPlaceholder ? 'placeholder-content cursor-text opacity-70 italic' : ''}`}
      />

      {/* Slash Command Menu */}
      {slashCommandState && menuPosition && slashCommandState.filteredCommands && (
        <div style={{ position: 'fixed', left: menuPosition.x, top: menuPosition.y + 20, zIndex: 1000 }}>
          <SlashCommandMenu
            items={slashCommandState.filteredCommands}
            selectedIndex={slashCommandState.selectedIndex || 0}
            onSelect={handleSlashCommand}
            onClose={() => {
              setSlashCommandState(null);
              setMenuPosition(null);
            }}
          />
        </div>
      )}
    </div>
  );
} 