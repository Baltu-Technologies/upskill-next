'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  Zap, 
  Clock, 
  ChevronRight, 
  Play, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Trophy,
  Award,
  CheckCircle,
  Users
} from 'lucide-react';
import Image from 'next/image';

// Define the Certification interface
interface Certification {
  id: number;
  title: string;
  provider: string;
  providerLogo: string;
  description: string;
  industry: string;
  level: 'Entry Level' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedDuration: string;
  totalCourses: number;
  enrolledStudents: number;
  averageRating: number;
  image: string;
  credentialType: 'Certificate' | 'Professional Certificate' | 'Industry Certification' | 'License';
  prerequisites?: string[];
  courses: CertificationCourse[];
  tags: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}

// Define CertificationCourse interface
interface CertificationCourse {
  id: number;
  title: string;
  provider: string;
  providerLogo: string;
  duration: string;
  level: string;
  xp: number;
  isRequired: boolean;
  order: number;
  description: string;
}

// Mock certifications data aligned with supported industries
const mockCertifications: Certification[] = [
  {
    id: 1,
    title: 'Certified Data Center Professional (CDCP)',
    provider: 'Data Center Certification Association',
    providerLogo: '/media/organization_logo/dcca.png',
    description: 'Comprehensive certification for data center operations, covering server hardware, networking, cooling systems, and facility management.',
    industry: 'Data Centers & Digital Infrastructure',
    level: 'Intermediate',
    estimatedDuration: '3-4 months',
    totalCourses: 6,
    enrolledStudents: 1250,
    averageRating: 4.7,
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=300&fit=crop&crop=center',
    credentialType: 'Professional Certificate',
    prerequisites: ['Basic networking knowledge', '1+ years IT experience'],
    salary: {
      min: 65000,
      max: 95000,
      currency: 'USD'
    },
    tags: ['Server Hardware', 'Network Infrastructure', 'Facility Management', 'Cloud Operations'],
    courses: [
      {
        id: 101,
        title: 'Data Center Fundamentals',
        provider: 'Data Center Institute',
        providerLogo: '/media/organization_logo/dci.png',
        duration: '3 weeks',
        level: 'Beginner',
        xp: 400,
        isRequired: true,
        order: 1,
        description: 'Introduction to data center architecture, power systems, and cooling infrastructure.'
      },
      {
        id: 102,
        title: 'Server Hardware & Maintenance',
        provider: 'Dell Technologies',
        providerLogo: '/media/organization_logo/dell.png',
        duration: '4 weeks',
        level: 'Intermediate',
        xp: 600,
        isRequired: true,
        order: 2,
        description: 'Hands-on training in server installation, configuration, and troubleshooting.'
      },
      {
        id: 103,
        title: 'Network Infrastructure Management',
        provider: 'Cisco Systems',
        providerLogo: '/media/organization_logo/cisco.png',
        duration: '5 weeks',
        level: 'Intermediate',
        xp: 750,
        isRequired: true,
        order: 3,
        description: 'Network design, implementation, and management for data center environments.'
      },
      {
        id: 104,
        title: 'Data Center Security & Compliance',
        provider: 'CompTIA',
        providerLogo: '/media/organization_logo/comptia.png',
        duration: '3 weeks',
        level: 'Intermediate',
        xp: 500,
        isRequired: true,
        order: 4,
        description: 'Security protocols, access control, and compliance requirements for data centers.'
      },
      {
        id: 105,
        title: 'Cloud Infrastructure Operations',
        provider: 'Amazon Web Services',
        providerLogo: '/media/organization_logo/aws.png',
        duration: '4 weeks',
        level: 'Advanced',
        xp: 800,
        isRequired: true,
        order: 5,
        description: 'Managing cloud infrastructure and hybrid data center environments.'
      },
      {
        id: 106,
        title: 'Data Center Efficiency & Sustainability',
        provider: 'Green Grid',
        providerLogo: '/media/organization_logo/green-grid.png',
        duration: '2 weeks',
        level: 'Intermediate',
        xp: 350,
        isRequired: false,
        order: 6,
        description: 'Energy efficiency, sustainability practices, and green data center operations.'
      }
    ]
  },
  {
    id: 2,
    title: 'NABCEP Solar Installation Professional',
    provider: 'North American Board of Certified Energy Practitioners',
    providerLogo: '/media/organization_logo/nabcep.png',
    description: 'Industry-standard certification for solar photovoltaic installation professionals, covering system design, installation, and maintenance.',
    industry: 'Green Technology & Renewable Energy',
    level: 'Intermediate',
    estimatedDuration: '4-6 months',
    totalCourses: 7,
    enrolledStudents: 890,
    averageRating: 4.8,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=300&fit=crop&crop=center',
    credentialType: 'Industry Certification',
    prerequisites: ['Basic electrical knowledge', 'Safety training completion'],
    salary: {
      min: 45000,
      max: 75000,
      currency: 'USD'
    },
    tags: ['Solar Installation', 'Electrical Systems', 'System Design', 'Safety Protocols'],
    courses: [
      {
        id: 201,
        title: 'Solar Energy Fundamentals',
        provider: 'Solar Energy Industries Association',
        providerLogo: '/media/organization_logo/seia.png',
        duration: '3 weeks',
        level: 'Beginner',
        xp: 450,
        isRequired: true,
        order: 1,
        description: 'Introduction to photovoltaic technology, solar resource assessment, and system components.'
      },
      {
        id: 202,
        title: 'Electrical Systems for Solar',
        provider: 'Tesla Energy',
        providerLogo: '/media/organization_logo/tesla.png',
        duration: '4 weeks',
        level: 'Intermediate',
        xp: 650,
        isRequired: true,
        order: 2,
        description: 'DC and AC electrical systems, inverters, and electrical safety for solar installations.'
      },
      {
        id: 203,
        title: 'Solar System Design & Engineering',
        provider: 'SunPower Corporation',
        providerLogo: '/media/organization_logo/sunpower.png',
        duration: '5 weeks',
        level: 'Intermediate',
        xp: 750,
        isRequired: true,
        order: 3,
        description: 'System sizing, layout design, shading analysis, and performance modeling.'
      },
      {
        id: 204,
        title: 'Solar Panel Installation & Mounting',
        provider: 'First Solar',
        providerLogo: '/media/organization_logo/first-solar.png',
        duration: '4 weeks',
        level: 'Intermediate',
        xp: 700,
        isRequired: true,
        order: 4,
        description: 'Mechanical installation, mounting systems, and structural considerations.'
      },
      {
        id: 205,
        title: 'Solar Safety & Code Compliance',
        provider: 'Occupational Safety and Health Administration',
        providerLogo: '/media/organization_logo/osha.png',
        duration: '2 weeks',
        level: 'Beginner',
        xp: 300,
        isRequired: true,
        order: 5,
        description: 'Safety protocols, fall protection, and electrical code compliance for solar installations.'
      },
      {
        id: 206,
        title: 'Energy Storage Systems Integration',
        provider: 'Enphase Energy',
        providerLogo: '/media/organization_logo/enphase.png',
        duration: '3 weeks',
        level: 'Advanced',
        xp: 600,
        isRequired: true,
        order: 6,
        description: 'Battery storage systems, grid-tie configurations, and backup power solutions.'
      },
      {
        id: 207,
        title: 'Solar System Commissioning & Maintenance',
        provider: 'Canadian Solar',
        providerLogo: '/media/organization_logo/canadian-solar.png',
        duration: '3 weeks',
        level: 'Intermediate',
        xp: 500,
        isRequired: false,
        order: 7,
        description: 'System testing, performance verification, and ongoing maintenance procedures.'
      }
    ]
  },
  {
    id: 3,
    title: 'Certified Manufacturing Technologist (CMfgT)',
    provider: 'Society of Manufacturing Engineers',
    providerLogo: '/media/organization_logo/sme.png',
    description: 'Professional certification for manufacturing technologists covering CNC machining, quality control, and advanced manufacturing processes.',
    industry: 'Advanced Manufacturing',
    level: 'Advanced',
    estimatedDuration: '5-7 months',
    totalCourses: 8,
    enrolledStudents: 650,
    averageRating: 4.6,
    image: 'https://images.unsplash.com/photo-1563200424-2F6196024328?w=600&h=300&fit=crop&crop=center',
    credentialType: 'Professional Certificate',
    prerequisites: ['2+ years manufacturing experience', 'Basic CAD knowledge'],
    salary: {
      min: 55000,
      max: 85000,
      currency: 'USD'
    },
    tags: ['CNC Machining', 'Quality Control', 'Lean Manufacturing', 'CAD/CAM'],
    courses: [
      {
        id: 301,
        title: 'Manufacturing Fundamentals',
        provider: 'Manufacturing Institute',
        providerLogo: '/media/organization_logo/manufacturing-institute.png',
        duration: '3 weeks',
        level: 'Beginner',
        xp: 400,
        isRequired: true,
        order: 1,
        description: 'Introduction to manufacturing processes, materials, and production systems.'
      },
      {
        id: 302,
        title: 'CNC Programming & Operation',
        provider: 'Haas Automation',
        providerLogo: '/media/organization_logo/haas.png',
        duration: '6 weeks',
        level: 'Intermediate',
        xp: 800,
        isRequired: true,
        order: 2,
        description: 'CNC machine programming, setup, and operation for precision manufacturing.'
      },
      {
        id: 303,
        title: 'Precision Measurement & Metrology',
        provider: 'Mitutoyo Corporation',
        providerLogo: '/media/organization_logo/mitutoyo.png',
        duration: '4 weeks',
        level: 'Intermediate',
        xp: 600,
        isRequired: true,
        order: 3,
        description: 'Precision measurement tools, statistical process control, and quality assurance.'
      },
      {
        id: 304,
        title: 'CAD/CAM with Mastercam',
        provider: 'CNC Software',
        providerLogo: '/media/organization_logo/mastercam.png',
        duration: '5 weeks',
        level: 'Advanced',
        xp: 750,
        isRequired: true,
        order: 4,
        description: 'Computer-aided design and manufacturing using industry-standard software.'
      },
      {
        id: 305,
        title: 'Lean Manufacturing & Six Sigma',
        provider: 'Lean Enterprise Institute',
        providerLogo: '/media/organization_logo/lei.png',
        duration: '4 weeks',
        level: 'Intermediate',
        xp: 650,
        isRequired: true,
        order: 5,
        description: 'Lean principles, waste reduction, and continuous improvement methodologies.'
      },
      {
        id: 306,
        title: 'Advanced Materials & Heat Treatment',
        provider: 'ASM International',
        providerLogo: '/media/organization_logo/asm.png',
        duration: '3 weeks',
        level: 'Advanced',
        xp: 550,
        isRequired: true,
        order: 6,
        description: 'Material properties, selection, and heat treatment processes for manufacturing.'
      },
      {
        id: 307,
        title: 'Industrial Automation & Robotics',
        provider: 'FANUC Corporation',
        providerLogo: '/media/organization_logo/fanuc.png',
        duration: '5 weeks',
        level: 'Advanced',
        xp: 800,
        isRequired: true,
        order: 7,
        description: 'Industrial robot programming, automation systems, and integration.'
      },
      {
        id: 308,
        title: 'Manufacturing Safety & Compliance',
        provider: 'National Safety Council',
        providerLogo: '/media/organization_logo/nsc.png',
        duration: '2 weeks',
        level: 'Beginner',
        xp: 300,
        isRequired: false,
        order: 8,
        description: 'Workplace safety, OSHA compliance, and risk management in manufacturing.'
      }
    ]
  },
  {
    id: 4,
    title: 'Fiber Optic Technician Certification (FOT)',
    provider: 'Fiber Optic Association',
    providerLogo: '/media/organization_logo/foa.png',
    description: 'Industry-recognized certification for fiber optic installation, splicing, and testing professionals in telecommunications and broadband infrastructure.',
    industry: 'Broadband & Fiber Optics',
    level: 'Intermediate',
    estimatedDuration: '3-4 months',
    totalCourses: 5,
    enrolledStudents: 420,
    averageRating: 4.5,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=300&fit=crop&crop=center',
    credentialType: 'Industry Certification',
    prerequisites: ['Basic electrical knowledge', 'Hand tool proficiency'],
    salary: {
      min: 48000,
      max: 72000,
      currency: 'USD'
    },
    tags: ['Fiber Splicing', 'Network Installation', 'Testing Equipment', 'Telecommunications'],
    courses: [
      {
        id: 401,
        title: 'Fiber Optic Fundamentals',
        provider: 'Corning Incorporated',
        providerLogo: '/media/organization_logo/corning.png',
        duration: '3 weeks',
        level: 'Beginner',
        xp: 450,
        isRequired: true,
        order: 1,
        description: 'Principles of fiber optic communication, light transmission, and system components.'
      },
      {
        id: 402,
        title: 'Fiber Splicing & Termination',
        provider: 'Sumitomo Electric',
        providerLogo: '/media/organization_logo/sumitomo.png',
        duration: '4 weeks',
        level: 'Intermediate',
        xp: 700,
        isRequired: true,
        order: 2,
        description: 'Fusion splicing, mechanical splicing, and connector termination techniques.'
      },
      {
        id: 403,
        title: 'Fiber Network Installation',
        provider: 'CommScope',
        providerLogo: '/media/organization_logo/commscope.png',
        duration: '4 weeks',
        level: 'Intermediate',
        xp: 650,
        isRequired: true,
        order: 3,
        description: 'Cable installation, routing, and infrastructure deployment for fiber networks.'
      },
      {
        id: 404,
        title: 'Fiber Testing & Troubleshooting',
        provider: 'EXFO Inc.',
        providerLogo: '/media/organization_logo/exfo.png',
        duration: '3 weeks',
        level: 'Intermediate',
        xp: 600,
        isRequired: true,
        order: 4,
        description: 'OTDR testing, power measurement, and fiber network troubleshooting.'
      },
      {
        id: 405,
        title: 'Safety & Standards for Fiber Optics',
        provider: 'Telecommunications Industry Association',
        providerLogo: '/media/organization_logo/tia.png',
        duration: '2 weeks',
        level: 'Beginner',
        xp: 300,
        isRequired: true,
        order: 5,
        description: 'Safety protocols, industry standards, and best practices for fiber optic work.'
      }
    ]
  },
  {
    id: 5,
    title: 'Certified Wind Turbine Technician',
    provider: 'Global Wind Organisation',
    providerLogo: '/media/organization_logo/gwo.png',
    description: 'International certification for wind turbine maintenance technicians, covering safety, mechanical, and electrical systems.',
    industry: 'Green Technology & Renewable Energy',
    level: 'Advanced',
    estimatedDuration: '6-8 months',
    totalCourses: 6,
    enrolledStudents: 340,
    averageRating: 4.9,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=300&fit=crop&crop=center',
    credentialType: 'Industry Certification',
    prerequisites: ['Physical fitness requirements', 'Basic mechanical knowledge', 'Height tolerance'],
    salary: {
      min: 52000,
      max: 78000,
      currency: 'USD'
    },
    tags: ['Wind Energy', 'Turbine Maintenance', 'Safety Training', 'Electrical Systems'],
    courses: [
      {
        id: 501,
        title: 'Wind Energy Fundamentals',
        provider: 'American Wind Energy Association',
        providerLogo: '/media/organization_logo/awea.png',
        duration: '3 weeks',
        level: 'Beginner',
        xp: 400,
        isRequired: true,
        order: 1,
        description: 'Wind energy principles, turbine components, and power generation systems.'
      },
      {
        id: 502,
        title: 'Wind Turbine Safety Training',
        provider: 'Global Wind Organisation',
        providerLogo: '/media/organization_logo/gwo.png',
        duration: '2 weeks',
        level: 'Beginner',
        xp: 350,
        isRequired: true,
        order: 2,
        description: 'Safety protocols, rescue procedures, and working at height certification.'
      },
      {
        id: 503,
        title: 'Mechanical Systems & Maintenance',
        provider: 'General Electric',
        providerLogo: '/media/organization_logo/ge.png',
        duration: '5 weeks',
        level: 'Intermediate',
        xp: 750,
        isRequired: true,
        order: 3,
        description: 'Gearbox, rotor, and mechanical component maintenance and repair.'
      },
      {
        id: 504,
        title: 'Electrical Systems & Controls',
        provider: 'Siemens Gamesa',
        providerLogo: '/media/organization_logo/siemens-gamesa.png',
        duration: '4 weeks',
        level: 'Advanced',
        xp: 700,
        isRequired: true,
        order: 4,
        description: 'Electrical systems, control systems, and power electronics for wind turbines.'
      },
      {
        id: 505,
        title: 'Hydraulic Systems & Components',
        provider: 'Vestas Wind Systems',
        providerLogo: '/media/organization_logo/vestas.png',
        duration: '3 weeks',
        level: 'Intermediate',
        xp: 550,
        isRequired: true,
        order: 5,
        description: 'Hydraulic pitch and yaw systems, pumps, and fluid power components.'
      },
      {
        id: 506,
        title: 'Turbine Diagnostics & Troubleshooting',
        provider: 'Nordex Group',
        providerLogo: '/media/organization_logo/nordex.png',
        duration: '4 weeks',
        level: 'Advanced',
        xp: 650,
        isRequired: true,
        order: 6,
        description: 'Condition monitoring, fault diagnosis, and advanced troubleshooting techniques.'
      }
    ]
  },
  {
    id: 6,
    title: 'SACA 101 - Industry 4.0 Basic Operations',
    provider: 'Smart Automation Certification Alliance',
    providerLogo: '/media/organization_logo/saca.png',
    description: 'Introduction to Industry 4.0 concepts, including smart manufacturing, IoT, and automation technologies.',
    industry: 'Advanced Manufacturing',
    level: 'Entry Level',
    estimatedDuration: '2-3 months',
    totalCourses: 4,
    enrolledStudents: 300,
    averageRating: 4.5,
    image: 'https://images.unsplash.com/photo-1581091870621-1c6b8f8a6b8e?w=600&h=300&fit=crop&crop=center',
    credentialType: 'Industry Certification',
    prerequisites: ['Basic understanding of manufacturing processes'],
    salary: {
      min: 40000,
      max: 60000,
      currency: 'USD'
    },
    tags: ['Industry 4.0', 'Smart Manufacturing', 'IoT', 'Automation'],
    courses: [
      {
        id: 601,
        title: 'Introduction to Industry 4.0',
        provider: 'Smart Automation Certification Alliance',
        providerLogo: '/media/organization_logo/saca.png',
        duration: '2 weeks',
        level: 'Beginner',
        xp: 300,
        isRequired: true,
        order: 1,
        description: 'Overview of Industry 4.0 technologies and their impact on manufacturing.'
      },
      {
        id: 602,
        title: 'IoT in Manufacturing',
        provider: 'Smart Automation Certification Alliance',
        providerLogo: '/media/organization_logo/saca.png',
        duration: '3 weeks',
        level: 'Intermediate',
        xp: 400,
        isRequired: true,
        order: 2,
        description: 'Application of IoT technologies in smart manufacturing environments.'
      },
      {
        id: 603,
        title: 'Automation Technologies',
        provider: 'Smart Automation Certification Alliance',
        providerLogo: '/media/organization_logo/saca.png',
        duration: '3 weeks',
        level: 'Intermediate',
        xp: 450,
        isRequired: true,
        order: 3,
        description: 'Exploration of automation systems and their role in Industry 4.0.'
      },
      {
        id: 604,
        title: 'Smart Manufacturing Systems',
        provider: 'Smart Automation Certification Alliance',
        providerLogo: '/media/organization_logo/saca.png',
        duration: '2 weeks',
        level: 'Intermediate',
        xp: 350,
        isRequired: false,
        order: 4,
        description: 'Integration of smart systems in manufacturing processes for efficiency and innovation.'
      }
    ]
  }
];

