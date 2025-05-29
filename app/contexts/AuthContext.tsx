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
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false); // Set to false since auth is disabled
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const checkUser = useCallback(async () => {
    try {
      setIsLoading(true);
      // Temporarily disabled - auth functions won't work without Amplify configuration
      // const currentUser = await getCurrentUser();
      // const userAttributes = await fetchUserAttributes();
      // setUser({
      //   ...currentUser,
      //   ...userAttributes
      // });
      setUser(null); // No user when auth is disabled
      setError(null);
    } catch (error) {
      console.error('Auth error:', error);
      setUser(null);
      // Don't show modal automatically - let components decide
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSignOut = useCallback(async () => {
    try {
      // Temporarily disabled
      // await amplifySignOut();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out');
    }
  }, []);

  const showAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const hideAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setIsAuthModalOpen(false);
    checkUser(); // Refresh user data after successful auth
  }, [checkUser]);

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