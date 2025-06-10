'use client';

import { useState } from 'react';
import { Star, CheckCircle2, ArrowLeft, Target, Zap, Building2, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type definitions
interface Skill {
  id: string;
  name: string;
  description: string;
  isCore?: boolean;
}

interface SkillDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'hands-on' | 'computer' | 'hybrid';
  skills: Skill[];
}

interface UserSkill {
  skillId: string;
  confidence: 0 | 1 | 2 | 3 | 4 | 5;
}

// Complete formal skills domains with 4 example skills each
const formalSkillDomains: SkillDomain[] = [
  // 🧤 Hands-On Technical Domains
  {
    id: 'mechanical-systems',
    name: 'Mechanical Systems & Equipment',
    description: 'Moving parts, fluid power, mechanical components, assembly, rigging',
    icon: '⚙️',
    color: 'blue',
    category: 'hands-on',
    skills: [
      { id: 'actuator-mounting', name: 'Actuator Mounting', description: 'Proper mounting and alignment of pneumatic/hydraulic actuators' },
      { id: 'pump-alignment', name: 'Pump Alignment', description: 'Precision alignment of centrifugal and positive displacement pumps' },
      { id: 'scaffolding', name: 'Scaffolding Setup', description: 'Safe assembly and inspection of tubular and frame scaffolding systems' },
      { id: 'rigging-hoisting', name: 'Rigging & Hoisting', description: 'Load calculations, sling selection, and crane operation principles' }
    ]
  },
  {
    id: 'electrical-power',
    name: 'Electrical Power & Wiring Systems',
    description: 'Low- and mid-voltage systems, wiring, conduit, grounding, safety',
    icon: '⚡',
    color: 'yellow',
    category: 'hands-on',
    skills: [
      { id: 'breaker-install', name: 'Circuit Breaker Installation', description: 'Proper installation and testing of panel breakers and disconnects' },
      { id: 'conduit-bending', name: 'Conduit Bending', description: 'EMT and rigid conduit bending techniques using hand and hydraulic benders' },
      { id: 'wire-terminations', name: 'Wire Terminations', description: 'Proper stripping, crimping, and terminal connection techniques' },
      { id: 'grounding-systems', name: 'Grounding Systems', description: 'Equipment grounding, bonding, and electrical safety protocols' }
    ]
  },
  {
    id: 'electronics-pcb',
    name: 'Electronic & PCB Systems',
    description: 'Board-level work, soldering, sensors, testing circuits',
    icon: '🔌',
    color: 'green',
    category: 'hands-on',
    skills: [
      { id: 'multimeter-use', name: 'Multimeter Operations', description: 'Voltage, current, resistance measurements and continuity testing' },
      { id: 'breadboarding', name: 'Breadboard Prototyping', description: 'Circuit design and testing using solderless breadboards' },
      { id: 'smt-rework', name: 'SMT Rework', description: 'Surface mount component removal and replacement techniques' },
      { id: 'oscilloscope', name: 'Oscilloscope Operation', description: 'Waveform analysis and signal troubleshooting with digital scopes' }
    ]
  },
  {
    id: 'fabrication-structural',
    name: 'Fabrication & Structural Methods', 
    description: 'Cutting, joining, framing, mounting, materials processing',
    icon: '🔧',
    color: 'orange',
    category: 'hands-on',
    skills: [
      { id: 'tig-welding', name: 'TIG Welding', description: 'Tungsten inert gas welding of steel, aluminum, and stainless steel' },
      { id: 'drywall-framing', name: 'Drywall Framing', description: 'Metal stud layout, cutting, and assembly for interior walls' },
      { id: 'rivet-guns', name: 'Pneumatic Riveting', description: 'Installation of solid and blind rivets using pneumatic tools' },
      { id: '3d-printing', name: '3D Printing', description: 'FDM printer operation, slicing software, and print troubleshooting' }
    ]
  },
  {
    id: 'measurement-inspection',
    name: 'Measurement, Inspection & Calibration',
    description: 'Test instruments, precision tools, QA techniques',
    icon: '📏',
    color: 'purple',
    category: 'hands-on',
    skills: [
      { id: 'micrometers', name: 'Micrometer Measurement', description: 'Precision measurement using outside, inside, and depth micrometers' },
      { id: 'cmm-operation', name: 'CMM Operation', description: 'Coordinate measuring machine programming and measurement procedures' },
      { id: 'leak-detection', name: 'Leak Detection', description: 'Pressure decay, bubble testing, and ultrasonic leak detection methods' },
      { id: 'calibration', name: 'Instrument Calibration', description: 'Calibration procedures for gauges, transmitters, and test equipment' }
    ]
  },
  {
    id: 'safety-compliance',
    name: 'Safety, Compliance & Environmental Controls',
    description: 'Risk mitigation, OSHA, clean-room, LOTO, PPE, ESD',
    icon: '🛡️',
    color: 'red',
    category: 'hands-on',
    skills: [
      { id: 'hazard-identification', name: 'Hazard Identification', description: 'Workplace hazard assessment and risk evaluation techniques' },
      { id: 'msds-usage', name: 'SDS Interpretation', description: 'Reading and applying Safety Data Sheets for chemical handling' },
      { id: 'loto-procedures', name: 'LOTO Procedures', description: 'Lockout/Tagout energy isolation and verification procedures' },
      { id: 'ppe-selection', name: 'PPE Selection', description: 'Personal protective equipment selection and inspection protocols' }
    ]
  },
  // 💻 Computer-Based Technical Domains
  {
    id: 'digital-tools',
    name: 'Digital Tools & Technical Software',
    description: 'CAD, diagnostics software, control interfaces, virtual systems',
    icon: '💻',
    color: 'indigo',
    category: 'computer',
    skills: [
      { id: 'autocad-2d', name: 'AutoCAD 2D Drafting', description: 'Technical drawing creation, dimensioning, and drawing management' },
      { id: 'hmi-config', name: 'HMI Configuration', description: 'Human-machine interface programming and screen development' },
      { id: 'vr-training', name: 'VR Training Systems', description: 'Virtual reality training module development and deployment' },
      { id: 'simulation-software', name: 'Simulation Software', description: 'Process simulation and virtual commissioning tools' }
    ]
  },
  {
    id: 'it-systems',
    name: 'Information Technology (IT) Systems',
    description: 'Devices, basic networking, computing environments, connectivity',
    icon: '🖥️',
    color: 'cyan',
    category: 'computer',
    skills: [
      { id: 'workstation-setup', name: 'Workstation Setup', description: 'Computer assembly, driver installation, and performance optimization' },
      { id: 'ip-configuration', name: 'IP Configuration', description: 'Network addressing, subnet masks, and DHCP configuration' },
      { id: 'network-switches', name: 'Network Switches', description: 'Managed switch configuration, VLANs, and port management' },
      { id: 'vpn-setup', name: 'VPN Setup', description: 'Virtual private network configuration and troubleshooting' }
    ]
  },
  {
    id: 'data-monitoring',
    name: 'Data Monitoring & Diagnostics',
    description: 'Logs, dashboards, signal tracing, fault detection',
    icon: '📊',
    color: 'teal',
    category: 'computer',
    skills: [
      { id: 'network-diagnostics', name: 'Network Diagnostics', description: 'Ping, traceroute, and packet capture analysis techniques' },
      { id: 'sensor-trends', name: 'Sensor Trend Analysis', description: 'Historical data analysis and anomaly detection in sensor readings' },
      { id: 'log-analysis', name: 'Log File Analysis', description: 'System log interpretation and error pattern identification' },
      { id: 'dashboard-creation', name: 'Dashboard Creation', description: 'Real-time monitoring dashboard design and implementation' }
    ]
  },
  // 🔁 Hybrid / Systems Domains
  {
    id: 'automation-robotics',
    name: 'Automation, Robotics & Control Systems',
    description: 'PLCs, sensors, robotic systems, motion control',
    icon: '🤖',
    color: 'violet',
    category: 'hybrid',
    skills: [
      { id: 'ladder-logic', name: 'Ladder Logic Programming', description: 'PLC programming using ladder diagrams and function blocks' },
      { id: 'teach-pendant', name: 'Robot Teaching', description: 'Industrial robot programming using teach pendants and offline software' },
      { id: 'sensor-integration', name: 'Sensor Integration', description: 'Proximity, vision, and force sensors in automated systems' },
      { id: 'motion-control', name: 'Motion Control', description: 'Servo drive configuration and positioning system tuning' }
    ]
  },
  {
    id: 'systems-integration',
    name: 'Systems Integration & Field Installation',
    description: 'On-site assembly, testing, install of multi-tech systems',
    icon: '🔗',
    color: 'pink',
    category: 'hybrid',
    skills: [
      { id: 'field-cabling', name: 'Field Cable Routing', description: 'Industrial cable tray installation and signal cable routing' },
      { id: 'rack-wiring', name: 'Control Panel Wiring', description: 'Electrical panel layout and systematic wire management' },
      { id: 'system-commissioning', name: 'System Commissioning', description: 'Integrated system startup, testing, and performance verification' },
      { id: 'punch-lists', name: 'Punch List Management', description: 'Project completion tracking and deficiency resolution' }
    ]
  },
  {
    id: 'workplace-execution',
    name: 'Workplace Execution & Project Practices',
    description: 'Lean methods, communication, troubleshooting, workflows',
    icon: '📋',
    color: 'gray',
    category: 'hybrid',
    skills: [
      { id: '5s-methodology', name: '5S Methodology', description: 'Workplace organization and standardization principles' },
      { id: 'work-instructions', name: 'Work Instructions', description: 'Standard operating procedure development and documentation' },
      { id: 'root-cause-analysis', name: 'Root Cause Analysis', description: 'Systematic problem-solving using fishbone and 5-why methods' },
      { id: 'work-order-systems', name: 'Work Order Systems', description: 'CMMS operation and maintenance workflow management' }
    ]
  }
];

