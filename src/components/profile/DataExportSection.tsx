'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Database, 
  Webhook,
  Key,
  Shield,
  FileText,
  FileJson,
  FileBarChart,
  Link,
  Globe,
  Settings,
  Check,
  X,
  AlertCircle,
  Clock,
  User,
  Building,
  Zap,
  History,
  Lock,
  Unlock,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

// Define interfaces locally to avoid import issues
interface DataExport {
  id: string;
  userId: string;
  format: 'json' | 'pdf' | 'csv';
  sections: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: string;
  expiresAt: string;
  fileSize?: number;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  lastTriggered?: string;
  successRate: number;
  description: string;
}

interface APIIntegration {
  id: string;
  name: string;
  type: 'learning_platform' | 'hr_system' | 'identity_provider' | 'analytics' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  apiKey: string;
  endpointUrl: string;
  lastSync?: string;
  syncStatus: 'success' | 'failed' | 'partial';
  permissions: string[];
  description: string;
}

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth2' | 'openid_connect';
  status: 'active' | 'inactive' | 'error';
  entityId?: string;
  metadataUrl?: string;
  clientId?: string;
  issuerUrl?: string;
  lastUsed?: string;
  userCount: number;
}

interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  section: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed';
}

interface DataExportSectionProps {
  profile: any;
  skills: any[];
  hasUnsavedChanges: boolean;
}

// Mock data for Data Export & Integration
const mockDataExports: DataExport[] = [
  {
    id: 'export-1',
    userId: 'user-1',
    format: 'json',
    sections: ['profile', 'skills', 'career_preferences'],
    status: 'completed',
    downloadUrl: '/downloads/profile-export-2024-12-18.json',
    createdAt: '2024-12-18T10:30:00Z',
    expiresAt: '2024-12-25T10:30:00Z',
    fileSize: 2048
  },
  {
    id: 'export-2',
    userId: 'user-1',
    format: 'pdf',
    sections: ['profile', 'skills'],
    status: 'processing',
    createdAt: '2024-12-18T11:15:00Z',
    expiresAt: '2024-12-25T11:15:00Z'
  }
];

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: 'webhook-1',
    url: 'https://api.company.com/webhooks/profile-updates',
    events: ['profile.updated', 'skills.added', 'skills.verified'],
    isActive: true,
    secret: 'whsec_...',
    lastTriggered: '2024-12-18T09:45:00Z',
    successRate: 98.5,
    description: 'HR System Integration'
  },
  {
    id: 'webhook-2',
    url: 'https://learning.platform.com/api/user-sync',
    events: ['learning.completed', 'certification.earned'],
    isActive: false,
    secret: 'whsec_...',
    lastTriggered: '2024-12-15T14:20:00Z',
    successRate: 94.2,
    description: 'Learning Platform Sync'
  }
];

const mockAPIIntegrations: APIIntegration[] = [
  {
    id: 'api-1',
    name: 'Coursera for Business',
    type: 'learning_platform',
    status: 'connected',
    apiKey: 'ck_...',
    endpointUrl: 'https://api.coursera.org/v1',
    lastSync: '2024-12-18T08:00:00Z',
    syncStatus: 'success',
    permissions: ['read:courses', 'read:completions', 'write:enrollments'],
    description: 'Sync course completions and certificates'
  },
  {
    id: 'api-2',
    name: 'Workday HCM',
    type: 'hr_system',
    status: 'error',
    apiKey: 'wd_...',
    endpointUrl: 'https://company.workday.com/api',
    lastSync: '2024-12-17T16:30:00Z',
    syncStatus: 'failed',
    permissions: ['read:employee', 'write:skills', 'read:training'],
    description: 'Employee data and skills synchronization'
  }
];

const mockSSOProviders: SSOProvider[] = [
  {
    id: 'sso-1',
    name: 'Company Azure AD',
    type: 'openid_connect',
    status: 'active',
    clientId: 'abc123...',
    issuerUrl: 'https://login.microsoftonline.com/tenant-id',
    lastUsed: '2024-12-18T11:30:00Z',
    userCount: 1247
  },
  {
    id: 'sso-2',
    name: 'SAML Identity Provider',
    type: 'saml',
    status: 'inactive',
    entityId: 'https://company.com/saml',
    metadataUrl: 'https://idp.company.com/metadata.xml',
    lastUsed: '2024-12-10T09:15:00Z',
    userCount: 89
  }
];

