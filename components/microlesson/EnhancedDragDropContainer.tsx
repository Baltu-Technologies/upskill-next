'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface EnhancedDragDropContainerProps {
  children: React.ReactNode;
  editor: any;
  className?: string;
}

export const EnhancedDragDropContainer: React.FC<EnhancedDragDropContainerProps> = ({
  children,
  editor,
  className = ""
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the dragged block in the editor
    const blockData = active.data.current;
    if (blockData) {
      setDraggedBlock(blockData);
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Handle drag over effects here if needed
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    // Update mouse position for drop indicator
    const activeData = active.data.current as any;
    if (activeData && event.delta) {
      activeData.mouseY = (event.activatorEvent as MouseEvent).clientY;
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedBlock(null);
    
    if (!over || active.id === over.id) return;
    
    // Get the positions
    const activeData = active.data.current as any;
    const overData = over.data.current as any;
    
    if (activeData && overData) {
      const activePos = activeData.position;
      const overPos = overData.position;
      
      // Calculate if we're dropping above or below
      const mouseY = (event.activatorEvent as MouseEvent).clientY;
      const overElement = document.querySelector(`[data-block-id="${over.id}"]`);
      
      let targetPos = overPos;
      
      if (overElement) {
        const rect = overElement.getBoundingClientRect();
        const blockMiddle = rect.top + rect.height / 2;
        const dropBelow = mouseY > blockMiddle;
        
        if (dropBelow) {
          // Find the size of the over block
          const overNode = editor.state.doc.nodeAt(overPos);
          if (overNode) {
            targetPos = overPos + overNode.nodeSize;
          }
        }
      }
      
      // Perform the move operation
      if (activePos !== targetPos) {
        // Get the active node
        const activeNode = editor.state.doc.nodeAt(activePos);
        if (activeNode) {
          // Calculate the final position accounting for the removal
          let finalPos = targetPos;
          if (activePos < targetPos) {
            finalPos = targetPos - activeNode.nodeSize;
          }
          
          // Create transaction to move the block
          const tr = editor.state.tr;
          
          // Cut the active node
          const cutContent = tr.doc.cut(activePos, activePos + activeNode.nodeSize);
          
          // Delete the active node
          tr.delete(activePos, activePos + activeNode.nodeSize);
          
          // Insert at the new position
          tr.insert(finalPos, cutContent);
          
          // Dispatch the transaction
          editor.view.dispatch(tr);
          
          // Focus the moved block
          setTimeout(() => {
            editor.commands.focus(finalPos + 1);
          }, 10);
        }
      }
    }
  }, [editor]);

  // Extract block IDs from the editor content
  const getBlockIds = useCallback(() => {
    const blockIds: string[] = [];
    
    editor.state.doc.descendants((node: any) => {
      if (node.type.name === 'enhancedBlock' && node.attrs.id) {
        blockIds.push(node.attrs.id);
      }
    });
    
    return blockIds;
  }, [editor]);

  const blockIds = getBlockIds();

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
        <div className={`enhanced-drag-drop-container ${className}`}>
          {children}
        </div>
      </SortableContext>
      
      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeId && draggedBlock ? (
          <div className="
            bg-white dark:bg-gray-800 
            border-2 border-blue-500 
            rounded-lg shadow-lg 
            p-3 
            opacity-90 
            transform rotate-2
            max-w-md
          ">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Moving block...
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default EnhancedDragDropContainer; 