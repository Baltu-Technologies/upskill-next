'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search,
  Filter,
  MapPin,
  Users,
  Building2,
  Star,
  Heart,
  ExternalLink,
  Briefcase,
  Globe,
  ChevronDown,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Award,
  Zap,
  Target,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock employer data
const employers = [
  {
    id: 1,
    name: 'TechCorp Innovation',
    logo: '🚀',
    industry: 'Technology',
    location: 'San Francisco, CA',
    size: '1000-5000',
    rating: 4.8,
    description: 'Leading technology company specializing in AI and machine learning solutions for enterprise clients.',
    openPositions: 23,
    salaryRange: '$80k - $180k',
    benefits: ['Remote Work', 'Health Insurance', 'Stock Options', '401k'],
    technologies: ['React', 'Node.js', 'Python', 'AWS'],
    culture: ['Innovation', 'Diversity', 'Work-Life Balance'],
    founded: '2015',
    website: 'techcorp.com',
    saved: false,
    featured: true
  },
  {
    id: 2,
    name: 'DataDriven Analytics',
    logo: '📊',
    industry: 'Data Science',
    location: 'New York, NY',
    size: '500-1000',
    rating: 4.6,
    description: 'Data analytics firm helping Fortune 500 companies make data-driven decisions.',
    openPositions: 15,
    salaryRange: '$70k - $160k',
    benefits: ['Flexible Hours', 'Learning Budget', 'Health Insurance'],
    technologies: ['Python', 'SQL', 'Tableau', 'Spark'],
    culture: ['Learning', 'Collaboration', 'Growth'],
    founded: '2018',
    website: 'datadriven.com',
    saved: true,
    featured: false
  },
  {
    id: 3,
    name: 'GreenTech Solutions',
    logo: '🌱',
    industry: 'Clean Energy',
    location: 'Austin, TX',
    size: '100-500',
    rating: 4.9,
    description: 'Sustainable technology company focused on renewable energy and environmental solutions.',
    openPositions: 8,
    salaryRange: '$60k - $140k',
    benefits: ['Remote Work', 'Sabbatical', 'Environmental Impact'],
    technologies: ['IoT', 'React', 'MongoDB', 'Docker'],
    culture: ['Sustainability', 'Innovation', 'Purpose'],
    founded: '2020',
    website: 'greentech.com',
    saved: false,
    featured: true
  },
  {
    id: 4,
    name: 'FinanceFirst',
    logo: '💰',
    industry: 'Financial Services',
    location: 'Chicago, IL',
    size: '5000+',
    rating: 4.4,
    description: 'Leading financial services company providing innovative banking and investment solutions.',
    openPositions: 45,
    salaryRange: '$90k - $200k',
    benefits: ['Bonuses', 'Health Insurance', 'Retirement Plan'],
    technologies: ['Java', 'Spring', 'Oracle', 'Kubernetes'],
    culture: ['Excellence', 'Integrity', 'Client Focus'],
    founded: '1995',
    website: 'financefirst.com',
    saved: false,
    featured: false
  },
  {
    id: 5,
    name: 'HealthTech Innovations',
    logo: '🏥',
    industry: 'Healthcare',
    location: 'Boston, MA',
    size: '1000-5000',
    rating: 4.7,
    description: 'Healthcare technology company developing cutting-edge medical software and devices.',
    openPositions: 18,
    salaryRange: '$75k - $170k',
    benefits: ['Healthcare', 'Research Time', 'Conference Budget'],
    technologies: ['React', 'Python', 'TensorFlow', 'FHIR'],
    culture: ['Impact', 'Innovation', 'Quality'],
    founded: '2012',
    website: 'healthtech.com',
    saved: true,
    featured: false
  },
  {
    id: 6,
    name: 'EduLearn Platform',
    logo: '📚',
    industry: 'Education',
    location: 'Seattle, WA',
    size: '100-500',
    rating: 4.5,
    description: 'Online education platform revolutionizing how people learn and develop new skills.',
    openPositions: 12,
    salaryRange: '$65k - $150k',
    benefits: ['Learning Credits', 'Remote Work', 'Flexible PTO'],
    technologies: ['Vue.js', 'Django', 'PostgreSQL', 'Redis'],
    culture: ['Learning', 'Growth', 'Accessibility'],
    founded: '2019',
    website: 'edulearn.com',
    saved: false,
    featured: true
  }
];

