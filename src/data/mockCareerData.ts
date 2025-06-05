// Mock data for Career Exploration UI development
// This allows UI components to be built and tested before backend is ready

export interface TechDomain {
  id: string;
  name: string;
  description: string;
  subdomains: TechSubdomain[];
}

export interface TechSubdomain {
  id: string;
  name: string;
  description: string;
  parentDomainId: string;
}

export interface IndustryDomain {
  id: string;
  name: string;
  description: string;
  subdomains: IndustrySubdomain[];
}

export interface IndustrySubdomain {
  id: string;
  name: string;
  description: string;
  parentDomainId: string;
}

export interface UserInterest {
  domainId?: string;
  subdomainId?: string;
  type: 'tech' | 'industry';
  weight: 0 | 1 | 2 | 3; // 👎 😐 👍 ❤️
}

export interface WorkEnvironmentPreference {
  id: string;
  type: 'work-environment';
  weight: 0 | 1 | 2 | 3;
}

export interface StarterPersona {
  id: string;
  name: string;
  description: string;
  workEnvironmentPreferences: WorkEnvironmentPreference[];
  presetInterests?: UserInterest[]; // Optional fallback for existing logic
}

// Mock Technology Domains (focused on advanced manufacturing and infrastructure)
export const mockTechDomains: TechDomain[] = [
  {
    id: 'hardware-infrastructure',
    name: 'Hardware & Infrastructure',
    description: 'Physical computing systems, server hardware, and infrastructure management',
    subdomains: [
      {
        id: 'server-hardware',
        name: 'Server Hardware',
        description: 'Server components, maintenance, and troubleshooting',
        parentDomainId: 'hardware-infrastructure'
      },
      {
        id: 'data-center-ops',
        name: 'Data Center Operations',
        description: 'Facility management, power systems, cooling infrastructure',
        parentDomainId: 'hardware-infrastructure'
      },
      {
        id: 'storage-systems',
        name: 'Storage Systems',
        description: 'SAN, NAS, backup systems, and storage management',
        parentDomainId: 'hardware-infrastructure'
      },
      {
        id: 'virtualization',
        name: 'Virtualization Technologies',
        description: 'VMware, Hyper-V, containerization platforms',
        parentDomainId: 'hardware-infrastructure'
      }
    ]
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Network infrastructure, protocols, and telecommunications',
    subdomains: [
      {
        id: 'network-infrastructure',
        name: 'Network Infrastructure',
        description: 'Switches, routers, firewalls, and network design',
        parentDomainId: 'networking'
      },
      {
        id: 'fiber-optics',
        name: 'Fiber Optic Systems',
        description: 'Fiber installation, testing, and maintenance',
        parentDomainId: 'networking'
      },
      {
        id: 'wireless-tech',
        name: 'Wireless Technologies',
        description: 'WiFi, cellular, radio frequency communications',
        parentDomainId: 'networking'
      },
      {
        id: 'network-protocols',
        name: 'Network Protocols',
        description: 'TCP/IP, routing protocols, network security',
        parentDomainId: 'networking'
      }
    ]
  },
  {
    id: 'manufacturing-production',
    name: 'Manufacturing & Production',
    description: 'Manufacturing processes, automation, and quality control',
    subdomains: [
      {
        id: 'cnc-machining',
        name: 'CNC Machining',
        description: 'Computer-controlled machining and precision manufacturing',
        parentDomainId: 'manufacturing-production'
      },
      {
        id: 'precision-measurement',
        name: 'Precision Measurement',
        description: 'Metrology, quality inspection, and measurement systems',
        parentDomainId: 'manufacturing-production'
      },
      {
        id: 'cad-cam',
        name: 'CAD/CAM Software',
        description: 'Computer-aided design and manufacturing software',
        parentDomainId: 'manufacturing-production'
      },
      {
        id: 'quality-control',
        name: 'Quality Control Systems',
        description: 'Statistical process control, inspection methods',
        parentDomainId: 'manufacturing-production'
      }
    ]
  },
  {
    id: 'robotics-automation',
    name: 'Robotics & Automation',
    description: 'Industrial robotics, automation systems, and control technologies',
    subdomains: [
      {
        id: 'industrial-robotics',
        name: 'Industrial Robotics',
        description: 'Robot programming, operation, and maintenance',
        parentDomainId: 'robotics-automation'
      },
      {
        id: 'plc-control',
        name: 'PLC Programming',
        description: 'Programmable logic controllers and automation control',
        parentDomainId: 'robotics-automation'
      },
      {
        id: 'pneumatic-hydraulic',
        name: 'Pneumatic & Hydraulic Systems',
        description: 'Fluid power systems for automation and robotics',
        parentDomainId: 'robotics-automation'
      },
      {
        id: 'sensors-actuators',
        name: 'Sensors & Actuators',
        description: 'Industrial sensors, feedback systems, and control devices',
        parentDomainId: 'robotics-automation'
      }
    ]
  },
  {
    id: 'semiconductor-tech',
    name: 'Semiconductor Technology',
    description: 'Semiconductor manufacturing, cleanroom operations, and process control',
    subdomains: [
      {
        id: 'wafer-processing',
        name: 'Wafer Processing',
        description: 'Semiconductor fabrication and wafer handling processes',
        parentDomainId: 'semiconductor-tech'
      },
      {
        id: 'cleanroom-ops',
        name: 'Cleanroom Operations',
        description: 'Cleanroom protocols, contamination control, safety procedures',
        parentDomainId: 'semiconductor-tech'
      },
      {
        id: 'process-control',
        name: 'Process Control',
        description: 'Statistical process control, yield optimization',
        parentDomainId: 'semiconductor-tech'
      },
      {
        id: 'equipment-maintenance',
        name: 'Equipment Maintenance',
        description: 'Semiconductor equipment troubleshooting and maintenance',
        parentDomainId: 'semiconductor-tech'
      }
    ]
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    description: 'Communication systems, cabling infrastructure, and telecom technologies',
    subdomains: [
      {
        id: 'structured-cabling',
        name: 'Structured Cabling',
        description: 'Cable installation, termination, and testing standards',
        parentDomainId: 'telecommunications'
      },
      {
        id: 'telecom-equipment',
        name: 'Telecom Equipment',
        description: 'PBX systems, switches, and communication hardware',
        parentDomainId: 'telecommunications'
      },
      {
        id: 'cable-testing',
        name: 'Cable Testing & Certification',
        description: 'Cable performance testing and industry certification',
        parentDomainId: 'telecommunications'
      },
      {
        id: 'voice-data-systems',
        name: 'Voice & Data Systems',
        description: 'VoIP, data communications, and integrated systems',
        parentDomainId: 'telecommunications'
      }
    ]
  }
];

