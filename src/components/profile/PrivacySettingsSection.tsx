'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '../ui/switch';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Bell,
  Users,
  Globe,
  UserCheck,
  AlertTriangle,
  Settings,
  Download,
  Trash2,
  Key,
  Smartphone
} from 'lucide-react';

// Define interfaces locally to avoid import issues
interface PrivacySettings {
  id: string;
  userId: string;
  profileVisibility: {
    isPublic: boolean;
    showFullName: boolean;
    showEmail: boolean;
    showLocation: boolean;
    showSkills: boolean;
    showLearningHistory: boolean;
    showCareerGoals: boolean;
    showEndorsements: boolean;
  };
  dataSharing: {
    allowAnalytics: boolean;
    allowMarketingEmails: boolean;
    allowThirdPartyIntegrations: boolean;
    allowSkillVerification: boolean;
    shareProgressWithInstructors: boolean;
    shareWithEmployers: boolean;
  };
  communications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    weeklyProgress: boolean;
    achievementAlerts: boolean;
    endorsementRequests: boolean;
    jobRecommendations: boolean;
    learningReminders: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeDevices: number;
    allowedLoginLocations: string[];
    requirePasswordForSensitiveActions: boolean;
  };
  dataRights: {
    lastDataExport: string | null;
    dataRetentionPeriod: number; // in months
    allowDataDeletion: boolean;
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

interface PrivacySettingsSectionProps {
  profile: UserProfile;
  skills: UserSkill[];
  hasUnsavedChanges: boolean;
}

// Mock data for Privacy Settings
const mockPrivacySettings: PrivacySettings = {
  id: 'privacy-settings-1',
  userId: 'user-1',
  profileVisibility: {
    isPublic: true,
    showFullName: true,
    showEmail: false,
    showLocation: true,
    showSkills: true,
    showLearningHistory: true,
    showCareerGoals: false,
    showEndorsements: true,
  },
  dataSharing: {
    allowAnalytics: true,
    allowMarketingEmails: false,
    allowThirdPartyIntegrations: true,
    allowSkillVerification: true,
    shareProgressWithInstructors: true,
    shareWithEmployers: false,
  },
  communications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyProgress: true,
    achievementAlerts: true,
    endorsementRequests: true,
    jobRecommendations: false,
    learningReminders: true,
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: '2024-11-15T00:00:00Z',
    activeDevices: 3,
    allowedLoginLocations: ['United States', 'Canada'],
    requirePasswordForSensitiveActions: true,
  },
  dataRights: {
    lastDataExport: '2024-10-01T00:00:00Z',
    dataRetentionPeriod: 24,
    allowDataDeletion: true,
  },
  updatedAt: '2024-12-18T00:00:00Z'
};

