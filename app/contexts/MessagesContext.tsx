'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessagesContextType {
  showMessagesModal: boolean;
  setShowMessagesModal: (show: boolean) => void;
  openMessagesModal: (options?: {
    selectedText?: string;
    slideTitle?: string;
    slideId?: string;
  }) => void;
  closeMessagesModal: () => void;
  pendingQuestion?: {
    selectedText?: string;
    slideTitle?: string;
    slideId?: string;
  };
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}

interface MessagesProviderProps {
  children: ReactNode;
}

export function MessagesProvider({ children }: MessagesProviderProps) {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<{
    selectedText?: string;
    slideTitle?: string;
    slideId?: string;
  } | undefined>();

  const openMessagesModal = (options?: {
    selectedText?: string;
    slideTitle?: string;
    slideId?: string;
  }) => {
    if (options) {
      setPendingQuestion(options);
    }
    setShowMessagesModal(true);
  };

  const closeMessagesModal = () => {
    setShowMessagesModal(false);
    setPendingQuestion(undefined);
  };

  return (
    <MessagesContext.Provider
      value={{
        showMessagesModal,
        setShowMessagesModal,
        openMessagesModal,
        closeMessagesModal,
        pendingQuestion,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
} 