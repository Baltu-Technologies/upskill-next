'use client';

import React, { useState } from 'react';
import TipTapSlideEditor from '@/components/microlesson/TipTapSlideEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Blocks, Command, Move, Plus } from 'lucide-react';

export default function DragDropBlocksDemo() {
  const [content, setContent] = useState(`
    <div data-block-id="block-1" class="drag-drop-block">
      <h2>Welcome to Block System</h2>
    </div>
    <div data-block-id="block-2" class="drag-drop-block">
      <p>This is a <strong>draggable paragraph block</strong>. Hover over me to see the drag handle on the left.</p>
    </div>
    <div data-block-id="block-3" class="drag-drop-block">
      <ul>
        <li>This is a list block</li>
        <li>You can drag it around</li>
        <li>Reorder it with other blocks</li>
      </ul>
    </div>
    <div data-block-id="block-4" class="drag-drop-block">
      <blockquote>
        <p>"This is a quote block that can be moved around the editor seamlessly."</p>
      </blockquote>
    </div>
  `);
  
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved content:', content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent(`
      <div data-block-id="block-1" class="drag-drop-block">
        <h2>Welcome to Block System</h2>
      </div>
      <div data-block-id="block-2" class="drag-drop-block">
        <p>This is a <strong>draggable paragraph block</strong>. Hover over me to see the drag handle on the left.</p>
      </div>
      <div data-block-id="block-3" class="drag-drop-block">
        <ul>
          <li>This is a list block</li>
          <li>You can drag it around</li>
          <li>Reorder it with other blocks</li>
        </ul>
      </div>
      <div data-block-id="block-4" class="drag-drop-block">
        <blockquote>
          <p>"This is a quote block that can be moved around the editor seamlessly."</p>
        </blockquote>
      </div>
    `);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Blocks className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Drag & Drop Block System
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive block-based editor with drag-and-drop reordering
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-blue-500" />
                Drag Handles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hover over any block to reveal drag handles for easy repositioning
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Move className="w-5 h-5 text-green-500" />
                Block Reordering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag blocks up or down to reorder content seamlessly
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-500" />
                Block Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add new blocks or delete existing ones with hover actions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Command className="w-5 h-5 text-blue-500" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Click <strong>"Edit Content"</strong> to activate the block editor</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span><strong>Hover over any block</strong> to see drag handles and action buttons</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span><strong>Click and drag</strong> the grip handle (⋮⋮) to reorder blocks</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Use <strong>+ button</strong> to add new blocks or <strong>trash button</strong> to delete</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <span>Type <strong>"/"</strong> anywhere to access slash commands for rich content</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Block Editor</CardTitle>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} variant="default" size="sm">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} variant="default" size="sm">
                    Edit Content
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-96 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
              <TipTapSlideEditor
                content={content}
                onChange={setContent}
                onSave={handleSave}
                onCancel={handleCancel}
                placeholder="Start typing or drag blocks around..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="mt-6 bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Technical Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Drag & Drop</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Built with @dnd-kit/sortable</li>
                  <li>• Smooth animations and transitions</li>
                  <li>• Visual feedback during dragging</li>
                  <li>• Touch-friendly on mobile devices</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Block System</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Custom TipTap node extension</li>
                  <li>• Persistent block IDs</li>
                  <li>• Automatic content wrapping</li>
                  <li>• Dark mode support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 