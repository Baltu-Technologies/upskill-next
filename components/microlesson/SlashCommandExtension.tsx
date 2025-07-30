'use client';

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { 
  Image, 
  Video, 
  HelpCircle, 
  Type, 
  List, 
  Quote, 
  Code,
  Target,
  Layers,
  MessageSquare,
  Zap,
  FileText,
  AlignCenter,
  Hash,
  Minus,
  ArrowRight,
  CheckSquare,
  Link,
  Calendar,
  BarChart3,
  Lightbulb,
  AlertCircle,
  Star,
  Bookmark
} from 'lucide-react';

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: any, range: any) => void;
  searchTerms?: string[];
}

// Define available slash commands
export const SLASH_COMMANDS: SlashCommandItem[] = [
  // Basic Text Components
  {
    title: 'Heading 1',
    description: 'Big section heading',
    icon: <Type className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
    searchTerms: ['h1', 'heading', 'title', 'large']
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Type className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
    searchTerms: ['h2', 'heading', 'subtitle', 'medium']
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Type className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
    searchTerms: ['h3', 'heading', 'small']
  },
  {
    title: 'Paragraph',
    description: 'Normal text paragraph',
    icon: <FileText className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
    searchTerms: ['p', 'paragraph', 'text', 'normal']
  },
  
  // Lists
  {
    title: 'Bullet List',
    description: 'Create a bulleted list',
    icon: <List className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
    searchTerms: ['ul', 'bullet', 'list', 'unordered']
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: <Hash className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
    searchTerms: ['ol', 'numbered', 'list', 'ordered', 'numbers']
  },
  {
    title: 'Task List',
    description: 'Create a task list with checkboxes',
    icon: <CheckSquare className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
    searchTerms: ['todo', 'task', 'checkbox', 'check']
  },
  
  // Formatting
  {
    title: 'Quote',
    description: 'Capture a quote',
    icon: <Quote className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
    searchTerms: ['blockquote', 'quote', 'citation']
  },
  {
    title: 'Code Block',
    description: 'Code snippet with syntax highlighting',
    icon: <Code className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
    searchTerms: ['code', 'snippet', 'programming', 'syntax']
  },
  {
    title: 'Divider',
    description: 'Visual divider line',
    icon: <Minus className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
    searchTerms: ['hr', 'divider', 'separator', 'line', 'break']
  },
  
  // Media Components
  {
    title: 'Image',
    description: 'Upload and embed an image',
    icon: <Image className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      // Trigger image upload dialog
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/upload-image', {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            if (data.imageUrl) {
              editor.chain().focus().setImage({ src: data.imageUrl }).run();
            }
          } catch (error) {
            console.error('Image upload failed:', error);
          }
        }
      };
      input.click();
    },
    searchTerms: ['image', 'photo', 'picture', 'img', 'upload']
  },
  {
    title: 'Video',
    description: 'Embed a video player',
    icon: <Video className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      const url = prompt('Enter video URL:');
      if (url) {
        // Insert video embed - you'll need to implement this extension
        editor.chain().focus().insertContent(`<div class="video-embed" data-src="${url}">Video: ${url}</div>`).run();
      }
    },
    searchTerms: ['video', 'embed', 'youtube', 'vimeo', 'mp4']
  },
  
  // Interactive Components
  {
    title: 'Quiz Question',
    description: 'Add an interactive quiz question',
    icon: <HelpCircle className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      // Insert quiz placeholder
      editor.chain().focus().insertContent(`
        <div class="quiz-block">
          <h3>Quiz Question</h3>
          <p>What is your question?</p>
          <ul>
            <li>Option A</li>
            <li>Option B</li>
            <li>Option C</li>
            <li>Option D</li>
          </ul>
        </div>
      `).run();
    },
    searchTerms: ['quiz', 'question', 'test', 'multiple choice', 'poll']
  },
  {
    title: 'Hotspot Activity',
    description: 'Interactive image with clickable hotspots',
    icon: <Target className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().insertContent(`
        <div class="hotspot-activity">
          <h3>Hotspot Activity</h3>
          <p>Click on the image to explore hotspots</p>
          <div class="hotspot-placeholder">[Image with hotspots will go here]</div>
        </div>
      `).run();
    },
    searchTerms: ['hotspot', 'interactive', 'click', 'explore', 'activity']
  },
  
  // Information Components
  {
    title: 'Callout',
    description: 'Important information box',
    icon: <AlertCircle className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().insertContent(`
        <div class="callout callout-info">
          <div class="callout-icon">ℹ️</div>
          <div class="callout-content">
            <p>This is an important callout box. You can change the type and content.</p>
          </div>
        </div>
      `).run();
    },
    searchTerms: ['callout', 'alert', 'info', 'warning', 'note', 'tip']
  },
  {
    title: 'Tip',
    description: 'Helpful tip or hint',
    icon: <Lightbulb className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().insertContent(`
        <div class="callout callout-tip">
          <div class="callout-icon">💡</div>
          <div class="callout-content">
            <p>💡 <strong>Tip:</strong> Add your helpful tip here</p>
          </div>
        </div>
      `).run();
    },
    searchTerms: ['tip', 'hint', 'advice', 'suggestion', 'pro tip']
  },
  {
    title: 'Warning',
    description: 'Warning or caution message',
    icon: <AlertCircle className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().insertContent(`
        <div class="callout callout-warning">
          <div class="callout-icon">⚠️</div>
          <div class="callout-content">
            <p>⚠️ <strong>Warning:</strong> Important warning message</p>
          </div>
        </div>
      `).run();
    },
    searchTerms: ['warning', 'caution', 'alert', 'danger', 'important']
  },
  
  // Organizational Components
  // Table temporarily disabled due to import issues
  // {
  //   title: 'Table',
  //   description: 'Insert a data table',
  //   icon: <Table className="w-4 h-4" />,
  //   command: (editor, range) => {
  //     editor.chain().focus().deleteRange(range).run();
  //     editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  //   },
  //   searchTerms: ['table', 'grid', 'data', 'rows', 'columns']
  // },
  {
    title: 'Link',
    description: 'Add a hyperlink',
    icon: <Link className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      const url = prompt('Enter URL:');
      if (url) {
        const text = prompt('Enter link text:') || url;
        editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
      }
    },
    searchTerms: ['link', 'url', 'hyperlink', 'reference']
  },
  
  // Advanced Components
  {
    title: 'Chart',
    description: 'Data visualization chart',
    icon: <BarChart3 className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().insertContent(`
        <div class="chart-placeholder">
          <h3>Chart</h3>
          <p>Chart visualization will go here</p>
          <div class="chart-data">[Chart data placeholder]</div>
        </div>
      `).run();
    },
    searchTerms: ['chart', 'graph', 'data', 'visualization', 'analytics']
  },
  {
    title: 'Timeline',
    description: 'Event timeline',
    icon: <Calendar className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().insertContent(`
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>Event Title</h4>
              <p>Event description</p>
            </div>
          </div>
        </div>
      `).run();
    },
    searchTerms: ['timeline', 'events', 'chronology', 'history', 'steps']
  },
  
  // Utility
  {
    title: 'Bookmark',
    description: 'Save this for later',
    icon: <Bookmark className="w-4 h-4" />,
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().insertContent(`
        <div class="bookmark">
          <div class="bookmark-icon">🔖</div>
          <div class="bookmark-content">
            <p>Bookmarked content - remember to review this later</p>
          </div>
        </div>
      `).run();
    },
    searchTerms: ['bookmark', 'save', 'remember', 'later', 'reference']
  }
];