// Mock Industry Domains - 16 Categories from PRD
export const mockIndustryDomains: IndustryDomain[] = [
  {
    id: 'advanced-manufacturing',
    name: 'Advanced Manufacturing & Industrial Production',
    description: 'Semiconductor fabs, precision machining, electronics assembly, additive manufacturing, contract manufacturers',
    subdomains: [
      {
        id: 'semiconductor-fabs',
        name: 'Semiconductor Fabrication',
        description: 'Chip manufacturing, wafer processing, cleanroom operations',
        parentDomainId: 'advanced-manufacturing'
      },
      {
        id: 'precision-machining',
        name: 'Precision & CNC Machining',
        description: 'High-precision manufacturing, computer-controlled machining',
        parentDomainId: 'advanced-manufacturing'
      },
      {
        id: 'electronics-assembly',
        name: 'Electronics Assembly & Testing',
        description: 'PCB assembly, electronic component testing and validation',
        parentDomainId: 'advanced-manufacturing'
      },
      {
        id: 'additive-manufacturing',
        name: 'Additive Manufacturing',
        description: '3D printing, rapid prototyping, custom production',
        parentDomainId: 'advanced-manufacturing'
      },
      {
        id: 'contract-manufacturing',
        name: 'Contract & High-Volume Manufacturing',
        description: 'Large-scale production, manufacturing outsourcing',
        parentDomainId: 'advanced-manufacturing'
      }
    ]
  },
  {
    id: 'aerospace-defense',
    name: 'Aerospace & Defense',
    description: 'Commercial aircraft, spacecraft, satellite manufacturing, UAV production, defense systems',
    subdomains: [
      {
        id: 'commercial-aircraft',
        name: 'Commercial Aircraft Manufacturing',
        description: 'Passenger aircraft design, assembly, and maintenance',
        parentDomainId: 'aerospace-defense'
      },
      {
        id: 'spacecraft-launch',
        name: 'Spacecraft & Launch Vehicles',
        description: 'Space exploration vehicles, rocket manufacturing',
        parentDomainId: 'aerospace-defense'
      },
      {
        id: 'satellite-operations',
        name: 'Satellite Design & Operations',
        description: 'Communication satellites, earth observation systems',
        parentDomainId: 'aerospace-defense'
      },
      {
        id: 'uav-systems',
        name: 'Unmanned Aerial Systems (UAS)',
        description: 'Drone manufacturing, autonomous flight systems',
        parentDomainId: 'aerospace-defense'
      },
      {
        id: 'defense-systems',
        name: 'Defense Systems Integration & MRO',
        description: 'Military systems, maintenance, repair, and operations',
        parentDomainId: 'aerospace-defense'
      }
    ]
  },
  {
    id: 'automotive-mobility',
    name: 'Automotive, Mobility & Transportation',
    description: 'Electric vehicles, autonomous vehicles, rail systems, EV charging infrastructure',
    subdomains: [
      {
        id: 'electric-vehicles',
        name: 'Electric Vehicle Manufacturing',
        description: 'EV production, battery technology, electric drivetrains',
        parentDomainId: 'automotive-mobility'
      },
      {
        id: 'autonomous-vehicles',
        name: 'Autonomous Vehicle Development',
        description: 'Self-driving technology, AI systems, sensor integration',
        parentDomainId: 'automotive-mobility'
      },
      {
        id: 'rail-transit',
        name: 'Rail & Transit Systems',
        description: 'Train manufacturing, transit infrastructure, signaling',
        parentDomainId: 'automotive-mobility'
      },
      {
        id: 'charging-infrastructure',
        name: 'Vehicle Charging & Fueling Infrastructure',
        description: 'EV charging stations, hydrogen fueling, energy systems',
        parentDomainId: 'automotive-mobility'
      },
      {
        id: 'fleet-telematics',
        name: 'Fleet Telematics & Logistics Services',
        description: 'Vehicle tracking, logistics optimization, fleet management',
        parentDomainId: 'automotive-mobility'
      }
    ]
  },
  {
    id: 'energy-utilities',
    name: 'Energy Generation & Utilities',
    description: 'Solar/wind farms, hydro/geothermal plants, grid operators, micro-grid integrators',
    subdomains: [
      {
        id: 'renewable-power',
        name: 'Solar & Wind Power Plants',
        description: 'Renewable energy generation, solar farms, wind turbines',
        parentDomainId: 'energy-utilities'
      },
      {
        id: 'hydro-geothermal',
        name: 'Hydro & Geothermal Facilities',
        description: 'Hydroelectric plants, geothermal energy systems',
        parentDomainId: 'energy-utilities'
      },
      {
        id: 'thermal-generation',
        name: 'Conventional Thermal Generation',
        description: 'Natural gas plants, coal plants, nuclear facilities',
        parentDomainId: 'energy-utilities'
      },
      {
        id: 'grid-operations',
        name: 'Transmission & Grid Operations',
        description: 'Power grid management, transmission lines, control centers',
        parentDomainId: 'energy-utilities'
      },
      {
        id: 'microgrid-distributed',
        name: 'Micro-grid & Distributed Energy',
        description: 'Local energy systems, distributed generation, smart grids',
        parentDomainId: 'energy-utilities'
      }
    ]
  },
  {
    id: 'sustainable-green',
    name: 'Sustainable & Green Solutions',
    description: 'Carbon capture, waste-to-energy, advanced recycling, water treatment',
    subdomains: [
      {
        id: 'carbon-capture',
        name: 'Carbon Capture & Utilization',
        description: 'CO2 capture technology, carbon storage, utilization projects',
        parentDomainId: 'sustainable-green'
      },
      {
        id: 'waste-energy',
        name: 'Waste-to-Energy & Advanced Recycling',
        description: 'Energy recovery from waste, advanced material recycling',
        parentDomainId: 'sustainable-green'
      },
      {
        id: 'water-treatment',
        name: 'Water Treatment & Desalination',
        description: 'Water purification, desalination plants, wastewater treatment',
        parentDomainId: 'sustainable-green'
      },
      {
        id: 'energy-efficiency',
        name: 'Energy Efficiency & Demand Response',
        description: 'Building retrofits, energy management, demand response services',
        parentDomainId: 'sustainable-green'
      },
      {
        id: 'bio-materials',
        name: 'Bio-based & Circular Economy Materials',
        description: 'Sustainable materials, circular economy, bio-manufacturing',
        parentDomainId: 'sustainable-green'
      }
    ]
  },
  {
    id: 'data-centers',
    name: 'Data Centers & Digital Infrastructure',
    description: 'Hyperscale/edge data centers, colocation facilities, critical facility services',
    subdomains: [
      {
        id: 'hyperscale-datacenters',
        name: 'Hyperscale Data Centers',
        description: 'Large-scale cloud infrastructure, mega data centers',
        parentDomainId: 'data-centers'
      },
      {
        id: 'edge-computing',
        name: 'Edge Data Centers',
        description: 'Local computing infrastructure, edge computing facilities',
        parentDomainId: 'data-centers'
      },
      {
        id: 'colocation-services',
        name: 'Colocation Facilities',
        description: 'Shared data center services, hosting infrastructure',
        parentDomainId: 'data-centers'
      },
      {
        id: 'critical-facilities',
        name: 'Critical Facility Services',
        description: 'Data center operations, facility management, maintenance',
        parentDomainId: 'data-centers'
      },
      {
        id: 'infrastructure-design',
        name: 'Digital Infrastructure Design',
        description: 'Data center design, infrastructure planning, capacity management',
        parentDomainId: 'data-centers'
      }
    ]
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications & Networking',
    description: '5G/6G carriers, fiber networks, satellite broadband, IoT connectivity',
    subdomains: [
      {
        id: 'cellular-carriers',
        name: '5G/6G Cellular Carriers',
        description: 'Mobile network operators, cellular infrastructure',
        parentDomainId: 'telecommunications'
      },
      {
        id: 'fiber-networks',
        name: 'Fiber Network Infrastructure',
        description: 'Fiber optic networks, broadband infrastructure',
        parentDomainId: 'telecommunications'
      },
      {
        id: 'satellite-broadband',
        name: 'Satellite Broadband',
        description: 'Satellite internet, space-based communications',
        parentDomainId: 'telecommunications'
      },
      {
        id: 'iot-connectivity',
        name: 'IoT Connectivity Services',
        description: 'Internet of Things networks, device connectivity',
        parentDomainId: 'telecommunications'
      },
      {
        id: 'network-equipment',
        name: 'Network Equipment Manufacturing',
        description: 'Telecom equipment, networking hardware, infrastructure',
        parentDomainId: 'telecommunications'
      }
    ]
  },
  {
    id: 'smart-cities',
    name: 'Smart Cities & Built Environment',
    description: 'Intelligent transportation, connected lighting, building automation, municipal IoT',
    subdomains: [
      {
        id: 'intelligent-transportation',
        name: 'Intelligent Transportation Systems',
        description: 'Smart traffic management, connected infrastructure',
        parentDomainId: 'smart-cities'
      },
      {
        id: 'connected-lighting',
        name: 'Connected Lighting & Utilities',
        description: 'Smart street lighting, connected utility systems',
        parentDomainId: 'smart-cities'
      },
      {
        id: 'building-automation',
        name: 'Building Automation & Management',
        description: 'Smart buildings, HVAC automation, energy management',
        parentDomainId: 'smart-cities'
      },
      {
        id: 'municipal-iot',
        name: 'Municipal IoT & Services',
        description: 'City-wide IoT networks, municipal technology services',
        parentDomainId: 'smart-cities'
      },
      {
        id: 'urban-planning',
        name: 'Smart Urban Planning & Analytics',
        description: 'City planning technology, urban analytics, digital twins',
        parentDomainId: 'smart-cities'
      }
    ]
  },
  {
    id: 'construction-tech',
    name: 'Construction Tech & Industrial EPC',
    description: 'EPC firms, BIM projects, modular construction, construction robotics',
    subdomains: [
      {
        id: 'epc-firms',
        name: 'Engineering, Procurement & Construction',
        description: 'Large-scale construction projects, industrial EPC',
        parentDomainId: 'construction-tech'
      },
      {
        id: 'bim-projects',
        name: 'Building Information Modeling',
        description: 'Digital construction modeling, project visualization',
        parentDomainId: 'construction-tech'
      },
      {
        id: 'modular-construction',
        name: 'Modular & Prefab Construction',
        description: 'Prefabricated buildings, modular construction systems',
        parentDomainId: 'construction-tech'
      },
      {
        id: 'construction-robotics',
        name: 'Construction Robotics & Automation',
        description: 'Automated construction, robotics in building',
        parentDomainId: 'construction-tech'
      },
      {
        id: 'construction-tech',
        name: 'Construction Technology Services',
        description: 'Digital construction tools, project management systems',
        parentDomainId: 'construction-tech'
      }
    ]
  },
  {
    id: 'healthcare-medical',
    name: 'Healthcare & Medical Technology',
    description: 'Medical devices, hospital IT, digital health, lab automation',
    subdomains: [
      {
        id: 'medical-devices',
        name: 'Medical Device Manufacturing',
        description: 'Medical equipment production, device development',
        parentDomainId: 'healthcare-medical'
      },
      {
        id: 'hospital-it',
        name: 'Hospital IT & Informatics',
        description: 'Electronic health records, hospital management systems',
        parentDomainId: 'healthcare-medical'
      },
      {
        id: 'digital-health',
        name: 'Digital Health & Telemedicine',
        description: 'Telehealth platforms, mobile health, remote monitoring',
        parentDomainId: 'healthcare-medical'
      },
      {
        id: 'lab-automation',
        name: 'Clinical Laboratory Automation',
        description: 'Automated lab equipment, diagnostic systems',
        parentDomainId: 'healthcare-medical'
      },
      {
        id: 'medical-imaging',
        name: 'Medical Imaging & Diagnostics',
        description: 'Imaging equipment, diagnostic technology',
        parentDomainId: 'healthcare-medical'
      }
    ]
  },
  {
    id: 'logistics-supply',
    name: 'Logistics, Warehousing & Supply Chain',
    description: 'Automated fulfillment, robotics 3PL, cold-chain monitoring, smart ports',
    subdomains: [
      {
        id: 'automated-fulfillment',
        name: 'Automated Fulfillment Centers',
        description: 'Warehouse automation, robotic picking, sorting systems',
        parentDomainId: 'logistics-supply'
      },
      {
        id: 'robotics-3pl',
        name: 'Robotics & 3PL Services',
        description: 'Third-party logistics, warehouse robotics',
        parentDomainId: 'logistics-supply'
      },
      {
        id: 'cold-chain',
        name: 'Cold-Chain Monitoring & Management',
        description: 'Temperature-controlled logistics, cold storage',
        parentDomainId: 'logistics-supply'
      },
      {
        id: 'smart-ports',
        name: 'Smart Ports & Shipping',
        description: 'Port automation, shipping logistics, cargo tracking',
        parentDomainId: 'logistics-supply'
      },
      {
        id: 'supply-chain-tech',
        name: 'Supply Chain Technology',
        description: 'Supply chain management, logistics software',
        parentDomainId: 'logistics-supply'
      }
    ]
  },
  {
    id: 'agriculture-food',
    name: 'Agriculture & Food Technology',
    description: 'Precision agriculture, indoor farming, food processing automation, ag-drones',
    subdomains: [
      {
        id: 'precision-agriculture',
        name: 'Precision Agriculture',
        description: 'Smart farming, GPS-guided equipment, crop monitoring',
        parentDomainId: 'agriculture-food'
      },
      {
        id: 'indoor-farming',
        name: 'Indoor & Vertical Farming',
        description: 'Controlled environment agriculture, hydroponic systems',
        parentDomainId: 'agriculture-food'
      },
      {
        id: 'food-processing',
        name: 'Food Processing Automation',
        description: 'Automated food production, processing equipment',
        parentDomainId: 'agriculture-food'
      },
      {
        id: 'agricultural-drones',
        name: 'Agricultural Drones & Monitoring',
        description: 'Crop monitoring drones, agricultural sensors',
        parentDomainId: 'agriculture-food'
      },
      {
        id: 'livestock-tech',
        name: 'Livestock & Dairy Technology',
        description: 'Automated milking, livestock monitoring, dairy tech',
        parentDomainId: 'agriculture-food'
      }
    ]
  },
  {
    id: 'mining-materials',
    name: 'Mining, Materials & Natural Resources',
    description: 'Smart mining, materials refinement, battery materials, resource monitoring',
    subdomains: [
      {
        id: 'smart-mining',
        name: 'Smart Mining Operations',
        description: 'Automated mining equipment, remote mining operations',
        parentDomainId: 'mining-materials'
      },
      {
        id: 'materials-refinement',
        name: 'Materials Refinement & Processing',
        description: 'Ore processing, material purification, smelting',
        parentDomainId: 'mining-materials'
      },
      {
        id: 'battery-materials',
        name: 'Battery Materials & Critical Minerals',
        description: 'Lithium processing, rare earth mining, battery supply chain',
        parentDomainId: 'mining-materials'
      },
      {
        id: 'resource-monitoring',
        name: 'Resource Monitoring & Exploration',
        description: 'Geological surveys, resource exploration, environmental monitoring',
        parentDomainId: 'mining-materials'
      },
      {
        id: 'extraction-tech',
        name: 'Extraction Technology & Equipment',
        description: 'Mining equipment manufacturing, extraction technology',
        parentDomainId: 'mining-materials'
      }
    ]
  },
  {
    id: 'consumer-electronics',
    name: 'Consumer Electronics & Smart Products',
    description: 'Home automation, wearables, personal robotics, XR hardware',
    subdomains: [
      {
        id: 'home-automation',
        name: 'Home Automation & Smart Appliances',
        description: 'Smart home devices, connected appliances, IoT products',
        parentDomainId: 'consumer-electronics'
      },
      {
        id: 'wearables-fitness',
        name: 'Wearables & Fitness Devices',
        description: 'Smartwatches, fitness trackers, health monitoring devices',
        parentDomainId: 'consumer-electronics'
      },
      {
        id: 'personal-robotics',
        name: 'Personal Robotics & Drones',
        description: 'Consumer robots, personal drones, entertainment robots',
        parentDomainId: 'consumer-electronics'
      },
      {
        id: 'xr-hardware',
        name: 'Extended Reality Hardware',
        description: 'VR headsets, AR glasses, mixed reality devices',
        parentDomainId: 'consumer-electronics'
      },
      {
        id: 'mobile-devices',
        name: 'Mobile Devices & Accessories',
        description: 'Smartphones, tablets, mobile accessories',
        parentDomainId: 'consumer-electronics'
      }
    ]
  },
  {
    id: 'research-education',
    name: 'Research, Education & R&D Services',
    description: 'National labs, university research, contract R&D, testing services',
    subdomains: [
      {
        id: 'university-research',
        name: 'University Research Laboratories',
        description: 'Academic research, university labs, educational research',
        parentDomainId: 'research-education'
      },
      {
        id: 'national-labs',
        name: 'National & Government Research',
        description: 'Federal research facilities, government labs',
        parentDomainId: 'research-education'
      },
      {
        id: 'contract-rd',
        name: 'Contract R&D & Prototype Development',
        description: 'Private R&D services, prototype development firms',
        parentDomainId: 'research-education'
      },
      {
        id: 'testing-certification',
        name: 'Testing, Certification & Standards',
        description: 'Product testing, standards bodies, certification services',
        parentDomainId: 'research-education'
      },
      {
        id: 'tech-transfer',
        name: 'Technology Transfer & Incubators',
        description: 'Tech commercialization, startup incubators, innovation centers',
        parentDomainId: 'research-education'
      }
    ]
  },
  {
    id: 'public-safety',
    name: 'Public Safety & Security',
    description: 'Critical infrastructure protection, physical security, cybersecurity services',
    subdomains: [
      {
        id: 'infrastructure-protection',
        name: 'Critical Infrastructure Protection',
        description: 'Power grid security, transportation security, infrastructure defense',
        parentDomainId: 'public-safety'
      },
      {
        id: 'physical-security',
        name: 'Physical Security Systems',
        description: 'Access control, surveillance systems, security integration',
        parentDomainId: 'public-safety'
      },
      {
        id: 'cybersecurity-services',
        name: 'Cybersecurity Services',
        description: 'Managed security services, cyber defense, threat intelligence',
        parentDomainId: 'public-safety'
      },
      {
        id: 'emergency-response',
        name: 'Emergency Response Technology',
        description: 'Emergency communication, first responder tech, crisis management',
        parentDomainId: 'public-safety'
      },
      {
        id: 'surveillance-awareness',
        name: 'Surveillance & Situational Awareness',
        description: 'Monitoring systems, situational awareness platforms',
        parentDomainId: 'public-safety'
      }
    ]
  }
];

