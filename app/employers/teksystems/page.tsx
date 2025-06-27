'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, ChevronDown, MapPin, Users, Star, Clock, Bookmark, BookmarkCheck, ChevronUp, ChevronRight, Search, Filter, Calendar, DollarSign, Award, TrendingUp, Globe, Zap, Target, CheckCircle, ExternalLink, Building2, GraduationCap } from 'lucide-react';

// Mock job data for TEKsystems
const mockJobs = [
  {
    id: 1,
    title: "Cable Installation Technician",
    department: "Field Operations",
    locations: [
      { city: "Scottsdale", state: "AZ", openings: 15 },
      { city: "Phoenix", state: "AZ", openings: 12 },
      { city: "Mesa", state: "AZ", openings: 8 }
    ],
    salaryRange: "$18 - $24/hour",
    type: "Full-time",
    urgent: true,
    requirements: [
      "High school diploma or GED",
      "Valid driver's license and clean driving record",
      "Ability to work outdoors in various weather conditions",
      "Physical ability to climb ladders and lift 50+ lbs"
    ],
    description: "Install broadband cables and equipment for residential and business customers. Full training provided - no experience required.",
    image: "/api/placeholder/600/600",
    education: "High school diploma or GED"
  },
  {
    id: 2,
    title: "Fiber Optic Trainee",
    department: "Field Operations",
    locations: [
      { city: "Scottsdale", state: "AZ", openings: 10 },
      { city: "Tempe", state: "AZ", openings: 8 }
    ],
    salaryRange: "$20 - $26/hour",
    type: "Full-time",
    urgent: false,
    requirements: [
      "High school diploma or technical certificate",
      "Interest in learning fiber optic technology",
      "Good hand-eye coordination for precision work",
      "Willingness to complete certification training"
    ],
    description: "Learn fiber optic installation and splicing techniques through our comprehensive training program. Perfect for career changers.",
    image: "/api/placeholder/600/600",
    education: "High school diploma or technical certificate"
  },
  {
    id: 3,
    title: "Customer Service Technician",
    department: "Customer Service",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 12 },
      { city: "Tucson", state: "AZ", openings: 6 }
    ],
    salaryRange: "$17 - $22/hour",
    type: "Full-time",
    urgent: false,
    requirements: [
      "High school diploma or equivalent",
      "Strong communication and customer service skills",
      "Basic computer and technical troubleshooting abilities",
      "Reliable transportation for home visits"
    ],
    description: "Provide technical support and service to broadband customers in their homes. Great entry-level opportunity with advancement potential.",
    image: "/api/placeholder/600/600",
    education: "High school diploma or equivalent"
  },
  {
    id: 4,
    title: "Network Technician Apprentice",
    department: "Engineering",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 6 },
      { city: "Mesa", state: "AZ", openings: 4 }
    ],
    salaryRange: "$22 - $28/hour",
    type: "Full-time",
    urgent: true,
    requirements: [
      "Associate degree in electronics or related field",
      "Basic understanding of networking concepts",
      "Willingness to learn on the job",
      "Strong problem-solving skills"
    ],
    description: "Support network engineers with equipment installation and testing. Excellent pathway into telecommunications engineering.",
    image: "/api/placeholder/600/600",
    education: "Associate degree in electronics or related field"
  },
  {
    id: 5,
    title: "Warehouse Associate",
    department: "Operations",
    locations: [
      { city: "Scottsdale", state: "AZ", openings: 8 },
      { city: "Phoenix", state: "AZ", openings: 5 }
    ],
    salaryRange: "$16 - $20/hour",
    type: "Full-time",
    urgent: false,
    requirements: [
      "High school diploma preferred",
      "Ability to lift up to 75 lbs",
      "Forklift certification helpful but not required",
      "Basic inventory management skills"
    ],
    description: "Manage inventory of telecommunications equipment and supplies. Entry-level position with opportunities for advancement and training.",
    image: "/api/placeholder/600/600",
    education: "High school diploma preferred"
  },
  {
    id: 6,
    title: "Field Supervisor Trainee",
    department: "Management",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 4 },
      { city: "Tempe", state: "AZ", openings: 3 }
    ],
    salaryRange: "$25 - $32/hour",
    type: "Full-time",
    urgent: false,
    requirements: [
      "Associate degree or equivalent field experience",
      "Leadership potential and communication skills",
      "Basic understanding of telecommunications",
      "Willingness to mentor and train team members"
    ],
    description: "Develop leadership skills while managing field installation teams. Great opportunity for career advancement in telecommunications.",
    image: "/api/placeholder/600/600",
    education: "Associate degree or equivalent field experience"
  }
];

// Hero slideshow images
const heroImages = [
  {
    url: "/api/placeholder/1920/1080",
    title: "Connecting Arizona Communities",
    subtitle: "Building the broadband infrastructure of tomorrow"
  },
  {
    url: "/api/placeholder/1920/1080",
    title: "Fiber Optic Excellence",
    subtitle: "Delivering high-speed internet to rural and urban areas"
  },
  {
    url: "/api/placeholder/1920/1080",
    title: "Digital Inclusion Initiative",
    subtitle: "Bridging the digital divide across the Southwest"
  }
];

