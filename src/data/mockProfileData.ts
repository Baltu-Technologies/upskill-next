// Mock data for User Profile Management UI development
// This allows UI components to be built and tested before backend is ready

// ============================================
// CORE PROFILE INTERFACES
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  lastActive: string;
  profileCompleteness: number; // 0-100
  isPublic: boolean;
  location?: {
    city?: string;
    state?: string;
    country: string;
  };
  timezone?: string;
  preferredLanguage: string;
}

// ============================================
// CAREER PREFERENCES INTERFACES
// ============================================

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetDate?: string;
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  category: 'short_term' | 'medium_term' | 'long_term';
  requiredSkills?: string[]; // Skill template IDs
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  industry?: string;
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  interestLevel: 1 | 2 | 3 | 4 | 5; // 1 = Not interested, 5 = Very interested
  requiredSkills?: string[]; // Skill template IDs
}

export interface CareerPreferences {
  id: string;
  userId: string;
  currentRole?: string;
  yearsOfExperience: number;
  targetRoles: JobRole[];
  preferredIndustries: string[];
  careerGoals: CareerGoal[];
  workPreferences: {
    remoteWork: 'required' | 'preferred' | 'no_preference' | 'not_preferred';
    travelWillingness: 'none' | 'occasional' | 'frequent' | 'extensive';
    teamSize: 'small' | 'medium' | 'large' | 'no_preference';
    managementInterest: boolean;
  };
  salaryExpectations?: {
    currency: string;
    minSalary?: number;
    maxSalary?: number;
    benefits: string[];
  };
  updatedAt: string;
}

// ============================================
// LEARNING HISTORY INTERFACES
// ============================================

export interface LearningActivity {
  id: string;
  type: 'course' | 'certification' | 'workshop' | 'bootcamp' | 'degree' | 'self_study' | 'project' | 'mentorship';
  title: string;
  description?: string;
  provider: string;
  instructor?: string;
  duration?: string; // e.g., "40 hours", "6 weeks"
  startDate: string;
  endDate?: string;
  completionDate?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'dropped';
  progress: number; // 0-100
  certificateUrl?: string;
  credentialId?: string;
  skillsLearned: string[]; // Skill template IDs
  rating?: 1 | 2 | 3 | 4 | 5; // User's rating of the learning experience
  notes?: string;
  cost?: number;
  currency?: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'certification' | 'award' | 'recognition' | 'milestone' | 'project_completion';
  earnedDate: string;
  issuer: string;
  credentialUrl?: string;
  expirationDate?: string;
  isVerified: boolean;
  skillsRelated: string[]; // Skill template IDs
  icon?: string;
}

export interface LearningHistory {
  id: string;
  userId: string;
  activities: LearningActivity[];
  achievements: Achievement[];
  totalHoursLearned: number;
  totalCertifications: number;
  learningStreak: number; // Days of consecutive learning
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  weeklyLearningGoal: number; // Hours per week
  currentFocus: string[]; // Current learning topics/skills
  updatedAt: string;
}

// ============================================
// SKILLS INVENTORY INTERFACES
// ============================================

export type SkillConfidenceLevel = 0 | 1 | 2 | 3 | 4;
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';
export type SkillSourceType = 'self_reported' | 'instructor_verified' | 'employer_verified' | 'peer_endorsed' | 'auto_detected';

export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  domainId: string;
  aliases: string[];
  isCore: boolean; // Whether this is a core skill for the domain
}

export interface SkillDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string; // Tailwind color class
  skills: SkillTemplate[];
}

export interface SkillEvidence {
  id: string;
  type: 'certificate' | 'project' | 'work_sample' | 'reference' | 'assessment';
  title: string;
  description?: string;
  url?: string;
  fileUrl?: string;
  uploadedAt: string;
  verifiedBy?: string;
  verificationDate?: string;
}

