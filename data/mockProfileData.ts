import { 
  CompleteProfile, 
  CoreCandidate, 
  Education, 
  FormalSkill, 
  InformalSkill, 
  Project, 
  WorkHistory, 
  Reference,
  SystemMetrics,
  ProfileCompletionStatus
} from '../types/profile';

// Type alias for backward compatibility with src/ components
export type UserProfile = CompleteProfile;

// ===================================================================
// MOCK CORE CANDIDATE DATA (Shared with Employers)
// ===================================================================

export const mockCoreCandidate: CoreCandidate = {
  id: 'user-12345',
  
  // Basic Information
  firstName: 'Peter',
  lastName: 'Costa',
  preferredPronouns: 'he/him',
  headline: 'Full Stack Developer passionate about semiconductor manufacturing technology and clean energy solutions',
  profilePhotoUrl: '/avatars/peter-costa.jpg',
  
  // Location & Mobility
  city: 'San Francisco',
  state: 'California',
  willingToRelocate: true,
  workAuthorization: 'US Citizen',
  
  // Contact Info
  email: 'peter.costa@example.com',
  phone: '+1 (555) 123-4567',
  linkedinUrl: 'https://linkedin.com/in/petercosta',
  githubUrl: 'https://github.com/petercosta',
  portfolioUrl: 'https://petercosta.dev',
  
  // Availability
  availability: 'Available immediately',
  currentStatus: 'Employed full-time, open to new opportunities',
  
  // Education
  highestEducation: 'Bachelor\'s Degree',
  
  // Timestamps
  createdAt: new Date('2022-01-15'),
  updatedAt: new Date('2024-01-15')
};

export const mockEducation: Education[] = [
  {
    id: 'edu-1',
    candidateId: 'user-12345',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Arizona State University',
    graduationDate: new Date('2020-05-15'),
    gpa: 3.7,
    honors: 'Magna Cum Laude',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'edu-2',
    candidateId: 'user-12345',
    degree: 'Certificate in Advanced Manufacturing',
    institution: 'Intel Manufacturing Academy',
    graduationDate: new Date('2023-08-30'),
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  }
];

export const mockFormalSkills: FormalSkill[] = [
  {
    id: 'skill-1',
    candidateId: 'user-12345',
    name: 'AWS Cloud Practitioner',
    type: 'Certification',
    proficiency: 'Intermediate',
    issuingOrganization: 'Amazon Web Services',
    dateEarned: new Date('2023-03-15'),
    credentialUrl: 'https://aws.amazon.com/verification/cert-12345',
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15')
  },
  {
    id: 'skill-2',
    candidateId: 'user-12345',
    name: 'Fiber Optic Splicing and Testing',
    type: 'Course',
    proficiency: 'Advanced',
    issuingOrganization: 'Corning Inc.',
    dateEarned: new Date('2023-11-20'),
    credentialUrl: 'https://corning.com/certificates/fiber-splicing-12345',
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2023-11-20')
  },
  {
    id: 'skill-3',
    candidateId: 'user-12345',
    name: 'React Development',
    type: 'Bootcamp',
    proficiency: 'Expert',
    issuingOrganization: 'General Assembly',
    dateEarned: new Date('2021-08-15'),
    credentialUrl: 'https://generalassemb.ly/certificates/react-dev-12345',
    createdAt: new Date('2021-08-15'),
    updatedAt: new Date('2021-08-15')
  },
  {
    id: 'skill-4',
    candidateId: 'user-12345',
    name: 'Semiconductor Manufacturing Processes',
    type: 'On-the-Job',
    proficiency: 'Intermediate',
    issuingOrganization: 'Intel Corporation',
    dateEarned: new Date('2022-12-01'),
    createdAt: new Date('2022-12-01'),
    updatedAt: new Date('2023-06-01')
  }
];

