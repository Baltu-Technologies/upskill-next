'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Edit3,
  Save,
  X,
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
  Info,
  Download,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompleteProfile, CoreCandidate } from '@/types/profile';
import { toast } from 'sonner';

interface CoreProfileSectionProps {
  profileData: CompleteProfile;
  setProfileData: (data: CompleteProfile) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  headline: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function CoreProfileSection({ 
  profileData, 
  setProfileData, 
  isEditing, 
  setIsEditing 
}: CoreProfileSectionProps) {
  const candidate = profileData.candidate;
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    headline: candidate.headline || '',
    city: candidate.city || '',
    state: candidate.state || '',
    email: candidate.email,
    phone: candidate.phone || '',
    portfolioUrl: candidate.portfolioUrl || '',
    bio: candidate.headline || '', // Using headline as bio for now
    githubUrl: candidate.githubUrl || '',
    linkedinUrl: candidate.linkedinUrl || ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(formData.bio.length);
  
  // Character limits
  const MAX_BIO_CHARS = 280;
  
  // Temporary data for properties not yet in the core structure
  const tempData = {
    joinDate: 'January 2022',
    lastActive: '2 hours ago'
  };

  // Update form data when editing mode changes
  useEffect(() => {
    if (isEditing) {
      setFormData({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        headline: candidate.headline || '',
        city: candidate.city || '',
        state: candidate.state || '',
        email: candidate.email,
        phone: candidate.phone || '',
        portfolioUrl: candidate.portfolioUrl || '',
        bio: candidate.headline || '',
        githubUrl: candidate.githubUrl || '',
        linkedinUrl: candidate.linkedinUrl || ''
      });
      setCharCount((candidate.headline || '').length);
    }
  }, [isEditing, candidate]);

  // Validate form data
  const validateForm = useCallback((): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.headline.trim()) {
      newErrors.headline = 'Professional title is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.portfolioUrl && !/^https?:\/\/.+\..+/.test(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL';
    }
    
    if (formData.bio.length > MAX_BIO_CHARS) {
      newErrors.bio = `Bio must be ${MAX_BIO_CHARS} characters or less`;
    }
    
    return newErrors;
  }, [formData]);

  // Handle form changes
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    if (field === 'bio') {
      setCharCount(value.length);
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !isEditing) return;
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Auto-saved profile data');
    }
  }, [hasUnsavedChanges, isEditing, validateForm]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!isEditing || !hasUnsavedChanges) return;
    
    const interval = setInterval(autoSave, 10000);
    return () => clearInterval(interval);
  }, [autoSave, isEditing, hasUnsavedChanges]);

  // Handle save
  const handleSave = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile data
      const updatedCandidate: CoreCandidate = {
        ...candidate,
        firstName: formData.firstName,
        lastName: formData.lastName,
        headline: formData.headline,
        city: formData.city,
        state: formData.state,
        email: formData.email,
        phone: formData.phone,
        portfolioUrl: formData.portfolioUrl,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl
      };
      
      setProfileData({
        ...profileData,
        candidate: updatedCandidate
      });
      
      setIsEditing(false);
      setHasUnsavedChanges(false);
      toast.success('Your Core Profile has been updated.');
      
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setErrors({});
  };

  // Handle before unload
  useEffect(() => {
    if (!isEditing || !hasUnsavedChanges) return;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditing, hasUnsavedChanges]);

  // Helper functions
  const getFullName = () => isEditing 
    ? `${formData.firstName} ${formData.lastName}`.trim() 
    : `${candidate.firstName} ${candidate.lastName}`;
    
  const getLocation = () => isEditing 
    ? `${formData.city}${formData.city && formData.state ? ', ' : ''}${formData.state}`.trim() 
    : `${candidate.city || ''}${candidate.city && candidate.state ? ', ' : ''}${candidate.state || ''}`;

  const renderField = (
    label: string,
    field: keyof FormData,
    type: string = 'text',
    placeholder?: string,
    icon?: React.ReactNode,
    helpText?: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-500">{icon}</span>}
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {(field === 'firstName' || field === 'lastName' || field === 'headline' || field === 'email') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
        {helpText && (
          <div className="group relative">
            <Info className="h-3 w-3 text-slate-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {helpText}
            </div>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-1">
          <Input
            type={type}
            value={formData[field]}
            onChange={(e) => handleFormChange(field, e.target.value)}
            placeholder={placeholder}
            className={cn(
              "transition-all duration-200",
              errors[field] 
                ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10" 
                : "focus:border-[hsl(217,91%,60%)] focus:ring-[hsl(217,91%,60%)]/20"
            )}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
          />
          {errors[field] && (
            <div id={`${field}-error`} className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors[field]}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 py-2">
          <span className="text-slate-900 dark:text-white font-medium">
            {formData[field] || <span className="text-slate-400 italic">Not provided</span>}
          </span>
          {formData[field] && (field === 'email' || field === 'phone' || field === 'portfolioUrl') && (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Edit button in top right if not editing */}
      {!isEditing && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            variant="default"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      )}
      
      {/* Progress indicator when editing */}
      {isEditing && hasUnsavedChanges && (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>Unsaved changes • Auto-saving every 10 seconds</span>
        </div>
      )}

      {/* Two-column layout on desktop, single-column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="border-l-4 border-l-[hsl(217,91%,60%)] shadow-lg bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-900/50 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Settings className="h-5 w-5 text-[hsl(217,91%,60%)]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-6">
                {renderField(
                  'Full Name', 
                  'firstName', 
                  'text', 
                  'Enter your first name',
                  undefined,
                  'This will be shown to employers'
                )}
                {isEditing && renderField(
                  'Last Name', 
                  'lastName', 
                  'text', 
                  'Enter your last name'
                )}
                {renderField(
                  'Professional Title', 
                  'headline', 
                  'text', 
                  'e.g., Software Engineer, Data Analyst',
                  undefined,
                  'Your current or desired job title'
                )}
                {renderField(
                  'Location', 
                  'city', 
                  'text', 
                  'Enter your city',
                  <MapPin className="h-4 w-4" />,
                  'This shows employers where you\'re based'
                )}
                {isEditing && renderField(
                  'State', 
                  'state', 
                  'text', 
                  'Enter your state'
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Bio */}
          <Card className="border-l-4 border-l-green-500 shadow-lg bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Edit3 className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Professional Bio
                </h3>
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleFormChange('bio', e.target.value)}
                      placeholder="Tell us in 2–3 sentences who you are and what you do."
                      rows={4}
                      maxLength={MAX_BIO_CHARS}
                      className={cn(
                        "resize-none transition-all duration-200 bg-white dark:bg-gray-800",
                        errors.bio 
                          ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10" 
                          : "focus:border-green-500 focus:ring-green-500/20"
                      )}
                      aria-describedby="bio-help"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      {charCount}/{MAX_BIO_CHARS}
                    </div>
                  </div>
                  {errors.bio && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.bio}
                    </div>
                  )}
                  <p id="bio-help" className="text-xs text-slate-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Brief professional summary with markdown support
                  </p>
                </div>
              ) : (
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  {formData.bio || (
                    <span className="text-slate-400 italic">
                      Add your professional bio to tell employers about your background and interests.
                    </span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="border-l-4 border-l-purple-500 shadow-lg bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Contact Information
                </h3>
              </div>
              <div className="space-y-6">
                {renderField(
                  'Email Address', 
                  'email', 
                  'email', 
                  'your.email@example.com',
                  <Mail className="h-4 w-4" />,
                  'Primary contact method for employers'
                )}
                {renderField(
                  'Phone Number', 
                  'phone', 
                  'tel', 
                  '(555) 123-4567',
                  <Phone className="h-4 w-4" />,
                  'Optional - for direct contact'
                )}
                {renderField(
                  'Website', 
                  'portfolioUrl', 
                  'url', 
                  'https://yourportfolio.com',
                  <Globe className="h-4 w-4" />,
                  'Your portfolio or personal website'
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-l-4 border-l-orange-500 shadow-lg bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Github className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Social Links
                </h3>
              </div>
              <div className="space-y-6">
                {renderField(
                  'GitHub', 
                  'githubUrl', 
                  'text', 
                  'username',
                  <Github className="h-4 w-4" />,
                  'Your GitHub profile showcases your code'
                )}
                {renderField(
                  'LinkedIn', 
                  'linkedinUrl', 
                  'text', 
                  'username',
                  <Linkedin className="h-4 w-4" />,
                  'Professional networking profile'
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-l-4 border-l-slate-500 shadow-lg bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800 dark:to-slate-900/50 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/30">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Account Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Joined:</span> {tempData.joinDate}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Last active:</span> {tempData.lastActive}
                  </span>
                </div>
                <button className="flex items-center gap-2 text-[hsl(217,91%,60%)] hover:text-[hsl(217,91%,50%)] text-sm font-medium transition-colors duration-200 hover:underline">
                  <Download className="h-4 w-4" />
                  Download my data
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Sticky Save/Cancel Bar */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 p-4 z-50 shadow-xl lg:sticky lg:bottom-auto lg:bg-transparent lg:border-0 lg:p-0 lg:shadow-none">
          <div className="flex gap-3 justify-end lg:justify-start">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)] text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 lg:hidden">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Changes auto-saved every 10 seconds</span>
            </div>
          )}
        </div>
      )}

      {/* Add bottom padding when sticky bar is active on mobile */}
      {isEditing && <div className="h-20 lg:h-0" />}
    </div>
  );
} 