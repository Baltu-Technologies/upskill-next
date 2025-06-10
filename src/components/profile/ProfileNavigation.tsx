'use client';

import React from 'react';
import { ProfileTab } from './UserProfile';

interface ProfileNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  hasUnsavedChanges: boolean;
}

const tabs = [
  { id: 'personal' as ProfileTab, name: 'Personal Info', icon: '👤' },
  { id: 'skills' as ProfileTab, name: 'My Skills', icon: '🎯' },
  { id: 'career' as ProfileTab, name: 'Career Goals', icon: '🚀' },
  { id: 'learning' as ProfileTab, name: 'Learning History', icon: '📚' },
  { id: 'privacy' as ProfileTab, name: 'Privacy', icon: '🔒' },
];

export default function ProfileNavigation({ activeTab, onTabChange, hasUnsavedChanges }: ProfileNavigationProps) {
  const handleTabClick = (tab: ProfileTab) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmed) return;
    }
    onTabChange(tab);
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap
              transition-colors duration-200 border-b-2
              ${activeTab === tab.id
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.name}</span>
            {activeTab === tab.id && hasUnsavedChanges && (
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
} 