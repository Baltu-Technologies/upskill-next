'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp,
  ExternalLink,
  Star,
  DollarSign,
  Users,
  FileText,
  Medal,
  Flame,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';

// Define interfaces locally to avoid import issues
interface LearningActivity {
  id: string;
  type: 'course' | 'certification' | 'workshop' | 'bootcamp' | 'degree' | 'self_study' | 'project' | 'mentorship';
  title: string;
  description?: string;
  provider: string;
  instructor?: string;
  duration?: string;
  startDate: string;
  endDate?: string;
  completionDate?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'dropped';
  progress: number;
  certificateUrl?: string;
  credentialId?: string;
  skillsLearned: string[];
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  cost?: number;
  currency?: string;
  tags: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'certification' | 'award' | 'recognition' | 'milestone' | 'project_completion';
  earnedDate: string;
  issuer: string;
  credentialUrl?: string;
  expirationDate?: string;
  isVerified: boolean;
  skillsRelated: string[];
  icon?: string;
}

interface LearningHistory {
  id: string;
  userId: string;
  activities: LearningActivity[];
  achievements: Achievement[];
  totalHoursLearned: number;
  totalCertifications: number;
  learningStreak: number;
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  weeklyLearningGoal: number;
  currentFocus: string[];
  updatedAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  profileCompleteness: number;
}

interface UserSkill {
  id: string;
  skillTemplateId: string;
  userId: string;
  confidenceLevel: 0 | 1 | 2 | 3 | 4;
}

interface LearningHistorySectionProps {
  profile: UserProfile;
  skills: UserSkill[];
  hasUnsavedChanges: boolean;
}

// Mock data for Learning History
const mockLearningHistory: LearningHistory = {
  id: 'learning-history-1',
  userId: 'user-1',
  totalHoursLearned: 245,
  totalCertifications: 3,
  learningStreak: 12,
  preferredLearningStyle: 'visual',
  weeklyLearningGoal: 8,
  currentFocus: ['Embedded Systems', 'Python Programming', 'PCB Design'],
  activities: [
    {
      id: 'activity-1',
      type: 'course',
      title: 'Embedded Systems Programming with C++',
      description: 'Comprehensive course covering microcontroller programming and real-time systems',
      provider: 'TechEd Academy',
      instructor: 'Dr. Sarah Johnson',
      duration: '80 hours',
      startDate: '2024-10-01T00:00:00Z',
      endDate: '2024-12-15T00:00:00Z',
      completionDate: '2024-12-10T00:00:00Z',
      status: 'completed',
      progress: 100,
      certificateUrl: 'https://teched.com/certificates/embedded-cpp-alex-chen',
      credentialId: 'TECHED-EMB-2024-1234',
      skillsLearned: ['embedded-programming', 'microcontrollers', 'real-time-systems'],
      rating: 5,
      notes: 'Excellent course with hands-on projects. The real-time systems module was particularly valuable.',
      cost: 299,
      currency: 'USD',
      tags: ['Programming', 'Hardware', 'Certification']
    },
    {
      id: 'activity-2',
      type: 'certification',
      title: 'IPC Soldering Certification (J-STD-001)',
      description: 'Industry standard certification for electronic soldering',
      provider: 'IPC International',
      duration: '16 hours',
      startDate: '2024-08-15T00:00:00Z',
      completionDate: '2024-08-17T00:00:00Z',
      status: 'completed',
      progress: 100,
      certificateUrl: 'https://ipc.org/certificates/j-std-001-alex-chen',
      credentialId: 'IPC-J001-2024-5678',
      skillsLearned: ['soldering', 'quality-control'],
      rating: 4,
      cost: 450,
      currency: 'USD',
      tags: ['Hardware', 'Manufacturing', 'Quality']
    },
    {
      id: 'activity-3',
      type: 'course',
      title: 'Python for Industrial Automation',
      description: 'Learn to use Python for automation and data analysis in industrial settings',
      provider: 'AutomationU',
      instructor: 'Mark Thompson',
      duration: '40 hours',
      startDate: '2024-11-01T00:00:00Z',
      endDate: '2024-12-31T00:00:00Z',
      status: 'in_progress',
      progress: 75,
      skillsLearned: ['python', 'industrial-automation', 'data-analysis'],
      rating: 4,
      notes: 'Great practical examples, working on final automation project',
      cost: 199,
      currency: 'USD',
      tags: ['Programming', 'Automation', 'Data']
    },
    {
      id: 'activity-4',
      type: 'workshop',
      title: 'PCB Design Fundamentals Workshop',
      description: 'Hands-on workshop covering PCB design principles and CAD tools',
      provider: 'Circuit Design Institute',
      instructor: 'Lisa Rodriguez',
      duration: '24 hours',
      startDate: '2024-07-10T00:00:00Z',
      endDate: '2024-07-12T00:00:00Z',
      completionDate: '2024-07-12T00:00:00Z',
      status: 'completed',
      progress: 100,
      skillsLearned: ['pcb-design', 'cad-tools'],
      rating: 5,
      notes: 'Excellent hands-on experience with industry-standard tools',
      cost: 350,
      currency: 'USD',
      tags: ['Hardware', 'Design', 'CAD']
    }
  ],
  achievements: [
    {
      id: 'achievement-1',
      title: 'IPC J-STD-001 Certified Specialist',
      description: 'Industry-recognized certification for electronic soldering standards',
      type: 'certification',
      earnedDate: '2024-08-17T00:00:00Z',
      issuer: 'IPC International',
      credentialUrl: 'https://ipc.org/certificates/j-std-001-alex-chen',
      expirationDate: '2027-08-17T00:00:00Z',
      isVerified: true,
      skillsRelated: ['soldering', 'quality-control'],
      icon: '🏆'
    },
    {
      id: 'achievement-2',
      title: 'Embedded Systems Programming Graduate',
      description: 'Successfully completed comprehensive embedded systems course',
      type: 'certification',
      earnedDate: '2024-12-10T00:00:00Z',
      issuer: 'TechEd Academy',
      credentialUrl: 'https://teched.com/certificates/embedded-cpp-alex-chen',
      isVerified: true,
      skillsRelated: ['embedded-programming', 'microcontrollers'],
      icon: '📜'
    },
    {
      id: 'achievement-3',
      title: 'Continuous Learner Streak',
      description: 'Maintained daily learning activity for 12 consecutive days',
      type: 'milestone',
      earnedDate: '2024-12-18T00:00:00Z',
      issuer: 'Learning Platform',
      isVerified: false,
      skillsRelated: ['continuous-learning'],
      icon: '🔥'
    }
  ],
  updatedAt: '2024-12-18T00:00:00Z'
};

