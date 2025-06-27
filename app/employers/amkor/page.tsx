'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, Star, Users, ArrowLeft, Play, X, Cpu, Microscope, Cog,
  CheckCircle, Shield, DollarSign, Calendar, Award, Globe, ChevronDown,
  Search, Filter, Bookmark, BookmarkCheck, Clock, MapPin as Location,
  Building2, ExternalLink, Zap, TrendingUp, ChevronUp, Target, GraduationCap
} from 'lucide-react';

// Mock data for jobs
const mockJobs = [
  {
    id: 1,
    title: "Semiconductor Operator",
    department: "Manufacturing",
    locations: [{ city: "Chandler", state: "AZ", openings: 12 }],
    salary: "$19 - $25/hour",
    type: "Full-time",
    urgent: true,
    description: "Operate semiconductor manufacturing equipment in a clean room environment. Comprehensive training provided for entry-level candidates.",
    requirements: [
      "High school diploma or GED",
      "Ability to work in clean room environment",
      "Attention to detail and quality focus",
      "Willingness to work rotating shifts"
    ],
    education: "High school diploma or GED",
    image: "/path/to/image1.jpg"
  },
  {
    id: 2,
    title: "Assembly Technician",
    department: "Manufacturing",
    locations: [{ city: "Phoenix", state: "AZ", openings: 8 }],
    salary: "$17 - $22/hour",
    type: "Full-time",
    urgent: false,
    description: "Assemble semiconductor packages using precision equipment and microscopes. Perfect for detail-oriented individuals.",
    requirements: [
      "High school diploma or equivalent",
      "Good hand-eye coordination",
      "Ability to work with small components",
      "Basic math and measurement skills"
    ],
    education: "High school diploma or equivalent",
    image: "/path/to/image2.jpg"
  },
  {
    id: 3,
    title: "Quality Control Technician",
    department: "Quality",
    locations: [{ city: "Tempe", state: "AZ", openings: 5 }],
    salary: "$21 - $27/hour",
    type: "Full-time",
    urgent: false,
    description: "Test and inspect semiconductor products using specialized equipment. Great opportunity for community college graduates.",
    requirements: [
      "Associate degree in electronics or equivalent experience",
      "Basic understanding of electrical measurements",
      "Computer skills for data entry and analysis",
      "Strong attention to detail"
    ],
    education: "Associate degree or equivalent experience",
    image: "/path/to/image3.jpg"
  },
  {
    id: 4,
    title: "Equipment Maintenance Technician",
    department: "Facilities",
    locations: [{ city: "Mesa", state: "AZ", openings: 4 }],
    salary: "$26 - $34/hour",
    type: "Full-time",
    urgent: true,
    description: "Maintain and repair semiconductor manufacturing equipment. Excellent opportunity for those with technical training or military experience.",
    requirements: [
      "Technical training or military electronics experience",
      "Basic electrical and mechanical troubleshooting",
      "Ability to read technical manuals and schematics",
      "Physical ability to lift equipment and work in tight spaces"
    ],
    education: "Technical training or military experience",
    image: "/path/to/image4.jpg"
  },
  {
    id: 5,
    title: "Materials Handler",
    department: "Logistics",
    locations: [{ city: "Chandler", state: "AZ", openings: 6 }],
    salary: "$16 - $20/hour",
    type: "Full-time",
    urgent: false,
    description: "Handle and transport materials in semiconductor manufacturing facility. Entry-level position with advancement opportunities.",
    requirements: [
      "High school diploma preferred",
      "Ability to lift up to 50 lbs",
      "Basic computer skills",
      "Reliable attendance and punctuality"
    ],
    education: "High school diploma preferred",
    image: "/path/to/image5.jpg"
  },
  {
    id: 6,
    title: "Process Technician Trainee",
    department: "Engineering",
    locations: [{ city: "Phoenix", state: "AZ", openings: 3 }],
    salary: "$22 - $28/hour",
    type: "Full-time",
    urgent: false,
    description: "Support process engineers with data collection and equipment monitoring. Great entry point into semiconductor engineering.",
    requirements: [
      "Associate degree in engineering technology or science",
      "Basic knowledge of chemistry or physics",
      "Computer skills including Excel",
      "Strong analytical thinking"
    ],
    education: "Associate degree in engineering technology or science",
    image: "/path/to/image6.jpg"
  }
];

