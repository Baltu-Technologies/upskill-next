'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { FontSize } from './FontSizeExtension';
import { SlashCommandExtension, SlashCommandPlugin } from './SlashCommandExtension';
import { ALL_EXTENSIONS } from './TipTapExtensions';
import SlashCommandMenu from './SlashCommandMenu';
// Simple block system instead of complex drag-and-drop
import { SimpleBlock, SimpleBlockPlugin } from './SimpleBlockExtension';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, Code, Link as LinkIcon,
  Palette, Heading1, Heading2, Heading3, Type, ChevronDown, Check
} from 'lucide-react';
import './tiptap-styles.css';

interface InlineTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
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
  { 
    label: 'Heading 4', 
    value: 'h4', 
    className: 'text-xl font-bold',
    action: (editor: any) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: (editor: any) => editor.isActive('heading', { level: 4 })
  },
  { 
    label: 'Title !', 
    value: 'title', 
    className: 'text-5xl font-bold',
    action: (editor: any) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    isActive: (editor: any) => editor.isActive('heading', { level: 5 })
  },
  { 
    label: 'Display !!', 
    value: 'display', 
    className: 'text-6xl font-bold',
    action: (editor: any) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    isActive: (editor: any) => editor.isActive('heading', { level: 6 })
  },
  { 
    label: 'Monster (!!!)', 
    value: 'monster', 
    className: 'text-8xl font-bold',
    action: (editor: any) => {
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().setFontSize('96px').run();
    },
    isActive: (editor: any) => {
      return !editor.isActive('heading') && editor.isActive('textStyle', { fontSize: '96px' });
    }
  }
];

