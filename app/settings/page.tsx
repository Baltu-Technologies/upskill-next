'use client';

import React, { useState } from 'react';
import { 
  Shield,
  Bell,
  Eye,
  Link2,
  Accessibility,
  User,
  Lock,
  Settings as SettingsIcon,
  Globe,
  Monitor,
  Volume2,
  Download,
  Trash2,
  History,
  Key,
  Mail,
  Phone,
  Clock,
  Palette,
  BookOpen,
  BarChart3,
  Users,
  ChevronRight,
  Save,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account & Security',
    icon: Shield,
    description: 'Manage your personal information, password, and security settings'
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: SettingsIcon,
    description: 'Customize notifications, display, and learning preferences'
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: Eye,
    description: 'Control your profile visibility and data sharing preferences'
  },
  {
    id: 'connected',
    title: 'Connected Services',
    icon: Link2,
    description: 'Manage integrations with LinkedIn and other platforms'
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    icon: Accessibility,
    description: 'Adjust font size, contrast, and screen reader preferences'
  }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Peter',
    lastName: 'Costa',
    email: 'peter.costa@email.com',
    phone: '+1 (555) 123-4567'
  });

  const [notifications, setNotifications] = useState({
    emailCourses: true,
    emailJobMatches: true,
    emailPathways: false,
    pushNotifications: true,
    weeklySummary: true
  });

  const [displayPrefs, setDisplayPrefs] = useState({
    language: 'English',
    timezone: 'America/New_York',
    theme: 'dark'
  });

  const [learningPrefs, setLearningPrefs] = useState({
    preferredTimes: ['Morning', 'Evening'],
    difficultyLevel: 'Intermediate',
    autoPlayVideos: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'Public',
    employerVisibility: 'Full Profile',
    analyticsOptIn: true,
    employerMatching: true
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'Medium',
    highContrast: false,
    screenReader: false
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully!');
  };

  const renderAccountSection = () => (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
              className="mt-1 bg-[#1e1e1e] border-[#3a8fb7]/30 text-white focus:border-[#3a8fb7]"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
              className="mt-1 bg-[#1e1e1e] border-[#3a8fb7]/30 text-white focus:border-[#3a8fb7]"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
              className="mt-1 bg-[#1e1e1e] border-[#3a8fb7]/30 text-white focus:border-[#3a8fb7]"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-300">Phone</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
              className="mt-1 bg-[#1e1e1e] border-[#3a8fb7]/30 text-white focus:border-[#3a8fb7]"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-between bg-[#1e1e1e] border-[#3a8fb7]/30 text-white hover:bg-[#3a8fb7]/10"
          >
            <span>Change Password</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-gray-400 text-sm">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-between bg-[#1e1e1e] border-[#3a8fb7]/30 text-white hover:bg-[#3a8fb7]/10"
          >
            <span>View Login History</span>
            <History className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Account Management</h3>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-between bg-[#1e1e1e] border-[#3a8fb7]/30 text-white hover:bg-[#3a8fb7]/10"
          >
            <span>Export My Data</span>
            <Download className="w-4 h-4" />
          </Button>
          
          <div className="p-4 bg-[#1e1e1e] rounded-lg border border-red-500/30">
            <p className="text-white font-medium mb-2">Delete Account</p>
            <p className="text-gray-400 text-sm mb-4">This action cannot be undone</p>
            <Button 
              variant="destructive" 
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">New Courses</p>
              <p className="text-gray-400 text-sm">Get notified about new course releases</p>
            </div>
            <Switch 
              checked={notifications.emailCourses}
              onCheckedChange={(checked) => setNotifications({...notifications, emailCourses: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Job Matches</p>
              <p className="text-gray-400 text-sm">Receive notifications for new job opportunities</p>
            </div>
            <Switch 
              checked={notifications.emailJobMatches}
              onCheckedChange={(checked) => setNotifications({...notifications, emailJobMatches: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Pathway Updates</p>
              <p className="text-gray-400 text-sm">Updates on your learning pathway progress</p>
            </div>
            <Switch 
              checked={notifications.emailPathways}
              onCheckedChange={(checked) => setNotifications({...notifications, emailPathways: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-gray-400 text-sm">Receive push notifications on your device</p>
            </div>
            <Switch 
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Weekly Summary</p>
              <p className="text-gray-400 text-sm">Weekly progress and activity summary</p>
            </div>
            <Switch 
              checked={notifications.weeklySummary}
              onCheckedChange={(checked) => setNotifications({...notifications, weeklySummary: checked})}
            />
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Monitor className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Display Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Language</Label>
            <select 
              value={displayPrefs.language}
              onChange={(e) => setDisplayPrefs({...displayPrefs, language: e.target.value})}
              className="mt-1 w-full bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-md px-3 py-2 focus:border-[#3a8fb7]"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          
          <div>
            <Label className="text-gray-300">Time Zone</Label>
            <select 
              value={displayPrefs.timezone}
              onChange={(e) => setDisplayPrefs({...displayPrefs, timezone: e.target.value})}
              className="mt-1 w-full bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-md px-3 py-2 focus:border-[#3a8fb7]"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Learning Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Course Difficulty Level</Label>
            <select 
              value={learningPrefs.difficultyLevel}
              onChange={(e) => setLearningPrefs({...learningPrefs, difficultyLevel: e.target.value})}
              className="mt-1 w-full bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-md px-3 py-2 focus:border-[#3a8fb7]"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Auto-play Videos</p>
              <p className="text-gray-400 text-sm">Automatically play next video in sequence</p>
            </div>
            <Switch 
              checked={learningPrefs.autoPlayVideos}
              onCheckedChange={(checked) => setLearningPrefs({...learningPrefs, autoPlayVideos: checked})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-8">
      {/* Profile Visibility */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Profile Visibility</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Who can see your profile</Label>
            <select 
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
              className="mt-1 w-full bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-md px-3 py-2 focus:border-[#3a8fb7]"
            >
              <option value="Public">Public</option>
              <option value="Employers Only">Employers Only</option>
              <option value="Private">Private</option>
            </select>
          </div>
          
          <div>
            <Label className="text-gray-300">What employers can see</Label>
            <select 
              value={privacySettings.employerVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, employerVisibility: e.target.value})}
              className="mt-1 w-full bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-md px-3 py-2 focus:border-[#3a8fb7]"
            >
              <option value="Full Profile">Full Profile</option>
              <option value="Basic Info Only">Basic Info Only</option>
              <option value="Skills Only">Skills Only</option>
              <option value="Nothing">Nothing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Sharing */}
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Data Sharing</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Analytics Opt-in</p>
              <p className="text-gray-400 text-sm">Help improve our platform with usage analytics</p>
            </div>
            <Switch 
              checked={privacySettings.analyticsOptIn}
              onCheckedChange={(checked) => setPrivacySettings({...privacySettings, analyticsOptIn: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Employer Matching</p>
              <p className="text-gray-400 text-sm">Allow employers to find and contact you</p>
            </div>
            <Switch 
              checked={privacySettings.employerMatching}
              onCheckedChange={(checked) => setPrivacySettings({...privacySettings, employerMatching: checked})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnectedSection = () => (
    <div className="space-y-8">
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link2 className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Connected Services</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <div>
                <p className="text-white font-medium">LinkedIn</p>
                <p className="text-gray-400 text-sm">Not connected</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-[#3a8fb7] border-[#3a8fb7] text-white hover:bg-[#3a8fb7]/80"
            >
              Connect
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div>
                <p className="text-white font-medium">Google</p>
                <p className="text-gray-400 text-sm">Not connected</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-[#3a8fb7] border-[#3a8fb7] text-white hover:bg-[#3a8fb7]/80"
            >
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySection = () => (
    <div className="space-y-8">
      <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Accessibility className="w-5 h-5 text-[#3a8fb7]" />
          <h3 className="text-lg font-semibold text-white">Accessibility Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Font Size</Label>
            <select 
              value={accessibilitySettings.fontSize}
              onChange={(e) => setAccessibilitySettings({...accessibilitySettings, fontSize: e.target.value})}
              className="mt-1 w-full bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-md px-3 py-2 focus:border-[#3a8fb7]"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">High Contrast Mode</p>
              <p className="text-gray-400 text-sm">Increase contrast for better visibility</p>
            </div>
            <Switch 
              checked={accessibilitySettings.highContrast}
              onCheckedChange={(checked) => setAccessibilitySettings({...accessibilitySettings, highContrast: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3a8fb7]/30">
            <div>
              <p className="text-white font-medium">Screen Reader Support</p>
              <p className="text-gray-400 text-sm">Optimize for screen reader compatibility</p>
            </div>
            <Switch 
              checked={accessibilitySettings.screenReader}
              onCheckedChange={(checked) => setAccessibilitySettings({...accessibilitySettings, screenReader: checked})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSection();
      case 'preferences':
        return renderPreferencesSection();
      case 'privacy':
        return renderPrivacySection();
      case 'connected':
        return renderConnectedSection();
      case 'accessibility':
        return renderAccessibilitySection();
      default:
        return renderAccountSection();
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#262626] border border-[#3a8fb7]/30 rounded-lg p-4">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white'
                          : 'text-gray-400 hover:text-white hover:bg-[#3a8fb7]/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {renderContent()}
              
              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-[#3a8fb7]/30">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white hover:from-[#3a8fb7]/80 hover:to-[#6c3e9e]/80 px-8"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 