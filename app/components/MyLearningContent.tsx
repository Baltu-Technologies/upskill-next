'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Star, Zap, Clock, ChevronRight, Play, Eye, ChevronDown, ChevronUp, Trophy, Building, MapPin, Users, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Define the Course interface based on app/courses/page.tsx structure
interface Course {
  id: number;
  title: string;
  instructor?: string; // Optional as it might not always be displayed or available
  company: string;
  companyLogo: string;
  duration: string;
  timeToComplete: string;
  image: string;
  level: string;
  progress: number; // User's progress in this course
  xp: number;
  badges?: string[]; // Badges earnable from this course
  industryTags?: string[];
  technologyTags?: string[];
  description: string;
  sourceType?: 'industry' | 'university'; // Optional for Baltu courses
}

// Mock data - replace with actual data fetching later
const mockFavoriteCourses: Course[] = [
  {
    id: 1,
    title: 'CNC Machining & Advanced Manufacturing',
    company: 'Central Arizona College',
    companyLogo: '/media/organization_logo/central_arizona_college.jpeg',
    duration: '10 weeks',
    timeToComplete: '50 hours',
    image: 'https://images.unsplash.com/photo-1563200424-2F6196024328?w=600&h=300&fit=crop&crop=center',
    level: 'Intermediate',
    progress: 25, // Sample progress
    xp: 950,
    technologyTags: ['CNC Programming', 'CAD/CAM', 'G-Code', 'Quality Control'],
    description: 'Master CNC machining operations, programming, and advanced manufacturing techniques used in aerospace and automotive industries.',
    sourceType: 'university'
  },
  {
    id: 6,
    title: 'Industrial Robotics Programming',
    company: 'Honeywell Aerospace',
    companyLogo: '/media/organization_logo/honeywell-aerospace.jpg',
    duration: '12 weeks',
    timeToComplete: '55 hours',
    image: 'https://images.unsplash.com/photo-1560410075-b2a15039394a?w=600&h=300&fit=crop&crop=center',
    level: 'Advanced',
    progress: 70, // Sample progress
    xp: 1100,
    technologyTags: ['PLC Programming', 'Robot Operating System', 'Machine Vision', 'AI Integration'],
    description: 'Master industrial robot programming, automation systems, and AI-driven manufacturing processes for modern production environments.',
    sourceType: 'industry'
  }
];

// Define Career Pathway interface
interface CareerPathway {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalCourses: number;
  completedCourses: number;
  image: string;
  estimatedTime: string;
  courses: PathwayCourse[];
}

// Define PathwayCourse interface for courses within pathways
interface PathwayCourse {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  duration: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'not-started';
  level: string;
  xpEarned: number;
  maxXp: number;
  badge?: string; // Optional badge for achievements
}

