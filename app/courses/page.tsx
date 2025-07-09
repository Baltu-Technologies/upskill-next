'use client';

import { useState } from 'react';
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
  Heart
} from 'lucide-react';

const courseCategories = [
  {
    title: 'Advanced Manufacturing',
    count: 18,
    gradient: 'from-blue-600 to-indigo-600',
    description: 'CNC machining, 3D printing, and modern manufacturing processes',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Data Center Operations',
    count: 22,
    gradient: 'from-green-600 to-teal-600',
    description: 'Server management, networking, and data center infrastructure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Semiconductor Technology',
    count: 15,
    gradient: 'from-purple-600 to-blue-600',
    description: 'Chip design, fabrication, and semiconductor manufacturing',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Broadband & Telecommunications',
    count: 19,
    gradient: 'from-orange-600 to-red-600',
    description: 'Fiber optics, 5G networks, and telecommunications infrastructure',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Green Technology',
    count: 16,
    gradient: 'from-green-500 to-emerald-600',
    description: 'Renewable energy, sustainability, and clean technology solutions',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Robotics & Automation',
    count: 21,
    gradient: 'from-red-600 to-pink-600',
    description: 'Industrial robotics, automation systems, and AI-driven processes',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop&crop=center'
  }
];

const featuredCourses = [
  {
    id: 1,
    title: 'CNC Machining & Advanced Manufacturing',
    instructor: 'Robert Martinez',
    company: 'Central Arizona College',
    companyLogo: '/media/organization_logo/central_arizona_college.jpeg',
    duration: '10 weeks',
    timeToComplete: '50 hours',
    image: 'https://images.unsplash.com/photo-1563200424-2F6196024328?w=600&h=300&fit=crop&crop=center',
    level: 'Intermediate',
    progress: 0,
    xp: 950,
    badges: ['CNC Operator', 'Manufacturing Pro'],
    industryTags: ['Advanced Manufacturing', 'Precision Engineering'],
    technologyTags: ['CNC Programming', 'CAD/CAM', 'G-Code', 'Quality Control'],
    description: 'Master CNC machining operations, programming, and advanced manufacturing techniques used in aerospace and automotive industries.',
    sourceType: 'university'
  },
  {
    id: 2,
    title: 'Data Center Infrastructure Management',
    instructor: 'Dr. Sarah Kim',
    company: 'Arizona State University',
    companyLogo: '/media/organization_logo/Arizona_State_University_logo.svg.png',
    duration: '12 weeks',
    timeToComplete: '60 hours',
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=300&fit=crop&crop=center',
    level: 'Advanced',
    progress: 35,
    xp: 1200,
    badges: ['Data Center Specialist', 'Infrastructure Expert'],
    industryTags: ['Data Center', 'Cloud Infrastructure'],
    technologyTags: ['Server Hardware', 'Networking', 'Cooling Systems', 'Power Management'],
    description: 'Comprehensive training on data center operations, server management, cooling systems, and infrastructure optimization for enterprise environments.',
    sourceType: 'university'
  },
  {
    id: 3,
    title: 'Semiconductor Fabrication Fundamentals',
    instructor: 'Dr. Michael Chen',
    company: 'TSMC',
    companyLogo: '/media/organization_logo/Tsmc.svg.png',
    duration: '14 weeks',
    timeToComplete: '70 hours',
    image: 'https://images.unsplash.com/photo-1620714774021-999933e45904?w=600&h=300&fit=crop&crop=center',
    level: 'Advanced',
    progress: 0,
    xp: 1350,
    badges: ['Semiconductor Technician', 'Fab Expert'],
    industryTags: ['Semiconductor', 'Microelectronics'],
    technologyTags: ['Cleanroom Operations', 'Photolithography', 'Etching', 'Metrology'],
    description: 'Learn semiconductor manufacturing processes, cleanroom protocols, and advanced fabrication techniques used in chip production.',
    sourceType: 'industry'
  },
  {
    id: 4,
    title: 'Fiber Optic Network Installation',
    instructor: 'James Rodriguez',
    company: 'TEKsystems',
    companyLogo: '/media/organization_logo/tek-systems.webp',
    duration: '8 weeks',
    timeToComplete: '40 hours',
    image: 'https://images.unsplash.com/photo-1580570595240-5eE06969528f?w=600&h=300&fit=crop&crop=center',
    level: 'Intermediate',
    progress: 60,
    xp: 800,
    badges: ['Fiber Optic Technician', 'Network Installer'],
    industryTags: ['Broadband', 'Telecommunications'],
    technologyTags: ['Fiber Optics', '5G Networks', 'Network Testing', 'Cable Management'],
    description: 'Master fiber optic installation, splicing, testing, and troubleshooting for broadband and telecommunications infrastructure.',
    sourceType: 'industry'
  },
  {
    id: 5,
    title: 'Semiconductor Assembly & Packaging',
    instructor: 'Lisa Thompson',
    company: 'Amkor Technology',
    companyLogo: '/media/organization_logo/amkor_technology.png',
    duration: '8 weeks',
    timeToComplete: '40 hours',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&h=300&fit=crop&crop=center',
    level: 'Intermediate',
    progress: 0,
    xp: 850,
    badges: ['Package Engineer', 'Assembly Specialist'],
    industryTags: ['Semiconductor', 'Microelectronics'],
    technologyTags: ['IC Packaging', 'Wire Bonding', 'Die Attach', 'Test & Reliability'],
    description: 'Learn semiconductor assembly and packaging processes, including die attach, wire bonding, molding, and reliability testing for integrated circuits.',
    sourceType: 'industry'
  },
  {
    id: 6,
    title: 'Industrial Robotics Programming',
    instructor: 'Dr. Alex Park',
    company: 'Honeywell Aerospace',
    companyLogo: '/media/organization_logo/honeywell-aerospace.jpg',
    duration: '12 weeks',
    timeToComplete: '55 hours',
    image: 'https://images.unsplash.com/photo-1560410075-b2a15039394a?w=600&h=300&fit=crop&crop=center',
    level: 'Advanced',
    progress: 25,
    xp: 1100,
    badges: ['Robotics Programmer', 'Automation Specialist'],
    industryTags: ['Robotics', 'Automation', 'AI'],
    technologyTags: ['PLC Programming', 'Robot Operating System', 'Machine Vision', 'AI Integration'],
    description: 'Master industrial robot programming, automation systems, and AI-driven manufacturing processes for modern production environments.',
    sourceType: 'industry'
  },
  {
    id: 7,
    title: 'Intro to Advanced Manufacturing',
    instructor: 'Maria Santos',
    company: 'Baltu Technologies',
    companyLogo: '/media/baltu_technologies_logo_flower_only.png',
    duration: '6 weeks',
    timeToComplete: '30 hours',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=300&fit=crop&crop=center',
    level: 'Beginner',
    progress: 0,
    xp: 700,
    badges: ['Manufacturing Basics', 'Safety Certified'],
    industryTags: ['Advanced Manufacturing', 'Industrial Careers'],
    technologyTags: ['Automation', 'Robotics Basics', 'Quality Control', 'Lean Manufacturing Principles'],
    description: 'Explore the fundamentals of advanced manufacturing, including automation, robotics, quality control, and lean principles for a successful career start.'
  },
  {
    id: 8,
    title: 'Career as a Structured Cable Technician',
    instructor: 'David Chen',
    company: 'Baltu Technologies',
    companyLogo: '/media/baltu_technologies_logo_flower_only.png',
    duration: '8 weeks',
    timeToComplete: '40 hours',
    image: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b07?w=600&h=300&fit=crop&crop=center',
    level: 'Beginner',
    progress: 0,
    xp: 800,
    badges: ['Cable Tech', 'Network Installer'],
    industryTags: ['Telecommunications', 'Infrastructure', 'IT Support'],
    technologyTags: ['Structured Cabling', 'Fiber Optics', 'Copper Cabling', 'Network Installation', 'Safety Standards'],
    description: 'Launch your career as a Structured Cable Technician. Learn to install, terminate, and test network cabling systems in various environments.'
  }
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedTechnology, setSelectedTechnology] = useState('All Technologies');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favoriteCourses, setFavoriteCourses] = useState<number[]>([]);

  const toggleFavorite = (courseId: number) => {
    setFavoriteCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filteredCourses = featuredCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.technologyTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         course.industryTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesIndustry = selectedIndustry === 'All Industries' || 
                           course.industryTags.some(tag => tag === selectedIndustry);
    
    const matchesTechnology = selectedTechnology === 'All Technologies' || 
                             course.technologyTags.some(tag => tag === selectedTechnology);

    return matchesSearch && matchesIndustry && matchesTechnology;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="relative mb-12 overflow-hidden">
          {/* Background with gradient and glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/30 rounded-2xl" />
          
          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-primary/25">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=center"
                  alt="Technology"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 via-accent/30 to-transparent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6 leading-tight">
              Explore Courses
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Advance your career with courses designed by 
              <span className="text-blue-400 font-semibold"> Industry</span> and
              <span className="text-green-400 font-semibold"> Technology</span> experts at leading
              <span className="text-purple-400 font-semibold"> Companies</span> and
              <span className="text-yellow-400 font-semibold"> Universities</span>
            </p>
            

          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
        </div>

        {/* Compact Sticky Filter Bar */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 -mx-4 px-4 py-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-600 focus:border-blue-500/50 text-white placeholder:text-gray-400 rounded-lg transition-all duration-200"
                />
              </div>

              {/* Filter Dropdowns - Right next to search */}
              <div className="flex gap-3 items-center">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:border-blue-500/50 focus:outline-none text-sm min-w-[140px]"
                >
                  <option value="All Industries">All Industries</option>
                  <option value="Advanced Manufacturing">Advanced Manufacturing</option>
                  <option value="Data Center">Data Center</option>
                  <option value="Semiconductor">Semiconductor</option>
                  <option value="Broadband">Broadband</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Automation">Automation</option>
                  <option value="AI">AI</option>
                </select>

                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:border-blue-500/50 focus:outline-none text-sm min-w-[140px]"
                >
                  <option value="All Technologies">All Technologies</option>
                  <option value="CNC Programming">CNC Programming</option>
                  <option value="CAD/CAM">CAD/CAM</option>
                  <option value="Server Hardware">Server Hardware</option>
                  <option value="Networking">Networking</option>
                  <option value="Cleanroom Operations">Cleanroom Operations</option>
                  <option value="Photolithography">Photolithography</option>
                  <option value="Fiber Optics">Fiber Optics</option>
                  <option value="5G Networks">5G Networks</option>
                  <option value="PLC Programming">PLC Programming</option>
                  <option value="Quality Control">Quality Control</option>
                </select>
              </div>
            </div>

            {/* Results count and Clear Filters Button */}
            <div className="flex items-center gap-4">
              <div className="text-gray-300">
                <span className="font-medium text-white">{filteredCourses.length}</span> courses found
              </div>
              {(selectedIndustry !== 'All Industries' || selectedTechnology !== 'All Technologies' || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedIndustry('All Industries');
                    setSelectedTechnology('All Technologies');
                    setSearchQuery('');
                  }}
                  className="border-slate-600 text-gray-300 hover:text-white px-3 py-2 text-sm"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedIndustry !== 'All Industries' || selectedTechnology !== 'All Technologies') && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
              <span className="text-sm text-gray-400">Filters:</span>
              {selectedIndustry !== 'All Industries' && (
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                  {selectedIndustry}
                </Badge>
              )}
              {selectedTechnology !== 'All Technologies' && (
                <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                  {selectedTechnology}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Course Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCategories.map((category, index) => (
              <Card key={index} className="group cursor-pointer overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="relative h-32 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-&lsqb;4000ms&rsqb; ease-out group-hover:scale-120 group-hover:translate-x-2 group-hover:-translate-y-1">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-80`} />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {category.count} courses
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <CardDescription className="text-gray-300 mb-3">{category.description}</CardDescription>
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    View courses
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Featured Courses
            </h2>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
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
                      className={`h-5 w-5 transition-all duration-200 ${
                        favoriteCourses.includes(course.id)
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
                        <div className={`self-start px-2 py-0.5 rounded text-xs font-medium tracking-wide border ${
                          course.sourceType === 'industry' 
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                        }`}>
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
                        {course.technologyTags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-blue-400/50 text-blue-400 bg-blue-400/5">
                            {tag}
                          </Badge>
                        ))}
                        {course.technologyTags.length > 2 && (
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
        </div>


      </div>
    </div>
  );
} 