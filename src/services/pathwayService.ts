import { CareerPathway, UserProfile, mockCareerPathways, mockUserProfile } from '../data/mockCareerData';

// API Response types
export interface PathwayResponse {
  pathways: CareerPathway[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface UserPathwaysResponse {
  savedPathways: string[];
  profile: UserProfile;
}

// Service configuration
const STORAGE_KEYS = {
  USER_PATHWAYS: 'upskill_user_pathways',
  USER_PROFILE: 'upskill_user_profile',
  PATHWAY_CACHE: 'upskill_pathway_cache',
} as const;

// Simulated API delays for realistic UX
const SIMULATED_DELAY = 800;

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Error types
export class PathwayServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'PathwayServiceError';
  }
}

export class PathwayService {
  // Initialize default data if not present
  static async initialize(): Promise<void> {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      // Initialize user profile if not exists
      const existingProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!existingProfile) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockUserProfile));
      }

      // Initialize pathway cache if not exists
      const existingCache = localStorage.getItem(STORAGE_KEYS.PATHWAY_CACHE);
      if (!existingCache) {
        localStorage.setItem(STORAGE_KEYS.PATHWAY_CACHE, JSON.stringify(mockCareerPathways));
      }

      // Initialize user's saved pathways if not exists
      const existingSaved = localStorage.getItem(STORAGE_KEYS.USER_PATHWAYS);
      if (!existingSaved) {
        localStorage.setItem(STORAGE_KEYS.USER_PATHWAYS, JSON.stringify(mockUserProfile.savedPathways));
      }
    } catch (error) {
      console.error('Failed to initialize PathwayService:', error);
      throw new PathwayServiceError('Initialization failed', 'INIT_ERROR');
    }
  }

  // Fetch user's profile information
  static async getUserProfile(): Promise<UserProfile> {
    if (typeof window === 'undefined') {
      return mockUserProfile;
    }
    
    await delay(SIMULATED_DELAY / 2);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!stored) {
        throw new PathwayServiceError('User profile not found', 'PROFILE_NOT_FOUND', 404);
      }
      
      return JSON.parse(stored);
    } catch (error) {
      if (error instanceof PathwayServiceError) throw error;
      throw new PathwayServiceError('Failed to fetch user profile', 'FETCH_ERROR', 500);
    }
  }

  // Fetch user's saved pathway IDs
  static async getUserSavedPathways(): Promise<string[]> {
    if (typeof window === 'undefined') {
      return mockUserProfile.savedPathways;
    }
    
    await delay(SIMULATED_DELAY / 3);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PATHWAYS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to fetch saved pathways:', error);
      return [];
    }
  }

  // Fetch all available pathways (for discovery/recommendations)
  static async getAllPathways(page: number = 1, limit: number = 10): Promise<PathwayResponse> {
    if (typeof window === 'undefined') {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pathways = mockCareerPathways.slice(startIndex, endIndex);
      return {
        pathways,
        total: mockCareerPathways.length,
        page,
        hasMore: endIndex < mockCareerPathways.length
      };
    }
    
    await delay(SIMULATED_DELAY);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATHWAY_CACHE);
      const allPathways: CareerPathway[] = stored ? JSON.parse(stored) : mockCareerPathways;
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pathways = allPathways.slice(startIndex, endIndex);
      
      return {
        pathways,
        total: allPathways.length,
        page,
        hasMore: endIndex < allPathways.length
      };
    } catch (error) {
      throw new PathwayServiceError('Failed to fetch pathways', 'FETCH_ERROR', 500);
    }
  }

  // Fetch specific pathways by IDs (user's saved pathways)
  static async getPathwaysByIds(pathwayIds: string[]): Promise<CareerPathway[]> {
    if (typeof window === 'undefined') {
      const foundPathways = mockCareerPathways.filter(pathway => pathwayIds.includes(pathway.id));
      return pathwayIds.map(id => foundPathways.find(p => p.id === id)).filter(Boolean) as CareerPathway[];
    }
    
    await delay(SIMULATED_DELAY);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATHWAY_CACHE);
      const allPathways: CareerPathway[] = stored ? JSON.parse(stored) : mockCareerPathways;
      
      const foundPathways = allPathways.filter(pathway => pathwayIds.includes(pathway.id));
      
      // Maintain the order of requested IDs
      return pathwayIds.map(id => foundPathways.find(p => p.id === id)).filter(Boolean) as CareerPathway[];
    } catch (error) {
      throw new PathwayServiceError('Failed to fetch pathways by IDs', 'FETCH_ERROR', 500);
    }
  }

  // Save a pathway to user's collection
  static async savePathway(pathwayId: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    
    await delay(SIMULATED_DELAY / 2);
    
    try {
      const currentSaved = await this.getUserSavedPathways();
      
      if (currentSaved.includes(pathwayId)) {
        throw new PathwayServiceError('Pathway already saved', 'ALREADY_SAVED', 409);
      }
      
      const updatedSaved = [...currentSaved, pathwayId];
      localStorage.setItem(STORAGE_KEYS.USER_PATHWAYS, JSON.stringify(updatedSaved));
      
      // Update user profile
      await this.updateUserProfile({ savedPathways: updatedSaved });
    } catch (error) {
      if (error instanceof PathwayServiceError) throw error;
      throw new PathwayServiceError('Failed to save pathway', 'SAVE_ERROR', 500);
    }
  }

  // Remove a pathway from user's collection
  static async removePathway(pathwayId: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    
    await delay(SIMULATED_DELAY / 2);
    
    try {
      const currentSaved = await this.getUserSavedPathways();
      const updatedSaved = currentSaved.filter(id => id !== pathwayId);
      
      localStorage.setItem(STORAGE_KEYS.USER_PATHWAYS, JSON.stringify(updatedSaved));
      
      // Update user profile
      await this.updateUserProfile({ savedPathways: updatedSaved });
    } catch (error) {
      throw new PathwayServiceError('Failed to remove pathway', 'REMOVE_ERROR', 500);
    }
  }

  // Update pathway status (active/paused/completed)
  static async updatePathwayStatus(pathwayId: string, status: CareerPathway['status']): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    
    await delay(SIMULATED_DELAY / 2);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATHWAY_CACHE);
      const allPathways: CareerPathway[] = stored ? JSON.parse(stored) : mockCareerPathways;
      
      const updatedPathways = allPathways.map(pathway =>
        pathway.id === pathwayId ? { ...pathway, status } : pathway
      );
      
      localStorage.setItem(STORAGE_KEYS.PATHWAY_CACHE, JSON.stringify(updatedPathways));
    } catch (error) {
      throw new PathwayServiceError('Failed to update pathway status', 'UPDATE_ERROR', 500);
    }
  }

  // Update course progress within a pathway
  static async updateCourseProgress(pathwayId: string, courseId: string, progress: number): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    
    await delay(SIMULATED_DELAY / 3);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATHWAY_CACHE);
      const allPathways: CareerPathway[] = stored ? JSON.parse(stored) : mockCareerPathways;
      
      const updatedPathways = allPathways.map(pathway => {
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
      });
      
      localStorage.setItem(STORAGE_KEYS.PATHWAY_CACHE, JSON.stringify(updatedPathways));
    } catch (error) {
      throw new PathwayServiceError('Failed to update course progress', 'UPDATE_ERROR', 500);
    }
  }

  // Update user profile
  static async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (typeof window === 'undefined') {
      return { ...mockUserProfile, ...updates };
    }
    
    await delay(SIMULATED_DELAY / 3);
    
    try {
      const current = await this.getUserProfile();
      const updated = { ...current, ...updates };
      
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
      return updated;
    } catch (error) {
      throw new PathwayServiceError('Failed to update user profile', 'UPDATE_ERROR', 500);
    }
  }

  // Search pathways by criteria
  static async searchPathways(query: string, filters?: {
    difficulty?: CareerPathway['difficulty'];
    techDomains?: string[];
    industries?: string[];
    maxDuration?: number;
  }): Promise<CareerPathway[]> {
    if (typeof window === 'undefined') {
      return mockCareerPathways;
    }
    
    await delay(SIMULATED_DELAY);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATHWAY_CACHE);
      const allPathways: CareerPathway[] = stored ? JSON.parse(stored) : mockCareerPathways;
      
      let filtered = allPathways;
      
      // Text search
      if (query) {
        const searchTerm = query.toLowerCase();
        filtered = filtered.filter(pathway =>
          pathway.title.toLowerCase().includes(searchTerm) ||
          pathway.description.toLowerCase().includes(searchTerm) ||
          pathway.targetRole.toLowerCase().includes(searchTerm) ||
          pathway.requiredTechDomains.some(domain => domain.toLowerCase().includes(searchTerm)) ||
          pathway.relevantIndustries.some(industry => industry.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply filters
      if (filters) {
        if (filters.difficulty) {
          filtered = filtered.filter(p => p.difficulty === filters.difficulty);
        }
        
        if (filters.techDomains && filters.techDomains.length > 0) {
          filtered = filtered.filter(p =>
            filters.techDomains!.some(domain => p.requiredTechDomains.includes(domain))
          );
        }
        
        if (filters.industries && filters.industries.length > 0) {
          filtered = filtered.filter(p =>
            filters.industries!.some(industry => p.relevantIndustries.includes(industry))
          );
        }
      }
      
      return filtered;
    } catch (error) {
      throw new PathwayServiceError('Failed to search pathways', 'SEARCH_ERROR', 500);
    }
  }

  // Get pathway recommendations based on user interests
  static async getRecommendedPathways(userProfile: UserProfile): Promise<CareerPathway[]> {
    if (typeof window === 'undefined') {
      return mockCareerPathways.slice(0, 5);
    }
    
    await delay(SIMULATED_DELAY * 1.5);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATHWAY_CACHE);
      const allPathways: CareerPathway[] = stored ? JSON.parse(stored) : mockCareerPathways;
      
      // Score pathways based on user interests
      const scoredPathways = allPathways.map(pathway => {
        let score = 0;
        let factors = 0;
        
        // Score based on tech domain interests
        pathway.requiredTechDomains.forEach(domain => {
          if (userProfile.capturedInterests.techDomains[domain]) {
            score += userProfile.capturedInterests.techDomains[domain] * 0.4;
            factors++;
          }
        });
        
        // Score based on industry interests
        pathway.relevantIndustries.forEach(industry => {
          if (userProfile.capturedInterests.industryDomains[industry]) {
            score += userProfile.capturedInterests.industryDomains[industry] * 0.3;
            factors++;
          }
        });
        
        // Avoid already saved pathways
        if (userProfile.savedPathways.includes(pathway.id)) {
          score = 0;
        }
        
        return {
          ...pathway,
          recommendationScore: factors > 0 ? score / factors : 0
        };
      });
      
      // Return top recommendations
      return scoredPathways
        .filter(p => p.recommendationScore > 2) // Only good matches
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 5);
    } catch (error) {
      throw new PathwayServiceError('Failed to get recommendations', 'RECOMMENDATION_ERROR', 500);
    }
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Initialize service when module loads
PathwayService.initialize().catch(console.error);

export default PathwayService; 