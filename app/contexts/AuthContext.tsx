'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut as amplifySignOut } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '../config/amplify';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      setUser({
        ...currentUser,
        ...userAttributes
      });
      setError(null);
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed');
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
      await amplifySignOut();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signOut: handleSignOut }}>
      <Authenticator>
        {() => <>{children}</>}
      </Authenticator>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 