const industries = ['All Industries', 'Technology', 'Data Science', 'Clean Energy', 'Financial Services', 'Healthcare', 'Education'];
const locations = ['All Locations', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Chicago, IL', 'Boston, MA', 'Seattle, WA'];
const companySizes = ['All Sizes', '1-50', '51-100', '100-500', '500-1000', '1000-5000', '5000+'];
const workTypes = ['All Types', 'Remote', 'Hybrid', 'On-site'];

export default function SearchEmployersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [selectedWorkType, setSelectedWorkType] = useState('All Types');
  const [showFilters, setShowFilters] = useState(false);
  const [savedEmployers, setSavedEmployers] = useState<number[]>([2, 5]); // Mock saved employers
  const [filteredEmployers, setFilteredEmployers] = useState(employers);
  const [sortBy, setSortBy] = useState('relevance');

  // Filter employers based on search and filters
  useEffect(() => {
    let filtered = employers.filter(employer => {
      const matchesSearch = employer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           employer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           employer.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesIndustry = selectedIndustry === 'All Industries' || employer.industry === selectedIndustry;
      const matchesLocation = selectedLocation === 'All Locations' || employer.location === selectedLocation;
      const matchesSize = selectedSize === 'All Sizes' || employer.size === selectedSize;
      
      return matchesSearch && matchesIndustry && matchesLocation && matchesSize;
    });

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'positions':
        filtered.sort((a, b) => b.openPositions - a.openPositions);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredEmployers(filtered);
  }, [searchQuery, selectedIndustry, selectedLocation, selectedSize, sortBy]);

  const toggleSaveEmployer = (employerId: number) => {
    setSavedEmployers(prev => 
      prev.includes(employerId) 
        ? prev.filter(id => id !== employerId)
        : [...prev, employerId]
    );
  };

  const clearFilters = () => {
    setSelectedIndustry('All Industries');
    setSelectedLocation('All Locations');
    setSelectedSize('All Sizes');
    setSelectedWorkType('All Types');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Search Employers</h1>
              <p className="text-slate-600 dark:text-slate-300">Discover companies that match your career goals and values</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search companies, roles, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-slate-200 dark:border-gray-600 focus:border-purple-500 rounded-lg"
            />
          </div>

          {/* Filter Toggle and Quick Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
            </Button>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Sort by: {sortBy}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('relevance')}>Relevance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>Highest Rated</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('positions')}>Most Positions</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>Company Name</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Results Count */}
            <div className="text-sm text-slate-600 dark:text-slate-400 ml-auto">
              {filteredEmployers.length} companies found
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-gray-600">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Industry</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedIndustry}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {industries.map(industry => (
                      <DropdownMenuItem key={industry} onClick={() => setSelectedIndustry(industry)}>
                        {industry}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedLocation}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {locations.map(location => (
                      <DropdownMenuItem key={location} onClick={() => setSelectedLocation(location)}>
                        {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Size</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedSize}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {companySizes.map(size => (
                      <DropdownMenuItem key={size} onClick={() => setSelectedSize(size)}>
                        {size}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Employer Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEmployers.map((employer) => (
            <div
              key={employer.id}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
                employer.featured && "ring-2 ring-purple-500/20 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-gray-800"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{employer.logo}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{employer.name}</h3>
                      {employer.featured && (
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{employer.industry}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSaveEmployer(employer.id)}
                  className="text-slate-400 hover:text-purple-600"
                >
                  {savedEmployers.includes(employer.id) ? (
                    <BookmarkCheck className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {employer.location}
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Users className="h-4 w-4" />
                  {employer.size} employees
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {employer.rating} rating
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Briefcase className="h-4 w-4" />
                  {employer.openPositions} open roles
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {employer.description}
              </p>

              {/* Technologies */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {employer.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {employer.benefits.slice(0, 3).map((benefit) => (
                    <Badge key={benefit} variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-600">
                      {benefit}
                    </Badge>
                  ))}
                  {employer.benefits.length > 3 && (
                    <Badge variant="outline" className="text-slate-600 dark:text-slate-400">
                      +{employer.benefits.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-600">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Salary: {employer.salaryRange}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    View Company
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Jobs
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEmployers.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No employers found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredEmployers.length > 0 && filteredEmployers.length >= 6 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Companies
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 