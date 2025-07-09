'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Clock, 
  Star, 
  Calendar, 
  TrendingUp, 
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  BarChart3,
  Users,
  Award,
  Flame,
  MessageSquare,
  BookMarked,
  StickyNote,
  PlusCircle,
  ArrowRight,
  Globe,
  HeadphonesIcon,
  FileText,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMessages } from '@/app/contexts/MessagesContext';

interface StudyStats {
  totalNotes: number;
  studyListItems: number;
  hoursStudied: number;
  streakDays: number;
  completedLessons: number;
  totalPoints: number;
  currentLevel: number;
  nextLevelProgress: number;
}

interface StudyListItem {
  id: string;
  title: string;
  word: string;
  category: string;
  type: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Review';
  dateAdded: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  source: string;
  context?: string;
  definition?: string;
}

interface RecentNote {
  id: string;
  title: string;
  content: string;
  slideTitle: string;
  lessonTitle: string;
  timestamp: string;
  tags: string[];
}

export default function StudyHubPage() {
  const router = useRouter();
  const { openMessagesModal } = useMessages();
  const [studyStats, setStudyStats] = useState<StudyStats>({
    totalNotes: 0,
    studyListItems: 0,
    hoursStudied: 2.5,
    streakDays: 7,
    completedLessons: 12,
    totalPoints: 1875,
    currentLevel: 3,
    nextLevelProgress: 68
  });
  const [studyListItems, setStudyListItems] = useState<StudyListItem[]>([]);
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load data from localStorage
    const notes = JSON.parse(localStorage.getItem('slideNotes') || '{}');
    const studyItems = JSON.parse(localStorage.getItem('studyListItems') || '[]');
    
    setStudyStats(prev => ({
      ...prev,
      totalNotes: Object.keys(notes).length,
      studyListItems: studyItems.length
    }));
    
    setStudyListItems(studyItems);
    
    // Convert notes to recent notes format
    const notesArray = Object.entries(notes).map(([slideId, noteData]: [string, any]) => ({
      id: slideId,
      title: noteData.title || `Note from ${slideId}`,
      content: noteData.content || '',
      slideTitle: noteData.slideTitle || 'Unknown Slide',
      lessonTitle: noteData.lessonTitle || 'Unknown Lesson',
      timestamp: noteData.timestamp || new Date().toISOString(),
      tags: noteData.tags || []
    }));
    
    setRecentNotes(notesArray.slice(0, 5));
  }, []);

  const handleQuickStudy = () => {
    openMessagesModal({
      slideTitle: 'Study Hub',
      selectedText: 'Quick Study Session',
      context: 'study-hub'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'study-list', label: 'Study List', icon: BookMarked },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Study Hub</h1>
                <p className="text-slate-400">Your personalized learning center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleQuickStudy}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Quick Study
              </Button>
              <Button
                onClick={() => router.push('/microlessons')}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Lessons
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Study Streak</p>
                    <p className="text-2xl font-bold text-white">{studyStats.streakDays} days</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Points</p>
                    <p className="text-2xl font-bold text-white">{studyStats.totalPoints.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Study Items</p>
                    <p className="text-2xl font-bold text-white">{studyStats.studyListItems}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Notes</p>
                    <p className="text-2xl font-bold text-white">{studyStats.totalNotes}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <StickyNote className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentNotes.slice(0, 3).map((note) => (
                      <div key={note.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <StickyNote className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{note.title}</p>
                          <p className="text-slate-400 text-sm">{note.slideTitle}</p>
                          <p className="text-slate-500 text-xs">{new Date(note.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {studyListItems.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookMarked className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-slate-400 text-sm">{item.category}</p>
                          <p className="text-slate-500 text-xs">{new Date(item.dateAdded).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push('/study-hub/notes')}
                      className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      <StickyNote className="w-4 h-4 mr-2" />
                      View All Notes
                    </Button>
                    <Button
                      onClick={() => router.push('/study-hub/study-list')}
                      className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      <BookMarked className="w-4 h-4 mr-2" />
                      Study List
                    </Button>
                    <Button
                      onClick={() => router.push('/study-hub/ask-ai')}
                      className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                    <Button
                      onClick={() => router.push('/microlessons')}
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'study-list' && (
            <StudyListTab 
              items={studyListItems} 
              onItemClick={(item) => router.push(`/study-hub/study-list/${item.id}`)}
            />
          )}

          {activeTab === 'notes' && (
            <NotesTab 
              notes={recentNotes} 
              onNoteClick={(note) => router.push(`/study-hub/notes/${note.id}`)}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTab stats={studyStats} />
          )}
        </div>
      </div>
    </div>
  );
}

const StudyListTab = ({ items, onItemClick }: { items: StudyListItem[], onItemClick: (item: StudyListItem) => void }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-white">Study List ({items.length})</h2>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer" onClick={() => onItemClick(item)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm mb-2">{item.category}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{item.type}</span>
                  <span>{item.estimatedTime}</span>
                  <Badge variant="outline" className={`text-xs ${
                    item.priority === 'High' ? 'border-red-500 text-red-400' :
                    item.priority === 'Medium' ? 'border-yellow-500 text-yellow-400' :
                    'border-green-500 text-green-400'
                  }`}>
                    {item.priority}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <Progress value={item.progress} className="w-20 mb-2" />
                <p className="text-xs text-slate-400">{item.progress}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const NotesTab = ({ notes, onNoteClick }: { notes: RecentNote[], onNoteClick: (note: RecentNote) => void }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-white">Notes ({notes.length})</h2>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        New Note
      </Button>
    </div>
    <div className="grid gap-4">
      {notes.map((note) => (
        <Card key={note.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer" onClick={() => onNoteClick(note)}>
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-2">{note.title}</h3>
            <p className="text-slate-300 text-sm mb-3 line-clamp-2">{note.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{note.slideTitle}</span>
                <span>•</span>
                <span>{note.lessonTitle}</span>
              </div>
              <span className="text-xs text-slate-500">
                {new Date(note.timestamp).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ProgressTab = ({ stats }: { stats: StudyStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Level {stats.currentLevel}</span>
                <span className="text-white">{stats.nextLevelProgress}%</span>
              </div>
              <Progress value={stats.nextLevelProgress} className="mb-2" />
              <p className="text-xs text-slate-500">
                {100 - stats.nextLevelProgress}% to Level {stats.currentLevel + 1}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Completed Lessons</span>
              <span className="text-white font-semibold">{stats.completedLessons}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Hours Studied</span>
              <span className="text-white font-semibold">{stats.hoursStudied}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-white font-medium">Week Warrior</p>
                <p className="text-slate-400 text-sm">7 day study streak</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-white font-medium">Quick Learner</p>
                <p className="text-slate-400 text-sm">Completed 10+ lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-white font-medium">Knowledge Seeker</p>
                <p className="text-slate-400 text-sm">1000+ XP earned</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
); 