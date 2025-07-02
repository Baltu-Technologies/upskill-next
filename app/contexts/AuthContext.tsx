'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import { authClient } from '@/auth-client'; // Temporarily commented out

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
  // TEMPORARILY DISABLED AUTHENTICATION
  // Mock user data for development
  const mockUser = {
    id: 'mock-user-id',
    email: 'dev@example.com',
    name: 'Development User',
    role: 'user',
    firstName: 'Dev',
    lastName: 'User'
  };

  const [user, setUser] = useState<any>(mockUser); // Set mock user by default
  const [isLoading, setIsLoading] = useState(false); // Set to false since we have a mock user
  const [error, setError] = useState<string | null>(null);

  const checkUser = useCallback(async () => {
    // TEMPORARILY DISABLED - Return mock user immediately
    console.log('🔓 Authentication temporarily disabled - using mock user');
    setUser(mockUser);
    setIsLoading(false);
    setError(null);
    
    /* Original auth code commented out:
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
    */
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSignOut = useCallback(async () => {
    // TEMPORARILY DISABLED - Just log the action
    console.log('🔓 Sign out requested but authentication is disabled');
    // setUser(null); // Commented out to keep mock user
  }, []);

  const showAuthModal = useCallback(() => {
    console.log("🔓 Auth modal requested but authentication is disabled");
  }, []);

  const hideAuthModal = useCallback(() => {
    console.log("🔓 Hide auth modal requested but authentication is disabled");
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error,
      isAuthenticated: true, // Always return true since we have a mock user
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