'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Mail, 
  Database, 
  Globe, 
  Bell, 
  Users, 
  Lock,
  AlertCircle,
  CheckCircle,
  Key,
  Server,
  Palette,
  FileText,
  Clock
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    defaultUserRole: string;
  };
  security: {
    requireEmailVerification: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableTwoFactor: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    welcomeEmails: boolean;
    digestEmails: boolean;
    systemAlerts: boolean;
  };
  features: {
    enableCourses: boolean;
    enableCareerCenter: boolean;
    enableGuideAccess: boolean;
    enableContentCreation: boolean;
    enableAnalytics: boolean;
  };
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jasminedragon/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch('/api/jasminedragon/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category: keyof SystemSettings, key: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'features', label: 'Features', icon: Users }
  ];

  const SettingCard = ({ title, description, children }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label }: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchSettings}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure your platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-4">
          {saveSuccess && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Settings saved successfully</span>
            </div>
          )}
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && settings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingCard 
            title="Site Information"
            description="Basic information about your platform"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </SettingCard>

          <SettingCard 
            title="User Management"
            description="Control user registration and default permissions"
          >
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.general.allowRegistration}
                onChange={(value) => updateSetting('general', 'allowRegistration', value)}
                label="Allow new user registration"
              />
              <ToggleSwitch
                enabled={settings.general.maintenanceMode}
                onChange={(value) => updateSetting('general', 'maintenanceMode', value)}
                label="Maintenance mode"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                <select
                  value={settings.general.defaultUserRole}
                  onChange={(e) => updateSetting('general', 'defaultUserRole', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="learner">Learner</option>
                  <option value="guide">Guide</option>
                  <option value="content_creator">Content Creator</option>
                </select>
              </div>
            </div>
          </SettingCard>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && settings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingCard 
            title="Authentication"
            description="Configure authentication and security policies"
          >
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.security.requireEmailVerification}
                onChange={(value) => updateSetting('security', 'requireEmailVerification', value)}
                label="Require email verification"
              />
              <ToggleSwitch
                enabled={settings.security.enableTwoFactor}
                onChange={(value) => updateSetting('security', 'enableTwoFactor', value)}
                label="Enable two-factor authentication"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min="6"
                  max="50"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </SettingCard>

          <SettingCard 
            title="Session Management"
            description="Configure user session settings"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="1440"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </SettingCard>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && settings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingCard 
            title="Email Notifications"
            description="Configure email notification settings"
          >
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.notifications.emailNotifications}
                onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
                label="Enable email notifications"
              />
              <ToggleSwitch
                enabled={settings.notifications.welcomeEmails}
                onChange={(value) => updateSetting('notifications', 'welcomeEmails', value)}
                label="Send welcome emails to new users"
              />
              <ToggleSwitch
                enabled={settings.notifications.digestEmails}
                onChange={(value) => updateSetting('notifications', 'digestEmails', value)}
                label="Send weekly digest emails"
              />
              <ToggleSwitch
                enabled={settings.notifications.systemAlerts}
                onChange={(value) => updateSetting('notifications', 'systemAlerts', value)}
                label="System alert notifications"
              />
            </div>
          </SettingCard>
        </div>
      )}

      {/* Feature Settings */}
      {activeTab === 'features' && settings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingCard 
            title="Platform Features"
            description="Enable or disable platform features"
          >
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.features.enableCourses}
                onChange={(value) => updateSetting('features', 'enableCourses', value)}
                label="Enable courses and learning content"
              />
              <ToggleSwitch
                enabled={settings.features.enableCareerCenter}
                onChange={(value) => updateSetting('features', 'enableCareerCenter', value)}
                label="Enable career center"
              />
              <ToggleSwitch
                enabled={settings.features.enableGuideAccess}
                onChange={(value) => updateSetting('features', 'enableGuideAccess', value)}
                label="Enable guide access features"
              />
              <ToggleSwitch
                enabled={settings.features.enableContentCreation}
                onChange={(value) => updateSetting('features', 'enableContentCreation', value)}
                label="Enable content creation tools"
              />
              <ToggleSwitch
                enabled={settings.features.enableAnalytics}
                onChange={(value) => updateSetting('features', 'enableAnalytics', value)}
                label="Enable analytics dashboard"
              />
            </div>
          </SettingCard>
        </div>
      )}
    </div>
  );
};

export default AdminSettings; 