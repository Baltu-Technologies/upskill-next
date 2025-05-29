'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Brain, 
  Route, 
  FolderOpen, 
  Award, 
  Target,
  Edit3,
  Save,
  Plus,
  ExternalLink,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Settings,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Star,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  mockCompleteProfile, 
  mockProfileCompletionStatus,
  getCoreProfileProgress,
  getRequiredCoreFields 
} from '@/data/mockProfileData';
import { 
  CompleteProfile, 
  CoreCandidate, 
  ProfileCompletionStatus 
} from '@/types/profile';

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'skills', label: 'Skills Profile', icon: Brain },
  { id: 'pathways', label: 'My Pathways', icon: Route },
  { id: 'projects', label: 'Project Showcase', icon: FolderOpen, badge: '3' },
  { id: 'certifications', label: 'Certifications', icon: Award, badge: '8' },
  { id: 'stats', label: 'My Stats and Goals', icon: Target },
];

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<CompleteProfile>(mockCompleteProfile);
  const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus>(mockProfileCompletionStatus);

  // Get tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.find(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'profile') {
      router.push('/profile');
    } else {
      router.push(`/profile?tab=${tabId}`);
    }
  };

  // Calculate real-time progress
  useEffect(() => {
    const coreProgress = getCoreProfileProgress(profileData);
    const missingCoreFields = getRequiredCoreFields(profileData);
    
    setCompletionStatus(prev => ({
      ...prev,
      coreProgress,
      missingCoreFields,
      overallProgress: Math.round((coreProgress * 0.7) + (prev.optionalProgress * 0.3))
    }));
  }, [profileData]);

  const renderProfileContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <CoreProfileTab 
            isEditing={isEditing} 
            setIsEditing={setIsEditing}
            profileData={profileData}
            setProfileData={setProfileData}
            completionStatus={completionStatus}
          />
        );
      case 'skills':
        return <SkillsProfileTab profileData={profileData} />;
      case 'pathways':
        return <PathwaysTab />;
      case 'projects':
        return <ProjectsTab profileData={profileData} />;
      case 'certifications':
        return <CertificationsTab profileData={profileData} />;
      case 'stats':
        return <StatsGoalsTab profileData={profileData} />;
      default:
        return (
          <CoreProfileTab 
            isEditing={isEditing} 
            setIsEditing={setIsEditing}
            profileData={profileData}
            setProfileData={setProfileData}
            completionStatus={completionStatus}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(142,71%,45%)] p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <User className="h-8 w-8 text-[hsl(217,91%,60%)]" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Career Profile</h1>
              <p className="text-slate-600 dark:text-slate-300">Build your employer-ready professional dossier</p>
            </div>
          </div>

          {/* Profile Completion Progress */}
          <Card className="border-l-4 border-l-[hsl(217,91%,60%)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Profile Completion</CardTitle>
                <Badge 
                  variant={completionStatus.coreComplete ? "default" : "secondary"}
                  className={cn(
                    "font-semibold",
                    completionStatus.coreComplete 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  )}
                >
                  {completionStatus.overallProgress}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Core Profile Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {completionStatus.coreComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="font-medium">Core Profile (Shared with Employers)</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    {completionStatus.coreProgress}%
                  </span>
                </div>
                <Progress value={completionStatus.coreProgress} className="h-2" />
                {completionStatus.missingCoreFields.length > 0 && (
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Missing: {completionStatus.missingCoreFields.join(', ')}
                  </p>
                )}
              </div>

              {/* Optional Profile Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Optional Sections</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {completionStatus.optionalProgress}%
                  </span>
                </div>
                <Progress value={completionStatus.optionalProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-100 dark:bg-gray-800 rounded-lg">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative",
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-[hsl(217,91%,60%)] shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 h-5 px-1.5 text-xs bg-[hsl(217,91%,60%)] text-white"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderProfileContent()}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}

// Core Profile Tab Component
function CoreProfileTab({ isEditing, setIsEditing, profileData, setProfileData, completionStatus }: { isEditing: boolean; setIsEditing: (editing: boolean) => void; profileData: CompleteProfile; setProfileData: (data: CompleteProfile) => void; completionStatus: ProfileCompletionStatus }) {
  const candidate = profileData.candidate;
  
  // Helper function to get full name
  const getFullName = () => `${candidate.firstName} ${candidate.lastName}`;
  
  // Helper function to get location
  const getLocation = () => `${candidate.city}, ${candidate.state}`;
  
  // Temporary data for properties not yet in the core structure
  const tempData = {
    joinDate: 'January 2022',
    lastActive: '2 hours ago'
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)] text-white"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Separator />

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              {isEditing ? (
                <Input defaultValue={getFullName()} />
              ) : (
                <p className="text-slate-900 dark:text-white font-medium">{getFullName()}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Professional Title</label>
              {isEditing ? (
                <Input defaultValue={candidate.headline || ''} />
              ) : (
                <p className="text-slate-900 dark:text-white">{candidate.headline || 'Add your professional title'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
              {isEditing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input defaultValue={getLocation()} className="pl-10" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {getLocation()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              {isEditing ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input defaultValue={candidate.email} className="pl-10" type="email" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {candidate.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input defaultValue={candidate.phone || ''} className="pl-10" type="tel" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {candidate.phone || 'Add phone number'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website</label>
              {isEditing ? (
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input defaultValue={candidate.portfolioUrl || ''} className="pl-10" type="url" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Globe className="h-4 w-4 text-slate-400" />
                  {candidate.portfolioUrl ? (
                    <a href={candidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(217,91%,60%)] hover:underline">
                      {candidate.portfolioUrl.replace('https://', '')}
                    </a>
                  ) : (
                    'Add website URL'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Professional Bio */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Professional Bio</h3>
        {isEditing ? (
          <Textarea 
            defaultValue={candidate.headline || ''} 
            rows={4}
            placeholder="Tell us about your professional background and interests..."
          />
        ) : (
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {candidate.headline || 'Add your professional bio to tell employers about your background and interests.'}
          </p>
        )}
      </div>

      <Separator />

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Social Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub</label>
            {isEditing ? (
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input defaultValue={candidate.githubUrl?.replace('https://github.com/', '') || ''} className="pl-10" placeholder="username" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Github className="h-4 w-4 text-slate-400" />
                {candidate.githubUrl ? (
                  <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(217,91%,60%)] hover:underline">
                    @{candidate.githubUrl.replace('https://github.com/', '')}
                  </a>
                ) : (
                  'Add GitHub profile'
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn</label>
            {isEditing ? (
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input defaultValue={candidate.linkedinUrl?.replace('https://linkedin.com/in/', '') || ''} className="pl-10" placeholder="username" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Linkedin className="h-4 w-4 text-slate-400" />
                {candidate.linkedinUrl ? (
                  <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(217,91%,60%)] hover:underline">
                    in/{candidate.linkedinUrl.replace('https://linkedin.com/in/', '')}
                  </a>
                ) : (
                  'Add LinkedIn profile'
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Account Information */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Joined: {tempData.joinDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Last active: {tempData.lastActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other tabs
function SkillsProfileTab({ profileData }: { profileData: CompleteProfile }) {
  return (
    <div className="text-center py-12">
      <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Skills Profile</h3>
      <p className="text-slate-600 dark:text-slate-400">Skills management coming soon...</p>
    </div>
  );
}

function PathwaysTab() {
  return (
    <div className="text-center py-12">
      <Route className="h-16 w-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">My Pathways</h3>
      <p className="text-slate-600 dark:text-slate-400">Learning pathways coming soon...</p>
    </div>
  );
}

function ProjectsTab({ profileData }: { profileData: CompleteProfile }) {
  return (
    <div className="text-center py-12">
      <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Project Showcase</h3>
      <p className="text-slate-600 dark:text-slate-400">Project showcase coming soon...</p>
    </div>
  );
}

function CertificationsTab({ profileData }: { profileData: CompleteProfile }) {
  return (
    <div className="text-center py-12">
      <Award className="h-16 w-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Certifications</h3>
      <p className="text-slate-600 dark:text-slate-400">Certifications management coming soon...</p>
    </div>
  );
}

function StatsGoalsTab({ profileData }: { profileData: CompleteProfile }) {
  return (
    <div className="text-center py-12">
      <Target className="h-16 w-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">My Stats and Goals</h3>
      <p className="text-slate-600 dark:text-slate-400">Stats and goals tracking coming soon...</p>
    </div>
  );
} 