const informalSkillDomains: SkillDomain[] = [
  {
    id: 'diy-maker',
    name: 'DIY & Maker Projects',
    description: 'Arduino home-automation, 3D-printed cosplay parts, custom CNC router, retro-gaming cabinet',
    icon: '🔧',
    color: 'blue',
    category: 'hybrid',
    skills: [
      { id: 'arduino-automation', name: 'Arduino Home Automation', description: 'IoT devices, sensors, and smart home control systems' },
      { id: '3d-printed-cosplay', name: '3D Printed Cosplay Parts', description: 'Complex costume components, props, and wearable electronics' },
      { id: 'cnc-routing', name: 'Custom CNC Router Projects', description: 'Personal CNC builds, woodworking, and precision fabrication' },
      { id: 'retro-gaming', name: 'Retro Gaming Cabinet Build', description: 'Arcade cabinet construction, electronics integration, and emulation' }
    ]
  },
  {
    id: 'home-improvement',
    name: 'Home Improvement & Repair',
    description: 'Framing a wall, basic plumbing fixes, tiling a backsplash, installing light fixtures',
    icon: '🏠',
    color: 'orange',
    category: 'hands-on',
    skills: [
      { id: 'wall-framing', name: 'Wall Framing', description: 'Interior wall construction, studs, and drywall installation' },
      { id: 'plumbing-repairs', name: 'Basic Plumbing Fixes', description: 'Leak repairs, fixture installation, and pipe modifications' },
      { id: 'tile-backsplash', name: 'Tile Backsplash Installation', description: 'Kitchen/bathroom tiling, grouting, and finishing work' },
      { id: 'light-fixtures', name: 'Light Fixture Installation', description: 'Electrical fixtures, switches, and basic residential wiring' }
    ]
  },
  {
    id: 'personal-electronics',
    name: 'Personal Electronics & Coding',
    description: 'Raspberry Pi media server, mobile app side-project, smart-home scripting, game modding',
    icon: '💻',
    color: 'green',
    category: 'computer',
    skills: [
      { id: 'raspberry-pi', name: 'Raspberry Pi Media Server', description: 'Home servers, NAS systems, and media streaming setup' },
      { id: 'mobile-app-project', name: 'Mobile App Side-Project', description: 'Personal iOS/Android apps, React Native, or Flutter development' },
      { id: 'smart-home-scripting', name: 'Smart-Home Scripting', description: 'Python automation, Home Assistant, and IoT device integration' },
      { id: 'game-modding', name: 'Game Modding', description: 'Mod development, scripting, and custom game content creation' }
    ]
  },
  {
    id: 'vehicle-engine',
    name: 'Vehicle & Small-Engine Work',
    description: 'Motorcycle carb rebuild, car stereo install, e-bike motor swap, lawn-mower tune-up',
    icon: '🚗',
    color: 'red',
    category: 'hands-on',
    skills: [
      { id: 'motorcycle-carb', name: 'Motorcycle Carb Rebuild', description: 'Carburetor disassembly, cleaning, and tuning for optimal performance' },
      { id: 'car-stereo-install', name: 'Car Stereo Installation', description: 'Audio system wiring, speaker mounting, and electrical integration' },
      { id: 'ebike-motor-swap', name: 'E-bike Motor Swap', description: 'Electric motor installation, battery wiring, and controller setup' },
      { id: 'lawnmower-tuneup', name: 'Lawn-Mower Tune-Up', description: 'Small engine maintenance, blade sharpening, and seasonal prep' }
    ]
  },
  {
    id: 'arts-media',
    name: 'Arts, Media & Content Creation',
    description: 'Podcast editing, YouTube video production, 3D modelling for animation, graphic design freelancing',
    icon: '🎨',
    color: 'purple',
    category: 'computer',
    skills: [
      { id: 'podcast-editing', name: 'Podcast Editing', description: 'Audio recording, editing, noise reduction, and publishing workflows' },
      { id: 'youtube-production', name: 'YouTube Video Production', description: 'Video editing, thumbnails, SEO optimization, and audience analytics' },
      { id: '3d-modelling-animation', name: '3D Modelling for Animation', description: 'Blender/Maya modeling, rigging, and animation for creative projects' },
      { id: 'graphic-design-freelance', name: 'Graphic Design Freelancing', description: 'Logo design, branding, client work, and design project management' }
    ]
  },
  {
    id: 'community-volunteer',
    name: 'Community & Volunteer Builds',
    description: 'FIRST robotics mentor, makerspace instructor, Habitat for Humanity carpentry, solar co-op installs',
    icon: '🤝',
    color: 'teal',
    category: 'hybrid',
    skills: [
      { id: 'first-robotics-mentor', name: 'FIRST Robotics Mentor', description: 'Student coaching, robot design guidance, and competition strategy' },
      { id: 'makerspace-instructor', name: 'Makerspace Instructor', description: 'Tool safety training, project guidance, and workshop leadership' },
      { id: 'habitat-carpentry', name: 'Habitat for Humanity Carpentry', description: 'Volunteer construction, framing, and coordinating build teams' },
      { id: 'solar-coop-installs', name: 'Solar Co-op Installations', description: 'Community renewable energy projects and electrical system installation' }
    ]
  },
  {
    id: 'outdoor-technical',
    name: 'Outdoor & Technical Adventure',
    description: 'Drone aerial mapping, camping gear repair, ham-radio setup, solar off-grid wiring',
    icon: '🏔️',
    color: 'cyan',
    category: 'hybrid',
    skills: [
      { id: 'drone-aerial-mapping', name: 'Drone Aerial Mapping', description: 'Commercial piloting, photogrammetry, and surveying applications' },
      { id: 'camping-gear-repair', name: 'Camping Gear Repair', description: 'Field repairs, gear maintenance, and outdoor equipment troubleshooting' },
      { id: 'ham-radio-setup', name: 'Ham-Radio Setup', description: 'Radio operation, antenna installation, and emergency communications' },
      { id: 'solar-offgrid-wiring', name: 'Solar Off-Grid Wiring', description: 'Remote power systems, battery banks, and wilderness electrical setup' }
    ]
  }
];

