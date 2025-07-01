'use client';

import React from 'react';
import { SlideType, SlideRendererProps } from '@/types/microlesson/slide';
import { TitleSlide } from './slides/TitleSlide';
import { TitleWithSubtext } from './slides/TitleWithSubtext';
import { TitleWithImage } from './slides/TitleWithImage';
import { VideoSlide } from './slides/VideoSlide';
import { QuickCheckSlide } from './slides/QuickCheckSlide';
import { MarkdownSlide } from './slides/MarkdownSlide';
import { CustomHTMLSlide } from './slides/CustomHTMLSlide';
import { HotspotActivitySlide } from './slides/HotspotActivitySlide';
import { ContextMenu, WordInputModal } from './ContextMenu';
import { DefinitionModal } from './DefinitionModal';
import { NotesModal } from './NotesModal';
import { useContextMenu } from './useContextMenu';
import dynamic from 'next/dynamic';

// Dynamically import 3D components to avoid SSR issues
const AR3DModelSlide = dynamic(
  () => import('./slides/AR3DModelSlide').then((mod) => ({ default: mod.AR3DModelSlide })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  isActive, 
  onNext, 
  onPrevious,
  onQuickCheckAnswered,
  onDefineWord,
  onSaveToStudyList,
  onAddToNotes,
  onAskAI
}) => {
  const {
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
  } = useContextMenu({
    slideId: slide.id,
    slideTitle: 'title' in slide ? slide.title : `Slide ${slide.id}`,
    onDefineWord,
    onSaveToStudyList,
    onAddToNotes,
    onAskAI
  });

  const handleSaveWordToStudyList = (word: string, definition: string) => {
    // Create study list item for word definition
    const studyListItem = {
      id: Date.now().toString(),
      title: `Definition: ${word}`,
      word: word.toLowerCase(),
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
      source: 'Microlesson Dictionary',
      slideId: slide.id,
      dateAdded: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      notes: 0,
      favorite: false,
      context: definition,
      definition: definition
    };
    
    // Save to localStorage (Study Hub integration)
    const existingItems = JSON.parse(localStorage.getItem('studyListItems') || '[]');
    
    // Check if word already exists
    const wordExists = existingItems.find((item: any) => 
      item.word === word.toLowerCase()
    );
    
    if (!wordExists) {
      const updatedItems = [studyListItem, ...existingItems];
      localStorage.setItem('studyListItems', JSON.stringify(updatedItems));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[400] animate-bounce';
      notification.textContent = `"${word}" saved to Study List!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 3000);
    }
  };

  if (!isActive) return null;

  const commonProps = {
    slide,
    onNext,
    onPrevious,
    onContextMenu: handleContextMenu,
    style: { userSelect: 'text' as const }
  };

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'TitleSlide':
        return <TitleSlide {...commonProps} slide={slide} />;
      
      case 'TitleWithSubtext':
        return <TitleWithSubtext {...commonProps} slide={slide} />;
      
      case 'TitleWithImage':
        return <TitleWithImage {...commonProps} slide={slide} />;
      
      case 'VideoSlide':
        return <VideoSlide {...commonProps} slide={slide} />;
      
      case 'AR3DModelSlide':
        return <AR3DModelSlide {...commonProps} slide={slide} />;
      
      case 'QuickCheckSlide':
        return (
          <QuickCheckSlide 
            {...commonProps} 
            slide={slide} 
            onQuickCheckAnswered={onQuickCheckAnswered}
          />
        );
      
      case 'CustomHTMLSlide':
        return <CustomHTMLSlide {...commonProps} slide={slide} />;
      
      case 'HotspotActivitySlide':
        return <HotspotActivitySlide {...commonProps} slide={slide} />;
      
      case 'MarkdownSlide':
        return <MarkdownSlide {...commonProps} slide={slide} />;
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Unknown Slide Type
              </h2>
              <p className="text-gray-400">
                Slide type '{(slide as any).type}' is not supported.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div 
        className="h-full w-full"
        onContextMenu={handleContextMenu}
        style={{ userSelect: 'text' }}
      >
        {renderSlideContent()}
      </div>
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        selectedText={contextMenu.selectedText}
        onClose={handleCloseContextMenu}
        onDefineWord={handleDefineWord}
        onSaveToStudyList={handleSaveToStudyList}
        onAddToNotes={handleAddToNotes}
        onAskAI={handleAskAI}
      />
      <WordInputModal
        isOpen={wordInputModal.isOpen}
        onClose={handleCloseWordInputModal}
        onDefineWord={handleDefineFromInput}
      />
      <DefinitionModal
        isOpen={definitionModal.isOpen}
        word={definitionModal.word}
        onClose={handleCloseDefinitionModal}
        onSaveToStudyList={handleSaveWordToStudyList}
      />
      <NotesModal
        isOpen={notesModal.isOpen}
        slideId={slide.id}
        selectedText={notesModal.selectedText}
        onClose={handleCloseNotesModal}
      />
    </>
  );
}; 