// Work Environment Types
export const WORK_ENVIRONMENT_TYPES = [
  {
    id: 'lab-workshop-factory',
    name: 'Lab & Workshop',
    description: 'Hands-on work in controlled environments like laboratories, workshops, or manufacturing facilities'
  },
  {
    id: 'computer-intensive',
    name: 'Computer Focused',
    description: 'Primarily desk-based work involving computers, software, and digital systems'
  },
  {
    id: 'field-onsite',
    name: 'Field & On-site',
    description: 'Work performed at various locations, client sites, or outdoor environments'
  },
  {
    id: 'hybrid-environment',
    name: 'Hybrid Work',
    description: 'Combination of workshop, office, and field work depending on project needs'
  }
] as const;

// Mock Starter Personas - Based on Work Environment Preferences
export const mockStarterPersonas: StarterPersona[] = [
  {
    id: 'hands-on-maker',
    name: 'Hands-On Maker',
    description: 'Prefer working with tools, equipment, and building things in structured environments',
    workEnvironmentPreferences: [
      { id: 'lab-workshop-factory', type: 'work-environment', weight: 3 },
      { id: 'hybrid-environment', type: 'work-environment', weight: 2 },
      { id: 'computer-intensive', type: 'work-environment', weight: 1 },
      { id: 'field-onsite', type: 'work-environment', weight: 1 }
    ]
  },
  {
    id: 'tech-specialist',
    name: 'Tech Specialist',
    description: 'Enjoy working with computers, software, and digital systems',
    workEnvironmentPreferences: [
      { id: 'computer-intensive', type: 'work-environment', weight: 3 },
      { id: 'hybrid-environment', type: 'work-environment', weight: 2 },
      { id: 'lab-workshop-factory', type: 'work-environment', weight: 1 },
      { id: 'field-onsite', type: 'work-environment', weight: 1 }
    ]
  },
  {
    id: 'mobile-worker',
    name: 'Mobile Worker',
    description: 'Like variety and working in different locations and environments',
    workEnvironmentPreferences: [
      { id: 'field-onsite', type: 'work-environment', weight: 3 },
      { id: 'hybrid-environment', type: 'work-environment', weight: 3 },
      { id: 'lab-workshop-factory', type: 'work-environment', weight: 2 },
      { id: 'computer-intensive', type: 'work-environment', weight: 1 }
    ]
  },
  {
    id: 'flexible-adapter',
    name: 'Flexible Adapter',
    description: 'Comfortable with any work environment depending on the project and role',
    workEnvironmentPreferences: [
      { id: 'hybrid-environment', type: 'work-environment', weight: 3 },
      { id: 'lab-workshop-factory', type: 'work-environment', weight: 2 },
      { id: 'computer-intensive', type: 'work-environment', weight: 2 },
      { id: 'field-onsite', type: 'work-environment', weight: 2 }
    ]
  }
];