export const mockInformalSkills: InformalSkill[] = [
  {
    id: 'informal-1',
    candidateId: 'user-12345',
    skillName: 'Home Lab Networking',
    category: 'DIY',
    selfRating: 4,
    evidenceUrl: 'https://github.com/petercosta/home-lab-setup',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10')
  },
  {
    id: 'informal-2',
    candidateId: 'user-12345',
    skillName: 'Python Automation Scripts',
    category: 'Software',
    selfRating: 5,
    evidenceUrl: 'https://github.com/petercosta/automation-scripts',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15')
  },
  {
    id: 'informal-3',
    candidateId: 'user-12345',
    skillName: 'Technical Documentation',
    category: 'Communication',
    selfRating: 4,
    evidenceUrl: 'https://petercosta.dev/technical-writing',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-20')
  },
  {
    id: 'informal-4',
    candidateId: 'user-12345',
    skillName: 'Circuit Board Assembly',
    category: 'Mechanical',
    selfRating: 3,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-10')
  }
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    candidateId: 'user-12345',
    title: 'Smart Home IoT Dashboard',
    roleAndTools: 'Full Stack Developer - React, Node.js, Raspberry Pi, Arduino',
    description: 'Built a comprehensive home automation system that monitors energy usage, controls lighting, and manages security cameras. Reduced household energy consumption by 23% through intelligent scheduling and real-time monitoring.',
    mediaUrl: 'https://github.com/petercosta/smart-home-dashboard',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-09-15'),
    isActive: false,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-15')
  },
  {
    id: 'project-2',
    candidateId: 'user-12345',
    title: 'Manufacturing Quality Control System',
    roleAndTools: 'Lead Developer - Python, PostgreSQL, Computer Vision, OpenCV',
    description: 'Developed an automated quality control system for semiconductor wafer inspection using computer vision. Improved defect detection accuracy by 35% and reduced manual inspection time by 60%.',
    mediaUrl: 'https://petercosta.dev/projects/qc-system',
    startDate: new Date('2023-01-15'),
    endDate: new Date('2023-05-30'),
    isActive: false,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-05-30')
  },
  {
    id: 'project-3',
    candidateId: 'user-12345',
    title: 'Open Source Fiber Optic Testing Tool',
    roleAndTools: 'Contributor - JavaScript, Electron, Hardware Integration',
    description: 'Contributing to open-source software for fiber optic testing equipment calibration. Added real-time data visualization features and improved measurement accuracy algorithms.',
    mediaUrl: 'https://github.com/fiber-tools/optic-analyzer',
    startDate: new Date('2023-10-01'),
    isActive: true,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockWorkHistory: WorkHistory[] = [
  {
    id: 'work-1',
    candidateId: 'user-12345',
    companyName: 'Intel Corporation',
    roleTitle: 'Software Engineer II',
    startDate: new Date('2022-06-01'),
    isCurrentPosition: true,
    responsibilities: `• Develop and maintain manufacturing execution systems for semiconductor fabrication facilities
• Collaborate with cross-functional teams to optimize production workflows and reduce cycle time by 15%
• Implement automated testing frameworks that improved software quality and reduced bugs by 40%
• Mentor junior developers and lead code review sessions for team of 8 engineers
• Work directly with manufacturing engineers to translate business requirements into technical solutions`,
    createdAt: new Date('2022-06-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'work-2',
    candidateId: 'user-12345',
    companyName: 'GreenTech Innovations',
    roleTitle: 'Full Stack Developer',
    startDate: new Date('2021-01-15'),
    endDate: new Date('2022-05-30'),
    isCurrentPosition: false,
    responsibilities: `• Built responsive web applications for renewable energy monitoring systems using React and Node.js
• Developed RESTful APIs and microservices architecture handling 100K+ daily requests
• Integrated with IoT devices and third-party APIs for real-time energy data collection
• Implemented CI/CD pipelines using Jenkins and Docker, reducing deployment time by 70%
• Participated in Agile development process and contributed to technical architecture decisions`,
    createdAt: new Date('2021-01-15'),
    updatedAt: new Date('2022-05-30')
  },
  {
    id: 'work-3',
    candidateId: 'user-12345',
    companyName: 'TechStart Solutions',
    roleTitle: 'Junior Software Developer',
    startDate: new Date('2020-08-01'),
    endDate: new Date('2020-12-31'),
    isCurrentPosition: false,
    responsibilities: `• Developed front-end components for e-commerce platform using HTML, CSS, and JavaScript
• Collaborated with UX designers to implement pixel-perfect responsive designs
• Assisted in database design and optimization, improving query performance by 25%
• Participated in daily standups and sprint planning as part of Agile development team
• Gained experience with version control, testing frameworks, and deployment processes`,
    createdAt: new Date('2020-08-01'),
    updatedAt: new Date('2020-12-31')
  }
];

export const mockReferences: Reference[] = [
  {
    id: 'ref-1',
    candidateId: 'user-12345',
    name: 'Sarah Chen',
    relationship: 'Former Team Lead at Intel Corporation',
    contactInfo: 'sarah.chen@intel.com | (555) 987-6543',
    permissionToContact: true,
    letterUrl: 'https://drive.google.com/file/d/1234567890/view',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10')
  },
  {
    id: 'ref-2',
    candidateId: 'user-12345',
    name: 'Dr. Michael Rodriguez',
    relationship: 'Computer Science Professor at Arizona State University',
    contactInfo: 'michael.rodriguez@asu.edu | (555) 456-7890',
    permissionToContact: true,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10')
  },
  {
    id: 'ref-3',
    candidateId: 'user-12345',
    name: 'Jennifer Park',
    relationship: 'Former Manager at GreenTech Innovations',
    contactInfo: 'jennifer.park@greentech.com | (555) 234-5678',
    permissionToContact: true,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10')
  }
];

export const mockSystemMetrics: SystemMetrics = {
  id: 'metrics-1',
  candidateId: 'user-12345',
  aptitudeScore: 87,
  attitudeRating: 4.6,
  totalXP: 1825,
  currentLevel: 8,
  learningStreak: 15,
  coursesCompleted: 12,
  skillsVerified: 8,
  lastCalculated: new Date('2024-01-15'),
  createdAt: new Date('2022-01-15'),
  updatedAt: new Date('2024-01-15')
};

// ===================================================================
// COMPLETE PROFILE MOCK DATA
// ===================================================================

export const mockCompleteProfile: CompleteProfile = {
  candidate: mockCoreCandidate,
  education: mockEducation,
  formalSkills: mockFormalSkills,
  informalSkills: mockInformalSkills,
  projects: mockProjects,
  workHistory: mockWorkHistory,
  references: mockReferences,
  systemMetrics: mockSystemMetrics
};

// ===================================================================
// PROFILE COMPLETION STATUS
// ===================================================================

export const mockProfileCompletionStatus: ProfileCompletionStatus = {
  coreComplete: true,
  coreProgress: 95,
  optionalComplete: false,
  optionalProgress: 30,
  overallProgress: 75,
  requiredFields: ['workAuthorization', 'availability'],
  missingCoreFields: ['profilePhotoUrl'],
  missingOptionalFields: ['compensationPreferences', 'languages', 'learningProfile']
};

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

export const getCoreProfileProgress = (profile: CompleteProfile): number => {
  const requiredFields = [
    'firstName', 'lastName', 'email', 'workAuthorization', 
    'availability', 'currentStatus', 'city', 'state'
  ];
  
  const candidate = profile.candidate;
  const completedFields = requiredFields.filter(field => {
    const value = candidate[field as keyof CoreCandidate];
    return value !== null && value !== undefined && value !== '';
  });
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

export const getRequiredCoreFields = (profile: CompleteProfile): string[] => {
  const requiredFields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'workAuthorization', label: 'Work Authorization' },
    { key: 'availability', label: 'Availability' },
    { key: 'currentStatus', label: 'Current Status' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State/Region' }
  ];
  
  const candidate = profile.candidate;
  return requiredFields
    .filter(field => {
      const value = candidate[field.key as keyof CoreCandidate];
      return value === null || value === undefined || value === '';
    })
    .map(field => field.label);
};

// ===================================================================
// SKILLS UTILITY FUNCTIONS & TYPES (for src/ components compatibility)
// ===================================================================

export type SkillConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export interface UserSkill {
  id: string;
  skillTemplateId: string;
  userId: string;
  confidenceLevel: SkillConfidenceLevel;
  sourceType: 'self_reported' | 'verified' | 'assessed';
  verificationStatus: 'none' | 'pending' | 'verified' | 'expired';
  acquiredDate: string;
  isHidden: boolean;
  evidence?: any[];
}

export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  domainId: string;
  aliases: string[];
  isCore: boolean;
}

export interface SkillDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  skills: SkillTemplate[];
}

