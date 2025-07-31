'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { FontSize } from './FontSizeExtension';
import { SlashCommandExtension, SlashCommandPlugin } from './SlashCommandExtension';
import SlashCommandMenu from './SlashCommandMenu';
import { SLASH_COMMANDS } from './SlashCommandExtension';
import FloatingToolbar from './FloatingToolbar';
import './enhanced-tiptap-styles.css';

interface EnhancedInlineTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  className?: string;
  blockType?: 'title' | 'content' | 'text';
  isReadOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  debugMode?: boolean;
}

const EnhancedInlineTextEditor: React.FC<EnhancedInlineTextEditorProps> = ({
  content,
  onUpdate,
  placeholder,
  className = '',
  blockType = 'content',
  isReadOnly = false,
  onFocus,
  onBlur,
  debugMode = false,
}) => {
  const [slashCommandState, setSlashCommandState] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const slashCommandStateRef = useRef<any>(null);
  const positionDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSelectionRef = useRef<{ from: number; to: number } | null>(null);
  const formattingInProgressRef = useRef<boolean>(false);

  // Memoize the toolbar close callback to prevent unnecessary re-renders
  const handleToolbarClose = useCallback(() => {
    setShowFloatingToolbar(false);
    setFloatingToolbarPosition(null);
  }, []);

  // Update ref whenever state changes
  useEffect(() => {
    slashCommandStateRef.current = slashCommandState;
  }, [slashCommandState]);

  // Helper function to get cursor position - NO dependencies on editor
  const getCursorPosition = useCallback((editorInstance: any) => {
    try {
      if (!editorInstance || !editorRef.current) {
        return { x: 100, y: 100 }; // Fallback position
      }

      const { selection } = editorInstance.state;
      const pos = selection.from;
      
      // Method 1: Use TipTap's coordsAtPos
      try {
        const coords = editorInstance.view.coordsAtPos(pos);
        const editorContainer = editorRef.current;
        const containerRect = editorContainer.getBoundingClientRect();
        
        const relativeX = coords.left - containerRect.left;
        const relativeY = coords.top - containerRect.top;
        
        // Validate position
        if (relativeX > 0 && relativeY > 0 && relativeX < containerRect.width && relativeY < containerRect.height) {
          return { x: relativeX, y: relativeY };
        }
      } catch (error) {
        // Continue to fallback methods
      }
      
      // Method 2: Use browser selection API
      try {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const editorContainer = editorRef.current;
          const containerRect = editorContainer.getBoundingClientRect();
          
          const relativeX = rect.left - containerRect.left;
          const relativeY = rect.top - containerRect.top;
          
          if (relativeX > 0 && relativeY > 0) {
            return { x: relativeX, y: relativeY };
          }
        }
      } catch (error) {
        // Continue to fallback methods
      }
      
      // Method 3: Fallback - use container position
      return { x: 100, y: 100 };
      
    } catch (error) {
      console.error('Error getting cursor position:', error);
      return { x: 100, y: 100 }; // Safe fallback
    }
  }, []); // No dependencies

  // Handle slash command execution - NO dependencies on editor or state
  const handleSlashCommand = useCallback((command: any, editorInstance: any, state?: any) => {
    try {
      if (editorInstance && state) {
        const { range } = state;
        
        // Execute the command with both editor and range
        if (command.command) {
          command.command(editorInstance, range);
        }
        
        // Clear state
        setSlashCommandState(null);
        setMenuPosition(null);
      }
    } catch (error) {
      console.error('Error handling slash command:', error);
    }
  }, []); // No dependencies



  // Handle text selection and floating toolbar positioning with debouncing
  const handleSelectionChange = useCallback((editorInstance: any) => {
    try {
      if (!editorInstance || !editorRef.current) {
        return;
      }

      const { selection } = editorInstance.state;
      const { from, to } = selection;
      
      // Clear any existing debounce timer
      if (positionDebounceRef.current) {
        clearTimeout(positionDebounceRef.current);
      }
      
      // Only show toolbar if there's actual text selected (not just cursor position)
      if (from !== to && !selection.empty) {
        // Check if this is a significant selection change (avoid micro-movements)
        const lastSelection = lastSelectionRef.current;
        const isSignificantChange = !lastSelection || 
          Math.abs(lastSelection.from - from) > 2 || 
          Math.abs(lastSelection.to - to) > 2 ||
          (to - from) >= 5; // Always show for selections of 5+ characters
        
        if (isSignificantChange || !showFloatingToolbar) {
          // Debounce position updates to avoid excessive repositioning
          positionDebounceRef.current = setTimeout(() => {
            try {
              // Get selection coordinates
              const startCoords = editorInstance.view.coordsAtPos(from);
              const endCoords = editorInstance.view.coordsAtPos(to);
              
              // Use a more stable positioning strategy
              // Position at the start of selection rather than center to reduce movement
              const stableX = startCoords.left;
              const stableY = Math.min(startCoords.top, endCoords.top);
              
              // Stable toolbar positioned at selection start
              
              setFloatingToolbarPosition({ x: stableX, y: stableY });
              setShowFloatingToolbar(true);
              
              // Update last selection reference
              lastSelectionRef.current = { from, to };
            } catch (error) {
              console.error('Error calculating toolbar position:', error);
            }
          }, 150); // 150ms debounce delay
        } else {
          // Selection is too small or not significant enough, just ensure toolbar is visible
          if (!showFloatingToolbar) {
            setShowFloatingToolbar(true);
          }
        }
      } else {
        // Hide toolbar when no text is selected
        setShowFloatingToolbar(false);
        setFloatingToolbarPosition(null);
        lastSelectionRef.current = null;
      }
    } catch (error) {
      console.error('Error handling selection change:', error);
      setShowFloatingToolbar(false);
      setFloatingToolbarPosition(null);
    }
  }, [showFloatingToolbar]);

  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
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
        // Disable Link and Underline in StarterKit since we configure them separately
        link: false,
        underline: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({ types: [TextStyle.name] }),
      TextStyle,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      FontSize,
      SlashCommandExtension.configure({
        onSlashCommand: (state: any) => {
          setSlashCommandState(state);
          
          if (state.active) {
            // Use a timeout to ensure editor is ready
            setTimeout(() => {
              const currentEditor = editor;
              if (currentEditor) {
                const position = getCursorPosition(currentEditor);
                setMenuPosition(position);
              } else {
                setMenuPosition({ x: 200, y: 200 }); // Fallback position
              }
            }, 10);
          } else {
            setMenuPosition(null);
          }
        },
      }),
    ],
    content: content || '',
    editable: !isReadOnly,
    onUpdate: ({ editor: editorInstance }) => {
      if (isInitialized) {
        const html = editorInstance.getHTML();
        onUpdate(html);
      }
    },
    onCreate: ({ editor: editorInstance }) => {
      // Debug: Log extension configuration to verify no duplicates
      console.log('🔧 EnhancedInlineTextEditor created with extensions:', 
        editorInstance.extensionManager.extensions.map(ext => ext.name).join(', '));
      setIsInitialized(true);
    },
    onFocus: () => {
      if (onFocus) onFocus();
    },
    onBlur: () => {
      if (onBlur) onBlur();
      // Hide floating toolbar when editor loses focus
      setShowFloatingToolbar(false);
      setFloatingToolbarPosition(null);
    },
    onSelectionUpdate: ({ editor: editorInstance }) => {
      // Handle text selection for floating toolbar
      handleSelectionChange(editorInstance);
    },
  });

  // Add keyboard event handling for slash command menu - AFTER editor is created
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Use a ref to get the latest state without adding it to dependencies
      const currentState = slashCommandStateRef.current;
      
      if (currentState && currentState.active && currentState.filteredCommands.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSlashCommandState((prev: any) => ({
            ...prev,
            selectedIndex: (prev.selectedIndex + 1) % prev.filteredCommands.length
          }));
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSlashCommandState((prev: any) => ({
            ...prev,
            selectedIndex: prev.selectedIndex === 0 
              ? prev.filteredCommands.length - 1 
              : prev.selectedIndex - 1
          }));
        } else if (event.key === 'Enter') {
          event.preventDefault();
          const selectedCommand = currentState.filteredCommands[currentState.selectedIndex];
          if (selectedCommand) {
            // Call handleSlashCommand directly with current state
            handleSlashCommand(selectedCommand, editor, currentState);
          }
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setSlashCommandState(null);
          setMenuPosition(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]); // Only depend on editor, not on state or handleSlashCommand




  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== undefined && isInitialized) {
      try {
        const currentContent = editor.getHTML();
        
        // Only update if content is different and editor is initialized
        if (content !== currentContent) {
          if (content && content.trim() !== '') {
            // If content is provided, set it normally
            editor.commands.setContent(content);
          } else if (content === '' && currentContent !== '') {
            // If content is explicitly set to empty, clear the editor
            editor.commands.clearContent();
          }
        }
      } catch (error) {
        console.error('Error updating editor content:', error);
      }
    }
  }, [content, editor, isInitialized]);

  // Handle clicks outside editor to hide floating toolbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close toolbar if formatting is in progress
      if (formattingInProgressRef.current) {
        console.log('🔒 Preventing toolbar close - formatting in progress');
        return;
      }
      
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowFloatingToolbar(false);
        setFloatingToolbarPosition(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowFloatingToolbar(false);
        setFloatingToolbarPosition(null);
      }
    };

    if (showFloatingToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showFloatingToolbar]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (positionDebounceRef.current) {
        clearTimeout(positionDebounceRef.current);
      }
    };
  }, []);

  // Helper function to determine if content should be treated as placeholder
  const shouldTreatAsPlaceholder = useCallback(() => {
    if (!content) return true;
    
    const trimmedContent = content.trim();
    
    // Check if content is empty or contains only HTML tags
    if (!trimmedContent || trimmedContent === '<p></p>' || trimmedContent === '<br>') {
      return true;
    }
    
    // List of common placeholder patterns
    const placeholderPatterns = [
      'Click to edit',
      'New Title',
      'Enter content',
      'Add your',
      'Untitled',
      'Type here',
      'Enter text',
      'Your content',
      'Click to add',
      'Add content',
      'Enter title',
      'Add title'
    ];
    
    return placeholderPatterns.some(pattern => 
      trimmedContent.toLowerCase().includes(pattern.toLowerCase())
    );
  }, [content]);

  // Get contextual placeholder text
  const getPlaceholderText = useCallback(() => {
    if (placeholder) return placeholder;
    
    switch (blockType) {
      case 'title':
        return 'Untitled Card';
      case 'content':
        return 'Click to add content...';
      case 'text':
        return 'Enter text...';
      default:
        return 'Start typing...';
    }
  }, [placeholder, blockType]);

  // Return null if editor is not initialized
  if (!editor) {
    return <div className="h-10 animate-pulse bg-gray-200 rounded"></div>;
  }

  return (
    <div className="enhanced-inline-text-editor-container enhanced-editor relative" ref={editorRef}>
      <div className="editor-wrapper">
        <EditorContent 
          editor={editor}
          className={`enhanced-editor-content ProseMirror-container ${className} ${shouldTreatAsPlaceholder() ? 'ghost-text' : ''}`}
          placeholder={getPlaceholderText()}
        />
      </div>
      
      {/* Slash Command Menu */}
      {slashCommandState && slashCommandState.active && menuPosition && (() => {
        return (
          <SlashCommandMenu
            items={slashCommandState.filteredCommands}
            onSelect={(command) => handleSlashCommand(command, editor, slashCommandState)}
            selectedIndex={slashCommandState.selectedIndex}
            position={menuPosition}
            onClose={() => {
              setSlashCommandState(null);
              setMenuPosition(null);
            }}
          />
        );
      })()}
      
      {/* Floating Toolbar - Always mounted to preserve state */}
      <FloatingToolbar
        editor={editor}
        position={floatingToolbarPosition || { x: 0, y: 0 }}
        formattingInProgressRef={formattingInProgressRef}
        isVisible={showFloatingToolbar && floatingToolbarPosition !== null}
        onClose={handleToolbarClose}
      />
      
      {/* Debug Info */}
      {debugMode && (
        <div className="debug-info mt-2 p-2 bg-gray-100 rounded text-xs">
          <div>Ghost Text: {shouldTreatAsPlaceholder() ? 'YES' : 'NO'}</div>
          <div>Content: {content}</div>
          <div>Block Type: {blockType}</div>
          <div>Placeholder: {getPlaceholderText()}</div>
          <div>Slash State: {slashCommandState?.active ? 'ACTIVE' : 'INACTIVE'}</div>
          <div>Menu Position: {menuPosition ? `${menuPosition.x}, ${menuPosition.y}` : 'NONE'}</div>
          <div>Floating Toolbar: {showFloatingToolbar ? 'VISIBLE' : 'HIDDEN'}</div>
          <div>Toolbar Position: {floatingToolbarPosition ? `${floatingToolbarPosition.x}, ${floatingToolbarPosition.y}` : 'NONE'}</div>

        </div>
      )}


    </div>
  );
};

export default EnhancedInlineTextEditor; 