'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LessonConfig } from '@/types/microlesson/slide';
import { SlideRenderer } from './SlideRenderer';
import { StudyModal } from './StudyModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Home, RotateCcw, Play, MessageSquare, Search, Flame, Zap, BookOpen } from 'lucide-react';
import { useMessages } from '@/app/contexts/MessagesContext';

interface SlidePlayerProps {
  config: LessonConfig;
  onComplete?: () => void;
  onExit?: () => void;
}

export const SlidePlayer: React.FC<SlidePlayerProps> = ({ 
  config, 
  onComplete,
  onExit 
}) => {
  const router = useRouter();
  const { openMessagesModal } = useMessages();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());
  const [slideProgress, setSlideProgress] = useState<{ [key: number]: number }>({});
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showStudyModal, setShowStudyModal] = useState(false);

  const currentSlide = config.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / config.slides.length) * 100;

  useEffect(() => {
    // Apply theme to document if provided
    if (config.theme) {
      const root = document.documentElement;
      if (config.theme.primaryColor) {
        root.style.setProperty('--primary-color', config.theme.primaryColor);
      }
      if (config.theme.accentColor) {
        root.style.setProperty('--accent-color', config.theme.accentColor);
      }
      if (config.theme.backgroundColor) {
        root.style.setProperty('--bg-color', config.theme.backgroundColor);
      }
    }

    return () => {
      // Cleanup theme variables
      const root = document.documentElement;
      root.style.removeProperty('--primary-color');
      root.style.removeProperty('--accent-color');
      root.style.removeProperty('--bg-color');
    };
  }, [config.theme]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < config.slides.length) {
      setCurrentSlideIndex(index);
      setCompletedSlides(prev => new Set(prev).add(currentSlideIndex));
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < config.slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    } else {
      // Lesson completed
      setCompletedSlides(prev => new Set(prev).add(currentSlideIndex));
      onComplete?.();
    }
  };

  const previousSlide = () => {
    goToSlide(currentSlideIndex - 1);
  };

  const restartLesson = () => {
    setCurrentSlideIndex(0);
    setCompletedSlides(new Set());
    setSlideProgress({});
    setIsPlaying(true);
  };

  const handleQuickCheckAnswered = (correct: boolean) => {
    setSlideProgress(prev => ({
      ...prev,
      [currentSlideIndex]: correct ? 100 : 50
    }));
  };

  // Context menu handlers
  const handleDefineWord = (word: string) => {
    // This will be handled by the DefinitionModal in SlideRenderer
    console.log('Define word:', word);
  };

  const handleSaveToStudyList = (word: string) => {
    // This will be handled by the context menu in SlideRenderer
    console.log('Save to study list:', word);
  };

  const handleAddToNotes = (text: string, slideId?: string) => {
    // This will be handled by the NotesModal in SlideRenderer
    console.log('Add to notes:', text, slideId);
  };

  const handleAskAI = (text: string) => {
    const slideTitle = 'title' in currentSlide ? currentSlide.title : `Slide ${currentSlide.id}`;
    const contextData = {
      selectedText: text,
      slideTitle: slideTitle,
      slideId: currentSlide.id,
      lessonTitle: config.title,
      course: config.course || undefined
    };

    openMessagesModal(contextData);
  };

  const canGoNext = currentSlideIndex < config.slides.length - 1;
  const canGoPrevious = currentSlideIndex > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4 flex items-center justify-between z-50">
        {/* Left Section - Exit and Progress */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Back to Slide Editor"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Editor</span>
          </button>
          
          {/* Progress Info */}
          <div className="text-left">
            <div className="text-white text-sm font-medium">
              {currentSlideIndex + 1} / {config.slides.length}
            </div>
            <div className="text-slate-400 text-xs">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>

        {/* Center Section - Breadcrumb */}
        <div className="flex-1 flex justify-center">
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-600/50">
            <div className="flex items-center text-sm">
              {config.course && (
                <>
                  <span className="text-blue-400 font-medium">{config.course}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 mx-2" />
                </>
              )}
              {config.lesson && (
                <>
                  <span className="text-emerald-400 font-medium">{config.lesson}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 mx-2" />
                </>
              )}
              <span className="text-white font-semibold">{config.title}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Tools and Actions */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <button
            onClick={restartLesson}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Restart Lesson"
          >
            <RotateCcw className="w-5 h-5 text-slate-400" />
          </button>

          {/* Floating Window Components */}
          <div className="flex items-center gap-3">
            {/* Points Display */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700/60 hover:scale-105 transition-all duration-200">
                <Flame className="h-3 w-3 text-orange-600" />
                <span className="text-xs font-bold text-orange-600">15</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700/60 hover:scale-105 transition-all duration-200">
                <Zap className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-bold text-purple-600">1.8k</span>
              </div>
            </div>

            {/* Search Tool */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              title="Search"
            >
              <Search className="h-4 w-4 text-slate-400 hover:text-emerald-400 transition-colors" />
            </button>

            {/* Study Hub */}
            <button
              onClick={() => setShowStudyModal(true)}
              className="relative group p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-105"
              title="Study Hub"
            >
              <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-green-400 transition-colors duration-300" />
              {/* Study Items Count */}
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-green-500 to-emerald-500 items-center justify-center shadow-lg">
                    <span className="text-[8px] font-bold text-white">5</span>
                  </span>
                </span>
              </div>
            </button>

            {/* Messages */}
            <button
              onClick={() => setShowMessagesModal(true)}
              className="relative group p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-105"
              title="Messages"
            >
              <MessageSquare className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors duration-300 fill-current" />
              {/* New Message Count */}
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 items-center justify-center shadow-lg">
                    <span className="text-[8px] font-bold text-white">3</span>
                  </span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full overflow-y-auto"
          >
            <SlideRenderer
              slide={currentSlide}
              isActive={true}
              onNext={nextSlide}
              onPrevious={previousSlide}
              onQuickCheckAnswered={handleQuickCheckAnswered}
              onDefineWord={handleDefineWord}
              onSaveToStudyList={handleSaveToStudyList}
              onAddToNotes={handleAddToNotes}
              onAskAI={handleAskAI}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={previousSlide}
            disabled={!canGoPrevious}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide Dots */}
          <div className="flex items-center space-x-2">
            {config.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlideIndex
                    ? 'bg-blue-500 scale-110'
                    : completedSlides.has(index)
                    ? 'bg-green-500'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                title={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={!canGoNext && !onComplete}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <span>{canGoNext ? 'Next' : 'Complete'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Modal */}
      {showMessagesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-6xl h-[80vh] overflow-hidden flex"
          >
            {/* Messages Sidebar */}
            <div className="w-80 border-r border-slate-700 flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Messages
                </h3>
                <button
                  onClick={() => setShowMessagesModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-slate-400 text-xl">×</span>
                </button>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              
              {/* Conversations */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/10 border border-blue-700/30 cursor-pointer">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      AI
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">AI Study Assistant</h4>
                      <span className="text-xs text-slate-400">now</span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">Ready to help with your learning goals!</p>
                  </div>
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">John Davis</h4>
                      <span className="text-xs text-slate-400">2h</span>
                    </div>
                    <p className="text-slate-400 text-sm">Course Instructor</p>
                    <p className="text-slate-400 text-sm truncate">Great progress on the React module! 🚀</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    CA
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">Career Advisor</h4>
                      <span className="text-xs text-slate-400">2d</span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">I found some great job opportunities for you</p>
                  </div>
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div>
                  <h4 className="text-white font-semibold">AI Study Assistant</h4>
                  <p className="text-green-400 text-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-700/50 rounded-2xl rounded-tl-md p-4 max-w-md">
                      <p className="text-white text-sm">Hi! I'm your AI Study Assistant. I'm here to help you with your learning journey during this microlesson. What would you like to work on?</p>
                    </div>
                    <span className="text-slate-400 text-xs mt-1 block">Just now</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex-1 flex justify-end">
                    <div className="bg-blue-600 rounded-2xl rounded-tr-md p-4 max-w-md">
                      <p className="text-white text-sm">I need help understanding this semiconductor manufacturing process better, especially the wafer processing steps.</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    You
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-700/50 rounded-2xl rounded-tl-md p-4 max-w-md">
                      <p className="text-white text-sm">Great question! Wafer processing is crucial in semiconductor manufacturing. Based on the current slide you're viewing, I can see you're learning about photolithography. Would you like me to explain how this connects to the overall wafer processing flow?</p>
                    </div>
                    <span className="text-slate-400 text-xs mt-1 block">1 minute ago</span>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="Ask me anything about this lesson..."
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                      rows={1}
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg mx-4"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Lesson Content
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 hover:bg-slate-700 rounded"
              >
                <span className="text-slate-400 text-xl">×</span>
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search for topics, concepts, or keywords..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-2">
                <div className="text-slate-400 text-sm font-medium mb-2">Quick Links:</div>
                <button className="w-full text-left p-2 hover:bg-slate-700 rounded text-slate-300 text-sm">
                  → Key Manufacturing Steps
                </button>
                <button className="w-full text-left p-2 hover:bg-slate-700 rounded text-slate-300 text-sm">
                  → Wafer Processing
                </button>
                <button className="w-full text-left p-2 hover:bg-slate-700 rounded text-slate-300 text-sm">
                  → Clean Room Requirements
                </button>
                <button className="w-full text-left p-2 hover:bg-slate-700 rounded text-slate-300 text-sm">
                  → Equipment Identification
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Study Modal */}
      <StudyModal 
        isOpen={showStudyModal} 
        onClose={() => setShowStudyModal(false)} 
      />
    </div>
  );
}; 