// Helper functions for UI development
export const getEmojiForWeight = (weight: 0 | 1 | 2 | 3): string => {
  const emojiMap = {
    0: '👎',
    1: '😐', 
    2: '👍',
    3: '❤️'
  };
  return emojiMap[weight];
};

export const getColorForWeight = (weight: 0 | 1 | 2 | 3): string => {
  const colorMap = {
    0: '#ef4444', // red-500
    1: '#6b7280', // gray-500
    2: '#10b981', // emerald-500
    3: '#ec4899'  // pink-500
  };
  return colorMap[weight];
};

// Mock function to simulate saving user interests
export const saveUserInterests = async (interests: UserInterest[]): Promise<void> => {
  console.log('Saving user interests:', interests);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  localStorage.setItem('userInterests', JSON.stringify(interests));
};

// Mock function to load user interests
export const loadUserInterests = (): UserInterest[] => {
  const saved = localStorage.getItem('userInterests');
  return saved ? JSON.parse(saved) : [];
};

// Career Pathway Types
export interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  progress: number; // 0-100
  url?: string;
}

export interface CareerPathway {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  requiredTechDomains: string[];
  relevantIndustries: string[];
  courses: Course[];
  totalCourses: number;
  completedCourses: number;
  overallProgress: number; // 0-100
  dateAdded: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
}

