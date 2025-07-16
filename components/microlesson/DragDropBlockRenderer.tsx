'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

interface DragDropBlockRendererProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
  editor: any;
  getPos: () => number;
  selected: boolean;
}

export const DragDropBlockRenderer: React.FC<DragDropBlockRendererProps> = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
  selected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
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

  const handleAddBlock = () => {
    const pos = getPos() + node.nodeSize;
    const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a new block more safely
    const newBlock = editor.schema.nodes.dragDropBlock.create(
      { id: blockId, type: 'content' },
      editor.schema.nodes.paragraph.create()
    );
    
    const tr = editor.state.tr.insert(pos, newBlock);
    editor.view.dispatch(tr);
    
    // Focus the new block
    setTimeout(() => {
      editor.commands.focus(pos + 1);
    }, 10);
  };

  const handleDeleteBlock = () => {
    const pos = getPos();
    editor.chain()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .focus()
      .run();
  };

  return (
    <NodeViewWrapper
      ref={setNodeRef}
      style={style}
      className={`
        drag-drop-block-wrapper
        relative group
        ${isDragging ? 'opacity-50' : ''}
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${isHovered ? 'bg-gray-50 dark:bg-gray-800' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
    >
      {/* Drop indicator */}
      <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Block content container */}
      <div className="relative min-h-[1.5rem] py-1">
        {/* Drag handle and actions */}
        <div 
          className={`
            absolute left-0 top-0 -ml-10 flex items-center space-x-1 transition-opacity
            ${isHovered || showActions ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Drag handle */}
          <button
            {...listeners}
            className="
              w-6 h-6 flex items-center justify-center
              hover:bg-gray-100 dark:hover:bg-gray-700
              rounded cursor-grab active:cursor-grabbing
              text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            "
            title="Drag to move"
          >
            <GripVertical size={14} />
          </button>

          {/* Add block button */}
          <button
            onClick={handleAddBlock}
            className="
              w-6 h-6 flex items-center justify-center
              hover:bg-gray-100 dark:hover:bg-gray-700
              rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            "
            title="Add block below"
          >
            <Plus size={14} />
          </button>

          {/* Delete block button */}
          <button
            onClick={handleDeleteBlock}
            className="
              w-6 h-6 flex items-center justify-center
              hover:bg-red-100 dark:hover:bg-red-900
              rounded text-gray-400 hover:text-red-600 dark:hover:text-red-300
            "
            title="Delete block"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Block content */}
        <NodeViewContent className="block-content min-h-[1.5rem] focus:outline-none" />
      </div>

      {/* Bottom drop indicator */}
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </NodeViewWrapper>
  );
};

export default DragDropBlockRenderer; 