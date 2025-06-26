'use client';

import { useMemo } from 'react';
import { useAuth as useAuthContext } from '@/app/contexts/AuthContext';
import { authClient } from '@/auth-client';

// Re-export the main useAuth hook from AuthContext
export { useAuth } from '@/app/contexts/AuthContext';

// Additional hook for role management
export function useRole() {
  const { user } = useAuthContext();
  
  const hasRole = (role: string) => {
    if (!user) return false;
    // Check if user has the specified role
    // Adjust this logic based on your user object structure
    return user.role === role || user.roles?.includes(role);
  };
  
  const isAdmin = useMemo(() => hasRole('admin'), [user]);
  const isUser = useMemo(() => hasRole('user'), [user]);
  const userRole = useMemo(() => user?.role || 'guest', [user]);
  
  return {
    hasRole,
    isAdmin,
    isUser,
    userRole
  };
}

// Additional hook for session management
export function useSession() {
  const { user, refreshUser } = useAuthContext();
  
  const session = useMemo(() => {
    if (!user) return null;
    return {
      user,
      session: {
        expiresAt: user.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24h
      }
    };
  }, [user]);
  
  const refreshSession = async () => {
    try {
      const sessionData = await authClient.getSession();
      await refreshUser();
      return sessionData;
    } catch (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
  };
  
  return {
    session,
    refreshSession
  };
}

// Additional authentication utilities
export function useAuthenticated() {
  const { user, isLoading } = useAuthContext();
  return {
    isAuthenticated: !isLoading && !!user,
    isLoading
  };
} 