// Sample Career Pathways - Focused on Advanced Manufacturing and Technology Infrastructure
export const mockCareerPathways: CareerPathway[] = [
  {
    id: 'pathway-1',
    title: 'Data Center Technician',
    description: 'Comprehensive path to becoming a data center technician with server hardware, networking, and cloud infrastructure skills',
    targetRole: 'Senior Data Center Technician',
    estimatedDuration: '8-12 months',
    difficulty: 'Intermediate',
    salary: {
      min: 45000,
      max: 75000,
      currency: 'USD'
    },
    requiredTechDomains: ['Hardware & Infrastructure', 'Networking', 'Cloud Computing'],
    relevantIndustries: ['Data Centers & Digital Infrastructure', 'Cloud Computing & Web Services', 'Telecommunications & Networking'],
    courses: [
      {
        id: 'course-1',
        title: 'CompTIA Server+ Certification',
        provider: 'CompTIA',
        duration: '10 weeks',
        difficulty: 'Intermediate',
        completed: true,
        progress: 100,
        url: '#'
      },
      {
        id: 'course-2',
        title: 'Data Center Fundamentals',
        provider: 'Data Center Institute',
        duration: '8 weeks',
        difficulty: 'Beginner',
        completed: false,
        progress: 65,
        url: '#'
      },
      {
        id: 'course-3',
        title: 'Network Infrastructure Management',
        provider: 'Cisco Academy',
        duration: '12 weeks',
        difficulty: 'Intermediate',
        completed: false,
        progress: 0,
        url: '#'
      },
      {
        id: 'course-4',
        title: 'Cloud Infrastructure Operations',
        provider: 'AWS Training',
        duration: '6 weeks',
        difficulty: 'Beginner',
        completed: false,
        progress: 0,
        url: '#'
      }
    ],
    totalCourses: 4,
    completedCourses: 1,
    overallProgress: 41,
    dateAdded: '2024-01-15',
    priority: 'high',
    status: 'active'
  },
  {
    id: 'pathway-2',
    title: 'Structured Cable Technician',
    description: 'Path to becoming a structured cabling specialist for telecommunications and data networks',
    targetRole: 'Senior Cabling Technician',
    estimatedDuration: '6-10 months',
    difficulty: 'Beginner',
    salary: {
      min: 38000,
      max: 62000,
      currency: 'USD'
    },
    requiredTechDomains: ['Telecommunications', 'Networking', 'Electrical Systems'],
    relevantIndustries: ['Telecommunications & Networking', 'Construction & Building Technologies', 'Data Centers & Digital Infrastructure'],
    courses: [
      {
        id: 'course-5',
        title: 'Fiber Optic Installation & Testing',
        provider: 'Fiber Institute',
        duration: '8 weeks',
        difficulty: 'Beginner',
        completed: true,
        progress: 100,
        url: '#'
      },
      {
        id: 'course-6',
        title: 'Structured Cabling Standards (TIA/EIA)',
        provider: 'BICSI',
        duration: '6 weeks',
        difficulty: 'Intermediate',
        completed: false,
        progress: 30,
        url: '#'
      },
      {
        id: 'course-7',
        title: 'Network Cable Testing & Certification',
        provider: 'Fluke Networks',
        duration: '4 weeks',
        difficulty: 'Intermediate',
        completed: false,
        progress: 0,
        url: '#'
      }
    ],
    totalCourses: 3,
    completedCourses: 1,
    overallProgress: 43,
    dateAdded: '2024-02-01',
    priority: 'medium',
    status: 'active'
  },
  {
    id: 'pathway-3',
    title: 'Precision Machinist',
    description: 'Advanced manufacturing path focusing on CNC machining, precision measurement, and quality control',
    targetRole: 'CNC Precision Machinist',
    estimatedDuration: '12-18 months',
    difficulty: 'Intermediate',
    salary: {
      min: 42000,
      max: 68000,
      currency: 'USD'
    },
    requiredTechDomains: ['Manufacturing & Production', 'CAD/CAM Software', 'Quality Control & Testing'],
    relevantIndustries: ['Advanced Manufacturing & Industry 4.0', 'Aerospace & Defense', 'Automotive/Mobility & Transportation'],
    courses: [
      {
        id: 'course-8',
        title: 'CNC Programming & Operation',
        provider: 'Manufacturing Institute',
        duration: '16 weeks',
        difficulty: 'Intermediate',
        completed: true,
        progress: 100,
        url: '#'
      },
      {
        id: 'course-9',
        title: 'Precision Measurement & Metrology',
        provider: 'Quality Academy',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        completed: true,
        progress: 100,
        url: '#'
      },
      {
        id: 'course-10',
        title: 'CAD/CAM with Mastercam',
        provider: 'CAD Institute',
        duration: '12 weeks',
        difficulty: 'Advanced',
        completed: false,
        progress: 15,
        url: '#'
      }
    ],
    totalCourses: 3,
    completedCourses: 2,
    overallProgress: 72,
    dateAdded: '2024-01-20',
    priority: 'high',
    status: 'active'
  },
  {
    id: 'pathway-4',
    title: 'Semiconductor Process Technician',
    description: 'Path to semiconductor manufacturing expertise with cleanroom operations and process control',
    targetRole: 'Semiconductor Process Technician',
    estimatedDuration: '10-14 months',
    difficulty: 'Intermediate',
    salary: {
      min: 48000,
      max: 75000,
      currency: 'USD'
    },
    requiredTechDomains: ['Semiconductor Technology', 'Process Control', 'Quality Control & Testing'],
    relevantIndustries: ['Semiconductors & Microelectronics', 'Advanced Manufacturing & Industry 4.0', 'Research & Development'],
    courses: [
      {
        id: 'course-11',
        title: 'Semiconductor Fundamentals',
        provider: 'Semiconductor Institute',
        duration: '10 weeks',
        difficulty: 'Beginner',
        completed: false,
        progress: 25,
        url: '#'
      },
      {
        id: 'course-12',
        title: 'Cleanroom Operations & Safety',
        provider: 'Semiconductor Academy',
        duration: '6 weeks',
        difficulty: 'Beginner',
        completed: false,
        progress: 0,
        url: '#'
      },
      {
        id: 'course-13',
        title: 'Wafer Processing & Fabrication',
        provider: 'Fab Institute',
        duration: '14 weeks',
        difficulty: 'Intermediate',
        completed: false,
        progress: 0,
        url: '#'
      },
      {
        id: 'course-14',
        title: 'Process Control & Statistical Methods',
        provider: 'Quality Systems',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        completed: false,
        progress: 0,
        url: '#'
      }
    ],
    totalCourses: 4,
    completedCourses: 0,
    overallProgress: 6,
    dateAdded: '2024-02-10',
    priority: 'medium',
    status: 'active'
  },
  {
    id: 'pathway-5',
    title: 'Robotics Technician',
    description: 'Path to becoming a robotics technician with skills in automation, programming, and maintenance',
    targetRole: 'Industrial Robotics Technician',
    estimatedDuration: '10-15 months',
    difficulty: 'Intermediate',
    salary: {
      min: 50000,
      max: 78000,
      currency: 'USD'
    },
    requiredTechDomains: ['Robotics & Automation', 'Programming', 'Electrical Systems'],
    relevantIndustries: ['Advanced Manufacturing & Industry 4.0', 'Automotive/Mobility & Transportation', 'Logistics & Supply Chain'],
    courses: [
      {
        id: 'course-15',
        title: 'Industrial Robotics Fundamentals',
        provider: 'Robotics Institute',
        duration: '12 weeks',
        difficulty: 'Beginner',
        completed: true,
        progress: 100,
        url: '#'
      },
      {
        id: 'course-16',
        title: 'PLC Programming & Control Systems',
        provider: 'Automation Academy',
        duration: '10 weeks',
        difficulty: 'Intermediate',
        completed: false,
        progress: 45,
        url: '#'
      },
      {
        id: 'course-17',
        title: 'Robot Programming (ABB, KUKA, Fanuc)',
        provider: 'Robot Systems',
        duration: '14 weeks',
        difficulty: 'Intermediate',
        completed: false,
        progress: 0,
        url: '#'
      },
      {
        id: 'course-18',
        title: 'Pneumatics & Hydraulics for Robotics',
        provider: 'Fluid Power Institute',
        duration: '8 weeks',
        difficulty: 'Beginner',
        completed: false,
        progress: 0,
        url: '#'
      }
    ],
    totalCourses: 4,
    completedCourses: 1,
    overallProgress: 36,
    dateAdded: '2024-01-25',
    priority: 'high',
    status: 'active'
  }
];

