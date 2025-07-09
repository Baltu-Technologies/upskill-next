import { useState, useEffect } from 'react';

export interface UserNavigation {
  canAccessHome: boolean;
  canAccessCourses: boolean;
  canAccessCareerOpportunities: boolean;
  canAccessCourseTest: boolean;
  canAccessGuideAccess: boolean;
  canAccessCourseCreator: boolean;
  canAccessProfile: boolean;
}

export function useUserPermissions() {
  const [permissions, setPermissions] = useState<UserNavigation>({
    canAccessHome: false,
    canAccessCourses: false,
    canAccessCareerOpportunities: false,
    canAccessCourseTest: false,
    canAccessGuideAccess: false,
    canAccessCourseCreator: false,
    canAccessProfile: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        setLoading(true);
        const response = await fetch('/api/user-permissions');
        
        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated, use default permissions
            setPermissions({
              canAccessHome: true,
              canAccessCourses: true,
              canAccessCareerOpportunities: true,
              canAccessCourseTest: false,
              canAccessGuideAccess: false,
              canAccessCourseCreator: false,
              canAccessProfile: true,
            });
            return;
          }
          throw new Error('Failed to fetch permissions');
        }
        
        const data = await response.json();
        setPermissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to basic permissions on error
        setPermissions({
          canAccessHome: true,
          canAccessCourses: true,
          canAccessCareerOpportunities: true,
          canAccessCourseTest: false,
          canAccessGuideAccess: false,
          canAccessCourseCreator: false,
          canAccessProfile: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  return { permissions, loading, error };
} 