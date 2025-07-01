'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, StickyNote } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  slideId: string;
  timestamp: string;
  selectedText?: string;
}

interface NotesModalProps {
  isOpen: boolean;
  slideId: string;
  selectedText?: string;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  slideId,
  selectedText,
  onClose
}) => {
  const [noteText, setNoteText] = useState('');

  // Pre-fill with selected text when modal opens
  useEffect(() => {
    if (isOpen && selectedText) {
      setNoteText(`Selected: "${selectedText}"\n\nNotes: `);
    } else if (isOpen && !selectedText) {
      setNoteText('');
    }
  }, [isOpen, selectedText]);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      text: noteText.trim(),
      slideId,
      timestamp: new Date().toISOString(),
      selectedText: selectedText || undefined
    };

    // Save to localStorage
    const savedNotes = localStorage.getItem('slideNotes');
    const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
    const updatedNotes = [note, ...allNotes];
    localStorage.setItem('slideNotes', JSON.stringify(updatedNotes));

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[400] animate-bounce';
    notification.textContent = 'Note saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);

    // Close modal and reset
    setNoteText('');
    onClose();
  };

  const handleCancel = () => {
    setNoteText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <StickyNote className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">Add Note</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Subtitle */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm">Note for Slide {slideId}</p>
          </div>

          {/* Text Area */}
          <div className="mb-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note here..."
              className="w-full h-32 px-3 py-3 bg-gray-700 border border-blue-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              autoFocus
            />
          </div>

          {/* Helper Text */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm">
              Your note will be saved locally and can be viewed from the Notes panel.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 