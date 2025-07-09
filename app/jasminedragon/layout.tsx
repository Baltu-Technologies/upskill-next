'use client';

import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JasmineDragonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Set body background to black when admin panel mounts
    document.body.style.background = '#000000';
    
    // Check admin access
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
    
    // Cleanup function to restore original background
    return () => {
      document.body.style.background = '';
    };
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

  return (
    <div className="admin-panel-layout flex h-screen bg-black min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-black">
        {children}
      </main>
    </div>
  );
} 