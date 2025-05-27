import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== PROFILE SYSTEM DATABASE SCHEMA =======================================
This schema defines the complete profile system with core data (shared with 
employers) and optional data (for personalization only). All relationships
are properly defined with authorization rules.
=========================================================================*/

const schema = a.schema({
  
  // ===================================================================
  // CORE PROFILE DATA (Shared with Employers)
  // ===================================================================
  
  Candidate: a
    .model({
      // Basic Information
      firstName: a.string().required(),
      lastName: a.string().required(),
      preferredPronouns: a.string(),
      headline: a.string(), // Elevator pitch
      profilePhotoUrl: a.string(),
      
      // Location & Mobility
      city: a.string(),
      state: a.string(),
      willingToRelocate: a.boolean().default(false),
      workAuthorization: a.string().required(), // 'US Citizen', 'Permanent Resident', etc.
      
      // Contact Info
      email: a.string().required(),
      phone: a.string(),
      linkedinUrl: a.string(),
      githubUrl: a.string(),
      portfolioUrl: a.string(),
      
      // Availability
      availability: a.string().required(), // 'Immediate', 'In 2 weeks', etc.
      currentStatus: a.string().required(), // 'Full-time student', 'Employed', etc.
      
      // Education
      highestEducation: a.string(), // 'High School', 'Bachelor\'s', etc.
      
      // Relationships
      education: a.hasMany('Education', 'candidateId'),
      formalSkills: a.hasMany('FormalSkill', 'candidateId'),
      informalSkills: a.hasMany('InformalSkill', 'candidateId'),
      projects: a.hasMany('Project', 'candidateId'),
      workHistory: a.hasMany('WorkHistory', 'candidateId'),
      references: a.hasMany('Reference', 'candidateId'),
      
      // Optional data relationships
      compensationPreferences: a.hasOne('CompensationPreferences', 'candidateId'),
      languages: a.hasMany('LanguageSkill', 'candidateId'),
      transportation: a.hasOne('TransportationLogistics', 'candidateId'),
      learningProfile: a.hasOne('LearningProfile', 'candidateId'),
      eeoData: a.hasOne('EEOData', 'candidateId'),
      systemMetrics: a.hasOne('SystemMetrics', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  Education: a
    .model({
      candidateId: a.id().required(),
      degree: a.string().required(), // 'Bachelor of Science in Computer Science'
      institution: a.string().required(), // 'Arizona State University'
      graduationDate: a.date(),
      gpa: a.float(),
      honors: a.string(), // 'Magna Cum Laude', 'Dean\'s List'
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  FormalSkill: a
    .model({
      candidateId: a.id().required(),
      name: a.string().required(), // 'Fiber Optic Splicing', 'AWS Cloud Practitioner'
      type: a.enum(['Course', 'Certification', 'OnTheJob', 'Bootcamp']),
      proficiency: a.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
      issuingOrganization: a.string(), // 'Amazon Web Services', 'Cisco'
      dateEarned: a.date(),
      credentialUrl: a.string(), // Link to badge or certificate
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  InformalSkill: a
    .model({
      candidateId: a.id().required(),
      skillName: a.string().required(), // 'Home Lab Wiring', 'Python Scripting'
      category: a.string(), // 'DIY', 'Software', 'Mechanical', 'Communication'
      selfRating: a.integer().required(), // 1-5 scale
      evidenceUrl: a.string(), // Optional proof link
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  Project: a
    .model({
      candidateId: a.id().required(),
      title: a.string().required(),
      roleAndTools: a.string().required(), // 'Lead Assembler – Multimeter, Fiber Kit'
      description: a.string().required(), // Key outcomes and achievements
      mediaUrl: a.string(), // Link to image/video/GitHub repo
      startDate: a.date(),
      endDate: a.date(),
      isActive: a.boolean().default(false), // Still working on it
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  WorkHistory: a
    .model({
      candidateId: a.id().required(),
      companyName: a.string().required(),
      roleTitle: a.string().required(),
      startDate: a.date(),
      endDate: a.date(), // null if current position
      responsibilities: a.string().required(), // Bullet-list format or paragraph
      isCurrentPosition: a.boolean().default(false),
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  Reference: a
    .model({
      candidateId: a.id().required(),
      name: a.string().required(),
      relationship: a.string().required(), // 'Former Manager', 'Professor', 'Colleague'
      contactInfo: a.string().required(), // Email/phone
      letterUrl: a.string(), // Optional letter upload link
      permissionToContact: a.boolean().default(false),
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  // ===================================================================
  // OPTIONAL & ADVANCED DATA (Not Shared with Employers)
  // ===================================================================

  CompensationPreferences: a
    .model({
      candidateId: a.id().required(),
      desiredSalaryMin: a.integer(),
      desiredSalaryMax: a.integer(),
      preferredEmploymentType: a.enum(['FullTime', 'PartTime', 'Contract', 'Freelance']),
      weeklyAvailability: a.integer(), // hours per week
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  LanguageSkill: a
    .model({
      candidateId: a.id().required(),
      language: a.string().required(),
      proficiency: a.enum(['Basic', 'Conversational', 'Fluent', 'Native']),
      isNative: a.boolean().default(false),
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  TransportationLogistics: a
    .model({
      candidateId: a.id().required(),
      hasDriversLicense: a.boolean().default(false),
      hasVehicle: a.boolean().default(false),
      commuteRadius: a.integer(), // miles
      preferredWorkMode: a.enum(['Remote', 'OnSite', 'Hybrid']),
      internetSpeed: a.string(), // 'High-speed broadband', '5G'
      hasHomeOfficeSetup: a.boolean().default(false),
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  LearningProfile: a
    .model({
      candidateId: a.id().required(),
      preferredFormats: a.string().array(), // ['Video', 'Text', 'Interactive', 'VR']
      preferredTimeOfDay: a.enum(['Morning', 'Afternoon', 'Evening', 'Flexible']),
      preferredPace: a.enum(['SelfPaced', 'Structured', 'Intensive']),
      weeklyLearningGoal: a.integer(), // hours
      learningStyle: a.enum(['Visual', 'Auditory', 'Kinesthetic', 'ReadingWriting']),
      groupVsSolo: a.enum(['Solo', 'Group', 'Mixed']),
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  EEOData: a
    .model({
      candidateId: a.id().required(),
      veteranStatus: a.enum(['Veteran', 'NotAVeteran', 'PreferNotToAnswer']),
      disabilityStatus: a.enum(['Yes', 'No', 'PreferNotToAnswer']),
      accommodationNeeds: a.string(),
      race: a.string(),
      gender: a.string(),
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

  // ===================================================================
  // SYSTEM-CALCULATED METRICS (Auto-generated)
  // ===================================================================

  SystemMetrics: a
    .model({
      candidateId: a.id().required(),
      aptitudeScore: a.integer(), // 0-100 calculated score
      attitudeRating: a.float(), // 1-5 calculated rating
      totalXP: a.integer().default(0),
      currentLevel: a.integer().default(1),
      learningStreak: a.integer().default(0), // days
      coursesCompleted: a.integer().default(0),
      skillsVerified: a.integer().default(0),
      lastCalculated: a.datetime(),
      
      candidate: a.belongsTo('Candidate', 'candidateId'),
    })
    .authorization((allow) => [allow.owner()]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== USAGE EXAMPLES =====================================================
Here are examples of how to use this schema in your frontend:

// Create a new candidate profile
const newCandidate = await client.models.Candidate.create({
  firstName: "Peter",
  lastName: "Costa",
  email: "peter@example.com",
  workAuthorization: "US Citizen",
  availability: "Available immediately",
  currentStatus: "Employed full-time, open to new opportunities"
});

// Add education to a candidate
const education = await client.models.Education.create({
  candidateId: candidateId,
  degree: "Bachelor of Science in Computer Science",
  institution: "Arizona State University",
  graduationDate: "2020-05-15",
  gpa: 3.7,
  honors: "Magna Cum Laude"
});

// Query candidate with all related data
const candidateWithProfile = await client.models.Candidate.get({
  id: candidateId
}, {
  include: {
    education: true,
    formalSkills: true,
    informalSkills: true,
    projects: true,
    workHistory: true,
    references: true,
    systemMetrics: true
  }
});

// Get only employer-shared data (exclude optional fields)
const employerProfile = await client.models.Candidate.get({
  id: candidateId
}, {
  include: {
    education: true,
    formalSkills: true,
    informalSkills: true,
    projects: true,
    workHistory: true,
    references: true
    // Note: excludes compensationPreferences, learningProfile, etc.
  }
});
=========================================================================*/
