'use client';

import React, { useState } from 'react';
import { mockUserProfile, mockUserSkills, UserProfile as UserProfileType, UserSkill } from '../../data/mockProfileData';
import ProfileHeader from './ProfileHeader';
import ProfileNavigation from './ProfileNavigation';
import PersonalInfoSection from './PersonalInfoSection';
import SkillsInventorySection from './SkillsInventorySection';
import CareerPreferencesSection from './CareerPreferencesSection';
import LearningHistorySection from './LearningHistorySection';
import PrivacySettingsSection from './PrivacySettingsSection';
import ProfileCustomizationSection from './ProfileCustomizationSection';

export type ProfileTab = 'personal' | 'skills' | 'career' | 'learning' | 'privacy' | 'customization';

interface UserProfileProps {
  initialTab?: ProfileTab;
}

export default function UserProfile({ initialTab = 'personal' }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [userProfile, setUserProfile] = useState<UserProfileType>(mockUserProfile);
  const [userSkills, setUserSkills] = useState<UserSkill[]>(mockUserSkills);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleProfileUpdate = (updates: Partial<UserProfileType>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSkillsUpdate = (skills: UserSkill[]) => {
    setUserSkills(skills);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoSection 
            profile={userProfile} 
            onUpdate={handleProfileUpdate}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'skills':
        return (
          <SkillsInventorySection 
            skills={userSkills} 
            onUpdate={handleSkillsUpdate}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'career':
        return (
          <CareerPreferencesSection 
            profile={userProfile}
            skills={userSkills}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'learning':
        return (
          <LearningHistorySection 
            profile={userProfile}
            skills={userSkills}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'privacy':
        return (
          <PrivacySettingsSection 
            profile={userProfile}
            skills={userSkills}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'customization':
        return (
          <ProfileCustomizationSection 
            profile={userProfile}
            skills={userSkills}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      default:
        return <PersonalInfoSection profile={userProfile} onUpdate={handleProfileUpdate} hasUnsavedChanges={hasUnsavedChanges} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader 
          profile={userProfile} 
          hasUnsavedChanges={hasUnsavedChanges}
          isLoading={isLoading}
          onSave={handleSaveChanges}
        />

        {/* Main Profile Content */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Navigation Tabs */}
          <ProfileNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            hasUnsavedChanges={hasUnsavedChanges}
          />

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {renderActiveTab()}
          </div>
        </div>

        {/* Floating Save Button */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 