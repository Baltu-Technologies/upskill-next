'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DragDropBlockRenderer } from './DragDropBlockRenderer';

export interface DragDropBlockAttributes {
  id: string;
  type: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dragDropBlock: {
      /**
       * Create a drag-drop block
       */
      createDragDropBlock: (attributes?: Partial<DragDropBlockAttributes>) => ReturnType;
    };
  }
}

export const DragDropBlock = Node.create<any>({
  name: 'dragDropBlock',
  group: 'block',
  content: 'block+',
  draggable: true,
  isolating: false,
  selectable: true,
  
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-block-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return {
            'data-block-id': attributes.id,
          }
        },
      },
      type: {
        default: 'content',
        parseHTML: element => element.getAttribute('data-block-type'),
        renderHTML: attributes => {
          if (!attributes.type) {
            return {}
          }
          return {
            'data-block-type': attributes.type,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-block-id]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      class: 'drag-drop-block',
    }), 0]
  },

  addCommands() {
    return {
      createDragDropBlock: attributes => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            id: attributes?.id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: attributes?.type || 'content',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'New block',
                },
              ],
            },
          ],
        });
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Enter': ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;
        
        // Check if we're inside a block
        if ($from.depth >= 2 && $from.node(-1).type.name === 'dragDropBlock') {
          const blockNode = $from.node(-1);
          const blockPos = $from.before($from.depth - 1);
          
          // If the current paragraph is empty, don't create a new block
          if ($from.parent.content.size === 0) {
            return false;
          }
          
          // Create a new block after the current one
          const newBlockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newBlock = editor.schema.nodes.dragDropBlock.create(
            { id: newBlockId, type: 'content' },
            editor.schema.nodes.paragraph.create()
          );
          
          const tr = editor.state.tr.insert(blockPos + blockNode.nodeSize, newBlock);
          editor.view.dispatch(tr);
          
          // Focus the new block
          setTimeout(() => {
            editor.commands.focus(blockPos + blockNode.nodeSize + 1);
          }, 10);
          
          return true;
        }
        
        return false;
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DragDropBlockRenderer);
  },
}); 