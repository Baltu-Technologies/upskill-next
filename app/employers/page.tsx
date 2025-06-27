'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building, 
  Search, 
  MapPin,
  Users,
  Star,
  ChevronRight,
  Briefcase,
  DollarSign,
  Clock,
  Heart,
  ExternalLink,
  Zap,
  Globe,
  Award
} from 'lucide-react';

const employerCategories = [
  {
    title: 'Semiconductor & Microelectronics',
    count: 24,
    gradient: 'from-purple-600 to-blue-600',
    description: 'Chip design, wafer processing, and advanced fabrication',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Advanced Manufacturing',
    count: 31,
    gradient: 'from-blue-600 to-indigo-600',
    description: 'Robotics, CNC machining, and precision assembly',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Data Centers & Cloud Infrastructure',
    count: 18,
    gradient: 'from-green-600 to-teal-600',
    description: 'Server maintenance, networking, and IT infrastructure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Broadband & Fiber Optics',
    count: 22,
    gradient: 'from-orange-600 to-red-600',
    description: 'Fiber installation, 5G networks, and telecom infrastructure',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Green Technology & Renewable Energy',
    count: 19,
    gradient: 'from-green-500 to-emerald-600',
    description: 'Solar installation, wind systems, and energy storage',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop&crop=center'
  },
  {
    title: 'Aerospace & Aviation Technologies',
    count: 15,
    gradient: 'from-red-600 to-pink-600',
    description: 'Aircraft systems, avionics, and aerospace manufacturing',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop&crop=center'
  }
];

const featuredEmployers = [
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
  },
  {
    id: 7,
    name: 'Precision Manufacturing Corp',
    logo: '/media/organization_logo/central_arizona_college.jpeg',
    locations: ['Chandler, AZ'],
    industry: 'Advanced Manufacturing',
    size: '950+ employees',
    description: 'Precision machining and manufacturing services for aerospace, automotive, and medical device industries using advanced CNC technology.',
    salaryRange: '$58K - $105K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Skill Development', 'Performance Bonuses'],
    technologies: ['CNC Machining', 'CAD/CAM', 'Quality Control', 'Automation Systems'],
    industries: ['Advanced Manufacturing', 'Precision Machining'],
    image: 'https://images.unsplash.com/photo-1563200424-2F6196024328?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: false
  },
  {
    id: 8,
    name: 'Industrial MEP Solutions',
    logo: '/media/baltu_technologies_logo_flower_only.png',
    locations: ['Glendale, AZ', 'Peoria, AZ'],
    industry: 'Energy & Power Systems',
    size: '450+ employees',
    description: 'Providing mechanical, electrical, and plumbing services for industrial facilities, focusing on energy efficiency and smart systems.',
    salaryRange: '$52K - $88K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Tool Allowance', 'Apprenticeship Programs'],
    technologies: ['Industrial Controls', 'HVAC Systems', 'Power Distribution', 'Smart Building Tech'],
    industries: ['Energy Systems', 'Industrial MEP'],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: false
  }
];

// Function to get company page URL based on company name
const getCompanyPageUrl = (companyName: string): string => {
  // Map specific company names to their URL slugs
  const companyUrlMap: { [key: string]: string } = {
    'Honeywell Aerospace': '/employers/honeywell',
    'Amkor Technology': '/employers/amkor',
    'TEKsystems Infrastructure': '/employers/teksystems'
  };
  
  // Return specific URL if available, otherwise use dynamic ID-based URL
  return companyUrlMap[companyName] || `/employers/${companyName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`;
};

