'use client';

import React, { useState } from 'react';
import TipTapSlideEditor from '@/components/microlesson/TipTapSlideEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Command, Sparkles } from 'lucide-react';

export default function SlashCommandsDemo() {
  const [content, setContent] = useState('<p>Type "/" to see available commands...</p>');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved content:', content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent('<p>Type "/" to see available commands...</p>');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const exampleCommands = [
    { command: '/heading', description: 'Add a heading (h1, h2, h3)' },
    { command: '/image', description: 'Upload and embed an image' },
    { command: '/video', description: 'Embed a video player' },
    { command: '/quiz', description: 'Create an interactive quiz question' },
    { command: '/table', description: 'Insert a data table' },
    { command: '/list', description: 'Create bullet or numbered lists' },
    { command: '/task', description: 'Add a task list with checkboxes' },
    { command: '/quote', description: 'Add a blockquote' },
    { command: '/code', description: 'Insert a code block' },
    { command: '/tip', description: 'Add a helpful tip callout' },
    { command: '/warning', description: 'Add a warning callout' },
    { command: '/callout', description: 'Add an info callout' },
    { command: '/divider', description: 'Add a horizontal divider' },
    { command: '/link', description: 'Add a hyperlink' },
    { command: '/hotspot', description: 'Create interactive hotspot activity' },
    { command: '/chart', description: 'Add a data visualization chart' },
    { command: '/timeline', description: 'Create an event timeline' },
    { command: '/bookmark', description: 'Add a bookmark for later' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <Command className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Slash Commands Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the slash command system in the TipTap editor. Type "/" to see available commands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Rich Text Editor with Slash Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <TipTapSlideEditor
                    content={content}
                    onChange={setContent}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    placeholder="Type '/' to see available commands..."
                  />
                ) : (
                  <div className="space-y-4">
                    <div 
                      className="min-h-[200px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <Button onClick={handleEdit} className="w-full">
                      Edit Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Code className="w-5 h-5 text-green-600 dark:text-green-400" />
                  HTML Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{content}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Commands Reference */}
          <div className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Available Commands</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Type any of these commands to insert components:
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {exampleCommands.map((cmd, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <code className="text-sm font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded flex-shrink-0">
                        {cmd.command}
                      </code>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{cmd.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">Click "Edit Content" to start editing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">2.</span>
                    <span className="text-gray-700 dark:text-gray-300">Type "/" anywhere in the editor to open the command menu</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">3.</span>
                    <span className="text-gray-700 dark:text-gray-300">Use arrow keys (↑↓) to navigate the menu</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">4.</span>
                    <span className="text-gray-700 dark:text-gray-300">Press Enter to select a command or click on it</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">5.</span>
                    <span className="text-gray-700 dark:text-gray-300">Type after "/" to filter commands (e.g., "/ima" for image)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">6.</span>
                    <span className="text-gray-700 dark:text-gray-300">Press Escape to close the menu</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 