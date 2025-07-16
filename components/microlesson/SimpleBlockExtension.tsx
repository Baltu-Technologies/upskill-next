'use client';

import React, { useState, useEffect } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Image, Grid3X3, FileText, MoreVertical, MessageCircle } from 'lucide-react';

interface SimpleBlockRendererProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
  editor: any;
  getPos: () => number | undefined;
}

const SimpleBlockRenderer: React.FC<SimpleBlockRendererProps> = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Check if block is empty
  useEffect(() => {
    const checkEmpty = () => {
      const blockContent = node.content;
      if (!blockContent || blockContent.size === 0) {
        setIsEmpty(true);
      } else {
        // Check if it's just an empty paragraph
        if (blockContent.childCount === 1) {
          const firstChild = blockContent.firstChild;
          if (firstChild && firstChild.type.name === 'paragraph' && firstChild.content.size === 0) {
            setIsEmpty(true);
          } else {
            setIsEmpty(false);
          }
        } else {
          setIsEmpty(false);
        }
      }
    };

    checkEmpty();
  }, [node.content]);

  const handleAddBlock = () => {
    const pos = getPos();
    if (pos === undefined) return;
    
    const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newBlock = editor.schema.nodes.simpleBlock.create(
      { id: blockId },
      editor.schema.nodes.paragraph.create()
    );
    
    const tr = editor.state.tr.insert(pos + node.nodeSize, newBlock);
    editor.view.dispatch(tr);
    
    // Focus the new block
    setTimeout(() => {
      editor.commands.focus(pos + node.nodeSize + 1);
    }, 10);
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          const pos = getPos();
          if (pos === undefined) return;
          
          const tr = editor.state.tr.replaceWith(
            pos,
            pos + node.nodeSize,
            editor.schema.nodes.image.create({ src })
          );
          editor.view.dispatch(tr);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddTable = () => {
    const pos = getPos();
    if (pos === undefined) return;
    
    const table = editor.schema.nodes.table.create(
      {},
      [
        editor.schema.nodes.tableRow.create({}, [
          editor.schema.nodes.tableHeader.create({}, editor.schema.nodes.paragraph.create({}, editor.schema.text('Header 1'))),
          editor.schema.nodes.tableHeader.create({}, editor.schema.nodes.paragraph.create({}, editor.schema.text('Header 2'))),
          editor.schema.nodes.tableHeader.create({}, editor.schema.nodes.paragraph.create({}, editor.schema.text('Header 3'))),
        ]),
        editor.schema.nodes.tableRow.create({}, [
          editor.schema.nodes.tableCell.create({}, editor.schema.nodes.paragraph.create()),
          editor.schema.nodes.tableCell.create({}, editor.schema.nodes.paragraph.create()),
          editor.schema.nodes.tableCell.create({}, editor.schema.nodes.paragraph.create()),
        ]),
        editor.schema.nodes.tableRow.create({}, [
          editor.schema.nodes.tableCell.create({}, editor.schema.nodes.paragraph.create()),
          editor.schema.nodes.tableCell.create({}, editor.schema.nodes.paragraph.create()),
          editor.schema.nodes.tableCell.create({}, editor.schema.nodes.paragraph.create()),
        ]),
      ]
    );
    
    const tr = editor.state.tr.replaceWith(pos, pos + node.nodeSize, table);
    editor.view.dispatch(tr);
  };

  const handleMoreOptions = () => {
    const pos = getPos();
    if (pos === undefined) return;
    
    // Calculate the range of content within this block
    const blockStart = pos + 1; // Start of block content (after opening tag)
    const blockEnd = pos + node.nodeSize - 1; // End of block content (before closing tag)
    
    // Use TipTap's built-in selection to select the entire block content
    editor.chain()
      .focus()
      .setTextSelection({ from: blockStart, to: blockEnd })
      .run();
  };

  const handleAddComment = () => {
    // TODO: Implement comment functionality
    console.log('Add comment clicked');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <NodeViewWrapper 
      className="simple-block-wrapper relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - More options (3 dots) */}
      {isHovered && (
        <div 
          className="icon-container-left"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={handleMoreOptions}
            className="hover-icon text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="More options"
            onMouseEnter={() => setIsHovered(true)}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right side - Comment icon */}
      {isHovered && (
        <div 
          className="icon-container-right"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={handleAddComment}
            className="hover-icon text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Add comment"
            onMouseEnter={() => setIsHovered(true)}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className="relative">
        {/* Placeholder with info text and quick actions - always show when empty */}
        {isEmpty && (
          <div className="block-placeholder">
            <div className="placeholder-actions">
              <span className="text-sm">Type / to add blocks or</span>
              <div className="quick-actions">
                <button
                  onClick={handleAddBlock}
                  className="quick-action-btn"
                  title="Add block"
                >
                  <FileText className="w-3 h-3" />
                  <span>Block</span>
                </button>
                <button
                  onClick={handleAddImage}
                  className="quick-action-btn"
                  title="Add image"
                >
                  <Image className="w-3 h-3" />
                  <span>Image</span>
                </button>
                <button
                  onClick={handleAddTable}
                  className="quick-action-btn"
                  title="Add table"
                >
                  <Grid3X3 className="w-3 h-3" />
                  <span>Table</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editable content */}
        <NodeViewContent 
          className="block-content"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </NodeViewWrapper>
  );
};

export const SimpleBlock = Node.create({
  name: 'simpleBlock',
  group: 'block',
  content: 'block+',
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-id': attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="simple-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'simple-block' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SimpleBlockRenderer);
  },
});

export const SimpleBlockPlugin = new Plugin({
  key: new PluginKey('simpleBlock'),
  props: {
    handleDOMEvents: {
      keydown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          const { state, dispatch } = view;
          const { selection } = state;
          
          // Check if we're in an empty paragraph within a simple block
          const { $from } = selection;
          const blockParent = $from.node($from.depth - 1);
          
          if (blockParent && blockParent.type.name === 'simpleBlock') {
            const paragraph = $from.node();
            if (paragraph.type.name === 'paragraph' && paragraph.content.size === 0) {
              event.preventDefault();
              
              // Create a new simple block
              const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const newBlock = state.schema.nodes.simpleBlock.create(
                { id: blockId },
                state.schema.nodes.paragraph.create()
              );
              
              const tr = state.tr.insert(selection.to, newBlock);
              dispatch(tr);
              
              return true;
            }
          }
        }
        return false;
      },
    },
  },
}); 