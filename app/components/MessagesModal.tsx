'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Search,
  MoreHorizontal,
  Paperclip,
  Smile,
  Trash2,
  Edit3,
  X
} from 'lucide-react';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessagesModal({ isOpen, onClose }: MessagesModalProps) {
  const [selectedConversation, setSelectedConversation] = useState('ai-assistant');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [renamingConversation, setRenamingConversation] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [conversationsList, setConversationsList] = useState([
    {
      id: 'ai-assistant',
      name: 'AI Study Assistant',
      avatar: 'AI',
      lastMessage: 'Ready to help with your learning goals!',
      timestamp: 'now',
      isOnline: true,
      unreadCount: 1,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'john-davis',
      name: 'John Davis',
      role: 'Course Instructor',
      avatar: 'JD',
      lastMessage: 'Great progress on the React module! 🚀',
      timestamp: '2h',
      isOnline: false,
      unreadCount: 0,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'study-mentor',
      name: 'Study Mentor',
      avatar: 'SM',
      lastMessage: 'Your weekly goals are ready for review',
      timestamp: '1d',
      isOnline: false,
      unreadCount: 0,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'career-advisor',
      name: 'Career Advisor',
      avatar: 'CA',
      lastMessage: 'I found some great job opportunities for you',
      timestamp: '2d',
      isOnline: true,
      unreadCount: 2,
      gradient: 'from-orange-500 to-red-500'
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active conversation data
  const activeConversation = conversationsList.find(conv => conv.id === selectedConversation);

  // Sample messages data
  const messages = [
    {
      id: 1,
      content: "Hello! I'm your AI Study Assistant. I'm here to help you with your learning journey. How can I assist you today?",
      isUser: false,
      timestamp: "2:30 PM",
      hasCode: false
    },
    {
      id: 2,
      content: "Hi! I'm working on understanding React hooks better. Can you explain useEffect to me?",
      isUser: true,
      timestamp: "2:32 PM",
      hasCode: false
    },
    {
      id: 3,
      content: "Great question! useEffect is a React Hook that lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined in React class components.\n\nHere's a basic example:\n\nuseEffect(() => {\n  // Your side effect here\n}, [dependencies]);\n\nWould you like me to explain the dependency array and different patterns?",
      isUser: false,
      timestamp: "2:33 PM",
      hasCode: true
    },
    {
      id: 4,
      content: "Yes, that would be really helpful! Can you show me some common patterns?",
      isUser: true,
      timestamp: "2:35 PM",
      hasCode: false
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 300 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 right-4 bottom-4 w-[900px] max-w-[calc(100vw-2rem)] md:max-w-[900px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[101] flex overflow-hidden border border-slate-200 dark:border-gray-700 max-md:top-2 max-md:right-2 max-md:bottom-2 max-md:left-2"
          >
            {/* Sidebar - Conversations List */}
            <div className="w-80 max-md:w-72 border-r border-slate-200 dark:border-gray-700 flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Messages
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="px-6 py-3 border-b border-slate-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              
              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {conversationsList.map((conversation) => (
                    <div 
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                        selectedConversation === conversation.id 
                          ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700'
                          : 'hover:bg-slate-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 bg-gradient-to-br ${conversation.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                          {conversation.avatar}
                        </div>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                            {conversation.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            {conversation.timestamp}
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {conversation.lastMessage}
                        </div>
                        {conversation.role && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {conversation.role}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${activeConversation?.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                      {activeConversation?.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {activeConversation?.name}
                      </div>
                      {activeConversation?.isOnline && (
                        <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Online
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
                    {!message.isUser && (
                      <div className={`w-8 h-8 bg-gradient-to-br ${activeConversation?.gradient} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                        {activeConversation?.avatar}
                      </div>
                    )}
                    
                    <div className={`flex-1 ${message.isUser ? 'flex justify-end' : ''}`}>
                      <div className={`rounded-2xl p-4 max-w-md ${
                        message.isUser 
                          ? 'bg-blue-500 text-white rounded-tr-md' 
                          : 'bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-slate-100 rounded-tl-md'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">
                          {message.hasCode ? (
                            <div>
                              {message.content.split('useEffect')[0]}
                              <div className="mt-2 p-3 bg-slate-200 dark:bg-gray-700 rounded-lg font-mono text-xs">
                                useEffect(() =&gt; {'{'}
                                <br />
                                &nbsp;&nbsp;// Your side effect here
                                <br />
                                {'}'}, [dependencies]);
                              </div>
                              {message.content.split('Would you like me to explain')[1] && 
                                'Would you like me to explain' + message.content.split('Would you like me to explain')[1]
                              }
                            </div>
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                      <div className={`text-xs text-slate-500 dark:text-slate-500 mt-1 ${message.isUser ? 'mr-1' : 'ml-1'}`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-6 border-t border-slate-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon"
                        className="h-8 w-8 bg-blue-500 hover:bg-blue-600 rounded-full"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
