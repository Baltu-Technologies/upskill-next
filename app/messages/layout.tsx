'use client';

import { useAuth } from '../contexts/AuthContext';
import PersistentLayout from '../components/PersistentLayout';
import AuthFormShadcn from '../components/AuthFormShadcn';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading, refreshUser } = useAuth();

  const handleAuthSuccess = async () => {
    // Refresh user state after successful authentication
    await refreshUser();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Login form for unauthenticated users
  if (!user) {
    return <AuthFormShadcn onSuccess={handleAuthSuccess} />;
  }

  // Authenticated user content with persistent layout
  return (
    <PersistentLayout>
      {children}
    </PersistentLayout>
  );
} 