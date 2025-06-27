'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  Filter, 
  Building2, 
  Award, 
  Shield, 
  Zap, 
  Globe, 
  Heart,
  ArrowLeft,
  ExternalLink,
  Phone,
  Mail,
  X,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Target,
  TrendingUp,
  CheckCircle,
  ChevronLeft,
  Building,
  GraduationCap,
  Eye
} from 'lucide-react';

// Hero gallery images
const heroImages = [
  {
    url: '/media/honeywell_aerospace_employerimage1.jpg',
    title: 'Advanced Avionics Systems',
    subtitle: 'Pioneering the future of flight technology'
  },
  {
    url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&h=1080&fit=crop&crop=center',
    title: 'Commercial Aviation Excellence',
    subtitle: 'Powering airlines worldwide with cutting-edge solutions'
  },
  {
    url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop&crop=center',
    title: 'Defense & Space Innovation',
    subtitle: 'Mission-critical systems for the most demanding environments'
  },
  {
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop&crop=center',
    title: 'Sustainable Aviation',
    subtitle: 'Leading the industry toward a greener future'
  }
];

// Innovation showcase images
const innovationGallery = [
  {
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center',
    title: 'Next-Gen Cockpit Displays',
    description: 'Intuitive interfaces that enhance pilot decision-making'
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center',
    title: 'Propulsion Technology',
    description: 'Efficient engines that reduce emissions and fuel consumption'
  },
  {
    url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop&crop=center',
    title: 'Safety Systems',
    description: 'Advanced monitoring and protection for aircraft and crew'
  },
  {
    url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop&crop=center',
    title: 'Connected Aircraft',
    description: 'IoT solutions that optimize operations and maintenance'
  }
];

// Team/culture images
const cultureGallery = [
  {
    url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop&crop=center',
    title: 'Engineering Excellence',
    description: 'Our world-class engineering teams pushing boundaries'
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&crop=center',
    title: 'Collaborative Innovation',
    description: 'Diverse teams working together on breakthrough solutions'
  },
  {
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&crop=center',
    title: 'Global Impact',
    description: 'Making a difference in aerospace technology worldwide'
  }
];

