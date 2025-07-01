'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  BookOpen, 
  Bookmark, 
  BarChart3, 
  Target, 
  Clock, 
  Search,
  ChevronRight,
  Flame,
  Brain,
  Star,
  Calendar
} from 'lucide-react';

interface StudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyModal: React.FC<StudyModalProps> = ({ isOpen, onClose }) => {
  const [studyStats, setStudyStats] = useState({
    totalNotes: 0,
    studyListItems: 0,
    bookmarkedSlides: 0,
    studyStreak: 3,
    totalStudyTime: '2.5 hours'
  });

  useEffect(() => {
    if (isOpen) {
      // Load actual data from localStorage
      const notes = JSON.parse(localStorage.getItem('slideNotes') || '{}');
      const studyItems = JSON.parse(localStorage.getItem('studyListItems') || '[]');
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedSlides') || '[]');
      
      setStudyStats({
        totalNotes: Object.keys(notes).length,
        studyListItems: studyItems.length,
        bookmarkedSlides: bookmarks.length,
        studyStreak: 3, // Could be calculated from study history
        totalStudyTime: '2.5 hours' // Could be calculated from actual study time
      });
    }
  }, [isOpen]);

  const navigateToStudyHub = (section?: string) => {
    const url = section ? `/study-hub/${section}` : '/study-hub';
    window.open(url, '_blank');
    onClose();
  };

  const studyOptions = [
    {
      id: 'notes',
      title: 'My Notes',
      description: `${studyStats.totalNotes} notes across slides`,
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      hoverColor: 'hover:bg-blue-500/20',
      action: () => navigateToStudyHub('notes')
    },
    {
      id: 'study-list',
      title: 'My Study List',
      description: `${studyStats.studyListItems} items to review`,
      icon: BookOpen,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      hoverColor: 'hover:bg-green-500/20',
      action: () => navigateToStudyHub('study-list')
    },
    {
      id: 'bookmarks',
      title: 'Bookmarked Slides',
      description: `${studyStats.bookmarkedSlides} saved slides`,
      icon: Bookmark,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      hoverColor: 'hover:bg-purple-500/20',
      action: () => navigateToStudyHub('bookmarks')
    },
    {
      id: 'progress',
      title: 'Study Progress',
      description: 'Track your learning journey',
      icon: BarChart3,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      hoverColor: 'hover:bg-emerald-500/20',
      action: () => navigateToStudyHub('progress')
    },
    {
      id: 'goals',
      title: 'Study Goals',
      description: 'Set and track learning targets',
      icon: Target,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      hoverColor: 'hover:bg-orange-500/20',
      action: () => navigateToStudyHub('goals')
    },
    {
      id: 'recent',
      title: 'Recent Activity',
      description: 'Last studied items',
      icon: Clock,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      hoverColor: 'hover:bg-cyan-500/20',
      action: () => navigateToStudyHub('recent')
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-750">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Study Hub</h3>
                  <p className="text-slate-400 text-sm">Your learning toolkit</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-6 py-4 bg-slate-750 border-b border-slate-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-lg font-bold text-orange-500">{studyStats.studyStreak}</span>
                </div>
                <p className="text-xs text-slate-400">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-lg font-bold text-blue-500">{studyStats.totalStudyTime}</span>
                </div>
                <p className="text-xs text-slate-400">Total Study Time</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold text-yellow-500">85%</span>
                </div>
                <p className="text-xs text-slate-400">Progress</p>
              </div>
            </div>
          </div>

          {/* Study Options */}
          <div className="p-6">
            <div className="grid gap-3">
              {studyOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className={`w-full p-4 rounded-xl border border-slate-600 ${option.bgColor} ${option.hoverColor} transition-all duration-200 hover:scale-[1.02] hover:border-slate-500 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${option.bgColor} rounded-lg`}>
                        <option.icon className={`w-5 h-5 ${option.color}`} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-white group-hover:text-white/90">
                          {option.title}
                        </h4>
                        <p className="text-slate-400 text-sm group-hover:text-slate-300">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="flex gap-3">
                <button
                  onClick={() => navigateToStudyHub()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                >
                  Open Study Hub
                </button>
                <button
                  onClick={() => {
                    // Quick search functionality
                    navigateToStudyHub('search');
                  }}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                  title="Quick Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}; 