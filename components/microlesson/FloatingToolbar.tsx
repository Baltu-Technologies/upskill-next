'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Palette,
  Type,
  Link2,
  X,
  Heading
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: any;
  position: { x: number; y: number };
  formattingInProgressRef: React.MutableRefObject<boolean>;
  isVisible: boolean;
  onClose: () => void;
}

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Gray', value: '#6b7280' },
];



const HEADING_OPTIONS = [
  // Section 1: Text Sizes (Paragraph variations)
  { 
    label: 'Small Text', 
    value: 'small-text', 
    section: 'text-sizes',
    action: (editor: any) => {
      return editor.chain().focus().setParagraph().setFontSize('14px').run();
    }
  },
  { 
    label: 'Medium Text', 
    value: 'medium-text', 
    section: 'text-sizes',
    action: (editor: any) => {
      return editor.chain().focus().setParagraph().setFontSize('16px').run();
    }
  },
  { 
    label: 'Large Text', 
    value: 'large-text', 
    section: 'text-sizes',
    action: (editor: any) => {
      return editor.chain().focus().setParagraph().setFontSize('18px').run();
    }
  },
  
  // Section 2: Headings
  { 
    label: 'Heading 1', 
    value: 'h1', 
    section: 'headings',
    action: (editor: any) => {
      return editor.chain().focus().setHeading({ level: 1 }).run();
    }
  },
  { 
    label: 'Heading 2', 
    value: 'h2', 
    section: 'headings',
    action: (editor: any) => {
      return editor.chain().focus().setHeading({ level: 2 }).run();
    }
  },
  { 
    label: 'Heading 3', 
    value: 'h3', 
    section: 'headings',
    action: (editor: any) => {
      return editor.chain().focus().setHeading({ level: 3 }).run();
    }
  },
  { 
    label: 'Heading 4', 
    value: 'h4', 
    section: 'headings',
    action: (editor: any) => {
      return editor.chain().focus().setHeading({ level: 4 }).run();
    }
  },
  
  // Section 3: Title Text (Large display sizes)
  { 
    label: 'Title', 
    value: 'title', 
    section: 'titles',
    action: (editor: any) => {
      return editor.chain().focus().setParagraph().setFontSize('32px').run();
    }
  },
  { 
    label: 'Display', 
    value: 'display', 
    section: 'titles',
    action: (editor: any) => {
      return editor.chain().focus().setParagraph().setFontSize('48px').run();
    }
  },
  { 
    label: 'Monster', 
    value: 'monster', 
    section: 'titles',
    action: (editor: any) => {
      return editor.chain().focus().setParagraph().setFontSize('64px').run();
    }
  },
];