const mockCareerPathways: CareerPathway[] = [
  {
    id: 1,
    title: 'Solar Installation Technician',
    description: 'Master solar panel installation, electrical systems, and renewable energy technologies',
    progress: 60,
    totalCourses: 5,
    completedCourses: 3,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=300&fit=crop&crop=center',
    estimatedTime: '6 months',
    courses: [
      {
        id: 101,
        title: 'Solar Energy Fundamentals',
        company: 'SunPower Corporation',
        companyLogo: '/media/organization_logo/sunpower.png',
        duration: '4 weeks',
        progress: 100,
        status: 'completed',
        level: 'Beginner',
        xpEarned: 450,
        maxXp: 450,
        badge: 'Solar Foundation Expert'
      },
      {
        id: 102,
        title: 'Electrical Systems for Solar',
        company: 'Tesla Energy',
        companyLogo: '/media/organization_logo/tesla.png',
        duration: '6 weeks',
        progress: 100,
        status: 'completed',
        level: 'Intermediate',
        xpEarned: 750,
        maxXp: 750,
        badge: 'Electrical Systems Specialist'
      },
      {
        id: 103,
        title: 'Solar Panel Installation & Mounting',
        company: 'First Solar',
        companyLogo: '/media/organization_logo/first-solar.png',
        duration: '8 weeks',
        progress: 75,
        status: 'in-progress',
        level: 'Intermediate',
        xpEarned: 675,
        maxXp: 900
      },
      {
        id: 104,
        title: 'Energy Storage Systems',
        company: 'Enphase Energy',
        companyLogo: '/media/organization_logo/enphase.png',
        duration: '6 weeks',
        progress: 0,
        status: 'not-started',
        level: 'Intermediate',
        xpEarned: 0,
        maxXp: 800
      },
      {
        id: 105,
        title: 'Solar System Commissioning & Maintenance',
        company: 'Canadian Solar',
        companyLogo: '/media/organization_logo/canadian-solar.png',
        duration: '4 weeks',
        progress: 0,
        status: 'not-started',
        level: 'Advanced',
        xpEarned: 0,
        maxXp: 1000,
        badge: 'Solar Systems Expert'
      }
    ]
  },
  {
    id: 2,
    title: 'Data Center Technician',
    description: 'Learn server hardware, networking, and data center operations',
    progress: 30,
    totalCourses: 4,
    completedCourses: 1,
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=300&fit=crop&crop=center',
    estimatedTime: '4 months',
    courses: [
      {
        id: 201,
        title: 'Server Hardware Fundamentals',
        company: 'Dell Technologies',
        companyLogo: '/media/organization_logo/dell.png',
        duration: '3 weeks',
        progress: 100,
        status: 'completed',
        level: 'Beginner',
        xpEarned: 400,
        maxXp: 400,
        badge: 'Hardware Specialist'
      },
      {
        id: 202,
        title: 'Network Infrastructure',
        company: 'Cisco Systems',
        companyLogo: '/media/organization_logo/cisco.png',
        duration: '5 weeks',
        progress: 40,
        status: 'in-progress',
        level: 'Intermediate',
        xpEarned: 320,
        maxXp: 800
      },
      {
        id: 203,
        title: 'Data Center Operations',
        company: 'Microsoft Azure',
        companyLogo: '/media/organization_logo/microsoft.png',
        duration: '4 weeks',
        progress: 0,
        status: 'not-started',
        level: 'Intermediate',
        xpEarned: 0,
        maxXp: 700
      },
      {
        id: 204,
        title: 'Cloud Infrastructure Management',
        company: 'Google Cloud',
        companyLogo: '/media/organization_logo/google-cloud.png',
        duration: '6 weeks',
        progress: 0,
        status: 'not-started',
        level: 'Advanced',
        xpEarned: 0,
        maxXp: 1200,
        badge: 'Cloud Infrastructure Pro'
      }
    ]
  }
];

// Define Employer interface
interface Employer {
  id: number;
  name: string;
  logo: string;
  locations: string[];
  industry: string;
  size: string;
  description: string;
  salaryRange: string;
  benefits: string[];
  technologies: string[];
  industries: string[];
  image: string;
  isHiring: boolean;
  featured: boolean;
}