const proficiencyLabels = [
  'Unfamiliar',
  'Exposed', 
  'Knowledgeable',
  'Practiced',
  'Proficient',
  'Expert'
];

const proficiencyColors = [
  'text-gray-500 bg-gray-100 dark:bg-gray-800',
  'text-red-600 bg-red-50 dark:bg-red-900/20',
  'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  'text-green-600 bg-green-50 dark:bg-green-900/20'
];

function StarRating({ 
  value, 
  onChange, 
  disabled = false 
}: { 
  value: number; 
  onChange: (value: number) => void; 
  disabled?: boolean; 
}) {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={cn(
            "transition-colors duration-200",
            disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110",
            value >= star 
              ? (star === 0 ? "text-gray-400" : "text-yellow-400") 
              : "text-gray-300 dark:text-gray-600"
          )}
        >
          {star === 0 ? (
            <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
              <span className="text-xs font-bold">0</span>
            </div>
          ) : (
            <Star className="w-6 h-6 fill-current" />
          )}
        </button>
      ))}
    </div>
  );
}

export default function SkillsDemoPage() {
  const [currentStep, setCurrentStep] = useState<'formal' | 'informal' | 'completed'>('formal');
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [showRatingGuide, setShowRatingGuide] = useState(false);

  const toggleDomain = (domainId: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  };

  const handleSkillChange = (skillId: string, confidence: number) => {
    setUserSkills(prev => {
      const existing = prev.find(s => s.skillId === skillId);
      if (existing) {
        return prev.map(s => 
          s.skillId === skillId 
            ? { ...s, confidence: confidence as 0 | 1 | 2 | 3 | 4 | 5 }
            : s
        );
      } else {
        return [...prev, { skillId, confidence: confidence as 0 | 1 | 2 | 3 | 4 | 5 }];
      }
    });
  };

  const getSkillConfidence = (skillId: string): number => {
    const skill = userSkills.find(s => s.skillId === skillId);
    return skill?.confidence ?? 0;
  };

  const getCurrentDomains = () => {
    return currentStep === 'formal' ? formalSkillDomains : informalSkillDomains;
  };

  const getStepProgress = () => {
    const currentDomains = getCurrentDomains();
    const ratedSkills = userSkills.filter(s => 
      currentDomains.some(d => d.skills.some(skill => skill.id === s.skillId))
    );
    return ratedSkills.length;
  };

  const canProceed = () => {
    return getStepProgress() >= 3;
  };

  const handleNext = () => {
    if (currentStep === 'formal') {
      setCurrentStep('informal');
    } else {
      setCurrentStep('completed');
    }
  };

  const getDomainColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30',
      green: 'bg-green-100 dark:bg-green-900/30',
      orange: 'bg-orange-100 dark:bg-orange-900/30',
      purple: 'bg-purple-100 dark:bg-purple-900/30',
      red: 'bg-red-100 dark:bg-red-900/30',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/30',
      teal: 'bg-teal-100 dark:bg-teal-900/30',
      violet: 'bg-violet-100 dark:bg-violet-900/30',
      pink: 'bg-pink-100 dark:bg-pink-900/30',
      gray: 'bg-gray-100 dark:bg-gray-900/30'
    };
    return colorMap[color] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  if (currentStep === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Skills Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your comprehensive skills profile has been captured successfully. You're now ready to explore personalized learning pathways.
            </p>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {userSkills.filter(s => formalSkillDomains.some(d => d.skills.some(skill => skill.id === s.skillId))).length}
              </div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Formal Skills</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {userSkills.filter(s => informalSkillDomains.some(d => d.skills.some(skill => skill.id === s.skillId))).length}
              </div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Informal Skills</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800 shadow-sm">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {userSkills.filter(s => s.confidence >= 4).length}
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Proficient+</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-800 shadow-sm">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                {userSkills.length}
              </div>
              <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Total Skills</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentStep('formal');
                setUserSkills([]);
              }}
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Start Over
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
              View Recommended Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Skills Assessment Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Rate your confidence level in technical skills across formal workplace competencies and personal project experience
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold",
              currentStep === 'formal' 
                ? "bg-blue-600 border-blue-600 text-white" 
                : "bg-green-600 border-green-600 text-white"
            )}>
              1
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold",
              currentStep === 'informal' 
                ? "bg-blue-600 border-blue-600 text-white"
                : currentStep === 'completed'
                ? "bg-green-600 border-green-600 text-white"
                : "bg-white border-gray-300 text-gray-500"
            )}>
              2
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold",
              currentStep === 'completed'
                ? "bg-green-600 border-green-600 text-white"
                : "bg-white border-gray-300 text-gray-500"
            )}>
              ✓
            </div>
          </div>
        </div>

        {/* Rating Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setShowRatingGuide(!showRatingGuide)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                What do the star ratings mean?
              </span>
            </div>
            {showRatingGuide ? 
              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
              <ChevronDown className="h-5 w-5 text-gray-500" />
            }
          </button>
          
          {showRatingGuide && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  { stars: 0, label: 'Unfamiliar', desc: 'No experience or knowledge', example: 'Never heard of this skill' },
                  { stars: 1, label: 'Exposed', desc: 'Basic awareness only', example: 'Seen others do it, read about it' },
                  { stars: 2, label: 'Knowledgeable', desc: 'Understanding but limited practice', example: 'Could explain the basics, minimal hands-on' },
                  { stars: 3, label: 'Practiced', desc: 'Regular use with guidance', example: 'Done it several times with supervision' },
                  { stars: 4, label: 'Proficient', desc: 'Independent competency', example: 'Can work independently and solve problems' },
                  { stars: 5, label: 'Expert', desc: 'Advanced skill, can teach others', example: 'Deep expertise, mentor others, innovate' }
                ].map((level) => (
                  <div key={level.stars} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < level.stars 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-gray-300 dark:text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {level.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {level.desc}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                      {level.example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStep === 'formal' ? 'Step 1: Formal Skills' : 'Step 2: Informal Skills'}
            </h2>
            <p className="text-blue-100">
              {currentStep === 'formal' 
                ? 'Workplace competencies organized by work modality and technical domain'
                : 'Personal projects, hobbies, and hands-on experience that demonstrates technical skills'
              }
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-blue-100">
                <span className="text-sm">Progress: {getStepProgress()} skills rated</span>
                <span className="mx-2">•</span>
                <span className="text-sm">Minimum: 3 skills to continue</span>
              </div>
              <button
                onClick={() => setExpandedDomains(prev => 
                  prev.size === getCurrentDomains().length ? new Set() : new Set(getCurrentDomains().map(d => d.id))
                )}
                className="text-sm text-blue-100 hover:text-white transition-colors underline"
              >
                {expandedDomains.size === getCurrentDomains().length ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Category sections for formal skills */}
            {currentStep === 'formal' && (
              <div className="space-y-12">
                {/* Hands-On Technical */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl">🧤</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Hands-On Technical Domains
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Physical, mechanical, and hands-on technical work
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {getCurrentDomains().filter(d => d.category === 'hands-on').map(domain => (
                      <div key={domain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                        <button
                          onClick={() => toggleDomain(domain.id)}
                          className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                                <span className="text-xl">{domain.icon}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {domain.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {domain.description}
                                </p>
                                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                                  {userSkills.filter(s => domain.skills.some(skill => skill.id === s.skillId)).length} of {domain.skills.length} skills rated
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {expandedDomains.has(domain.id) ? 
                                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              }
                            </div>
                          </div>
                        </button>
                        
                        {expandedDomains.has(domain.id) && (
                          <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="space-y-3 mt-4">
                              {domain.skills.map(skill => (
                                <div key={skill.id} className="flex items-center justify-between py-2">
                                  <div className="flex-1 mr-4">
                                    <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                      {skill.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {skill.description}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <StarRating 
                                      value={getSkillConfidence(skill.id)}
                                      onChange={(value) => handleSkillChange(skill.id, value)}
                                    />
                                    <span className={cn(
                                      "text-xs font-medium px-2 py-1 rounded-full",
                                      proficiencyColors[getSkillConfidence(skill.id)]
                                    )}>
                                      {proficiencyLabels[getSkillConfidence(skill.id)]}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Computer-Based Technical */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl">💻</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Computer-Based Technical Domains
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Software, digital tools, and computer-intensive work
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {getCurrentDomains().filter(d => d.category === 'computer').map(domain => (
                      <div key={domain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                        <button
                          onClick={() => toggleDomain(domain.id)}
                          className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                                <span className="text-xl">{domain.icon}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {domain.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {domain.description}
                                </p>
                                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                                  {userSkills.filter(s => domain.skills.some(skill => skill.id === s.skillId)).length} of {domain.skills.length} skills rated
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {expandedDomains.has(domain.id) ? 
                                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              }
                            </div>
                          </div>
                        </button>
                        
                        {expandedDomains.has(domain.id) && (
                          <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="space-y-3 mt-4">
                              {domain.skills.map(skill => (
                                <div key={skill.id} className="flex items-center justify-between py-2">
                                  <div className="flex-1 mr-4">
                                    <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                      {skill.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {skill.description}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <StarRating 
                                      value={getSkillConfidence(skill.id)}
                                      onChange={(value) => handleSkillChange(skill.id, value)}
                                    />
                                    <span className={cn(
                                      "text-xs font-medium px-2 py-1 rounded-full",
                                      proficiencyColors[getSkillConfidence(skill.id)]
                                    )}>
                                      {proficiencyLabels[getSkillConfidence(skill.id)]}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hybrid / Systems */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl">🔁</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Hybrid / Systems Domains
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Integrated systems combining multiple technical areas
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {getCurrentDomains().filter(d => d.category === 'hybrid').map(domain => (
                      <div key={domain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                        <button
                          onClick={() => toggleDomain(domain.id)}
                          className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                                <span className="text-xl">{domain.icon}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {domain.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {domain.description}
                                </p>
                                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                                  {userSkills.filter(s => domain.skills.some(skill => skill.id === s.skillId)).length} of {domain.skills.length} skills rated
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {expandedDomains.has(domain.id) ? 
                                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              }
                            </div>
                          </div>
                        </button>
                        
                        {expandedDomains.has(domain.id) && (
                          <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="space-y-3 mt-4">
                              {domain.skills.map(skill => (
                                <div key={skill.id} className="flex items-center justify-between py-2">
                                  <div className="flex-1 mr-4">
                                    <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                      {skill.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {skill.description}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <StarRating 
                                      value={getSkillConfidence(skill.id)}
                                      onChange={(value) => handleSkillChange(skill.id, value)}
                                    />
                                    <span className={cn(
                                      "text-xs font-medium px-2 py-1 rounded-full",
                                      proficiencyColors[getSkillConfidence(skill.id)]
                                    )}>
                                      {proficiencyLabels[getSkillConfidence(skill.id)]}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Informal skills content */}
            {currentStep === 'informal' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getCurrentDomains().map(domain => (
                  <div key={domain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                            <span className="text-xl">{domain.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {domain.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {domain.description}
                            </p>
                            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                              {userSkills.filter(s => domain.skills.some(skill => skill.id === s.skillId)).length} of {domain.skills.length} skills rated
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {expandedDomains.has(domain.id) ? 
                            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          }
                        </div>
                      </div>
                    </button>
                    
                    {expandedDomains.has(domain.id) && (
                      <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-3 mt-4">
                          {domain.skills.map(skill => (
                            <div key={skill.id} className="flex items-center justify-between py-2">
                              <div className="flex-1 mr-4">
                                <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                  {skill.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {skill.description}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <StarRating 
                                  value={getSkillConfidence(skill.id)}
                                  onChange={(value) => handleSkillChange(skill.id, value)}
                                />
                                <span className={cn(
                                  "text-xs font-medium px-2 py-1 rounded-full",
                                  proficiencyColors[getSkillConfidence(skill.id)]
                                )}>
                                  {proficiencyLabels[getSkillConfidence(skill.id)]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => currentStep === 'informal' ? setCurrentStep('formal') : null}
            disabled={currentStep === 'formal'}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-colors",
              currentStep === 'formal'
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "px-8 py-3 rounded-lg font-medium transition-colors",
              canProceed()
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {currentStep === 'informal' ? 'Complete Assessment' : 'Continue to Informal Skills'}
          </button>
        </div>
      </div>
    </div>
  );
} 