export interface SlashCommandPluginState {
  active: boolean;
  range: { from: number; to: number };
  query: string;
  filteredCommands: SlashCommandItem[];
  selectedIndex: number;
}

export const SlashCommandPlugin = new PluginKey('slashCommand');

// Global variable to store the callback
let slashCommandCallback: ((state: SlashCommandPluginState) => void) | null = null;

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',
  
  addOptions() {
    return {
      onSlashCommand: null,
    }
  },
  
  onBeforeCreate() {
    // Store the callback when the extension is created
    if (this.options.onSlashCommand) {
      slashCommandCallback = this.options.onSlashCommand;
    }
  },
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SlashCommandPlugin,
        
        state: {
          init(): SlashCommandPluginState {
            return {
              active: false,
              range: { from: 0, to: 0 },
              query: '',
              filteredCommands: [],
              selectedIndex: 0
            };
          },
          
          apply(transaction, state, oldState, newState): SlashCommandPluginState {
            const { selection, doc } = newState;
            const { from } = selection;
            
            // Get the text around the cursor
            const textBefore = doc.textBetween(Math.max(0, from - 20), from, '\n');
            const slashIndex = textBefore.lastIndexOf('/');
            
            let nextState: SlashCommandPluginState;
            
            if (slashIndex === -1) {
              nextState = { ...state, active: false };
            } else {
              const beforeSlash = textBefore.slice(0, slashIndex);
              const afterSlash = textBefore.slice(slashIndex + 1);
              
              // Only activate if slash is at start of line or after whitespace
              if (beforeSlash.length > 0 && !beforeSlash.match(/\s$/)) {
                nextState = { ...state, active: false };
              } else {
                // Filter commands based on query
                const query = afterSlash.toLowerCase();
                const filteredCommands = SLASH_COMMANDS.filter(command =>
                  command.title.toLowerCase().includes(query) ||
                  command.description.toLowerCase().includes(query) ||
                  command.searchTerms?.some(term => term.toLowerCase().includes(query))
                );
                
                nextState = {
                  active: true,
                  range: {
                    from: from - afterSlash.length - 1,
                    to: from
                  },
                  query: afterSlash,
                  filteredCommands,
                  selectedIndex: 0
                };
              }
            }
            
            // Call the callback if state changed and callback exists
            if (slashCommandCallback && 
                (nextState.active !== state.active || 
                 nextState.query !== state.query || 
                 nextState.filteredCommands.length !== state.filteredCommands.length)) {
              // Use setTimeout to avoid calling setState during render
              const callback = slashCommandCallback;
              setTimeout(() => callback(nextState), 0);
            }
            
            return nextState;
          }
        },
        
        props: {
          handleKeyDown: (view, event) => {
            const state = SlashCommandPlugin.getState(view.state);
            
            if (!state || !state.active) return false;
            
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              const newIndex = (state.selectedIndex + 1) % state.filteredCommands.length;
              view.dispatch(
                view.state.tr.setMeta(SlashCommandPlugin, {
                  ...state,
                  selectedIndex: newIndex
                })
              );
              return true;
            }
            
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              const newIndex = state.selectedIndex === 0 
                ? state.filteredCommands.length - 1 
                : state.selectedIndex - 1;
              view.dispatch(
                view.state.tr.setMeta(SlashCommandPlugin, {
                  ...state,
                  selectedIndex: newIndex
                })
              );
              return true;
            }
            
            if (event.key === 'Enter') {
              event.preventDefault();
              const selectedCommand = state.filteredCommands[state.selectedIndex];
              if (selectedCommand) {
                try {
                  // Get the editor instance from the view
                  const editor = (view as any).editor;
                  if (editor) {
                    selectedCommand.command(editor, state.range);
                  }
                } catch (error) {
                  console.error('Error executing slash command:', error);
                }
                
                view.dispatch(
                  view.state.tr.setMeta(SlashCommandPlugin, {
                    ...state,
                    active: false
                  })
                );
              }
              return true;
            }
            
            if (event.key === 'Escape') {
              view.dispatch(
                view.state.tr.setMeta(SlashCommandPlugin, {
                  ...state,
                  active: false
                })
              );
              return true;
            }
            
            return false;
          }
        }
      })
    ];
  }
}); 