export default function AllEmployersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [favoriteEmployers, setFavoriteEmployers] = useState<number[]>([]);

  const toggleFavorite = (employerId: number) => {
    setFavoriteEmployers(prev => 
      prev.includes(employerId) 
        ? prev.filter(id => id !== employerId)
        : [...prev, employerId]
    );
  };

  const filteredEmployers = featuredEmployers.filter(employer => {
    const matchesSearch = employer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         employer.industries.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesIndustry = selectedIndustry === 'All Industries' || 
                           employer.industry === selectedIndustry;
    
    const matchesLocation = selectedLocation === 'All Locations' || 
                           employer.locations.some(location => location.includes(selectedLocation));

    return matchesSearch && matchesIndustry && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-black dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="relative mb-12 overflow-hidden">
          {/* Background with gradient and glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 via-red-900/20 to-orange-900/30 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/30 rounded-2xl" />
          
          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-orange-500/25">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center"
                  alt="Career Opportunities"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-red-600/80" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/50 via-red-500/30 to-transparent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-orange-100 to-red-100 bg-clip-text text-transparent mb-6 leading-tight">
              Career Opportunities
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Connect with leading employers in 
              <span className="text-orange-400 font-semibold"> High-Tech Industries</span> that are actively hiring for
              <span className="text-green-400 font-semibold"> Skilled Technicians</span> and
              <span className="text-blue-400 font-semibold"> Engineering Professionals</span>
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-xl" />
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
                  placeholder="Search employers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-600 focus:border-orange-500/50 text-white placeholder:text-gray-400 rounded-lg transition-all duration-200"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex gap-3 items-center">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:border-orange-500/50 focus:outline-none text-sm min-w-[140px]"
                >
                  <option value="All Industries">All Industries</option>
                  <option value="Semiconductor & Microelectronics">Semiconductor</option>
                  <option value="Advanced Manufacturing">Manufacturing</option>
                  <option value="Data Centers & Cloud Infrastructure">Data Centers</option>
                  <option value="Broadband & Fiber Optics">Broadband</option>
                  <option value="Green Technology & Renewable Energy">Green Tech</option>
                  <option value="Aerospace & Aviation Technologies">Aerospace</option>
                  <option value="Energy & Power Systems">Energy Systems</option>
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:border-orange-500/50 focus:outline-none text-sm min-w-[120px]"
                >
                  <option value="All Locations">All Locations</option>
                  <option value="Phoenix">Phoenix</option>
                  <option value="Tempe">Tempe</option>
                  <option value="Scottsdale">Scottsdale</option>
                  <option value="Mesa">Mesa</option>
                  <option value="Chandler">Chandler</option>
                  <option value="Glendale">Glendale</option>
                </select>
              </div>
            </div>

            {/* Results count and Clear Filters Button */}
            <div className="flex items-center gap-4">
              <div className="text-gray-300">
                <span className="font-medium text-white">{filteredEmployers.length}</span> employers found
              </div>
              {(selectedIndustry !== 'All Industries' || selectedLocation !== 'All Locations' || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedIndustry('All Industries');
                    setSelectedLocation('All Locations');
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
          {(selectedIndustry !== 'All Industries' || selectedLocation !== 'All Locations') && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
              <span className="text-sm text-gray-400">Filters:</span>
              {selectedIndustry !== 'All Industries' && (
                <Badge variant="secondary" className="bg-orange-600/20 text-orange-400 border-orange-600/30 text-xs">
                  {selectedIndustry}
                </Badge>
              )}
              {selectedLocation !== 'All Locations' && (
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                  {selectedLocation}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Employer Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Browse by Industry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employerCategories.map((category, index) => (
              <Card key={index} className="group cursor-pointer overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="relative h-32 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-120 group-hover:translate-x-2 group-hover:-translate-y-1">
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
                      {category.count} employers
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <CardDescription className="text-gray-300 mb-3">{category.description}</CardDescription>
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    View employers
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Employers */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Featured Employers
            </h2>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEmployers.map((employer) => (
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
                      toggleFavorite(employer.id);
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
                    <div className="flex items-center text-sm">
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-1" />
                        {employer.size}
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
                    <Link 
                      href={getCompanyPageUrl(employer.name)}
                      className="block w-full"
                    >
                      <Button 
                        size="sm" 
                        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white transition-all duration-300 hover:shadow-lg rounded-xl"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </Link>
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