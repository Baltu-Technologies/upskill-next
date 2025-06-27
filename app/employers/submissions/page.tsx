'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Video, 
  FileText, 
  Users, 
  Calendar, 
  Trophy, 
  Search, 
  Filter,
  ArrowRight,
  MapPin,
  Building2,
  Star,
  AlertTriangle,
  RefreshCw,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  DollarSign,
  Shield,
  FileCheck,
  UserCheck,
  Handshake,
  X,
  Archive,
  TrendingUp,
  Calendar as CalendarIcon,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type ApplicationStatus = 
  | 'submitted'
  | 'reviewed' 
  | 'phone_screening'
  | 'technical_assessment'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'reference_check'
  | 'background_check'
  | 'offer_extended'
  | 'offer_accepted'
  | 'offer_declined'
  | 'rejected'
  | 'withdrawn';

interface RejectionFeedback {
  reason: string;
  details: string;
  suggestions?: string[];
  stage: string;
}

interface ApplicationSubmission {
  id: string;
  jobTitle: string;
  company: string;
  logo: string;
  location: string;
  industry: string;
  appliedDate: Date;
  status: ApplicationStatus;
  lastUpdated: Date;
  salaryRange: string;
  nextSteps?: string;
  interviewDate?: Date;
  rejectionFeedback?: RejectionFeedback;
  offerDetails?: {
    salary: string;
    benefits: string[];
    startDate: Date;
    deadline: Date;
  };
  stages: {
    name: string;
    status: 'pending' | 'completed' | 'current' | 'skipped';
    completedDate?: Date;
    notes?: string;
  }[];
  employerRating: number;
  matchScore?: number;
}

