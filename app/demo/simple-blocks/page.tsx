'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Blocks, FileText, Image, Grid3X3, Command, MoreVertical, MessageCircle } from 'lucide-react';
import InlineTextEditor from '@/components/microlesson/InlineTextEditor';

export default function SimpleBlocksDemo() {
  const [content, setContent] = useState<string>('');

  const features = [
    {
      icon: <Blocks className="w-5 h-5" />,
      title: "Block-Based Content",
      description: "Each piece of content is wrapped in a block for easy organization"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Quick Add Block",
      description: "Click the Block button in empty lines to add new content blocks"
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: "Add Images",
      description: "Click the Image button to upload and insert images directly"
    },
    {
      icon: <Grid3X3 className="w-5 h-5" />,
      title: "Insert Tables",
      description: "Click the Table button to insert structured data tables"
    },
    {
      icon: <Command className="w-5 h-5" />,
      title: "Slash Commands",
      description: "Type / to access rich content creation tools"
    },
    {
      icon: <MoreVertical className="w-5 h-5" />,
      title: "More Options",
      description: "Hover over any line to see the 3-dot menu - click to highlight the line and open the TipTap toolbar for formatting"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Comments",
      description: "Hover over any line to see the comment icon for adding notes"
    }
  ];

  const handleSave = () => {
    console.log('Content saved:', content);
  };

  const handleCancel = () => {
    setContent('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Simple Block System Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A clean block system for organizing content in slides with hover interactions
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Editor */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Interactive Block Editor
              </CardTitle>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <InlineTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start typing or use quick actions..."
                className="w-full text-gray-400 italic"
              />
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              How to Use the Enhanced Block System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-start space-x-2">
                <span className="font-semibold">1.</span>
                <span>Start typing to create your first block</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">2.</span>
                <span>Press <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">Enter</kbd> at the end of a line to create a new block</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">3.</span>
                <span>In empty blocks, you'll see "Type / to add blocks or" with quick action buttons</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">4.</span>
                <span>Hover over any line to see the <strong>3-dot menu</strong> on the left - click to highlight the line and open the TipTap toolbar for formatting</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">5.</span>
                <span>Hover over any line to see the <strong>comment icon</strong> on the right for adding notes</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">6.</span>
                <span>Type <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">/</kbd> to access slash commands for rich content</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">7.</span>
                <span>Use the Block, Image, and Table buttons for quick content insertion</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 