// Hero images with dynamic content
const heroImages = [
  {
    url: "/api/placeholder/1920/1080",
    title: "Advanced Semiconductor Assembly",
    subtitle: "Leading the industry in packaging innovation"
  },
  {
    url: "/api/placeholder/1920/1080", 
    title: "Precision Test Solutions",
    subtitle: "Ensuring quality at every step"
  },
  {
    url: "/api/placeholder/1920/1080",
    title: "Global Manufacturing Excellence", 
    subtitle: "50+ years of trusted partnership"
  }
];

export default function AmkorPage() {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentInnovationImage, setCurrentInnovationImage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define slides array early
  const slides = [
    'Hero',
    'Stats',
    'Innovation',
    'Culture',
    'Careers'
  ];

  // Auto-advance hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance innovation images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInnovationImage((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Parallax scroll effect and slide tracking
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for accurate slide tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Only trigger when slide is 60% visible
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible slide
      let mostVisibleSlide = null;
      let maxVisibility = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slideIndex = parseInt(entry.target.getAttribute('data-slide-index') || '0');
          const visibility = entry.intersectionRatio;
          
          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleSlide = slideIndex;
          }
        }
      });

      if (mostVisibleSlide !== null) {
        setCurrentSlide(mostVisibleSlide);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Setup observer with retry for DOM readiness
    const setupObserver = () => {
      const slideElements = document.querySelectorAll('[data-slide-index]');
      if (slideElements.length === 0) return false;
      
      slideElements.forEach((element) => observer.observe(element));
      return true;
    };

    // Try to setup observer, retry if elements not ready
    if (!setupObserver()) {
      const retryTimer = setTimeout(setupObserver, 100);
      return () => clearTimeout(retryTimer);
    }

    return () => {
      const slideElements = document.querySelectorAll('[data-slide-index]');
      slideElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  // Navigate to specific slide
  const navigateToSlide = (slideIndex: number) => {
    const slideHeight = window.innerHeight;
    const targetScroll = slideIndex * slideHeight;
    
    // Update current slide immediately for better UI responsiveness
    setCurrentSlide(slideIndex);
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  // Filter jobs based on search and filters
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || 
                           job.locations.some(loc => `${loc.city}, ${loc.state}` === selectedLocation);
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // Get unique departments and locations for filters
  const departments = Array.from(new Set(mockJobs.map(job => job.department)));
  const locations = Array.from(new Set(mockJobs.flatMap(job => 
    job.locations.map(loc => `${loc.city}, ${loc.state}`)
  )));

  // Replace the company stats section with proper icons
  const companyStats = [
    { number: '30,000+', label: 'Global Employees', icon: Users },
    { number: '50+', label: 'Years of Excellence', icon: Zap },
    { number: '15+', label: 'Countries', icon: Globe },
    { number: '$5B+', label: 'Annual Revenue', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Back Button - Fixed at top level */}
      <Link
        href="/employers"
        className="fixed top-4 left-4 z-30 p-2 md:p-3 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-black/70 transition-all duration-300 group"
      >
        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform duration-300" />
      </Link>

      {/* Slide Navigation Sidebar - Hidden on mobile, shown on tablet+ */}
      <div className="hidden md:flex fixed right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-40 flex-col space-y-4">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => navigateToSlide(index)}
            className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-purple-400 scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            title={slide}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      <div className="snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth">
        {/* Slide 1: Hero Section */}
        <section className="snap-start min-h-screen w-full relative flex items-center overflow-hidden pt-16 sm:pt-0" data-slide-index="0">
          {/* Background Images */}
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translateY(${scrollY * 0.5}px)`
              }}
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}

          {/* Hero Content */}
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                {/* Company Logo & Badge */}
                <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 flex items-center justify-center border border-white/20">
                    <div className="text-sm sm:text-lg lg:text-xl font-bold text-white">AMK</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 backdrop-blur-md text-green-400 rounded-full text-xs sm:text-sm font-medium border border-green-500/30 animate-pulse">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    Actively Hiring
                  </div>
                </div>

                {/* Dynamic Hero Text */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
                    Amkor
                    <br />
                    <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Technology
                    </span>
                  </h1>
                  
                  <div className="h-10 sm:h-12 md:h-16 overflow-hidden">
                    <div 
                      className="transition-transform duration-1000 ease-in-out"
                      style={{ transform: `translateY(-${currentHeroImage * 2.5}rem)` }}
                    >
                      {heroImages.map((image, index) => (
                        <div key={index} className="h-10 sm:h-12 md:h-16 flex flex-col justify-center">
                          <p className="text-base sm:text-lg md:text-2xl font-light text-gray-200">{image.title}</p>
                          <p className="text-xs sm:text-sm md:text-lg text-gray-400">{image.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 md:pt-8">
                    <button 
                      onClick={() => navigateToSlide(4)}
                      className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-center text-sm sm:text-base"
                    >
                      Explore Careers
                    </button>
                    <button 
                      onClick={() => setShowVideoModal(true)}
                      className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md text-sm sm:text-base"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      Watch Our Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Navigation Dots */}
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImage(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentHeroImage 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Slide 2: Company Stats */}
        <section className="snap-start min-h-screen w-full relative flex items-center overflow-hidden pt-16 sm:pt-0" data-slide-index="1">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Amkor Semiconductor Manufacturing Facility"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-black/70 to-black/85" />
          </div>
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                  By the
                  <span className="block font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Numbers
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Leading semiconductor assembly and test services for over 50 years
                </p>
              </div>

              {/* Company stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {companyStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl hover:border-white/20 transition-all duration-300">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-blue-400" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: Innovation */}
        <section className="snap-start min-h-screen w-full relative flex items-center overflow-hidden pt-16 sm:pt-0" data-slide-index="2">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Amkor Innovation Laboratory"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-purple-950/70 to-black/85" />
          </div>
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                    Innovation in
                    <span className="block font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Semiconductor
                    </span>
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {[
                      {
                        title: 'Assembly Services',
                        description: 'Advanced packaging solutions for cutting-edge semiconductor devices',
                        icon: Zap
                      },
                      {
                        title: 'Test Services',
                        description: 'Comprehensive testing solutions ensuring highest quality standards',
                        icon: CheckCircle
                      },
                      {
                        title: 'Electronic Manufacturing',
                        description: 'System-level assembly and manufacturing services',
                        icon: Building2
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 sm:gap-4 md:gap-6">
                        <div className="flex-shrink-0">
                          <item.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 sm:mb-2">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
                    {[
                      { url: '/api/placeholder/600/600', title: 'Assembly Innovation' },
                      { url: '/api/placeholder/600/600', title: 'Test Technology' },
                      { url: '/api/placeholder/600/600', title: 'Manufacturing Excellence' }
                    ].map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === currentInnovationImage ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.title}
                          fill
                          className="object-cover rounded-lg sm:rounded-xl md:rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg sm:rounded-xl md:rounded-2xl" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4: Culture & Values */}
        <section className="snap-start min-h-screen w-full relative flex items-center overflow-hidden pt-16 sm:pt-0" data-slide-index="3">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Amkor Team Culture and Collaboration"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-slate-900/70 to-black/85" />
          </div>
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                    Our
                    <span className="block font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Culture
                    </span>
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    <div className="p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Our Mission</h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                        To be the world's most trusted semiconductor assembly and test services provider, 
                        delivering innovative solutions that enable our customers' success.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                      {[
                        { title: 'Innovation', description: 'Pushing boundaries in semiconductor technology', icon: Target },
                        { title: 'Excellence', description: 'Delivering quality in every solution', icon: Star },
                        { title: 'Partnership', description: 'Building lasting relationships', icon: Users },
                        { title: 'Integrity', description: 'Operating with transparency and trust', icon: CheckCircle }
                      ].map((value, index) => (
                        <div key={index} className="p-3 sm:p-4 md:p-6 bg-white/5 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
                          <div className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                            <value.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-400" />
                          </div>
                          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">
                            {value.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {value.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
                    <Image
                      src="/api/placeholder/600/600"
                      alt="Amkor Culture"
                      fill
                      className="object-cover rounded-lg sm:rounded-xl md:rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg sm:rounded-xl md:rounded-2xl" />
                    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">
                          Team Collaboration
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-300">
                          Working together to solve complex challenges
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 5: Job Opportunities */}
        <section className="snap-start min-h-screen w-full relative overflow-hidden pt-16 sm:pt-0" data-slide-index="4">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Amkor Career Opportunities and Professional Growth"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-black/80 to-black/90" />
          </div>
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                  Join Our
                  <span className="block font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Team
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Discover exciting career opportunities in semiconductor technology
                </p>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 sm:mb-8 md:mb-12">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-white/30 transition-all duration-300 text-sm sm:text-base min-w-0 flex-shrink-0"
                    >
                      <option value="all" className="bg-black">All Departments</option>
                      <option value="Manufacturing" className="bg-black">Manufacturing</option>
                      <option value="Engineering" className="bg-black">Engineering</option>
                      <option value="Quality" className="bg-black">Quality</option>
                    </select>
                    
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-white/30 transition-all duration-300 text-sm sm:text-base min-w-0 flex-shrink-0"
                    >
                      <option value="all" className="bg-black">All Locations</option>
                      <option value="Tempe" className="bg-black">Tempe, AZ</option>
                      <option value="Phoenix" className="bg-black">Phoenix, AZ</option>
                      <option value="Mesa" className="bg-black">Mesa, AZ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Listings - Tesla-inspired sleek design */}
              <div className="space-y-4 sm:space-y-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                {filteredJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="group relative bg-black/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-8 hover:border-gray-700 hover:bg-black/80 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 w-full sm:w-1/2"
                  >
                    {/* Image Banner */}
                    <img src={job.image} alt="Job Banner" className="w-full h-32 object-cover rounded-t-3xl" />
                    <div className="relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                        <div className="flex-1 space-y-3 sm:space-y-4">
                          {/* Job Title */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">
                              {job.title}
                            </h3>
                          </div>
                          
                          {/* Job Description */}
                          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                            {job.description}
                          </p>

                          {/* Location and Salary */}
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-300 text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                              {job.locations[0].city}, {job.locations[0].state}
                            </div>
                            <div className="flex items-center text-green-400 font-medium text-sm">
                              <DollarSign className="h-4 w-4 mr-2" />
                              {job.salary}
                            </div>
                          </div>

                          {/* Education Requirement */}
                          <div className="flex items-center text-yellow-400 text-sm">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            {job.education}
                          </div>
                          
                          {/* Expanded Content */}
                          {expandedJob === job.id && (
                            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-gray-800">
                              <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed">{job.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 lg:flex-col lg:gap-3">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-3 rounded-2xl transition-all duration-300 border ${
                              savedJobs.includes(job.id)
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'
                                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/50 hover:text-white'
                            }`}
                          >
                            {savedJobs.includes(job.id) ? (
                              <BookmarkCheck className="h-5 w-5" />
                            ) : (
                              <Bookmark className="h-5 w-5" />
                            )}
                          </button>
                          
                          <button className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg">
                            View Job Opportunity
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits section - replace emoji with proper icon */}
              <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">Career Growth</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Clear advancement paths</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Amkor Technology Company Video"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        /* Custom scrollbar for snap container */
        .snap-y {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }
        .snap-y::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth snap scrolling */
        .snap-y {
          scroll-snap-type: y mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
}


