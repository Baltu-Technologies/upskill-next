"use client";

import { useState } from 'react';
import { InterestCapture } from '../../../src/components/career-exploration/InterestCapture';
import { UserInterest } from '../../../src/data/mockCareerData';
import { CheckCircle2, Zap, Building2, Target, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CareerExplorationDemo() {
  const [completedInterests, setCompletedInterests] = useState<UserInterest[] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = (interests: UserInterest[]) => {
    setCompletedInterests(interests);
    setIsCompleted(true);
  };

  const restart = () => {
    setCompletedInterests(null);
    setIsCompleted(false);
  };

  // Helper functions for interest level display
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

  if (isCompleted && completedInterests) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Complete!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your career exploration profile has been saved successfully. You're now ready to explore personalized pathways and opportunities.
            </p>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {completedInterests.filter(i => i.type === 'tech').length}
              </div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Technology Areas</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {completedInterests.filter(i => i.type === 'industry').length}
              </div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Industry Areas</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800 shadow-sm">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {completedInterests.filter(i => i.weight === 3).length}
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Very Interested</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-800 shadow-sm">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                {completedInterests.length}
              </div>
              <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Total Interests</div>
            </div>
          </div>

          {/* Detailed Profile Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Interest Profile Summary
              </h2>
              <p className="text-blue-100">
                Here's what we learned about your career interests and preferences
              </p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tech Interests */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Technology Interests
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {completedInterests
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
                    {completedInterests.filter(i => i.type === 'tech').length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No technology interests captured
                      </div>
                    )}
                  </div>
                </div>

                {/* Industry Interests */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Industry Interests
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {completedInterests
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
                    {completedInterests.filter(i => i.type === 'industry').length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No industry interests captured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800 mb-8">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  What's Next?
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>• <strong>Personalized Recommendations:</strong> We'll use your profile to suggest relevant career pathways</p>
                  <p>• <strong>Course Matching:</strong> Get recommendations for courses that align with your interests</p>
                  <p>• <strong>Industry Connections:</strong> Connect with opportunities in your preferred industries</p>
                  <p>• <strong>Skill Development:</strong> Receive guidance on skills to develop for your target roles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restart}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Try Again</span>
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg">
              Explore Career Pathways
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Career Exploration Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the complete career exploration interest capture system. 
            This demo showcases all components working together in a real workflow.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <InterestCapture onComplete={handleComplete} />
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-2xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Persona-Based Start
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Choose from predefined career profiles or create a custom one from scratch.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-2xl mb-4">😊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Emoji-Based Rating
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Intuitive 4-level interest rating using emojis: 👎 😐 👍 ❤️
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Smart Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get insights and recommendations based on your captured interest profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 