'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Target,
  CheckCircle,
  Clock,
  Briefcase,
  MapPin,
  DollarSign,
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
  ChevronLeft,
  Lightbulb,
  Radio,
  MoreHorizontal,
  User,
  Settings
} from 'lucide-react';
import CourseCarousel from './CourseCarousel';
import { cn } from '@/lib/utils';

// Custom React icon component
const ReactIcon = ({ className }: { className?: string }) => (
  <div className={cn("w-6 h-6 rounded bg-blue-500 flex items-center justify-center", className)}>
    <span className="text-white text-xs font-bold">R</span>
  </div>
);

export default function DashboardContent() {
  const [currentCarouselCard, setCurrentCarouselCard] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(true);

  // Carousel data
  const carouselCards = [
    {
      id: 1,
      type: 'New Course',
      content: 'Advanced React Patterns & Performance',
      bgGradient: 'from-blue-500/90 to-indigo-600/90',
      icon: ReactIcon,
      iconColor: 'text-blue-100'
    },
    {
      id: 2,
      type: 'Achievement',
      content: 'You completed 5 courses this month!',
      bgGradient: 'from-green-500/90 to-emerald-600/90',
      icon: Award,
      iconColor: 'text-green-100'
    },
    {
      id: 3,
      type: 'Challenge',
      content: 'Join the 30-day coding challenge',
      bgGradient: 'from-purple-500/90 to-pink-600/90',
      icon: Target,
      iconColor: 'text-purple-100'
    },
    {
      id: 4,
      type: 'AI Assistant',
      content: 'Get personalized learning recommendations',
      bgGradient: 'from-orange-500/90 to-red-600/90',
      icon: Lightbulb,
      iconColor: 'text-orange-100'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (!isCarouselPaused) {
      const interval = setInterval(() => {
        setCurrentCarouselCard((prev) => (prev + 1) % carouselCards.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isCarouselPaused, carouselCards.length]);

  // Next steps data
  const nextSteps = [
    {
      icon: BookOpen,
      title: "Complete JavaScript Fundamentals",
      description: "2 lessons remaining",
      progress: 85,
      urgent: true
    },
    {
      icon: Users,
      title: "Update LinkedIn Profile",
      description: "Add new skills and certifications",
      progress: 0,
      urgent: false
    },
    {
      icon: Award,
      title: "Practice Coding Interview",
      description: "LeetCode daily challenge",
      progress: 60,
      urgent: true
    }
  ];



  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section with Enhanced Carousel */}
      <div className="relative">
        {/* Main Carousel Card */}
        <div 
          className="relative overflow-hidden rounded-2xl p-8 shadow-xl transition-all duration-500 group cursor-pointer min-h-[200px]"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
        >
          {carouselCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentCarouselCard 
                    ? 'opacity-100 translate-x-0' 
                    : index < currentCarouselCard 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-32`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-50"></div>
                  <div className="relative z-10 flex items-center h-full">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-sm`}>
                        <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                          {card.type}
                        </p>
                        <p className="text-sm font-semibold text-foreground mb-3 leading-tight">
                          {card.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Just now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Navigation Buttons */}
          <button
            onClick={() => setCurrentCarouselCard((prev) => (prev - 1 + carouselCards.length) % carouselCards.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-black transition-all duration-200 hover:scale-110"
            aria-label="Previous card"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          
          <button
            onClick={() => setCurrentCarouselCard((prev) => (prev + 1) % carouselCards.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-black transition-all duration-200 hover:scale-110"
            aria-label="Next card"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {carouselCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCarouselCard(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentCarouselCard 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Get things done faster</CardDescription>
                </div>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <button 
                  onClick={() => window.location.href = '/skills-demo'}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 group/btn"
                >
                  <Settings className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Skills Profile</span>
                </button>
                
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
            </CardContent>
          </Card>

          {/* Courses Section */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Featured Courses
                  </CardTitle>
                  <CardDescription>Recommended for your career path</CardDescription>
                </div>
                <button className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 group">
                  View All
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CourseCarousel />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Next Steps */}
        <div className="space-y-6">
          {/* Skills Profile Panel */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
               onClick={() => window.location.href = '/skills-demo'}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-50"></div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:rotate-12 transition-transform duration-300">
              <Settings className="h-12 w-12 text-cyan-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Settings className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Skills Profile</h3>
                  <p className="text-sm text-muted-foreground">Build your comprehensive skills profile</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Assessment Progress</span>
                    <span className="text-sm font-bold text-cyan-600">25%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">3 of 12 formal domains completed</p>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-black/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Skills Rated</span>
                  </div>
                  <span className="text-sm font-bold">18/60</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-black/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Profile Strength</span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">Intermediate</span>
                </div>
              </div>
              
              <button className="w-full mt-4 p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                Complete Assessment
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50"></div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:rotate-12 transition-transform duration-300">
              <TrendingUp className="h-12 w-12 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Learning Progress</h3>
                  <p className="text-sm text-muted-foreground">Your journey at a glance</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</span>
                  </div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
                
                <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In Progress</span>
                  </div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
                
                <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Certificates</span>
                  </div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
                
                <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rating</span>
                  </div>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Panel */}
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm truncate">{step.title}</h4>
                            {step.urgent && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                          {step.progress > 0 && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{step.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 