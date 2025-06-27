'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar,
  CheckCircle,
  Star,
  ArrowLeft,
  ExternalLink,
  Play,
  Zap,
  Award,
  Shield,
  Target,
  Building2,
  Users,
  Heart,
  Eye,
  ChevronRight,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  Circle
} from 'lucide-react';

// Job data for CNC Machine Operator
const jobData = {
  id: 1,
  title: "CNC Machine Operator",
  company: "Honeywell Aerospace",
  companyLogo: "/media/organization_logo/honeywell-aerospace.jpg",
  location: "Phoenix, AZ",
  salaryRange: "$48,000 - $62,000",
  type: "Full-time",
  department: "Manufacturing",
  description: "Operate and maintain CNC machines to produce precision aerospace components. Set up machines, monitor production, and ensure quality standards are met in a fast-paced manufacturing environment.",
  requirements: [
    "High school diploma or equivalent",
    "Basic understanding of manufacturing processes",
    "Ability to read technical drawings and blueprints",
    "Strong attention to detail and quality focus",
    "Willingness to learn and work in a team environment"
  ],
  responsibilities: [
    "Set up and operate CNC machines according to work instructions",
    "Monitor machine operations and make adjustments as needed",
    "Perform quality inspections on manufactured parts",
    "Maintain accurate production records and documentation",
    "Follow all safety protocols and procedures",
    "Collaborate with team members and supervisors"
  ],
  benefits: [
    "Comprehensive health insurance",
    "401(k) with company matching",
    "Paid time off and holidays",
    "Tuition reimbursement program",
    "Career advancement opportunities",
    "On-the-job training provided"
  ]
};

// Slide data for the job opportunity
const slides = [
  {
    id: 1,
    type: 'hero',
    title: 'CNC Machine Operator',
    subtitle: 'Join Honeywell Aerospace',
    backgroundImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop&crop=center',
    content: {
      salary: '$48,000 - $62,000',
      location: 'Phoenix, AZ',
      description: 'Join Honeywell Aerospace as a CNC Machine Operator and become part of a team that\'s shaping the future of aerospace technology. This role offers excellent growth opportunities in advanced manufacturing with comprehensive training and competitive benefits.',
      highlights: [
        'No college degree required',
        'Comprehensive health insurance',
        'Career advancement opportunities',
        'On-the-job training provided'
      ]
    }
  },
  {
    id: 2,
    type: 'day-in-life',
    title: 'A Day in Your Life',
    subtitle: 'See what your workday looks like',
    backgroundImage: 'https://images.unsplash.com/photo-1563200424-2F6196024328?w=1920&h=1080&fit=crop&crop=center',
    content: {
      timeline: [
        { time: '7:00 AM', activity: 'Safety briefing and machine setup', description: 'Start your day with team safety protocols and prepare your CNC machine for production' },
        { time: '8:00 AM', activity: 'Production monitoring', description: 'Monitor machining operations, check quality, and make adjustments as needed' },
        { time: '12:00 PM', activity: 'Lunch break and team collaboration', description: 'Connect with colleagues and discuss production improvements' },
        { time: '1:00 PM', activity: 'Afternoon production and maintenance', description: 'Continue operations, perform routine maintenance, and document progress' },
        { time: '3:00 PM', activity: 'End-of-shift documentation', description: 'Complete production reports and prepare machines for next shift' }
      ]
    }
  },
  {
    id: 3,
    type: 'reality-check',
    title: 'Before You Apply',
    subtitle: 'What you need to know',
    backgroundImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop&crop=center',
    content: {
      challenges: [
        'Physical work environment with standing for extended periods',
        'Attention to detail required for quality control',
        'Learning complex machinery operations',
        'Following strict safety protocols'
      ],
      rewards: [
        'Competitive salary with regular increases',
        'Comprehensive health and retirement benefits',
        'Opportunities for skills advancement and certifications',
        'Job security in a growing aerospace industry',
        'Pride in contributing to innovative aerospace technology'
      ],
      perfectFor: [
        'Detail-oriented individuals who enjoy hands-on work',
        'People interested in manufacturing and technology',
        'Those seeking stable career with growth potential',
        'Individuals who work well in team environments'
      ]
    }
  },
  {
    id: 4,
    type: 'ready-to-start',
    title: 'Ready to Get Started?',
    subtitle: 'Your pathway to success begins here',
    backgroundImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center',
    content: {
      description: 'Complete our specialized training courses to build the skills needed for this position and unlock direct application to Honeywell.'
    }
  },
  {
    id: 5,
    type: 'courses',
    title: 'Required Training Courses',
    subtitle: 'Master these skills to qualify for the position',
    backgroundImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center',
    content: {
      courses: [
        {
          id: 1,
          order: 1,
          title: 'CNC Machining & Advanced Manufacturing',
          company: 'Central Arizona College',
          companyLogo: '/media/organization_logo/central-arizona-college.png',
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
          description: 'Master the fundamentals of CNC machine operation, programming, and precision manufacturing techniques used in aerospace applications.',
          timeToComplete: '8 weeks',
          xp: 850,
          technologyTags: ['CNC Programming', 'G-Code', 'Precision Machining', 'Quality Control']
        },
        {
          id: 2,
          order: 2,
          title: 'Blueprint Reading for Manufacturing',
          company: 'Baltu Technologies',
          companyLogo: '/media/organization_logo/baltu-technologies.png',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
          description: 'Learn to interpret technical drawings, specifications, and manufacturing blueprints essential for aerospace component production.',
          timeToComplete: '4 weeks',
          xp: 500,
          technologyTags: ['Technical Drawings', 'GD&T', 'Measurements', 'Specifications']
        },
        {
          id: 3,
          order: 3,
          title: 'Honeywell Manufacturing Excellence Program',
          company: 'Honeywell',
          companyLogo: '/media/organization_logo/honeywell.png',
          image: 'https://images.unsplash.com/photo-1563200424-2F6196024328?w=600&h=400&fit=crop',
          description: 'Company-specific training on Honeywell systems, quality standards, and aerospace manufacturing processes.',
          timeToComplete: '6 weeks',
          xp: 750,
          technologyTags: ['Honeywell Systems', 'Aerospace Standards', 'Quality Systems', 'Company Culture']
        },
        {
          id: 4,
          order: 4,
          title: 'Manufacturing Safety & OSHA Compliance',
          company: 'Baltu Technologies',
          companyLogo: '/media/organization_logo/baltu-technologies.png',
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
          description: 'Comprehensive safety training covering OSHA regulations, workplace safety protocols, and emergency procedures for manufacturing environments.',
          timeToComplete: '3 weeks',
          xp: 400,
          technologyTags: ['OSHA Standards', 'Safety Protocols', 'Emergency Procedures', 'Risk Management']
        }
      ]
    }
  }
];