// Mock job data for Honeywell
const mockJobs = [
  {
    id: 1,
    title: "Assembly Technician",
    department: "Manufacturing",
    locations: [{ city: "Phoenix", state: "AZ", openings: 8 }],
    salaryRange: "$18 - $24/hour",
    type: "Full-time",
    experience: "Entry Level",
    urgent: true,
    requirements: [
      "High school diploma or GED",
      "Ability to follow detailed instructions",
      "Good hand-eye coordination",
      "Willingness to learn and work in a team environment"
    ],
    description: "Assemble precision aerospace components using hand tools and basic equipment. Full training provided - no experience required.",
    education: "High school diploma or GED",
    image: "/path/to/image1.jpg"
  },
  {
    id: 2,
    title: "CNC Machine Operator",
    department: "Manufacturing",
    locations: [{ city: "Tempe", state: "AZ", openings: 5 }],
    salaryRange: "$22 - $28/hour",
    type: "Full-time",
    experience: "Certificate or 6+ months experience",
    urgent: false,
    requirements: [
      "Community college certificate in machining or equivalent experience",
      "Basic understanding of blueprints and measurements",
      "Attention to detail and quality focus",
      "Ability to work rotating shifts"
    ],
    description: "Operate CNC machines to manufacture precision aerospace parts. Great opportunity for community college graduates or career changers.",
    education: "Community college certificate or equivalent experience",
    image: "/path/to/image2.jpg"
  },
  {
    id: 3,
    title: "Quality Control Inspector",
    department: "Quality",
    locations: [{ city: "Mesa", state: "AZ", openings: 4 }],
    salaryRange: "$45,000 - $55,000",
    type: "Full-time",
    experience: "Training provided",
    urgent: true,
    requirements: [
      "High school diploma or equivalent",
      "Strong attention to detail",
      "Basic computer skills",
      "Good communication skills"
    ],
    description: "Inspect aerospace components using precision measurement tools. Perfect for detail-oriented individuals - comprehensive training provided.",
    education: "High school diploma - training provided",
    image: "/path/to/image3.jpg"
  },
  {
    id: 4,
    title: "Maintenance Technician",
    department: "Facilities",
    locations: [{ city: "Scottsdale", state: "AZ", openings: 3 }],
    salaryRange: "$25 - $32/hour",
    type: "Full-time",
    experience: "Trade school or apprenticeship",
    urgent: false,
    requirements: [
      "Trade school certificate or completed apprenticeship",
      "Basic electrical and mechanical skills",
      "Ability to troubleshoot equipment issues",
      "Physical ability to lift 50+ lbs"
    ],
    description: "Maintain and repair manufacturing equipment and facility systems. Excellent opportunity for those with technical training.",
    education: "Trade school certificate or apprenticeship completion",
    image: "/path/to/image4.jpg"
  },
  {
    id: 5,
    title: "Engineering Technician",
    department: "Engineering",
    locations: [{ city: "Phoenix", state: "AZ", openings: 2 }],
    salaryRange: "$55,000 - $68,000",
    type: "Full-time",
    experience: "Associate degree preferred",
    urgent: false,
    requirements: [
      "Associate degree in engineering technology or related field",
      "Basic knowledge of engineering principles",
      "Computer skills including Microsoft Office",
      "Strong organizational skills"
    ],
    description: "Support engineers with testing, data collection, and documentation. Great entry point into aerospace engineering field.",
    education: "Associate degree in engineering technology",
    image: "/path/to/image5.jpg"
  },
  {
    id: 6,
    title: "Warehouse Associate",
    department: "Logistics",
    locations: [{ city: "Phoenix", state: "AZ", openings: 6 }],
    salaryRange: "$16 - $20/hour",
    type: "Full-time",
    experience: "No experience required",
    urgent: true,
    requirements: [
      "High school diploma or GED preferred",
      "Ability to lift up to 50 lbs",
      "Basic computer skills helpful",
      "Reliable transportation"
    ],
    description: "Handle inventory management, shipping, and receiving of aerospace components. Entry-level position with growth opportunities.",
    education: "High school diploma preferred but not required",
    image: "/path/to/image6.jpg"
  }
];

// Company stats data
const companyStats = [
  { number: '130,000+', label: 'Global Employees', icon: Users },
  { number: '100+', label: 'Years of Innovation', icon: Zap },
  { number: '70+', label: 'Countries Served', icon: Globe },
  { number: '$35B+', label: 'Annual Revenue', icon: TrendingUp }
];

