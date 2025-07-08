'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target,
  CheckCircle,
  Clock,
  Briefcase,
  Award,
  User,
  BookOpen,
  Play,
  TrendingUp,
  Calendar,
  Star,
  Trophy,
  Zap,
  Activity,
  MapPin,
  Building2,
  FileText,
  ArrowRight,
  ChevronRight,
  Flame,
  Shield,
  Users,
  Crown,
  Gift,
  Share2,
  Copy,
  ExternalLink,
  Plus,
  Medal,
  Sword,
  Sparkles,
  Rocket,
  Building,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Enhanced mock data with gamification elements
const mockDashboardData = {
  user: {
    name: "Peter Costa",
    firstName: "Peter",
    username: "pcosta.upskill",
    level: 42,
    title: "Data Center Technician Apprentice",
    avatar: "/media/Peter_Costa_Bio_2024.jpg",
    joinedDate: "July 2022",
    following: 12,
    followers: 8
  },
  stats: {
    currentStreak: 15,
    longestStreak: 28,
    totalXP: 2847,
    weeklyXP: 487,
    crowns: 23,
    achievements: 8,
    league: "Bronze",
    leaguePosition: 3
  },
  recentActivity: {
    lastAction: "Completed Server Hardware Module",
    timeAgo: "2 hours ago",
    actionsToday: 5,
    xpEarnedToday: 85
  },
  courseInProgress: {
    title: "Advanced Data Center Operations",
    progress: 68,
    currentModule: 3,
    totalLessons: 24,
    completedLessons: 16,
    lessonsRemaining: 8,
    nextLesson: "Cooling System Management",
    xpPerLesson: 15,
    totalHours: 120,
    completedHours: 82
  },
  achievements: [
    {
      id: 'wildfire',
      title: 'Wildfire',
      description: 'Reach a 7 day streak',
      icon: 'flame',
      level: 1,
      progress: 15,
      maxProgress: 7,
      completed: true,
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'sage',
      title: 'Sage',
      description: 'Earn 1000 XP',
      icon: 'award',
      level: 4,
      progress: 847,
      maxProgress: 1000,
      completed: false,
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'scholar',
      title: 'Scholar',
      description: 'Complete 50 lessons',
      icon: 'book',
      progress: 38,
      maxProgress: 50,
      completed: false,
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'champion',
      title: 'Champion',
      description: 'Reach Bronze League',
      icon: 'trophy',
      progress: 1,
      maxProgress: 1,
      completed: true,
      color: 'from-yellow-400 to-orange-500'
    }
  ],
  jobOpportunities: {
    newMatches: 3,
    totalMatches: 18,
    topMatch: {
      title: "Senior Data Center Technician",
      company: "CloudTech Solutions",
      matchPercentage: 92,
      location: "Boston, MA"
    }
  },
  certifications: {
    earned: 4,
    inProgress: 2,
    available: 12,
    nextCertification: "CompTIA Server+ Certification",
    nextProgress: 75,
    recentCert: "Data Center Safety"
  },
  inviteRewards: {
    totalInvites: 3,
    successfulInvites: 2,
    xpPerInvite: 50,
    totalXpEarned: 100,
    referralCode: "PETER-UPSKILL-2024"
  }
};

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

// Job opportunities data - featured employers
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
    image: '/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg',
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
    image: '/media/job_opportunity_images/honeywell_aerospace_employerimage1.jpg',
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