export default function TEKsystemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentInnovationImage, setCurrentInnovationImage] = useState(0);
  const [currentCultureImage, setCurrentCultureImage] = useState(0);
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

  // Parallax scroll effect with throttling for better performance
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
      let maxIntersectionRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
          maxIntersectionRatio = entry.intersectionRatio;
          mostVisibleSlide = parseInt(entry.target.getAttribute('data-slide-index') || '0');
        }
      });

      if (mostVisibleSlide !== null) {
        setCurrentSlide(mostVisibleSlide);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Wait for DOM to be ready
    const setupObserver = () => {
      const slideElements = document.querySelectorAll('[data-slide-index]');
      if (slideElements.length > 0) {
        slideElements.forEach((element) => observer.observe(element));
        return true;
      }
      return false;
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
    { number: '25+', label: 'Years of Experience', icon: Award },
    { number: '80,000+', label: 'Professionals Placed', icon: Users },
    { number: '$12B+', label: 'Annual Revenue', icon: TrendingUp },
    { number: '50+', label: 'Countries Served', icon: Globe }
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
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              currentSlide === index
                ? 'bg-orange-500 border-orange-500 scale-125'
                : 'bg-transparent border-white/40 hover:border-orange-400'
            }`}
            title={slide}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              ×
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="TEKsystems Company Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Slide Container with Snap Scrolling */}
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
        
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
                    <div className="text-sm sm:text-lg lg:text-xl font-bold text-white">TEK</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 backdrop-blur-md text-green-400 rounded-full text-xs sm:text-sm font-medium border border-green-500/30 animate-pulse">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    Actively Hiring
                  </div>
                </div>

                {/* Dynamic Hero Text */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
                    TEKsystems
                    <br />
                    <span className="font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      Infrastructure
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
              alt="TEKsystems Network Infrastructure and Community Connection"
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
                  Connecting
                  <span className="block font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Communities
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Building digital infrastructure for rural and underserved communities
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
              alt="TEKsystems Fiber Optic Installation and Technology"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-orange-950/70 to-black/85" />
          </div>
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                    Broadband
                    <span className="block font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      Solutions
                    </span>
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {[
                      {
                        title: 'Fiber Installation',
                        description: 'High-speed fiber optic network deployment and maintenance',
                        icon: Zap
                      },
                      {
                        title: 'Network Infrastructure',
                        description: 'Complete network design and implementation services',
                        icon: Globe
                      },
                      {
                        title: 'Rural Connectivity',
                        description: 'Bridging the digital divide in underserved areas',
                        icon: Building2
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 sm:gap-4 md:gap-6">
                        <div className="text-xl sm:text-2xl md:text-3xl flex-shrink-0">
                          <item.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-orange-400" />
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
                      { url: '/api/placeholder/600/600', title: 'Fiber Installation' },
                      { url: '/api/placeholder/600/600', title: 'Network Infrastructure' },
                      { url: '/api/placeholder/600/600', title: 'Rural Connectivity' }
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
              alt="TEKsystems Team Mission and Community Impact"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-gray-900/70 to-black/85" />
          </div>
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                  Our
                  <span className="block font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Mission
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Connecting communities through reliable broadband infrastructure
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {[
                  {
                    title: 'Digital Inclusion',
                    description: 'Ensuring every community has access to high-speed internet',
                    icon: Globe,
                    stats: '50+ Communities Connected'
                  },
                  {
                    title: 'Quality Service',
                    description: 'Delivering reliable infrastructure with 99.9% uptime',
                    icon: CheckCircle,
                    stats: '99.9% Network Uptime'
                  },
                  {
                    title: 'Innovation',
                    description: 'Leading the way in fiber optic technology and deployment',
                    icon: Zap,
                    stats: '500+ Miles of Fiber'
                  }
                ].map((value, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-md rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group text-center">
                    <div className="mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-orange-400 mx-auto" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                      {value.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                      {value.description}
                    </p>
                    <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500/20 text-orange-400 rounded-full text-xs sm:text-sm font-medium border border-orange-500/30">
                      {value.stats}
                    </div>
                  </div>
                ))}
              </div>

              {/* Company Values */}
              <div className="mt-8 sm:mt-12 md:mt-16 text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 md:mb-12">
                  What Drives Us
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {[
                    { title: 'Excellence', icon: Award },
                    { title: 'Innovation', icon: Zap },
                    { title: 'Community', icon: Users },
                    { title: 'Integrity', icon: CheckCircle }
                  ].map((value, index) => (
                    <div key={index} className="p-3 sm:p-4 md:p-6 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
                      <div className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-400 mx-auto" />
                      </div>
                      <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white">
                        {value.title}
                      </h4>
                    </div>
                  ))}
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
              alt="TEKsystems Career Opportunities in Network Technology"
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
                  <span className="block font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Team
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Be part of connecting communities across Arizona
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
                      <option value="Field Operations" className="bg-black">Field Operations</option>
                      <option value="Engineering" className="bg-black">Engineering</option>
                      <option value="Project Management" className="bg-black">Project Management</option>
                      <option value="Operations" className="bg-black">Operations</option>
                    </select>
                    
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-white/30 transition-all duration-300 text-sm sm:text-base min-w-0 flex-shrink-0"
                    >
                      <option value="all" className="bg-black">All Locations</option>
                      <option value="Scottsdale" className="bg-black">Scottsdale, AZ</option>
                      <option value="Phoenix" className="bg-black">Phoenix, AZ</option>
                      <option value="Mesa" className="bg-black">Mesa, AZ</option>
                      <option value="Tempe" className="bg-black">Tempe, AZ</option>
                      <option value="Tucson" className="bg-black">Tucson, AZ</option>
                      <option value="Flagstaff" className="bg-black">Flagstaff, AZ</option>
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
                              {job.salaryRange}
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

              {/* Innovation highlights */}
              <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">Innovation</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Leading technology solutions</p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">Precision</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Accurate talent matching</p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-pink-600/20 to-red-600/20 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">Partnership</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Long-term career relationships</p>
                </div>
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
    </div>
  );
}