// Mock submission data with various states and feedback
const mockSubmissions: ApplicationSubmission[] = [
  {
    id: '1',
    jobTitle: 'Semiconductor Process Engineer',
    company: 'Taiwan Semiconductor Manufacturing (TSMC)',
    logo: '/media/organization_logo/Tsmc.svg.png',
    location: 'Phoenix, AZ',
    industry: 'Semiconductor & Microelectronics',
    appliedDate: new Date('2024-01-15'),
    status: 'offer_extended',
    lastUpdated: new Date('2024-01-28'),
    salaryRange: '$85K - $105K',
    nextSteps: 'Review offer package and respond by February 5th',
    employerRating: 4.7,
    matchScore: 92,
    offerDetails: {
      salary: '$95,000 + $10K signing bonus',
      benefits: ['Health Insurance', 'Retirement Plan', 'Stock Options', 'Relocation Assistance'],
      startDate: new Date('2024-02-15'),
      deadline: new Date('2024-02-05')
    },
    stages: [
      { name: 'Application Submitted', status: 'completed', completedDate: new Date('2024-01-15') },
      { name: 'Application Reviewed', status: 'completed', completedDate: new Date('2024-01-18') },
      { name: 'Phone Screening', status: 'completed', completedDate: new Date('2024-01-22') },
      { name: 'Technical Assessment', status: 'completed', completedDate: new Date('2024-01-25') },
      { name: 'Final Interview', status: 'completed', completedDate: new Date('2024-01-27') },
      { name: 'Reference Check', status: 'completed', completedDate: new Date('2024-01-28') },
      { name: 'Offer Extended', status: 'current' }
    ]
  },
  {
    id: '2',
    jobTitle: 'Avionics Technician',
    company: 'Honeywell Aerospace',
    logo: '/media/organization_logo/honeywell-aerospace.jpg',
    location: 'Tempe, AZ',
    industry: 'Aerospace & Aviation Technologies',
    appliedDate: new Date('2024-01-10'),
    status: 'interview_completed',
    lastUpdated: new Date('2024-01-25'),
    salaryRange: '$70K - $85K',
    nextSteps: 'Waiting for final decision - expected by January 30th',
    employerRating: 4.5,
    matchScore: 88,
    stages: [
      { name: 'Application Submitted', status: 'completed', completedDate: new Date('2024-01-10') },
      { name: 'Application Reviewed', status: 'completed', completedDate: new Date('2024-01-12') },
      { name: 'Phone Screening', status: 'completed', completedDate: new Date('2024-01-18') },
      { name: 'Technical Interview', status: 'completed', completedDate: new Date('2024-01-25') },
      { name: 'Reference Check', status: 'current' }
    ]
  },
  {
    id: '3',
    jobTitle: 'Data Center Technician',
    company: 'Phoenix Data Center Solutions',
    logo: '🏢',
    location: 'Phoenix, AZ',
    industry: 'Data Centers',
    appliedDate: new Date('2024-01-20'),
    status: 'technical_assessment',
    lastUpdated: new Date('2024-01-26'),
    salaryRange: '$55K - $70K',
    nextSteps: 'Complete online technical assessment by January 30th',
    employerRating: 4.2,
    matchScore: 75,
    stages: [
      { name: 'Application Submitted', status: 'completed', completedDate: new Date('2024-01-20') },
      { name: 'Application Reviewed', status: 'completed', completedDate: new Date('2024-01-22') },
      { name: 'Phone Screening', status: 'completed', completedDate: new Date('2024-01-25') },
      { name: 'Technical Assessment', status: 'current' }
    ]
  },
  {
    id: '4',
    jobTitle: 'Fiber Optic Technician',
    company: 'TEKsystems Infrastructure',
    logo: '📡',
    location: 'Scottsdale, AZ',
    industry: 'Broadband & Fiber Optics',
    appliedDate: new Date('2024-01-08'),
    status: 'rejected',
    lastUpdated: new Date('2024-01-20'),
    salaryRange: '$50K - $65K',
    employerRating: 4.1,
    matchScore: 68,
    rejectionFeedback: {
      reason: 'Experience Level Insufficient',
      details: 'While we were impressed with your enthusiasm and technical knowledge, we require a minimum of 2 years of hands-on fiber splicing experience for this role.',
      suggestions: [
        'Consider entry-level fiber technician positions to gain hands-on experience',
        'Look into fiber optic certification programs (FOA CFOT)',
        'Apply to our apprenticeship program when it opens in Q2 2024'
      ],
      stage: 'Phone Screening'
    },
    stages: [
      { name: 'Application Submitted', status: 'completed', completedDate: new Date('2024-01-08') },
      { name: 'Application Reviewed', status: 'completed', completedDate: new Date('2024-01-10') },
      { name: 'Phone Screening', status: 'completed', completedDate: new Date('2024-01-15') }
    ]
  },
  {
    id: '5',
    jobTitle: 'Solar Installation Specialist',
    company: 'SolarMax Energy Systems',
    logo: '☀️',
    location: 'Mesa, AZ',
    industry: 'Green Technology & Renewable Energy',
    appliedDate: new Date('2024-01-12'),
    status: 'rejected',
    lastUpdated: new Date('2024-01-18'),
    salaryRange: '$45K - $60K',
    employerRating: 3.9,
    matchScore: 62,
    rejectionFeedback: {
      reason: 'Safety Certification Requirements',
      details: 'This position requires current OSHA 30-Hour Construction certification and fall protection training, which are not listed on your application.',
      suggestions: [
        'Complete OSHA 30-Hour Construction Safety course',
        'Obtain fall protection and ladder safety certifications',
        'Consider our entry-level ground crew positions that provide training'
      ],
      stage: 'Application Review'
    },
    stages: [
      { name: 'Application Submitted', status: 'completed', completedDate: new Date('2024-01-12') },
      { name: 'Application Reviewed', status: 'completed', completedDate: new Date('2024-01-18') }
    ]
  },
  {
    id: '6',
    jobTitle: 'CNC Machine Operator',
    company: 'Precision Manufacturing Corp',
    logo: '⚙️',
    location: 'Chandler, AZ',
    industry: 'Advanced Manufacturing',
    appliedDate: new Date('2024-01-25'),
    status: 'phone_screening',
    lastUpdated: new Date('2024-01-28'),
    salaryRange: '$50K - $65K',
    nextSteps: 'Phone screening scheduled for January 30th at 2:00 PM',
    employerRating: 4.3,
    matchScore: 78,
    stages: [
      { name: 'Application Submitted', status: 'completed', completedDate: new Date('2024-01-25') },
      { name: 'Application Reviewed', status: 'completed', completedDate: new Date('2024-01-27') },
      { name: 'Phone Screening', status: 'current' }
    ]
  },
  {
    id: '7',
    jobTitle: 'Industrial Electrician',
    company: 'Industrial MEP Solutions',
    logo: '⚡',
    location: 'Glendale, AZ',
    industry: 'Energy & Power Systems',
    appliedDate: new Date('2024-01-22'),
    status: 'rejected',
    lastUpdated: new Date('2024-01-26'),
    salaryRange: '$60K - $78K',
    employerRating: 4.0,
    matchScore: 71,
    rejectionFeedback: {
      reason: 'Position Filled by Internal Candidate',
      details: 'We have decided to promote an existing team member to this role. Your qualifications were strong and we were impressed with your application.',
      suggestions: [
        'Apply for our upcoming apprentice electrician openings',
        'Consider our sister companies in the Phoenix metro area',
        'We will keep your resume on file for future opportunities'
      ],
      stage: 'Application Review'
    },
    stages: [
      { name: 'Application Submitted', status: 'completed', completedDate: new Date('2024-01-22') },
      { name: 'Application Reviewed', status: 'completed', completedDate: new Date('2024-01-26') }
    ]
  },
  {
    id: '8',
    jobTitle: 'Quality Assurance Technician',
    company: 'Amkor Technology',
    logo: '/media/organization_logo/amkor_technology.png',
    location: 'Tempe, AZ',
    industry: 'Semiconductor & Microelectronics',
    appliedDate: new Date('2024-01-28'),
    status: 'submitted',
    lastUpdated: new Date('2024-01-28'),
    salaryRange: '$50K - $68K',
    nextSteps: 'Application under initial review',
    employerRating: 4.3,
    matchScore: 82,
    stages: [
      { name: 'Application Submitted', status: 'current', completedDate: new Date('2024-01-28') }
    ]
  }
];

