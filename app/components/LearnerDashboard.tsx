'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target,
  CheckCircle,
  Clock,
  Briefcase,
  MapPin,
  DollarSign,
  Star,
  ArrowRight,
  Upload,
  ExternalLink,
  ChevronRight,
  Shield,
  User,
  Award,
  AlertCircle,
  Building2,
  BookOpen,
  Play,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - in a real app, this would come from your backend
const mockLearnerData = {
  jobReadiness: {
    percentage: 68,
    targetRole: "Fiber Technician",
    completedTasks: 17,
    totalTasks: 25,
    nextTasks: [
      "Complete fiber splicing certification",
      "Upload hands-on project documentation",
      "Pass safety protocols exam"
    ]
  },
  nextAction: {
    id: "upload-project",
    title: "Upload hands-on project",
    description: "Submit documentation of your fiber installation project",
    type: "upload",
    estimatedTime: "15 minutes",
    priority: "high",
    icon: Upload
  },
  profileCompletion: {
    percentage: 76,
    missingField: "Work Authorization Status",
    completedSections: 8,
    totalSections: 10
  },
  featuredEmployer: {
    id: "verizon-fiber",
    companyName: "Verizon",
    logo: "/api/placeholder/60/60", // Placeholder - replace with actual logo
    jobTitle: "Fiber Optic Technician",
    location: "Multiple Locations",
    salary: "$45,000 - $65,000",
    matchPercentage: 82,
    canApply: false,
    blockingRequirement: "Complete Module 3: Advanced Fiber Techniques",
    benefits: ["Health Insurance", "401k Match", "Training Programs"]
  }
};

// Radial progress component
const RadialProgress = ({ percentage, size = 120, strokeWidth = 8 }: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number; 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted-foreground/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="0"
          strokeLinecap="round"
          className="text-green-500 transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{percentage}%</div>
          <div className="text-xs text-muted-foreground">Ready</div>
        </div>
      </div>
    </div>
  );
};