export interface UserSkill {
  id: string;
  skillTemplateId: string;
  userId: string;
  confidenceLevel: SkillConfidenceLevel;
  sourceType: SkillSourceType;
  verificationStatus: VerificationStatus;
  evidence?: SkillEvidence[];
  acquiredDate: string;
  lastUpdated?: string;
  endorsements?: string[]; // User IDs who endorsed this skill
  notes?: string;
  isHidden: boolean;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getConfidenceLevelText = (level: SkillConfidenceLevel): string => {
  const texts = {
    0: 'No Experience',
    1: 'Beginner',
    2: 'Intermediate', 
    3: 'Advanced',
    4: 'Expert'
  };
  return texts[level];
};

export const getConfidenceLevelEmoji = (level: SkillConfidenceLevel): string => {
  const emojis = {
    0: '❓',
    1: '🌱',
    2: '🌿',
    3: '🌳',
    4: '🏆'
  };
  return emojis[level];
};

export const getConfidenceLevelColor = (level: SkillConfidenceLevel): string => {
  const colors = {
    0: 'bg-gray-100 text-gray-700',
    1: 'bg-red-100 text-red-700',
    2: 'bg-yellow-100 text-yellow-700',
    3: 'bg-blue-100 text-blue-700',
    4: 'bg-green-100 text-green-700'
  };
  return colors[level];
};

export const getVerificationStatusText = (status: VerificationStatus): string => {
  const texts = {
    none: 'Not Verified',
    pending: 'Pending Verification',
    verified: 'Verified',
    rejected: 'Verification Failed'
  };
  return texts[status];
};

export const getVerificationStatusColor = (status: VerificationStatus): string => {
  const colors = {
    none: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };
  return colors[status];
};

export const getSkillTemplate = (id: string): SkillTemplate | null => {
  for (const domain of mockSkillDomains) {
    const skill = domain.skills.find(s => s.id === id);
    if (skill) return skill;
  }
  return null;
};

export const getSkillDomain = (id: string): SkillDomain | null => {
  return mockSkillDomains.find(d => d.id === id) || null;
};

// ============================================
// MOCK DATA
// ============================================

// Mock data with comprehensive skill domains
export const mockSkillDomains: SkillDomain[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic circuits, components, and systems',
    icon: '⚡',
    color: 'bg-yellow-500',
    skills: [
      {
        id: 'circuit-analysis',
        name: 'Circuit Analysis',
        description: 'Analyzing electrical circuits using Ohm\'s law, Kirchhoff\'s laws',
        domainId: 'electronics',
        aliases: ['Circuit Theory', 'Electrical Analysis'],
        isCore: true
      },
      {
        id: 'soldering',
        name: 'Soldering',
        description: 'Hand soldering and surface mount component assembly',
        domainId: 'electronics',
        aliases: ['Hand Soldering', 'SMT Soldering'],
        isCore: true
      },
      {
        id: 'pcb-design',
        name: 'PCB Design',
        description: 'Printed circuit board layout and design using CAD tools',
        domainId: 'electronics',
        aliases: ['PCB Layout', 'Board Design'],
        isCore: true
      },
      {
        id: 'microcontrollers',
        name: 'Microcontrollers',
        description: 'Programming and interfacing with microcontroller systems',
        domainId: 'electronics',
        aliases: ['MCU Programming', 'Embedded Controllers'],
        isCore: true
      },
      {
        id: 'digital-logic',
        name: 'Digital Logic',
        description: 'Boolean algebra, logic gates, and digital circuit design',
        domainId: 'electronics',
        aliases: ['Logic Design', 'Digital Circuits'],
        isCore: false
      }
    ]
  },
  {
    id: 'mechatronics',
    name: 'Mechatronics',
    description: 'Integration of mechanical, electrical, and software systems',
    icon: '⚙️',
    color: 'bg-blue-500',
    skills: [
      {
        id: 'pid-control',
        name: 'PID Control',
        description: 'Proportional-Integral-Derivative control system design',
        domainId: 'mechatronics',
        aliases: ['Control Systems', 'Feedback Control'],
        isCore: true
      },
      {
        id: 'sensors-actuators',
        name: 'Sensors & Actuators',
        description: 'Selection and integration of sensors and actuators',
        domainId: 'mechatronics',
        aliases: ['Sensor Integration', 'Actuator Control'],
        isCore: true
      },
      {
        id: 'robotics',
        name: 'Robotics',
        description: 'Robotic system design, kinematics, and dynamics',
        domainId: 'mechatronics',
        aliases: ['Robot Design', 'Automation Systems'],
        isCore: true
      },
      {
        id: 'plc-programming',
        name: 'PLC Programming',
        description: 'Programmable Logic Controller programming and ladder logic',
        domainId: 'mechatronics',
        aliases: ['Ladder Logic', 'Industrial Control'],
        isCore: false
      }
    ]
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Software development and programming languages',
    icon: '💻',
    color: 'bg-green-500',
    skills: [
      {
        id: 'python',
        name: 'Python',
        description: 'Python programming language and its frameworks',
        domainId: 'programming',
        aliases: ['Python Development', 'Python Scripting'],
        isCore: true
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        description: 'JavaScript programming for web and application development',
        domainId: 'programming',
        aliases: ['JS', 'Web Programming'],
        isCore: true
      },
      {
        id: 'c-cpp',
        name: 'C/C++',
        description: 'C and C++ programming for system and embedded development',
        domainId: 'programming',
        aliases: ['C Programming', 'C++ Development'],
        isCore: true
      },
      {
        id: 'git-version-control',
        name: 'Git & Version Control',
        description: 'Git version control system and collaborative development',
        domainId: 'programming',
        aliases: ['Git', 'Version Control', 'Source Control'],
        isCore: true
      },
      {
        id: 'databases',
        name: 'Database Management',
        description: 'SQL and NoSQL database design and management',
        domainId: 'programming',
        aliases: ['SQL', 'Database Design', 'Data Management'],
        isCore: false
      }
    ]
  },
  {
    id: 'safety',
    name: 'Safety & Compliance',
    description: 'Workplace safety, regulations, and compliance standards',
    icon: '🦺',
    color: 'bg-red-500',
    skills: [
      {
        id: 'electrical-safety',
        name: 'Electrical Safety',
        description: 'Safe practices when working with electrical systems',
        domainId: 'safety',
        aliases: ['Electrical Safety Procedures', 'High Voltage Safety'],
        isCore: true
      },
      {
        id: 'lockout-tagout',
        name: 'Lockout/Tagout (LOTO)',
        description: 'Energy isolation and lockout/tagout procedures',
        domainId: 'safety',
        aliases: ['LOTO', 'Energy Isolation'],
        isCore: true
      },
      {
        id: 'hazmat',
        name: 'Hazardous Materials',
        description: 'Safe handling and disposal of hazardous materials',
        domainId: 'safety',
        aliases: ['HazMat', 'Chemical Safety'],
        isCore: false
      },
      {
        id: 'osha-compliance',
        name: 'OSHA Compliance',
        description: 'Understanding and implementing OSHA safety standards',
        domainId: 'safety',
        aliases: ['OSHA Standards', 'Workplace Safety'],
        isCore: true
      }
    ]
  },
  {
    id: 'soft-skills',
    name: 'Professional Skills',
    description: 'Communication, teamwork, and professional development',
    icon: '🤝',
    color: 'bg-purple-500',
    skills: [
      {
        id: 'communication',
        name: 'Technical Communication',
        description: 'Effective written and verbal technical communication',
        domainId: 'soft-skills',
        aliases: ['Communication Skills', 'Technical Writing'],
        isCore: true
      },
      {
        id: 'teamwork',
        name: 'Teamwork & Collaboration',
        description: 'Working effectively in team environments',
        domainId: 'soft-skills',
        aliases: ['Team Collaboration', 'Group Work'],
        isCore: true
      },
      {
        id: 'problem-solving',
        name: 'Problem Solving',
        description: 'Analytical thinking and systematic problem resolution',
        domainId: 'soft-skills',
        aliases: ['Critical Thinking', 'Troubleshooting'],
        isCore: true
      },
      {
        id: 'project-management',
        name: 'Project Management',
        description: 'Planning, organizing, and managing technical projects',
        domainId: 'soft-skills',
        aliases: ['Project Planning', 'Time Management'],
        isCore: false
      },
      {
        id: 'continuous-learning',
        name: 'Continuous Learning',
        description: 'Commitment to ongoing professional development',
        domainId: 'soft-skills',
        aliases: ['Professional Development', 'Self-Learning'],
        isCore: true
      }
    ]
  }
];

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  email: 'alex.chen@example.com',
  displayName: 'Alex Chen',
  firstName: 'Alex',
  lastName: 'Chen',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: '2024-01-15T08:00:00Z',
  lastActive: '2024-12-18T14:30:00Z',
  profileCompleteness: 75,
  isPublic: true,
  location: {
    city: 'Austin',
    state: 'Texas',
    country: 'United States'
  },
  timezone: 'America/Chicago',
  preferredLanguage: 'en'
};

