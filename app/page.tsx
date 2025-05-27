"use client";


import { useAuth } from "./contexts/AuthContext";
import AuthFormShadcn from "./components/AuthFormShadcn";
import Dashboard from "./components/Dashboard";

export default function App() {
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

  // Authenticated user dashboard
  return <Dashboard />;
}