export default function HoneywellPage() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

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
            className={`block w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-150' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            title={slide}
          />
        ))}
      </div>

      {/* Mobile Slide Navigation - Bottom of screen */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => navigateToSlide(index)}
            className={`block w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-150' 
                : 'bg-white/40'
            }`}
            title={slide}
          />
        ))}
      </div>

      {/* Slide Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide Container with Snap Scrolling - Adjusted for mobile header */}
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
                    <div className="text-sm sm:text-lg lg:text-xl font-bold text-white">HON</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 backdrop-blur-md text-green-400 rounded-full text-xs sm:text-sm font-medium border border-green-500/30 animate-pulse">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    Actively Hiring
                  </div>
                </div>

                {/* Dynamic Hero Text */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
                    Honeywell
                    <br />
                    <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Aerospace
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
                      onClick={() => navigateToSlide(5)}
                      className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-center text-sm sm:text-base"
                    >
                      Explore Careers
                    </button>
                    <button 
                      onClick={() => navigateToSlide(1)}
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

        {/* Slide 2: Company Video */}
        <section className="snap-start min-h-screen w-full relative overflow-hidden pt-16 sm:pt-0" data-slide-index="1">
          {/* Background */}
          <div className="absolute inset-0 z-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-black/60 to-black/90" />
          </div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-center py-8 sm:py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6">
                  Our
                  <span className="block font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Story
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Discover what makes Honeywell Aerospace a leader in innovation
                </p>
              </div>
              
              {/* Video Container */}
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/VPdIeoFRmxw?si=va_M-zyprTsGlcan"
                  title="Honeywell Aerospace Story"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: Company Stats */}
        <section className="snap-start min-h-screen w-full relative overflow-hidden pt-16 sm:pt-0" data-slide-index="2">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Honeywell Advanced Manufacturing Facility"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-center py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                  Where Innovation Meets
                  <span className="block font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Purpose
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Leading the future of aerospace technology with breakthrough innovations
                </p>
              </div>

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

              {/* Innovation highlights */}
              <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">Mission Critical</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Trusted systems for the most demanding environments</p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">Purpose-Driven</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Every innovation serves a greater purpose</p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-pink-600/20 to-red-600/20 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">Excellence</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Uncompromising commitment to quality</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4: Innovation */}
        <section className="snap-start min-h-screen w-full relative flex items-center overflow-hidden pt-16 sm:pt-0" data-slide-index="3">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Honeywell Aerospace Innovation Lab"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-blue-950/70 to-black/85" />
          </div>
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                    Innovation
                    <span className="block font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      That Matters
                    </span>
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {[
                      {
                        title: 'Aerospace Technologies',
                        description: 'Advanced propulsion systems, avionics, and flight management solutions',
                        icon: Target
                      },
                      {
                        title: 'Smart Manufacturing',
                        description: 'Industrial automation and process control systems',
                        icon: Building2
                      },
                      {
                        title: 'Sustainable Solutions',
                        description: 'Energy-efficient technologies for a cleaner future',
                        icon: Zap
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 sm:gap-4 md:gap-6">
                        <div className="flex-shrink-0">
                          <item.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-blue-400" />
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
                      { url: '/api/placeholder/600/600', title: 'Aerospace Innovation' },
                      { url: '/api/placeholder/600/600', title: 'Smart Manufacturing' },
                      { url: '/api/placeholder/600/600', title: 'Sustainable Tech' }
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

        {/* Slide 5: Culture & Values */}
        <section className="snap-start min-h-screen w-full relative flex items-center overflow-hidden pt-16 sm:pt-0" data-slide-index="4">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Honeywell Team Collaboration and Culture"
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
                    Where Innovation
                    <span className="block font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      Meets Purpose
                    </span>
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3 md:mb-4">
                        Our Mission
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                        We solve the world's most challenging problems, innovating for a safer, more secure, and sustainable world.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {[
                        { icon: Target, title: 'Purpose-Driven', desc: 'Every innovation serves a greater purpose' },
                        { icon: Users, title: 'Collaborative', desc: 'Diverse teams driving breakthrough solutions' },
                        { icon: Star, title: 'Excellence', desc: 'Uncompromising commitment to quality' },
                        { icon: TrendingUp, title: 'Continuous Learning', desc: 'Growing together through challenges' }
                      ].map((value, index) => (
                        <div key={index} className="p-3 sm:p-4 md:p-6 bg-white/5 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10">
                          <div className="mb-2 sm:mb-3">
                            <value.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-400" />
                          </div>
                          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">{value.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-400">{value.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
                    {[
                      { url: '/api/placeholder/600/600', title: 'Team Collaboration' },
                      { url: '/api/placeholder/600/600', title: 'Innovation Lab' },
                      { url: '/api/placeholder/600/600', title: 'Global Impact' }
                    ].map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === currentCultureImage ? 'opacity-100' : 'opacity-0'
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

        {/* Slide 6: Job Opportunities */}
        <section className="snap-start min-h-screen w-full relative overflow-hidden pt-16 sm:pt-0" data-slide-index="5">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/placeholder/1920/1080"
              alt="Honeywell Career Opportunities and Workplace"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-black/80 to-black/90" />
          </div>
          <div className="relative z-10 w-full py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 md:mb-8">
                  Join Our
                  <span className="block font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Mission
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                  Discover opportunities to shape the future of aerospace technology
                </p>
              </div>

              {/* Search and Filters */}
              <div className="mb-6 sm:mb-8 md:mb-12">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type="text"
                        placeholder="Search positions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 sm:px-6 py-3 sm:py-4 bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept} className="bg-gray-900">{dept}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 sm:px-6 py-3 sm:py-4 bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location} className="bg-gray-900">{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Opportunities - Course Card Inspired Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="group cursor-pointer overflow-hidden border-2 border-slate-700 bg-slate-800/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full rounded-2xl"
                  >
                    {/* Job Banner Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-125 group-hover:translate-x-3 group-hover:-translate-y-2">
                        <Image
                          src={job.image}
                          alt={job.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Urgent Badge */}
                      {job.urgent && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white rounded-full text-xs font-medium animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                            Urgent Hiring
                          </span>
                        </div>
                      )}

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group/bookmark"
                      >
                        {savedJobs.includes(job.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Bookmark className="h-5 w-5 text-white group-hover/bookmark:text-blue-400" />
                        )}
                      </button>
                    </div>

                    {/* Company Logo - Overlapping image and content */}
                    <div className="relative -mt-8 ml-6 z-10">
                      <div className="flex items-end gap-4">
                        <div className="relative w-32 h-16 bg-white rounded-xl p-3 flex items-center justify-center shadow-xl border-2 border-slate-700">
                          <Image
                            src="/media/organization_logo/honeywell.png"
                            alt="Honeywell"
                            width={96}
                            height={40}
                            className="object-contain max-h-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 pt-4">
                      <div className="space-y-4 flex-1">
                        {/* Job Title */}
                        <h3 className="text-white font-bold text-xl leading-tight group-hover:text-blue-100 transition-colors duration-300">
                          {job.title}
                        </h3>

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
                      </div>

                      {/* Action Button - Always at bottom */}
                      <div className="pt-4 mt-auto">
                        <button 
                          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group"
                          onClick={() => {
                            // Navigate to dedicated job page for CNC Machine Operator, otherwise show modal
                            if (job.id === 2) { // CNC Machine Operator
                              router.push('/employers/honeywell/jobs/cnc-machine-operator');
                            } else {
                              toggleJobExpansion(job.id);
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View Job Opportunity
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content Modal/Overlay */}
                    {expandedJob === job.id && (
                      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                        <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                          <button
                            onClick={() => setExpandedJob(null)}
                            className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200 backdrop-blur-md"
                          >
                            <X className="h-6 w-6 text-white" />
                          </button>
                          
                          <div className="overflow-y-auto max-h-full">
                            {/* Job Header */}
                            <div className="relative h-64 overflow-hidden">
                              <Image
                                src={job.image}
                                alt={job.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                              <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-3xl font-bold text-white mb-2">{job.title}</h2>
                                <div className="flex items-center gap-4 text-gray-300">
                                  <span className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    {job.department}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    {job.locations[0].city}, {job.locations[0].state}
                                  </span>
                                  <span className="flex items-center gap-2 text-green-400 font-medium">
                                    <DollarSign className="h-5 w-5" />
                                    {job.salaryRange}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-8 space-y-8">
                              {/* Job Description */}
                              <div>
                                <h3 className="text-xl font-bold text-white mb-4">About This Role</h3>
                                <p className="text-gray-300 leading-relaxed">{job.description}</p>
                              </div>
                              
                              {/* Requirements */}
                              <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                  <CheckCircle className="h-6 w-6 text-blue-400" />
                                  Requirements
                                </h3>
                                <div className="grid gap-3">
                                  {job.requirements.map((req, index) => (
                                    <div key={index} className="flex items-start gap-3 text-gray-300">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="leading-relaxed">{req}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Apply Button */}
                              <div className="flex gap-4 pt-6 border-t border-slate-700">
                                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-lg">
                                  Apply Now
                                </button>
                                <button
                                  onClick={() => toggleSaveJob(job.id)}
                                  className={`px-6 py-4 rounded-xl transition-all duration-300 border ${
                                    savedJobs.includes(job.id)
                                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'
                                      : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/50 hover:text-white'
                                  }`}
                                >
                                  {savedJobs.includes(job.id) ? (
                                    <BookmarkCheck className="h-6 w-6" />
                                  ) : (
                                    <Bookmark className="h-6 w-6" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>



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

        /* Improved snap scrolling */
        .snap-start {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        /* Smooth transitions for better UX */
        .snap-y {
          scroll-padding-top: 0;
          overscroll-behavior-y: contain;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .snap-y {
            scroll-behavior: auto;
          }
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
} 