// Mock user profile data
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  selectedPersona?: string;
  capturedInterests: {
    techDomains: Record<string, number>;
    industryDomains: Record<string, number>;
    capturedAt: string;
  };
  savedPathways: string[]; // pathway IDs
  achievements: {
    coursesCompleted: number;
    pathwaysInProgress: number;
    totalLearningHours: number;
  };
}

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  avatar: '/api/placeholder/64/64',
  selectedPersona: 'Career Switcher',
  capturedInterests: {
    techDomains: {
      'Hardware & Infrastructure': 4,
      'Networking': 3,
      'Manufacturing & Production': 4,
      'Robotics & Automation': 4,
      'Semiconductor Technology': 3,
      'Telecommunications': 2
    },
    industryDomains: {
      'Advanced Manufacturing & Industry 4.0': 4,
      'Data Centers & Digital Infrastructure': 4,
      'Telecommunications & Networking': 3,
      'Semiconductors & Microelectronics': 3,
      'Aerospace & Defense': 2
    },
    capturedAt: '2024-01-10'
  },
  savedPathways: ['pathway-1', 'pathway-2', 'pathway-3', 'pathway-4', 'pathway-5'],
  achievements: {
    coursesCompleted: 5,
    pathwaysInProgress: 5,
    totalLearningHours: 187
  }
}; 