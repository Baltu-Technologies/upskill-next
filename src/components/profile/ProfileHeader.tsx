'use client';

import React from 'react';
import { UserProfile } from '@/data/mockProfileData';

interface ProfileHeaderProps {
  profile: UserProfile;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  onSave: () => void;
}

export default function ProfileHeader({ profile, hasUnsavedChanges, isLoading, onSave }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl font-bold">{profile.displayName}</h1>
              <p className="text-blue-100 text-sm sm:text-base">{profile.email}</p>
              {profile.location && (
                <p className="text-blue-200 text-sm">
                  📍 {profile.location.city}, {profile.location.state}
                </p>
              )}
            </div>
          </div>

          {/* Profile Completeness & Save Status */}
          <div className="mt-4 sm:mt-0 text-center sm:text-right">
            <div className="text-white mb-2">
              <span className="text-lg font-semibold">{profile.profileCompleteness}%</span>
              <span className="text-blue-100 text-sm ml-1">Complete</span>
            </div>
            
            {/* Completeness Bar */}
            <div className="w-32 h-2 bg-blue-400 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${profile.profileCompleteness}%` }}
              />
            </div>

            {/* Save Status */}
            {hasUnsavedChanges && (
              <div className="mt-3">
                <span className="text-yellow-200 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Unsaved changes
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 