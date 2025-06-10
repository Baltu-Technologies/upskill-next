'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  TrendingUp, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign,
  Star,
  Plus,
  Edit,
  Calendar,
  Briefcase,
  Award,
  Building,
  Settings,
  Globe,
  Heart,
  Zap
} from 'lucide-react';

// Define interfaces locally to avoid import issues
interface CareerGoal {
  id: string;
  category: 'short_term' | 'medium_term' | 'long_term';
  title: string;
  description: string;
  targetDate?: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  skillsRequired: string[];
}

interface JobRole {
  id: string;
  title: string;
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'director';
  industry: string;
  interestLevel: 1 | 2 | 3 | 4 | 5;
  isPreferred: boolean;
  matchingSkills: string[];
  notes?: string;
}

interface WorkPreference {
  workMode: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  schedule: 'full_time' | 'part_time' | 'contract' | 'freelance';
  teamSize: 'solo' | 'small' | 'medium' | 'large' | 'any';
  travelWillingness: 'none' | 'minimal' | 'moderate' | 'extensive';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  dealBreakers: string[];
}

interface IndustryPreference {
  industry: string;
  interestLevel: 1 | 2 | 3 | 4 | 5;
  experience: 'none' | 'some' | 'moderate' | 'extensive';
  notes?: string;
}

