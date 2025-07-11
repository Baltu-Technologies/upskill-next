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
import { useTheme } from '../contexts/ThemeContext';

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
    name: 'Stream Data Centers',
    logo: '/media/organization_logo/stream_data_centers-fa2d930e-6990-4ac9-ae91-a6118f19be54.png',
    locations: ['Phoenix, AZ', 'Chicago, IL', 'Columbus, OH', 'Virginia Beach, VA'],
    industry: 'Data Centers & Cloud Infrastructure',
    size: '3,000+ employees',
    description: 'Leading hyperscale data center operator providing mission-critical infrastructure for cloud computing, enterprise, and government clients. Seeking Data Center Technicians for server deployment, maintenance, and operations.',
    salaryRange: '$55K - $95K',
    benefits: ['Health Insurance', 'Retirement Plan', '24/7 Operations Bonus', 'Technical Certifications'],
    technologies: ['Server Hardware', 'Network Infrastructure', 'Cooling Systems', 'Power Distribution'],
    industries: ['Data Centers', 'Cloud Infrastructure'],
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=300&fit=crop&crop=center',
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
    name: 'TEKsystems',
    logo: '/media/organization_logo/tek-systems.webp',
    locations: ['Scottsdale, AZ', 'Phoenix, AZ', 'Mesa, AZ'],
    industry: 'Broadband & Fiber Optics',
    size: '1,200+ employees',
    description: 'Leading provider of fiber optic network installation and telecommunications infrastructure services across the Southwest.',
    salaryRange: '$50K - $85K',
    benefits: ['Health Insurance', 'Retirement Plan', 'Vehicle Allowance', 'Safety Bonuses'],
    technologies: ['Fiber Optics', 'Network Testing', 'Cable Installation', '5G Infrastructure'],
    industries: ['Broadband', 'Fiber Optics'],
    image: '/media/peterbaltutech_A_massive_cutting_edge_data_center_that_shows__0e591871-e0a2-4fdd-8856-3e839b1c35ba_1.png',
    isHiring: true,
    featured: true
  },
  {
    id: 4,
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
    featured: false
  },
  {
    id: 5,
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
  const { isDark } = useTheme();

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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-success/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Top Profile Bar - Completely flush with window top */}
      <div className={`relative z-10 ${isDark ? 'bg-gradient-to-r from-black/95 via-primary/90 to-black/95' : 'bg-gradient-to-r from-slate-300/90 via-primary/90 to-slate-300/90'} shadow-2xl shadow-primary/20 -mx-0 xs:-mx-1 sm:-mx-2 md:-mx-4 lg:-mx-6 xl:-mx-0 -mt-0`}>
        {/* Glow effect behind the bar */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-1 xs:px-2 sm:px-4 md:px-6 lg:px-8 xl:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col items-center sm:items-start gap-4">
            {/* Avatar and Name Section */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-primary/50 shadow-lg shadow-primary/25 flex-shrink-0">
                <Image 
                  src={data.user.avatar} 
                  alt={data.user.name} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground drop-shadow-lg truncate">
                  {data.user.name}
                </h1>
                <p className="text-primary-foreground/80 text-sm">Member since {data.user.joinedDate}</p>
              </div>
            </div>
            
            {/* Gamification Stats - Always below profile */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-orange-500/25 backdrop-blur-sm">
                <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold text-sm sm:text-base">{data.stats.currentStreak}</span>
                <span className="text-xs opacity-90 hidden sm:inline">day streak</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-warning/90 to-warning/90 text-warning-foreground px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-warning/25 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold text-sm sm:text-base">{data.stats.totalXP}</span>
                <span className="text-xs opacity-90 hidden sm:inline">XP</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-accent/90 to-accent/90 text-accent-foreground px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-accent/25 backdrop-blur-sm">
                <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold text-sm sm:text-base">{data.certifications.earned}</span>
                <span className="text-xs opacity-90 hidden sm:inline">badges</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-success/90 to-success/90 text-success-foreground px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg shadow-success/25 backdrop-blur-sm">
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
        <div className="bg-gradient-to-br from-secondary to-secondary/50 px-4 md:px-6 py-8 rounded-2xl mb-6">
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
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {data.user.name}
                </h1>
                <p className="text-muted-foreground">Joined {data.user.joinedDate}</p>
              </div>
            </div>
            
            <div className="flex-1 lg:ml-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl p-4 text-center shadow-sm">
                  <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{data.stats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                
                <div className="bg-card rounded-xl p-4 text-center shadow-sm">
                  <Zap className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{data.stats.totalXP}</div>
                  <div className="text-xs text-muted-foreground">Total XP</div>
                </div>
                
                <div className="bg-card rounded-xl p-4 text-center shadow-sm">
                  <Crown className="h-6 w-6 text-accent mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{data.stats.crowns}</div>
                  <div className="text-xs text-muted-foreground">Crowns</div>
                </div>
                
                <div className="bg-card rounded-xl p-4 text-center shadow-sm">
                  <Trophy className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">#{data.stats.leaguePosition}</div>
                  <div className="text-xs text-muted-foreground">Bronze League</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        */}

        {/* VARIATION 3: Sidebar Style (Commented out - uncomment to try) */}
        {/* 
        <div className="flex items-center justify-between bg-muted/50 px-6 py-4 rounded-xl border border-border">
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
              <h1 className="text-xl font-semibold text-foreground">
                {data.user.name}
              </h1>
              <p className="text-muted-foreground text-sm">Level 12 • {data.user.joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{data.stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">{data.stats.totalXP}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">{data.stats.crowns}</div>
              <div className="text-xs text-muted-foreground">Crowns</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">#{data.stats.leaguePosition}</div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
          </div>
        </div>
        */}

        {/* Main Content - Reorganized by Priority */}
        <div className="space-y-6">
          
          {/* 1. Career Pathway - MOST IMPORTANT (Full Width) */}
          <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 w-full min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                My Career Pathway
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative p-6 rounded-lg border border-primary/20 overflow-hidden">
                {/* Data Center Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: `url('/media/peterbaltutech_A_massive_cutting_edge_data_center_that_shows__0e591871-e0a2-4fdd-8856-3e839b1c35ba_1.png')`
                  }}
                ></div>
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-primary/70 to-primary/80"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20"></div>
                
                {/* Content with improved contrast */}
                <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:items-center md:text-left md:gap-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="font-bold text-primary-foreground text-xl md:text-2xl mb-2">Data Center Technician</h3>
                    <p className="text-primary-foreground/80 text-sm md:text-base mb-4">Server Hardware & Infrastructure Track</p>
                    
                    {/* Progress info - responsive layout */}
                    <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-primary-foreground">68%</div>
                        <span className="text-sm text-primary-foreground/80">pathway complete</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                        <Clock className="h-4 w-4" />
                        <span>82/120 hours</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Continue button - responsive positioning */}
                  <div className="flex-shrink-0">
                    <Button className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm px-6 py-3">
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
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                  <ChevronRight className={cn("h-4 w-4 transition-transform", showCourses && "rotate-90")} />
                </Button>
              </div>

              {/* Accordion Courses List */}
              {showCourses && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-medium text-foreground mb-3">Pathway Courses</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">Data Center Fundamentals</p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">24 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-success/20 rounded-full h-2">
                            <div className="bg-success h-2 rounded-full w-full" />
                          </div>
                          <span className="text-sm font-semibold text-success">100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-info/10 rounded-lg border border-info/20">
                      <Clock className="h-5 w-5 text-info" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">Server Hardware & Maintenance</p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">32 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-info/20 rounded-full h-2">
                            <div className="bg-info h-2 rounded-full" style={{ width: '75%' }} />
                          </div>
                          <span className="text-sm font-semibold text-info">75%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">Network Infrastructure</p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">28 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-muted/50 rounded-full h-2">
                            <div className="bg-muted-foreground h-2 rounded-full" style={{ width: '0%' }} />
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">0%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">Power & Cooling Systems</p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">20 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-muted/50 rounded-full h-2">
                            <div className="bg-muted-foreground h-2 rounded-full" style={{ width: '0%' }} />
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">0%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">Safety & Compliance</p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">16 hours</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-muted/50 rounded-full h-2">
                            <div className="bg-muted-foreground h-2 rounded-full" style={{ width: '0%' }} />
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">0%</span>
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
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  My Job Opportunities
                </h2>
                <p className="text-muted-foreground text-lg">
                  Discover career opportunities with our industry partners
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Employers
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobOpportunityEmployers.map((employer) => (
                <Card key={employer.id} className="group cursor-pointer overflow-hidden border-2 border-border bg-card/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    
                    {/* Featured Badge */}
                    {employer.featured && (
                      <div className="absolute top-3 left-3">
                        <div className={`${isDark ? 'bg-yellow-600 text-yellow-100' : 'bg-yellow-500 text-yellow-900'} font-medium px-2 py-1 rounded text-xs shadow-lg`}>
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Hiring Status */}
                    {employer.isHiring && (
                      <div className="absolute top-3 right-3">
                        <div className={`${isDark ? 'bg-green-600 text-green-100' : 'bg-green-500 text-green-900'} font-medium px-2 py-1 rounded text-xs shadow-lg`}>
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
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-background/50 hover:bg-background/70 transition-all duration-200 group/heart"
                    >
                      <Heart 
                        className={`h-4 w-4 transition-all duration-200 ${
                          favoriteEmployers.includes(employer.id)
                            ? 'fill-destructive text-destructive scale-110'
                            : 'text-foreground group-hover/heart:text-destructive'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Company Logo - Overlapping image and content */}
                  <div className="relative -mt-6 ml-4 z-10">
                    <div className="flex items-end gap-3">
                      <div className="relative w-24 h-12 bg-background rounded-lg p-2 flex items-center justify-center shadow-lg border border-border">
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
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
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
                      <h3 className="text-foreground font-bold text-lg leading-tight">
                        {employer.name}
                      </h3>

                      {/* Company Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {employer.description}
                      </p>

                      {/* Key Stats Row */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {employer.size}
                        </div>
                        <div className="text-success-foreground font-semibold">
                          {employer.salaryRange}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Technologies</p>
                        <div className="flex flex-wrap gap-1">
                          {employer.technologies.slice(0, 2).map((tech, index) => (
                            <div key={index} className="text-xs border-primary/50 text-primary bg-primary/5 border px-2 py-1 rounded">
                              {tech}
                            </div>
                          ))}
                          {employer.technologies.length > 2 && (
                            <div className="text-xs border-muted-foreground text-muted-foreground bg-muted-foreground/5 border px-2 py-1 rounded">
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
                        className={`w-full ${isDark ? 'bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary/70 hover:to-accent/70' : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'} text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-lg border-0`}
                        onClick={() => {
                          if (employer.name === 'Honeywell Aerospace') {
                            window.location.href = '/employers/honeywell';
                          }
                        }}
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Learn More
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
            <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-2 border-success/20 hover:border-success/40 transition-all duration-300 hover:shadow-2xl hover:shadow-success/10 w-full min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-success" />
                  Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Today's Summary */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center mb-4">
                  <div className="p-2 sm:p-3 bg-success/10 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-success">{data.recentActivity.actionsToday}</div>
                    <div className="text-xs text-muted-foreground">Actions Today</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-warning/10 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-warning">{data.recentActivity.xpEarnedToday}</div>
                    <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-success rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Completed "Server Hardware Basics" lesson</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • +50 XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Started "Network Infrastructure" course</p>
                      <p className="text-xs text-muted-foreground">5 hours ago • +25 XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Earned "First Week" badge</p>
                      <p className="text-xs text-muted-foreground">Yesterday • +100 XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Applied to Data Center Technician job</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>

                {/* View All Button */}
                <div className="pt-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-success hover:text-success/90 hover:bg-success/10">
                    View All Activity
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
              </div>
            </CardContent>
          </Card>



          {/* My Submissions */}
          <Card className={`bg-card/90 backdrop-blur-sm shadow-xl border-2 ${isDark ? 'border-orange-400/30 hover:border-orange-300/50' : 'border-orange-200/60 hover:border-orange-300/80'} transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 w-full min-w-0`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                My Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                <div className={`p-2 sm:p-3 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'} rounded-lg`}>
                  <div className="text-lg sm:text-xl font-bold text-orange-600">5</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="p-2 sm:p-3 bg-success/10 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-success">1</div>
                  <div className="text-xs text-muted-foreground">Offer</div>
                </div>
              </div>
              
              {/* Recent Submissions */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">TSMC Process Engineer</p>
                    <p className="text-xs text-muted-foreground">Offer Extended • $95K</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">Honeywell Avionics Tech</p>
                    <p className="text-xs text-muted-foreground">Interview Complete • Pending</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-warning rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">Phoenix Data Center</p>
                    <p className="text-xs text-muted-foreground">Technical Assessment • Due Jan 30</p>
                  </div>
                </div>
              </div>

              {/* View All Button */}
              <div className="pt-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full text-orange-600 hover:text-orange-700 ${isDark ? 'hover:bg-orange-900/20' : 'hover:bg-orange-50'}`}
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
            <Card className={`bg-card/90 backdrop-blur-sm shadow-xl border-2 ${isDark ? 'border-orange-400/30 hover:border-orange-300/50' : 'border-orange-200/60 hover:border-orange-300/80'} transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 w-full min-w-0`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                  <div className={`p-2 sm:p-3 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'} rounded-lg`}>
                    <div className="text-lg sm:text-xl font-bold text-orange-600">{data.certifications.earned}</div>
                    <div className="text-xs text-muted-foreground">Earned</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-primary">4</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                    <div className={`text-lg sm:text-xl font-bold ${isDark ? 'text-muted-foreground/40' : 'text-muted-foreground'}`}>{data.certifications.available}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
              </div>
                </div>
                
                <div className={`p-3 border ${isDark ? 'border-orange-800' : 'border-orange-200'} rounded-lg`}>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-2">Next: {data.certifications.nextCertification}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 bg-muted/50 rounded-full h-2">
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
            <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-2 border-warning/20 hover:border-warning/40 transition-all duration-300 hover:shadow-2xl hover:shadow-warning/10 w-full min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-warning" />
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
                        : isDark 
                          ? "bg-muted-foreground/10 hover:bg-muted-foreground/20"
                          : "bg-muted/50 hover:bg-muted/70"
                    )}>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1 rounded",
                          achievement.completed 
                            ? "bg-white/20" 
                            : isDark 
                              ? "bg-muted-foreground" 
                              : "bg-white"
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
            <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-2 border-success/20 hover:border-success/40 transition-all duration-300 hover:shadow-2xl hover:shadow-success/10 w-full min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-success" />
                  Referrals
                </CardTitle>
                <CardDescription className="text-sm">
                  +{data.inviteRewards.xpPerInvite} XP per invite
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                  <div className="p-2 sm:p-3 bg-success/10 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-success">{data.inviteRewards.successfulInvites}</div>
                    <div className="text-xs text-muted-foreground">Friends</div>
              </div>
                  <div className="p-2 sm:p-3 bg-success/10 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-success">{data.inviteRewards.totalXpEarned}</div>
                    <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-success">Referral Code:</label>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      value={data.inviteRewards.referralCode}
                      readOnly
                      className={`flex-1 px-2 py-1 ${isDark ? 'bg-muted-foreground' : 'bg-muted/50'} border border-muted-foreground rounded text-xs`}
                    />
                    <Button 
                      onClick={copyReferralCode}
                      size="sm"
                      className="bg-success hover:bg-success/90 text-white px-2"
                    >
                      {copiedCode ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-success hover:bg-success/90 text-white text-sm py-2"
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
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-emerald rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Invite Friends</h3>
              <p className="text-muted-foreground">Share your referral code and earn XP when friends join!</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-success/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-success mb-1">+{data.inviteRewards.xpPerInvite} XP</p>
                <p className="text-sm text-success/90">per successful invite</p>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={`Join me on Upskill! Use code: ${data.inviteRewards.referralCode}`}
                  readOnly
                  className={`flex-1 px-3 py-2 ${isDark ? 'bg-muted-foreground' : 'bg-muted/50'} border border-muted-foreground rounded-lg text-sm`}
                />
                <Button onClick={copyReferralCode} size="sm" className="bg-success hover:bg-success/90 text-white">
                  {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-success hover:bg-success/90 text-white"
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