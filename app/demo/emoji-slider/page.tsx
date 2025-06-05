"use client";

import { useState } from 'react';
import { EmojiSlider } from '../../../src/components/ui/EmojiSlider';

export default function EmojiSliderDemo() {
  const [value1, setValue1] = useState<0 | 1 | 2 | 3>(2);
  const [value2, setValue2] = useState<0 | 1 | 2 | 3>(1);
  const [value3, setValue3] = useState<0 | 1 | 2 | 3>(3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Emoji Slider Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the interactive emoji-based interest rating component
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <EmojiSlider
              value={value1}
              onChange={setValue1}
              label="How interested are you in Artificial Intelligence?"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <EmojiSlider
              value={value2}
              onChange={setValue2}
              label="How interested are you in Cybersecurity?"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <EmojiSlider
              value={value3}
              onChange={setValue3}
              label="How interested are you in Web Development?"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <EmojiSlider
              value={0}
              onChange={() => {}}
              label="Disabled Example"
              disabled={true}
            />
          </div>

          {/* Results Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Current Selections:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Artificial Intelligence:</span>
                <span className="font-medium">{value1} - {['Not Interested', 'Neutral', 'Interested', 'Very Interested'][value1]}</span>
              </div>
              <div className="flex justify-between">
                <span>Cybersecurity:</span>
                <span className="font-medium">{value2} - {['Not Interested', 'Neutral', 'Interested', 'Very Interested'][value2]}</span>
              </div>
              <div className="flex justify-between">
                <span>Web Development:</span>
                <span className="font-medium">{value3} - {['Not Interested', 'Neutral', 'Interested', 'Very Interested'][value3]}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How to Use:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Click on any emoji to select that interest level</li>
              <li>• Use keyboard arrow keys to navigate between options</li>
              <li>• Press Enter or Space to select</li>
              <li>• Each selection provides visual and audio feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 