const getStatusConfig = (status: ApplicationStatus) => {
  const configs = {
    submitted: { 
      icon: Clock, 
      color: 'text-blue-500 bg-blue-50 border-blue-200', 
      label: 'Submitted',
      description: 'Under initial review'
    },
    reviewed: { 
      icon: Eye, 
      color: 'text-purple-500 bg-purple-50 border-purple-200', 
      label: 'Reviewed',
      description: 'Application has been reviewed'
    },
    phone_screening: { 
      icon: Phone, 
      color: 'text-orange-500 bg-orange-50 border-orange-200', 
      label: 'Phone Screening',
      description: 'Initial screening phase'
    },
    technical_assessment: { 
      icon: FileText, 
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200', 
      label: 'Technical Assessment',
      description: 'Skills evaluation'
    },
    interview_scheduled: { 
      icon: Calendar, 
      color: 'text-cyan-500 bg-cyan-50 border-cyan-200', 
      label: 'Interview Scheduled',
      description: 'Interview coming up'
    },
    interview_completed: { 
      icon: Users, 
      color: 'text-teal-500 bg-teal-50 border-teal-200', 
      label: 'Interview Completed',
      description: 'Awaiting decision'
    },
    reference_check: { 
      icon: UserCheck, 
      color: 'text-pink-500 bg-pink-50 border-pink-200', 
      label: 'Reference Check',
      description: 'Verifying references'
    },
    background_check: { 
      icon: Shield, 
      color: 'text-violet-500 bg-violet-50 border-violet-200', 
      label: 'Background Check',
      description: 'Background verification'
    },
    offer_extended: { 
      icon: Trophy, 
      color: 'text-green-500 bg-green-50 border-green-200', 
      label: 'Offer Extended',
      description: 'Job offer received!'
    },
    offer_accepted: { 
      icon: CheckCircle2, 
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200', 
      label: 'Offer Accepted',
      description: 'Congratulations!'
    },
    offer_declined: { 
      icon: ThumbsDown, 
      color: 'text-gray-500 bg-gray-50 border-gray-200', 
      label: 'Offer Declined',
      description: 'Offer was declined'
    },
    rejected: { 
      icon: XCircle, 
      color: 'text-red-500 bg-red-50 border-red-200', 
      label: 'Not Selected',
      description: 'Application not successful'
    },
    withdrawn: { 
      icon: Archive, 
      color: 'text-gray-500 bg-gray-50 border-gray-200', 
      label: 'Withdrawn',
      description: 'Application withdrawn'
    }
  };
  return configs[status];
};