export const mockUserSkills: UserSkill[] = [
  {
    id: 'user-skill-1',
    skillTemplateId: 'circuit-analysis',
    userId: 'user-1',
    confidenceLevel: 3,
    sourceType: 'instructor_verified',
    verificationStatus: 'verified',
    acquiredDate: '2024-03-15T00:00:00Z',
    evidence: [
      {
        id: 'evidence-1',
        type: 'certificate',
        title: 'Circuit Analysis Course Certificate',
        description: 'Completed advanced circuit analysis course with 95% grade',
        uploadedAt: '2024-03-16T00:00:00Z',
        verifiedBy: 'instructor-1',
        verificationDate: '2024-03-17T00:00:00Z'
      }
    ],
    isHidden: false
  },
  {
    id: 'user-skill-2',
    skillTemplateId: 'soldering',
    userId: 'user-1',
    confidenceLevel: 2,
    sourceType: 'self_reported',
    verificationStatus: 'none',
    acquiredDate: '2024-02-10T00:00:00Z',
    notes: 'Practiced with through-hole components, learning SMT',
    isHidden: false
  },
  {
    id: 'user-skill-3',
    skillTemplateId: 'python',
    userId: 'user-1',
    confidenceLevel: 4,
    sourceType: 'employer_verified',
    verificationStatus: 'verified',
    acquiredDate: '2023-06-01T00:00:00Z',
    evidence: [
      {
        id: 'evidence-2',
        type: 'project',
        title: 'Automation Scripts Portfolio',
        description: 'Collection of Python automation scripts used in production',
        url: 'https://github.com/alexchen/automation-scripts',
        uploadedAt: '2024-01-20T00:00:00Z'
      }
    ],
    endorsements: ['colleague-1', 'colleague-2'],
    isHidden: false
  },
  {
    id: 'user-skill-4',
    skillTemplateId: 'communication',
    userId: 'user-1',
    confidenceLevel: 3,
    sourceType: 'peer_endorsed',
    verificationStatus: 'none',
    acquiredDate: '2023-08-15T00:00:00Z',
    endorsements: ['peer-1', 'peer-2', 'peer-3'],
    notes: 'Regularly present technical updates to cross-functional teams',
    isHidden: false
  },
  {
    id: 'user-skill-5',
    skillTemplateId: 'git-version-control',
    userId: 'user-1',
    confidenceLevel: 3,
    sourceType: 'self_reported',
    verificationStatus: 'none',
    acquiredDate: '2023-05-20T00:00:00Z',
    notes: 'Use Git daily for all projects, comfortable with branching and merging',
    isHidden: false
  }
];

