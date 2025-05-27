import { Amplify } from 'aws-amplify';
import { ProfileService } from '@/lib/data/profileService';
import outputs from "@/amplify_outputs.json";

// Configure Amplify
Amplify.configure(outputs);

/**
 * Database Seeder Script
 * Populates DynamoDB with initial profile data for Peter Costa
 */

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Step 1: Create the main candidate profile
    console.log('👤 Creating candidate profile...');
    const candidateResult = await ProfileService.createCandidate({
      firstName: 'Peter',
      lastName: 'Costa',
      preferredPronouns: 'he/him',
      headline: 'Full Stack Developer specializing in cloud infrastructure and IoT systems. Passionate about semiconductor manufacturing and emerging technologies.',
      city: 'Phoenix',
      state: 'Arizona',
      email: 'peter.costa@email.com',
      phone: '(555) 123-4567',
      linkedinUrl: 'https://linkedin.com/in/petercosta',
      githubUrl: 'https://github.com/petercosta',
      portfolioUrl: 'https://petercosta.dev',
      willingToRelocate: true,
      workAuthorization: 'US Citizen',
      availability: 'Available in 2 weeks',
      currentStatus: 'Employed full-time, open to new opportunities',
      highestEducation: "Bachelor's Degree"
    });

    if (!candidateResult.success) {
      throw new Error(`Failed to create candidate: ${candidateResult.errors}`);
    }

    const candidateId = candidateResult.data!.id;
    console.log(`✅ Created candidate with ID: ${candidateId}`);

    // Step 2: Add Education
    console.log('🎓 Adding education...');
    
    const educationEntries = [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Arizona State University',
        graduationDate: '2020-05-15',
        gpa: 3.7,
        honors: 'Magna Cum Laude'
      },
      {
        degree: 'Advanced Manufacturing Certificate',
        institution: 'Intel Manufacturing Academy',
        graduationDate: '2022-03-10',
        honors: 'Outstanding Achievement Award'
      }
    ];

    for (const education of educationEntries) {
      const result = await ProfileService.addEducation(candidateId, education);
      if (!result.success) {
        console.error(`Failed to add education: ${education.degree}`, result.errors);
      } else {
        console.log(`✅ Added education: ${education.degree}`);
      }
    }

    // Step 3: Add Formal Skills
    console.log('🏆 Adding formal skills...');
    
    const formalSkills = [
      {
        name: 'AWS Certified Cloud Practitioner',
        type: 'Certification' as const,
        proficiency: 'Intermediate' as const,
        issuingOrganization: 'Amazon Web Services',
        dateEarned: '2023-08-15',
        credentialUrl: 'https://aws.amazon.com/verification/ABC123'
      },
      {
        name: 'Fiber Optic Splicing',
        type: 'Course' as const,
        proficiency: 'Advanced' as const,
        issuingOrganization: 'Fiber Optic Association',
        dateEarned: '2022-11-20'
      },
      {
        name: 'React Development',
        type: 'Bootcamp' as const,
        proficiency: 'Advanced' as const,
        issuingOrganization: 'Full Stack Academy',
        dateEarned: '2021-09-30'
      },
      {
        name: 'Semiconductor Manufacturing Fundamentals',
        type: 'OnTheJob' as const,
        proficiency: 'Intermediate' as const,
        issuingOrganization: 'Intel Corporation',
        dateEarned: '2022-06-15'
      }
    ];

    for (const skill of formalSkills) {
      const result = await ProfileService.addFormalSkill(candidateId, skill);
      if (!result.success) {
        console.error(`Failed to add formal skill: ${skill.name}`, result.errors);
      } else {
        console.log(`✅ Added formal skill: ${skill.name}`);
      }
    }

    // Step 4: Add Informal Skills
    console.log('💡 Adding informal skills...');
    
    const informalSkills = [
      {
        skillName: 'Home Lab Network Setup',
        category: 'DIY',
        selfRating: 4,
        evidenceUrl: 'https://github.com/petercosta/home-lab-setup'
      },
      {
        skillName: 'Python Automation Scripts',
        category: 'Software',
        selfRating: 4
      },
      {
        skillName: 'Electronic Circuit Design',
        category: 'Technical',
        selfRating: 3
      },
      {
        skillName: 'Project Management',
        category: 'Communication',
        selfRating: 4
      }
    ];

    for (const skill of informalSkills) {
      const result = await ProfileService.addInformalSkill(candidateId, skill);
      if (!result.success) {
        console.error(`Failed to add informal skill: ${skill.skillName}`, result.errors);
      } else {
        console.log(`✅ Added informal skill: ${skill.skillName}`);
      }
    }

    // Step 5: Add Projects
    console.log('🚀 Adding projects...');
    
    const projects = [
      {
        title: 'Smart Home IoT Dashboard',
        roleAndTools: 'Full Stack Developer – React, Node.js, AWS IoT, MongoDB',
        description: 'Developed a comprehensive IoT dashboard for monitoring and controlling smart home devices. Features real-time data visualization, automated alerts, and mobile responsiveness. Reduced energy consumption by 20% through intelligent automation.',
        mediaUrl: 'https://github.com/petercosta/smart-home-dashboard',
        startDate: '2023-03-01',
        endDate: '2023-08-15',
        isActive: false
      },
      {
        title: 'Manufacturing Quality Control System',
        roleAndTools: 'Lead Developer – Python, Flask, PostgreSQL, Docker',
        description: 'Built an automated quality control system for semiconductor manufacturing. Implemented machine learning algorithms for defect detection, reducing manual inspection time by 60% and improving accuracy by 25%.',
        mediaUrl: 'https://petercosta.dev/projects/qc-system',
        startDate: '2022-09-01',
        endDate: '2023-02-28',
        isActive: false
      },
      {
        title: 'Open Source Fiber Optic Testing Tool',
        roleAndTools: 'Creator & Maintainer – C++, Arduino, 3D Printing',
        description: 'Designed and built an affordable fiber optic testing device for small installation companies. Open sourced the project with 200+ GitHub stars and active community contributions.',
        mediaUrl: 'https://github.com/petercosta/fiber-tester',
        startDate: '2022-01-15',
        isActive: true
      }
    ];

    for (const project of projects) {
      const result = await ProfileService.addProject(candidateId, project);
      if (!result.success) {
        console.error(`Failed to add project: ${project.title}`, result.errors);
      } else {
        console.log(`✅ Added project: ${project.title}`);
      }
    }

    // Step 6: Add Work History
    console.log('💼 Adding work history...');
    
    const workHistory = [
      {
        companyName: 'Intel Corporation',
        roleTitle: 'Manufacturing Engineering Technician',
        startDate: '2021-06-01',
        responsibilities: 'Support semiconductor fabrication processes, maintain clean room equipment, perform quality control testing, troubleshoot production issues, and document process improvements. Led initiative to reduce equipment downtime by 15%.',
        isCurrentPosition: true
      },
      {
        companyName: 'GreenTech Innovations',
        roleTitle: 'Junior Full Stack Developer',
        startDate: '2020-09-01',
        endDate: '2021-05-31',
        responsibilities: 'Developed web applications using React and Node.js, maintained MySQL databases, implemented REST APIs, and collaborated with design team on user experience improvements. Built customer portal that increased user engagement by 40%.',
        isCurrentPosition: false
      },
      {
        companyName: 'TechStart Solutions',
        roleTitle: 'IT Support Intern',
        startDate: '2020-01-15',
        endDate: '2020-08-30',
        responsibilities: 'Provided technical support for 100+ employees, managed network infrastructure, installed and configured software, and assisted with cybersecurity protocols. Reduced help desk ticket resolution time by 25%.',
        isCurrentPosition: false
      }
    ];

    for (const work of workHistory) {
      const result = await ProfileService.addWorkHistory(candidateId, work);
      if (!result.success) {
        console.error(`Failed to add work history: ${work.companyName}`, result.errors);
      } else {
        console.log(`✅ Added work history: ${work.roleTitle} at ${work.companyName}`);
      }
    }

    // Step 7: Add References
    console.log('👥 Adding references...');
    
    const references = [
      {
        name: 'Sarah Johnson',
        relationship: 'Former Manager at GreenTech Innovations',
        contactInfo: 'sarah.johnson@greentech.com | (555) 234-5678',
        permissionToContact: true
      },
      {
        name: 'Dr. Michael Chen',
        relationship: 'Computer Science Professor at ASU',
        contactInfo: 'michael.chen@asu.edu | (555) 345-6789',
        permissionToContact: true
      },
      {
        name: 'David Rodriguez',
        relationship: 'Senior Engineer at Intel Corporation',
        contactInfo: 'david.rodriguez@intel.com | (555) 456-7890',
        permissionToContact: true
      }
    ];

    for (const reference of references) {
      const result = await ProfileService.addReference(candidateId, reference);
      if (!result.success) {
        console.error(`Failed to add reference: ${reference.name}`, result.errors);
      } else {
        console.log(`✅ Added reference: ${reference.name}`);
      }
    }

    // Step 8: Add Optional Data
    console.log('⚙️ Adding optional profile data...');
    
    // Compensation Preferences
    const compensationResult = await ProfileService.updateCompensationPreferences(candidateId, {
      desiredSalaryMin: 70000,
      desiredSalaryMax: 95000,
      preferredEmploymentType: 'FullTime',
      weeklyAvailability: 40
    });

    if (compensationResult.success) {
      console.log('✅ Added compensation preferences');
    } else {
      console.error('Failed to add compensation preferences', compensationResult.errors);
    }

    // Transportation Logistics
    const transportationResult = await ProfileService.updateTransportationLogistics(candidateId, {
      hasDriversLicense: true,
      hasVehicle: true,
      commuteRadius: 25,
      preferredWorkMode: 'Hybrid',
      internetSpeed: 'High-speed broadband (100+ Mbps)',
      hasHomeOfficeSetup: true
    });

    if (transportationResult.success) {
      console.log('✅ Added transportation logistics');
    } else {
      console.error('Failed to add transportation logistics', transportationResult.errors);
    }

    // Step 9: Initialize System Metrics
    console.log('📊 Initializing system metrics...');
    
    const systemMetricsResult = await ProfileService.updateSystemMetrics(candidateId, {
      aptitudeScore: 85,
      attitudeRating: 4.7,
      totalXP: 2450,
      currentLevel: 7,
      learningStreak: 12,
      coursesCompleted: 8,
      skillsVerified: 4
    });

    if (systemMetricsResult.success) {
      console.log('✅ Initialized system metrics');
    } else {
      console.error('Failed to initialize system metrics', systemMetricsResult.errors);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`Candidate ID: ${candidateId}`);
    console.log('\nProfile Summary:');
    console.log('- ✅ Basic information');
    console.log('- ✅ 2 Education entries');
    console.log('- ✅ 4 Formal skills');
    console.log('- ✅ 4 Informal skills');
    console.log('- ✅ 3 Projects');
    console.log('- ✅ 3 Work history entries');
    console.log('- ✅ 3 References');
    console.log('- ✅ Compensation preferences');
    console.log('- ✅ Transportation logistics');
    console.log('- ✅ System metrics');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase; 