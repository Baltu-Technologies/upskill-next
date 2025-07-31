'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authClient } from '@/auth-client';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  showAuthModal: () => void;
  hideAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
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
      
      // Skip auth check in development mode if database is not available
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        console.log('Dev mode: Skipping auth check');
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      // Get current session from Better Auth with timeout
      const session = await Promise.race([
        authClient.getSession(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth check timeout')), 5000)
        )
      ]) as any; // Type assertion for auth session
      
      if (session?.data) {
        setUser(session.data.user);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.warn('Auth check failed (continuing in dev mode):', error.message);
      // In development, don't treat auth failures as critical errors
      if (process.env.NODE_ENV === 'development') {
        setError(null);
        setUser(null);
      } else {
        setError(error.message || 'Failed to check authentication status');
        setUser(null);
      }
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
      isAuthenticated: !isLoading && !!user,
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