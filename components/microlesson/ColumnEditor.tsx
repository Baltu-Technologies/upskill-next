'use client';

import React, { useState } from 'react';
import { ColumnContent, ColumnLayout } from '@/types/microlesson/slide';
import EnhancedInlineTextEditor from './EnhancedInlineTextEditor';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ColumnEditorProps {
  layout: ColumnLayout;
  columns: ColumnContent[];
  onColumnsChange: (columns: ColumnContent[]) => void;
  className?: string;
}

export default function ColumnEditor({ 
  layout, 
  columns, 
  onColumnsChange, 
  className = '' 
}: ColumnEditorProps) {
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

  // Get column count based on layout
  const getColumnCount = (layout: ColumnLayout): number => {
    switch (layout) {
      case '2-equal':
      case '2-left':
      case '2-right':
        return 2;
      case '3-columns':
        return 3;
      case '4-columns':
        return 4;
      default:
        return 1;
    }
  };

  // Get column width classes based on layout
  const getColumnClasses = (layout: ColumnLayout, index: number): string => {
    switch (layout) {
      case '2-equal':
        return 'w-1/2';
      case '2-left':
        return index === 0 ? 'w-3/5' : 'w-2/5';
      case '2-right':
        return index === 0 ? 'w-2/5' : 'w-3/5';
      case '3-columns':
        return 'w-1/3';
      case '4-columns':
        return 'w-1/4';
      default:
        return 'w-full';
    }
  };

  // Initialize columns if needed
  const initializeColumns = () => {
    const columnCount = getColumnCount(layout);
    const existingColumns = columns || [];
    const newColumns: ColumnContent[] = [];

    for (let i = 0; i < columnCount; i++) {
      if (existingColumns[i]) {
        newColumns.push(existingColumns[i]);
      } else {
        newColumns.push({
          id: `column-${i}`,
          blocks: [],
          content: ''
        });
      }
    }

    if (newColumns.length !== existingColumns.length) {
      onColumnsChange(newColumns);
    }
    return newColumns;
  };

  const currentColumns = initializeColumns();

  const handleColumnContentChange = (columnId: string, content: string) => {
    const updatedColumns = currentColumns.map(column => 
      column.id === columnId 
        ? { ...column, content }
        : column
    );
    onColumnsChange(updatedColumns);
  };

  const handleStartEditing = (columnId: string) => {
    setEditingColumn(columnId);
  };

  const handleFinishEditing = () => {
    setEditingColumn(null);
  };

  const addBlock = (columnId: string) => {
    const updatedColumns = currentColumns.map(column => 
      column.id === columnId 
        ? { 
            ...column, 
            content: (column.content || '') + '\n<div data-block-id="block-' + Date.now() + '" class="simple-block"><p>New block</p></div>'
          }
        : column
    );
    onColumnsChange(updatedColumns);
    handleStartEditing(columnId);
  };

  if (layout === 'none') {
    return null;
  }

  return (
    <div className={`column-editor ${className}`}>
      <div className="flex gap-4 h-full">
        {currentColumns.map((column, index) => (
          <div
            key={column.id}
            className={`${getColumnClasses(layout, index)} border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 relative group`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Column {index + 1}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addBlock(column.id)}
                  className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Column Content */}
            <div className="min-h-[200px] relative">
              {editingColumn === column.id ? (
                <div className="space-y-2">
                  <EnhancedInlineTextEditor
                    content={column.content || ''}
                    onUpdate={(content) => handleColumnContentChange(column.id, content)}
                    placeholder="Start typing in this column..."
                    className="min-h-[150px]"
                    blockType="content"
                    onBlur={handleFinishEditing}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleFinishEditing}
                      variant="default"
                    >
                      Done
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleFinishEditing}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="cursor-pointer min-h-[150px] p-2 rounded border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  onClick={() => handleStartEditing(column.id)}
                >
                  {column.content ? (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: column.content }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <div className="text-sm mb-1">Click to edit</div>
                        <div className="text-xs">Column {index + 1}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 