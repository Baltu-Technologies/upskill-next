"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";
import AuthFormShadcn from "./components/AuthFormShadcn";

export default function App() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshUser } = useAuth();

  const handleAuthSuccess = async () => {
    // Refresh user state after successful authentication
    await refreshUser();
  };

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

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

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}
