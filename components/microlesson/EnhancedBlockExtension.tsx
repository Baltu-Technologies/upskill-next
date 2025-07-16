'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import { EnhancedBlockRenderer } from './EnhancedBlockRenderer';

export interface EnhancedBlockAttributes {
  id: string;
  type: string;
  placeholder?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    enhancedBlock: {
      /**
       * Create an enhanced block
       */
      createEnhancedBlock: (attributes?: Partial<EnhancedBlockAttributes>) => ReturnType;
      /**
       * Split current block and create new one
       */
      splitBlock: () => ReturnType;
      /**
       * Delete current block and merge with previous
       */
      deleteBlock: () => ReturnType;
    };
  }
}

const EnhancedBlockPluginKey = new PluginKey('enhancedBlock');

export const EnhancedBlock = Node.create<any>({
  name: 'enhancedBlock',
  group: 'block',
  content: 'paragraph+',
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
          return {
            'data-block-type': attributes.type,
          }
        },
      },
      placeholder: {
        default: 'Type / to add blocks...',
        parseHTML: element => element.getAttribute('data-placeholder'),
        renderHTML: attributes => {
          if (!attributes.placeholder) {
            return {}
          }
          return {
            'data-placeholder': attributes.placeholder,
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
    return ['div', mergeAttributes(HTMLAttributes, { class: 'enhanced-block' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EnhancedBlockRenderer)
  },

  addCommands() {
    return {
      createEnhancedBlock: (attributes = {}) => ({ editor, commands }) => {
        const defaultAttributes = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'content',
          placeholder: 'Type / to add blocks...',
          ...attributes,
        };

        return commands.insertContent({
          type: this.name,
          attrs: defaultAttributes,
          content: [
            {
              type: 'paragraph',
            },
          ],
        });
      },

      splitBlock: () => ({ editor, state, dispatch }) => {
        const { selection } = state;
        const { $from } = selection;
        
        // Check if we're inside an enhanced block
        if ($from.depth >= 2 && $from.node(-1).type.name === 'enhancedBlock') {
          const blockNode = $from.node(-1);
          const blockPos = $from.before($from.depth - 1);
          
          // Create a new block after the current one
          const newBlockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newBlock = state.schema.nodes.enhancedBlock.create(
            { 
              id: newBlockId, 
              type: 'content',
              placeholder: 'Type / to add blocks...'
            },
            state.schema.nodes.paragraph.create()
          );
          
          if (dispatch) {
            const tr = state.tr.insert(blockPos + blockNode.nodeSize, newBlock);
            dispatch(tr);
            
            // Focus the new block
            setTimeout(() => {
              const newPos = blockPos + blockNode.nodeSize + 1;
              if (newPos < editor.state.doc.content.size) {
                editor.commands.focus(newPos);
              }
            }, 10);
          }
          
          return true;
        }
        
        return false;
      },
      
      deleteBlock: () => ({ editor, state, dispatch }) => {
        const { selection } = state;
        const { $from } = selection;
        
        // Check if we're inside an enhanced block
        if ($from.depth >= 2 && $from.node(-1).type.name === 'enhancedBlock') {
          const blockNode = $from.node(-1);
          const blockPos = $from.before($from.depth - 1);
          
          // Check if the paragraph is empty
          const paragraph = $from.parent;
          if (paragraph.content.size === 0) {
            // Don't delete if this is the only block
            const doc = state.doc;
            let blockCount = 0;
            doc.descendants((node) => {
              if (node.type.name === 'enhancedBlock') {
                blockCount++;
              }
            });
            
            if (blockCount <= 1) {
              return false;
            }
            
            if (dispatch) {
              // Delete current block
              const tr = state.tr.delete(blockPos, blockPos + blockNode.nodeSize);
              dispatch(tr);
              
              // Focus the previous block if it exists
              setTimeout(() => {
                if (blockPos > 0) {
                  editor.commands.focus(blockPos - 1);
                }
              }, 10);
            }
            
            return true;
          }
        }
        
        return false;
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Enter': ({ editor }) => {
        return editor.commands.splitBlock();
      },
      
      'Backspace': ({ editor }) => {
        return editor.commands.deleteBlock();
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: EnhancedBlockPluginKey,
        props: {
          handleKeyDown(view, event) {
            const { state, dispatch } = view;
            const { selection } = state;
            const { $from } = selection;

            // Handle Enter key specifically for block creation
            if (event.key === 'Enter' && !event.shiftKey) {
              // Check if we're in an enhanced block
              if ($from.depth >= 2 && $from.node(-1).type.name === 'enhancedBlock') {
                const editor = (view as any).editor;
                if (editor && editor.commands.splitBlock()) {
                  event.preventDefault();
                  return true;
                }
              }
            }

            // Handle Backspace for block deletion
            if (event.key === 'Backspace') {
              if ($from.depth >= 2 && $from.node(-1).type.name === 'enhancedBlock') {
                const paragraph = $from.parent;
                if (paragraph.content.size === 0 && $from.parentOffset === 0) {
                  const editor = (view as any).editor;
                  if (editor && editor.commands.deleteBlock()) {
                    event.preventDefault();
                    return true;
                  }
                }
              }
            }

            return false;
          },
        },
      }),
    ];
  },
}); 