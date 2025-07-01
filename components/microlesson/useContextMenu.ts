'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMessages } from '@/app/contexts/MessagesContext';

interface UseContextMenuProps {
  slideId?: string;
  slideTitle?: string;
  onDefineWord?: (word: string) => void;
  onSaveToStudyList?: (word: string) => void;
  onAddToNotes?: (text: string, slideId?: string) => void;
  onAskAI?: (text: string) => void;
}

export const useContextMenu = ({
  slideId,
  slideTitle,
  onDefineWord,
  onSaveToStudyList,
  onAddToNotes,
  onAskAI
}: UseContextMenuProps = {}) => {
  const { openMessagesModal } = useMessages();
  
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    selectedText: ''
  });

  // Modal states
  const [definitionModal, setDefinitionModal] = useState({
    isOpen: false,
    word: ''
  });

  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    selectedText: ''
  });

  // New state for word input modal
  const [wordInputModal, setWordInputModal] = useState({
    isOpen: false
  });

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';

    // Calculate position, ensuring menu stays within viewport
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 280;
    const menuHeight = 200; // Approximate height
    
    let x = event.clientX;
    let y = event.clientY;
    
    // Adjust if menu would go off-screen
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = event.clientY - menuHeight - 10;
    }

    setContextMenu({
      isVisible: true,
      position: { x, y },
      selectedText
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
    
    // Clear text selection
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  }, []);

  const handleDefineWord = useCallback(() => {
    const { selectedText } = contextMenu;
    
    if (selectedText) {
      // If text is selected, define it directly
      setDefinitionModal({ isOpen: true, word: selectedText });
      onDefineWord?.(selectedText);
    } else {
      // If no text selected, show input modal
      setWordInputModal({ isOpen: true });
    }
    handleCloseContextMenu();
  }, [contextMenu.selectedText, onDefineWord, handleCloseContextMenu]);

  const handleDefineFromInput = useCallback((word: string) => {
    if (word.trim()) {
      setDefinitionModal({ isOpen: true, word: word.trim() });
      onDefineWord?.(word.trim());
    }
    setWordInputModal({ isOpen: false });
  }, [onDefineWord]);

  const handleSaveToStudyList = useCallback(() => {
    const { selectedText } = contextMenu;
    
    if (selectedText) {
      // Save selected text/word
      const studyListItem = {
        id: Date.now().toString(),
        title: `Definition: ${selectedText}`,
        word: selectedText.toLowerCase(),
        category: 'Vocabulary',
        type: 'Word Study',
        progress: 0,
        totalLessons: 1,
        completedLessons: 0,
        timeSpent: '0 hours',
        estimatedTime: '5 minutes',
        priority: 'Medium',
        status: 'Not Started',
        difficulty: 'Beginner',
        source: 'Microlesson',
        slideId,
        dateAdded: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        notes: 0,
        favorite: false,
        context: selectedText
      };
      
      saveToStudyList(studyListItem, selectedText);
    } else {
      // Save current slide/lesson
      const studyListItem = {
        id: Date.now().toString(),
        title: slideTitle || `Slide ${slideId}`,
        category: 'Lesson Review',
        type: 'Slide Study',
        progress: 0,
        totalLessons: 1,
        completedLessons: 0,
        timeSpent: '0 hours',
        estimatedTime: '10 minutes',
        priority: 'Medium',
        status: 'Not Started',
        difficulty: 'Beginner',
        source: 'Microlesson',
        slideId,
        dateAdded: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        notes: 0,
        favorite: false,
        context: `Full slide: ${slideTitle || slideId}`
      };
      
      saveToStudyList(studyListItem, slideTitle || 'this slide');
    }
    
    onSaveToStudyList?.(selectedText || slideTitle || '');
    handleCloseContextMenu();
  }, [contextMenu.selectedText, slideId, slideTitle, onSaveToStudyList, handleCloseContextMenu]);

  const saveToStudyList = (studyListItem: any, itemName: string) => {
    const existingItems = JSON.parse(localStorage.getItem('studyListItems') || '[]');
    
    // Check if item already exists
    const itemExists = existingItems.find((item: any) => 
      item.slideId === slideId && (
        (studyListItem.word && item.word === studyListItem.word) ||
        (!studyListItem.word && item.type === studyListItem.type)
      )
    );
    
    if (!itemExists) {
      const updatedItems = [studyListItem, ...existingItems];
      localStorage.setItem('studyListItems', JSON.stringify(updatedItems));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[400] animate-bounce';
      notification.textContent = `"${itemName}" saved to Study List!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 3000);
    } else {
      // Show already exists notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-[400]';
      notification.textContent = `"${itemName}" is already in your Study List!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 3000);
    }
  };

  const handleAddToNotes = useCallback(() => {
    const { selectedText } = contextMenu;
    
    setNotesModal({ 
      isOpen: true, 
      selectedText: selectedText || '' // Allow empty for general notes
    });
    onAddToNotes?.(selectedText || '', slideId);
    handleCloseContextMenu();
  }, [contextMenu.selectedText, slideId, onAddToNotes, handleCloseContextMenu]);

  const handleAskAI = useCallback(() => {
    const { selectedText } = contextMenu;
    
    // Open the existing Messages modal with context
    openMessagesModal({
      selectedText: selectedText || undefined,
      slideTitle,
      slideId
    });
    
    onAskAI?.(selectedText || '');
    handleCloseContextMenu();
  }, [contextMenu.selectedText, onAskAI, handleCloseContextMenu, openMessagesModal, slideTitle, slideId]);

  // Modal handlers
  const handleCloseDefinitionModal = useCallback(() => {
    setDefinitionModal({ isOpen: false, word: '' });
  }, []);

  const handleCloseNotesModal = useCallback(() => {
    setNotesModal({ isOpen: false, selectedText: '' });
  }, []);

  const handleCloseWordInputModal = useCallback(() => {
    setWordInputModal({ isOpen: false });
  }, []);



  // Close context menu and modals on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseContextMenu();
        handleCloseDefinitionModal();
        handleCloseNotesModal();
        handleCloseWordInputModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseContextMenu, handleCloseDefinitionModal, handleCloseNotesModal, handleCloseWordInputModal]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.isVisible) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.isVisible, handleCloseContextMenu]);

  return {
    contextMenu,
    definitionModal,
    notesModal,
    wordInputModal,
    handleContextMenu,
    handleCloseContextMenu,
    handleDefineWord,
    handleSaveToStudyList,
    handleAddToNotes,
    handleAskAI,
    handleCloseDefinitionModal,
    handleCloseNotesModal,
    handleCloseWordInputModal,
    handleDefineFromInput
  };
}; 