export default function LearnerDashboard() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [favoriteEmployers, setFavoriteEmployers] = useState<number[]>([]);
  const data = mockDashboardData;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(data.inviteRewards.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleEmployerFavorite = (employerId: number) => {
    setFavoriteEmployers(prev => 
      prev.includes(employerId)
        ? prev.filter(id => id !== employerId)
        : [...prev, employerId]
    );
  };

  return (
    <div className="min-h-screen bg-black dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 overflow-x-hidden w-full" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Top Profile Bar - Completely flush with window top */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl shadow-blue-900/50 -mx-0 xs:-mx-1 sm:-mx-2 md:-mx-4 lg:-mx-6 xl:-mx-0 -mt-0">
        {/* Glow effect behind the bar */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/30 to-blue-600/20 blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-1 xs:px-2 sm:px-4 md:px-6 lg:px-8 xl:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col items-center sm:items-start gap-4">
            {/* Avatar and Name Section */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/25 flex-shrink-0">
                <Image 
                  src={data.user.avatar} 
                  alt={data.user.name} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg truncate">
                  {data.user.name}
                </h1>
                <p className="text-blue-200/80 text-sm">Member since {data.user.joinedDate}</p>
              </div>
            </div>
            
            {/* Gamification Stats - Always below profile */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-orange-500/25 backdrop-blur-sm">
                <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold text-sm sm:text-base">{data.stats.currentStreak}</span>
                <span className="text-xs opacity-90 hidden sm:inline">day streak</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500/90 to-amber-500/90 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-yellow-500/25 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold text-sm sm:text-base">{data.stats.totalXP}</span>
                <span className="text-xs opacity-90 hidden sm:inline">XP</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-purple-500/25 backdrop-blur-sm">
                <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold text-sm sm:text-base">{data.certifications.earned}</span>
                <span className="text-xs opacity-90 hidden sm:inline">badges</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-emerald-500/25 backdrop-blur-sm">
                <Medal className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold text-sm sm:text-base">{data.stats.achievements}</span>
                <span className="text-xs opacity-90 hidden sm:inline">achievements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="relative z-10 w-full max-w-7xl mx-auto px-0 xs:px-1 sm:px-2 md:px-4 lg:px-6 xl:px-6 py-2 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden" 
        style={{ maxWidth: '100vw', width: '100%', boxSizing: 'border-box' }}
      >

        {/* VARIATION 2: Card-Based Layout (Commented out - uncomment to try) */}
        {/* 
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 px-4 md:px-6 py-8 rounded-2xl mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src={data.user.avatar} 
                  alt={data.user.name} 
                  width={80} 
                  height={80} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {data.user.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Joined {data.user.joinedDate}</p>
              </div>
            </div>
            
            <div className="flex-1 lg:ml-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-sm">
                  <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{data.stats.currentStreak}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Day Streak</div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-sm">
                  <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{data.stats.totalXP}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Total XP</div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-sm">
                  <Crown className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{data.stats.crowns}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Crowns</div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-sm">
                  <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900 dark:text-white">#{data.stats.leaguePosition}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Bronze League</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        */}

        {/* VARIATION 3: Sidebar Style (Commented out - uncomment to try) */}
        {/* 
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image 
                src={data.user.avatar} 
                alt={data.user.name} 
                width={48} 
                height={48} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                {data.user.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Level 12 • {data.user.joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{data.stats.currentStreak}</div>
              <div className="text-xs text-slate-500">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{data.stats.totalXP}</div>
              <div className="text-xs text-slate-500">XP</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{data.stats.crowns}</div>
              <div className="text-xs text-slate-500">Crowns</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">#{data.stats.leaguePosition}</div>
              <div className="text-xs text-slate-500">Rank</div>
            </div>
          </div>
        </div>
        */}

        {/* Main Content - Reorganized by Priority */}
        <div className="space-y-6">
          
          {/* 1. Career Pathway - MOST IMPORTANT (Full Width) */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border-2 border-blue-200/60 dark:border-blue-400/30 hover:border-blue-300/80 dark:hover:border-blue-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 w-full min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Career Pathway
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative p-6 rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
                {/* Data Center Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: `url('/media/peterbaltutech_A_massive_cutting_edge_data_center_that_shows__0e591871-e0a2-4fdd-8856-3e839b1c35ba_1.png')`
                  }}
                ></div>
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
                
                {/* Content with improved contrast */}
                <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:items-center md:text-left md:gap-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="font-bold text-white text-xl md:text-2xl mb-2">Data Center Technician</h3>
                    <p className="text-blue-100 text-sm md:text-base mb-4">Server Hardware & Infrastructure Track</p>
                    
                    {/* Progress info - responsive layout */}
                    <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-white">68%</div>
                        <span className="text-sm text-blue-100">pathway complete</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        <Clock className="h-4 w-4" />
                        <span>82/120 hours</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Continue button - responsive positioning */}
                  <div className="flex-shrink-0">
                    <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3">
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                </div>
              </div>

              {/* Courses Button - positioned below the main pathway card */}
              <div className="flex justify-start">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCourses(!showCourses)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                  <ChevronRight className={cn("h-4 w-4 transition-transform", showCourses && "rotate-90")} />
                </Button>
              </div>

              {/* Accordion Courses List */}
              {showCourses && (
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Pathway Courses</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">Data Center Fundamentals</p>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">24 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-green-200 dark:bg-green-800 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full w-full" />
                          </div>
                          <span className="text-sm font-semibold text-green-600">100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">Server Hardware & Maintenance</p>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">32 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                          </div>
                          <span className="text-sm font-semibold text-blue-600">75%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">Network Infrastructure</p>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">28 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-500">0%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">Power & Cooling Systems</p>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">20 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-500">0%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">Safety & Compliance</p>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">16 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-500">0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Job Opportunities - SECOND PRIORITY (Full Width) */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Job Opportunities
                </h2>
                <p className="text-gray-300 text-lg">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobOpportunityEmployers.map((employer) => (
                <Card key={employer.id} className="group cursor-pointer overflow-hidden border-2 border-slate-700 bg-slate-800/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
                  {/* Employer Banner */}
                  <div className="relative h-40 overflow-hidden">
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
                        <div className="bg-orange-500 text-white font-medium px-2 py-1 rounded text-xs">
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Hiring Status */}
                    {employer.isHiring && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-green-500 text-white font-medium px-2 py-1 rounded text-xs">
                          Hiring Now
                        </div>
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
                        className={`h-4 w-4 transition-all duration-200 ${
                          favoriteEmployers.includes(employer.id)
                            ? 'fill-red-500 text-red-500 scale-110'
                            : 'text-white group-hover/heart:text-red-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Company Logo - Overlapping image and content */}
                  <div className="relative -mt-6 ml-4 z-10">
                    <div className="flex items-end gap-3">
                      <div className="relative w-24 h-12 bg-white rounded-lg p-2 flex items-center justify-center shadow-lg border border-slate-700">
                        <Image
                          src={employer.logo}
                          alt={employer.name}
                          width={80}
                          height={32}
                          className="object-contain max-h-8"
                        />
                      </div>
                      <div className="pb-2 flex flex-col justify-end gap-1">
                        {/* Location */}
                        <div className="flex items-center gap-1 text-gray-300 text-xs">
                          <MapPin className="h-3 w-3" />
                          {employer.locations.length === 1 
                            ? employer.locations[0]
                            : `${employer.locations[0]} +${employer.locations.length - 1} more`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 flex flex-col flex-1 pt-3">
                    <div className="space-y-3 flex-1">
                      {/* Company Name */}
                      <h3 className="text-white font-bold text-lg leading-tight">
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

                      {/* Technologies */}
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Technologies</p>
                        <div className="flex flex-wrap gap-1">
                          {employer.technologies.slice(0, 2).map((tech, index) => (
                            <div key={index} className="text-xs border-blue-400/50 text-blue-400 bg-blue-400/5 border px-2 py-1 rounded">
                              {tech}
                            </div>
                          ))}
                          {employer.technologies.length > 2 && (
                            <div className="text-xs border-gray-500 text-gray-400 bg-gray-500/5 border px-2 py-1 rounded">
                              +{employer.technologies.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button - Always at bottom */}
                    <div className="pt-3 mt-auto">
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-lg border-0"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        View Opportunities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 3. Recent Activity and Other Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full min-w-0">
            
            {/* Recent Activity */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border-2 border-green-200/60 dark:border-green-400/30 hover:border-green-300/80 dark:hover:border-green-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 w-full min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Today's Summary */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center mb-4">
                  <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-green-600">{data.recentActivity.actionsToday}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Actions Today</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-yellow-600">{data.recentActivity.xpEarnedToday}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">XP Earned</div>
              </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Completed "Server Hardware Basics" lesson</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago • +50 XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Started "Network Infrastructure" course</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago • +25 XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Earned "First Week" badge</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday • +100 XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Applied to Data Center Technician job</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                    </div>
                  </div>
                </div>

                {/* View All Button */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
                    View All Activity
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
              </div>
            </CardContent>
          </Card>



          {/* My Submissions */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border-2 border-orange-200/60 dark:border-orange-400/30 hover:border-orange-300/80 dark:hover:border-orange-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 w-full min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                My Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                <div className="p-2 sm:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-orange-600">5</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
                </div>
                <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-green-600">1</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Offer</div>
                </div>
              </div>
              
              {/* Recent Submissions */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">TSMC Process Engineer</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Offer Extended • $95K</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Honeywell Avionics Tech</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Interview Complete • Pending</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Phoenix Data Center</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Technical Assessment • Due Jan 30</p>
                  </div>
                </div>
              </div>

              {/* View All Button */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  onClick={() => window.location.href = '/employers/submissions'}
                >
                  View All Submissions
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* 3. Badges, Achievements, and Referrals - 3 Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full min-w-0">
            
            {/* Badges */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border-2 border-orange-200/60 dark:border-orange-400/30 hover:border-orange-300/80 dark:hover:border-orange-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 w-full min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                  <div className="p-2 sm:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-orange-600">{data.certifications.earned}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Earned</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-blue-600">{data.certifications.inProgress}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">In Progress</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-400">{data.certifications.available}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
              </div>
                </div>
                
                <div className="p-3 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Next: {data.certifications.nextCertification}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${data.certifications.nextProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-orange-600 font-semibold">{data.certifications.nextProgress}%</span>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>

            {/* Achievements */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border-2 border-yellow-200/60 dark:border-yellow-400/30 hover:border-yellow-300/80 dark:hover:border-yellow-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 w-full min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-yellow-600" />
                  Achievements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {data.achievements.map((achievement) => (
                  <div key={achievement.id} className="relative">
                    <div className={cn(
                      "p-3 rounded-lg transition-all duration-300",
                      achievement.completed 
                        ? `bg-gradient-to-r ${achievement.color} text-white shadow-md` 
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1 rounded",
                          achievement.completed ? "bg-white/20" : "bg-white dark:bg-gray-600"
                        )}>
                          {achievement.icon === 'flame' && <Flame className="h-3 w-3" />}
                          {achievement.icon === 'award' && <Award className="h-3 w-3" />}
                          {achievement.icon === 'book' && <BookOpen className="h-3 w-3" />}
                          {achievement.icon === 'trophy' && <Trophy className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-semibold text-sm truncate">{achievement.title}</h3>
                            {achievement.level && (
                              <span className="text-xs px-1 py-0.5 rounded bg-white/20 flex-shrink-0">
                                L{achievement.level}
                              </span>
                            )}
                          </div>
                          <p className="text-xs opacity-90 truncate">{achievement.description}</p>
                          {!achievement.completed && (
                            <div className="mt-1">
                              <div className="w-full bg-white/30 rounded-full h-1">
                                <div 
                                  className="bg-white h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
                )}
              </div>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

            {/* Invite Friends (Referrals) */}
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg border border-green-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Users className="h-5 w-5" />
                  Referrals
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-400 text-sm">
                  +{data.inviteRewards.xpPerInvite} XP per invite
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                  <div className="p-2 sm:p-3 bg-green-200/50 dark:bg-green-800/30 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-300">{data.inviteRewards.successfulInvites}</div>
                    <div className="text-xs text-green-700 dark:text-green-400">Friends</div>
              </div>
                  <div className="p-2 sm:p-3 bg-green-200/50 dark:bg-green-800/30 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-300">{data.inviteRewards.totalXpEarned}</div>
                    <div className="text-xs text-green-700 dark:text-green-400">XP Earned</div>
              </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-green-800 dark:text-green-300">Referral Code:</label>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      value={data.inviteRewards.referralCode}
                      readOnly
                      className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
                    />
                    <Button 
                      onClick={copyReferralCode}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white px-2"
                    >
                      {copiedCode ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Invite Friends
                </Button>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invite Friends</h3>
              <p className="text-gray-600 dark:text-gray-400">Share your referral code and earn XP when friends join!</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600 mb-1">+{data.inviteRewards.xpPerInvite} XP</p>
                <p className="text-sm text-green-700 dark:text-green-400">per successful invite</p>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={`Join me on Upskill! Use code: ${data.inviteRewards.referralCode}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
                <Button onClick={copyReferralCode} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // Implement share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: 'Join me on Upskill!',
                        text: `Use my referral code: ${data.inviteRewards.referralCode}`,
                        url: 'https://upskill.com'
                      });
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 