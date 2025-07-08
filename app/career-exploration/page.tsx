'use client';

import PersistentLayout from '@/app/components/PersistentLayout';
import CareerExplorationDemo from '@/app/demo/career-exploration/page';

export default function CareerExplorationPage() {
  return (
    <PersistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <CareerExplorationDemo />
      </div>
    </PersistentLayout>
  );
} 