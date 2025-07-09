'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface Auth0User {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  'https://employer-portal.upskill.com/roles'?: string[];
  'https://employer-portal.upskill.com/permissions'?: string[];
  'https://employer-portal.upskill.com/organization'?: string;
  'https://employer-portal.upskill.com/organization_name'?: string;
}

interface Auth0ContextType {
  user: Auth0User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const Auth0Context = createContext<Auth0ContextType>({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  signOut: () => {},
  refreshUser: async () => {},
});

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Auth0User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is authenticated by calling a protected endpoint
      const response = await fetch('/api/auth0/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
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

  const handleSignOut = useCallback(() => {
    setUser(null);
    window.location.href = '/api/auth0/logout';
  }, []);

  return (
    <Auth0Context.Provider value={{ 
      user, 
      isLoading, 
      error,
      isAuthenticated: !isLoading && !!user,
      signOut: handleSignOut,
      refreshUser: checkUser,
    }}>
      {children}
    </Auth0Context.Provider>
  );
}

export function useAuth0() {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0 must be used within an Auth0Provider');
  }
  return context;
}

// Hook for checking specific roles
export function useAuth0Roles() {
  const { user, isLoading } = useAuth0();
  
  const hasRole = useCallback((role: string) => {
    if (!user || isLoading) return false;
    const roles = user['https://employer-portal.upskill.com/roles'] || [];
    return roles.includes(role);
  }, [user, isLoading]);

  const hasPermission = useCallback((permission: string) => {
    if (!user || isLoading) return false;
    const permissions = user['https://employer-portal.upskill.com/permissions'] || [];
    return permissions.includes(permission);
  }, [user, isLoading]);

  const isAdmin = hasRole('Employer Admin');
  const isRecruiter = hasRole('Employer Recruiter');
  const isViewer = hasRole('Employer Viewer');

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isRecruiter,
    isViewer,
    roles: user?.['https://employer-portal.upskill.com/roles'] || [],
    permissions: user?.['https://employer-portal.upskill.com/permissions'] || [],
  };
} 