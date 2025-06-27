'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  Users, 
  Building2, 
  Heart,
  Search,
  Filter,
  Target,
  TrendingUp,
  Award,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  BookOpen,
  User,
  RefreshCw,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useUserPathways, useUserProfile } from '../../../src/hooks/usePathways';
import { CareerPathway, UserProfile } from '../../../src/data/mockCareerData';

// Employer interface matching the existing structure
interface Employer {
  id: number;
  name: string;
  logo: string;
  location: string;
  industry: string;
  size: string;
  rating: number;
  description: string;
  openPositions: number;
  salaryRange: string;
  benefits: string[];
  technologies: string[];
  industries: string[];
  image: string;
  isHiring: boolean;
  featured: boolean;
}

// Employer data (prioritizing Amkor, TEKsystems, and Honeywell)
const allEmployers: Employer[] = [
  {
    id: 1,
    name: 'Amkor Technology',
    logo: '/media/organization_logo/amkor_technology.png',
    location: 'Tempe, AZ',
    industry: 'Semiconductor & Microelectronics',
    size: '2,500+ employees',
    rating: 4.3,
    description: 'Global leader in semiconductor assembly and test services, providing chip packaging solutions for the electronics industry.',
    openPositions: 28,
    salaryRange: '$55K - $95K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Performance Bonuses', 'Career Development'],
    technologies: ['IC Packaging', 'Wire Bonding', 'Test Engineering', 'Quality Assurance'],
    industries: ['Semiconductor', 'Microelectronics'],
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: true
  },
  {
    id: 2,
    name: 'TEKsystems Infrastructure',
    logo: '/media/organization_logo/tek-systems.webp',
    location: 'Scottsdale, AZ',
    industry: 'Broadband & Fiber Optics',
    size: '1,200+ employees',
    rating: 4.4,
    description: 'Leading provider of fiber optic network installation and telecommunications infrastructure services across the Southwest.',
    openPositions: 38,
    salaryRange: '$50K - $85K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Vehicle Allowance', 'Safety Bonuses'],
    technologies: ['Fiber Splicing', 'Network Testing', 'Cable Installation', '5G Infrastructure'],
    industries: ['Broadband', 'Fiber Optics'],
    image: 'https://images.unsplash.com/photo-1580570595240-5eE06969528f?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: true
  },
  {
    id: 3,
    name: 'Honeywell Aerospace',
    logo: '/media/organization_logo/honeywell-aerospace.jpg',
    location: 'Tempe, AZ',
    industry: 'Aerospace & Aviation Technologies',
    size: '1,000+ employees',
    rating: 4.5,
    description: 'Developing advanced aerospace technologies including avionics, engines, and flight control systems for commercial and defense applications.',
    openPositions: 32,
    salaryRange: '$70K - $135K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Tuition Reimbursement', 'Flexible Schedule'],
    technologies: ['Avionics', 'Flight Systems', 'Component Testing', 'Systems Integration'],
    industries: ['Aerospace', 'Aviation Technologies'],
    image: 'https://images.unsplash.com/photo-1569629985277-9cb0eb11c2e0?w=600&h=300&fit=crop&crop=center',
    isHiring: true,
    featured: true
  }
];

// Enhanced employer with match score and reasons
interface EmployerMatch extends Employer {
  matchScore: number;
  matchReasons: string[];
  pathwayMatches: string[];
  interestAlignment: {
    techDomains: string[];
    industries: string[];
  };
}

// Function to get company page URL based on company name
const getCompanyPageUrl = (companyName: string): string => {
  // Map specific company names to their URL slugs
  const companyUrlMap: { [key: string]: string } = {
    'Amkor Technology': '/employers/amkor',
    'TEKsystems Infrastructure': '/employers/teksystems',
    'Honeywell Aerospace': '/employers/honeywell'
  };
  
  // Return specific URL if available, otherwise use dynamic ID-based URL
  return companyUrlMap[companyName] || `/employers/${companyName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`;
};

