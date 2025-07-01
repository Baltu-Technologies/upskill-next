import { LessonConfig, Course, Lesson } from '@/types/microlesson/slide';

// Original microlesson configurations (now organized into lessons)
const semiconductorMicrolessons: LessonConfig[] = [
  {
    id: 'clean-room-protocols',
    title: 'Clean Room Protocols & Safety',
    description: 'Learn essential clean room procedures, contamination control, and safety protocols required for semiconductor manufacturing.',
    totalSlides: 5,
    duration: '12 minutes',
    course: 'Advanced Manufacturing',
    lesson: 'Semiconductor Fundamentals',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#0F172A',
      textColor: '#FFFFFF'
    },
    slides: [
      {
        id: 'title',
        type: 'TitleSlide',
        title: 'Clean Room Protocols & Safety',
        subtitle: 'Essential Contamination Control Procedures',
        duration: 30,
        backgroundColor: '#0F172A'
      },
      {
        id: 'overview',
        type: 'TitleWithSubtext',
        title: 'Clean Room Fundamentals',
        content: 'Understanding the critical role of contamination control in semiconductor manufacturing.',
        bullets: [
          'Class 1 to Class 10000 clean room standards',
          'Personnel protocols and gowning procedures',
          'Air filtration and pressure control systems',
          'Contamination sources and prevention'
        ],
        duration: 90,
        backgroundColor: '#0F172A'
      },
      {
        id: 'procedures',
        type: 'MarkdownSlide',
        title: 'Clean Room Entry Procedures',
        content: `
# Clean Room Entry Protocol

## 1. Pre-Entry Preparation
- **Remove**: Jewelry, watches, makeup
- **Wash**: Hands and forearms thoroughly
- **Check**: Personal items at designated area

## 2. Gowning Sequence
- **Step 1**: Hair cover and beard cover
- **Step 2**: Safety glasses and face mask
- **Step 3**: Clean room suit (bunny suit)
- **Step 4**: Gloves and shoe covers
- **Step 5**: Final inspection

## 3. Air Shower Process
- **Duration**: 15-30 seconds minimum
- **Position**: Arms raised, rotate slowly
- **Exit**: Only when cycle completes

## 4. Inside Clean Room
- **Movement**: Slow, deliberate motions
- **Touch**: Only designated surfaces
- **Communication**: Minimal talking
        `,
        maxWidth: 'lg',
        duration: 180,
        backgroundColor: '#1E293B'
      },
      {
        id: 'quiz',
        type: 'QuickCheckSlide',
        title: 'Safety Check',
        question: 'What is the maximum particle count per cubic foot for a Class 100 clean room?',
        options: [
          '100 particles ≥ 0.5μm',
          '1000 particles ≥ 0.5μm', 
          '10000 particles ≥ 0.5μm',
          'No limit on particles'
        ],
        correctAnswer: 0,
        explanation: 'Class 100 clean rooms allow a maximum of 100 particles of 0.5μm or larger per cubic foot of air.',
        duration: 60,
        backgroundColor: '#0F172A'
      },
      {
        id: 'completion',
        type: 'TitleSlide',
        title: 'Module Complete!',
        subtitle: 'You have mastered clean room protocols and safety procedures.',
        duration: 30,
        backgroundColor: '#059669'
      }
    ]
  },
  {
    id: 'wafer-fabrication-basics',
    title: 'Wafer Fabrication Process Overview',
    description: 'Understanding the fundamental steps of wafer fabrication from silicon ingots to finished wafers.',
    totalSlides: 6,
    duration: '15 minutes',
    course: 'Advanced Manufacturing',
    lesson: 'Semiconductor Fundamentals',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#0F172A',
      textColor: '#FFFFFF'
    },
    slides: [
      {
        id: 'title',
        type: 'TitleSlide',
        title: 'Wafer Fabrication Process',
        subtitle: 'From Silicon Ingots to Finished Wafers',
        duration: 30,
        backgroundColor: '#0F172A'
      },
      {
        id: 'overview',
        type: 'TitleWithSubtext',
        title: 'Fabrication Overview',
        content: 'The complete process of creating semiconductor wafers ready for device manufacturing.',
        bullets: [
          'Crystal growth and ingot formation',
          'Wafer slicing and shaping',
          'Surface preparation and polishing',
          'Quality inspection and testing'
        ],
        duration: 90,
        backgroundColor: '#0F172A'
      },
      {
        id: 'processes',
        type: 'MarkdownSlide',
        title: 'Wafer Fabrication Steps',
        content: `
# Complete Wafer Fabrication Process

## 1. Silicon Ingot Growth
- **Czochralski Process**: Single crystal growth
- **Float Zone**: Ultra-pure silicon ingots
- **Diameter**: 200mm, 300mm, or 450mm
- **Crystal Orientation**: <100> or <111>

## 2. Ingot Preparation
- **X-ray Orientation**: Crystal axis alignment
- **Grinding**: Cylindrical shaping
- **Slicing**: Diamond wire cutting
- **Thickness**: 725μm ± 25μm

## 3. Wafer Shaping
- **Edge Grinding**: Rounded edge profile
- **Lapping**: Thickness uniformity
- **Etching**: Damage removal
- **Cleaning**: Particle and metal removal

## 4. Surface Polishing
- **Chemical Mechanical Polishing (CMP)**
- **Surface Roughness**: <0.1nm RMS
- **Flatness**: <0.25μm
- **Final Cleaning**: SC1/SC2 clean
        `,
        maxWidth: 'lg',
        duration: 180,
        backgroundColor: '#1E293B'
      },
      {
        id: 'quiz',
        type: 'QuickCheckSlide',
        title: 'Process Check',
        question: 'What is the primary purpose of Chemical Mechanical Polishing (CMP)?',
        options: [
          'Remove surface particles',
          'Achieve ultra-smooth surface finish',
          'Control wafer thickness',
          'Add protective coating'
        ],
        correctAnswer: 1,
        explanation: 'CMP combines chemical etching with mechanical polishing to achieve the ultra-smooth surface finish required for subsequent processing steps.',
        duration: 60,
        backgroundColor: '#0F172A'
      },
      {
        id: 'completion',
        type: 'TitleSlide',
        title: 'Module Complete!',
        subtitle: 'You understand wafer fabrication fundamentals.',
        duration: 30,
        backgroundColor: '#059669'
      }
    ]
  },
  {
    id: 'lithography-fundamentals',
    title: 'Photolithography & Pattern Transfer',
    description: 'Master the principles of photolithography, mask alignment, and pattern transfer techniques.',
    totalSlides: 6,
    duration: '18 minutes',
    course: 'Advanced Manufacturing',
    lesson: 'Semiconductor Fundamentals',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#0F172A',
      textColor: '#FFFFFF'
    },
    slides: [
      {
        id: 'title',
        type: 'TitleSlide',
        title: 'Photolithography & Pattern Transfer',
        subtitle: 'Precision Pattern Creation Techniques',
        duration: 30,
        backgroundColor: '#0F172A'
      },
      {
        id: 'overview',
        type: 'TitleWithSubtext',
        title: 'Lithography Fundamentals',
        content: 'The critical process of transferring circuit patterns onto wafer surfaces.',
        bullets: [
          'Photoresist coating and baking',
          'Mask alignment and exposure',
          'Development and pattern transfer',
          'Resolution and overlay control'
        ],
        duration: 90,
        backgroundColor: '#0F172A'
      },
      {
        id: 'processes',
        type: 'MarkdownSlide',
        title: 'Lithography Process Flow',
        content: `
# Photolithography Process Steps

## 1. Surface Preparation
- **Cleaning**: Remove particles and contaminants
- **Dehydration Bake**: 150°C for 30 minutes
- **HMDS Priming**: Adhesion promotion
- **Surface Inspection**: Defect checking

## 2. Resist Application
- **Spin Coating**: 3000-5000 RPM
- **Thickness**: 0.5-2.0 μm typical
- **Soft Bake**: 90-110°C, evaporate solvents
- **Thickness Measurement**: Optical methods

## 3. Exposure Process
- **Mask Alignment**: ±50nm accuracy
- **UV Exposure**: 193nm, 248nm, or EUV
- **Dose Control**: mJ/cm² precision
- **Focus Control**: ±100nm depth of focus

## 4. Development
- **Chemical Development**: TMAH-based developers
- **Critical Dimension (CD)**: ±10% target
- **Sidewall Profile**: 85-90° angles
- **Defect Inspection**: Automated optical inspection
        `,
        maxWidth: 'lg',
        duration: 210,
        backgroundColor: '#1E293B'
      },
      {
        id: 'quiz',
        type: 'QuickCheckSlide',
        title: 'Lithography Check',
        question: 'What wavelength is commonly used in ArF lithography?',
        options: [
          '365nm (i-line)',
          '248nm (KrF)',
          '193nm (ArF)',
          '13.5nm (EUV)'
        ],
        correctAnswer: 2,
        explanation: '193nm ArF (Argon Fluoride) excimer laser lithography is widely used for advanced semiconductor manufacturing.',
        duration: 60,
        backgroundColor: '#0F172A'
      },
      {
        id: 'completion',
        type: 'TitleSlide',
        title: 'Module Complete!',
        subtitle: 'You have mastered photolithography principles.',
        duration: 30,
        backgroundColor: '#059669'
      }
    ]
  }
];

