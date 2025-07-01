'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock,
  Play,
  ChevronRight,
  Award,
  Zap,
  Eye,
  Code,
  Database,
  Shield,
  Cloud,
  Cpu,
  Smartphone,
  Heart,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Course interface with enrollment status
interface Course {
  id: number;
  title: string;
  instructor?: string;
  company: string;
  companyLogo: string;
  duration: string;
  timeToComplete: string;
  image: string;
  level: string;
  progress: number;
  xp: number;
  badges?: string[];
  industryTags?: string[];
  technologyTags?: string[];
  description: string;
  sourceType?: 'industry' | 'university';
  // New fields for enrollment tracking
  enrollmentStatus: 'not-added' | 'enrolled' | 'in-progress' | 'completed';
  isEnrolled: boolean;
}

const courseCategories = [
  {
    title: 'Semiconductor & Microelectronics',
    count: 12,
    description: 'Master chip fabrication, cleanroom operations, and semiconductor manufacturing processes.',
    image: 'https://images.unsplash.com/photo-1620714774021-999933e45904?w=400&h=200&fit=crop&crop=center',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    title: 'Advanced Manufacturing',
    count: 18,
    description: 'Learn CNC machining, robotics programming, and Industry 4.0 automation technologies.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop&crop=center',
    gradient: 'from-emerald-500 to-blue-600'
  },
  {
    title: 'Data Centers & Cloud Infrastructure',
    count: 8,
    description: 'Develop expertise in server management, network infrastructure, and cloud operations.',
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=400&h=200&fit=crop&crop=center',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    title: 'Broadband & Fiber Optics',
    count: 6,
    description: 'Install, maintain, and troubleshoot fiber optic networks and broadband infrastructure.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&crop=center',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    title: 'Green Technology & Renewable Energy',
    count: 14,
    description: 'Build skills in solar installation, wind energy systems, and sustainable technology.',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop&crop=center',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Aerospace & Defense',
    count: 10,
    description: 'Learn aerospace manufacturing, avionics systems, and defense technology applications.',
    image: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?w=400&h=200&fit=crop&crop=center',
    gradient: 'from-indigo-500 to-purple-600'
  }
];

