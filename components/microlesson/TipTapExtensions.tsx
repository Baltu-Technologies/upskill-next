'use client';

import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { EnhancedBlock } from './EnhancedBlockExtension';

// Configure Image extension
export const ImageExtension = Image.configure({
  inline: false,
  HTMLAttributes: {
    class: 'prose-img rounded-lg max-w-full h-auto',
  },
});

// Configure Task List extensions
export const TaskListExtension = TaskList.configure({
  HTMLAttributes: {
    class: 'task-list',
  },
});

export const TaskItemExtension = TaskItem.configure({
  HTMLAttributes: {
    class: 'task-item flex items-start gap-2',
  },
  nested: true,
});

// Configure Horizontal Rule
export const HorizontalRuleExtension = HorizontalRule.configure({
  HTMLAttributes: {
    class: 'my-4 border-gray-300',
  },
});

export const ALL_EXTENSIONS = [
  ImageExtension,
  TaskListExtension,
  TaskItemExtension,
  HorizontalRuleExtension,
  EnhancedBlock,
]; 