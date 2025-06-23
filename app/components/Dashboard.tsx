'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  Monitor,
  Languages,
  X,
  Target,
  CheckCircle,
  Clock,
  Briefcase,
  MapPin,
  DollarSign,
  Filter,
  Star,
  MessageCircle,
  Calendar,
  Award,
  ThumbsUp,
  Eye,
  ArrowRight,
  Play,
  Upload,
  Video,
  ExternalLink,
  ChevronRight,
  Shield,
  Flame,
  Gamepad2,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import CourseCarousel from './CourseCarousel';
import CollapsibleSidebar from './CollapsibleSidebar';
import MobileBottomNav from './MobileBottomNav';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showStatsPanel, setShowStatsPanel] = useState(true);

  // Theme toggle function
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Language toggle function
  const toggleLanguage = () => {
    const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  // Get current language flag
  const getLanguageFlag = () => {
    switch (language) {
      case 'Spanish': return '🇪🇸';
      case 'French': return '🇫🇷';
      case 'German': return '🇩🇪';
      case 'Portuguese': return '🇵🇹';
      default: return '🇺🇸';
    }
  };
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close popups when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close search on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Mock data for job readiness
  const profileCompleteness = 75;
  const matchedJobs = 3;
  const applicationsInFlight = 2;
  const interviewsScheduled = 1;
  const completedModules = 5;
  const requiredModules = 8;
  const hoursToNextMatch = 2.5;
  const jobMatchProgress = 72; // Progress toward next job match

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const featuredJobs = [
    {
      id: 1,
      title: "CNC Machinist",
      company: "Honeywell Aerospace",
      location: "Phoenix, AZ",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Honeywell-Logo.png",
      salary: "$52k - $68k",
      match: "94%"
    },
    {
      id: 2,
      title: "Data Center Structured Cable Technician",
      company: "TEKsystems",
      location: "Dallas, TX",
      logo: "https://www.teksystems.com/-/media/teksystems/images/logos/tek-systems-logo.ashx",
      salary: "$45k - $62k", 
      match: "89%"
    },
    {
      id: 3,
      title: "Precision Inspector",
      company: "Benchmark Electronics",
      location: "Austin, TX",
      logo: "https://www.bench.com/media/logo-benchmark-electronics.png",
      salary: "$48k - $65k",
      match: "87%"
    },
    {
      id: 4,
      title: "Heavy Assembly Technician",
      company: "Integra",
      location: "Nashville, TN",
      logo: "https://www.integraoptics.com/images/integra-logo.png",
      salary: "$42k - $58k",
      match: "85%"
    }
  ];

  const recentAchievements = [
    { badge: "Advanced Safety Certified", icon: "Shield", date: "2 days ago" },
    { badge: "Customer Service Excellence", icon: "Star", date: "1 week ago" },
    { badge: "Technical Troubleshooting", icon: "Settings", date: "2 weeks ago" }
  ];

  // Gamification data
  const currentXP = 1825;
  const currentLevel = 3;
  const levelName = "Industry Explorer";
  const levelIcon = TrendingUp;
  const xpToNextLevel = 2000;
  const xpProgress = 650;
  const learningStreak = 15;
  const dailyXPGoal = 200;
  const todayXP = 125;
  
  const recentBadges = [
    { id: 1, icon: Shield, name: "Safety Expert", earned: "2 days ago" },
    { id: 2, icon: Star, name: "5-Star Service", earned: "1 week ago" },
    { id: 3, icon: Settings, name: "Tech Pro", earned: "2 weeks ago" },
    { id: 4, icon: BookOpen, name: "Knowledge Hunter", earned: "3 weeks ago" },
    { id: 5, icon: Zap, name: "Problem Solver", earned: "1 month ago" },
    { id: 6, icon: Target, name: "Goal Crusher", earned: "1 month ago" }
  ];

  const xpActivities = [
    { task: "Finish Microlesson 5", xp: 50, icon: Play },
    { task: "Post in Course Forum", xp: 25, icon: MessageCircle },
    { task: "Try Today's Mini-Game", xp: 25, icon: Target }
  ];

  const nextSteps = [
    {
      type: "learning",
      title: "Resume: Safety Module – Microlesson 4 of 6",
      progress: 67,
      timeLeft: "15 min",
      icon: Play
    },
    {
      type: "profile",
      title: "Upload one reference letter",
      description: "Unlock 2 more job matches",
      icon: Upload
    },
    {
      type: "profile", 
      title: "Record 30-sec video intro",
      description: "Stand out to employers",
      icon: Video
    }
  ];

  return (
    <div className="sidebar-layout">
      {/* Desktop Sidebar Only - Hidden on Mobile/Tablet */}
      <div className="hidden lg:block">
        <CollapsibleSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className={cn("sidebar-content", isSidebarCollapsed && "collapsed")}>
        {/* Header Bar */}
        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-200/95 via-slate-100/95 to-slate-200/95 dark:from-[hsl(222,84%,8%)] dark:via-[hsl(222,84%,6%)] dark:to-[hsl(222,84%,8%)] backdrop-blur-xl border-b border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30 shadow-sm">
          <div className="sidebar-aware-container">
            <div className="flex items-center justify-between py-4">
              {/* Left: Greeting Only */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-[hsl(210,40%,98%)]">
                    {getGreeting()}, {user?.signInDetails?.loginId?.split('@')[0] || 'Learner'}!
                  </h1>
                </div>
              </div>

              {/* Right: Stats Dashboard with Collapse Toggle */}
              <div className="flex items-center gap-4">
                {/* Expandable Stats Display - Desktop Only */}
                {showStatsPanel && (
                  <div className="hidden lg:flex items-center gap-6 animate-in slide-in-from-right-4 duration-300">
                    {/* Streak */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] backdrop-blur-sm">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center">
                        <Flame className="h-3 w-3 text-orange-600" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-600">{learningStreak}</div>
                        <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/70">Streak</div>
                      </div>
                    </div>

                    {/* This Week */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] backdrop-blur-sm">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">8.5h</div>
                        <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/70">This Week</div>
                      </div>
                    </div>

                    {/* Total XP */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] backdrop-blur-sm">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-purple-600" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-purple-600">{currentXP.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/70">Total XP</div>
                      </div>
                    </div>

                    {/* Weekly Goal Progress */}
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] backdrop-blur-sm">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Target className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/70">Weekly Goal</div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-300/60 dark:bg-[hsl(222,84%,15%)] rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: '75%' }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-green-600">75%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile/Tablet Stats (compact) - show on mobile and tablet */}
                <div className="lg:hidden flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,12%)]">
                    <Flame className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-bold text-orange-600">{learningStreak}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,12%)]">
                    <Zap className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-bold text-purple-600">{Math.floor(currentXP/1000)}k</span>
                  </div>
                </div>

                {/* Gamification Toggle Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 hover:text-[hsl(217,91%,60%)] dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)] transition-all duration-300 hover:scale-105 group"
                  onClick={() => setShowStatsPanel(!showStatsPanel)}
                >
                  <Gamepad2 className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[360deg]" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with proper overflow handling */}
        <main className="sidebar-main">
          <div className="max-w-none space-y-8">
            {/* Welcome Bar */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-cyan-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 opacity-50"></div>
              <div className="absolute top-4 left-4 opacity-20 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-cyan-500" />
              </div>
              
              <div className="relative z-10">
                {/* Top Row: Greeting and Quick Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {getGreeting()}, {user?.signInDetails?.loginId?.split('@')[0] || 'Learner'}!
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-lg font-semibold text-foreground">
                      You're <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{jobMatchProgress}%</span> toward your next job match
                    </div>
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-sm relative"
                        style={{ width: `${jobMatchProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong className="text-green-600">{100 - jobMatchProgress}%</strong> to unlock premium opportunities
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 group/btn">
                    <Play className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Continue Learning</span>
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 group/btn">
                    <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
                    <span className="font-medium">View Matches</span>
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 group/btn">
                    <Target className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Today's Challenge</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses, skills or employers..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 hover:bg-white dark:hover:bg-black/60"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <button className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white hover:shadow-md transition-all duration-200 hover:scale-105">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Row: Job Readiness + Featured Jobs */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column: Job Readiness Snapshot + Next Steps */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Readiness Snapshot */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/30 dark:via-blue-950/30 dark:to-purple-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50"></div>
                  <div className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-12 w-12 text-emerald-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Job Readiness Snapshot</h3>
                        <p className="text-sm text-muted-foreground">How close are you to getting hired?</p>
                      </div>
                    </div>
                    
                    {/* Profile Completeness */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Profile Completeness</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{profileCompleteness}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${profileCompleteness}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-primary">Add 2 more projects to hit 80%</strong> and unlock premium matches
                      </p>
                    </div>
                    
                    {/* Matched Opportunities */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">New Job Matches</div>
                        <div className="text-2xl font-bold text-emerald-600">{matchedJobs} qualified positions</div>
                      </div>
                      <Target className="h-10 w-10 text-emerald-600" />
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-primary to-accent text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Matches
                      </button>
                      <button className="flex-1 bg-white/80 dark:bg-black/40 backdrop-blur-sm text-foreground px-4 py-3 rounded-xl font-medium hover:bg-white dark:hover:bg-black/60 transition-all duration-200 flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Next Steps Toward Hire */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 opacity-50"></div>
                  <div className="absolute top-4 right-4 opacity-20 group-hover:rotate-12 transition-transform duration-300">
                    <Target className="h-12 w-12 text-orange-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-orange-500/10">
                        <Target className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Next Steps Toward Hire</h3>
                        <p className="text-sm text-muted-foreground">Prioritized actions to move you closer to an offer</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {nextSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div key={index} className="group/item p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 cursor-pointer hover:scale-102">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 group-hover/item:from-orange-500/30 group-hover/item:to-pink-500/30 transition-all duration-200">
                                <Icon className="h-5 w-5 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{step.title}</p>
                                {step.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                                )}
                                {step.progress && (
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                      <span className="text-orange-600 font-medium">{step.progress}% complete</span>
                                      <span className="text-muted-foreground">{step.timeLeft} left</span>
                                    </div>
                                    <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${step.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/item:text-orange-500 transition-colors duration-200" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Applications in Flight */}
                    <div className="mt-6 space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                        Applications in Flight
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-blue-700 dark:text-blue-300">{applicationsInFlight}</div>
                              <div className="text-sm text-muted-foreground">Pending</div>
                            </div>
                            <Clock className="h-6 w-6 text-blue-500" />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-green-700 dark:text-green-300">{interviewsScheduled}</div>
                              <div className="text-sm text-muted-foreground">Interview</div>
                            </div>
                            <Calendar className="h-6 w-6 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Job Matches */}
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50"></div>
                  <div className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-12 w-12 text-blue-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-blue-500/10">
                        <Briefcase className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Featured Job Matches</h3>
                        <p className="text-sm text-muted-foreground">Personalized roles just for you</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {featuredJobs.map((job) => (
                        <div key={job.id} className="group/job p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 cursor-pointer hover:scale-102">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white p-2 shadow-sm group-hover/job:scale-110 transition-transform duration-200 flex items-center justify-center">
                              <img 
                                src={job.logo} 
                                alt={`${job.company} logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">' + job.company.charAt(0) + '</div>';
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-foreground truncate">{job.title}</h4>
                                  <p className="text-sm text-muted-foreground">{job.company}</p>
                                </div>
                                <span className="text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                                  {job.match} match
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3 text-blue-500" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <DollarSign className="h-3 w-3 text-green-500" />
                                  <span className="font-medium text-green-600 dark:text-green-400">{job.salary}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                        See All Matches
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        <span>Filter by industry, location, salary</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Learning Progress + Achievements + Community */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Learning Progress Toward Hire */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-50"></div>
                <div className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-12 w-12 text-green-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Learning Progress</h3>
                      <p className="text-sm text-muted-foreground">Skills translate to opportunities</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">Broadband Technician Path</span>
                      <span className="text-sm bg-white/60 dark:bg-black/20 px-2 py-1 rounded-full font-medium">{completedModules}/{requiredModules}</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${(completedModules / requiredModules) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong className="text-green-600">{requiredModules - completedModules} modules</strong> to unlock next match tier
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                      Recent Skill Badges
                    </h4>
                    {recentAchievements.slice(0, 2).map((achievement, index) => {
                      const IconComponent = achievement.icon === 'Shield' ? Shield :
                                          achievement.icon === 'Star' ? Star :
                                          Settings;
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="flex-1 font-medium text-foreground">{achievement.badge}</span>
                          <span className="text-muted-foreground text-xs">{achievement.date}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <span className="font-semibold text-foreground">Time to Goal</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-orange-600 text-lg">{hoursToNextMatch} hours</strong> of coursework to unlock next match
                    </p>
                  </div>
                </div>
              </div>

              {/* Gamification Panel: My Achievements */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-50"></div>
                <div className="absolute top-4 right-4 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  <Gamepad2 className="h-12 w-12 text-violet-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-violet-500/10">
                      <Award className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">My Achievements</h3>
                      <p className="text-sm text-muted-foreground">Level up your career journey</p>
                    </div>
                  </div>
                  
                  {/* XP and Level Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        {currentXP.toLocaleString()} XP
                      </div>
                      <div className="text-xs text-muted-foreground">Points Earned</div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Level {currentLevel}</div>
                        <div className="text-xs text-muted-foreground">{levelName}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* XP Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
                      <span className="font-medium">{xpProgress} / {xpToNextLevel} XP</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 h-3 rounded-full transition-all duration-500 shadow-sm relative"
                          style={{ width: `${(xpProgress / xpToNextLevel) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      {/* Daily Goal Marker */}
                      <div 
                        className="absolute top-0 w-1 h-3 bg-orange-400 rounded-full"
                        style={{ left: `${Math.min((todayXP / dailyXPGoal) * 100, 100)}%` }}
                        title={`Daily Goal: ${todayXP}/${dailyXPGoal} XP`}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong className="text-violet-600">{xpToNextLevel - xpProgress} XP</strong> to unlock Level {currentLevel + 1}
                    </p>
                  </div>
                  
                  {/* Learning Streak */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm mb-4">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center">
                      <Flame className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-semibold text-foreground">{learningStreak}-day Learning Streak</span>
                    <div className="ml-auto text-xs bg-white/60 dark:bg-black/20 px-2 py-1 rounded-full">Hot!</div>
                  </div>
                  
                  {/* Badges Grid */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                      Recent Badges
                    </h4>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {recentBadges.slice(0, 4).map((badge) => {
                        const IconComponent = badge.icon;
                        return (
                          <div 
                            key={badge.id} 
                            className="aspect-square p-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 cursor-pointer hover:scale-110 flex items-center justify-center group/badge"
                            title={`${badge.name} - ${badge.earned}`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover/badge:scale-110 transition-transform duration-200">
                              <IconComponent className="h-4 w-4 text-violet-600" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200 font-medium">
                      +{recentBadges.length - 4} more badges
                    </button>
                  </div>
                  
                  {/* Earn XP Section */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                      Earn +100 XP by:
                    </h4>
                    {xpActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 cursor-pointer group/xp">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                            <Icon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground">{activity.task}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-green-600">+{activity.xp} XP</span>
                            <button className="px-2 py-1 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all duration-200 group-hover/xp:scale-105">
                              Go!
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Community & Mentorship */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50"></div>
                <div className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-12 w-12 text-purple-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-purple-500/10">
                      <MessageCircle className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Community & Support</h3>
                      <p className="text-sm text-muted-foreground">Connect and grow together</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Connect with a Mentor
                    </button>
                    <p className="text-xs text-muted-foreground text-center mt-2">Schedule a 15-min career chat</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                      Active Discussions
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 cursor-pointer group/item">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground flex-1">"Best interview tips for tech roles"</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/item:text-purple-500 transition-colors duration-200" />
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 cursor-pointer group/item">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <Settings className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground flex-1">"Troubleshooting network issues"</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/item:text-purple-500 transition-colors duration-200" />
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-200 cursor-pointer group/item">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground flex-1">"Study group for Safety Cert"</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/item:text-purple-500 transition-colors duration-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-foreground">Study Buddies</span>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      2 peers working on similar goals
                    </p>
                    <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 flex items-center gap-1">
                      Join study session
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
} 