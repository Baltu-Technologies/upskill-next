'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

interface EnhancedBlockRendererProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
  editor: any;
  getPos: () => number;
  selected: boolean;
}

export const EnhancedBlockRenderer: React.FC<EnhancedBlockRendererProps> = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
  selected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropIndicator, setShowDropIndicator] = useState<'above' | 'below' | null>(null);
  const [draggedOver, setDraggedOver] = useState(false);
  const [blockElement, setBlockElement] = useState<HTMLDivElement | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active,
  } = useSortable({
    id: node.attrs.id,
    data: {
      type: 'block',
      blockId: node.attrs.id,
      position: getPos(),
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Check if block is empty
  const isEmpty = node.content.size === 0 || 
    (node.content.firstChild && node.content.firstChild.content.size === 0);

  const handleAddBlock = (position: 'above' | 'below' = 'below') => {
    const currentPos = getPos();
    const insertPos = position === 'above' ? currentPos : currentPos + node.nodeSize;
    const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    editor.chain()
      .insertContentAt(insertPos, {
        type: 'enhancedBlock',
        attrs: {
          id: blockId,
          type: 'content',
          placeholder: 'Type / to add blocks...'
        },
        content: [{ type: 'paragraph' }]
      })
      .focus(insertPos + 1)
      .run();
  };

  const handleDeleteBlock = () => {
    if (isEmpty) {
      const pos = getPos();
      editor.chain()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .focus()
        .run();
    }
  };

  // Handle drag and drop visual indicators
  useEffect(() => {
    if (isOver && active && active.id !== node.attrs.id) {
      setDraggedOver(true);
      
      // Determine drop position based on cursor position
      const rect = blockElement?.getBoundingClientRect();
      if (rect) {
        const mouseY = (active.data.current as any)?.mouseY;
        const blockMiddle = rect.top + rect.height / 2;
        setShowDropIndicator(mouseY < blockMiddle ? 'above' : 'below');
      }
    } else {
      setDraggedOver(false);
      setShowDropIndicator(null);
    }
  }, [isOver, active, node.attrs.id]);

  return (
    <NodeViewWrapper
      ref={(el: HTMLDivElement | null) => {
        setNodeRef(el);
        setBlockElement(el);
      }}
      style={style}
      className={`
        enhanced-block-wrapper
        relative group
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''}
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${isHovered ? 'bg-gray-50 dark:bg-gray-800' : ''}
        ${draggedOver ? 'bg-blue-50 dark:bg-blue-900' : ''}
        transition-all duration-200 ease-in-out
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
    >
      {/* Drop indicator above */}
      {showDropIndicator === 'above' && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 shadow-lg animate-pulse z-10" />
      )}

      {/* Block content container */}
      <div className="relative min-h-[2rem] py-2 px-1">
        {/* Drag handle and actions */}
        <div 
          className={`
            absolute left-0 top-0 -ml-12 flex items-center space-x-1 transition-opacity duration-200
            ${isHovered || isDragging ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Drag handle */}
          <button
            {...listeners}
            className="
              w-6 h-6 flex items-center justify-center
              hover:bg-gray-200 dark:hover:bg-gray-600
              rounded cursor-grab active:cursor-grabbing
              text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
              transition-colors duration-150
            "
            title="Drag to move"
          >
            <GripVertical size={14} />
          </button>

          {/* Add block above button */}
          <button
            onClick={() => handleAddBlock('above')}
            className="
              w-6 h-6 flex items-center justify-center
              hover:bg-green-100 dark:hover:bg-green-800
              rounded text-gray-400 hover:text-green-600 dark:hover:text-green-300
              transition-colors duration-150
            "
            title="Add block above"
          >
            <Plus size={14} />
          </button>

          {/* Delete block button - only show if empty */}
          {isEmpty && (
            <button
              onClick={handleDeleteBlock}
              className="
                w-6 h-6 flex items-center justify-center
                hover:bg-red-100 dark:hover:bg-red-800
                rounded text-gray-400 hover:text-red-600 dark:hover:text-red-300
                transition-colors duration-150
              "
              title="Delete empty block"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Node content */}
        <div className="block-content relative">
          <NodeViewContent />
          
          {/* Placeholder for empty blocks */}
          {isEmpty && (
            <div 
              className="
                absolute top-0 left-0 right-0 bottom-0 
                flex items-center
                select-none
                enhanced-block-placeholder
                text-gray-400 dark:text-gray-500
                text-sm
                cursor-text
              "
              onClick={(e) => {
                // When clicking on placeholder, position cursor at the beginning of the block
                e.preventDefault();
                e.stopPropagation();
                
                const pos = getPos() + 1; // Position at the start of the block content
                editor.chain().focus(pos).run();
              }}
            >
              {node.attrs.placeholder || 'Type / to add blocks...'}
            </div>
          )}
        </div>

        {/* Quick add button on hover */}
        <div 
          className={`
            absolute right-0 top-0 -mr-8 flex items-center transition-opacity duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <button
            onClick={() => handleAddBlock('below')}
            className="
              w-6 h-6 flex items-center justify-center
              hover:bg-blue-100 dark:hover:bg-blue-800
              rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-300
              transition-colors duration-150
            "
            title="Add block below"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Drop indicator below */}
      {showDropIndicator === 'below' && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 shadow-lg animate-pulse z-10" />
      )}
    </NodeViewWrapper>
  );
};

export default EnhancedBlockRenderer; 