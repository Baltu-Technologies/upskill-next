'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Type, 
  Mouse,
  Keyboard,
  Trash2,
  RotateCcw,
  GripVertical
} from 'lucide-react';
import Link from 'next/link';
import EnhancedTipTapSlideEditor from '@/components/microlesson/EnhancedTipTapSlideEditor';

export default function EnhancedBlockEditorDemo() {
  const [content, setContent] = useState('');

  const resetEditor = () => {
    setContent('');
    // Force re-render by updating key
    setEditorKey(prev => prev + 1);
  };

  const [editorKey, setEditorKey] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demos
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Enhanced Block Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Modern block-based editing with smart text handling
              </p>
            </div>
          </div>
          <Button onClick={resetEditor} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Editor
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-5 h-5 text-green-600 dark:text-green-400" />
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Text Wrapping
                </Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Smart text wrapping keeps content in the same block
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Enter Key
                </Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Press Enter to create new blocks with placeholder text
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mouse className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  Drag & Drop
                </Badge>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                3-dot handles with visual drop indicators
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  Smart Delete
                </Badge>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                Backspace on empty blocks removes them smartly
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Type className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Smart Placeholder Text</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    New documents start with "Untitled Card" as a placeholder heading. Click anywhere on the placeholder to start editing - your cursor will automatically position at the beginning and the placeholder disappears as you type.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Keyboard className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Enter Key Behavior</h3>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <div className="mb-2">
                      Press <Badge variant="outline">Enter</Badge> to create a new block below the current one.
                    </div>
                    <div>
                      New blocks show "Type / to add blocks..." as placeholder text. Text wrapping keeps content within the same block.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mouse className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Drag & Drop</h3>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <div className="mb-2">
                      Hover over blocks to see the <GripVertical className="h-4 w-4 inline mx-1" /> handle.
                    </div>
                    <div>
                      Drag blocks to reorder them with visual drop indicators showing exactly where they'll land.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold">Smart Deletion</h3>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <div className="mb-2">
                      Press <Badge variant="outline">Backspace</Badge> on empty blocks to delete them and move your cursor to the previous block.
                    </div>
                    <div>
                      Keeps your workflow smooth and intuitive.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Live Enhanced Block Editor</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try the features above in this live editor. Reset to start fresh with "Untitled Card".
            </p>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[400px]">
              <EnhancedTipTapSlideEditor
                key={editorKey}
                content={content}
                onChange={setContent}
                onSave={() => {}}
                onCancel={() => {}}
                placeholder="Start typing or press / for commands..."
                className="min-h-[350px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Key Components:</h3>
                <ul className="space-y-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  <li>• EnhancedBlockExtension.tsx</li>
                  <li>• EnhancedBlockRenderer.tsx</li>
                  <li>• EnhancedDragDropContainer.tsx</li>
                  <li>• EnhancedTipTapSlideEditor.tsx</li>
                  <li>• enhanced-tiptap-styles.css</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Dependencies:</h3>
                <ul className="space-y-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  <li>• @tiptap/react</li>
                  <li>• @tiptap/starter-kit</li>
                  <li>• @dnd-kit/core</li>
                  <li>• @dnd-kit/sortable</li>
                  <li>• prosemirror-*</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 