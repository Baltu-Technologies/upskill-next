import { useState, useEffect, useCallback, useRef } from 'react';
import { CareerPathway, UserProfile } from '../data/mockCareerData';
import PathwayService, { PathwayServiceError } from '../services/pathwayService';

// Hook state types
export interface UsePathwaysState {
  pathways: CareerPathway[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export interface UseUserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
}

export interface UsePathwayActionsState {
  saving: boolean;
  removing: boolean;
  updatingStatus: boolean;
  updatingProgress: boolean;
  error: string | null;
}

// Custom hook for user's saved pathways
export function useUserPathways() {
  const [state, setState] = useState<UsePathwaysState>({
    pathways: [],
    loading: true,
    error: null,
    refreshing: false,
  });

  const [actions, setActions] = useState<UsePathwayActionsState>({
    saving: false,
    removing: false,
    updatingStatus: false,
    updatingProgress: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch user's saved pathways
  const fetchUserPathways = useCallback(async (isRefresh = false) => {
    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null,
      }));

      // Get saved pathway IDs
      const savedPathwayIds = await PathwayService.getUserSavedPathways();
      
      // Fetch full pathway data
      const pathways = savedPathwayIds.length > 0 
        ? await PathwayService.getPathwaysByIds(savedPathwayIds)
        : [];

      setState(prev => ({
        ...prev,
        pathways,
        loading: false,
        refreshing: false,
        error: null,
      }));
    } catch (error) {
      if (error instanceof PathwayServiceError) {
        setState(prev => ({
          ...prev,
          loading: false,
          refreshing: false,
          error: error.message,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          refreshing: false,
          error: 'An unexpected error occurred',
        }));
      }
    }
  }, []);

  // Save a pathway to user's collection
  const savePathway = useCallback(async (pathwayId: string) => {
    try {
      setActions(prev => ({ ...prev, saving: true, error: null }));
      
      await PathwayService.savePathway(pathwayId);
      
      // Refresh pathways to show the new one
      await fetchUserPathways(true);
      
      setActions(prev => ({ ...prev, saving: false }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to save pathway';
      
      setActions(prev => ({ ...prev, saving: false, error: errorMessage }));
      return false;
    }
  }, [fetchUserPathways]);

  // Remove a pathway from user's collection
  const removePathway = useCallback(async (pathwayId: string) => {
    try {
      setActions(prev => ({ ...prev, removing: true, error: null }));
      
      // Optimistic update - remove from UI immediately
      setState(prev => ({
        ...prev,
        pathways: prev.pathways.filter(p => p.id !== pathwayId),
      }));
      
      await PathwayService.removePathway(pathwayId);
      setActions(prev => ({ ...prev, removing: false }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to remove pathway';
      
      setActions(prev => ({ ...prev, removing: false, error: errorMessage }));
      
      // Revert optimistic update on error
      await fetchUserPathways(true);
      return false;
    }
  }, [fetchUserPathways]);

  // Update pathway status
  const updatePathwayStatus = useCallback(async (pathwayId: string, status: CareerPathway['status']) => {
    try {
      setActions(prev => ({ ...prev, updatingStatus: true, error: null }));
      
      // Optimistic update
      setState(prev => ({
        ...prev,
        pathways: prev.pathways.map(p =>
          p.id === pathwayId ? { ...p, status } : p
        ),
      }));
      
      await PathwayService.updatePathwayStatus(pathwayId, status);
      setActions(prev => ({ ...prev, updatingStatus: false }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to update pathway status';
      
      setActions(prev => ({ ...prev, updatingStatus: false, error: errorMessage }));
      
      // Revert optimistic update on error
      await fetchUserPathways(true);
      return false;
    }
  }, [fetchUserPathways]);

  // Update course progress
  const updateCourseProgress = useCallback(async (
    pathwayId: string, 
    courseId: string, 
    progress: number
  ) => {
    try {
      setActions(prev => ({ ...prev, updatingProgress: true, error: null }));
      
      // Optimistic update
      setState(prev => ({
        ...prev,
        pathways: prev.pathways.map(pathway => {
          if (pathway.id === pathwayId) {
            const updatedCourses = pathway.courses.map(course => {
              if (course.id === courseId) {
                const isCompleted = progress >= 100;
                return { ...course, progress, completed: isCompleted };
              }
              return course;
            });
            
            // Recalculate pathway progress
            const completedCourses = updatedCourses.filter(c => c.completed).length;
            const overallProgress = Math.round(
              updatedCourses.reduce((sum, course) => sum + course.progress, 0) / updatedCourses.length
            );
            
            return {
              ...pathway,
              courses: updatedCourses,
              completedCourses,
              overallProgress
            };
          }
          return pathway;
        }),
      }));
      
      await PathwayService.updateCourseProgress(pathwayId, courseId, progress);
      setActions(prev => ({ ...prev, updatingProgress: false }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to update course progress';
      
      setActions(prev => ({ ...prev, updatingProgress: false, error: errorMessage }));
      
      // Revert optimistic update on error
      await fetchUserPathways(true);
      return false;
    }
  }, [fetchUserPathways]);

  // Refresh pathways
  const refresh = useCallback(() => {
    return fetchUserPathways(true);
  }, [fetchUserPathways]);

  // Clear action errors
  const clearActionError = useCallback(() => {
    setActions(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUserPathways();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchUserPathways]);

  return {
    ...state,
    actions,
    savePathway,
    removePathway,
    updatePathwayStatus,
    updateCourseProgress,
    refresh,
    clearActionError,
  };
}

// Custom hook for user profile
export function useUserProfile() {
  const [state, setState] = useState<UseUserProfileState>({
    profile: null,
    loading: true,
    error: null,
    updating: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const profile = await PathwayService.getUserProfile();
      
      setState(prev => ({
        ...prev,
        profile,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to fetch user profile';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      setState(prev => ({ ...prev, updating: true, error: null }));
      
      const updatedProfile = await PathwayService.updateUserProfile(updates);
      
      setState(prev => ({
        ...prev,
        profile: updatedProfile,
        updating: false,
        error: null,
      }));
      
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to update profile';
      
      setState(prev => ({
        ...prev,
        updating: false,
        error: errorMessage,
      }));
      
      return null;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProfile]);

  return {
    ...state,
    updateProfile,
    refresh: fetchProfile,
  };
}

// Custom hook for pathway discovery/search
export function usePathwayDiscovery() {
  const [state, setState] = useState({
    pathways: [] as CareerPathway[],
    loading: false,
    error: null as string | null,
    hasMore: false,
    page: 1,
  });

  const [recommendations, setRecommendations] = useState({
    pathways: [] as CareerPathway[],
    loading: false,
    error: null as string | null,
  });

  // Search pathways
  const searchPathways = useCallback(async (
    query: string,
    filters?: {
      difficulty?: CareerPathway['difficulty'];
      techDomains?: string[];
      industries?: string[];
    }
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const pathways = await PathwayService.searchPathways(query, filters);
      
      setState(prev => ({
        ...prev,
        pathways,
        loading: false,
        error: null,
        page: 1,
        hasMore: false, // Search doesn't paginate
      }));
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to search pathways';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Get recommendations based on user profile
  const getRecommendations = useCallback(async (userProfile: UserProfile) => {
    try {
      setRecommendations(prev => ({ ...prev, loading: true, error: null }));
      
      const pathways = await PathwayService.getRecommendedPathways(userProfile);
      
      setRecommendations(prev => ({
        ...prev,
        pathways,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to get recommendations';
      
      setRecommendations(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Load more pathways (for discovery/browse)
  const loadMore = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await PathwayService.getAllPathways(state.page + 1);
      
      setState(prev => ({
        ...prev,
        pathways: [...prev.pathways, ...response.pathways],
        loading: false,
        error: null,
        page: response.page,
        hasMore: response.hasMore,
      }));
    } catch (error) {
      const errorMessage = error instanceof PathwayServiceError 
        ? error.message 
        : 'Failed to load more pathways';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [state.page]);

  return {
    search: state,
    recommendations,
    searchPathways,
    getRecommendations,
    loadMore,
  };
}

export default {
  useUserPathways,
  useUserProfile,
  usePathwayDiscovery,
}; 