export default function MyCareerMatchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(60);
  const [favoriteEmployers, setFavoriteEmployers] = useState<number[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Get user data
  const { pathways, loading: pathwaysLoading, error: pathwaysError } = useUserPathways();
  const { profile: userProfile, loading: profileLoading, error: profileError } = useUserProfile();

  // Calculate employer matches based on user's pathways and interests
  const employerMatches = useMemo(() => {
    return allEmployers.map(employer => {
      let matchScore = 0;
      const matchReasons: string[] = [];
      const pathwayMatches: string[] = [];
      const interestAlignment = {
        techDomains: [] as string[],
        industries: [] as string[]
      };

      // Ensure our three featured companies always have good match scores
      if (employer.name === 'Honeywell Aerospace') {
        matchScore = 92;
        matchReasons.push('Aerospace technology matches your engineering interests');
        matchReasons.push('Advanced systems align with technical skills');
        matchReasons.push('Industry leader with excellent career development');
        pathwayMatches.push('Aerospace Systems Technician', 'Advanced Manufacturing');
        interestAlignment.techDomains = ['Aerospace Technology', 'Advanced Systems'];
        interestAlignment.industries = ['Aerospace', 'Aviation Technologies'];
      } else if (employer.name === 'Amkor Technology') {
        matchScore = 85;
        matchReasons.push('Semiconductor expertise matches your technical interests');
        matchReasons.push('Advanced manufacturing aligns with career goals');
        matchReasons.push('Strong growth opportunities in tech sector');
        pathwayMatches.push('Semiconductor Process Technician', 'Advanced Manufacturing');
        interestAlignment.techDomains = ['Semiconductor Technology', 'Manufacturing & Production'];
        interestAlignment.industries = ['Semiconductor', 'Microelectronics'];
      } else if (employer.name === 'TEKsystems Infrastructure') {
        matchScore = 78;
        matchReasons.push('Networking and fiber optics align with your interests');
        matchReasons.push('Infrastructure work matches technical pathway');
        matchReasons.push('Growing demand in broadband sector');
        pathwayMatches.push('Network Infrastructure Specialist', 'Telecommunications');
        interestAlignment.techDomains = ['Networking', 'Telecommunications'];
        interestAlignment.industries = ['Broadband', 'Fiber Optics'];
      }

      // Enhanced matching if user profile exists
      if (userProfile && pathways.length > 0) {
        // Additional pathway-based matching (bonus points)
        pathways.forEach(pathway => {
          const industryMatch = pathway.relevantIndustries.some(industry => 
            employer.industry.includes(industry) || industry.includes(employer.industry)
          );
          
          if (industryMatch) {
            matchScore += 5; // Bonus points
            if (!pathwayMatches.includes(pathway.title)) {
              pathwayMatches.push(pathway.title);
              matchReasons.push(`Matches your ${pathway.title} pathway`);
            }
          }

          // Check tech domain alignment with employer technologies
          pathway.requiredTechDomains.forEach(techDomain => {
            const techMatch = employer.technologies.some(technology => 
              technology.toLowerCase().includes(techDomain.toLowerCase()) ||
              techDomain.toLowerCase().includes(technology.toLowerCase())
            );
            
            if (techMatch) {
              matchScore += 3; // Bonus points
              if (!interestAlignment.techDomains.includes(techDomain)) {
                interestAlignment.techDomains.push(techDomain);
                matchReasons.push(`${techDomain} skills match employer needs`);
              }
            }
          });
        });

        // Interest-based scoring bonus
        Object.entries(userProfile.capturedInterests.industryDomains).forEach(([industry, rating]) => {
          const numRating = Number(rating);
          if (numRating >= 3 && (employer.industry.includes(industry) || industry.includes(employer.industry))) {
            matchScore += 3; // Bonus points
            if (!interestAlignment.industries.includes(industry)) {
              interestAlignment.industries.push(industry);
              matchReasons.push(`Strong interest in ${industry} (${numRating}/5)`);
            }
          }
        });
      }

      // Standard bonuses for all companies
      if (employer.isHiring) {
        matchScore += 5;
        matchReasons.push('Actively hiring');
      }

      if (employer.featured) {
        matchScore += 3;
        matchReasons.push('Industry leader');
      }

      // Location bonus for Arizona companies
      if (employer.location.includes('AZ')) {
        matchScore += 5;
        matchReasons.push('Located in Arizona');
      }

      // Remove duplicate reasons
      const uniqueReasons = Array.from(new Set(matchReasons));

      return {
        ...employer,
        matchScore: Math.min(matchScore, 100), // Cap at 100%
        matchReasons: uniqueReasons,
        pathwayMatches: Array.from(new Set(pathwayMatches)),
        interestAlignment
      } as EmployerMatch;
    });
  }, [userProfile, pathways]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    return employerMatches
      .filter(match => {
        const meetsMinScore = match.matchScore >= minMatchScore;
        const matchesSearch = !searchQuery || 
          match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.technologies.some(technology => technology.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return meetsMinScore && matchesSearch;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [employerMatches, minMatchScore, searchQuery]);

  const toggleFavorite = (employerId: number) => {
    setFavoriteEmployers(prev => 
      prev.includes(employerId) 
        ? prev.filter(id => id !== employerId)
        : [...prev, employerId]
    );
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (score >= 60) return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Potential Match';
  };

  if (pathwaysLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Career Matches</h3>
          <p className="text-gray-400">Comparing your pathways with employer requirements...</p>
        </div>
      </div>
    );
  }

  if (pathwaysError || profileError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Career Matches</h3>
          <p className="text-gray-400">Please try refreshing the page or check your connection.</p>
        </div>
      </div>
    );
  }

  if (!pathways.length) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No Career Pathways Found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              To see your career matches, you need to have saved career pathways first. 
              Start by exploring and saving some pathways that interest you.
            </p>
            <a 
              href="/career-exploration"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Target className="w-5 h-5 mr-2" />
              Explore Career Pathways
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="relative mb-12 overflow-hidden">
          {/* Background with gradient and glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/30 rounded-2xl" />
          
          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-blue-500/25">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 via-purple-500/30 to-transparent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
              My Career Matches
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Employers that align with your 
              <span className="text-blue-400 font-semibold"> Career Pathways</span> and
              <span className="text-purple-400 font-semibold"> Professional Interests</span>
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Total Matches</h3>
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-400">{filteredMatches.length}</div>
              <p className="text-sm text-gray-400">Companies aligned with your goals</p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Avg Match Score</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-400">
                {filteredMatches.length ? Math.round(filteredMatches.reduce((acc, match) => acc + match.matchScore, 0) / filteredMatches.length) : 0}%
              </div>
              <p className="text-sm text-gray-400">Average compatibility rating</p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Active Pathways</h3>
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-purple-400">{pathways.filter(p => p.status === 'active').length}</div>
              <p className="text-sm text-gray-400">Career paths driving matches</p>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies, industries, or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <label className="text-sm text-gray-400">Min Match:</label>
                <select
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Any Match</option>
                  <option value={40}>40%+ (Potential)</option>
                  <option value={60}>60%+ (Good)</option>
                  <option value={80}>80%+ (Excellent)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Matches Found</h3>
            <p className="text-gray-400">Try lowering your match score filter or explore more career pathways.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all group flex flex-col h-full">
                {/* Company Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={match.image}
                    alt={match.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  
                  {/* Match Score Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full border text-xs font-semibold ${getMatchScoreColor(match.matchScore)}`}>
                    {match.matchScore}% {getMatchScoreLabel(match.matchScore)}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(match.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-900/80 hover:bg-gray-800 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favoriteEmployers.includes(match.id) ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>

                {/* Company Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-white mb-1">{match.name}</h3>
                    <p className="text-sm text-blue-400 mb-1">{match.industry}</p>
                    <p className="text-xs text-gray-400">Multiple Job Opportunities Available</p>
                  </div>

                  <div className="flex-grow">
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{match.description}</p>

                    {/* Pathway Matches */}
                    {match.pathwayMatches.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-white mb-2">Related Pathways:</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.pathwayMatches.slice(0, 2).map((pathway, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-500/30">
                              {pathway}
                            </span>
                          ))}
                          {match.pathwayMatches.length > 2 && (
                            <span className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded-full">
                              +{match.pathwayMatches.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Company Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-400 mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          Location
                        </div>
                        <div className="text-white">{match.location}</div>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-400 mb-1">
                          <Users className="w-4 h-4 mr-1" />
                          Company Size
                        </div>
                        <div className="text-white">{match.size}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Salary Range
                        </div>
                        <div className="text-white">{match.salaryRange}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button - Always at bottom */}
                  <div className="mt-auto pt-4">
                    <Link 
                      href={getCompanyPageUrl(match.name)}
                      className="w-full block"
                    >
                      <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center group">
                        View Company Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">Want Better Matches?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Improve your career matches by exploring more pathways, updating your interests, or completing additional courses in your current pathways.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/career-exploration"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore More Pathways
              </a>
              <a 
                href="/profile"
                className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                <User className="w-5 h-5 mr-2" />
                Update Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}