export const mockSkillDomains: SkillDomain[] = [
  {
    id: 'electronics',
    name: 'Electronics & Electrical',
    description: 'Circuit analysis, component testing, electrical safety',
    icon: '⚡',
    color: 'bg-yellow-500',
    skills: [
      { id: 'multimeter', name: 'Multimeter Usage', description: 'Voltage, current, and resistance measurement', domainId: 'electronics', aliases: ['DMM', 'voltmeter'], isCore: true },
      { id: 'soldering', name: 'Soldering', description: 'Through-hole and SMD component soldering', domainId: 'electronics', aliases: ['solder'], isCore: true }
    ]
  }
];

export const getConfidenceLevelText = (level: SkillConfidenceLevel): string => {
  const texts = {
    1: 'Beginner',
    2: 'Novice', 
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert'
  };
  return texts[level];
};

export const getConfidenceLevelEmoji = (level: SkillConfidenceLevel): string => {
  const emojis = {
    1: '🌱',
    2: '🌿',
    3: '🌳',
    4: '🏆',
    5: '⭐'
  };
  return emojis[level];
};

export const getConfidenceLevelColor = (level: SkillConfidenceLevel): string => {
  const colors = {
    1: 'bg-gray-100 text-gray-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-green-100 text-green-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-purple-100 text-purple-800'
  };
  return colors[level];
};

export const getVerificationStatusText = (status: UserSkill['verificationStatus']): string => {
  const texts = {
    none: 'Not Verified',
    pending: 'Verification Pending',
    verified: 'Verified',
    expired: 'Verification Expired'
  };
  return texts[status];
};

export const getVerificationStatusColor = (status: UserSkill['verificationStatus']): string => {
  const colors = {
    none: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800'
  };
  return colors[status];
};

export const getSkillTemplate = (templateId: string): SkillTemplate | undefined => {
  for (const domain of mockSkillDomains) {
    const skill = domain.skills.find(s => s.id === templateId);
    if (skill) return skill;
  }
  return undefined;
};

export const getSkillDomain = (domainId: string): SkillDomain | undefined => {
  return mockSkillDomains.find(d => d.id === domainId);
}; 