export default function CNCMachineOperatorJob() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [favoriteCourses, setFavoriteCourses] = useState<number[]>([]);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation for vertical slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle wheel scroll for vertical navigation (except on courses slide)
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: WheelEvent) => {
      // Special handling for courses slide (last slide)
      if (currentSlide === slides.length - 1) {
        // Only allow slide navigation when scrolling up and we're at the top
        if (e.deltaY < 0 && window.scrollY === 0) {
          e.preventDefault();
          clearTimeout(wheelTimeout);
          wheelTimeout = setTimeout(() => {
            prevSlide();
          }, 100);
        }
        // Otherwise let browser handle normal scrolling
        return;
      }
      
      e.preventDefault();
      
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }, 100);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [currentSlide]);

  const toggleFavorite = (courseId: number) => {
    setFavoriteCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => prev < slides.length - 1 ? prev + 1 : prev);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev > 0 ? prev - 1 : prev);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={`min-h-screen bg-black text-white ${currentSlide === slides.length - 1 ? 'overflow-auto' : 'overflow-hidden'}`}>
      {/* Slideshow Container */}
      <div className={`relative ${currentSlide === slides.length - 1 ? 'min-h-screen' : 'h-screen'}`}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide ? 'translate-y-0' : 
              index < currentSlide ? '-translate-y-full' : 'translate-y-full'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.backgroundImage}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Slide Content */}
            <div className={`relative z-10 ${slide.type === 'courses' ? 'h-auto min-h-full' : 'h-full flex items-center'} overflow-y-auto`}>
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${slide.type === 'courses' ? 'py-8' : 'py-20'}`}>
                
                {/* Hero Slide */}
                {slide.type === 'hero' && (
                  <div className="max-w-4xl">
                    {/* Company Badge */}
                    <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 flex items-center justify-center border border-white/20">
                        <div className="text-sm sm:text-lg lg:text-xl font-bold text-white">HON</div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 backdrop-blur-md text-green-400 rounded-full text-xs sm:text-sm font-medium border border-green-500/30">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                        Now Hiring
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
                        {slide.title}
                        <br />
                        <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          Opportunity
                        </span>
                      </h1>
                      
                      <div className="space-y-4">
                        <p className="text-base sm:text-lg md:text-xl font-light text-gray-200">
                          {slide.subtitle}
                        </p>
                        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl">
                          {slide.content.description}
                        </p>
                      </div>

                      {/* Key Details */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-6 w-6 text-green-400" />
                          <span className="text-lg font-semibold text-white">{slide.content.salary}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-6 w-6 text-blue-400" />
                          <span className="text-lg text-gray-300">{slide.content.location}</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8">
                        <Button 
                          onClick={() => goToSlide(slides.length - 1)}
                          className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-center text-sm sm:text-base"
                        >
                          Start Training Pathway
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md text-sm sm:text-base"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Day in Life Slide */}
                {slide.type === 'day-in-life' && (
                  <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                      <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
                        {slide.title}
                      </h1>
                      <p className="text-2xl text-gray-300">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="space-y-8">
                      {slide.content.timeline?.map((item, idx) => (
                        <div key={idx} className="flex gap-8 items-start">
                          <div className="flex-shrink-0 w-24 text-right">
                            <span className="text-2xl font-bold text-blue-400">{item.time}</span>
                          </div>
                          <div className="flex-shrink-0 w-px h-16 bg-gradient-to-b from-blue-400 to-purple-400 mt-2"></div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-white mb-2">{item.activity}</h3>
                            <p className="text-lg text-gray-300 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reality Check Slide */}
                {slide.type === 'reality-check' && (
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                      <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
                        {slide.title}
                      </h1>
                      <p className="text-2xl text-gray-300">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Challenges */}
                      <div className="p-8 bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-md border border-red-400/30 rounded-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <Shield className="h-8 w-8 text-red-400" />
                          The Reality
                        </h3>
                        <div className="space-y-4">
                          {slide.content.challenges?.map((challenge, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                              <p className="text-gray-300">{challenge}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="p-8 bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-md border border-green-400/30 rounded-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <Star className="h-8 w-8 text-green-400" />
                          The Rewards
                        </h3>
                        <div className="space-y-4">
                          {slide.content.rewards?.map((reward, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                              <p className="text-gray-300">{reward}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Perfect For */}
                    <div className="mt-12 p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-blue-400/30 rounded-2xl">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Target className="h-8 w-8 text-blue-400" />
                        You'll Love This If
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {slide.content.perfectFor?.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Heart className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-300">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ready to Start Slide */}
                {slide.type === 'ready-to-start' && (
                  <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-8">
                      {slide.title}
                    </h1>
                    <p className="text-2xl text-gray-300 mb-16">
                      {slide.subtitle}
                    </p>
                    
                    <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-2xl">
                      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                        {slide.content.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                          <GraduationCap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">Expert Training</h3>
                          <p className="text-gray-300">Industry-leading courses designed by professionals</p>
                        </div>
                        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                          <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">Direct Pathway</h3>
                          <p className="text-gray-300">Complete training leads directly to job application</p>
                        </div>
                        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                          <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">Career Growth</h3>
                          <p className="text-gray-300">Build skills for long-term advancement</p>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-6 pt-12 justify-center">
                        <Button 
                          className="px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg"
                        >
                          Start Our Training Pathway
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex items-center gap-3 px-10 py-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md text-lg"
                        >
                          <ExternalLink className="h-5 w-5" />
                          Learn More About Training
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Courses Slide - Full Page Format */}
                {slide.type === 'courses' && (
                  <div className="absolute inset-0 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black" style={{ height: 'auto', minHeight: '100vh' }}>
                    {/* Full Page Background */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center"
                        alt="Training and Education"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-black/80 to-black/90" />
                    </div>
                    
                    {/* Header Section - Like Honeywell's "Join Our Mission" */}
                    <div className="relative z-10 w-full pt-20 pb-12">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                          <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
                            Start Your
                            <span className="block font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                              Training Pathway
                            </span>
                          </h1>
                          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Master these essential skills to qualify for the CNC Machine Operator position
                          </p>
                        </div>

                        {/* Course Grid - Full Page Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                          {slide.content.courses?.map((course) => (
                            <Card key={course.id} className="group cursor-pointer overflow-hidden border-2 border-slate-700 bg-slate-800/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
                              
                              {/* Course Banner */}
                              <div className="relative h-32 overflow-hidden">
                                <div className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-125 group-hover:translate-x-3 group-hover:-translate-y-2">
                                  <Image
                                    src={course.image}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                {/* Required Badge */}
                                <div className="absolute top-3 left-3">
                                  <Badge className="bg-red-500/90 text-white font-medium">
                                    Required
                                  </Badge>
                                </div>

                                {/* Course Order */}
                                <div className="absolute top-3 right-3">
                                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {course.order}
                                  </div>
                                </div>

                                {/* Heart/Favorite Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(course.id);
                                  }}
                                  className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group/heart"
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

                              {/* Company Logo - Overlapping */}
                              <div className="relative -mt-8 ml-6 z-10">
                                <div className="w-16 h-12 bg-white rounded-lg p-2 flex items-center justify-center shadow-xl border-2 border-slate-700">
                                  <Image
                                    src={course.companyLogo}
                                    alt={course.company}
                                    width={48}
                                    height={32}
                                    className="object-contain max-h-8"
                                  />
                                </div>
                              </div>

                              <CardContent className="p-4 flex flex-col flex-1 pt-2">
                                <div className="space-y-4 flex-1">
                                  {/* Course Title */}
                                  <h3 className="text-white font-bold text-xl leading-tight">
                                    {course.title}
                                  </h3>

                                  {/* Course Description */}
                                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
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

                                  {/* Key Skills */}
                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Key Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                      {course.technologyTags.slice(0, 2).map((tag, tagIdx) => (
                                        <Badge key={tagIdx} variant="outline" className="text-xs border-blue-400/50 text-blue-400 bg-blue-400/5">
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

                                {/* Action Buttons */}
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
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white transition-all duration-300 hover:shadow-lg rounded-xl"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Course
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vertical Slide Navigation Controls */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center">
        {/* Slide Indicators */}
        <div className="flex flex-col gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 