'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Bot,
  Send,
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Save,
  Share2,
  Trash2,
  MessageSquare,
  Brain,
  Code,
  BookOpen,
  Lightbulb,
  ChevronDown,
  User,
  Clock,
  Star,
  Download,
  Mic,
  Image,
  Paperclip
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock conversation data
const conversations = [
  {
    id: 1,
    title: 'React Performance Optimization',
    lastMessage: 'How can I optimize my React app performance?',
    timestamp: '2024-01-20 14:30',
    messageCount: 8,
    category: 'React',
    pinned: true
  },
  {
    id: 2,
    title: 'Machine Learning Algorithms',
    lastMessage: 'Explain the difference between supervised and unsupervised learning',
    timestamp: '2024-01-19 16:45',
    messageCount: 12,
    category: 'AI/ML',
    pinned: false
  },
  {
    id: 3,
    title: 'AWS Architecture Question',
    lastMessage: 'Best practices for serverless architecture on AWS?',
    timestamp: '2024-01-18 09:15',
    messageCount: 6,
    category: 'Cloud',
    pinned: false
  },
  {
    id: 4,
    title: 'Interview Prep Help',
    lastMessage: 'Can you help me prepare for technical interviews?',
    timestamp: '2024-01-17 11:20',
    messageCount: 15,
    category: 'Career',
    pinned: true
  }
];

// Mock messages for the active conversation
const messages = [
  {
    id: 1,
    type: 'user',
    content: 'How can I optimize my React app performance?',
    timestamp: '14:25'
  },
  {
    id: 2,
    type: 'ai',
    content: 'Great question! Here are the key strategies for optimizing React performance:\n\n**1. Memoization:**\n- Use `React.memo()` for functional components\n- Use `useMemo()` for expensive calculations\n- Use `useCallback()` for function references\n\n**2. Code Splitting:**\n- Implement lazy loading with `React.lazy()`\n- Use dynamic imports for route-based splitting\n\n**3. Virtual Scrolling:**\n- For large lists, use libraries like `react-window`\n\n**4. Bundle Optimization:**\n- Tree shake unused code\n- Analyze bundle with webpack-bundle-analyzer\n\nWould you like me to elaborate on any of these techniques?',
    timestamp: '14:26'
  },
  {
    id: 3,
    type: 'user',
    content: 'Can you show me an example of using React.memo effectively?',
    timestamp: '14:28'
  },
  {
    id: 4,
    type: 'ai',
    content: 'Absolutely! Here\'s a practical example of using React.memo:\n\n```jsx\n// Without memo - re-renders on every parent update\nconst ExpensiveComponent = ({ data, onClick }) => {\n  console.log(\'Rendering ExpensiveComponent\');\n  return (\n    <div onClick={onClick}>\n      {data.map(item => <div key={item.id}>{item.name}</div>)}\n    </div>\n  );\n};\n\n// With memo - only re-renders when props actually change\nconst OptimizedComponent = React.memo(({ data, onClick }) => {\n  console.log(\'Rendering OptimizedComponent\');\n  return (\n    <div onClick={onClick}>\n      {data.map(item => <div key={item.id}>{item.name}</div>)}\n    </div>\n  );\n});\n\n// For deep comparison\nconst DeepMemoComponent = React.memo(MyComponent, (prevProps, nextProps) => {\n  return prevProps.data.length === nextProps.data.length &&\n         prevProps.data.every((item, index) => \n           item.id === nextProps.data[index].id\n         );\n});\n```\n\n**Key Points:**\n- React.memo does shallow comparison by default\n- Provide custom comparison function for complex objects\n- Don\'t overuse - only for components that render frequently\n\nNeed help with useCallback or useMemo next?',
    timestamp: '14:29'
  },
  {
    id: 5,
    type: 'user',
    content: 'Yes, please explain useCallback with examples',
    timestamp: '14:30'
  }
];

const quickPrompts = [
  {
    title: 'Explain a Concept',
    prompt: 'Explain this concept in simple terms:',
    icon: Brain,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
  },
  {
    title: 'Debug Code',
    prompt: 'Help me debug this code issue:',
    icon: Code,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
  },
  {
    title: 'Review Code',
    prompt: 'Please review this code and suggest improvements:',
    icon: Search,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
  },
  {
    title: 'Study Plan',
    prompt: 'Create a study plan for learning:',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
  },
  {
    title: 'Get Ideas',
    prompt: 'Give me project ideas for:',
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
  },
  {
    title: 'Interview Prep',
    prompt: 'Help me prepare for interviews about:',
    icon: MessageSquare,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
  }
];

export default function AskAIPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsLoading(true);
    // Simulate AI response delay
    setTimeout(() => {
      setIsLoading(false);
      setNewMessage('');
    }, 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setNewMessage(prompt + ' ');
  };

  const startNewConversation = () => {
    // Logic to start new conversation
    console.log('Starting new conversation');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <Bot className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ask AI</h1>
              <p className="text-slate-600 dark:text-slate-300">Get instant help with your learning questions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar - Conversations */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Conversations</h3>
              <Button
                size="sm"
                onClick={startNewConversation}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-gray-700",
                    activeConversation.id === conv.id 
                      ? "bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-700" 
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-white line-clamp-1">
                      {conv.title}
                    </h4>
                    {conv.pinned && <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />}
                  </div>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                    {conv.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {conv.category}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {conv.messageCount} messages
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{conv.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-9 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{activeConversation.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{activeConversation.messageCount} messages</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Save className="h-4 w-4 mr-2" />
                    Save Conversation
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.type === 'user'
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-900 dark:text-white"
                    )}
                  >
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {message.content}
                      </pre>
                    </div>
                    <div className={cn(
                      "text-xs mt-2 opacity-70",
                      message.type === 'user' ? "text-white" : "text-slate-500"
                    )}>
                      {message.timestamp}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt.title}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className={cn("flex items-center gap-2 text-xs h-8", prompt.color)}
                  >
                    <prompt.icon className="h-3 w-3" />
                    {prompt.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-gray-700">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Ask me anything about your studies..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                    className="resize-none pr-24"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Paperclip className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Image className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Mic className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 