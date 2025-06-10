'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

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
  isLoading: true, // Will be set to false once initial auth check (from Better Auth) is done
  error: null,
  signOut: async () => {},
  refreshUser: async () => {},
  showAuthModal: () => {},
  hideAuthModal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null); // Initialize user to null
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  // The AuthModal display logic will be handled by Better Auth components or a new system
  // const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const checkUser = useCallback(async () => {
    // TODO: Implement user check with Better Auth
    // For now, simulating no user and finishing loading
    setUser(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSignOut = useCallback(async () => {
    // TODO: Implement sign out with Better Auth
    setUser(null);
  }, []);

  const showAuthModal = useCallback(() => {
    // This will likely be replaced by Better Auth's modal or a new UI trigger
    // For now, it does nothing or could log a message
    console.log("showAuthModal called, to be implemented with Better Auth");
  }, []);

  const hideAuthModal = useCallback(() => {
    // This will likely be replaced by Better Auth's modal or a new UI trigger
    console.log("hideAuthModal called, to be implemented with Better Auth");
  }, []);

  // This function was likely tied to the old AuthModal/AuthForm
  // const handleAuthSuccess = useCallback(() => {
  //   checkUser(); // Refresh user after old auth success
  // }, [checkUser]);

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