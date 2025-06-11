'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authClient } from '@/auth-client';

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
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current session from Better Auth
      const session = await authClient.getSession();
      
      if (session.data) {
        setUser(session.data.user);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error checking user session:', error);
      setError(error.message || 'Failed to check authentication status');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSignOut = useCallback(async () => {
    try {
      setError(null);
      await authClient.signOut();
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message || 'Failed to sign out');
    }
  }, []);

  const showAuthModal = useCallback(() => {
    console.log("showAuthModal called - Better Auth modal integration needed");
  }, []);

  const hideAuthModal = useCallback(() => {
    console.log("hideAuthModal called - Better Auth modal integration needed");
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