const FloatingToolbar = function FloatingToolbar({ editor, position, formattingInProgressRef, isVisible, onClose }: FloatingToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const toolbarRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const headingPickerRef = useRef<HTMLDivElement>(null);
  
  // Generate instance ID for debugging (only create once per instance)
  const instanceId = useRef(Math.random().toString(36).substr(2, 5)).current;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose();
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (headingPickerRef.current && !headingPickerRef.current.contains(event.target as Node)) {
        setShowHeadingPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Debug state changes (only log meaningful changes)
  useEffect(() => {
    if (showHeadingPicker) {
      console.log(`🔄 [${instanceId}] Heading dropdown OPENED`);
    }
  }, [showHeadingPicker, instanceId]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showHeadingPicker && headingPickerRef.current && !headingPickerRef.current.contains(event.target as Node)) {
        console.log(`🎯 [${instanceId}] Clicking outside heading dropdown, closing...`);
        setShowHeadingPicker(false);
      }
    };

    if (showHeadingPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showHeadingPicker, instanceId]);

  // Apply color formatting
  const applyColor = (color: string) => {
    console.log('🎨 Applying color:', color);
    try {
      formattingInProgressRef.current = true;
      console.log('🔒 Setting formatting in progress = true');
      
      const result = editor.chain().focus().setColor(color).run();
      console.log('Color command result:', result);
      
      setTimeout(() => {
        console.log('Color applied successfully');
        formattingInProgressRef.current = false;
        console.log('🔓 Setting formatting in progress = false');
      }, 50);
    } catch (error) {
      console.error('Error applying color:', error);
      formattingInProgressRef.current = false;
      console.log('🔓 Setting formatting in progress = false (error case)');
    }
    setShowColorPicker(false);
  };

  // Handle link creation
  const handleLinkSubmit = () => {
    console.log('🔗 Applying link:', linkUrl);
    try {
      formattingInProgressRef.current = true;
      console.log('🔒 Setting formatting in progress = true');
      
      if (linkUrl) {
        const result = editor.chain().focus().setLink({ href: linkUrl }).run();
        console.log('Set link command result:', result);
      } else {
        const result = editor.chain().focus().unsetLink().run();
        console.log('Unset link command result:', result);
      }
      
      setTimeout(() => {
        console.log('Link applied successfully');
        formattingInProgressRef.current = false;
        console.log('🔓 Setting formatting in progress = false');
      }, 50);
    } catch (error) {
      console.error('Error applying link:', error);
      formattingInProgressRef.current = false;
      console.log('🔓 Setting formatting in progress = false (error case)');
    }
    setShowLinkDialog(false);
    setLinkUrl('');
  };

  if (!editor) {
    console.log('❌ FloatingToolbar: No editor instance provided');
    return null;
  }

  const toolbarStyle = {
    position: 'fixed' as const,
    left: Math.max(10, Math.min(position.x, window.innerWidth - 400)),
    top: Math.max(10, position.y - 60),
    zIndex: 9999,
  };

  return (
    <>
      <div 
        ref={toolbarRef}
        style={{
          ...toolbarStyle,
          display: isVisible ? 'flex' : 'none',
        }}
        className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-2 flex items-center gap-1 text-white"
      >
        {/* Heading Dropdown */}
        <div className="relative">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(`🎯 [${instanceId}] Heading button clicked! ${showHeadingPicker ? 'CLOSING' : 'OPENING'} dropdown`);
              formattingInProgressRef.current = true;
              setShowHeadingPicker(!showHeadingPicker);
              // Reset formatting flag after a short delay
              setTimeout(() => {
                formattingInProgressRef.current = false;
              }, 100);
            }}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
            title="Heading Style"
          >
            <Heading size={14} />
            <span className="text-xs">▼</span>
          </button>
          {showHeadingPicker && (
          <div 
            ref={headingPickerRef}
            className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg min-w-[160px] z-50"
            style={{ 
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              zIndex: 9999 
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {HEADING_OPTIONS.map((heading, index) => {
              const isFirstInSection = index === 0 || 
                HEADING_OPTIONS[index - 1]?.section !== heading.section;
              const isLastInSection = index === HEADING_OPTIONS.length - 1 || 
                HEADING_OPTIONS[index + 1]?.section !== heading.section;
              
              return (
                <div key={heading.value}>
                  {/* Section separator */}
                  {isFirstInSection && index > 0 && (
                    <div className="border-t border-slate-600 my-1"></div>
                  )}
                  
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      try {
                        formattingInProgressRef.current = true;
                        
                        // Apply the heading/text size action
                        const result = heading.action(editor);
                        console.log(`${heading.label} applied:`, result);
                        
                        setTimeout(() => {
                          formattingInProgressRef.current = false;
                        }, 100);
                      } catch (error) {
                        console.error(`Error applying ${heading.label}:`, error);
                        formattingInProgressRef.current = false;
                      }
                      setShowHeadingPicker(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 transition-colors ${
                      isFirstInSection && index === 0 ? 'rounded-t-lg' : ''
                    } ${
                      isLastInSection && index === HEADING_OPTIONS.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                  >
                    <span className={`${
                      heading.section === 'titles' ? 'font-semibold' : ''
                    } ${
                      heading.section === 'headings' ? 'font-medium' : ''
                    }`}>
                      {heading.label}
                    </span>
                    {heading.section === 'text-sizes' && (
                      <span className="text-xs text-slate-400 ml-2">text</span>
                    )}
                    {heading.section === 'titles' && (
                      <span className="text-xs text-slate-400 ml-2">display</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        </div>

        <div className="w-px h-5 bg-slate-600"></div>

        {/* Basic Formatting */}
        <button
          onMouseDown={(e) => {
            // Use onMouseDown instead of onClick to prevent editor blur
            e.preventDefault();
            e.stopPropagation();
            
            console.log('💪 Bold button clicked - DETAILED DEBUG');
            
            // Detailed editor state before
            console.log('📊 Editor state before bold:', {
              isFocused: editor.isFocused,
              isEditable: editor.isEditable,
              canExecute: editor.can().toggleBold(),
              selection: {
                empty: editor.state.selection.empty,
                from: editor.state.selection.from,
                to: editor.state.selection.to,
                content: editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
              },
              currentlyBold: editor.isActive('bold'),
              editorHTML: editor.getHTML()
            });

            try {
              // Signal that formatting is in progress
              formattingInProgressRef.current = true;
              console.log('🔒 Setting formatting in progress = true');
              
              // Store selection before any operations
              const { from, to } = editor.state.selection;
              
              // Method 1: Direct command without focus
              console.log('🔄 Method 1: Direct toggleBold...');
              const directResult = editor.commands.toggleBold();
              console.log('Direct result:', directResult);
              
              // Method 2: Chain with focus 
              console.log('🔄 Method 2: Chain with focus...');
              const chainResult = editor.chain().focus().toggleBold().run();
              console.log('Chain result:', chainResult);
              
              // Method 3: Low-level mark toggle
              console.log('🔄 Method 3: Low-level mark toggle...');
              if (from !== to) {
                const markResult = editor.chain()
                  .setTextSelection({ from, to })
                  .toggleMark('bold')
                  .run();
                console.log('Mark toggle result:', markResult);
              }
              
              // Check results after operations
              setTimeout(() => {
                console.log('📈 Final results after bold commands:', {
                  isBoldActive: editor.isActive('bold'),
                  editorHTML: editor.getHTML(),
                  selection: {
                    from: editor.state.selection.from,
                    to: editor.state.selection.to,
                    empty: editor.state.selection.empty,
                    content: editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
                  },
                  editorFocused: editor.isFocused
                });
                
                // Reset formatting in progress flag
                formattingInProgressRef.current = false;
                console.log('🔓 Setting formatting in progress = false');
              }, 100);
            } catch (error) {
              console.error('Error toggling bold:', error);
              // Reset formatting flag even on error
              formattingInProgressRef.current = false;
              console.log('🔓 Setting formatting in progress = false (error case)');
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bold') ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔹 Italic button clicked');
            try {
              const result = editor.commands.toggleItalic();
              console.log('Italic command result:', result);
              
              setTimeout(() => {
                console.log('Is italic active after:', editor.isActive('italic'));
              }, 50);
            } catch (error) {
              console.error('Error toggling italic:', error);
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('italic') ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔺 Underline button clicked - DETAILED DEBUG');
            console.log('📊 Editor state before underline:', {
              isFocused: editor.isFocused,
              isEditable: editor.isEditable,
              canExecute: editor.can().toggleUnderline(),
              selection: {
                empty: editor.state.selection.empty,
                from: editor.state.selection.from,
                to: editor.state.selection.to,
                content: editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
              },
              currentlyUnderlined: editor.isActive('underline')
            });

            try {
              formattingInProgressRef.current = true;
              console.log('🔒 Setting formatting in progress = true');
              
              const { from, to } = editor.state.selection;
              
              // Method 1: Direct command
              console.log('🔄 Method 1: Direct toggleUnderline...');
              const directResult = editor.commands.toggleUnderline();
              console.log('Direct result:', directResult);
              
              // Method 2: Chain with focus
              console.log('🔄 Method 2: Chain with focus...');
              const chainResult = editor.chain().focus().toggleUnderline().run();
              console.log('Chain result:', chainResult);
              
              // Method 3: Low-level mark toggle
              console.log('🔄 Method 3: Low-level mark toggle...');
              if (from !== to) {
                const markResult = editor.chain()
                  .setTextSelection({ from, to })
                  .toggleMark('underline')
                  .run();
                console.log('Mark toggle result:', markResult);
              }
              
              setTimeout(() => {
                console.log('📈 Final results after underline commands:', {
                  isUnderlineActive: editor.isActive('underline'),
                  editorHTML: editor.getHTML()
                });
                formattingInProgressRef.current = false;
                console.log('🔓 Setting formatting in progress = false');
              }, 100);
            } catch (error) {
              console.error('Error toggling underline:', error);
              formattingInProgressRef.current = false;
              console.log('🔓 Setting formatting in progress = false (error case)');
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('underline') ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Underline"
        >
          <Underline size={14} />
        </button>
        
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔻 Strikethrough button clicked - DETAILED DEBUG');
            console.log('📊 Editor state before strike:', {
              isFocused: editor.isFocused,
              isEditable: editor.isEditable,
              canExecute: editor.can().toggleStrike(),
              selection: {
                empty: editor.state.selection.empty,
                from: editor.state.selection.from,
                to: editor.state.selection.to,
                content: editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
              },
              currentlyStruck: editor.isActive('strike')
            });

            try {
              formattingInProgressRef.current = true;
              console.log('🔒 Setting formatting in progress = true');
              
              const { from, to } = editor.state.selection;
              
              // Method 1: Direct command
              console.log('🔄 Method 1: Direct toggleStrike...');
              const directResult = editor.commands.toggleStrike();
              console.log('Direct result:', directResult);
              
              // Method 2: Chain with focus
              console.log('🔄 Method 2: Chain with focus...');
              const chainResult = editor.chain().focus().toggleStrike().run();
              console.log('Chain result:', chainResult);
              
              // Method 3: Low-level mark toggle
              console.log('🔄 Method 3: Low-level mark toggle...');
              if (from !== to) {
                const markResult = editor.chain()
                  .setTextSelection({ from, to })
                  .toggleMark('strike')
                  .run();
                console.log('Mark toggle result:', markResult);
              }
              
              setTimeout(() => {
                console.log('📈 Final results after strike commands:', {
                  isStrikeActive: editor.isActive('strike'),
                  editorHTML: editor.getHTML()
                });
                formattingInProgressRef.current = false;
                console.log('🔓 Setting formatting in progress = false');
              }, 100);
            } catch (error) {
              console.error('Error toggling strike:', error);
              formattingInProgressRef.current = false;
              console.log('🔓 Setting formatting in progress = false (error case)');
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('strike') ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </button>

        <div className="w-px h-5 bg-slate-600"></div>

        {/* Text Alignment */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('◀️ Align Left button clicked');
            try {
              formattingInProgressRef.current = true;
              const result = editor.chain().focus().setTextAlign('left').run();
              console.log('Align left command result:', result);
              setTimeout(() => {
                console.log('Is left aligned:', editor.isActive({ textAlign: 'left' }));
                formattingInProgressRef.current = false;
              }, 50);
            } catch (error) {
              console.error('Error setting text align left:', error);
              formattingInProgressRef.current = false;
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Align Left"
        >
          <AlignLeft size={14} />
        </button>
        
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('↔️ Align Center button clicked');
            try {
              formattingInProgressRef.current = true;
              const result = editor.chain().focus().setTextAlign('center').run();
              console.log('Align center command result:', result);
              setTimeout(() => {
                console.log('Is center aligned:', editor.isActive({ textAlign: 'center' }));
                formattingInProgressRef.current = false;
              }, 50);
            } catch (error) {
              console.error('Error setting text align center:', error);
              formattingInProgressRef.current = false;
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Align Center"
        >
          <AlignCenter size={14} />
        </button>
        
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('▶️ Align Right button clicked');
            try {
              formattingInProgressRef.current = true;
              const result = editor.chain().focus().setTextAlign('right').run();
              console.log('Align right command result:', result);
              setTimeout(() => {
                console.log('Is right aligned:', editor.isActive({ textAlign: 'right' }));
                formattingInProgressRef.current = false;
              }, 50);
            } catch (error) {
              console.error('Error setting text align right:', error);
              formattingInProgressRef.current = false;
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Align Right"
        >
          <AlignRight size={14} />
        </button>

        <div className="w-px h-5 bg-slate-600"></div>

        {/* Lists */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔸 Bullet List button clicked');
            try {
              formattingInProgressRef.current = true;
              const result = editor.chain().focus().toggleBulletList().run();
              console.log('Bullet list command result:', result);
              setTimeout(() => {
                console.log('Is bullet list active:', editor.isActive('bulletList'));
                formattingInProgressRef.current = false;
              }, 50);
            } catch (error) {
              console.error('Error toggling bullet list:', error);
              formattingInProgressRef.current = false;
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bulletList') ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Bullet List"
        >
          <List size={14} />
        </button>
        
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔢 Numbered List button clicked');
            try {
              formattingInProgressRef.current = true;
              const result = editor.chain().focus().toggleOrderedList().run();
              console.log('Ordered list command result:', result);
              setTimeout(() => {
                console.log('Is ordered list active:', editor.isActive('orderedList'));
                formattingInProgressRef.current = false;
              }, 50);
            } catch (error) {
              console.error('Error toggling ordered list:', error);
              formattingInProgressRef.current = false;
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('orderedList') ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>

        <div className="w-px h-5 bg-slate-600"></div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            title="Text Color"
          >
            <Palette size={14} />
          </button>
          {showColorPicker && (
            <div 
              ref={colorPickerRef}
              className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-3 z-10 min-w-[240px]"
            >
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      applyColor(color.value);
                    }}
                    className="w-8 h-8 rounded border-2 border-slate-600 hover:border-slate-400 hover:scale-110 transition-transform flex items-center justify-center"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {(color.value === '#000000' || color.value === '#FFFFFF') && (
                      <span className={`text-xs ${color.value === '#000000' ? 'text-white' : 'text-black'}`}>
                        A
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Link */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowLinkDialog(true);
          }}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('link') ? 'bg-blue-600' : 'hover:bg-slate-700'
          }`}
          title="Add Link"
        >
          <Link2 size={14} />
        </button>

        <div className="w-px h-5 bg-slate-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10000">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 max-w-md w-full mx-4">
            <h3 className="text-white font-medium mb-3">Add Link</h3>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleLinkSubmit()}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleLinkSubmit}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                Add Link
              </button>
              <button
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                }}
                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors"
              >
                Cancel
              </button>
              {editor.isActive('link') && (
                <button
                  onClick={() => {
                    console.log('🔗 Removing link');
                    try {
                      formattingInProgressRef.current = true;
                      console.log('🔒 Setting formatting in progress = true');
                      
                      const result = editor.chain().focus().unsetLink().run();
                      console.log('Unset link command result:', result);
                      
                      setTimeout(() => {
                        console.log('Link removed successfully');
                        formattingInProgressRef.current = false;
                        console.log('🔓 Setting formatting in progress = false');
                      }, 50);
                    } catch (error) {
                      console.error('Error removing link:', error);
                      formattingInProgressRef.current = false;
                      console.log('🔓 Setting formatting in progress = false (error case)');
                    }
                    setShowLinkDialog(false);
                    setLinkUrl('');
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  Remove Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingToolbar;