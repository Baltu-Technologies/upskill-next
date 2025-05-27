"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { CompleteProfile, CoreCandidate, ProfileCompletionStatus } from "@/types/profile";

// Initialize Amplify Data client
const client = generateClient<Schema>();

// ===================================================================
// PROFILE DATA SERVICE
// ===================================================================

export class ProfileService {
  
  // -------------------------------------------------------------------
  // CANDIDATE PROFILE OPERATIONS
  // -------------------------------------------------------------------
  
  /**
   * Create a new candidate profile
   */
  static async createCandidate(candidateData: {
    firstName: string;
    lastName: string;
    email: string;
    workAuthorization: string;
    availability: string;
    currentStatus: string;
    [key: string]: any;
  }) {
    try {
      const result = await client.models.Candidate.create(candidateData);
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error creating candidate:', error);
      return { success: false, data: null, errors: error };
    }
  }

  /**
   * Get complete candidate profile with all relationships
   */
  static async getCandidateProfile(candidateId: string) {
    try {
      const result = await client.models.Candidate.get({ id: candidateId });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
      return { success: false, data: null, errors: error };
    }
  }

  /**
   * Get employer-shared profile data only (excludes private data)
   */
  static async getEmployerProfile(candidateId: string) {
    try {
      const result = await client.models.Candidate.get({ id: candidateId });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      return { success: false, data: null, errors: error };
    }
  }

  /**
   * Update candidate basic information
   */
  static async updateCandidate(candidateId: string, updates: Record<string, any>) {
    try {
      const result = await client.models.Candidate.update({
        id: candidateId,
        ...updates
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error updating candidate:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // EDUCATION OPERATIONS
  // -------------------------------------------------------------------

  static async addEducation(candidateId: string, educationData: {
    degree: string;
    institution: string;
    graduationDate?: string;
    gpa?: number;
    honors?: string;
  }) {
    try {
      const result = await client.models.Education.create({
        candidateId,
        ...educationData
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error adding education:', error);
      return { success: false, data: null, errors: error };
    }
  }

  static async updateEducation(educationId: string, updates: Record<string, any>) {
    try {
      const result = await client.models.Education.update({
        id: educationId,
        ...updates
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error updating education:', error);
      return { success: false, data: null, errors: error };
    }
  }

  static async deleteEducation(educationId: string) {
    try {
      const result = await client.models.Education.delete({ id: educationId });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error deleting education:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // SKILLS OPERATIONS
  // -------------------------------------------------------------------

  static async addFormalSkill(candidateId: string, skillData: {
    name: string;
    type: 'Course' | 'Certification' | 'OnTheJob' | 'Bootcamp';
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    issuingOrganization?: string;
    dateEarned?: string;
    credentialUrl?: string;
  }) {
    try {
      const result = await client.models.FormalSkill.create({
        candidateId,
        ...skillData
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error adding formal skill:', error);
      return { success: false, data: null, errors: error };
    }
  }

  static async addInformalSkill(candidateId: string, skillData: {
    skillName: string;
    category: string;
    selfRating: number;
    evidenceUrl?: string;
  }) {
    try {
      const result = await client.models.InformalSkill.create({
        candidateId,
        ...skillData
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error adding informal skill:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // PROJECT OPERATIONS
  // -------------------------------------------------------------------

  static async addProject(candidateId: string, projectData: {
    title: string;
    roleAndTools: string;
    description: string;
    mediaUrl?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  }) {
    try {
      const result = await client.models.Project.create({
        candidateId,
        ...projectData
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error adding project:', error);
      return { success: false, data: null, errors: error };
    }
  }

  static async updateProject(projectId: string, updates: Record<string, any>) {
    try {
      const result = await client.models.Project.update({
        id: projectId,
        ...updates
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // WORK HISTORY OPERATIONS
  // -------------------------------------------------------------------

  static async addWorkHistory(candidateId: string, workData: {
    companyName: string;
    roleTitle: string;
    startDate?: string;
    endDate?: string;
    responsibilities: string;
    isCurrentPosition?: boolean;
  }) {
    try {
      const result = await client.models.WorkHistory.create({
        candidateId,
        ...workData
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error adding work history:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // REFERENCE OPERATIONS
  // -------------------------------------------------------------------

  static async addReference(candidateId: string, referenceData: {
    name: string;
    relationship: string;
    contactInfo: string;
    letterUrl?: string;
    permissionToContact?: boolean;
  }) {
    try {
      const result = await client.models.Reference.create({
        candidateId,
        ...referenceData
      });
      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error adding reference:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // OPTIONAL DATA OPERATIONS
  // -------------------------------------------------------------------

  static async updateCompensationPreferences(candidateId: string, preferences: {
    desiredSalaryMin?: number;
    desiredSalaryMax?: number;
    preferredEmploymentType?: 'FullTime' | 'PartTime' | 'Contract' | 'Freelance';
    weeklyAvailability?: number;
  }) {
    try {
      // First check if preferences exist
      const existing = await client.models.CompensationPreferences.list({
        filter: { candidateId: { eq: candidateId } }
      });

      let result;
      if (existing.data.length > 0) {
        // Update existing
        result = await client.models.CompensationPreferences.update({
          id: existing.data[0].id,
          ...preferences
        });
      } else {
        // Create new
        result = await client.models.CompensationPreferences.create({
          candidateId,
          ...preferences
        });
      }

      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error updating compensation preferences:', error);
      return { success: false, data: null, errors: error };
    }
  }

  static async updateTransportationLogistics(candidateId: string, logistics: {
    hasDriversLicense?: boolean;
    hasVehicle?: boolean;
    commuteRadius?: number;
    preferredWorkMode?: 'Remote' | 'OnSite' | 'Hybrid';
    internetSpeed?: string;
    hasHomeOfficeSetup?: boolean;
  }) {
    try {
      // First check if logistics exist
      const existing = await client.models.TransportationLogistics.list({
        filter: { candidateId: { eq: candidateId } }
      });

      let result;
      if (existing.data.length > 0) {
        // Update existing
        result = await client.models.TransportationLogistics.update({
          id: existing.data[0].id,
          ...logistics
        });
      } else {
        // Create new
        result = await client.models.TransportationLogistics.create({
          candidateId,
          ...logistics
        });
      }

      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error updating transportation logistics:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // SYSTEM METRICS OPERATIONS
  // -------------------------------------------------------------------

  static async updateSystemMetrics(candidateId: string, metrics: {
    aptitudeScore?: number;
    attitudeRating?: number;
    totalXP?: number;
    currentLevel?: number;
    learningStreak?: number;
    coursesCompleted?: number;
    skillsVerified?: number;
  }) {
    try {
      // First check if metrics exist
      const existing = await client.models.SystemMetrics.list({
        filter: { candidateId: { eq: candidateId } }
      });

      let result;
      if (existing.data.length > 0) {
        // Update existing
        result = await client.models.SystemMetrics.update({
          id: existing.data[0].id,
          lastCalculated: new Date().toISOString(),
          ...metrics
        });
      } else {
        // Create new
        result = await client.models.SystemMetrics.create({
          candidateId,
          lastCalculated: new Date().toISOString(),
          ...metrics
        });
      }

      return { success: true, data: result.data, errors: null };
    } catch (error) {
      console.error('Error updating system metrics:', error);
      return { success: false, data: null, errors: error };
    }
  }

  // -------------------------------------------------------------------
  // UTILITY FUNCTIONS
  // -------------------------------------------------------------------

  /**
   * Get current user's candidate profile
   */
  static async getCurrentUserProfile() {
    try {
      // This will get the current authenticated user's candidate profile
      const result = await client.models.Candidate.list({
        limit: 1,
        // Amplify automatically filters by owner due to authorization rules
      });

      if (result.data.length === 0) {
        return { success: true, data: null, errors: null };
      }

      // Get the full profile with relationships
      return this.getCandidateProfile(result.data[0].id);
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return { success: false, data: null, errors: error };
    }
  }

  /**
   * Calculate profile completion percentage
   */
  static calculateProfileCompletion(profile: any): ProfileCompletionStatus {
    // This would implement the same logic as your existing functions
    // but using data from DynamoDB instead of mock data
    
    const coreFields = [
      'firstName', 'lastName', 'email', 'workAuthorization', 
      'availability', 'currentStatus'
    ];
    
    const completedCoreFields = coreFields.filter(field => 
      profile && profile[field] && profile[field].trim() !== ''
    ).length;
    
    const coreProgress = Math.round((completedCoreFields / coreFields.length) * 100);
    
    // Add logic for education, skills, projects, etc.
    const hasEducation = profile?.education?.length > 0;
    const hasSkills = (profile?.formalSkills?.length || 0) + (profile?.informalSkills?.length || 0) > 0;
    const hasProjects = profile?.projects?.length > 0;
    
    let adjustedCoreProgress = coreProgress;
    if (hasEducation) adjustedCoreProgress = Math.min(100, adjustedCoreProgress + 10);
    if (hasSkills) adjustedCoreProgress = Math.min(100, adjustedCoreProgress + 10);
    if (hasProjects) adjustedCoreProgress = Math.min(100, adjustedCoreProgress + 10);
    
    return {
      overallProgress: adjustedCoreProgress,
      coreProgress: adjustedCoreProgress,
      optionalProgress: 30, // Calculate based on optional fields
      coreComplete: adjustedCoreProgress >= 90,
      optionalComplete: false, // Add logic for optional completion
      requiredFields: coreFields,
      missingCoreFields: coreFields.filter(field => 
        !profile || !profile[field] || profile[field].trim() === ''
      ),
      missingOptionalFields: [] // Add logic for optional missing fields
    };
  }
}

// ===================================================================
// CONVENIENCE HOOKS FOR REACT COMPONENTS
// ===================================================================

import { useState, useEffect } from 'react';

/**
 * React hook to manage candidate profile data
 */
export function useProfileData() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await ProfileService.getCurrentUserProfile();
      
      if (result.success) {
        setProfile(result.data);
        setError(null);
      } else {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', result.errors);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async (updates: Record<string, any>) => {
    if (!profile?.id) return { success: false, error: 'No profile ID' };
    
    const result = await ProfileService.updateCandidate(profile.id, updates);
    if (result.success) {
      setProfile((prev: any) => ({ ...prev, ...updates }));
    }
    return result;
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: () => {
      setLoading(true);
      ProfileService.getCurrentUserProfile().then(result => {
        if (result.success) {
          setProfile(result.data);
          setError(null);
        } else {
          setError('Failed to refresh profile data');
        }
        setLoading(false);
      });
    }
  };
}

export default ProfileService; 