interface CareerPreferences {
  id: string;
  userId: string;
  goals: CareerGoal[];
  targetRoles: JobRole[];
  workPreferences: WorkPreference;
  industries: IndustryPreference[];
  careerStage: 'entry' | 'early' | 'mid' | 'senior' | 'executive';
  primaryMotivation: 'growth' | 'stability' | 'impact' | 'compensation' | 'flexibility' | 'creativity';
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

interface CareerPreferencesSectionProps {
  profile: UserProfile;
  skills: UserSkill[];
  hasUnsavedChanges: boolean;
}

// Mock data for Career Preferences
const mockCareerPreferences: CareerPreferences = {
  id: 'career-prefs-1',
  userId: 'user-1',
  careerStage: 'early',
  primaryMotivation: 'growth',
  goals: [
    {
      id: 'goal-1',
      category: 'short_term',
      title: 'Complete Embedded Systems Certification',
      description: 'Gain industry-recognized certification in embedded systems programming',
      targetDate: '2025-03-01T00:00:00Z',
      priority: 'high',
      progress: 75,
      status: 'active',
      skillsRequired: ['embedded-programming', 'microcontrollers', 'real-time-systems']
    },
    {
      id: 'goal-2',
      category: 'medium_term',
      title: 'Lead a Hardware Project Team',
      description: 'Take on a leadership role in a major hardware development project',
      targetDate: '2025-12-01T00:00:00Z',
      priority: 'high',
      progress: 30,
      status: 'active',
      skillsRequired: ['project-management', 'team-leadership', 'hardware-design']
    },
    {
      id: 'goal-3',
      category: 'long_term',
      title: 'Become Senior Hardware Engineer',
      description: 'Advance to senior-level position with expanded responsibilities',
      targetDate: '2027-06-01T00:00:00Z',
      priority: 'medium',
      progress: 15,
      status: 'active',
      skillsRequired: ['advanced-pcb-design', 'system-architecture', 'mentoring']
    }
  ],
  targetRoles: [
    {
      id: 'role-1',
      title: 'Embedded Systems Engineer',
      level: 'mid',
      industry: 'Electronics Manufacturing',
      interestLevel: 5,
      isPreferred: true,
      matchingSkills: ['embedded-programming', 'microcontrollers'],
      notes: 'Primary career target - combines programming and hardware skills'
    },
    {
      id: 'role-2',
      title: 'Hardware Design Engineer',
      level: 'mid',
      industry: 'Consumer Electronics',
      interestLevel: 4,
      isPreferred: true,
      matchingSkills: ['pcb-design', 'circuit-analysis'],
      notes: 'Strong interest in product development'
    },
    {
      id: 'role-3',
      title: 'Technical Project Manager',
      level: 'senior',
      industry: 'Technology',
      interestLevel: 3,
      isPreferred: false,
      matchingSkills: ['project-management', 'technical-communication'],
      notes: 'Future consideration for leadership path'
    }
  ],
  workPreferences: {
    workMode: 'hybrid',
    schedule: 'full_time',
    teamSize: 'small',
    travelWillingness: 'minimal',
    salaryRange: {
      min: 75000,
      max: 95000,
      currency: 'USD'
    },
    benefits: ['Health Insurance', 'Retirement Plan', 'Professional Development', 'Flexible Schedule'],
    dealBreakers: ['Excessive Overtime', 'No Remote Work', 'Toxic Culture']
  },
  industries: [
    {
      industry: 'Electronics Manufacturing',
      interestLevel: 5,
      experience: 'some',
      notes: 'Primary interest area with manufacturing automation focus'
    },
    {
      industry: 'Consumer Electronics',
      interestLevel: 4,
      experience: 'some',
      notes: 'Interested in product development and IoT devices'
    },
    {
      industry: 'Automotive',
      interestLevel: 4,
      experience: 'none',
      notes: 'Growing interest in electric vehicles and autonomous systems'
    },
    {
      industry: 'Aerospace',
      interestLevel: 3,
      experience: 'none',
      notes: 'Future consideration for advanced technology projects'
    }
  ],
  updatedAt: '2024-12-18T00:00:00Z'
};

export default function CareerPreferencesSection({
  profile,
  skills,
  hasUnsavedChanges
}: CareerPreferencesSectionProps) {
  const [activeTab, setActiveTab] = useState<'goals' | 'roles' | 'preferences' | 'industries'>('goals');
  
  const careerPrefs = mockCareerPreferences;

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInterestStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatSalaryRange = (range: any) => {
    return `${range.currency} ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Preferences</h2>
          <p className="text-gray-600">Define your career goals, target roles, and work preferences</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span>Edit Preferences</span>
        </Button>
      </div>

      {/* Career Stage & Motivation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Career Stage</p>
                <p className="text-2xl font-bold text-indigo-900 capitalize">{careerPrefs.careerStage}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Primary Motivation</p>
                <p className="text-2xl font-bold text-purple-900 capitalize">{careerPrefs.primaryMotivation}</p>
              </div>
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: 'goals', label: 'Career Goals', icon: Target },
            { id: 'roles', label: 'Target Roles', icon: Briefcase },
            { id: 'preferences', label: 'Work Preferences', icon: Settings },
            { id: 'industries', label: 'Industries', icon: Building }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Career Goals</h3>
            <Button size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            {careerPrefs.goals.map((goal) => (
              <Card key={goal.id} className="border-l-4 border-indigo-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Badge className={getGoalStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{goal.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium text-gray-700">Category</p>
                          <p className="text-sm text-gray-900 capitalize">{goal.category.replace('_', ' ')}</p>
                        </div>
                        {goal.targetDate && (
                          <div>
                            <p className="text-xs font-medium text-gray-700">Target Date</p>
                            <p className="text-sm text-gray-900">
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-700">Progress</p>
                          <p className="text-sm text-gray-900">{goal.progress}%</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      
                      {goal.skillsRequired.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-2">Skills Required</p>
                          <div className="flex flex-wrap gap-1">
                            {goal.skillsRequired.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Target Roles</h3>
            <Button size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPrefs.targetRoles.map((role) => (
              <Card key={role.id} className={`${role.isPreferred ? 'ring-2 ring-indigo-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{role.title}</h4>
                        {role.isPreferred && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{role.industry}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {role.level} level
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-1">Interest Level</p>
                    <div className="flex items-center space-x-1">
                      {getInterestStars(role.interestLevel)}
                    </div>
                  </div>
                  
                  {role.matchingSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Matching Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {role.matchingSkills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {role.notes && (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Notes</p>
                      <p className="text-sm text-gray-600">{role.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Work Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Work Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-700">Work Mode</p>
                    <p className="text-sm text-gray-900 capitalize">{careerPrefs.workPreferences.workMode}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Schedule</p>
                    <p className="text-sm text-gray-900 capitalize">{careerPrefs.workPreferences.schedule.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Team Size</p>
                    <p className="text-sm text-gray-900 capitalize">{careerPrefs.workPreferences.teamSize}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Travel</p>
                    <p className="text-sm text-gray-900 capitalize">{careerPrefs.workPreferences.travelWillingness}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compensation</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Salary Range</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatSalaryRange(careerPrefs.workPreferences.salaryRange)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Desired Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {careerPrefs.workPreferences.benefits.map((benefit) => (
                    <Badge key={benefit} className="bg-green-100 text-green-800">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deal Breakers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {careerPrefs.workPreferences.dealBreakers.map((dealBreaker) => (
                    <Badge key={dealBreaker} className="bg-red-100 text-red-800">
                      {dealBreaker}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'industries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Industry Preferences</h3>
            <Button size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Industry</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPrefs.industries.map((industry) => (
              <Card key={industry.industry}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{industry.industry}</h4>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">
                        {industry.experience} experience
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-1">Interest Level</p>
                    <div className="flex items-center space-x-1">
                      {getInterestStars(industry.interestLevel)}
                    </div>
                  </div>
                  
                  {industry.notes && (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Notes</p>
                      <p className="text-sm text-gray-600">{industry.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 