export default function MySubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'company' | 'status'>('recent');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredSubmissions = useMemo(() => {
    let filtered = mockSubmissions.filter(submission => {
      const matchesSearch = !searchQuery || 
        submission.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.industry.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort submissions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'company':
          return a.company.localeCompare(b.company);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'recent':
        default:
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      }
    });

    return filtered;
  }, [searchQuery, statusFilter, sortBy]);

  const toggleCardExpansion = (submissionId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(submissionId)) {
        newSet.delete(submissionId);
      } else {
        newSet.add(submissionId);
      }
      return newSet;
    });
  };

  const getSubmissionStats = () => {
    const total = mockSubmissions.length;
    const active = mockSubmissions.filter(s => 
      !['rejected', 'withdrawn', 'offer_accepted', 'offer_declined'].includes(s.status)
    ).length;
    const offers = mockSubmissions.filter(s => s.status === 'offer_extended').length;
    const rejected = mockSubmissions.filter(s => s.status === 'rejected').length;
    
    return { total, active, offers, rejected };
  };

  const stats = getSubmissionStats();

  return (
    <div className="min-h-screen bg-black">
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
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/50 via-red-500/30 to-transparent" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-orange-100 to-red-100 bg-clip-text text-transparent mb-6 leading-tight">
              My Submissions
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Track your 
              <span className="text-orange-400 font-semibold"> Job Applications</span> and receive
              <span className="text-red-400 font-semibold"> Employer Feedback</span>
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-xl" />
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Applications</h3>
              <FileCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
            <p className="text-sm text-gray-400">Applications submitted</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Applications</h3>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-400">{stats.active}</div>
            <p className="text-sm text-gray-400">Currently in progress</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Job Offers</h3>
              <Trophy className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.offers}</div>
            <p className="text-sm text-gray-400">Offers received</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Not Selected</h3>
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
            <p className="text-sm text-gray-400">Learning opportunities</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or industry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="phone_screening">Phone Screening</option>
                <option value="technical_assessment">Technical Assessment</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_completed">Interview Completed</option>
                <option value="offer_extended">Offer Extended</option>
                <option value="rejected">Not Selected</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'company' | 'status')}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
              >
                <option value="recent">Sort by Recent</option>
                <option value="company">Sort by Company</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No submissions found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search criteria or apply to some positions!
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => {
              const statusConfig = getStatusConfig(submission.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedCards.has(submission.id);
              
              return (
                <div
                  key={submission.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{submission.logo}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">
                                {submission.jobTitle}
                              </h3>
                              <p className="text-lg text-gray-300">{submission.company}</p>
                            </div>
                            {submission.matchScore && (
                              <div className="text-right">
                                <div className="text-sm text-gray-400">Match Score</div>
                                <div className="text-xl font-bold text-green-400">{submission.matchScore}%</div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {submission.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {submission.industry}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {submission.salaryRange}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {submission.employerRating}
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${statusConfig.color}`}>
                            <StatusIcon className="h-4 w-4" />
                            {statusConfig.label}
                          </div>
                          
                          {submission.nextSteps && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Next Steps</div>
                                  <div className="text-sm text-blue-700 dark:text-blue-300">{submission.nextSteps}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleCardExpansion(submission.id)}
                        className="ml-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Applied {submission.appliedDate.toLocaleDateString()} • Updated {submission.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-750">
                      {/* Progress Stages */}
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Application Progress</h4>
                        <div className="space-y-3">
                          {submission.stages.map((stage, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                stage.status === 'completed' ? 'bg-green-500 text-white' :
                                stage.status === 'current' ? 'bg-blue-500 text-white' :
                                'bg-slate-200 dark:bg-gray-600 text-slate-400'
                              }`}>
                                {stage.status === 'completed' ? 
                                  <CheckCircle2 className="h-4 w-4" /> :
                                  stage.status === 'current' ?
                                  <Clock className="h-4 w-4" /> :
                                  <div className="w-2 h-2 bg-current rounded-full" />
                                }
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-slate-900 dark:text-white">{stage.name}</div>
                                {stage.completedDate && (
                                  <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {stage.completedDate.toLocaleDateString()}
                                  </div>
                                )}
                                {stage.notes && (
                                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stage.notes}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Offer Details */}
                      {submission.offerDetails && (
                        <div className="px-6 pb-6">
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                            <h5 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                              <Trophy className="h-5 w-5" />
                              Job Offer Details
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div><strong>Salary:</strong> {submission.offerDetails.salary}</div>
                              <div><strong>Start Date:</strong> {submission.offerDetails.startDate.toLocaleDateString()}</div>
                              <div><strong>Response Deadline:</strong> {submission.offerDetails.deadline.toLocaleDateString()}</div>
                              <div>
                                <strong>Benefits:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1">
                                  {submission.offerDetails.benefits.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Rejection Feedback */}
                      {submission.rejectionFeedback && (
                        <div className="px-6 pb-6">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                            <h5 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Employer Feedback
                            </h5>
                            <div className="space-y-3 text-sm">
                              <div>
                                <strong className="text-red-900 dark:text-red-100">Reason:</strong>
                                <div className="text-red-700 dark:text-red-300 mt-1">{submission.rejectionFeedback.reason}</div>
                              </div>
                              
                              <div>
                                <strong className="text-red-900 dark:text-red-100">Details:</strong>
                                <div className="text-red-700 dark:text-red-300 mt-1">{submission.rejectionFeedback.details}</div>
                              </div>
                              
                              {submission.rejectionFeedback.suggestions && (
                                <div>
                                  <strong className="text-red-900 dark:text-red-100">Suggestions for Improvement:</strong>
                                  <ul className="list-disc list-inside ml-4 mt-1 text-red-700 dark:text-red-300">
                                    {submission.rejectionFeedback.suggestions.map((suggestion, idx) => (
                                      <li key={idx}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded">
                                Rejected at: {submission.rejectionFeedback.stage}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 