'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft,
  Edit3,
  SquarePen,
  Search,
  Send,
  Plus,
  Camera,
  Mic,
  MoreHorizontal,
  Info,
  Phone,
  Video,
  Bell,
  Bot,
  User,
  Check,
  Trash2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock conversation data - Apple Messages style
const conversations = [
  {
    id: 'notifications',
    name: 'Notifications',
    avatar: '🔔',
    avatarColor: 'bg-red-500',
    lastMessage: 'Course deadline reminder: React Fundamentals due tomorrow',
    timestamp: '10:30 AM',
    unreadCount: 3,
    type: 'system' as const,
    isOnline: false,
    hasUnread: true
  },
  {
    id: 'upskill-ai',
    name: 'Upskill',
    avatar: '🤖',
    avatarColor: 'bg-blue-500',
    lastMessage: 'Great progress on your React learning! Ready for the next challenge?',
    timestamp: '9:45 AM',
    unreadCount: 0,
    type: 'ai' as const,
    isOnline: true,
    hasUnread: false
  },
  {
    id: 'react-help',
    name: 'React Fundamentals',
    avatar: '⚛️',
    avatarColor: 'bg-cyan-500',
    lastMessage: 'You: How do I handle state in functional components?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    type: 'topic' as const,
    isOnline: false,
    hasUnread: false
  },
  {
    id: 'interview-prep',
    name: 'Interview Prep',
    avatar: '🧠',
    avatarColor: 'bg-purple-500',
    lastMessage: 'Practice these 5 coding questions before your interview',
    timestamp: 'Tuesday',
    unreadCount: 1,
    type: 'topic' as const,
    isOnline: false,
    hasUnread: true
  },
  {
    id: 'aws-study',
    name: 'AWS Certification',
    avatar: '☁️',
    avatarColor: 'bg-orange-500',
    lastMessage: 'You: What\'s the difference between S3 and EBS?',
    timestamp: 'Monday',
    unreadCount: 0,
    type: 'topic' as const,
    isOnline: false,
    hasUnread: false
  },
  {
    id: 'career-advice',
    name: 'Career Growth',
    avatar: '💼',
    avatarColor: 'bg-green-500',
    lastMessage: 'Consider these 3 paths for advancing to senior developer',
    timestamp: 'Sunday',
    unreadCount: 0,
    type: 'topic' as const,
    isOnline: false,
    hasUnread: false
  }
];

// Available contacts/topics for new messages
const availableContacts = [
  {
    id: 'upskill-ai',
    name: 'Upskill',
    avatar: '🤖',
    avatarColor: 'bg-blue-500',
    description: 'AI Learning Assistant',
    isOnline: true
  },
  {
    id: 'new-react-topic',
    name: 'React Advanced Patterns',
    avatar: '⚛️',
    avatarColor: 'bg-cyan-500',
    description: 'Start a new React discussion'
  },
  {
    id: 'new-javascript-topic',
    name: 'JavaScript Deep Dive',
    avatar: '🟨',
    avatarColor: 'bg-yellow-500',
    description: 'Explore advanced JavaScript concepts'
  },
  {
    id: 'new-career-topic',
    name: 'Career Planning',
    avatar: '💼',
    avatarColor: 'bg-green-500',
    description: 'Discuss career growth strategies'
  },
  {
    id: 'new-interview-topic',
    name: 'Technical Interviews',
    avatar: '🧠',
    avatarColor: 'bg-purple-500',
    description: 'Practice interview questions'
  },
  {
    id: 'new-aws-topic',
    name: 'AWS Cloud Computing',
    avatar: '☁️',
    avatarColor: 'bg-orange-500',
    description: 'Learn cloud architecture'
  }
];