export default function LearnerDashboard() {
  const [currentEmployer, setCurrentEmployer] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { jobReadiness, nextAction, profileCompletion, featuredEmployer } = mockLearnerData;

  // Mobile detection using 900px breakpoint to match PersistentLayout
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Simulate daily rotation of featured employers (in real app, this would be server-side)
  useEffect(() => {
    const today = new Date().getDate();
    setCurrentEmployer(today % 3); // Rotate between 3 employers
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      
      {/* 1. Job-Readiness Progress (Hero Component) */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
        <div className={cn(
          "absolute opacity-10",
          isMobile ? "top-2 right-2" : "top-6 right-6"
        )}>
          <Target className={cn(
            "text-green-500",
            isMobile ? "h-12 w-12" : "h-24 w-24"
          )} />
        </div>
        <CardContent className={cn(
          "relative",
          isMobile ? "p-4" : "p-8"
        )}>
          <div className={cn(
            "flex items-center",
            isMobile ? "flex-col gap-4" : "flex-col lg:flex-row gap-8"
          )}>
            {/* Progress Circle */}
            <div className="flex-shrink-0">
              <RadialProgress 
                percentage={jobReadiness.percentage} 
                size={isMobile ? 100 : 140} 
                strokeWidth={isMobile ? 6 : 10} 
              />
            </div>
            
            {/* Content */}
            <div className={cn(
              "flex-1 text-center",
              !isMobile && "lg:text-left"
            )}>
              <h1 className={cn(
                "font-bold mb-2",
                isMobile ? "text-lg" : "text-3xl lg:text-4xl"
              )}>
                You're {jobReadiness.percentage}% ready for the {jobReadiness.targetRole} role
              </h1>
              <p className={cn(
                "text-muted-foreground mb-4",
                isMobile ? "text-sm" : "text-lg"
              )}>
                {jobReadiness.completedTasks} of {jobReadiness.totalTasks} requirements completed
              </p>
              <button className={cn(
                "inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg",
                isMobile ? "px-4 py-2 text-sm" : "px-6 py-3"
              )}>
                See what's left
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className={cn(
              "flex gap-3",
              isMobile ? "flex-row justify-center flex-wrap" : "flex-col min-w-[200px]"
            )}>
              <div className={cn(
                "flex items-center gap-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm",
                isMobile ? "p-2" : "p-3"
              )}>
                <CheckCircle className={cn(
                  "text-green-500",
                  isMobile ? "h-4 w-4" : "h-5 w-5"
                )} />
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm"
                )}>Skills Verified</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm",
                isMobile ? "p-2" : "p-3"
              )}>
                <Award className={cn(
                  "text-blue-500",
                  isMobile ? "h-4 w-4" : "h-5 w-5"
                )} />
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm"
                )}>Certifications Ready</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm",
                isMobile ? "p-2" : "p-3"
              )}>
                <Shield className={cn(
                  "text-purple-500",
                  isMobile ? "h-4 w-4" : "h-5 w-5"
                )} />
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm"
                )}>Background Clear</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equal-sized blocks for main dashboard components */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      )}>
        
        {/* 2. Single Next Action */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
          <div className={cn(
            "absolute opacity-10",
            isMobile ? "top-2 right-2" : "top-4 right-4"
          )}>
            <nextAction.icon className={cn(
              "text-blue-500",
              isMobile ? "h-8 w-8" : "h-12 w-12"
            )} />
          </div>
          <CardContent className={cn(
            "relative flex flex-col h-full",
            isMobile ? "p-3" : "p-6"
          )}>
            <div className="flex-1">
              <div className={cn(
                "flex items-center gap-2",
                isMobile ? "mb-2" : "mb-3"
              )}>
                <div className={cn(
                  "rounded-lg bg-blue-500/10",
                  isMobile ? "p-1" : "p-2"
                )}>
                  <nextAction.icon className={cn(
                    "text-blue-500",
                    isMobile ? "h-3 w-3" : "h-4 w-4"
                  )} />
                </div>
                <span className={cn(
                  "font-medium text-blue-600 uppercase tracking-wide",
                  isMobile ? "text-[10px]" : "text-xs"
                )}>
                  Next Action
                </span>
              </div>
              <h2 className={cn(
                "font-bold mb-2",
                isMobile ? "text-sm leading-tight" : "text-xl"
              )}>{nextAction.title}</h2>
              {!isMobile && (
                <p className="text-sm text-muted-foreground mb-4">{nextAction.description}</p>
              )}
              
              <div className={cn(
                "flex items-center gap-2 text-muted-foreground",
                isMobile ? "text-[10px] mb-3" : "text-xs gap-4 mb-6"
              )}>
                <div className="flex items-center gap-1">
                  <Clock className={cn(isMobile ? "h-2.5 w-2.5" : "h-3 w-3")} />
                  <span>{isMobile ? "15min" : nextAction.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className={cn(isMobile ? "h-2.5 w-2.5" : "h-3 w-3")} />
                  <span className="capitalize">{isMobile ? "High" : nextAction.priority + " priority"}</span>
                </div>
              </div>
            </div>

            <button className={cn(
              "w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2",
              isMobile ? "p-2 text-xs" : "p-3 text-sm"
            )}>
              <nextAction.icon className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
              <span>{isMobile ? "Upload" : nextAction.title}</span>
              <ArrowRight className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
            </button>
          </CardContent>
        </Card>

        {/* 3. Featured Employer Match */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <div className={cn(
            "absolute opacity-10",
            isMobile ? "top-2 right-2" : "top-4 right-4"
          )}>
            <Building2 className={cn(
              "text-purple-500",
              isMobile ? "h-8 w-8" : "h-12 w-12"
            )} />
          </div>
          <CardContent className={cn(
            "relative flex flex-col h-full",
            isMobile ? "p-3" : "p-6"
          )}>
            <div className="flex-1">
              <div className={cn(
                "flex items-center justify-between",
                isMobile ? "mb-2" : "mb-3"
              )}>
                <span className={cn(
                  "font-medium text-purple-600 uppercase tracking-wide",
                  isMobile ? "text-[10px]" : "text-xs"
                )}>
                  Featured Match
                </span>
                <div className={cn(
                  "flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-medium",
                  isMobile ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
                )}>
                  <span className={cn(
                    "bg-green-500 rounded-full",
                    isMobile ? "w-1.5 h-1.5" : "w-2 h-2"
                  )}></span>
                  {featuredEmployer.matchPercentage}% Match
                </div>
              </div>

              {/* Company Logo & Info */}
              <div className={cn(
                "flex items-center gap-3",
                isMobile ? "mb-2" : "mb-4"
              )}>
                <div className={cn(
                  "bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm",
                  isMobile ? "w-8 h-8" : "w-10 h-10"
                )}>
                  <Building2 className={cn(
                    "text-red-500",
                    isMobile ? "h-4 w-4" : "h-5 w-5"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-bold truncate",
                    isMobile ? "text-sm" : "text-lg"
                  )}>{featuredEmployer.companyName}</h3>
                  <p className={cn(
                    "text-muted-foreground truncate",
                    isMobile ? "text-xs" : "text-sm"
                  )}>{isMobile ? "Fiber Tech" : featuredEmployer.jobTitle}</p>
                </div>
              </div>

              {/* Job Details */}
              {!isMobile && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{featuredEmployer.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{featuredEmployer.salary}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              {featuredEmployer.canApply ? (
                <button className={cn(
                  "w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2",
                  isMobile ? "p-2 text-xs" : "p-3"
                )}>
                  <ExternalLink className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                  View Role
                </button>
              ) : (
                <button className={cn(
                  "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2",
                  isMobile ? "p-2 text-xs" : "p-3"
                )}>
                  <BookOpen className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                  <span className={cn(isMobile ? "text-xs" : "text-sm")}>
                    {isMobile ? "Finish Module 3" : "Finish Module 3 to Apply"}
                  </span>
                </button>
              )}

              {!featuredEmployer.canApply && !isMobile && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {featuredEmployer.blockingRequirement}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4. Profile Completion */}
        <Card className={cn(
          "relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full",
          isMobile ? "" : "md:col-span-2 lg:col-span-1"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
          <div className={cn(
            "absolute opacity-10",
            isMobile ? "top-2 right-2" : "top-4 right-4"
          )}>
            <User className={cn(
              "text-amber-500",
              isMobile ? "h-8 w-8" : "h-12 w-12"
            )} />
          </div>
          <CardContent className={cn(
            "relative flex flex-col h-full",
            isMobile ? "p-3" : "p-6"
          )}>
            <div className="flex-1">
              <div className={cn(
                "flex items-center justify-between",
                isMobile ? "mb-2" : "mb-3"
              )}>
                <span className={cn(
                  "font-medium text-amber-600 uppercase tracking-wide",
                  isMobile ? "text-[10px]" : "text-xs"
                )}>
                  Profile Completion
                </span>
                <span className={cn(
                  "font-bold text-amber-600",
                  isMobile ? "text-sm" : "text-lg"
                )}>
                  {profileCompletion.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className={cn(
                "w-full bg-muted rounded-full",
                isMobile ? "h-2 mb-2" : "h-3 mb-4"
              )}>
                <div 
                  className={cn(
                    "bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 ease-out",
                    isMobile ? "h-2" : "h-3"
                  )}
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>

              <p className={cn(
                "text-muted-foreground",
                isMobile ? "text-xs mb-2" : "text-sm mb-4"
              )}>
                {profileCompletion.completedSections} of {profileCompletion.totalSections} sections completed
              </p>

              {/* Missing Field Alert */}
              <div className={cn(
                "flex items-start gap-2 rounded-xl bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800",
                isMobile ? "p-2 mb-2" : "p-3 mb-4"
              )}>
                <AlertCircle className={cn(
                  "text-amber-600 flex-shrink-0 mt-0.5",
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-amber-800 dark:text-amber-200",
                    isMobile ? "text-xs leading-tight" : "text-sm"
                  )}>
                    Missing: {isMobile ? "Work Auth" : profileCompletion.missingField}
                  </p>
                  {!isMobile && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Complete this to unlock more employer matches
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button className={cn(
              "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 mt-auto",
              isMobile ? "p-2 text-xs" : "p-3"
            )}>
              <FileText className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
              {isMobile ? "Complete" : "Complete Profile"}
              <ChevronRight className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 