// Job opportunities data - featured employers from the All Employers page
const jobOpportunityEmployers: Employer[] = [
  {
    id: 1,
    name: 'Taiwan Semiconductor Manufacturing (TSMC)',
    logo: '/media/organization_logo/Tsmc.svg.png',
    locations: ['Phoenix, AZ', 'Chandler, AZ'],
    industry: 'Semiconductor & Microelectronics',
    size: '5,000+ employees',
    description: 'Leading semiconductor foundry manufacturing advanced chips for global technology companies. Specializing in cutting-edge process technologies.',
    salaryRange: '$65K - $120K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Stock Options', 'Training Programs'],
    technologies: ['Photolithography', 'EUV Systems', 'Process Control', 'Cleanroom Tech'],
    industries: ['Semiconductor', 'Microelectronics'],
    image: 'https://images.unsplash.com/photo-1620714774021-999933e45904?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: true
  },
  {
    id: 2,
    name: 'Honeywell Aerospace',
    logo: '/media/organization_logo/honeywell-aerospace.jpg',
    locations: ['Tempe, AZ'],
    industry: 'Aerospace & Aviation Technologies',
    size: '1,000+ employees',
    description: 'Developing advanced aerospace technologies including avionics, engines, and flight control systems for commercial and defense applications.',
    salaryRange: '$70K - $135K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Tuition Reimbursement', 'Flexible Schedule'],
    technologies: ['Avionics Systems', 'Flight Controls', 'Turbine Engines', 'Navigation Systems'],
    industries: ['Aerospace', 'Aviation Technologies'],
    image: 'https://images.unsplash.com/photo-1569629985277-9cb0eb11c2e0?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: true
  },
  {
    id: 3,
    name: 'Amkor Technology',
    logo: '/media/organization_logo/amkor_technology.png',
    locations: ['Tempe, AZ', 'Chandler, AZ'],
    industry: 'Semiconductor & Microelectronics',
    size: '2,500+ employees',
    description: 'Global leader in semiconductor assembly and test services, providing chip packaging solutions for the electronics industry.',
    salaryRange: '$55K - $95K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Performance Bonuses', 'Career Development'],
    technologies: ['IC Packaging', 'Wire Bonding', 'Test Systems', 'Assembly Automation'],
    industries: ['Semiconductor', 'Electronics Assembly'],
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: true
  },
  {
    id: 4,
    name: 'Phoenix Data Center Solutions',
    logo: '/media/baltu_technologies_logo_flower_only.png',
    locations: ['Phoenix, AZ', 'Scottsdale, AZ'],
    industry: 'Data Centers & Cloud Infrastructure',
    size: '800+ employees',
    description: 'Operating state-of-the-art data centers providing cloud infrastructure and colocation services for enterprise clients.',
    salaryRange: '$60K - $110K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Remote Work Options', 'Training Programs'],
    technologies: ['Server Hardware', 'Network Infrastructure', 'HVAC Systems', 'Security Systems'],
    industries: ['Data Centers', 'Cloud Infrastructure'],
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: false
  },
  {
    id: 5,
    name: 'TEKsystems Infrastructure',
    logo: '/media/organization_logo/tek-systems.webp',
    locations: ['Scottsdale, AZ', 'Phoenix, AZ', 'Mesa, AZ'],
    industry: 'Broadband & Fiber Optics',
    size: '1,200+ employees',
    description: 'Leading provider of fiber optic network installation and telecommunications infrastructure services across the Southwest.',
    salaryRange: '$50K - $85K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Vehicle Allowance', 'Safety Bonuses'],
    technologies: ['Fiber Optics', 'Network Testing', 'Cable Installation', '5G Infrastructure'],
    industries: ['Broadband', 'Fiber Optics'],
    image: 'https://images.unsplash.com/photo-1580570595240-5eE06969528f?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: false
  },
  {
    id: 6,
    name: 'SolarMax Energy Systems',
    logo: '/media/baltu_technologies_logo_flower_only.png',
    locations: ['Mesa, AZ', 'Glendale, AZ'],
    industry: 'Green Technology & Renewable Energy',
    size: '600+ employees',
    description: 'Installing and maintaining large-scale solar energy systems and battery storage solutions for commercial and utility clients.',
    salaryRange: '$55K - $90K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Green Energy Bonus', 'Training Certifications'],
    technologies: ['Solar Panels', 'Battery Storage', 'Grid Integration', 'Power Electronics'],
    industries: ['Green Technology', 'Renewable Energy'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: false
  }
];

