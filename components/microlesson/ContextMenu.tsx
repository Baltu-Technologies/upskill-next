'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  StickyNote, 
  MessageSquare, 
  X,
  Search
} from 'lucide-react';

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  onClose: () => void;
  onDefineWord: () => void;
  onSaveToStudyList: () => void;
  onAddToNotes: () => void;
  onAskAI: () => void;
}

// Word Input Modal component
interface WordInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDefineWord: (word: string) => void;
}

const WordInputModal: React.FC<WordInputModalProps> = ({ isOpen, onClose, onDefineWord }) => {
  const [word, setWord] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      onDefineWord(word.trim());
      setWord('');
    }
  };

  const handleClose = () => {
    setWord('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Define Word</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="word-input" className="block text-sm font-medium text-gray-300 mb-2">
              Enter a word to define:
            </label>
            <input
              id="word-input"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g., semiconductor, voltage, resistance..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!word.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              Define Word
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  position,
  selectedText,
  onClose,
  onDefineWord,
  onSaveToStudyList,
  onAddToNotes,
  onAskAI
}) => {
  if (!isVisible) return null;

  const hasSelectedText = Boolean(selectedText && selectedText.trim().length > 0);
  
  // Clean the selected text for word definition
  const cleanWord = selectedText?.trim().toLowerCase().replace(/[^\w\s]/g, '') || '';
  const isWord = cleanWord.split(' ').length === 1 && cleanWord.length > 0;

  const menuItems = [
    {
      id: 'define',
      icon: BookOpen,
      label: hasSelectedText ? 'Define Word' : 'Define Word...',
      action: onDefineWord,
      disabled: hasSelectedText && !isWord
    },
    {
      id: 'study',
      icon: Heart,
      label: hasSelectedText ? 'Save to Study List' : 'Save to Study List',
      action: onSaveToStudyList,
      disabled: false
    },
    {
      id: 'notes',
      icon: StickyNote,
      label: hasSelectedText ? 'Add to Notes' : 'Add Note',
      action: onAddToNotes
    },
    {
      id: 'ai',
      icon: MessageSquare,
      label: hasSelectedText ? 'Ask AI' : 'Ask AI',
      action: onAskAI
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[200] bg-black/10" 
            onClick={onClose}
          />
          
          {/* Context Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed z-[201] bg-slate-800/98 backdrop-blur-xl border border-slate-600/60 rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/5"
            style={{
              left: position.x,
              top: position.y,
              width: '160px'
            }}
          >
            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                const colors = [
                  { icon: 'text-blue-400', hover: 'hover:bg-blue-500/10' },
                  { icon: 'text-red-400', hover: 'hover:bg-red-500/10' },
                  { icon: 'text-green-400', hover: 'hover:bg-green-500/10' },
                  { icon: 'text-purple-400', hover: 'hover:bg-purple-500/10' }
                ];
                const colorScheme = colors[index] || colors[0];
                
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    disabled={item.disabled}
                    className={`w-full px-3 py-2.5 text-left transition-all duration-200 flex items-center gap-3 ${
                      item.disabled 
                        ? 'opacity-50 cursor-not-allowed text-slate-500' 
                        : `${colorScheme.hover} text-slate-200 hover:text-white group`
                    }`}
                  >
                    <div className={`p-1.5 rounded-md bg-slate-700/40 transition-colors ${
                      item.disabled ? 'text-slate-500' : `${colorScheme.icon} group-hover:bg-slate-600/60`
                    }`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Export the WordInputModal for use in other components
export { WordInputModal }; 