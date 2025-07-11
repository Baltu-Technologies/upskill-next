'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { Course } from '@/types/microlesson/slide';

interface MicrolessonBuilderProps {
  _courseData: any; // Prefixed with underscore to indicate intentionally unused
  _onUpdate: (data: any) => void; // Prefixed with underscore to indicate intentionally unused
}

export default function MicrolessonBuilder({ _courseData, _onUpdate }: MicrolessonBuilderProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Microlesson Planning
          </CardTitle>
          <CardDescription>
            Define individual microlessons within each lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">
              This section will allow you to create and organize microlessons within each lesson.
            </p>
            <p className="text-sm text-slate-500">
              Coming soon: Microlesson creation tools
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 