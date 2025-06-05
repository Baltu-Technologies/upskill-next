'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
// Temporarily disabled AWS Amplify auth functions
// import { getCurrentUser, fetchUserAttributes, signOut as amplifySignOut } from 'aws-amplify/auth';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  showAuthModal: () => void;
  hideAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  refreshUser: async () => {},
  showAuthModal: () => {},
  hideAuthModal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>({
    // Mock user data
    username: 'test_user',
    email: 'test@example.com',
    isAuthenticated: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const checkUser = useCallback(async () => {
    // No-op since auth is disabled
    return;
  }, []);

  useEffect(() => {
    // No need to check user since auth is disabled
  }, []);

  const handleSignOut = useCallback(async () => {
    // No-op since auth is disabled
    return;
  }, []);

  const showAuthModal = useCallback(() => {
    // No-op since auth is disabled
    return;
  }, []);

  const hideAuthModal = useCallback(() => {
    // No-op since auth is disabled
    return;
  }, []);

  const handleAuthSuccess = useCallback(() => {
    // No-op since auth is disabled
    return;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signOut: handleSignOut,
      refreshUser: checkUser,
      showAuthModal,
      hideAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 