export default function PrivacySettingsSection({
  profile,
  skills,
  hasUnsavedChanges
}: PrivacySettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'visibility' | 'data' | 'communications' | 'security' | 'rights'>('visibility');
  const [settings, setSettings] = useState(mockPrivacySettings);

  const handleToggle = (section: keyof PrivacySettings, key: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: checked
      }
    }));
  };

  const getVisibilityStats = () => {
    const visibility = settings.profileVisibility;
    const totalFields = Object.keys(visibility).length - 1; // Exclude isPublic
    const visibleFields = Object.entries(visibility)
      .filter(([key, value]) => key !== 'isPublic' && value)
      .length;
    return {
      visible: visibleFields,
      total: totalFields,
      percentage: Math.round((visibleFields / totalFields) * 100)
    };
  };

  const getSecurityScore = () => {
    const security = settings.security;
    let score = 0;
    if (security.twoFactorEnabled) score += 25;
    if (security.requirePasswordForSensitiveActions) score += 15;
    if (new Date(security.lastPasswordChange) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) score += 25;
    if (security.activeDevices <= 3) score += 20;
    if (security.allowedLoginLocations.length > 0) score += 15;
    return score;
  };

  const stats = getVisibilityStats();
  const securityScore = getSecurityScore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
          <p className="text-gray-600">Manage your privacy preferences and security settings</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Security Center</span>
        </Button>
      </div>

      {/* Privacy & Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Profile Visibility</p>
                <p className="text-2xl font-bold text-blue-900">{stats.percentage}%</p>
                <p className="text-xs text-blue-700">{stats.visible} of {stats.total} fields visible</p>
              </div>
              {settings.profileVisibility.isPublic ? <Eye className="w-8 h-8 text-blue-600" /> : <EyeOff className="w-8 h-8 text-blue-600" />}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Security Score</p>
                <p className="text-2xl font-bold text-green-900">{securityScore}/100</p>
                <p className="text-xs text-green-700">
                  {securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Devices</p>
                <p className="text-2xl font-bold text-purple-900">{settings.security.activeDevices}</p>
                <p className="text-xs text-purple-700">Logged in devices</p>
              </div>
              <Smartphone className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: 'visibility', label: 'Profile Visibility', icon: Eye },
            { id: 'data', label: 'Data Sharing', icon: Globe },
            { id: 'communications', label: 'Communications', icon: Bell },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'rights', label: 'Data Rights', icon: Shield }
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
      {activeTab === 'visibility' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Visibility Settings</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Public Profile</CardTitle>
              <CardDescription>Control who can see your profile and what information is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Make profile public</p>
                  <p className="text-sm text-gray-600">Allow others to discover and view your profile</p>
                </div>
                <Switch
                  checked={settings.profileVisibility.isPublic}
                  onCheckedChange={(checked: boolean) => handleToggle('profileVisibility', 'isPublic', checked)}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Visible Information</h4>
                
                {[
                  { key: 'showFullName', label: 'Full Name', description: 'Display your first and last name' },
                  { key: 'showEmail', label: 'Email Address', description: 'Show your email address to other users' },
                  { key: 'showLocation', label: 'Location', description: 'Display your city and country' },
                  { key: 'showSkills', label: 'Skills & Expertise', description: 'Show your skill inventory and levels' },
                  { key: 'showLearningHistory', label: 'Learning History', description: 'Display completed courses and certifications' },
                  { key: 'showCareerGoals', label: 'Career Goals', description: 'Show your career objectives and target roles' },
                  { key: 'showEndorsements', label: 'Endorsements', description: 'Display skill endorsements and recommendations' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                    <Switch
                      checked={settings.profileVisibility[key as keyof typeof settings.profileVisibility] as boolean}
                      onCheckedChange={(checked: boolean) => handleToggle('profileVisibility', key, checked)}
                      disabled={!settings.profileVisibility.isPublic}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Data Sharing Preferences</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Usage</CardTitle>
              <CardDescription>Control how your data is used to improve the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'allowAnalytics', label: 'Usage Analytics', description: 'Help improve the platform by sharing anonymous usage data' },
                { key: 'allowMarketingEmails', label: 'Marketing Communications', description: 'Receive promotional emails and product updates' },
                { key: 'allowThirdPartyIntegrations', label: 'Third-party Integrations', description: 'Allow data sharing with connected services and tools' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing[key as keyof typeof settings.dataSharing] as boolean}
                    onCheckedChange={(checked) => handleToggle('dataSharing', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Learning & Career</CardTitle>
              <CardDescription>Control sharing with educational and employment partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'allowSkillVerification', label: 'Skill Verification', description: 'Allow instructors and employers to verify your skills' },
                { key: 'shareProgressWithInstructors', label: 'Progress Sharing', description: 'Share learning progress with course instructors' },
                { key: 'shareWithEmployers', label: 'Employer Access', description: 'Allow potential employers to view your verified skills' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing[key as keyof typeof settings.dataSharing] as boolean}
                    onCheckedChange={(checked) => handleToggle('dataSharing', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'communications' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Communication Preferences</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Channels</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email', icon: Mail },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser and mobile push notifications', icon: Bell },
                { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive important alerts via text message', icon: Smartphone }
              ].map(({ key, label, description, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.communications[key as keyof typeof settings.communications] as boolean}
                    onCheckedChange={(checked) => handleToggle('communications', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Types</CardTitle>
              <CardDescription>Choose what types of notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'weeklyProgress', label: 'Weekly Progress Report', description: 'Get a summary of your learning progress each week' },
                { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'Notifications when you earn badges or complete goals' },
                { key: 'endorsementRequests', label: 'Endorsement Requests', description: 'When someone requests to endorse your skills' },
                { key: 'jobRecommendations', label: 'Job Recommendations', description: 'Relevant job opportunities based on your skills' },
                { key: 'learningReminders', label: 'Learning Reminders', description: 'Gentle reminders to continue your learning journey' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                  <Switch
                    checked={settings.communications[key as keyof typeof settings.communications] as boolean}
                    onCheckedChange={(checked) => handleToggle('communications', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Security</CardTitle>
              <CardDescription>Protect your account with additional security measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center space-x-2">
                  {settings.security.twoFactorEnabled && (
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  )}
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleToggle('security', 'twoFactorEnabled', checked)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Require Password for Sensitive Actions</p>
                  <p className="text-sm text-gray-600">Require password confirmation for important changes</p>
                </div>
                <Switch
                  checked={settings.security.requirePasswordForSensitiveActions}
                  onCheckedChange={(checked) => handleToggle('security', 'requirePasswordForSensitiveActions', checked)}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Password Change</p>
                    <p className="text-sm text-gray-900">
                      {new Date(settings.security.lastPasswordChange).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Active Devices</p>
                    <p className="text-sm text-gray-900">{settings.security.activeDevices} devices</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>Change Password</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Manage Devices</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Login Security</CardTitle>
              <CardDescription>Control where and how you can access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Allowed Login Locations</p>
                  <div className="flex flex-wrap gap-2">
                    {settings.security.allowedLoginLocations.map((location) => (
                      <Badge key={location} variant="outline">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage Login Locations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'rights' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Data Rights & Control</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Access & Export</CardTitle>
              <CardDescription>Access and download your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Data Export</p>
                  <p className="text-sm text-gray-600">
                    Last export: {settings.dataRights.lastDataExport 
                      ? new Date(settings.dataRights.lastDataExport).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Data Retention</p>
                  <p className="text-sm text-gray-600">
                    Your data is retained for {settings.dataRights.dataRetentionPeriod} months after account deletion
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Update Retention
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-base text-red-900 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Account Deletion</span>
              </CardTitle>
              <CardDescription>Permanently delete your account and all associated data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  ⚠️ This action cannot be undone. All your profile data, learning history, and achievements will be permanently deleted.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-600">
                    {settings.dataRights.allowDataDeletion 
                      ? 'You can request account deletion at any time' 
                      : 'Account deletion is currently restricted'}
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex items-center space-x-2"
                  disabled={!settings.dataRights.allowDataDeletion}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 