// Mock messages for each conversation
const mockMessages = {
  'notifications': [
    {
      id: '1',
      content: 'Course deadline reminder: React Fundamentals due tomorrow',
      type: 'system' as const,
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      content: '🎉 Congratulations! You\'ve completed the JavaScript Basics course',
      type: 'system' as const,
      timestamp: '9:15 AM'
    },
    {
      id: '3',
      content: 'New career opportunity matches your profile: Senior React Developer at TechCorp',
      type: 'system' as const,
      timestamp: '8:45 AM'
    }
  ],
  'upskill-ai': [
    {
      id: '1',
      content: 'Hi! I\'m Upskill, your AI learning assistant. How can I help you today?',
      type: 'ai' as const,
      timestamp: '9:00 AM'
    },
    {
      id: '2',
      content: 'I want to learn React hooks',
      type: 'user' as const,
      timestamp: '9:01 AM'
    },
    {
      id: '3',
      content: 'Great choice! React hooks are essential for modern React development. Let\'s start with useState and useEffect. \n\nHere\'s a simple example:\n\n```jsx\nimport { useState, useEffect } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n  \n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}\n```\n\nWould you like me to explain how this works?',
      type: 'ai' as const,
      timestamp: '9:01 AM'
    },
    {
      id: '4',
      content: 'Yes, please explain useEffect',
      type: 'user' as const,
      timestamp: '9:02 AM'
    },
    {
      id: '5',
      content: 'Great progress on your React learning! Ready for the next challenge?',
      type: 'ai' as const,
      timestamp: '9:45 AM'
    }
  ],
  'react-help': [
    {
      id: '1',
      content: 'How do I handle state in functional components?',
      type: 'user' as const,
      timestamp: 'Yesterday'
    },
    {
      id: '2',
      content: 'Great question! In functional components, you use the useState hook to manage state...',
      type: 'ai' as const,
      timestamp: 'Yesterday'
    }
  ],
  'interview-prep': [
    {
      id: '1',
      content: 'Practice these 5 coding questions before your interview',
      type: 'ai' as const,
      timestamp: 'Tuesday'
    }
  ],
  'aws-study': [
    {
      id: '1',
      content: 'What\'s the difference between S3 and EBS?',
      type: 'user' as const,
      timestamp: 'Monday'
    }
  ],
  'career-advice': [
    {
      id: '1',
      content: 'Consider these 3 paths for advancing to senior developer',
      type: 'ai' as const,
      timestamp: 'Sunday'
    }
  ]
};

