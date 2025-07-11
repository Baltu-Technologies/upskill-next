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
    description: 'Comprehensive exploration of wafer fabrication from silicon ingots to finished wafers using interactive multimedia content.',
    totalSlides: 10,
    duration: '25 minutes',
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
        id: 'visual-intro',
        type: 'TitleWithImage',
        title: 'Silicon Wafer Foundation',
        caption: 'Semiconductor devices begin with ultra-pure silicon wafers that serve as the foundation for all microelectronic circuits.',
        imageUrl: '/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg',
        imagePosition: 'right',
        duration: 60,
        backgroundColor: '#0F172A'
      },
      {
        id: 'overview',
        type: 'TitleWithSubtext',
        title: 'Fabrication Overview',
        content: 'The complete process of creating semiconductor wafers ready for device manufacturing involves precise control at every step.',
        bullets: [
          'Crystal growth and ingot formation using Czochralski process',
          'Precision wafer slicing with diamond wire technology',
          'Multi-stage surface preparation and polishing',
          'Quality inspection and metrology testing',
          'Clean room packaging and storage'
        ],
        duration: 90,
        backgroundColor: '#0F172A'
      },
      {
        id: 'fabrication-video',
        type: 'VideoSlide',
        title: 'Wafer Manufacturing in Action',
        videoUrl: 'https://www.youtube.com/embed/aWdXCmSQ5Xw',
        description: 'Watch the complete wafer fabrication process from crystal growth to final inspection.',
        duration: 180,
        backgroundColor: '#0F172A'
      },
      {
        id: 'processes',
        type: 'MarkdownSlide',
        title: 'Detailed Process Steps',
        content: `
# Complete Wafer Fabrication Process

## 1. Silicon Ingot Growth
- **Czochralski Process**: Single crystal growth at 1450°C
- **Float Zone**: Ultra-pure silicon ingots (>99.9999%)
- **Diameter**: 200mm, 300mm, or 450mm standard sizes
- **Crystal Orientation**: <100> or <111> lattice planes
- **Dopant Control**: Boron (p-type) or Phosphorus (n-type)

## 2. Ingot Preparation & Slicing
- **X-ray Orientation**: Crystal axis alignment ±0.5°
- **Grinding**: Cylindrical shaping to precise diameter
- **Diamond Wire Slicing**: 150-180μm wire, 0.5mm kerf
- **Thickness**: 725μm ± 25μm for 300mm wafers

## 3. Wafer Shaping & Lapping
- **Edge Grinding**: Rounded edge profile (1-3mm radius)
- **Lapping**: Al₂O₃ slurry for thickness uniformity
- **Damage Etching**: HF/HNO₃ solution removal
- **Edge Polishing**: Mirror finish on wafer perimeter

## 4. Chemical Mechanical Polishing (CMP)
- **Primary Polish**: Colloidal silica slurry
- **Final Polish**: <0.1nm RMS surface roughness
- **Flatness Control**: <0.25μm total thickness variation
- **Nanotopography**: <0.05nm peak-to-valley
        `,
        maxWidth: 'lg',
        duration: 200,
        backgroundColor: '#1E293B'
      },
      {
        id: 'equipment-hotspots',
        type: 'HotspotActivitySlide',
        title: 'Fabrication Equipment Explorer',
        instruction: 'Click on each numbered component to learn about the key equipment used in wafer fabrication.',
        imageUrl: '/media/semiconductor/Advanced-semiconductor-fab-equipment-lined-up-in-a-semiconductor-manufacturing-facility.jpg',
        hotspots: [
          {
            id: 'czochralski',
            x: 25,
            y: 35,
            label: 'Czochralski Crystal Puller',
            description: 'Single-crystal silicon ingot growth system operating at 1450°C with precise rotation control for defect-free crystals.'
          },
          {
            id: 'wire-saw',
            x: 50,
            y: 45,
            label: 'Diamond Wire Saw',
            description: 'Multi-wire slicing system with 150μm diamond-embedded wire for precision wafer cutting with minimal material loss.'
          },
          {
            id: 'cmp-station',
            x: 75,
            y: 30,
            label: 'CMP Polishing Station',
            description: 'Chemical Mechanical Polishing system combining colloidal silica chemistry with mechanical action for mirror-finish surfaces.'
          },
          {
            id: 'metrology',
            x: 60,
            y: 65,
            label: 'Metrology & Inspection',
            description: 'Automated optical inspection and thickness measurement systems ensuring sub-nanometer surface quality control.'
          }
        ],
        duration: 150,
        backgroundColor: '#0F172A'
      },
      {
        id: 'crystal-structure',
        type: 'AR3DModelSlide',
        title: 'Silicon Crystal Structure',
        modelUrl: '/models/silicon-crystal-lattice.glb',
        arEnabled: true,
        hotspots: [
          {
            label: 'Silicon Atom',
            position: [0, 0, 0]
          },
          {
            label: 'Covalent Bond',
            position: [1.4, 0, 0]
          },
          {
            label: 'Crystal Plane <100>',
            position: [0, 2, 0]
          },
          {
            label: 'Unit Cell',
            position: [2.8, 2.8, 0]
          }
        ],
        duration: 120,
        backgroundColor: '#0F172A'
      },
      {
        id: 'process-flow',
        type: 'CustomHTMLSlide',
        rawHtml: `
<div class="h-full flex flex-col items-center justify-center bg-slate-900 text-white p-8">
  <h2 class="text-3xl font-bold mb-8 text-center">Interactive Process Flow</h2>
  <div class="max-w-4xl w-full">
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="bg-blue-600 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-500 transition-all duration-300" onclick="highlightStep(1)">
        <div class="text-2xl mb-2">🔮</div>
        <div class="font-semibold">Crystal Growth</div>
        <div class="text-sm opacity-80">1450°C Czochralski</div>
      </div>
      <div class="bg-purple-600 p-4 rounded-lg text-center cursor-pointer hover:bg-purple-500 transition-all duration-300" onclick="highlightStep(2)">
        <div class="text-2xl mb-2">⚙️</div>
        <div class="font-semibold">Slicing</div>
        <div class="text-sm opacity-80">Diamond Wire</div>
      </div>
      <div class="bg-green-600 p-4 rounded-lg text-center cursor-pointer hover:bg-green-500 transition-all duration-300" onclick="highlightStep(3)">
        <div class="text-2xl mb-2">💎</div>
        <div class="font-semibold">Polishing</div>
        <div class="text-sm opacity-80">CMP Process</div>
      </div>
      <div class="bg-orange-600 p-4 rounded-lg text-center cursor-pointer hover:bg-orange-500 transition-all duration-300" onclick="highlightStep(4)">
        <div class="text-2xl mb-2">🔍</div>
        <div class="font-semibold">Inspection</div>
        <div class="text-sm opacity-80">Quality Control</div>
      </div>
    </div>
    <div id="step-details" class="bg-slate-800 p-6 rounded-xl min-h-32 flex items-center justify-center">
      <p class="text-gray-400 text-center">Click on any step above to see detailed information</p>
    </div>
  </div>
  <script>
    function highlightStep(step) {
      const details = {
        1: '<h3 class="text-xl font-bold text-blue-400 mb-2">Crystal Growth</h3><p>Ultra-pure silicon (99.9999%) is melted and slowly cooled to form single-crystal ingots up to 450mm diameter. The Czochralski process ensures perfect atomic alignment.</p>',
        2: '<h3 class="text-xl font-bold text-purple-400 mb-2">Diamond Wire Slicing</h3><p>Precision cutting with 150μm diamond wire creates wafers 725μm thick. Multi-wire systems slice entire ingots simultaneously with minimal material waste.</p>',
        3: '<h3 class="text-xl font-bold text-green-400 mb-2">Chemical Mechanical Polishing</h3><p>Colloidal silica slurry combined with mechanical pressure creates mirror-smooth surfaces with <0.1nm roughness - essential for nanoscale device fabrication.</p>',
        4: '<h3 class="text-xl font-bold text-orange-400 mb-2">Quality Inspection</h3><p>Automated metrology systems measure thickness, flatness, and surface quality. Only wafers meeting strict specifications proceed to device manufacturing.</p>'
      };
      document.getElementById('step-details').innerHTML = details[step];
    }
  </script>
</div>`,
        duration: 120,
        backgroundColor: '#0F172A'
      },
      {
        id: 'quiz',
        type: 'QuickCheckSlide',
        title: 'Knowledge Check',
        question: 'What is the primary purpose of Chemical Mechanical Polishing (CMP) in wafer fabrication?',
        options: [
          'Remove surface particles only',
          'Achieve ultra-smooth surface finish (<0.1nm roughness)',
          'Control wafer thickness uniformity',
          'Add protective coating layers'
        ],
        correctAnswer: 1,
        explanation: 'CMP combines chemical etching with mechanical polishing to achieve the ultra-smooth surface finish (<0.1nm RMS roughness) required for nanoscale device fabrication. This process is critical for ensuring proper photolithography and device performance.',
        duration: 90,
        backgroundColor: '#0F172A'
      },
      {
        id: 'completion',
        type: 'TitleSlide',
        title: 'Module Complete!',
        subtitle: 'You have mastered wafer fabrication fundamentals through interactive multimedia learning.',
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
  description: 'Comprehensive training in modern manufacturing processes and automation including semiconductor processing, industrial robotics, and quality control systems. Designed for technicians and engineers working in high-tech manufacturing environments.',
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