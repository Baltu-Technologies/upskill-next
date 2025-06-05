"use client";

import React from 'react';
import { User, GraduationCap, RotateCcw, TrendingUp } from 'lucide-react';
import { StarterPersona, UserInterest } from '../../data/mockCareerData';
import { cn } from '@/lib/utils';

interface PersonaSelectorProps {
  personas: StarterPersona[];
  selectedPersona?: string;
  onPersonaSelect: (persona: StarterPersona | null) => void;
  className?: string;
}

const PERSONA_ICONS = {
  'recent-grad': GraduationCap,
  'career-switcher': RotateCcw,
  'skill-upgrader': TrendingUp,
  'default': User
};

const PERSONA_COLORS = {
  'recent-grad': 'from-green-500 to-emerald-600',
  'career-switcher': 'from-blue-500 to-cyan-600',
  'skill-upgrader': 'from-purple-500 to-violet-600',
  'default': 'from-gray-500 to-slate-600'
};

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  selectedPersona,
  onPersonaSelect,
  className
}) => {
  const getPersonaIcon = (personaId: string) => {
    return PERSONA_ICONS[personaId as keyof typeof PERSONA_ICONS] || PERSONA_ICONS.default;
  };

  const getPersonaColor = (personaId: string) => {
    return PERSONA_COLORS[personaId as keyof typeof PERSONA_COLORS] || PERSONA_COLORS.default;
  };

  const formatInterests = (interests: UserInterest[] = []) => {
    const techInterests = interests.filter(i => i.type === 'tech');
    const industryInterests = interests.filter(i => i.type === 'industry');
    
    return {
      tech: techInterests.length,
      industry: industryInterests.length,
      highInterest: interests.filter(i => i.weight === 3).length
    };
  };

  const formatWorkEnvironmentPreferences = (preferences: any[] = []) => {
    return {
      total: preferences.length,
      highInterest: preferences.filter(p => p.weight === 3).length,
      preferred: preferences.filter(p => p.weight >= 2).length
    };
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Career Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Select a profile that matches your situation, or skip to create your own custom interest profile.
          These profiles come with pre-selected interests that you can modify.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => {
          const IconComponent = getPersonaIcon(persona.id);
          const isSelected = selectedPersona === persona.id;
          const workEnvStats = formatWorkEnvironmentPreferences(persona.workEnvironmentPreferences);
          const interestStats = persona.presetInterests ? formatInterests(persona.presetInterests) : null;
          
          return (
            <div
              key={persona.id}
              className={cn(
                "relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden",
                "hover:shadow-lg hover:scale-105",
                isSelected 
                  ? "border-blue-500 ring-4 ring-blue-500/20 shadow-lg scale-105" 
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
              onClick={() => onPersonaSelect(isSelected ? null : persona)}
            >
              {/* Header with gradient background */}
              <div className={cn("h-24 bg-gradient-to-r", getPersonaColor(persona.id))}>
                <div className="flex items-center justify-center h-full">
                  <IconComponent className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {persona.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {persona.description}
                </p>

                {/* Work Environment Preview */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Work Environment Preferences:
                  </h4>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {workEnvStats.total} Environments
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {workEnvStats.preferred} Preferred
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {workEnvStats.highInterest} ❤️ Loved
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* Custom Profile Option */}
        <div
          className={cn(
            "relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
            "hover:shadow-lg hover:scale-105 hover:border-gray-400 dark:hover:border-gray-500",
            selectedPersona === 'custom' 
              ? "border-blue-500 ring-4 ring-blue-500/20 shadow-lg scale-105" 
              : "border-gray-300 dark:border-gray-600"
          )}
          onClick={() => onPersonaSelect(null)}
        >
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <User className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Create Custom Profile
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Start fresh and build your own interest profile from scratch
            </p>
          </div>
        </div>
      </div>

      {/* Selected persona details */}
      {selectedPersona && selectedPersona !== 'custom' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Selected Profile Preview
          </h3>
          <div className="space-y-2">
            {personas.find(p => p.id === selectedPersona)?.workEnvironmentPreferences?.map((preference, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300">
                  {preference.id.replace(/-/g, ' ')}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {['👎', '😐', '👍', '❤️'][preference.weight]} {preference.weight}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
            These work environment preferences will guide your career recommendations.
          </p>
        </div>
      )}
    </div>
  );
}; 