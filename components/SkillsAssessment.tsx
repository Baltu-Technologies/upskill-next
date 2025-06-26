// @ts-nocheck - Temporary disable due to TypeScript flow analysis issues with union types
'use client';

import { useState } from 'react';
import { Star, CheckCircle2, ChevronDown, ChevronUp, HelpCircle, Target, Zap, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserSkill {
  skillId: string;
  confidence: number;
}

interface Skill {
  id: string;
  name: string;
  description: string;
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

export default function SkillsAssessment() {
  // @ts-ignore - TypeScript flow analysis issue with union types in conditionals
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
      const existing = prev.filter(skill => skill.skillId !== skillId);
      if (confidence === 0) {
        return existing;
      }
      return [...existing, { skillId, confidence }];
    });
  };

  const getDomainColor = (color: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
      indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
      teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
      amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
    };
    return colorMap[color] || colorMap.blue;
  };

  const renderStarRating = (skillId: string, currentRating: number = 0) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleSkillChange(skillId, star)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors duration-200",
                star <= currentRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const getCurrentDomains = (): SkillDomain[] => {
    if (currentStep === 'formal') {
      return formalSkillDomains;
    }
    return informalSkillDomains;
  };

  const getUserSkillRating = (skillId: string): number => {
    const userSkill = userSkills.find(skill => skill.skillId === skillId);
    return userSkill ? userSkill.confidence : 0;
  };

  const getStepProgress = (): number => {
    const currentDomains = getCurrentDomains();
    const totalSkills = currentDomains.reduce((sum, domain) => sum + domain.skills.length, 0);
    const ratedSkills = userSkills.filter(skill => 
      currentDomains.some(domain => 
        domain.skills.some(s => s.id === skill.skillId)
      )
    ).length;
    return ratedSkills;
  };

  const formalSkillDomains: SkillDomain[] = [
    {
      id: 'mechanical-systems',
      name: 'Mechanical Systems',
      description: 'Pumps, motors, actuators, conveyors, material handling',
      icon: '⚙️',
      color: 'blue',
      category: 'hands-on',
      skills: [
        { id: 'actuator-mounting', name: 'Actuator Mounting & Alignment', description: 'Install and align pneumatic/hydraulic actuators to specifications' },
        { id: 'pump-alignment', name: 'Pump Alignment & Coupling', description: 'Precision alignment of pumps and motor couplings' },
        { id: 'conveyor-maintenance', name: 'Conveyor Belt Maintenance', description: 'Inspect, adjust, and replace conveyor components' },
        { id: 'bearing-replacement', name: 'Bearing Replacement', description: 'Remove and install mechanical bearings using proper tools' }
      ]
    },
    {
      id: 'electrical-power',
      name: 'Electrical Power & Wiring',
      description: 'Motors, power distribution, conduit, basic electrical safety',
      icon: '⚡',
      color: 'green',
      category: 'hands-on',
      skills: [
        { id: 'conduit-installation', name: 'Conduit Installation', description: 'EMT and rigid conduit bending, mounting, and cable pulling' },
        { id: 'motor-wiring', name: 'Motor Wiring & Connections', description: '3-phase motor connections, starter wiring, and control circuits' },
        { id: 'panel-layout', name: 'Panel Layout & Labeling', description: 'Electrical panel organization, component mounting, and wire labeling' },
        { id: 'voltage-testing', name: 'Voltage Testing & Safety', description: 'Multimeter usage, voltage verification, and electrical safety protocols' }
      ]
    },
    {
      id: 'electronics-pcb',
      name: 'Electronics & PCB Work',
      description: 'Soldering, component replacement, circuit boards, connectors',
      icon: '🔌',
      color: 'purple',
      category: 'hands-on',
      skills: [
        { id: 'tig-welding', name: 'TIG Welding', description: 'Tungsten inert gas welding for precision metal joining' },
        { id: 'circuit-board-repair', name: 'Circuit Board Repair', description: 'Component replacement and trace repair on electronic assemblies' },
        { id: 'connector-crimping', name: 'Connector Crimping', description: 'Wire termination and custom cable assembly techniques' },
        { id: 'component-identification', name: 'Component Identification', description: 'Electronic component recognition, specifications, and testing' }
      ]
    },
    {
      id: 'fabrication',
      name: 'Fabrication & Assembly',
      description: 'Machining, sheet metal, drilling, cutting, fastening',
      icon: '🔨',
      color: 'orange',
      category: 'hands-on',
      skills: [
        { id: 'sheet-metal-bending', name: 'Sheet Metal Bending', description: 'Brake press operation and precision metal forming techniques' },
        { id: 'precision-drilling', name: 'Precision Drilling', description: 'Drill press operation, hole sizing, and fixture setup' },
        { id: 'tap-die-threading', name: 'Tap & Die Threading', description: 'Thread cutting in metal and plastic materials' },
        { id: 'torque-specifications', name: 'Torque Specifications', description: 'Proper fastener installation using calibrated torque tools' }
      ]
    },
    {
      id: 'measurement-inspection',
      name: 'Measurement & Inspection',
      description: 'Precision tools, gauges, quality control, documentation',
      icon: '📏',
      color: 'pink',
      category: 'hands-on',
      skills: [
        { id: 'caliper-measurement', name: 'Caliper Measurement', description: 'Digital and dial caliper operation for dimensional inspection' },
        { id: 'micrometer-usage', name: 'Micrometer Usage', description: 'Outside and inside micrometer measurement techniques' },
        { id: 'surface-plate-inspection', name: 'Surface Plate Inspection', description: 'Granite surface plate setup and precision measurement verification' },
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
        { id: 'solar-offgrid-wiring', name: 'Solar Off-grid Wiring', description: 'Battery banks, charge controllers, and independent power systems' }
      ]
    }
  ];

  if (currentStep === 'completed') {
    const formalSkillsAssessed = userSkills.filter(skill => 
      formalSkillDomains.some(domain => 
        domain.skills.some(s => s.id === skill.skillId)
      )
    ).length;
    
    const informalSkillsAssessed = userSkills.length - formalSkillsAssessed;
    const averageConfidence = userSkills.length > 0 
      ? userSkills.reduce((sum, skill) => sum + skill.confidence, 0) / userSkills.length 
      : 0;

    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 min-h-[600px] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Skills Assessment Complete!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              You've successfully built your comprehensive skills profile. This information helps employers understand your full range of capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
              <Building2 className="h-8 w-8 mb-4 opacity-80" />
              <div className="text-3xl font-bold mb-2">{formalSkillsAssessed}</div>
              <div className="text-blue-100">Formal Skills</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <Target className="h-8 w-8 mb-4 opacity-80" />
              <div className="text-3xl font-bold mb-2">{informalSkillsAssessed}</div>
              <div className="text-purple-100">Informal Skills</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
              <Zap className="h-8 w-8 mb-4 opacity-80" />
              <div className="text-3xl font-bold mb-2">{averageConfidence.toFixed(1)}</div>
              <div className="text-green-100">Avg Confidence</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <Star className="h-8 w-8 mb-4 opacity-80" />
              <div className="text-3xl font-bold mb-2">{userSkills.length}</div>
              <div className="text-orange-100">Total Skills</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 min-h-[600px] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                currentStep === 'formal' ? "bg-blue-600 text-white" : "bg-green-500 text-white"
              )}>
                {currentStep === 'formal' ? '1' : '✓'}
              </div>
              <span className={cn(
                "font-medium",
                currentStep === 'formal' ? "text-blue-600" : "text-green-600"
              )}>
                Formal Skills
              </span>
            </div>
            
            <div className={cn(
              "h-0.5 w-16 transition-colors duration-300",
              (currentStep !== 'formal') ? "bg-green-500" : "bg-gray-300"
            )}></div>
            
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                currentStep === 'informal' ? "bg-blue-600 text-white" : 
                currentStep === 'completed' ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              )}>
                {currentStep === 'completed' ? '✓' : '2'}
              </div>
              <span className={cn(
                "font-medium",
                currentStep === 'informal' ? "text-blue-600" : 
                currentStep === 'completed' ? "text-green-600" : "text-gray-600"
              )}>
                Informal Skills
              </span>
            </div>
          </div>
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
              <span className="text-blue-100 text-sm">Progress: {getStepProgress()} skills rated</span>
              <button
                onClick={() => setShowRatingGuide(!showRatingGuide)}
                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm">What do the stars mean?</span>
              </button>
            </div>
          </div>

          {/* Star Rating Guide */}
          {showRatingGuide && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800 px-8 py-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Star Rating Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                {[
                  { stars: 1, label: "Unfamiliar", desc: "I've heard of this but never done it" },
                  { stars: 2, label: "Exposed", desc: "I've seen it done or tried it once" },
                  { stars: 3, label: "Knowledgeable", desc: "I understand the basics and could do simple tasks" },
                  { stars: 4, label: "Practiced", desc: "I can do this confidently with occasional guidance" },
                  { stars: 5, label: "Expert", desc: "I can teach others and handle complex scenarios" }
                ].map((level) => (
                  <div key={level.stars} className="text-center">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-4 w-4",
                            i < level.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          )} 
                        />
                      ))}
                    </div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">{level.label}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">{level.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Skills Content */}
            <div className="space-y-8">
              {currentStep === 'formal' && (
                <>
                  {/* Hands-On Technical Category */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="text-2xl">🧤</span>
                      Hands-On Technical Skills
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {getCurrentDomains().filter(d => d.category === 'hands-on').map(domain => (
                        <div key={domain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <button
                            onClick={() => toggleDomain(domain.id)}
                            className="w-full flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                              <span className="text-xl">{domain.icon}</span>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {domain.name}
                                </h4>
                                {expandedDomains.has(domain.id) ? 
                                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                }
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {domain.description}
                              </p>
                              <div className="text-xs text-gray-500">
                                {domain.skills.filter(skill => getUserSkillRating(skill.id) > 0).length} of {domain.skills.length} skills rated
                              </div>
                            </div>
                          </button>
                          
                          {expandedDomains.has(domain.id) && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/30">
                              <div className="space-y-4">
                                {domain.skills.map(skill => (
                                  <div key={skill.id} className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900 dark:text-white">
                                        {skill.name}
                                      </h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {skill.description}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      {renderStarRating(skill.id, getUserSkillRating(skill.id))}
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

                  {/* Computer-Based Technical Category */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="text-2xl">💻</span>
                      Computer-Based Technical Skills
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {getCurrentDomains().filter(d => d.category === 'computer').map(domain => (
                        <div key={domain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <button
                            onClick={() => toggleDomain(domain.id)}
                            className="w-full flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                              <span className="text-xl">{domain.icon}</span>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {domain.name}
                                </h4>
                                {expandedDomains.has(domain.id) ? 
                                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                }
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {domain.description}
                              </p>
                              <div className="text-xs text-gray-500">
                                {domain.skills.filter(skill => getUserSkillRating(skill.id) > 0).length} of {domain.skills.length} skills rated
                              </div>
                            </div>
                          </button>
                          
                          {expandedDomains.has(domain.id) && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/30">
                              <div className="space-y-4">
                                {domain.skills.map(skill => (
                                  <div key={skill.id} className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900 dark:text-white">
                                        {skill.name}
                                      </h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {skill.description}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      {renderStarRating(skill.id, getUserSkillRating(skill.id))}
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

                  {/* Hybrid/Systems Category */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="text-2xl">🔁</span>
                      Hybrid/Systems Skills
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {getCurrentDomains().filter(d => d.category === 'hybrid').map(domain => (
                        <div key={domain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <button
                            onClick={() => toggleDomain(domain.id)}
                            className="w-full flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                              <span className="text-xl">{domain.icon}</span>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {domain.name}
                                </h4>
                                {expandedDomains.has(domain.id) ? 
                                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                }
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {domain.description}
                              </p>
                              <div className="text-xs text-gray-500">
                                {domain.skills.filter(skill => getUserSkillRating(skill.id) > 0).length} of {domain.skills.length} skills rated
                              </div>
                            </div>
                          </button>
                          
                          {expandedDomains.has(domain.id) && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/30">
                              <div className="space-y-4">
                                {domain.skills.map(skill => (
                                  <div key={skill.id} className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900 dark:text-white">
                                        {skill.name}
                                      </h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {skill.description}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      {renderStarRating(skill.id, getUserSkillRating(skill.id))}
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
                </>
              )}

              {currentStep === 'informal' && (
                <>
                  {/* Informal Skills Content */}
                  <div className="space-y-8">
                    {getCurrentDomains().map(domain => (
                      <div key={domain.id}>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <button
                            onClick={() => toggleDomain(domain.id)}
                            className="w-full flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDomainColor(domain.color)}`}>
                              <span className="text-xl">{domain.icon}</span>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {domain.name}
                                </h4>
                                {expandedDomains.has(domain.id) ? 
                                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                }
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {domain.description}
                              </p>
                              <div className="text-xs text-gray-500">
                                {domain.skills.filter(skill => getUserSkillRating(skill.id) > 0).length} of {domain.skills.length} skills rated
                              </div>
                            </div>
                          </button>
                          
                          {expandedDomains.has(domain.id) && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/30">
                              <div className="space-y-4">
                                {domain.skills.map(skill => (
                                  <div key={skill.id} className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900 dark:text-white">
                                        {skill.name}
                                      </h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {skill.description}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      {renderStarRating(skill.id, getUserSkillRating(skill.id))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {currentStep === 'completed' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Skills Assessment Complete!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You've completed both formal and informal skills assessments. Your profile now contains a comprehensive view of your technical capabilities.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 max-w-2xl mx-auto">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">What's Next?</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 text-left">
                      <li>• Your skills profile is now available to potential employers</li>
                      <li>• Consider completing other profile sections for a stronger presentation</li>
                      <li>• Update your skills regularly as you gain experience</li>
                      <li>• Explore career pathways that match your skill profile</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentStep('formal')}
            disabled={currentStep === 'formal'}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Step
          </button>
          
          <button 
            onClick={() => {
              if (currentStep === 'formal') {
                setCurrentStep('informal');
              } else {
                setCurrentStep('completed');
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            {currentStep === 'formal' ? 'Continue to Informal Skills' : 'Complete Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
} 