const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-1',
    userId: 'user-1',
    action: 'profile.updated',
    section: 'personal_info',
    details: 'Updated location from "San Francisco" to "Austin"',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: '2024-12-18T11:45:00Z',
    status: 'success'
  },
  {
    id: 'audit-2',
    userId: 'user-1',
    action: 'skills.added',
    section: 'skills_inventory',
    details: 'Added skill "React Native" with confidence level 3',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: '2024-12-18T11:30:00Z',
    status: 'success'
  },
  {
    id: 'audit-3',
    userId: 'user-1',
    action: 'export.requested',
    section: 'data_export',
    details: 'Requested PDF export of profile and skills data',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: '2024-12-18T11:15:00Z',
    status: 'success'
  }
];

export default function DataExportSection({
  profile,
  skills,
  hasUnsavedChanges
}: DataExportSectionProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'api' | 'webhooks' | 'sso' | 'audit'>('export');
  const [dataExports, setDataExports] = useState(mockDataExports);
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [apiIntegrations, setAPIIntegrations] = useState(mockAPIIntegrations);
  const [ssoProviders, setSSOProviders] = useState(mockSSOProviders);
  const [auditLog, setAuditLog] = useState(mockAuditLog);
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});

  const handleExportRequest = (format: 'json' | 'pdf' | 'csv', sections: string[]) => {
    const newExport: DataExport = {
      id: `export-${Date.now()}`,
      userId: profile.id,
      format,
      sections,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    setDataExports(prev => [newExport, ...prev]);
  };

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, isActive: !webhook.isActive }
        : webhook
    ));
  };

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
      case 'connected':
      case 'active':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'failed':
      case 'error':
        return <X className="w-4 h-4 text-red-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'inactive':
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
      case 'connected':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Export & Integration</h2>
          <p className="text-gray-600">Manage data exports, API integrations, and system connections</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Integration Settings</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: 'export', label: 'Data Export', icon: Download },
            { id: 'api', label: 'API Integrations', icon: Database },
            { id: 'webhooks', label: 'Webhooks', icon: Webhook },
            { id: 'sso', label: 'SSO / Identity', icon: Key },
            { id: 'audit', label: 'Audit Log', icon: History }
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
      {activeTab === 'export' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Data Export</h3>
          
          {/* Export Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request New Export</CardTitle>
              <CardDescription>Export your profile data in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Export Format</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { format: 'json', label: 'JSON', icon: FileJson, description: 'Machine-readable format' },
                    { format: 'pdf', label: 'PDF', icon: FileText, description: 'Printable document' },
                    { format: 'csv', label: 'CSV', icon: FileBarChart, description: 'Spreadsheet format' }
                  ].map(({ format, label, icon: Icon, description }) => (
                    <button
                      key={format}
                      onClick={() => handleExportRequest(format as any, ['profile', 'skills', 'career_preferences', 'learning_history'])}
                      className="p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 flex flex-col items-center space-y-2"
                    >
                      <Icon className="w-8 h-8 text-gray-600" />
                      <span className="font-medium">{label}</span>
                      <span className="text-xs text-gray-500 text-center">{description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Data Sections</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Personal Information',
                    'Skills Inventory',
                    'Career Preferences',
                    'Learning History',
                    'Privacy Settings',
                    'Activity Log'
                  ].map((section) => (
                    <label key={section} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      <span className="text-sm text-gray-700">{section}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export History</CardTitle>
              <CardDescription>Your recent data export requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataExports.map((exportItem) => (
                  <div key={exportItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(exportItem.status)}
                      <div>
                        <p className="font-medium text-gray-900">
                          {exportItem.format.toUpperCase()} Export
                        </p>
                        <p className="text-sm text-gray-600">
                          {exportItem.sections.join(', ')} • {formatDate(exportItem.createdAt)}
                        </p>
                        {exportItem.fileSize && (
                          <p className="text-xs text-gray-500">
                            File size: {formatFileSize(exportItem.fileSize)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(exportItem.status)}>
                        {exportItem.status}
                      </Badge>
                      {exportItem.downloadUrl && exportItem.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">API Integrations</h3>
            <Button className="flex items-center space-x-2">
              <Link className="w-4 h-4" />
              <span>Add Integration</span>
            </Button>
          </div>
          
          <div className="grid gap-6">
            {apiIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Database className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{integration.name}</h4>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium capitalize">{integration.type.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Sync</p>
                            <p className="font-medium">{formatDate(integration.lastSync)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Sync Status</p>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(integration.syncStatus)}
                              <span className="font-medium capitalize">{integration.syncStatus}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">Permissions</p>
                            <p className="font-medium">{integration.permissions.length} granted</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-gray-500 text-sm mb-2">API Key</p>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type={showSecrets[integration.id] ? 'text' : 'password'}
                              value={integration.apiKey}
                              readOnly
                              className="text-sm font-mono"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleSecret(integration.id)}
                            >
                              {showSecrets[integration.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync Now
                      </Button>
                      {integration.status === 'connected' && (
                        <Button variant="outline" size="sm">
                          <X className="w-4 h-4 mr-1" />
                          Disconnect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Webhook Endpoints</h3>
            <Button className="flex items-center space-x-2">
              <Webhook className="w-4 h-4" />
              <span>Add Webhook</span>
            </Button>
          </div>
          
          <div className="grid gap-6">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{webhook.description}</h4>
                        <Badge className={webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Endpoint URL</p>
                          <p className="text-sm font-mono bg-gray-50 p-2 rounded">{webhook.url}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Events</p>
                            <div className="flex flex-wrap gap-1">
                              {webhook.events.map((event) => (
                                <Badge key={event} variant="outline" className="text-xs">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Success Rate</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={webhook.successRate} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{webhook.successRate}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Last Triggered</p>
                            <p className="font-medium">{formatDate(webhook.lastTriggered)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Webhook Secret</p>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs">
                                {showSecrets[webhook.id] ? webhook.secret : '••••••••••••'}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleSecret(webhook.id)}
                                className="h-6 w-6 p-0"
                              >
                                {showSecrets[webhook.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleWebhook(webhook.id)}
                      >
                        {webhook.isActive ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                        {webhook.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sso' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Single Sign-On Providers</h3>
            <Button className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>Add SSO Provider</span>
            </Button>
          </div>
          
          <div className="grid gap-6">
            {ssoProviders.map((provider) => (
              <Card key={provider.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Key className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                          <Badge className={getStatusColor(provider.status)}>
                            {provider.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {provider.type.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Active Users</p>
                            <p className="font-medium">{provider.userCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Used</p>
                            <p className="font-medium">{formatDate(provider.lastUsed)}</p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {provider.clientId && (
                            <div>
                              <p className="text-gray-500 text-sm mb-1">Client ID</p>
                              <p className="text-sm font-mono bg-gray-50 p-2 rounded">{provider.clientId}</p>
                            </div>
                          )}
                          {provider.issuerUrl && (
                            <div>
                              <p className="text-gray-500 text-sm mb-1">Issuer URL</p>
                              <p className="text-sm font-mono bg-gray-50 p-2 rounded">{provider.issuerUrl}</p>
                            </div>
                          )}
                          {provider.entityId && (
                            <div>
                              <p className="text-gray-500 text-sm mb-1">Entity ID</p>
                              <p className="text-sm font-mono bg-gray-50 p-2 rounded">{provider.entityId}</p>
                            </div>
                          )}
                          {provider.metadataUrl && (
                            <div>
                              <p className="text-gray-500 text-sm mb-1">Metadata URL</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-mono bg-gray-50 p-2 rounded flex-1">{provider.metadataUrl}</p>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-1" />
                        Test Connection
                      </Button>
                      {provider.status === 'active' && (
                        <Button variant="outline" size="sm">
                          <X className="w-4 h-4 mr-1" />
                          Disable
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
            <div className="flex items-center space-x-2">
              <Input 
                type="search" 
                placeholder="Search audit log..." 
                className="w-64"
              />
              <Button variant="outline">
                <Download className="w-4 h-4 mr-1" />
                Export Log
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Section</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">IP Address</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">
                          {formatDate(entry.timestamp)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {entry.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600 capitalize">
                          {entry.section.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                          {entry.details}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">
                          {entry.ipAddress}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusIcon(entry.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Showing {auditLog.length} of 150 entries</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <span>Page 1 of 5</span>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 