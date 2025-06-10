'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Layout, 
  Monitor, 
  Moon, 
  Sun,
  Settings,
  Eye,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Globe,
  Lock,
  User,
  Building,
  GraduationCap,
  Award,
  Edit
} from 'lucide-react';

// Define interfaces locally to avoid import issues
interface ProfileCustomization {
  id: string;
  userId: string;
  theme: {
    colorScheme: 'light' | 'dark' | 'auto';
    primaryColor: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    fontSize: 'small' | 'medium' | 'large';
    density: 'compact' | 'comfortable' | 'spacious';
  };
  layout: {
    sidebarPosition: 'left' | 'right';
    cardLayout: 'grid' | 'list';
    showProgressBars: boolean;
    showAdvancedMetrics: boolean;
    collapsibleSections: boolean;
  };
  profileCompleteness: {
    overall: number;
    sections: {
      personalInfo: { completed: boolean; weight: number };
      skills: { completed: boolean; weight: number };
      careerPreferences: { completed: boolean; weight: number };
      learningHistory: { completed: boolean; weight: number };
      achievements: { completed: boolean; weight: number };
      privacy: { completed: boolean; weight: number };
    };
    milestones: string[];
    recommendations: string[];
  };
  accessControl: {
    defaultVisibility: 'public' | 'registered' | 'connections' | 'private';
    rolePermissions: {
      [key: string]: {
        canViewProfile: boolean;
        canViewSkills: boolean;
        canViewCareerGoals: boolean;
        canViewLearningHistory: boolean;
        canEndorseSkills: boolean;
        canRequestConnection: boolean;
      };
    };
  };
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

interface ProfileCustomizationSectionProps {
  profile: UserProfile;
  skills: UserSkill[];
  hasUnsavedChanges: boolean;
}

// Mock data for Profile Customization
const mockProfileCustomization: ProfileCustomization = {
  id: 'customization-1',
  userId: 'user-1',
  theme: {
    colorScheme: 'light',
    primaryColor: 'blue',
    fontSize: 'medium',
    density: 'comfortable'
  },
  layout: {
    sidebarPosition: 'left',
    cardLayout: 'grid',
    showProgressBars: true,
    showAdvancedMetrics: false,
    collapsibleSections: true
  },
  profileCompleteness: {
    overall: 78,
    sections: {
      personalInfo: { completed: true, weight: 15 },
      skills: { completed: true, weight: 25 },
      careerPreferences: { completed: true, weight: 20 },
      learningHistory: { completed: false, weight: 15 },
      achievements: { completed: false, weight: 10 },
      privacy: { completed: true, weight: 15 }
    },
    milestones: [
      'Profile Photo Added',
      'Skills Inventory Completed', 
      'Career Goals Defined',
      'Privacy Settings Configured'
    ],
    recommendations: [
      'Add learning history to increase credibility',
      'Upload skill certificates for verification',
      'Set up learning goals for better recommendations'
    ]
  },
  accessControl: {
    defaultVisibility: 'registered',
    rolePermissions: {
      'public': {
        canViewProfile: true,
        canViewSkills: false,
        canViewCareerGoals: false,
        canViewLearningHistory: false,
        canEndorseSkills: false,
        canRequestConnection: false
      },
      'registered_user': {
        canViewProfile: true,
        canViewSkills: true,
        canViewCareerGoals: false,
        canViewLearningHistory: true,
        canEndorseSkills: true,
        canRequestConnection: true
      },
      'connection': {
        canViewProfile: true,
        canViewSkills: true,
        canViewCareerGoals: true,
        canViewLearningHistory: true,
        canEndorseSkills: true,
        canRequestConnection: false
      },
      'instructor': {
        canViewProfile: true,
        canViewSkills: true,
        canViewCareerGoals: false,
        canViewLearningHistory: true,
        canEndorseSkills: true,
        canRequestConnection: true
      },
      'employer': {
        canViewProfile: true,
        canViewSkills: true,
        canViewCareerGoals: true,
        canViewLearningHistory: true,
        canEndorseSkills: false,
        canRequestConnection: true
      }
    }
  },
  updatedAt: '2024-12-18T00:00:00Z'
};

export default function ProfileCustomizationSection({
  profile,
  skills,
  hasUnsavedChanges
}: ProfileCustomizationSectionProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'layout' | 'completeness' | 'access'>('appearance');
  const [customization, setCustomization] = useState(mockProfileCustomization);

  const handleThemeUpdate = (key: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value
      }
    }));
  };

  const handleLayoutUpdate = (key: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value
      }
    }));
  };

  const handleAccessUpdate = (role: string, permission: string, value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      accessControl: {
        ...prev.accessControl,
        rolePermissions: {
          ...prev.accessControl.rolePermissions,
          [role]: {
            ...prev.accessControl.rolePermissions[role],
            [permission]: value
          }
        }
      }
    }));
  };

  const getCompletionColor = (completed: boolean) => {
    return completed ? 'text-green-600' : 'text-orange-600';
  };

  const getCompletionIcon = (completed: boolean) => {
    return completed ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-orange-600" />;
  };

  const calculateSectionCompletion = () => {
    const sections = customization.profileCompleteness.sections;
    const completedSections = Object.values(sections).filter(section => section.completed).length;
    const totalSections = Object.keys(sections).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Customization</h2>
          <p className="text-gray-600">Customize your profile appearance, layout, and access controls</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Advanced Settings</span>
        </Button>
      </div>

      {/* Profile Completeness Overview */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-indigo-900">Profile Completeness</h3>
              <p className="text-sm text-indigo-700">Complete your profile to unlock more features</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-900">{customization.profileCompleteness.overall}%</div>
              <p className="text-sm text-indigo-700">Complete</p>
            </div>
          </div>
          
          <Progress 
            value={customization.profileCompleteness.overall} 
            className="w-full h-3 mb-4" 
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(customization.profileCompleteness.sections).map(([key, section]) => (
              <div key={key} className="flex items-center space-x-2">
                {getCompletionIcon(section.completed)}
                <span className={`capitalize ${getCompletionColor(section.completed)}`}>
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'layout', label: 'Layout', icon: Layout },
            { id: 'completeness', label: 'Profile Health', icon: Star },
            { id: 'access', label: 'Access Control', icon: Shield }
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
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Theme & Appearance</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Color Scheme</CardTitle>
              <CardDescription>Choose your preferred color scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeUpdate('colorScheme', value)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 ${
                      customization.theme.colorScheme === value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Primary Color</CardTitle>
              <CardDescription>Select your primary accent color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { value: 'blue', color: 'bg-blue-500' },
                  { value: 'green', color: 'bg-green-500' },
                  { value: 'purple', color: 'bg-purple-500' },
                  { value: 'orange', color: 'bg-orange-500' },
                  { value: 'red', color: 'bg-red-500' }
                ].map(({ value, color }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeUpdate('primaryColor', value)}
                    className={`w-12 h-12 rounded-full ${color} ${
                      customization.theme.primaryColor === value
                        ? 'ring-4 ring-gray-300'
                        : 'hover:ring-2 hover:ring-gray-200'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Typography & Spacing</CardTitle>
              <CardDescription>Adjust text size and content density</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Font Size</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeUpdate('fontSize', value)}
                      className={`p-3 rounded-lg border-2 ${
                        customization.theme.fontSize === value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Content Density</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'compact', label: 'Compact' },
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'spacious', label: 'Spacious' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeUpdate('density', value)}
                      className={`p-3 rounded-lg border-2 ${
                        customization.theme.density === value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Layout Preferences</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Navigation & Layout</CardTitle>
              <CardDescription>Customize how content is organized and displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Sidebar Position</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'left', label: 'Left Side' },
                    { value: 'right', label: 'Right Side' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleLayoutUpdate('sidebarPosition', value)}
                      className={`p-4 rounded-lg border-2 ${
                        customization.layout.sidebarPosition === value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Card Layout</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'grid', label: 'Grid View' },
                    { value: 'list', label: 'List View' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleLayoutUpdate('cardLayout', value)}
                      className={`p-4 rounded-lg border-2 ${
                        customization.layout.cardLayout === value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Display Options</h4>
                
                {[
                  { key: 'showProgressBars', label: 'Show Progress Bars', description: 'Display progress indicators on skills and goals' },
                  { key: 'showAdvancedMetrics', label: 'Advanced Metrics', description: 'Show detailed analytics and statistics' },
                  { key: 'collapsibleSections', label: 'Collapsible Sections', description: 'Allow sections to be collapsed for focus' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                    <button
                      onClick={() => handleLayoutUpdate(key, !customization.layout[key as keyof typeof customization.layout])}
                      className={`w-11 h-6 rounded-full ${
                        customization.layout[key as keyof typeof customization.layout]
                          ? 'bg-indigo-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        customization.layout[key as keyof typeof customization.layout]
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'completeness' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Health & Completeness</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section Completion</CardTitle>
              <CardDescription>Track your progress across different profile sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(customization.profileCompleteness.sections).map(([key, section]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {getCompletionIcon(section.completed)}
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-600">Weight: {section.weight}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={section.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {section.completed ? 'Complete' : 'Incomplete'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Achievements & Milestones</CardTitle>
              <CardDescription>Your completed profile milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customization.profileCompleteness.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-900">{milestone}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommendations</CardTitle>
              <CardDescription>Suggested actions to improve your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customization.profileCompleteness.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span className="text-sm text-blue-900">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Access Control & Permissions</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Default Visibility</CardTitle>
              <CardDescription>Set the default visibility level for your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'public', label: 'Public', icon: Globe, description: 'Visible to everyone' },
                  { value: 'registered', label: 'Registered Users', icon: Users, description: 'Visible to registered users' },
                  { value: 'connections', label: 'Connections Only', icon: User, description: 'Visible to your connections' },
                  { value: 'private', label: 'Private', icon: Lock, description: 'Only visible to you' }
                ].map(({ value, label, icon: Icon, description }) => (
                  <button
                    key={value}
                    onClick={() => setCustomization(prev => ({
                      ...prev,
                      accessControl: { ...prev.accessControl, defaultVisibility: value as any }
                    }))}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 ${
                      customization.accessControl.defaultVisibility === value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-medium text-sm">{label}</span>
                    <span className="text-xs text-gray-600 text-center">{description}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role-Based Permissions</CardTitle>
              <CardDescription>Configure what different user roles can see and do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-900">Role</th>
                      <th className="text-center py-2 font-medium text-gray-900">View Profile</th>
                      <th className="text-center py-2 font-medium text-gray-900">View Skills</th>
                      <th className="text-center py-2 font-medium text-gray-900">View Goals</th>
                      <th className="text-center py-2 font-medium text-gray-900">View History</th>
                      <th className="text-center py-2 font-medium text-gray-900">Endorse</th>
                      <th className="text-center py-2 font-medium text-gray-900">Connect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(customization.accessControl.rolePermissions).map(([role, permissions]) => (
                      <tr key={role} className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-900 capitalize">{role.replace('_', ' ')}</td>
                        {Object.entries(permissions).map(([permission, allowed]) => (
                          <td key={permission} className="text-center py-3">
                            <button
                              onClick={() => handleAccessUpdate(role, permission, !allowed)}
                              className={`w-5 h-5 rounded-full ${
                                allowed ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              {allowed && <CheckCircle className="w-5 h-5 text-white" />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 