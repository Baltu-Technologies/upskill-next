'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Grid, Columns } from 'lucide-react';
import './table-styles.css';

interface TableBasedColumnEditorProps {
  content?: string;
  onContentChange?: (content: string) => void;
  className?: string;
}

export default function TableBasedColumnEditor({
  content = '',
  onContentChange,
  className = ''
}: TableBasedColumnEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable extensions that we configure separately to prevent duplicates
        underline: false,
      }),
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-separate border-spacing-0 my-4',
        },
        handleWidth: 5,
        cellMinWidth: 25,
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 p-4 align-top bg-slate-50 text-slate-700',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none',
      },
    },
    onCreate: ({ editor }) => {
      // Debug: Log extension configuration to verify no duplicates
      console.log('🔧 TableBasedColumnEditor created with extensions:', 
        editor.extensionManager.extensions.map(ext => ext.name).join(', '));
      setIsInitialized(true);
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange?.(html);
    },
  });

  const insertColumnTable = (columns: number) => {
    if (!editor) return;
    
    editor.commands.insertTable({
      rows: 1,
      cols: columns,
      withHeaderRow: false,
    });
    
    // Add some default content to demonstrate columns
    const defaultContent = [
      '<h3>Column 1</h3><p>Add your content here...</p>',
      '<h3>Column 2</h3><p>Add your content here...</p>',
      '<h3>Column 3</h3><p>Add your content here...</p>',
      '<h3>Column 4</h3><p>Add your content here...</p>',
      '<h3>Column 5</h3><p>Add your content here...</p>',
    ];
    
    // Add some default content to demonstrate columns
    setTimeout(() => {
      try {
        // Try to set default content for each column
        for (let i = 0; i < columns && i < defaultContent.length; i++) {
          editor.commands.setCellSelection({ anchorCell: i, headCell: i });
          editor.commands.setContent(defaultContent[i]);
        }
        // Move cursor to first cell
        editor.commands.setCellSelection({ anchorCell: 0, headCell: 0 });
      } catch (error) {
        console.log('Could not set default content:', error);
      }
    }, 100);
    
    setIsInitialized(true);
  };

  const hasTable = editor?.isActive('table');

  return (
    <div className={`table-column-editor ${className}`}>
      {/* Column Layout Controls */}
      <div className="mb-4 p-3 bg-slate-100 rounded-lg border border-slate-300">
        <h4 className="text-sm font-medium mb-2 text-slate-700">Column Layout</h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertColumnTable(2)}
            className="h-auto p-3 flex flex-col items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            <span className="text-xs">2 Columns</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertColumnTable(3)}
            className="h-auto p-3 flex flex-col items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            <span className="text-xs">3 Columns</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertColumnTable(4)}
            className="h-auto p-3 flex flex-col items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            <span className="text-xs">4 Columns</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertColumnTable(5)}
            className="h-auto p-3 flex flex-col items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            <span className="text-xs">5 Columns</span>
          </Button>
        </div>
        
        {/* Table Controls - Only show when table is active */}
        {hasTable && (
          <div className="border-t pt-3">
            <h5 className="text-xs font-medium mb-2 text-slate-600">Table Controls</h5>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.commands.addColumnBefore()}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Column Before
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.commands.addColumnAfter()}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Column After
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.commands.deleteColumn()}
                className="text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete Column
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.commands.deleteTable()}
                className="text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete Table
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="table-container prose prose-slate max-w-none">
        <EditorContent editor={editor} />
      </div>
      
      {/* Help Text */}
      <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded border">
        <p className="mb-2">
          💡 <strong>How to use:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click a column layout button above to create a column system</li>
          <li>Click in any column to start editing</li>
          <li>Drag column borders to resize</li>
          <li>Use table controls to add/remove columns</li>
          <li>Each column supports rich text formatting</li>
        </ul>
      </div>
    </div>
  );
} 