const roboticsMicrolessons: LessonConfig[] = [
  {
    id: 'industrial-robotics',
    title: 'Industrial Robotics Overview',
    description: 'Introduction to industrial robots, their applications in manufacturing, and basic operational principles.',
    totalSlides: 5,
    duration: '14 minutes',
    course: 'Advanced Manufacturing',
    lesson: 'Robotics & Automation',
    theme: {
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF'
    },
    slides: [
      {
        id: 'intro',
        type: 'TitleWithImage',
        title: 'Industrial Robotics',
        subtitle: 'Automation in Manufacturing',
        imageUrl: '/media/industrial-robot.jpg',
        imagePosition: 'right',
        duration: 60,
        backgroundColor: '#1F2937'
      },
      {
        id: 'types',
        type: 'MarkdownSlide',
        title: 'Robot Classifications',
        content: `
# Types of Industrial Robots

## By Configuration
- **Articulated**: 6-axis robots with rotary joints
- **SCARA**: Selective Compliance Assembly Robot Arm
- **Cartesian**: Linear motion in X, Y, Z axes
- **Delta/Parallel**: High-speed pick-and-place

## By Application
- **Welding Robots**: Arc and spot welding
- **Assembly Robots**: Precision component placement
- **Material Handling**: Palletizing and transport
- **Painting Robots**: Spray coating applications
        `,
        duration: 120,
        backgroundColor: '#374151'
      },
      {
        id: 'safety',
        type: 'QuickCheckSlide',
        title: 'Safety Check',
        question: 'What is the primary safety measure around industrial robots?',
        options: [
          'Emergency stop buttons',
          'Safety light curtains',
          'Proper lockout/tagout procedures',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'Industrial robot safety requires multiple layers including emergency stops, light curtains, proper LOTO procedures, and comprehensive safety training.',
        duration: 90,
        backgroundColor: '#1F2937'
      }
    ]
  }
];

// Sample Lessons that contain microlessons
export const sampleLessons: Lesson[] = [
  {
    id: 'semiconductor-fundamentals',
    title: 'Semiconductor Manufacturing Fundamentals',
    description: 'Master the core processes of semiconductor wafer manufacturing',
    duration: '45 minutes',
    objectives: [
      'Understanding wafer preparation techniques',
      'Learning photolithography processes',
      'Mastering etching and deposition methods',
      'Quality control and testing procedures'
    ],
    microlessons: semiconductorMicrolessons,
    completionCriteria: {
      minimumScore: 80,
      requiredMicrolessons: ['clean-room-protocols', 'wafer-fabrication-basics', 'lithography-fundamentals']
    },
    tags: ['manufacturing', 'semiconductors', 'cleanroom'],
    difficulty: 'intermediate'
  },
  {
    id: 'advanced-automation',
    title: 'Advanced Manufacturing Automation',
    description: 'Explore robotics and automation in modern manufacturing',
    duration: '35 minutes',
    objectives: [
      'Understanding industrial robot types',
      'Learning automation principles',
      'Safety procedures and protocols',
      'Programming and maintenance basics'
    ],
    microlessons: roboticsMicrolessons,
    completionCriteria: {
      minimumScore: 75,
      requiredMicrolessons: ['industrial-robotics']
    },
    tags: ['robotics', 'automation', 'safety'],
    difficulty: 'intermediate'
  },
  {
    id: 'quality-control',
    title: 'Advanced Quality Control Systems',
    description: 'Statistical process control and measurement techniques',
    duration: '40 minutes',
    objectives: [
      'Statistical process control principles',
      'Precision measurement techniques',
      'Quality management systems',
      'Continuous improvement methods'
    ],
    microlessons: [], // Will add microlessons later
    tags: ['quality', 'measurement', 'statistics'],
    difficulty: 'advanced'
  }
];

// Sample Course that contains lessons
export const sampleCourse: Course = {
  id: 'advanced-manufacturing-cert',
  title: 'Basics of Semiconductor',
  description: 'Comprehensive training in modern manufacturing processes and automation',
  overview: 'This course program provides hands-on training in advanced manufacturing technologies including semiconductor processing, industrial robotics, and quality control systems. Designed for technicians and engineers working in high-tech manufacturing environments.',
  duration: '8 hours',
  lessons: sampleLessons,
  prerequisites: [
    'Basic understanding of manufacturing processes',
    'High school chemistry and physics',
    'Computer literacy'
  ],
  learningOutcomes: [
    'Operate semiconductor manufacturing equipment',
    'Program and maintain industrial robots',
    'Implement quality control procedures',
    'Apply safety protocols in manufacturing environments',
    'Troubleshoot automated systems'
  ],
  industry: 'Advanced Manufacturing',
  skillLevel: 'intermediate',
  certification: {
    available: true,
    provider: 'UpSkill Manufacturing Institute',
    validityPeriod: '2 years'
  },
  instructorInfo: {
    name: 'Dr. Sarah Chen',
    title: 'Senior Manufacturing Engineer',
    bio: 'Dr. Chen has over 15 years of experience in semiconductor manufacturing and automation. She holds a Ph.D. in Materials Science and has worked at leading technology companies.',
    avatar: '/media/instructor-avatar.jpg'
  },
  tags: ['manufacturing', 'semiconductors', 'robotics', 'automation', 'quality control'],
  thumbnail: '/media/course-thumbnail.jpg',
  price: {
    amount: 299,
    currency: 'USD'
  },
  enrollmentCount: 1247,
  rating: {
    average: 4.7,
    count: 89
  }
};

// Export individual microlesson configs for backward compatibility
export const lessonConfigs = [
  ...semiconductorMicrolessons,
  ...roboticsMicrolessons
];

// Additional exports for backward compatibility
export const sampleConfig = semiconductorMicrolessons[0]; // Clean room protocols config
export const roboticsConfig = roboticsMicrolessons[0]; // Industrial robotics config