export default function LearningHistorySection({
  profile,
  skills,
  hasUnsavedChanges
}: LearningHistorySectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const learningHistory = mockLearningHistory;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'certification': return <Award className="w-4 h-4" />;
      case 'workshop': return <Users className="w-4 h-4" />;
      case 'bootcamp': return <Target className="w-4 h-4" />;
      case 'degree': return <Medal className="w-4 h-4" />;
      case 'self_study': return <FileText className="w-4 h-4" />;
      case 'project': return <TrendingUp className="w-4 h-4" />;
      case 'mentorship': return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800';
      case 'certification': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-green-100 text-green-800';
      case 'bootcamp': return 'bg-orange-100 text-orange-800';
      case 'degree': return 'bg-indigo-100 text-indigo-800';
      case 'self_study': return 'bg-gray-100 text-gray-800';
      case 'project': return 'bg-yellow-100 text-yellow-800';
      case 'mentorship': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = learningHistory.activities.filter(activity => {
    const statusMatch = activeFilter === 'all' || activity.status === activeFilter;
    const typeMatch = selectedType === 'all' || activity.type === selectedType;
    return statusMatch && typeMatch;
  });

  const uniqueTypes = Array.from(new Set(learningHistory.activities.map(a => a.type)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning History</h2>
          <p className="text-gray-600">Track your learning journey, achievements, and progress</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Learning Activity</span>
        </Button>
      </div>

      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Hours</p>
                <p className="text-2xl font-bold text-blue-900">{learningHistory.totalHoursLearned}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Certifications</p>
                <p className="text-2xl font-bold text-purple-900">{learningHistory.totalCertifications}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Learning Streak</p>
                <p className="text-2xl font-bold text-orange-900">{learningHistory.learningStreak} days</p>
              </div>
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Weekly Goal</p>
                <p className="text-2xl font-bold text-green-900">{learningHistory.weeklyLearningGoal}h</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>Current Learning Focus</span>
          </CardTitle>
          <CardDescription>Areas you're actively learning about</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {learningHistory.currentFocus.map((focus) => (
              <Badge key={focus} variant="secondary" className="px-3 py-1">
                {focus}
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Preferred Learning Style: <span className="font-medium text-gray-900 capitalize">{learningHistory.preferredLearningStyle}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Medal className="w-5 h-5 text-yellow-600" />
            <span>Recent Achievements</span>
          </CardTitle>
          <CardDescription>Your latest learning milestones and certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningHistory.achievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-50">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-xs text-gray-500">
                          Issued by {achievement.issuer} • {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                        {achievement.isVerified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                    {achievement.credentialUrl && (
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Learning Activities</span>
              </CardTitle>
              <CardDescription>Your learning history and current activities</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('in_progress')}
              >
                In Progress
              </Button>
              <Button
                variant={activeFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                        {getTypeIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.provider}</p>
                      </div>
                    </div>
                    
                    {activity.description && (
                      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Duration</p>
                        <p className="text-sm text-gray-900">{activity.duration || 'Not specified'}</p>
                      </div>
                      {activity.instructor && (
                        <div>
                          <p className="text-xs font-medium text-gray-700">Instructor</p>
                          <p className="text-sm text-gray-900">{activity.instructor}</p>
                        </div>
                      )}
                      {activity.cost !== undefined && (
                        <div>
                          <p className="text-xs font-medium text-gray-700">Cost</p>
                          <p className="text-sm text-gray-900">
                            {activity.cost === 0 ? 'Free' : `${activity.currency} ${activity.cost}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Progress</span>
                        <span className="text-xs font-medium text-gray-900">{activity.progress}%</span>
                      </div>
                      <Progress value={activity.progress} className="h-2" />
                    </div>

                    {/* Skills Learned */}
                    {activity.skillsLearned.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">Skills Learned</p>
                        <div className="flex flex-wrap gap-1">
                          {activity.skillsLearned.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {activity.rating && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-xs font-medium text-gray-700">Rating:</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < activity.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {activity.notes && (
                      <div className="bg-gray-50 rounded p-3 mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{activity.notes}</p>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {activity.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.replace('_', ' ')}
                    </Badge>
                    {activity.certificateUrl && (
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Certificate</span>
                      </Button>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(activity.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}