export default function MyLearningContent() {
  const [favoriteCourses, setFavoriteCourses] = useState<Course[]>(mockFavoriteCourses);
  const [expandedPathways, setExpandedPathways] = useState<number[]>([]);
  const [favoriteEmployers, setFavoriteEmployers] = useState<number[]>([]);

  const toggleFavorite = (courseId: number) => {
    setFavoriteCourses(prev => 
      prev.find(c => c.id === courseId) 
        ? prev.filter(c => c.id !== courseId)
        : [...prev, mockFavoriteCourses.find(c => c.id === courseId)!] // Added non-null assertion as we expect it to be found
    );
  };

  const togglePathwayExpansion = (pathwayId: number) => {
    setExpandedPathways(prev => 
      prev.includes(pathwayId)
        ? prev.filter(id => id !== pathwayId)
        : [...prev, pathwayId]
    );
  };

  const toggleEmployerFavorite = (employerId: number) => {
    setFavoriteEmployers(prev => 
      prev.includes(employerId)
        ? prev.filter(id => id !== employerId)
        : [...prev, employerId]
    );
  };

  return (
    <div className="min-h-screen bg-black dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="relative mb-12 overflow-hidden">
          {/* Background with gradient and glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/30 rounded-2xl" />
          
          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-purple-500/25">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop&crop=center"
                  alt="Learning"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/80 to-blue-600/80" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 via-blue-500/30 to-transparent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent mb-6 leading-tight">
              My Courses
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Track your progress and continue your learning journey with your 
              <span className="text-purple-400 font-semibold"> Career Pathways</span> and
              <span className="text-blue-400 font-semibold"> Favorite Courses</span>
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
        </div>

        {/* Career Pathways Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            My Career Pathways
          </h2>
          {mockCareerPathways.length > 0 ? (
            <div className="space-y-8">
              {mockCareerPathways.map(pathway => (
                <Card key={pathway.id} className="border-2 border-slate-700 bg-slate-800/50 transition-all duration-300">
                  {/* Pathway Header */}
                  <div className="relative h-48 overflow-hidden">
                    <Image src={pathway.image} alt={pathway.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-purple-600 text-white">Pathway</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2">{pathway.title}</h3>
                      <p className="text-gray-200 text-sm">{pathway.description}</p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Pathway Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-6">
                        <div className="text-sm text-gray-400">
                          <span className="font-medium text-white">{pathway.completedCourses}</span>/{pathway.totalCourses} courses completed
                        </div>
                        <div className="text-sm text-gray-400">
                          <span className="font-medium text-white">{pathway.estimatedTime}</span> estimated
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-purple-400">{pathway.progress}%</span> complete
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={pathway.progress} className="h-3 bg-slate-700 [&>div]:bg-purple-500 mb-4" />

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                      <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
                        Continue Pathway <Play className="h-4 w-4 ml-2" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => togglePathwayExpansion(pathway.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        {expandedPathways.includes(pathway.id) ? (
                          <>Hide Courses <ChevronUp className="h-4 w-4 ml-2" /></>
                        ) : (
                          <>View Courses <ChevronDown className="h-4 w-4 ml-2" /></>
                        )}
                      </Button>
                    </div>

                    {/* Expandable Course List */}
                    {expandedPathways.includes(pathway.id) && (
                      <div className="border-t border-slate-700 pt-4 mt-4">
                        <div className="space-y-4">
                          {pathway.courses.map((course) => (
                            <Card key={course.id} className="border border-slate-600 bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  {/* Company Logo */}
                                  <div className="flex-shrink-0">
                                    <div className="relative w-16 h-12 bg-white rounded-lg p-2 flex items-center justify-center">
                                      <Image
                                        src={course.companyLogo}
                                        alt={course.company}
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
                                          <h4 className="text-white font-semibold text-sm leading-tight">{course.title}</h4>
                                          <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                                          {/* Status Badge */}
                                          {course.status === 'completed' ? (
                                            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                                              Completed
                                            </Badge>
                                          ) : course.status === 'in-progress' ? (
                                            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                                              In Progress
                                            </Badge>
                                          ) : (
                                            <Badge variant="secondary" className="bg-gray-600/20 text-gray-400 border-gray-600/30 text-xs">
                                              Not Started
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-gray-400 text-xs mb-2">{course.company}</p>
                                        
                                        {/* Course Stats */}
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{course.duration}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Zap className="h-3 w-3 text-yellow-400" />
                                            <span className="text-yellow-400 font-medium">{course.xpEarned}/{course.maxXp} XP</span>
                                          </div>
                                          {course.badge && (
                                            <div className="flex items-center gap-1">
                                              <Trophy className="h-3 w-3 text-amber-400" />
                                              <span className="text-amber-400 font-medium text-xs">{course.badge}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Action Button */}
                                      <div className="flex-shrink-0">
                                        {course.status === 'completed' ? (
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="border-green-500/50 text-green-400 hover:bg-green-500/10 text-xs px-3 py-1"
                                          >
                                            <Eye className="h-3 w-3 mr-1" />
                                            Review
                                          </Button>
                                        ) : course.status === 'in-progress' ? (
                                          <Button 
                                            size="sm" 
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                                          >
                                            <Play className="h-3 w-3 mr-1" />
                                            Continue
                                          </Button>
                                        ) : (
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="border-slate-500 text-gray-300 hover:bg-slate-600/50 text-xs px-3 py-1"
                                          >
                                            <Play className="h-3 w-3 mr-1" />
                                            Start
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {course.progress > 0 && (
                                      <div className="mt-3">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-gray-400">Progress</span>
                                          <span className="text-xs font-medium text-blue-400">{course.progress}%</span>
                                        </div>
                                        <Progress 
                                          value={course.progress} 
                                          className="h-2 bg-slate-600 [&>div]:bg-blue-500" 
                                        />
                                      </div>
                                    )}
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
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You haven't selected any career pathways yet. Explore pathways to get started!</p>
          )}
        </section>

        {/* Favorited Individual Courses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            My Favorite Courses
          </h2>
          {favoriteCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteCourses.map((course) => (
                <Card key={course.id} className="group cursor-pointer overflow-hidden border-2 border-slate-700 bg-slate-800/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
                  {/* Course Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-&lsqb;4000ms&rsqb; ease-out group-hover:scale-125 group-hover:translate-x-3 group-hover:-translate-y-2">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Level Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900 font-medium">
                        {course.level}
                      </Badge>
                    </div>

                    {/* Heart/Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(course.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group/heart"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-all duration-200 ${favoriteCourses.some(favCourse => favCourse.id === course.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-white group-hover/heart:text-red-400'}`}
                      />
                    </button>
                  </div>

                  {/* Company Logo - Overlapping image and content */}
                  <div className="relative -mt-8 ml-6 z-10">
                    <div className="flex items-end gap-4">
                      <div className="relative w-32 h-16 bg-white rounded-xl p-3 flex items-center justify-center shadow-xl border-2 border-slate-700">
                        <Image
                          src={course.companyLogo}
                          alt={course.company}
                          width={96}
                          height={40}
                          className="object-contain max-h-10"
                        />
                      </div>
                      <div className="pb-3 flex flex-col justify-end gap-1">
                        {/* Source Type Tag - More Subtle (only for industry/university courses) */}
                        {course.sourceType && (
                          <div className={`self-start px-2 py-0.5 rounded text-xs font-medium tracking-wide border ${course.sourceType === 'industry' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-purple-500/10 text-purple-300 border-purple-500/20'}`}>
                            {course.sourceType === 'industry' ? 'Industry' : 'University'}
                          </div>
                        )}
                        
                        {/* Company Name */}
                        <p className="text-white text-sm font-medium">
                          {course.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1 pt-4">
                    <div className="space-y-4 flex-1">
                      {/* Course Title */}
                      <h3 className="text-white font-bold text-xl leading-tight">
                        {course.title}
                      </h3>

                      {/* Course Description */}
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      {/* Key Stats Row */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.timeToComplete}
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <Zap className="h-4 w-4 mr-1" />
                          {course.xp} XP
                        </div>
                      </div>

                      {/* Progress Bar (if enrolled) */}
                      {course.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Progress</span>
                            <span className="text-blue-400 font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      {/* Key Skills - Only show top 2 most important */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Key Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {course.technologyTags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-400/50 text-blue-400 bg-blue-400/5">
                              {tag}
                            </Badge>
                          ))}
                          {course.technologyTags && course.technologyTags.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                              +{course.technologyTags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Always at bottom */}
                    <div className="flex gap-3 pt-4 mt-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-2 border-slate-600 text-gray-300 hover:border-blue-500/50 hover:text-white hover:bg-slate-800/50 transition-all duration-300 rounded-xl"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-xl border-0"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {course.progress > 0 ? 'Continue' : 'Start Course'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Favorite Courses Yet</h3>
              <p className="text-gray-500">Start exploring courses and add them to your favorites to see them here!</p>
              <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Explore Courses
              </Button>
            </div>
          )}
        </section>

        {/* Job Opportunities Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Job Opportunities
              </h2>
              <p className="text-gray-400 text-lg">
                Discover career opportunities with our industry partners
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Employers
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobOpportunityEmployers.map((employer) => (
              <Card key={employer.id} className="group cursor-pointer overflow-hidden border-2 border-slate-700 bg-slate-800/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
                {/* Employer Banner */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-125 group-hover:translate-x-3 group-hover:-translate-y-2">
                    <Image
                      src={employer.image}
                      alt={employer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Featured Badge */}
                  {employer.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white font-medium">
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Hiring Status */}
                  {employer.isHiring && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white font-medium">
                        Hiring Now
                      </Badge>
                    </div>
                  )}

                  {/* Heart/Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEmployerFavorite(employer.id);
                    }}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group/heart"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-all duration-200 ${
                        favoriteEmployers.includes(employer.id)
                          ? 'fill-red-500 text-red-500 scale-110'
                          : 'text-white group-hover/heart:text-red-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Company Logo - Overlapping image and content */}
                <div className="relative -mt-8 ml-6 z-10">
                  <div className="flex items-end gap-4">
                    <div className="relative w-32 h-16 bg-white rounded-xl p-3 flex items-center justify-center shadow-xl border-2 border-slate-700">
                      <Image
                        src={employer.logo}
                        alt={employer.name}
                        width={96}
                        height={40}
                        className="object-contain max-h-10"
                      />
                    </div>
                    <div className="pb-3 flex flex-col justify-end gap-1">
                      {/* Location */}
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <MapPin className="h-3 w-3" />
                        {employer.locations.length === 1 
                          ? employer.locations[0]
                          : `${employer.locations[0]} +${employer.locations.length - 1} more`
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-1 pt-4">
                  <div className="space-y-4 flex-1">
                    {/* Company Name */}
                    <h3 className="text-white font-bold text-xl leading-tight">
                      {employer.name}
                    </h3>

                    {/* Company Description */}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                      {employer.description}
                    </p>

                    {/* Key Stats Row */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-1" />
                        {employer.size}
                      </div>
                      <div className="text-green-400 font-semibold">
                        {employer.salaryRange}
                      </div>
                    </div>

                    {/* Technologies and Industries */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Technologies</p>
                        <div className="flex flex-wrap gap-2">
                          {employer.technologies.slice(0, 2).map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-400/50 text-blue-400 bg-blue-400/5">
                              {tech}
                            </Badge>
                          ))}
                          {employer.technologies.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                              +{employer.technologies.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Industries</p>
                        <div className="flex flex-wrap gap-2">
                          {employer.industries.map((industry, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-orange-400/50 text-orange-400 bg-orange-400/5">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button - Always at bottom */}
                  <div className="pt-4 mt-auto">
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-xl border-0"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      View Opportunities
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 