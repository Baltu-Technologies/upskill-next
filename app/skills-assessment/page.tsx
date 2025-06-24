'use client';

import SkillsAssessment from '@/components/SkillsAssessment';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SkillsAssessmentPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/profile?tab=skills')}
          className="mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Skills Assessment
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete your comprehensive skills assessment to showcase your abilities to potential employers
          </p>
        </div>
      </div>

      {/* Skills Assessment Component */}
      <SkillsAssessment />
    </div>
  );
} 