// Featured courses with enrollment status
const featuredCourses: Course[] = [
  {
    id: 1,
    title: "Advanced CNC Programming & CAD/CAM Integration",
    instructor: "Maria Rodriguez",
    company: "Honeywell Aerospace",
    companyLogo: "/media/company-logos/honeywell-logo.png",
    duration: "8 weeks",
    timeToComplete: "3-4 hours/week",
    image: "/media/courses/cnc-programming.jpg",
    level: "Advanced",
    progress: 0,
    xp: 850,
    badges: ["Certification", "Industry Partner"],
    industryTags: ["Advanced Manufacturing", "Aerospace"],
    technologyTags: ["CNC Programming", "CAD/CAM", "Quality Control"],
    description: "Master advanced CNC programming techniques and CAD/CAM integration for precision manufacturing in aerospace applications.",
    sourceType: "industry",
    enrollmentStatus: "not-added",
    isEnrolled: false
  },
  {
    id: 2,
    title: "Semiconductor Cleanroom Operations & Safety",
    instructor: "Dr. James Chen",
    company: "TSMC",
    companyLogo: "/media/company-logos/tsmc-logo.png",
    duration: "6 weeks",
    timeToComplete: "2-3 hours/week",
    image: "/media/courses/semiconductor-cleanroom.jpg",
    level: "Intermediate",
    progress: 35,
    xp: 720,
    badges: ["Certification", "Safety"],
    industryTags: ["Semiconductor", "Manufacturing"],
    technologyTags: ["Cleanroom Operations", "Safety Protocols", "Quality Control"],
    description: "Learn essential cleanroom procedures, contamination control, and safety protocols for semiconductor manufacturing.",
    sourceType: "industry",
    enrollmentStatus: "in-progress",
    isEnrolled: true
  },
  {
    id: 3,
    title: "Data Center Infrastructure & Server Management",
    instructor: "Sarah Johnson",
    company: "Arizona Data Center Alliance",
    companyLogo: "/media/company-logos/arizona-data-center-logo.png",
    duration: "10 weeks",
    timeToComplete: "4-5 hours/week",
    image: "/media/courses/data-center-infrastructure.jpg",
    level: "Intermediate",
    progress: 0,
    xp: 950,
    badges: ["Certification", "High Demand"],
    industryTags: ["Data Centers", "IT Infrastructure"],
    technologyTags: ["Server Hardware", "Networking", "HVAC Systems"],
    description: "Comprehensive training on data center operations, server hardware management, and infrastructure optimization.",
    sourceType: "industry",
    enrollmentStatus: "enrolled",
    isEnrolled: true
  },
  {
    id: 4,
    title: "Fiber Optic Installation & Maintenance",
    instructor: "Mike Thompson",
    company: "TEKsystems",
    companyLogo: "/media/company-logos/teksystems-logo.png",
    duration: "7 weeks",
    timeToComplete: "3-4 hours/week",
    image: "/media/courses/fiber-optic-installation.jpg",
    level: "Beginner",
    progress: 100,
    xp: 680,
    badges: ["Certification", "Rural Focus"],
    industryTags: ["Broadband & Fiber Optics", "Telecommunications"],
    technologyTags: ["Fiber Optics", "Network Installation", "Testing Equipment"],
    description: "Learn fiber optic cable installation, splicing techniques, and maintenance procedures for broadband networks.",
    sourceType: "industry",
    enrollmentStatus: "completed",
    isEnrolled: true
  },
  {
    id: 5,
    title: "Industrial Robotics Programming",
    instructor: "Dr. Elena Vasquez",
    company: "Arizona State University",
    companyLogo: "/media/company-logos/asu-logo.png",
    duration: "12 weeks",
    timeToComplete: "5-6 hours/week",
    image: "/media/courses/industrial-robotics.jpg",
    level: "Advanced",
    progress: 0,
    xp: 1200,
    badges: ["University", "Research-Based"],
    industryTags: ["Advanced Manufacturing", "Robotics"],
    technologyTags: ["PLC Programming", "Robotics", "Automation"],
    description: "Advanced robotics programming and automation systems for industrial manufacturing environments.",
    sourceType: "university",
    enrollmentStatus: "not-added",
    isEnrolled: false
  },
  {
    id: 6,
    title: "Green Energy Systems & Solar Installation",
    instructor: "Tom Bradley",
    company: "Amkor Technology",
    companyLogo: "/media/company-logos/amkor-logo.png",
    duration: "9 weeks",
    timeToComplete: "3-4 hours/week",
    image: "/media/courses/green-energy-solar.jpg",
    level: "Intermediate",
    progress: 0,
    xp: 820,
    badges: ["Certification", "Sustainability"],
    industryTags: ["Green Technology", "Renewable Energy"],
    technologyTags: ["Solar Installation", "Energy Storage", "Grid Integration"],
    description: "Comprehensive training on solar panel installation, energy storage systems, and grid integration.",
    sourceType: "industry",
    enrollmentStatus: "not-added",
    isEnrolled: false
  }
];

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [favoriteCourses, setFavoriteCourses] = useState<number[]>([]);
  const [courses, setCourses] = useState<Course[]>(featuredCourses);

  const toggleFavorite = (courseId: number) => {
    setFavoriteCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleAddCourse = (courseId: number) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, enrollmentStatus: 'enrolled', isEnrolled: true }
        : course
    ));
  };

  const handleStartCourse = (courseId: number) => {
    // Navigate to course content/lessons page
    router.push(`/courses/${courseId}/lessons`);
    
    // Update status to in-progress if it's enrolled
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, enrollmentStatus: 'in-progress' }
        : course
    ));
  };

  const handleContinueCourse = (courseId: number) => {
    // Navigate to course content/lessons page
    router.push(`/courses/${courseId}/lessons`);
  };

  const handleLearnMore = (courseId: number) => {
    // Navigate to course overview page
    router.push(`/courses/${courseId}/overview`);
  };

  const getCourseButtonConfig = (course: Course) => {
    switch (course.enrollmentStatus) {
      case 'not-added':
        return {
          primary: { text: 'Add Course', icon: Plus, action: () => handleAddCourse(course.id), variant: 'default' as const },
          secondary: { text: 'Learn More', icon: Eye, action: () => handleLearnMore(course.id) }
        };
      case 'enrolled':
        return {
          primary: { text: 'Start Course', icon: Play, action: () => handleStartCourse(course.id), variant: 'default' as const },
          secondary: { text: 'Learn More', icon: Eye, action: () => handleLearnMore(course.id) }
        };
      case 'in-progress':
        return {
          primary: { text: 'Continue', icon: BookOpen, action: () => handleContinueCourse(course.id), variant: 'default' as const },
          secondary: { text: 'Learn More', icon: Eye, action: () => handleLearnMore(course.id) }
        };
      case 'completed':
        return {
          primary: { text: 'Review', icon: BookOpen, action: () => handleContinueCourse(course.id), variant: 'outline' as const },
          secondary: { text: 'Learn More', icon: Eye, action: () => handleLearnMore(course.id) }
        };
      default:
        return {
          primary: { text: 'Add Course', icon: Plus, action: () => handleAddCourse(course.id), variant: 'default' as const },
          secondary: { text: 'Learn More', icon: Eye, action: () => handleLearnMore(course.id) }
        };
    }
  };

  // Filter courses based on search and level
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 md:p-16 mb-12 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              All <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Courses</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Advance your career with courses designed by 
              <span className="text-blue-400 font-semibold"> Industry</span> and
              <span className="text-green-400 font-semibold"> Technology</span> experts
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
        </div>

        {/* Filter Controls */}
        <div className="mb-12 flex flex-wrap gap-4 justify-center">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-600 focus:border-blue-500/50 text-white placeholder:text-gray-400 rounded-lg"
            />
          </div>
          
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const buttonConfig = getCourseButtonConfig(course);
            return (
              <Card key={course.id} className="group cursor-pointer overflow-hidden border-2 border-slate-700 bg-slate-800/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
                {/* Course Banner */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Level Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900 font-medium">
                      {course.level}
                    </Badge>
                  </div>

                  {/* Enrollment Status Badge */}
                  {course.enrollmentStatus !== 'not-added' && (
                    <div className="absolute top-3 right-12">
                      <Badge 
                        className={`${
                          course.enrollmentStatus === 'completed' ? 'bg-green-600/90 text-white' :
                          course.enrollmentStatus === 'in-progress' ? 'bg-blue-600/90 text-white' :
                          'bg-yellow-600/90 text-white'
                        } font-medium`}
                      >
                        {course.enrollmentStatus === 'in-progress' ? 'In Progress' :
                         course.enrollmentStatus === 'completed' ? 'Completed' :
                         'Enrolled'}
                      </Badge>
                    </div>
                  )}

                  {/* Heart/Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(course.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group/heart"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-all duration-200 ${
                        favoriteCourses.includes(course.id)
                          ? 'fill-red-500 text-red-500 scale-110'
                          : 'text-white group-hover/heart:text-red-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Company Logo - Overlapping */}
                <div className="relative -mt-8 ml-6 z-10">
                  <div className="w-20 h-12 bg-white rounded-lg p-2 flex items-center justify-center shadow-xl border-2 border-slate-700">
                    <Image
                      src={course.companyLogo}
                      alt={course.company}
                      width={64}
                      height={32}
                      className="object-contain max-h-8"
                    />
                  </div>
                </div>

                {/* Course Content */}
                <CardContent className="p-6 pt-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
                      {course.title}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-300 mb-4 line-clamp-3">
                      {course.description}
                    </CardDescription>

                    {/* Course Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration} • {course.timeToComplete}</span>
                      </div>

                      {/* Progress bar for enrolled courses */}
                      {course.isEnrolled && course.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Progress</span>
                            <span className="text-blue-400 font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      {/* XP Badge */}
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-300">{course.xp} XP</span>
                      </div>

                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-1">
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        buttonConfig.primary.action();
                      }}
                      variant={buttonConfig.primary.variant}
                      className="flex-1 flex items-center gap-2"
                    >
                      <buttonConfig.primary.icon className="h-4 w-4" />
                      {buttonConfig.primary.text}
                    </Button>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        buttonConfig.secondary.action();
                      }}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-gray-300 hover:text-white"
                    >
                      <buttonConfig.secondary.icon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No courses found</div>
            <div className="text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  );
} 