'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import React from 'react';
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
  Building2,
  GraduationCap,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowLeft,
  X,
  Info,
  Briefcase,
  Zap,
  BookOpen
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
import SkillsAssessment from '@/components/SkillsAssessment';
import { toast } from 'sonner';
import CoreProfileSection from '@/src/components/profile/CoreProfileSection';
import ProfilePortfolioProjects from '../components/ProfilePortfolioProjects';

const tabs = [
  { id: 'basic', label: 'Basic Information', icon: User },
  { id: 'professional', label: 'Professional Profile', icon: Briefcase },
  { id: 'education', label: 'Education & Credentials', icon: GraduationCap, badge: '8' },
  { id: 'portfolio', label: 'Portfolio & Projects', icon: FolderOpen, badge: '3' },
  { id: 'skills', label: 'Skills & Proficiency', icon: Brain },
  { id: 'pathways', label: 'Career Interests & Pathways', icon: Route },
];

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
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
    if (tabId === 'basic') {
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
      case 'basic':
        return <BasicInformationTab 
          isEditing={isEditing} 
          setIsEditing={setIsEditing}
          profileData={profileData}
          setProfileData={setProfileData}
        />;
      case 'professional':
        return <ProfessionalProfileTab profileData={profileData} />;
      case 'education':
        return <EducationCredentialsTab profileData={profileData} />;
      case 'skills':
        return <SkillsProficiencyTab profileData={profileData} />;
      case 'pathways':
        return <CareerInterestsPathwaysTab />;
      case 'portfolio':
        return <ProfilePortfolioProjects />;
      default:
        return <BasicInformationTab 
          isEditing={isEditing} 
          setIsEditing={setIsEditing}
          profileData={profileData}
          setProfileData={setProfileData}
        />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* User Header Banner */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-8 max-w-4xl">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
                <img 
                  src={`https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face`}
                  alt={`${profileData.candidate.firstName} ${profileData.candidate.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 pt-4">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
                  {profileData.candidate.firstName} {profileData.candidate.lastName}
                </h1>
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center gap-12 text-sm mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-orange-200 dark:border-orange-800">
                    <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-base">28 Day Streak</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Learning consistently</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-200 dark:border-green-800">
                    <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-base">12 Courses</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Completed</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-base">8 Badges</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Earned</div>
                  </div>
                </div>
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-8">
                {profileData.candidate.headline || `I'm a Product Designer based in ${profileData.candidate.city || 'Melbourne'}.`}
              </p>
            </div>
          </div>
        </div>
        {/* Navigation Tabs - Fortnite Inspired */}
        <div className="mb-8">
          <div className="bg-[#1e1e1e] rounded-lg border border-[#3a8fb7] p-1">
            <div className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold text-sm transition-all duration-200 relative",
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-t-lg"
                        : "text-gray-400 hover:text-[#3a8fb7]"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs font-bold">
                      {tab.label.split(' ')[0]}
                    </span>
                    {tab.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-1 h-5 px-1.5 text-xs bg-[#6c3e9e] text-white border-0"
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content - Fortnite Inspired */}
        <div className="bg-[#262626] rounded-lg p-6 animate-in fade-in duration-300">
          {renderProfileContent()}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
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

// Tab Components
function BasicInformationTab({ isEditing, setIsEditing, profileData, setProfileData }: { 
  isEditing: boolean; 
  setIsEditing: (editing: boolean) => void; 
  profileData: CompleteProfile; 
  setProfileData: (data: CompleteProfile) => void; 
}) {
  const [formData, setFormData] = React.useState({
    fullName: `${profileData.candidate.firstName} ${profileData.candidate.lastName}`,
    pronouns: '',
    avatarUrl: '',
    professionalTitle: profileData.candidate.headline || '',
    city: profileData.candidate.city || '',
    stateProvince: profileData.candidate.state || '',
    country: '',
    timeZone: '',
    contactEmail: profileData.candidate.email || '',
    contactPhone: profileData.candidate.phone || '',
    websiteUrl: profileData.candidate.portfolioUrl || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Update the profile data with form data
    const [firstName, ...lastNameParts] = formData.fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    setProfileData({
      ...profileData,
      candidate: {
        ...profileData.candidate,
        firstName,
        lastName,
        headline: formData.professionalTitle,
        city: formData.city,
        state: formData.stateProvince,
        email: formData.contactEmail,
        phone: formData.contactPhone,
        portfolioUrl: formData.websiteUrl
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit/Save Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Basic Information</h3>
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] hover:from-[#2d7a9e] hover:to-[#5a3485] text-white font-bold"
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

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[#3a8fb7] mb-4">Personal Details</h4>
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.fullName || 'Not specified'}
              </p>
            )}
          </div>

          {/* Pronouns */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Pronouns</label>
            {isEditing ? (
              <select
                value={formData.pronouns}
                onChange={(e) => handleInputChange('pronouns', e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-3"
              >
                <option value="">Select pronouns</option>
                <option value="he/him">he/him</option>
                <option value="she/her">she/her</option>
                <option value="they/them">they/them</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.pronouns || 'Not specified'}
              </p>
            )}
          </div>

          {/* Professional Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Professional Title <span className="text-red-400">*</span>
            </label>
            {isEditing ? (
              <Input
                value={formData.professionalTitle}
                onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="e.g. Senior Product Designer"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.professionalTitle || 'Not specified'}
              </p>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo URL</label>
            {isEditing ? (
              <Input
                value={formData.avatarUrl}
                onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="https://example.com/photo.jpg"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.avatarUrl || 'Not specified'}
              </p>
            )}
          </div>
        </div>

        {/* Location & Contact Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[#3a8fb7] mb-4">Location & Contact</h4>
          
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
            {isEditing ? (
              <Input
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="e.g. San Francisco"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.city || 'Not specified'}
              </p>
            )}
          </div>

          {/* State/Province */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
            {isEditing ? (
              <Input
                value={formData.stateProvince}
                onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="e.g. California"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.stateProvince || 'Not specified'}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
            {isEditing ? (
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="e.g. United States"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.country || 'Not specified'}
              </p>
            )}
          </div>

          {/* Time Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
            {isEditing ? (
              <Input
                value={formData.timeZone}
                onChange={(e) => handleInputChange('timeZone', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="e.g. UTC-07:00"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.timeZone || 'Not specified'}
              </p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Email <span className="text-red-400">*</span>
            </label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="your.email@example.com"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.contactEmail || 'Not specified'}
              </p>
            )}
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
            {isEditing ? (
              <Input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="(555) 123-4567"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.contactPhone || 'Not specified'}
              </p>
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
            {isEditing ? (
              <Input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                placeholder="https://yourwebsite.com"
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                {formData.websiteUrl || 'Not specified'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Required Fields Note */}
      <div className="mt-6 p-4 bg-[#1e1e1e] rounded border border-[#3a8fb7]">
        <p className="text-sm text-gray-300">
          <span className="text-red-400">*</span> Required fields
        </p>
      </div>
    </div>
  );
}

function ProfessionalProfileTab({ profileData }: { profileData: CompleteProfile }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    careerObjective: '',
    summaryBulletPoints: [''],
    keyAchievements: [{ title: '', detail: '' }],
    professionalExperience: [{
      id: '',
      companyName: '',
      companyWebsite: '',
      positionTitle: '',
      employmentType: '',
      location: {
        city: '',
        stateProvince: '',
        country: '',
        remote: false
      },
      startDate: '',
      endDate: '',
      isCurrent: false,
      summary: '',
      responsibilities: [''],
      accomplishments: [''],
      skillsUsed: [''],
      industry: '',
      teamSize: '',
      supervisor: {
        name: '',
        title: '',
        contactEmail: ''
      }
    }],
    earliestStartDate: '',
    relocationPreference: '',
    languagesSpoken: [{ language: '', proficiency: 'Basic' as const }],
    workAuthorization: '',
    workAuthorizationOther: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSummaryPoint = () => {
    if (formData.summaryBulletPoints.length < 5) {
      setFormData(prev => ({
        ...prev,
        summaryBulletPoints: [...prev.summaryBulletPoints, '']
      }));
    }
  };

  const removeSummaryPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      summaryBulletPoints: prev.summaryBulletPoints.filter((_, i) => i !== index)
    }));
  };

  const updateSummaryPoint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      summaryBulletPoints: prev.summaryBulletPoints.map((point, i) => 
        i === index ? value : point
      )
    }));
  };

  const addAchievement = () => {
    if (formData.keyAchievements.length < 5) {
      setFormData(prev => ({
        ...prev,
        keyAchievements: [...prev.keyAchievements, { title: '', detail: '' }]
      }));
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyAchievements: prev.keyAchievements.filter((_, i) => i !== index)
    }));
  };

  const updateAchievement = (index: number, field: 'title' | 'detail', value: string) => {
    setFormData(prev => ({
      ...prev,
      keyAchievements: prev.keyAchievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: [...prev.languagesSpoken, { language: '', proficiency: 'Basic' as const }]
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.filter((_, i) => i !== index)
    }));
  };

  const updateLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  // Professional Experience functions
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      professionalExperience: [...prev.professionalExperience, {
        id: '',
        companyName: '',
        companyWebsite: '',
        positionTitle: '',
        employmentType: '',
        location: {
          city: '',
          stateProvince: '',
          country: '',
          remote: false
        },
        startDate: '',
        endDate: '',
        isCurrent: false,
        summary: '',
        responsibilities: [''],
        accomplishments: [''],
        skillsUsed: [''],
        industry: '',
        teamSize: '',
        supervisor: {
          name: '',
          title: '',
          contactEmail: ''
        }
      }]
    }));
  };

  const removeExperience = (index: number) => {
    if (formData.professionalExperience.length > 1) {
      setFormData(prev => ({
        ...prev,
        professionalExperience: prev.professionalExperience.filter((_, i) => i !== index)
      }));
    }
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      professionalExperience: prev.professionalExperience.map((exp, i) => {
        if (i === index) {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (parent === 'location') {
              return {
                ...exp,
                location: {
                  ...exp.location,
                  [child]: value
                }
              };
            } else if (parent === 'supervisor') {
              return {
                ...exp,
                supervisor: {
                  ...exp.supervisor,
                  [child]: value
                }
              };
            }
          }
          return { ...exp, [field]: value };
        }
        return exp;
      })
    }));
  };

  const updateExperienceArray = (expIndex: number, arrayField: 'responsibilities' | 'accomplishments' | 'skillsUsed', itemIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      professionalExperience: prev.professionalExperience.map((exp, i) => {
        if (i === expIndex) {
          return {
            ...exp,
            [arrayField]: exp[arrayField].map((item: string, j: number) => 
              j === itemIndex ? value : item
            )
          };
        }
        return exp;
      })
    }));
  };

  const addExperienceArrayItem = (expIndex: number, arrayField: 'responsibilities' | 'accomplishments' | 'skillsUsed') => {
    setFormData(prev => ({
      ...prev,
      professionalExperience: prev.professionalExperience.map((exp, i) => {
        if (i === expIndex) {
          return {
            ...exp,
            [arrayField]: [...exp[arrayField], '']
          };
        }
        return exp;
      })
    }));
  };

  const removeExperienceArrayItem = (expIndex: number, arrayField: 'responsibilities' | 'accomplishments' | 'skillsUsed', itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      professionalExperience: prev.professionalExperience.map((exp, i) => {
        if (i === expIndex) {
          const currentArray = exp[arrayField];
          if (currentArray.length > 1) {
            return {
              ...exp,
              [arrayField]: currentArray.filter((_, j) => j !== itemIndex)
            };
          }
        }
        return exp;
      })
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend/state management
    console.log('Saving professional profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit/Save Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Professional Profile</h3>
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] hover:from-[#2d7a9e] hover:to-[#5a3485] text-white font-bold"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Career Objective */}
          <div>
            <h4 className="text-lg font-semibold text-[#3a8fb7] mb-4">Career Objective</h4>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Career Objective (1-2 sentences)
            </label>
            {isEditing ? (
              <textarea
                value={formData.careerObjective}
                onChange={(e) => handleInputChange('careerObjective', e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-3 h-24 resize-none"
                placeholder="Describe your career goals and what you're looking for..."
              />
            ) : (
              <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600 min-h-[96px] flex items-center">
                {formData.careerObjective || 'Not specified'}
              </p>
            )}
          </div>

          {/* Summary Bullet Points */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-[#3a8fb7]">Professional Summary</h4>
              {isEditing && formData.summaryBulletPoints.length < 5 && (
                <Button
                  onClick={addSummaryPoint}
                  size="sm"
                  className="bg-[#3a8fb7] hover:bg-[#2d7a9e] text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Point
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {formData.summaryBulletPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-[#3a8fb7] font-bold">•</span>
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={point}
                        onChange={(e) => updateSummaryPoint(index, e.target.value)}
                        className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="Enter a key professional highlight..."
                      />
                      {formData.summaryBulletPoints.length > 1 && (
                        <Button
                          onClick={() => removeSummaryPoint(index)}
                          size="sm"
                          variant="destructive"
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-white">
                      {point || 'Not specified'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Achievements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-[#3a8fb7]">Key Achievements</h4>
              {isEditing && formData.keyAchievements.length < 5 && (
                <Button
                  onClick={addAchievement}
                  size="sm"
                  className="bg-[#3a8fb7] hover:bg-[#2d7a9e] text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Achievement
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {formData.keyAchievements.map((achievement, index) => (
                <div key={index} className="bg-[#1e1e1e] p-4 rounded border border-gray-600">
                  {isEditing && formData.keyAchievements.length > 1 && (
                    <div className="flex justify-end mb-2">
                      <Button
                        onClick={() => removeAchievement(index)}
                        size="sm"
                        variant="destructive"
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                      {isEditing ? (
                        <Input
                          value={achievement.title}
                          onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                          className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                          placeholder="Achievement title..."
                        />
                      ) : (
                        <p className="text-white font-medium">
                          {achievement.title || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Detail</label>
                      {isEditing ? (
                        <textarea
                          value={achievement.detail}
                          onChange={(e) => updateAchievement(index, 'detail', e.target.value)}
                          className="w-full bg-[#262626] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-2 h-20 resize-none text-sm"
                          placeholder="Describe the achievement and its impact..."
                        />
                      ) : (
                        <p className="text-gray-300 text-sm">
                          {achievement.detail || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Experience Section - Full Width */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold text-[#3a8fb7] flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Experience
            </h4>
            {isEditing && (
              <Button
                onClick={addExperience}
                size="sm"
                className="bg-[#3a8fb7] hover:bg-[#2d7a9e] text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Experience
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {formData.professionalExperience.map((experience, expIndex) => (
              <div key={expIndex} className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
                {isEditing && formData.professionalExperience.length > 1 && (
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => removeExperience(expIndex)}
                      size="sm"
                      variant="destructive"
                      className="px-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name & Position Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                    {isEditing ? (
                      <Input
                        value={experience.companyName}
                        onChange={(e) => updateExperience(expIndex, 'companyName', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="e.g. Google"
                      />
                    ) : (
                      <p className="text-white font-semibold text-lg">
                        {experience.companyName || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Position Title *</label>
                    {isEditing ? (
                      <Input
                        value={experience.positionTitle}
                        onChange={(e) => updateExperience(expIndex, 'positionTitle', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    ) : (
                      <p className="text-white font-semibold text-lg">
                        {experience.positionTitle || 'Not specified'}
                      </p>
                    )}
                  </div>

                  {/* Company Website & Employment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Website</label>
                    {isEditing ? (
                      <Input
                        type="url"
                        value={experience.companyWebsite}
                        onChange={(e) => updateExperience(expIndex, 'companyWebsite', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="https://company.com"
                      />
                    ) : (
                      experience.companyWebsite && (
                        <a 
                          href={experience.companyWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#3a8fb7] hover:text-[#6c3e9e] underline"
                        >
                          {experience.companyWebsite}
                        </a>
                      )
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Employment Type</label>
                    {isEditing ? (
                      <select
                        value={experience.employmentType}
                        onChange={(e) => updateExperience(expIndex, 'employmentType', e.target.value)}
                        className="w-full bg-[#262626] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-3"
                      >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    ) : (
                      <p className="text-white">
                        {experience.employmentType || 'Not specified'}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    {isEditing ? (
                      <Input
                        value={experience.location.city}
                        onChange={(e) => updateExperience(expIndex, 'location.city', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="San Francisco"
                      />
                    ) : (
                      <p className="text-white">
                        {experience.location.city || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
                    {isEditing ? (
                      <Input
                        value={experience.location.stateProvince}
                        onChange={(e) => updateExperience(expIndex, 'location.stateProvince', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="CA"
                      />
                    ) : (
                      <p className="text-white">
                        {experience.location.stateProvince || 'Not specified'}
                      </p>
                    )}
                  </div>

                  {/* Dates */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                    {isEditing ? (
                      <Input
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => updateExperience(expIndex, 'startDate', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      />
                    ) : (
                      <p className="text-white">
                        {experience.startDate ? new Date(experience.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={experience.isCurrent}
                            onChange={(e) => {
                              updateExperience(expIndex, 'isCurrent', e.target.checked);
                              if (e.target.checked) {
                                updateExperience(expIndex, 'endDate', '');
                              }
                            }}
                            className="rounded border-[#3a8fb7]"
                          />
                          <span className="text-sm text-gray-300">Currently employed here</span>
                        </div>
                        {!experience.isCurrent && (
                          <Input
                            type="month"
                            value={experience.endDate}
                            onChange={(e) => updateExperience(expIndex, 'endDate', e.target.value)}
                            className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-white">
                        {experience.isCurrent 
                          ? 'Present' 
                          : experience.endDate 
                            ? new Date(experience.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : 'Not specified'
                        }
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role Summary</label>
                    {isEditing ? (
                      <textarea
                        value={experience.summary}
                        onChange={(e) => updateExperience(expIndex, 'summary', e.target.value)}
                        className="w-full bg-[#262626] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-3"
                        rows={2}
                        placeholder="1-2 sentence overview of the role..."
                      />
                    ) : (
                      <p className="text-white">
                        {experience.summary || 'Not specified'}
                      </p>
                    )}
                  </div>

                  {/* Responsibilities */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">Responsibilities</label>
                      {isEditing && (
                        <Button
                          onClick={() => addExperienceArrayItem(expIndex, 'responsibilities')}
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {experience.responsibilities.map((responsibility, respIndex) => (
                        <div key={respIndex} className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Input
                                value={responsibility}
                                onChange={(e) => updateExperienceArray(expIndex, 'responsibilities', respIndex, e.target.value)}
                                className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                                placeholder="Describe a key responsibility..."
                              />
                              {experience.responsibilities.length > 1 && (
                                <Button
                                  onClick={() => removeExperienceArrayItem(expIndex, 'responsibilities', respIndex)}
                                  size="sm"
                                  variant="destructive"
                                  className="px-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          ) : (
                            responsibility && (
                              <p className="text-white flex items-start gap-2">
                                <span className="text-[#3a8fb7] mt-2">•</span>
                                {responsibility}
                              </p>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accomplishments */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">Key Accomplishments</label>
                      {isEditing && (
                        <Button
                          onClick={() => addExperienceArrayItem(expIndex, 'accomplishments')}
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {experience.accomplishments.map((accomplishment, accIndex) => (
                        <div key={accIndex} className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Input
                                value={accomplishment}
                                onChange={(e) => updateExperienceArray(expIndex, 'accomplishments', accIndex, e.target.value)}
                                className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                                placeholder="Quantify a key achievement..."
                              />
                              {experience.accomplishments.length > 1 && (
                                <Button
                                  onClick={() => removeExperienceArrayItem(expIndex, 'accomplishments', accIndex)}
                                  size="sm"
                                  variant="destructive"
                                  className="px-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          ) : (
                            accomplishment && (
                              <p className="text-white flex items-start gap-2">
                                <span className="text-[#6c3e9e] mt-2">•</span>
                                {accomplishment}
                              </p>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Used */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">Skills Used</label>
                      {isEditing && (
                        <Button
                          onClick={() => addExperienceArrayItem(expIndex, 'skillsUsed')}
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {experience.skillsUsed.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Input
                                value={skill}
                                onChange={(e) => updateExperienceArray(expIndex, 'skillsUsed', skillIndex, e.target.value)}
                                className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                                placeholder="e.g. React, TypeScript, AWS..."
                              />
                              {experience.skillsUsed.length > 1 && (
                                <Button
                                  onClick={() => removeExperienceArrayItem(expIndex, 'skillsUsed', skillIndex)}
                                  size="sm"
                                  variant="destructive"
                                  className="px-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          ) : (
                            skill && (
                              <span className="inline-block bg-[#3a8fb7]/20 text-[#3a8fb7] px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                    {isEditing ? (
                      <Input
                        value={experience.industry}
                        onChange={(e) => updateExperience(expIndex, 'industry', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="e.g. Technology, Healthcare"
                      />
                    ) : (
                      <p className="text-white">
                        {experience.industry || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={experience.teamSize}
                        onChange={(e) => updateExperience(expIndex, 'teamSize', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="e.g. 5"
                      />
                    ) : (
                      <p className="text-white">
                        {experience.teamSize ? `${experience.teamSize} people` : 'Not specified'}
                      </p>
                    )}
                  </div>

                  {/* Supervisor Information */}
                  <div className="md:col-span-2">
                    <h5 className="text-lg font-medium text-gray-300 mb-3">Supervisor Information (Optional)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                        {isEditing ? (
                          <Input
                            value={experience.supervisor.name}
                            onChange={(e) => updateExperience(expIndex, 'supervisor.name', e.target.value)}
                            className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                            placeholder="John Smith"
                          />
                        ) : (
                          <p className="text-white text-sm">
                            {experience.supervisor.name || 'Not specified'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        {isEditing ? (
                          <Input
                            value={experience.supervisor.title}
                            onChange={(e) => updateExperience(expIndex, 'supervisor.title', e.target.value)}
                            className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                            placeholder="Engineering Manager"
                          />
                        ) : (
                          <p className="text-white text-sm">
                            {experience.supervisor.title || 'Not specified'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={experience.supervisor.contactEmail}
                            onChange={(e) => updateExperience(expIndex, 'supervisor.contactEmail', e.target.value)}
                            className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                            placeholder="john@company.com"
                          />
                        ) : (
                          experience.supervisor.contactEmail && (
                            <a 
                              href={`mailto:${experience.supervisor.contactEmail}`}
                              className="text-[#3a8fb7] hover:text-[#6c3e9e] underline text-sm"
                            >
                              {experience.supervisor.contactEmail}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display formatted info when not editing */}
                {!isEditing && (experience.companyName || experience.positionTitle) && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="text-gray-400 text-sm">
                      {experience.location.city && experience.location.stateProvince && (
                        <>{experience.location.city}, {experience.location.stateProvince} • </>
                      )}
                      {experience.employmentType && <>{experience.employmentType} • </>}
                      {experience.startDate && (
                        <>
                          {new Date(experience.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' – '}
                          {experience.isCurrent 
                            ? 'Present' 
                            : experience.endDate 
                              ? new Date(experience.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : 'Present'
                          }
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Availability */}
          <div>
            <h4 className="text-lg font-semibold text-[#3a8fb7] mb-4">Availability</h4>
            
            {/* Earliest Start Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Earliest Start Date</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.earliestStartDate}
                  onChange={(e) => handleInputChange('earliestStartDate', e.target.value)}
                  className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                />
              ) : (
                <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                  {formData.earliestStartDate || 'Not specified'}
                </p>
              )}
            </div>

            {/* Relocation Preference */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Relocation Preference</label>
              {isEditing ? (
                <select
                  value={formData.relocationPreference}
                  onChange={(e) => handleInputChange('relocationPreference', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-3"
                >
                  <option value="">Select preference</option>
                  <option value="None">None</option>
                  <option value="Domestic only">Domestic only</option>
                  <option value="Global">Global</option>
                </select>
              ) : (
                <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                  {formData.relocationPreference || 'Not specified'}
                </p>
              )}
            </div>

            {/* Work Authorization */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Work Authorization</label>
              {isEditing ? (
                <div className="space-y-2">
                  <select
                    value={formData.workAuthorization}
                    onChange={(e) => handleInputChange('workAuthorization', e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-3"
                  >
                    <option value="">Select work authorization status</option>
                    <option value="U.S. Citizen">U.S. Citizen</option>
                    <option value="Lawful Permanent Resident (Green Card Holder)">Lawful Permanent Resident (Green Card Holder)</option>
                    <option value="Employment Authorization Document (EAD)">Employment Authorization Document (EAD)</option>
                    <option value="H-1B Visa Holder">H-1B Visa Holder</option>
                    <option value="F-1 Student Visa (CPT/OPT)">F-1 Student Visa (CPT/OPT)</option>
                    <option value="TN Visa Holder">TN Visa Holder</option>
                    <option value="J-1 Exchange Visitor Visa">J-1 Exchange Visitor Visa</option>
                    <option value="E-3 Visa (Australia)">E-3 Visa (Australia)</option>
                    <option value="Other">Other (please specify)</option>
                  </select>
                  {formData.workAuthorization === 'Other' && (
                    <Input
                      value={formData.workAuthorizationOther || ''}
                      onChange={(e) => handleInputChange('workAuthorizationOther', e.target.value)}
                      className="bg-[#1e1e1e] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="Please specify your work authorization status"
                    />
                  )}
                </div>
              ) : (
                <p className="text-white bg-[#1e1e1e] p-3 rounded border border-gray-600">
                  {formData.workAuthorization === 'Other' && formData.workAuthorizationOther
                    ? `Other: ${formData.workAuthorizationOther}`
                    : formData.workAuthorization || 'Not specified'
                  }
                </p>
              )}
            </div>
          </div>

          {/* Languages Spoken */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-[#3a8fb7]">Languages Spoken</h4>
              {isEditing && (
                <Button
                  onClick={addLanguage}
                  size="sm"
                  className="bg-[#3a8fb7] hover:bg-[#2d7a9e] text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Language
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {formData.languagesSpoken.map((lang, index) => (
                <div key={index} className="bg-[#1e1e1e] p-3 rounded border border-gray-600">
                  {isEditing && formData.languagesSpoken.length > 1 && (
                    <div className="flex justify-end mb-2">
                      <Button
                        onClick={() => removeLanguage(index)}
                        size="sm"
                        variant="destructive"
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Language</label>
                      {isEditing ? (
                        <Input
                          value={lang.language}
                          onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                          className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                          placeholder="e.g. Spanish"
                        />
                      ) : (
                        <p className="text-white text-sm">
                          {lang.language || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Proficiency</label>
                      {isEditing ? (
                        <select
                          value={lang.proficiency}
                          onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                          className="w-full bg-[#262626] border border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e] rounded p-2 text-sm"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native">Native</option>
                        </select>
                      ) : (
                        <p className="text-white text-sm">
                          {lang.proficiency}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationCredentialsTab({ profileData }: { profileData: CompleteProfile }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    formalEducation: [{
      degreeProgram: '',
      institution: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      gpaHonors: ''
    }],
    certifications: [{
      title: '',
      issuingOrganization: '',
      dateIssued: '',
      expirationDate: '',
      credentialId: '',
      verificationLink: ''
    }],
    microCredentials: [{
      name: '',
      provider: '',
      completionDate: '',
      certificateLink: '',
      badgeImage: ''
    }]
  });

  const handleInputChange = (section: string, index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section as keyof typeof prev].map((item: any, i: number) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (section: string, template: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section as keyof typeof prev], template]
    }));
  };

  const removeItem = (section: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log('Saving education data:', formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header with Edit/Save Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Education & Credentials</h3>
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] hover:from-[#2d7a9e] hover:to-[#5a3485] text-white font-bold"
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

      {/* Formal Education Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-[#3a8fb7] flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Formal Education
          </h4>
          {isEditing && (
            <Button
              onClick={() => addItem('formalEducation', {
                degreeProgram: '',
                institution: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                gpaHonors: ''
              })}
              size="sm"
              className="bg-[#3a8fb7] hover:bg-[#2d7a9e] text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Education
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {formData.formalEducation.map((education, index) => (
            <div key={index} className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
              {isEditing && formData.formalEducation.length > 1 && (
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => removeItem('formalEducation', index)}
                    size="sm"
                    variant="destructive"
                    className="px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Degree/Program Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Degree/Program Name *
                  </label>
                  {isEditing ? (
                    <Input
                      value={education.degreeProgram}
                      onChange={(e) => handleInputChange('formalEducation', index, 'degreeProgram', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. B.S. in Computer Science"
                    />
                  ) : (
                    <p className="text-white font-semibold text-lg">
                      {education.degreeProgram || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Institution</label>
                  {isEditing ? (
                    <Input
                      value={education.institution}
                      onChange={(e) => handleInputChange('formalEducation', index, 'institution', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. Arizona State University"
                    />
                  ) : (
                    <p className="text-white">
                      {education.institution || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    {isEditing ? (
                      <Input
                        value={education.city}
                        onChange={(e) => handleInputChange('formalEducation', index, 'city', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="Tempe"
                      />
                    ) : (
                      <p className="text-white text-sm">
                        {education.city || 'Not specified'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                    {isEditing ? (
                      <Input
                        value={education.state}
                        onChange={(e) => handleInputChange('formalEducation', index, 'state', e.target.value)}
                        className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                        placeholder="AZ"
                      />
                    ) : (
                      <p className="text-white text-sm">
                        {education.state || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  {isEditing ? (
                    <Input
                      type="month"
                      value={education.startDate}
                      onChange={(e) => handleInputChange('formalEducation', index, 'startDate', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                    />
                  ) : (
                    <p className="text-white">
                      {education.startDate ? new Date(education.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  {isEditing ? (
                    <Input
                      type="month"
                      value={education.endDate}
                      onChange={(e) => handleInputChange('formalEducation', index, 'endDate', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="Leave blank if current"
                    />
                  ) : (
                    <p className="text-white">
                      {education.endDate ? new Date(education.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </p>
                  )}
                </div>

                {/* GPA/Honors */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">GPA or Honors (Optional)</label>
                  {isEditing ? (
                    <Input
                      value={education.gpaHonors}
                      onChange={(e) => handleInputChange('formalEducation', index, 'gpaHonors', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. 3.8 GPA, Cum Laude"
                    />
                  ) : (
                    <p className="text-gray-300 italic">
                      {education.gpaHonors || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>

              {/* Display formatted location and dates when not editing */}
              {!isEditing && (education.institution || education.city || education.state) && (
                <div className="mt-2 text-gray-400">
                  {education.institution && (
                    <>
                      {education.institution}
                      {(education.city || education.state) && ', '}
                    </>
                  )}
                  {education.city && education.state && `${education.city}, ${education.state}`}
                  <br />
                  {education.startDate && (
                    <>
                      {new Date(education.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' – '}
                      {education.endDate ? new Date(education.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & Badges Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-[#3a8fb7] flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications & Badges
          </h4>
          {isEditing && (
            <Button
              onClick={() => addItem('certifications', {
                title: '',
                issuingOrganization: '',
                dateIssued: '',
                expirationDate: '',
                credentialId: '',
                verificationLink: ''
              })}
              size="sm"
              className="bg-[#3a8fb7] hover:bg-[#2d7a9e] text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Certification
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {formData.certifications.map((cert, index) => (
            <div key={index} className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
              {isEditing && formData.certifications.length > 1 && (
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => removeItem('certifications', index)}
                    size="sm"
                    variant="destructive"
                    className="px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certification/Badge Title *
                  </label>
                  {isEditing ? (
                    <Input
                      value={cert.title}
                      onChange={(e) => handleInputChange('certifications', index, 'title', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. AWS Certified Solutions Architect – Associate"
                    />
                  ) : (
                    <p className="text-white font-bold text-lg">
                      {cert.title || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Issuing Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Issuing Organization</label>
                  {isEditing ? (
                    <Input
                      value={cert.issuingOrganization}
                      onChange={(e) => handleInputChange('certifications', index, 'issuingOrganization', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. Amazon Web Services"
                    />
                  ) : (
                    <p className="text-white">
                      {cert.issuingOrganization || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Date Issued */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Issued</label>
                  {isEditing ? (
                    <Input
                      type="month"
                      value={cert.dateIssued}
                      onChange={(e) => handleInputChange('certifications', index, 'dateIssued', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                    />
                  ) : (
                    <p className="text-white">
                      {cert.dateIssued ? new Date(cert.dateIssued + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expiration Date (Optional)</label>
                  {isEditing ? (
                    <Input
                      type="month"
                      value={cert.expirationDate}
                      onChange={(e) => handleInputChange('certifications', index, 'expirationDate', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                    />
                  ) : (
                    <p className="text-gray-300">
                      {cert.expirationDate ? `Expires ${new Date(cert.expirationDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 'No expiration'}
                    </p>
                  )}
                </div>

                {/* Credential ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Credential ID (Optional)</label>
                  {isEditing ? (
                    <Input
                      value={cert.credentialId}
                      onChange={(e) => handleInputChange('certifications', index, 'credentialId', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. ABC123XYZ"
                    />
                  ) : (
                    <p className="text-gray-300 font-mono text-sm">
                      {cert.credentialId || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Verification Link */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Verification Link (Optional)</label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={cert.verificationLink}
                      onChange={(e) => handleInputChange('certifications', index, 'verificationLink', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="https://..."
                    />
                  ) : (
                    cert.verificationLink && (
                      <a 
                        href={cert.verificationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#3a8fb7] hover:text-[#6c3e9e] underline"
                      >
                        Verify Credential
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Display formatted info when not editing */}
              {!isEditing && (cert.issuingOrganization || cert.dateIssued) && (
                <div className="mt-3 text-gray-400">
                  {cert.issuingOrganization}
                  <br />
                  {cert.dateIssued && (
                    <>
                      Issued {new Date(cert.dateIssued + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {cert.expirationDate && (
                        <> • Expires {new Date(cert.expirationDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</>
                      )}
                    </>
                  )}
                  {cert.credentialId && (
                    <>
                      <br />
                      Credential ID: {cert.credentialId}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Micro-credentials & Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-[#3a8fb7] flex items-center gap-2">
            <Target className="h-5 w-5" />
            Micro-credentials & Courses
          </h4>
          {isEditing && (
            <Button
              onClick={() => addItem('microCredentials', {
                name: '',
                provider: '',
                completionDate: '',
                certificateLink: '',
                badgeImage: ''
              })}
              size="sm"
              className="bg-[#3a8fb7] hover:bg-[#2d7a9e] text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Course
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {formData.microCredentials.map((course, index) => (
            <div key={index} className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
              {isEditing && formData.microCredentials.length > 1 && (
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => removeItem('microCredentials', index)}
                    size="sm"
                    variant="destructive"
                    className="px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course or Micro-credential Name *
                  </label>
                  {isEditing ? (
                    <Input
                      value={course.name}
                      onChange={(e) => handleInputChange('microCredentials', index, 'name', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. Advanced JavaScript Patterns (Badge)"
                    />
                  ) : (
                    <p className="text-white font-bold text-lg">
                      {course.name || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
                  {isEditing ? (
                    <Input
                      value={course.provider}
                      onChange={(e) => handleInputChange('microCredentials', index, 'provider', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="e.g. Upskill, edX"
                    />
                  ) : (
                    <p className="text-white">
                      {course.provider || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Completion Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Completion Date</label>
                  {isEditing ? (
                    <Input
                      type="month"
                      value={course.completionDate}
                      onChange={(e) => handleInputChange('microCredentials', index, 'completionDate', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                    />
                  ) : (
                    <p className="text-white">
                      {course.completionDate ? new Date(course.completionDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Certificate Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Certificate Link (Optional)</label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={course.certificateLink}
                      onChange={(e) => handleInputChange('microCredentials', index, 'certificateLink', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="https://..."
                    />
                  ) : (
                    course.certificateLink && (
                      <a 
                        href={course.certificateLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#3a8fb7] hover:text-[#6c3e9e] underline"
                      >
                        View Certificate
                      </a>
                    )
                  )}
                </div>

                {/* Badge Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Badge Image URL (Optional)</label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={course.badgeImage}
                      onChange={(e) => handleInputChange('microCredentials', index, 'badgeImage', e.target.value)}
                      className="bg-[#262626] border-[#3a8fb7] text-white focus:border-[#6c3e9e] focus:ring-[#6c3e9e]"
                      placeholder="https://..."
                    />
                  ) : (
                    course.badgeImage && (
                      <img 
                        src={course.badgeImage} 
                        alt="Badge" 
                        className="w-12 h-12 object-contain"
                      />
                    )
                  )}
                </div>
              </div>

              {/* Display formatted info when not editing */}
              {!isEditing && (course.provider || course.completionDate) && (
                <div className="mt-3 text-gray-400">
                  {course.provider}
                  {course.completionDate && (
                    <>
                      <br />
                      Completed {new Date(course.completionDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </>
                  )}
                  {course.certificateLink && (
                    <div className="mt-2">
                      <a 
                        href={course.certificateLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#3a8fb7] hover:text-[#6c3e9e] underline text-sm"
                      >
                        [View Badge]
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsProficiencyTab({ profileData }: { profileData: CompleteProfile }) {
  const router = useRouter();

  // Mock skills data - in real app, this would come from profileData
  const mockSkillsData = {
    lastUpdated: '2024-01-15',
    totalSkills: 24,
    categories: [
      {
        id: 'technical',
        name: 'Technical Skills',
        icon: '⚙️',
        color: 'blue',
        skills: [
          { name: 'JavaScript', level: 4, category: 'Programming' },
          { name: 'React', level: 4, category: 'Frontend' },
          { name: 'Node.js', level: 3, category: 'Backend' },
          { name: 'Python', level: 3, category: 'Programming' },
          { name: 'SQL', level: 3, category: 'Database' },
          { name: 'Git', level: 4, category: 'Version Control' }
        ]
      },
      {
        id: 'hands-on',
        name: 'Hands-On Skills',
        icon: '🔧',
        color: 'green',
        skills: [
          { name: 'Circuit Board Repair', level: 3, category: 'Electronics' },
          { name: 'Soldering', level: 4, category: 'Electronics' },
          { name: 'Motor Wiring', level: 3, category: 'Electrical' },
          { name: 'Precision Drilling', level: 2, category: 'Fabrication' }
        ]
      },
      {
        id: 'soft-skills',
        name: 'Professional Skills',
        icon: '👥',
        color: 'purple',
        skills: [
          { name: 'Project Management', level: 3, category: 'Leadership' },
          { name: 'Technical Writing', level: 4, category: 'Communication' },
          { name: 'Problem Solving', level: 4, category: 'Analytical' },
          { name: 'Team Collaboration', level: 4, category: 'Interpersonal' }
        ]
      }
    ]
  };

  const getLevelText = (level: number) => {
    const levels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return levels[level] || 'Not Rated';
  };

  const getLevelColor = (level: number) => {
    const colors = ['', 'text-red-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'];
    return colors[level] || 'text-gray-400';
  };

  const renderStars = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= level 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Skills & Proficiency</h3>
          <p className="text-gray-400 mt-1">
            Last updated: {new Date(mockSkillsData.lastUpdated).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <Button
          onClick={() => router.push('/skills-assessment')}
          className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] hover:from-[#2d7a9e] hover:to-[#5a3485] text-white font-bold"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Update Skills
        </Button>
      </div>

      {/* Skills Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#3a8fb7] rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mockSkillsData.totalSkills}</p>
              <p className="text-gray-400">Total Skills</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#6c3e9e] rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {mockSkillsData.categories.reduce((sum, cat) => 
                  sum + cat.skills.filter(skill => skill.level >= 4).length, 0
                )}
              </p>
              <p className="text-gray-400">Expert Level</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#2d7a9e] rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mockSkillsData.categories.length}</p>
              <p className="text-gray-400">Skill Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Categories */}
      <div className="space-y-8">
        {mockSkillsData.categories.map((category) => (
          <div key={category.id} className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{category.icon}</span>
              <h4 className="text-xl font-semibold text-[#3a8fb7]">{category.name}</h4>
              <span className="text-gray-400">({category.skills.length} skills)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.skills.map((skill, index) => (
                <div key={index} className="bg-[#262626] p-4 rounded border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-white">{skill.name}</h5>
                      <p className="text-sm text-gray-400">{skill.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getLevelColor(skill.level)}`}>
                        {getLevelText(skill.level)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {renderStars(skill.level)}
                    <span className="text-xs text-gray-500">{skill.level}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] p-8 rounded-lg border border-[#3a8fb7]">
        <div className="text-center">
          <h4 className="text-xl font-semibold text-white mb-2">Ready to Update Your Skills?</h4>
          <p className="text-gray-400 mb-6">
            Take our comprehensive skills assessment to showcase your abilities to potential employers
          </p>
          <Button
            onClick={() => router.push('/skills-assessment')}
            size="lg"
            className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] hover:from-[#2d7a9e] hover:to-[#5a3485] text-white font-bold"
          >
            <Target className="h-5 w-5 mr-2" />
            Start Skills Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

function CareerInterestsPathwaysTab() {
  const router = useRouter();
  
  // Import the ProfileMyPathways component dynamically to avoid SSR issues
  const [ProfileMyPathwaysComponent, setProfileMyPathwaysComponent] = useState<React.ComponentType<any> | null>(null);
  
  useEffect(() => {
    // Dynamically import the ProfileMyPathways component
    import('@/app/components/ProfileMyPathways').then(module => {
      setProfileMyPathwaysComponent(() => module.default);
    });
  }, []);

  if (!ProfileMyPathwaysComponent) {
    return (
      <div className="text-center py-12">
        <Route className="h-16 w-16 text-slate-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Loading Career Pathways</h3>
        <p className="text-slate-600 dark:text-slate-400">Preparing your pathway management interface...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Career Exploration Link */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Career Interests & Pathways</h3>
          <p className="text-gray-400 mt-1">
            Manage your learning pathways and explore new career opportunities
          </p>
        </div>
        <Button
          onClick={() => router.push('/career-exploration')}
          className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] hover:from-[#2d7a9e] hover:to-[#5a3485] text-white font-bold"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Explore New Careers
        </Button>
      </div>

      {/* ProfileMyPathways Component */}
      <ProfileMyPathwaysComponent />
    </div>
  );
}