// Helper function to get user skills for a specific domain
export const getUserSkillsByDomain = (domainId: string): UserSkill[] => {
  const domain = getSkillDomain(domainId);
  if (!domain) return [];
  
  const domainSkillIds = domain.skills.map(s => s.id);
  return mockUserSkills.filter(userSkill => {
    const template = getSkillTemplate(userSkill.skillTemplateId);
    return template && domainSkillIds.includes(template.id);
  });
};

// Calculate overall skills completion percentage
export const calculateSkillsCompleteness = (): number => {
  const totalCoreSkills = mockSkillDomains.reduce((total, domain) => 
    total + domain.skills.filter(skill => skill.isCore).length, 0
  );
  
  const completedCoreSkills = mockSkillDomains.reduce((total, domain) => 
    total + domain.skills.filter(skill => 
      skill.isCore && mockUserSkills.some(userSkill => userSkill.skillTemplateId === skill.id)
    ).length, 0
  );
  
  return totalCoreSkills > 0 ? Math.round((completedCoreSkills / totalCoreSkills) * 100) : 0;
};

// ============================================
// CAREER PREFERENCES MOCK DATA
// ============================================

export const mockCareerPreferences: CareerPreferences = {
  id: 'career-pref-1',
  userId: 'user-1',
  currentRole: 'Electronics Technician',
  yearsOfExperience: 3,
  targetRoles: [
    {
      id: 'role-1',
      title: 'Embedded Systems Engineer',
      description: 'Design and develop embedded systems for IoT devices',
      industry: 'Technology',
      level: 'mid',
      interestLevel: 5,
      requiredSkills: ['microcontrollers', 'embedded-programming', 'circuit-analysis']
    },
    {
      id: 'role-2',
      title: 'Automation Engineer',
      description: 'Develop automated solutions for manufacturing processes',
      industry: 'Manufacturing',
      level: 'mid',
      interestLevel: 4,
      requiredSkills: ['plc-programming', 'python', 'industrial-automation']
    },
    {
      id: 'role-3',
      title: 'Technical Lead',
      description: 'Lead technical teams and mentor junior engineers',
      industry: 'Technology',
      level: 'senior',
      interestLevel: 3,
      requiredSkills: ['project-management', 'communication', 'teamwork']
    }
  ],
  preferredIndustries: ['Technology', 'Manufacturing', 'Automotive', 'Aerospace'],
  careerGoals: [
    {
      id: 'goal-1',
      title: 'Complete Embedded Systems Certification',
      description: 'Earn industry-recognized certification in embedded systems design',
      targetDate: '2025-06-30',
      priority: 'high',
      progress: 65,
      category: 'short_term',
      requiredSkills: ['microcontrollers', 'embedded-programming', 'pcb-design'],
      isCompleted: false,
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z'
    },
    {
      id: 'goal-2',
      title: 'Transition to Senior Engineer Role',
      description: 'Advance to a senior engineering position with team leadership responsibilities',
      targetDate: '2026-12-31',
      priority: 'high',
      progress: 25,
      category: 'medium_term',
      requiredSkills: ['project-management', 'communication', 'teamwork', 'continuous-learning'],
      isCompleted: false,
      createdAt: '2024-10-15T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z'
    },
    {
      id: 'goal-3',
      title: 'Master Advanced Programming Skills',
      description: 'Become proficient in advanced programming concepts and frameworks',
      targetDate: '2025-12-31',
      priority: 'medium',
      progress: 40,
      category: 'medium_term',
      requiredSkills: ['python', 'embedded-programming', 'git-version-control'],
      isCompleted: false,
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-12-18T00:00:00Z'
    }
  ],
  workPreferences: {
    remoteWork: 'preferred',
    travelWillingness: 'occasional',
    teamSize: 'medium',
    managementInterest: true
  },
  salaryExpectations: {
    currency: 'USD',
    minSalary: 75000,
    maxSalary: 95000,
    benefits: ['Health Insurance', 'Retirement Plan', 'Professional Development Budget', 'Flexible PTO']
  },
  updatedAt: '2024-12-18T00:00:00Z'
};

