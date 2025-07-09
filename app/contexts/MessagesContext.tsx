'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: {
    slideId?: string;
    slideTitle?: string;
    selectedText?: string;
    lessonTitle?: string;
    course?: string;
  };
}

interface MessagesContextType {
  messages: Message[];
  showMessagesModal: boolean;
  isLoading: boolean;
  openMessagesModal: (context?: any) => void;
  closeMessagesModal: () => void;
  sendMessage: (content: string, context?: any) => void;
  clearMessages: () => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

interface MessagesProviderProps {
  children: ReactNode;
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContext, setCurrentContext] = useState<any>(null);

  const openMessagesModal = useCallback((context?: any) => {
    setCurrentContext(context);
    setShowMessagesModal(true);
    
    // Add welcome message if it's the first time opening with context
    if (context && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: generateWelcomeMessage(context),
        sender: 'ai',
        timestamp: new Date(),
        context
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const closeMessagesModal = useCallback(() => {
    setShowMessagesModal(false);
    setCurrentContext(null);
  }, []);

  const sendMessage = useCallback(async (content: string, context?: any) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      context: context || currentContext
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content, context || currentContext),
        sender: 'ai',
        timestamp: new Date(),
        context: context || currentContext
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  }, [currentContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <MessagesContext.Provider value={{
      messages,
      showMessagesModal,
      isLoading,
      openMessagesModal,
      closeMessagesModal,
      sendMessage,
      clearMessages
    }}>
      {children}
    </MessagesContext.Provider>
  );
};



const generateWelcomeMessage = (context: any): string => {
  if (context?.selectedText) {
    return `Hi! I see you selected "${context.selectedText}" from ${context.slideTitle || 'the lesson'}. I'm here to help you understand this concept better! What would you like to know about it?`;
  }
  
  if (context?.slideTitle) {
    return `Hi! I'm your AI Study Assistant for "${context.slideTitle}". I can help you understand the concepts, clarify any questions, or provide additional context. What would you like to explore?`;
  }
  
  return `Hi! I'm your AI Study Assistant. I'm here to help you with your learning journey during this microlesson. What would you like to work on?`;
};

const generateAIResponse = (userMessage: string, context: any): string => {
  const responses = {
    greeting: [
      "Hello! I'm excited to help you learn today. What specific topic would you like to explore?",
      "Hi there! I'm here to make your learning experience more engaging. What questions do you have?",
      "Welcome! I'm ready to assist you with any concepts or questions you have about this lesson."
    ],
    explanation: [
      "That's a great question! Let me break this down for you in a way that's easy to understand...",
      "I'm glad you asked about that! This is actually a really important concept in this field...",
      "Excellent question! Let me explain this concept step by step..."
    ],
    encouragement: [
      "You're doing great! Learning these concepts takes time, but you're making excellent progress.",
      "I can see you're really engaged with this material. Keep up the great work!",
      "That's exactly the kind of thinking that will help you master this subject!"
    ],
    default: [
      "I understand you're asking about this topic. Let me provide some helpful information...",
      "That's an interesting point. Here's what I think might help you understand this better...",
      "I can help you with that! Let me share some insights about this concept..."
    ]
  };

  // Simple keyword-based response selection
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  if (message.includes('explain') || message.includes('what is') || message.includes('how does')) {
    return responses.explanation[Math.floor(Math.random() * responses.explanation.length)] + 
           ` Based on what we're covering in ${context?.slideTitle || 'this lesson'}, this concept is fundamental to understanding the broader principles at work here.`;
  }
  
  if (message.includes('difficult') || message.includes('hard') || message.includes('confused')) {
    return responses.encouragement[Math.floor(Math.random() * responses.encouragement.length)] + 
           " Don't worry if this seems challenging - that's completely normal when learning new concepts!";
  }
  
  return responses.default[Math.floor(Math.random() * responses.default.length)] + 
         (context?.selectedText ? ` You selected "${context.selectedText}" which is related to key concepts we're exploring.` : '');
}; 