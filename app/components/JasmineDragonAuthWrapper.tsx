'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface JasmineDragonAuthWrapperProps {
  children: React.ReactNode;
}

export default function JasmineDragonAuthWrapper({ children }: JasmineDragonAuthWrapperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        setLoading(true);
        
        // Check session and admin role via API call
        const response = await fetch('/api/jasminedragon/stats');
        
        if (response.status === 401) {
          // Not authenticated
          router.push('/unauthorized');
          return;
        }
        
        if (response.status === 403) {
          // Authenticated but not admin
          router.push('/unauthorized');
          return;
        }
        
        if (response.ok) {
          // Has admin access
          setIsAuthorized(true);
        } else {
          // Other error
          router.push('/unauthorized');
          return;
        }
        
      } catch (error) {
        console.error('Admin access check failed:', error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    }

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router redirect will handle navigation
  }

  return <>{children}</>;
} 