export default function InlineTextEditor({ content, onChange, className = '', placeholder = 'Click to edit text...' }: InlineTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTextSizeDropdown, setShowTextSizeDropdown] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isInteractingWithToolbar, setIsInteractingWithToolbar] = useState(false);
  const [slashCommandState, setSlashCommandState] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [lastSelection, setLastSelection] = useState<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontSize,
      Color.configure({ types: [TextStyle.name, 'heading'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      SlashCommandExtension,
      SimpleBlock,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2 min-w-[100px]',
        },
      }),
      ...ALL_EXTENSIONS,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${className}`,
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
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      
      // Store the current selection
      setLastSelection({ from, to });
      
      // If user has selected text and not interacting with toolbar, show toolbar
      if (from !== to && !isInteractingWithToolbar) {
        setTimeout(() => showToolbarAtSelection(), 0);
      } else if (from === to && !isInteractingWithToolbar && !showToolbar) {
        // Only hide toolbar if not interacting with it and it's not already shown
        setShowToolbar(false);
        setShowColorPicker(false);
        setShowLinkDialog(false);
        setShowTextSizeDropdown(false);
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle clicking outside to hide toolbar
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
        setShowTextSizeDropdown(false);
        setIsInteractingWithToolbar(false);
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      // Only proceed if toolbar is visible
      if (!showToolbar) return;
      
      // Check if click is outside both toolbar and editor
      const isOutsideToolbar = toolbarRef.current && !toolbarRef.current.contains(event.target as Node);
      const isOutsideEditor = editorRef.current && !editorRef.current.contains(event.target as Node);
      
      if (isOutsideToolbar && isOutsideEditor) {
        setShowToolbar(false);
        setShowColorPicker(false);
        setShowLinkDialog(false);
        setShowTextSizeDropdown(false);
        setIsInteractingWithToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [showToolbar]);

  const showToolbarAtSelection = () => {
    if (!editor || !editorRef.current) return;

    const { from, to } = editor.state.selection;
    if (from === to) return;

    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    
    // Calculate viewport-relative position for fixed positioning
    const selectionCenterX = (start.left + end.left) / 2;
    const selectionTopY = start.top;
    
    // Position toolbar above the selection
    let x = selectionCenterX;
    let y = selectionTopY - 10;
    
    // Ensure toolbar doesn't go outside viewport bounds
    const toolbarWidth = 400;
    const toolbarHeight = 50;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Keep toolbar within horizontal bounds
    if (x + toolbarWidth / 2 > viewportWidth) {
      x = viewportWidth - toolbarWidth / 2 - 10;
    }
    if (x - toolbarWidth / 2 < 0) {
      x = toolbarWidth / 2 + 10;
    }
    
    // Keep toolbar within vertical bounds
    if (y < toolbarHeight) {
      y = selectionTopY + 30; // Position below selection if no room above
    }
    if (y > viewportHeight - toolbarHeight) {
      y = viewportHeight - toolbarHeight - 10;
    }
    
    setToolbarPosition({ x, y });
    setShowToolbar(true);
  };

  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    // Prevent the default behavior that would cause the editor to lose focus
    e.preventDefault();
    setIsInteractingWithToolbar(true);
  };

  const handleToolbarMouseUp = () => {
    // Keep the toolbar visible after button clicks
    // Only reset the flag after a short delay to allow for button click handling
    setTimeout(() => {
      setIsInteractingWithToolbar(false);
    }, 100);
  };

  const handleToolbarMouseEnter = () => {
    setIsInteractingWithToolbar(true);
  };

  const handleToolbarMouseLeave = () => {
    setTimeout(() => {
      setIsInteractingWithToolbar(false);
    }, 100);
  };

  const handleLinkAdd = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkDialog(false);
  };

  const handleTextSizeChange = (option: typeof TEXT_SIZE_OPTIONS[0]) => {
    if (!editor) return;
    
    handleButtonClick(() => {
      option.action(editor);
    });
    
    setShowTextSizeDropdown(false);
  };

  const getCurrentTextSize = () => {
    if (!editor) return TEXT_SIZE_OPTIONS[1]; // Default to normal text
    
    const activeOption = TEXT_SIZE_OPTIONS.find(option => option.isActive(editor));
    return activeOption || TEXT_SIZE_OPTIONS[1];
  };

  const handleButtonClick = (action: () => void) => {
    // Execute the action
    action();
    
    // Restore selection if it was lost
    if (lastSelection && lastSelection.from !== lastSelection.to) {
      setTimeout(() => {
        editor?.commands.setTextSelection({
          from: lastSelection.from,
          to: lastSelection.to,
        });
      }, 10);
    }
  };

  const colors = [
    '#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#000000'
  ];

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

  // Initialize simple block system
  const initializeSimpleBlockSystem = () => {
    if (!editor) return;
    
    const doc = editor.state.doc;
    
    // Only initialize if the document is empty or has no blocks
    if (doc.childCount === 0 || (doc.childCount === 1 && doc.firstChild?.type.name === 'paragraph' && doc.firstChild?.content.size === 0)) {
      // Create initial empty block
      const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const initialBlock = editor.schema.nodes.simpleBlock.create(
        { id: blockId },
        editor.schema.nodes.paragraph.create()
      );
      
      const tr = editor.state.tr.replaceWith(0, doc.content.size, initialBlock);
      editor.view.dispatch(tr);
    }
  };

  // Initialize block system only once when editor is ready and content is empty
  useEffect(() => {
    if (editor && !content) {
      // Small delay to ensure editor is ready
      setTimeout(() => {
        initializeSimpleBlockSystem();
      }, 100);
    }
  }, [editor]);

  // const handleBlockReorder = (blocks: any[]) => {
  //   // Optional callback when blocks are reordered
  //   console.log('Blocks reordered:', blocks);
  // };

  if (!editor) {
    return (
      <div className={`${className} text-gray-400 italic`}>
        {placeholder}
      </div>
    );
  }

  return (
    // <DragDropContainer editor={editor} onBlockReorder={handleBlockReorder}>
      <div className="relative" ref={editorRef}>
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="fixed z-[9999] bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 flex items-center space-x-1"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
          onMouseDown={handleToolbarMouseDown}
          onMouseUp={handleToolbarMouseUp}
          onMouseEnter={handleToolbarMouseEnter}
          onMouseLeave={handleToolbarMouseLeave}
        >
          {/* Text Size Dropdown */}
          <div className="relative">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setShowTextSizeDropdown(!showTextSizeDropdown);
              }}
              className="p-1 px-2 rounded hover:bg-gray-800 transition-colors text-gray-300 hover:text-white flex items-center space-x-1"
              title="Text Size"
            >
              <Type size={16} />
              <span className="text-xs">{getCurrentTextSize().label}</span>
              <ChevronDown size={12} />
            </button>

            {showTextSizeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-1 z-[10000] min-w-[160px] max-h-64 overflow-y-auto">
                {TEXT_SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleTextSizeChange(option);
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors flex items-center text-gray-300 hover:text-white"
                  >
                    <div className="w-4 flex-shrink-0 mr-2">
                      {option.isActive(editor) && <Check size={14} />}
                    </div>
                    <span className={`${option.className} block truncate`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* Text Formatting */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleButtonClick(() => {
                editor.chain().focus().toggleBold().run();
              });
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
              handleButtonClick(() => {
                editor.chain().focus().toggleItalic().run();
              });
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
              handleButtonClick(() => {
                editor.chain().focus().toggleUnderline().run();
              });
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
              handleButtonClick(() => {
                editor.chain().focus().toggleStrike().run();
              });
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

          {/* Text Alignment */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleButtonClick(() => {
                editor.chain().focus().setTextAlign('left').run();
              });
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
              handleButtonClick(() => {
                editor.chain().focus().setTextAlign('center').run();
              });
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
                      handleButtonClick(() => {
                        editor.chain().focus().setColor(color).run();
                      });
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
    // </DragDropContainer>
  );
} 