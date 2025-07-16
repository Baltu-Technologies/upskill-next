'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface DragDropContainerProps {
  children: React.ReactNode;
  editor: any;
  onBlockReorder?: (blocks: any[]) => void;
}

export const DragDropContainer: React.FC<DragDropContainerProps> = ({
  children,
  editor,
  onBlockReorder,
}) => {
  const [activeBlock, setActiveBlock] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  
  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Extract blocks from editor content
  const extractBlocks = useCallback(() => {
    if (!editor) return [];
    
    const doc = editor.state.doc;
    const blocks: any[] = [];
    
    doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'dragDropBlock') {
        blocks.push({
          id: node.attrs.id,
          position: pos,
          node: node,
          content: node.content,
        });
      }
    });
    
    return blocks.sort((a, b) => a.position - b.position);
  }, [editor]);

  // Update blocks when editor content changes
  useEffect(() => {
    if (!editor) return;
    
    const updateBlocks = () => {
      const newBlocks = extractBlocks();
      // Only update if blocks have actually changed
      if (JSON.stringify(newBlocks.map(b => b.id)) !== JSON.stringify(blocks.map(b => b.id))) {
        setBlocks(newBlocks);
      }
    };

    // Update blocks initially
    updateBlocks();

    // Use a debounced listener to prevent excessive updates
    let updateTimeout: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(updateBlocks, 100);
    };

    editor.on('update', debouncedUpdate);
    
    return () => {
      editor.off('update', debouncedUpdate);
      clearTimeout(updateTimeout);
    };
  }, [editor]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    const activeBlockData = blocks.find(block => block.id === active.id);
    setActiveBlock(activeBlockData);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
    // This can be used to show visual feedback during dragging
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveBlock(null);
    
    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = blocks.findIndex(block => block.id === active.id);
    const overIndex = blocks.findIndex(block => block.id === over.id);
    
    if (activeIndex === -1 || overIndex === -1) {
      return;
    }

    // Move the block in the editor
    moveBlock(activeIndex, overIndex);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (!editor || fromIndex === toIndex) return;

    const fromBlock = blocks[fromIndex];
    const toBlock = blocks[toIndex];
    
    if (!fromBlock || !toBlock) return;

    // Use a more stable approach to move blocks
    try {
      const doc = editor.state.doc;
      const tr = editor.state.tr;
      
      // Get the actual positions in the document
      const fromPos = fromBlock.position;
      const toPos = toBlock.position;
      const blockSize = fromBlock.node.nodeSize;
      
      // Create a copy of the block to move
      const blockToMove = fromBlock.node.copy(fromBlock.node.content);
      
      // Determine the correct insertion position
      let insertPos = toPos;
      if (fromIndex < toIndex) {
        // Moving down - insert after the target
        insertPos = toPos + toBlock.node.nodeSize;
      }
      
      // If moving up, adjust position after deletion
      if (fromPos < insertPos) {
        insertPos -= blockSize;
      }
      
      // Perform the move in a single transaction
      tr.delete(fromPos, fromPos + blockSize);
      tr.insert(insertPos, blockToMove);
      
      // Apply the transaction
      editor.view.dispatch(tr);
      
      // Notify parent component if callback is provided
      if (onBlockReorder) {
        onBlockReorder(blocks);
      }
    } catch (error) {
      console.error('Error moving block:', error);
    }
  };

  const blockIds = blocks.map(block => block.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
        <div className="drag-drop-editor-container relative">
          {children}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeBlock ? (
          <div className="
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-600 
            rounded-lg shadow-lg 
            p-3 
            opacity-90
            transform rotate-3
          ">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Moving block...
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {activeBlock.node.textContent.substring(0, 50)}
              {activeBlock.node.textContent.length > 50 ? '...' : ''}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropContainer; 