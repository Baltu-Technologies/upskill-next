"use client";

import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, Save, Zap, Building2 } from 'lucide-react';
import { PersonaSelector } from './PersonaSelector';
import { TechDomainSelector } from './TechDomainSelector';
import { IndustryDomainSelector } from './IndustryDomainSelector';
import { 
  mockTechDomains, 
  mockIndustryDomains, 
  mockStarterPersonas,
  UserInterest,
  StarterPersona,
  saveUserInterests
} from '../../data/mockCareerData';
import { cn } from '@/lib/utils';

interface InterestCaptureProps {
  onComplete?: (interests: UserInterest[]) => void;
  initialInterests?: UserInterest[];
  className?: string;
}

const STEPS = [
  { id: 'persona', title: 'Choose Profile', description: 'Select a starting profile or go custom' },
  { id: 'tech', title: 'Technology Interests', description: 'Rate your interest in technology domains' },
  { id: 'industry', title: 'Industry Interests', description: 'Select industries that appeal to you' },
  { id: 'review', title: 'Review & Save', description: 'Review your selections and save your profile' }
];

export const InterestCapture: React.FC<InterestCaptureProps> = ({
  onComplete,
  initialInterests = [],
  className
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<string | undefined>();
  const [userInterests, setUserInterests] = useState<UserInterest[]>(initialInterests);
  const [isLoading, setSending] = useState(false);

  // Handle persona selection
  const handlePersonaSelect = useCallback((persona: StarterPersona | null) => {
    if (persona) {
      setSelectedPersona(persona.id);
      // Use preset interests if available, otherwise start with empty array
      // Work environment preferences are handled separately and don't convert to UserInterests
      setUserInterests(persona.presetInterests || []);
    } else {
      setSelectedPersona('custom');
      setUserInterests([]);
    }
  }, []);

  // Handle interest updates (merge or update existing)
  const handleInterestChange = useCallback((newInterest: UserInterest) => {
    setUserInterests(prev => {
      // Remove any existing interest for the same domain/subdomain
      const filtered = prev.filter(interest => {
        if (newInterest.domainId && interest.domainId === newInterest.domainId && !newInterest.subdomainId) {
          return false; // Remove domain-level interest if updating domain
        }
        if (newInterest.subdomainId && interest.subdomainId === newInterest.subdomainId) {
          return false; // Remove subdomain-level interest if updating subdomain
        }
        return true;
      });

      // Add the new interest
      return [...filtered, newInterest];
    });
  }, []);

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save and complete
  const handleSaveAndComplete = async () => {
    setSending(true);
    try {
      await saveUserInterests(userInterests);
      onComplete?.(userInterests);
    } catch (error) {
      console.error('Failed to save interests:', error);
    } finally {
      setSending(false);
    }
  };

  // Check if current step can proceed
  const canProceedFromStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Persona step
        return selectedPersona !== undefined;
      case 1: // Tech interests
        return userInterests.some(i => i.type === 'tech');
      case 2: // Industry interests
        return userInterests.some(i => i.type === 'industry');
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'persona':
        return (
          <PersonaSelector
            personas={mockStarterPersonas}
            selectedPersona={selectedPersona}
            onPersonaSelect={handlePersonaSelect}
          />
        );
      
      case 'tech':
        return (
          <TechDomainSelector
            techDomains={mockTechDomains}
            userInterests={userInterests}
            onInterestChange={handleInterestChange}
          />
        );
      
      case 'industry':
        return (
          <IndustryDomainSelector
            industryDomains={mockIndustryDomains}
            userInterests={userInterests}
            onInterestChange={handleInterestChange}
          />
        );
      
      case 'review':
        const getInterestLevelLabel = (weight: number) => {
          switch (weight) {
            case 0: return 'Not Interested';
            case 1: return 'Somewhat Interested';
            case 2: return 'Interested';
            case 3: return 'Very Interested';
            default: return 'Unknown';
          }
        };

        const getInterestLevelColor = (weight: number) => {
          switch (weight) {
            case 0: return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
            case 1: return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
            case 2: return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
            case 3: return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
          }
        };

        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Review Your Interest Profile
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Review your selections and save your career exploration profile to get personalized recommendations.
              </p>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {userInterests.filter(i => i.type === 'tech').length}
                </div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Technology Areas</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {userInterests.filter(i => i.type === 'industry').length}
                </div>
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Industry Areas</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {userInterests.filter(i => i.weight === 3).length}
                </div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300">Very Interested</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-800">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {userInterests.length}
                </div>
                <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Total Interests</div>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tech Interests */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Technology Interests
                  </h3>
                </div>
                <div className="space-y-3">
                  {userInterests
                    .filter(i => i.type === 'tech')
                    .sort((a, b) => b.weight - a.weight)
                    .map((interest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {interest.domainId || interest.subdomainId}
                        </span>
                        <span className={cn(
                          "text-xs font-semibold px-3 py-1 rounded-full",
                          getInterestLevelColor(interest.weight)
                        )}>
                          {getInterestLevelLabel(interest.weight)}
                        </span>
                      </div>
                    ))
                  }
                  {userInterests.filter(i => i.type === 'tech').length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No technology interests selected yet
                    </div>
                  )}
                </div>
              </div>

              {/* Industry Interests */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Industry Interests
                  </h3>
                </div>
                <div className="space-y-3">
                  {userInterests
                    .filter(i => i.type === 'industry')
                    .sort((a, b) => b.weight - a.weight)
                    .map((interest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {interest.domainId || interest.subdomainId}
                        </span>
                        <span className={cn(
                          "text-xs font-semibold px-3 py-1 rounded-full",
                          getInterestLevelColor(interest.weight)
                        )}>
                          {getInterestLevelLabel(interest.weight)}
                        </span>
                      </div>
                    ))
                  }
                  {userInterests.filter(i => i.type === 'industry').length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No industry interests selected yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Explore Your Career Path?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Save your profile to get personalized career recommendations and start building your future.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep + 1} of {STEPS.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    index < currentStep 
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                >
                  {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {step.title}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-1 rounded transition-colors",
                    index < currentStep 
                      ? "bg-green-500" 
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between py-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors",
            currentStep === 0
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={goToNextStep}
            disabled={!canProceedFromStep(currentStep)}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors",
              canProceedFromStep(currentStep)
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            <span>Next</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={handleSaveAndComplete}
            disabled={isLoading || userInterests.length === 0}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors",
              "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            )}
          >
            <Save className="h-5 w-5" />
            <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
          </button>
        )}
      </div>
    </div>
  );
}; 