const industries = [
  'All Industries',
  'Data Centers & Digital Infrastructure',
  'Green Technology & Renewable Energy',
  'Advanced Manufacturing',
  'Broadband & Fiber Optics',
  'Aerospace & Aviation Technologies',
  'Energy & Power Systems',
  'Specialized Trades in Industrial MEP'
];

const levels = ['All Levels', 'Entry Level', 'Intermediate', 'Advanced', 'Expert'];
const credentialTypes = ['All Types', 'Certificate', 'Professional Certificate', 'Industry Certification', 'License'];

export default function CertificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedCredentialType, setSelectedCredentialType] = useState('All Types');
  const [expandedCertifications, setExpandedCertifications] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCertificationExpansion = (certificationId: number) => {
    setExpandedCertifications(prev => 
      prev.includes(certificationId)
        ? prev.filter(id => id !== certificationId)
        : [...prev, certificationId]
    );
  };

  // Filter certifications based on search and filters
  const filteredCertifications = mockCertifications.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = selectedIndustry === 'All Industries' || cert.industry === selectedIndustry;
    const matchesLevel = selectedLevel === 'All Levels' || cert.level === selectedLevel;
    const matchesCredentialType = selectedCredentialType === 'All Types' || cert.credentialType === selectedCredentialType;

    return matchesSearch && matchesIndustry && matchesLevel && matchesCredentialType;
  });

  return (
    <div className="min-h-screen bg-black dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="relative mb-12 overflow-hidden">
          {/* Background with gradient and glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-blue-900/20 to-emerald-900/30 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/30 rounded-2xl" />
          
          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/25">
                <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 via-blue-500/30 to-transparent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-emerald-100 to-blue-100 bg-clip-text text-transparent mb-6 leading-tight">
              Industry Certifications
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Earn <span className="text-emerald-400 font-semibold">industry-recognized credentials</span> that validate your expertise and 
              <span className="text-blue-400 font-semibold"> advance your career</span> in high-demand technical fields
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full blur-xl" />
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search certifications, providers, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-800/50 border-slate-700 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20 text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-gray-300">
              <span className="font-medium text-white">{filteredCertifications.length}</span> certifications found
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-600 text-gray-300 hover:border-emerald-500/50 hover:text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Industry Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500/20"
                    >
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500/20"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Credential Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Credential Type</label>
                    <select
                      value={selectedCredentialType}
                      onChange={(e) => setSelectedCredentialType(e.target.value)}
                      className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500/20"
                    >
                      {credentialTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Certifications Grid */}
        <div className="space-y-8">
          {filteredCertifications.length > 0 ? (
            filteredCertifications.map(certification => (
              <Card key={certification.id} className="border-2 border-slate-700 bg-slate-800/50 transition-all duration-300 hover:border-emerald-500/50">
                {/* Certification Header */}
                <div className="relative h-48 overflow-hidden">
                  <Image src={certification.image} alt={certification.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-600 text-white">{certification.credentialType}</Badge>
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">{certification.level}</Badge>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-12 h-8 bg-white rounded-md p-1 flex items-center justify-center">
                        <Image
                          src={certification.providerLogo}
                          alt={certification.provider}
                          width={40}
                          height={24}
                          className="object-contain max-h-6"
                        />
                      </div>
                      <p className="text-gray-200 text-sm">{certification.provider}</p>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{certification.title}</h3>
                    <p className="text-gray-200 text-sm line-clamp-2">{certification.description}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-6 text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span><span className="font-medium text-white">{certification.totalCourses}</span> courses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium text-white">{certification.estimatedDuration}</span>
                      </div>
                    </div>
                    {certification.salary && (
                      <div className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="text-xs text-gray-300 mr-1">Estimated Salary:</span>
                        ${certification.salary.min.toLocaleString()} - ${certification.salary.max.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Industry & Tags */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <Badge variant="outline" className="border-blue-400/50 text-blue-400 bg-blue-400/5">
                        {certification.industry}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {certification.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-500 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                      {certification.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                          +{certification.tags.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {certification.prerequisites && certification.prerequisites.length > 0 && (
                    <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">Prerequisites:</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {certification.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mb-4">
                    <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white">
                      <Award className="h-4 w-4 mr-2" />
                      Start Certification
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toggleCertificationExpansion(certification.id)}
                      className="border-slate-600 text-gray-300 hover:border-emerald-500/50 hover:text-white"
                    >
                      {expandedCertifications.includes(certification.id) ? (
                        <>Hide Courses <ChevronUp className="h-4 w-4 ml-2" /></>
                      ) : (
                        <>View Courses <ChevronDown className="h-4 w-4 ml-2" /></>
                      )}
                    </Button>
                  </div>

                  {/* Expandable Course List */}
                  {expandedCertifications.includes(certification.id) && (
                    <div className="border-t border-slate-700 pt-4 mt-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Certification Courses</h4>
                      <div className="space-y-4">
                        {certification.courses
                          .sort((a, b) => a.order - b.order)
                          .map((course) => (
                          <Card key={course.id} className="border border-slate-600 bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                {/* Course Order & Required Badge */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                                    {course.order}
                                  </div>
                                  {course.isRequired && (
                                    <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>

                                {/* Provider Logo */}
                                <div className="flex-shrink-0">
                                  <div className="relative w-16 h-12 bg-white rounded-lg p-2 flex items-center justify-center">
                                    <Image
                                      src={course.providerLogo}
                                      alt={course.provider}
                                      width={48}
                                      height={32}
                                      className="object-contain max-h-8"
                                    />
                                  </div>
                                </div>

                                {/* Course Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className="text-white font-semibold text-sm leading-tight">{course.title}</h5>
                                        <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                                      </div>
                                      <p className="text-gray-400 text-xs mb-2">{course.provider}</p>
                                      <p className="text-gray-300 text-xs mb-2 leading-relaxed">{course.description}</p>
                                      
                                      {/* Course Stats */}
                                      <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Zap className="h-3 w-3 text-yellow-400" />
                                          <span className="text-yellow-400 font-medium">{course.xp} XP</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex-shrink-0">
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-slate-500 text-gray-300 hover:bg-slate-600/50 text-xs px-3 py-1"
                                      >
                                        <Play className="h-3 w-3 mr-1" />
                                        Start Course
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Certifications Found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters to find relevant certifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 