// ============================================
// LEARNING HISTORY MOCK DATA
// ============================================

export const mockLearningHistory: LearningHistory = {
  id: 'learning-history-1',
  userId: 'user-1',
  totalHoursLearned: 245,
  totalCertifications: 3,
  learningStreak: 12,
  preferredLearningStyle: 'visual',
  weeklyLearningGoal: 8,
  currentFocus: ['Embedded Systems', 'Python Programming', 'PCB Design'],
  activities: [
    {
      id: 'activity-1',
      type: 'course',
      title: 'Embedded Systems Programming with C++',
      description: 'Comprehensive course covering microcontroller programming and real-time systems',
      provider: 'TechEd Academy',
      instructor: 'Dr. Sarah Johnson',
      duration: '80 hours',
      startDate: '2024-10-01T00:00:00Z',
      endDate: '2024-12-15T00:00:00Z',
      completionDate: '2024-12-10T00:00:00Z',
      status: 'completed',
      progress: 100,
      certificateUrl: 'https://teched.com/certificates/embedded-cpp-alex-chen',
      credentialId: 'TECHED-EMB-2024-1234',
      skillsLearned: ['embedded-programming', 'microcontrollers', 'real-time-systems'],
      rating: 5,
      notes: 'Excellent course with hands-on projects. The real-time systems module was particularly valuable.',
      cost: 299,
      currency: 'USD',
      tags: ['Programming', 'Hardware', 'Certification']
    },
    {
      id: 'activity-2',
      type: 'certification',
      title: 'IPC Soldering Certification (J-STD-001)',
      description: 'Industry standard certification for electronic soldering',
      provider: 'IPC International',
      duration: '16 hours',
      startDate: '2024-08-15T00:00:00Z',
      completionDate: '2024-08-17T00:00:00Z',
      status: 'completed',
      progress: 100,
      certificateUrl: 'https://ipc.org/certificates/j-std-001-alex-chen',
      credentialId: 'IPC-J001-2024-5678',
      skillsLearned: ['soldering', 'quality-control'],
      rating: 4,
      cost: 450,
      currency: 'USD',
      tags: ['Hardware', 'Manufacturing', 'Quality']
    },
    {
      id: 'activity-3',
      type: 'course',
      title: 'Python for Industrial Automation',
      description: 'Learn to use Python for automation and data analysis in industrial settings',
      provider: 'AutomationU',
      instructor: 'Mark Thompson',
      duration: '40 hours',
      startDate: '2024-11-01T00:00:00Z',
      endDate: '2024-12-31T00:00:00Z',
      status: 'in_progress',
      progress: 75,
      skillsLearned: ['python', 'industrial-automation', 'data-analysis'],
      rating: 4,
      notes: 'Great practical examples, working on final automation project',
      cost: 199,
      currency: 'USD',
      tags: ['Programming', 'Automation', 'Data']
    },
    {
      id: 'activity-4',
      type: 'workshop',
      title: 'PCB Design Fundamentals Workshop',
      description: 'Hands-on workshop covering PCB design principles and CAD tools',
      provider: 'Circuit Design Institute',
      instructor: 'Lisa Rodriguez',
      duration: '24 hours',
      startDate: '2024-07-10T00:00:00Z',
      endDate: '2024-07-12T00:00:00Z',
      completionDate: '2024-07-12T00:00:00Z',
      status: 'completed',
      progress: 100,
      skillsLearned: ['pcb-design', 'cad-tools'],
      rating: 5,
      notes: 'Excellent hands-on experience with industry-standard tools',
      cost: 350,
      currency: 'USD',
      tags: ['Hardware', 'Design', 'CAD']
    },
    {
      id: 'activity-5',
      type: 'self_study',
      title: 'Git Version Control Mastery',
      description: 'Self-paced learning of advanced Git workflows and collaboration',
      provider: 'Self-Study',
      duration: '25 hours',
      startDate: '2024-06-01T00:00:00Z',
      completionDate: '2024-06-30T00:00:00Z',
      status: 'completed',
      progress: 100,
      skillsLearned: ['git-version-control'],
      rating: 4,
      notes: 'Used online tutorials and documentation, practiced with personal projects',
      cost: 0,
      currency: 'USD',
      tags: ['Programming', 'Version Control', 'Self-Study']
    }
  ],
  achievements: [
    {
      id: 'achievement-1',
      title: 'IPC J-STD-001 Certified Specialist',
      description: 'Industry-recognized certification for electronic soldering standards',
      type: 'certification',
      earnedDate: '2024-08-17T00:00:00Z',
      issuer: 'IPC International',
      credentialUrl: 'https://ipc.org/certificates/j-std-001-alex-chen',
      expirationDate: '2027-08-17T00:00:00Z',
      isVerified: true,
      skillsRelated: ['soldering', 'quality-control'],
      icon: '🏆'
    },
    {
      id: 'achievement-2',
      title: 'Embedded Systems Programming Graduate',
      description: 'Successfully completed comprehensive embedded systems course',
      type: 'certification',
      earnedDate: '2024-12-10T00:00:00Z',
      issuer: 'TechEd Academy',
      credentialUrl: 'https://teched.com/certificates/embedded-cpp-alex-chen',
      isVerified: true,
      skillsRelated: ['embedded-programming', 'microcontrollers'],
      icon: '📜'
    },
    {
      id: 'achievement-3',
      title: 'Continuous Learner Streak',
      description: 'Maintained daily learning activity for 12 consecutive days',
      type: 'milestone',
      earnedDate: '2024-12-18T00:00:00Z',
      issuer: 'Learning Platform',
      isVerified: false,
      skillsRelated: ['continuous-learning'],
      icon: '🔥'
    }
  ],
  updatedAt: '2024-12-18T00:00:00Z'
};

// Helper functions for career preferences and learning history
export const getCareerGoalsByCategory = (category: 'short_term' | 'medium_term' | 'long_term'): CareerGoal[] => {
  return mockCareerPreferences.careerGoals.filter(goal => goal.category === category);
};

export const getActiveLearningActivities = (): LearningActivity[] => {
  return mockLearningHistory.activities.filter(activity => 
    activity.status === 'in_progress' || activity.status === 'not_started'
  );
};

export const getCompletedLearningActivities = (): LearningActivity[] => {
  return mockLearningHistory.activities.filter(activity => activity.status === 'completed');
};

export const getRecentAchievements = (days: number = 30): Achievement[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return mockLearningHistory.achievements.filter(achievement => 
    new Date(achievement.earnedDate) >= cutoffDate
  );
};