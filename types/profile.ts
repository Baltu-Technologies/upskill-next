// ===================================================================
// CORE PROFILE TYPES (Shared with Employers)
// ===================================================================

export interface CoreCandidate {
  id: string;
  // Basic Information
  firstName: string;
  lastName: string;
  preferredPronouns?: string;
  headline?: string; // Elevator pitch
  profilePhotoUrl?: string;
  
  // Location & Mobility
  city?: string;
  state?: string;
  willingToRelocate: boolean;
  workAuthorization: string; // 'US Citizen', 'Permanent Resident', 'H1B', etc.
  
  // Contact Info
  email: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  
  // Availability
  availability: string; // 'Immediate', 'In 2 weeks', 'Part-time available', etc.
  currentStatus: string; // 'Full-time student', 'Part-time student', 'Employed', 'Unemployed', 'Freelance'
  
  // Education
  highestEducation?: string; // 'High School', 'Associate\'s', 'Bachelor\'s', 'Master\'s', etc.
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  candidateId: string;
  degree: string; // 'Bachelor of Science in Computer Science'
  institution: string; // 'Arizona State University'
  graduationDate?: Date;
  gpa?: number;
  honors?: string; // 'Magna Cum Laude', 'Dean\'s List', etc.
  createdAt: Date;
  updatedAt: Date;
}

export interface FormalSkill {
  id: string;
  candidateId: string;
  name: string; // 'Fiber Optic Splicing', 'AWS Cloud Practitioner'
  type: 'Course' | 'Certification' | 'On-the-Job' | 'Bootcamp';
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  issuingOrganization?: string; // 'Amazon Web Services', 'Cisco', etc.
  dateEarned?: Date;
  credentialUrl?: string; // Link to badge or certificate
  createdAt: Date;
  updatedAt: Date;
}

export interface InformalSkill {
  id: string;
  candidateId: string;
  skillName: string; // 'Home Lab Wiring', 'Python Scripting'
  category?: string; // 'DIY', 'Software', 'Mechanical', 'Communication'
  selfRating: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  evidenceUrl?: string; // Optional proof link
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  candidateId: string;
  title: string;
  roleAndTools: string; // 'Lead Assembler – Multimeter, Fiber Kit'
  description: string; // Key outcomes and achievements
  mediaUrl?: string; // Link to image/video/GitHub repo
  startDate?: Date;
  endDate?: Date;
  isActive: boolean; // Still working on it
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkHistory {
  id: string;
  candidateId: string;
  companyName: string;
  roleTitle: string;
  startDate?: Date;
  endDate?: Date; // null if current position
  responsibilities: string; // Bullet-list format or paragraph
  isCurrentPosition: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reference {
  id: string;
  candidateId: string;
  name: string;
  relationship: string; // 'Former Manager', 'Professor', 'Colleague'
  contactInfo: string; // Email/phone
  letterUrl?: string; // Optional letter upload link
  permissionToContact: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===================================================================
// OPTIONAL & ADVANCED TYPES (Not Shared with Employers)
// ===================================================================

export interface CompensationPreferences {
  id: string;
  candidateId: string;
  desiredSalaryMin?: number;
  desiredSalaryMax?: number;
  preferredEmploymentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  weeklyAvailability?: number; // hours per week
  createdAt: Date;
  updatedAt: Date;
}

export interface LanguageSkill {
  id: string;
  candidateId: string;
  language: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
  isNative: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransportationLogistics {
  id: string;
  candidateId: string;
  hasDriversLicense: boolean;
  hasVehicle: boolean;
  commuteRadius?: number; // miles
  preferredWorkMode: 'Remote' | 'On-site' | 'Hybrid';
  internetSpeed?: string; // 'High-speed broadband', '5G', etc.
  hasHomeOfficeSetup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningProfile {
  id: string;
  candidateId: string;
  preferredFormats: string[]; // ['Video', 'Text', 'Interactive', 'VR']
  preferredTimeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Flexible';
  preferredPace: 'Self-paced' | 'Structured' | 'Intensive';
  weeklyLearningGoal?: number; // hours
  learningStyle: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading/Writing';
  groupVsSolo: 'Solo' | 'Group' | 'Mixed';
  createdAt: Date;
  updatedAt: Date;
}

export interface EEOData {
  id: string;
  candidateId: string;
  veteranStatus?: 'Veteran' | 'Not a Veteran' | 'Prefer not to answer';
  disabilityStatus?: 'Yes' | 'No' | 'Prefer not to answer';
  accommodationNeeds?: string;
  race?: string;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===================================================================
// SYSTEM-CALCULATED METRICS (Auto-generated)
// ===================================================================

export interface SystemMetrics {
  id: string;
  candidateId: string;
  aptitudeScore?: number; // 0-100 calculated score
  attitudeRating?: number; // 1-5 calculated rating
  totalXP: number;
  currentLevel: number;
  learningStreak: number; // days
  coursesCompleted: number;
  skillsVerified: number;
  lastCalculated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===================================================================
// COMPOSITE TYPES FOR UI
// ===================================================================

export interface CompleteProfile {
  candidate: CoreCandidate;
  education: Education[];
  formalSkills: FormalSkill[];
  informalSkills: InformalSkill[];
  projects: Project[];
  workHistory: WorkHistory[];
  references: Reference[];
  // Optional data
  compensationPreferences?: CompensationPreferences;
  languages?: LanguageSkill[];
  transportation?: TransportationLogistics;
  learningProfile?: LearningProfile;
  eeoData?: EEOData;
  systemMetrics?: SystemMetrics;
}

export interface ProfileCompletionStatus {
  coreComplete: boolean;
  coreProgress: number; // 0-100
  optionalComplete: boolean;
  optionalProgress: number; // 0-100
  overallProgress: number; // 0-100
  requiredFields: string[];
  missingCoreFields: string[];
  missingOptionalFields: string[];
}

// ===================================================================
// FORM VALIDATION TYPES
// ===================================================================

export interface ProfileValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'too_long' | 'too_short';
}

export interface ProfileFormState {
  isValid: boolean;
  errors: ProfileValidationError[];
  isDirty: boolean;
  isSubmitting: boolean;
}

// ===================================================================
// API RESPONSE TYPES
// ===================================================================

export interface ProfileAPIResponse {
  success: boolean;
  data?: CompleteProfile;
  error?: string;
  validationErrors?: ProfileValidationError[];
}

export interface ProfileUpdateRequest {
  candidateId: string;
  updates: Partial<CompleteProfile>;
  section: 'core' | 'optional' | 'education' | 'skills' | 'projects' | 'work' | 'references';
} 