export default function AskAIPage() {
  const [currentView, setCurrentView] = useState<'list' | 'chat' | 'newMessage'>('list');
  const [activeConversation, setActiveConversation] = useState<typeof conversations[0] | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [newMessageTo, setNewMessageTo] = useState('');
  const [selectedContact, setSelectedContact] = useState<typeof availableContacts[0] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  // Utility function to force browser UI hiding
  const forceBrowserUIHide = () => {
    if (window.innerWidth < 1024) {
      // Force focus away from any input elements to help hide keyboard
      if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur();
      }
      
      // Force a small scroll to trigger minimal UI
      const currentScroll = window.scrollY;
      window.scrollTo(0, currentScroll + 2);
      
      // Add the browser UI hidden class
      document.documentElement.classList.add('browser-ui-hidden');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [currentView, isLoading]);

  // Hide URL bar and bottom browser UI on mobile when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only apply on mobile devices and small tablets
      if (window.innerWidth < 900) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past threshold - hide browser UI
          setIsScrollingDown(true);
          
          // Add class to trigger minimal UI mode
          document.documentElement.classList.add('browser-ui-hidden');
          
          // Force viewport height calculation to maximize screen space
          if (window.visualViewport) {
            const viewportHeight = window.visualViewport.height;
            const screenHeight = window.screen.height;
            
            document.documentElement.style.setProperty(
              '--viewport-height', 
              `${viewportHeight}px`
            );
            document.documentElement.style.setProperty(
              '--screen-height', 
              `${screenHeight}px`
            );
          } else {
            // Fallback for browsers without visualViewport
            document.documentElement.style.setProperty(
              '--viewport-height', 
              `${window.innerHeight}px`
            );
            document.documentElement.style.setProperty(
              '--screen-height', 
              `${window.screen.height}px`
            );
          }
          
          // Force a tiny scroll to trigger browser UI hiding
          setTimeout(() => {
            window.scrollTo(0, currentScrollY + 1);
          }, 10);
          
        } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
          // Scrolling up or near top - show browser UI
          setIsScrollingDown(false);
          
          // Remove minimal UI class
          document.documentElement.classList.remove('browser-ui-hidden');
          
          // Reset viewport height to default
          document.documentElement.style.setProperty(
            '--viewport-height', 
            '100vh'
          );
          document.documentElement.style.setProperty(
            '--screen-height', 
            '100vh'
          );
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Enhanced resize and viewport change handling
    const handleResize = () => {
      if (window.innerWidth < 900) {
        if (window.visualViewport) {
          const viewportHeight = window.visualViewport.height;
          document.documentElement.style.setProperty(
            '--viewport-height', 
            `${viewportHeight}px`
          );
        } else {
          document.documentElement.style.setProperty(
            '--viewport-height', 
            `${window.innerHeight}px`
          );
        }
      } else {
        // Desktop - reset everything
        document.documentElement.classList.remove('browser-ui-hidden');
        document.documentElement.style.setProperty(
          '--viewport-height', 
          '100vh'
        );
        document.documentElement.style.setProperty(
          '--screen-height', 
          '100vh'
        );
      }
    };

    // Listen for viewport changes (when browser UI shows/hides)
    const handleViewportChange = () => {
      if (window.visualViewport && window.innerWidth < 900) {
        const viewportHeight = window.visualViewport.height;
        document.documentElement.style.setProperty(
          '--viewport-height', 
          `${viewportHeight}px`
        );
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      // Clean up on unmount
      document.documentElement.classList.remove('browser-ui-hidden');
    };
  }, [lastScrollY]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(newMessageTo.toLowerCase()) ||
    contact.description.toLowerCase().includes(newMessageTo.toLowerCase())
  );

  const getMessages = (conversationId: string) => {
    return mockMessages[conversationId as keyof typeof mockMessages] || [];
  };

  const handleConversationClick = (conversation: typeof conversations[0]) => {
    if (isEditMode) {
      // Toggle selection in edit mode
      const newSelected = new Set(selectedConversations);
      if (newSelected.has(conversation.id)) {
        newSelected.delete(conversation.id);
      } else {
        newSelected.add(conversation.id);
      }
      setSelectedConversations(newSelected);
    } else {
      // Normal navigation
      setActiveConversation(conversation);
      setCurrentView('chat');
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setActiveConversation(null);
  };

  const handleNewMessage = () => {
    setCurrentView('newMessage');
    setNewMessageTo('');
    setSelectedContact(null);
  };

  const handleCancelNewMessage = () => {
    setCurrentView('list');
    setNewMessageTo('');
    setSelectedContact(null);
  };

  const handleContactSelect = (contact: typeof availableContacts[0]) => {
    setSelectedContact(contact);
    setNewMessageTo(contact.name);
  };

  const handleStartNewConversation = () => {
    if (selectedContact) {
      // Create a new conversation or navigate to existing one
      const existingConversation = conversations.find(conv => conv.id === selectedContact.id);
      if (existingConversation) {
        setActiveConversation(existingConversation);
      } else {
        // Create new conversation object
        const newConversation = {
          id: selectedContact.id,
          name: selectedContact.name,
          avatar: selectedContact.avatar,
          avatarColor: selectedContact.avatarColor,
          lastMessage: '',
          timestamp: 'Now',
          unreadCount: 0,
          type: 'topic' as const,
          isOnline: selectedContact.isOnline || false,
          hasUnread: false
        };
        setActiveConversation(newConversation);
      }
      setCurrentView('chat');
      setNewMessageTo('');
      setSelectedContact(null);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const userMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      type: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message to mock data
    if (mockMessages[activeConversation.id as keyof typeof mockMessages]) {
      (mockMessages[activeConversation.id as keyof typeof mockMessages] as any[]).push(userMessage);
    }

    setNewMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question. Let me help you with that...",
        type: 'ai' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (mockMessages[activeConversation.id as keyof typeof mockMessages]) {
        (mockMessages[activeConversation.id as keyof typeof mockMessages] as any[]).push(aiResponse);
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // Clear selections when exiting edit mode
      setSelectedConversations(new Set());
    }
  };

  const handleReadAll = () => {
    // Mark all selected conversations as read
    console.log('Mark as read:', Array.from(selectedConversations));
    setSelectedConversations(new Set());
    setIsEditMode(false);
  };

  const handleDeleteSelected = () => {
    // Delete selected conversations
    console.log('Delete conversations:', Array.from(selectedConversations));
    setSelectedConversations(new Set());
    setIsEditMode(false);
  };

  const handleSelectAll = () => {
    if (selectedConversations.size === filteredConversations.length) {
      // Deselect all
      setSelectedConversations(new Set());
    } else {
      // Select all
      setSelectedConversations(new Set(filteredConversations.map(conv => conv.id)));
    }
  };

  // New Message View - Apple Messages Style
  if (currentView === 'newMessage') {
    return (
      <div 
        className="fixed inset-0 top-[68px] bottom-20 tablet:static tablet:h-[calc(100vh-8rem)] bg-white dark:bg-black flex flex-col z-[60] tablet:z-auto tablet:rounded-lg tablet:border tablet:border-gray-200 tablet:dark:border-gray-800 tablet:shadow-sm overflow-hidden mobile-viewport-transition"
        onTouchStart={forceBrowserUIHide}
      >
        {/* New Message Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 tablet:rounded-t-lg">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleCancelNewMessage}
              className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 h-8 px-3 text-base font-normal"
            >
              Cancel
            </Button>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Message
            </h1>
            
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* To Field */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 dark:text-gray-400 text-base font-medium min-w-0">
              To:
            </span>
            {selectedContact ? (
              <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs",
                  selectedContact.avatarColor
                )}>
                  {selectedContact.avatar}
                </div>
                <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  {selectedContact.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedContact(null);
                    setNewMessageTo('');
                  }}
                  className="h-4 w-4 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Input
                value={newMessageTo}
                onChange={(e) => setNewMessageTo(e.target.value)}
                placeholder="Type a name or topic"
                className="flex-1 border-none bg-transparent text-base placeholder-gray-500 focus:ring-0 focus:border-none p-0"
              />
            )}
          </div>
        </div>

        {/* Contact Suggestions */}
        <div className="flex-1 bg-white dark:bg-black overflow-y-auto overscroll-contain mobile-scrollable">
          {!selectedContact && (
            <>
              {/* Suggested Contacts Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Suggested
                </h3>
              </div>
              
              {/* Contact List */}
              <div>
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors"
                  >
                    <div className="relative">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-medium",
                        contact.avatarColor
                      )}>
                        {contact.avatar}
                      </div>
                      {contact.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white text-base">
                        {contact.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Selected Contact Message Area */}
          {selectedContact && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1" />
              
              {/* Message Input */}
              <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
                <div className="flex items-end gap-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 mb-1">
                    <Plus className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-end gap-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleStartNewConversation();
                          }
                        }}
                        placeholder="Message"
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 text-base leading-6 max-h-20 overflow-y-auto overscroll-contain min-h-[24px]"
                      />
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleStartNewConversation}
                    disabled={!newMessage.trim()}
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full mb-1 transition-all duration-200",
                      newMessage.trim()
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'chat' && activeConversation) {
    const messages = getMessages(activeConversation.id);
    
    return (
      <div 
        className="fixed inset-0 top-[68px] bottom-20 tablet:static tablet:h-[calc(100vh-8rem)] bg-white dark:bg-black flex flex-col z-[60] tablet:z-auto tablet:rounded-lg tablet:border tablet:border-gray-200 tablet:dark:border-gray-800 tablet:shadow-sm overflow-hidden mobile-viewport-transition"
        onTouchStart={forceBrowserUIHide}
      >
        {/* Chat Header - iOS Style */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between tablet:rounded-t-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium relative",
                activeConversation.avatarColor
              )}>
                {activeConversation.avatar}
                {activeConversation.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-base">
                  {activeConversation.name}
                </h2>
                {activeConversation.isOnline && (
                  <p className="text-xs text-green-500">Online</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {activeConversation.type === 'ai' && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                  <Phone className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 px-4 py-4 bg-white dark:bg-black overflow-y-auto overscroll-contain mobile-scrollable">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 max-w-[85%]",
                  message.type === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {message.type !== 'user' && (
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-auto",
                    activeConversation.avatarColor
                  )}>
                    {activeConversation.avatar}
                  </div>
                )}
                
                <div className={cn(
                  "rounded-2xl px-4 py-2 max-w-full break-words",
                  message.type === 'user'
                    ? "bg-blue-500 text-white ml-2"
                    : message.type === 'system'
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-2"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-2"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className={cn(
                    "text-xs mt-1 opacity-70",
                    message.type === 'user' ? "text-white" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-auto",
                  activeConversation.avatarColor
                )}>
                  {activeConversation.avatar}
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 mr-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input - iOS Style */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 tablet:rounded-b-lg">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 mb-1">
              <Plus className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 relative">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message"
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 text-base leading-6 max-h-20 overflow-y-auto overscroll-contain min-h-[24px]"
                />
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full mb-1 transition-all duration-200",
                newMessage.trim()
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Messages List View - iOS Style
  return (
    <div 
      className="fixed inset-0 top-[68px] bottom-20 tablet:static tablet:h-[calc(100vh-8rem)] bg-white dark:bg-black flex flex-col z-[60] tablet:z-auto tablet:rounded-lg tablet:border tablet:border-gray-200 tablet:dark:border-gray-800 tablet:shadow-sm overflow-hidden mobile-viewport-transition"
      onTouchStart={forceBrowserUIHide}
    >
      {/* Header - iOS Messages Style */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 tablet:rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={handleEditToggle}
            className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 h-8 px-3 text-base font-normal"
          >
            {isEditMode ? 'Cancel' : 'Edit'}
          </Button>
          
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Messages
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewMessage}
            className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            disabled={isEditMode}
          >
            <SquarePen className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search Bar */}
        {!isEditMode && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-100 dark:bg-gray-800 border-none rounded-lg h-9 text-base placeholder-gray-500"
            />
          </div>
        )}

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSelectAll}
              className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 h-8 px-3 text-base font-normal"
            >
              {selectedConversations.size === filteredConversations.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedConversations.size} selected
            </span>
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto overscroll-contain mobile-scrollable">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleConversationClick(conversation)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors",
              !isEditMode && "hover:bg-gray-50 dark:hover:bg-gray-900",
              isEditMode && selectedConversations.has(conversation.id) && "bg-blue-50 dark:bg-blue-950"
            )}
          >
            {/* Selection Circle (Edit Mode) */}
            {isEditMode && (
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                selectedConversations.has(conversation.id)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              )}>
                {selectedConversations.has(conversation.id) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
            )}

            <div className="relative">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium",
                conversation.avatarColor
              )}>
                {conversation.avatar}
              </div>
              {conversation.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                  {conversation.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {conversation.timestamp}
                  </span>
                  {conversation.unreadCount > 0 && !isEditMode && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm truncate leading-tight">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Mode Bottom Actions */}
      {isEditMode && selectedConversations.size > 0 && (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 tablet:rounded-b-lg">
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="ghost"
              onClick={handleReadAll}
              className="flex flex-col items-center gap-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 h-auto py-2 px-4"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs">Read All</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleDeleteSelected}
              className="flex flex-col items-center gap-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 h-auto py-2 px-4"
            >
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <Trash2 className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs">Delete</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 