'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, ChevronDown, MapPin, Users, Star, Clock, Bookmark, ChevronRight, Search, Filter } from 'lucide-react';

// Mock job data for TSMC
const mockJobs = [
  {
    id: 1,
    title: "Process Engineer",
    department: "Manufacturing",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 12 },
      { city: "Tempe", state: "AZ", openings: 8 }
    ],
    salaryRange: "$85,000 - $120,000",
    type: "Full-time",
    urgent: true,
    requirements: [
      "Bachelor's degree in Chemical, Materials, or Electrical Engineering",
      "2+ years experience in semiconductor manufacturing",
      "Knowledge of wafer fabrication processes",
      "Experience with statistical process control (SPC)",
      "Strong analytical and problem-solving skills"
    ],
    description: "Lead process optimization and yield improvement initiatives in our advanced semiconductor fabrication facility."
  },
  {
    id: 2,
    title: "Equipment Engineer",
    department: "Engineering",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 6 },
      { city: "Chandler", state: "AZ", openings: 4 }
    ],
    salaryRange: "$90,000 - $130,000",
    type: "Full-time",
    urgent: false,
    requirements: [
      "Bachelor's degree in Mechanical, Electrical, or Industrial Engineering",
      "3+ years experience with semiconductor equipment",
      "Knowledge of lithography, etching, or deposition tools",
      "Experience with equipment troubleshooting and maintenance",
      "Strong technical documentation skills"
    ],
    description: "Maintain and optimize advanced semiconductor manufacturing equipment to ensure maximum uptime and performance."
  },
  {
    id: 3,
    title: "Quality Assurance Specialist",
    department: "Quality",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 5 },
      { city: "Mesa", state: "AZ", openings: 3 }
    ],
    salaryRange: "$70,000 - $95,000",
    type: "Full-time",
    urgent: false,
    requirements: [
      "Bachelor's degree in Engineering or related field",
      "2+ years experience in semiconductor quality control",
      "Knowledge of ISO 9001 and IATF 16949 standards",
      "Experience with failure analysis and root cause analysis",
      "Strong attention to detail and analytical skills"
    ],
    description: "Ensure product quality and compliance through comprehensive testing and analysis of semiconductor devices."
  },
  {
    id: 4,
    title: "Facility Technician",
    department: "Facilities",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 8 },
      { city: "Tempe", state: "AZ", openings: 4 }
    ],
    salaryRange: "$55,000 - $75,000",
    type: "Full-time",
    urgent: true,
    requirements: [
      "High school diploma or equivalent",
      "2+ years experience in cleanroom environments",
      "Knowledge of HVAC, electrical, and plumbing systems",
      "Understanding of semiconductor facility requirements",
      "Ability to work rotating shifts"
    ],
    description: "Maintain critical facility systems including cleanroom environments, utilities, and safety systems."
  },
  {
    id: 5,
    title: "R&D Engineer",
    department: "Research",
    locations: [
      { city: "Phoenix", state: "AZ", openings: 4 },
      { city: "Chandler", state: "AZ", openings: 2 }
    ],
    salaryRange: "$95,000 - $140,000",
    type: "Full-time",
    urgent: false,
    requirements: [
      "Master's degree in Electrical Engineering or Physics",
      "5+ years experience in semiconductor R&D",
      "Knowledge of advanced node technologies (7nm, 5nm, 3nm)",
      "Experience with process development and characterization",
      "Strong publication record preferred"
    ],
    description: "Drive innovation in next-generation semiconductor technologies and advanced manufacturing processes."
  }
];

// Hero slideshow images
const heroImages = [
  {
    url: "/api/placeholder/1920/1080",
    title: "Leading Semiconductor Innovation",
    subtitle: "Advancing the world's most advanced chip manufacturing"
  },
  {
    url: "/api/placeholder/1920/1080",
    title: "Cutting-Edge Fabrication",
    subtitle: "Building the future with 3nm and beyond technologies"
  },
  {
    url: "/api/placeholder/1920/1080",
    title: "Arizona Manufacturing Hub",
    subtitle: "Creating thousands of high-tech jobs in the Southwest"
  }
];

export default function TSMCPage() {
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
        className="fixed top-8 left-8 z-30 p-3 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-black/70 transition-all duration-300 group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
      </Link>

      {/* Slide Navigation Sidebar */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-4">
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

      {/* Slide Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-300"
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
              title="TSMC Company Video"
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
        <section className="snap-start h-screen w-full relative flex items-center" data-slide-index="0">
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
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-4xl">
                {/* Company Logo & Badge */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center border border-white/20">
                    <div className="text-xl font-bold text-white">TSMC</div>
                  </div>
                  <div className="px-4 py-2 bg-green-500/20 backdrop-blur-md text-green-400 rounded-full text-sm font-medium border border-green-500/30 animate-pulse">
                    ✨ Actively Hiring
                  </div>
                </div>

                {/* Dynamic Hero Text */}
                <div className="space-y-6">
                  <h1 className="text-7xl font-light text-white leading-tight">
                    Taiwan
                    <br />
                    <span className="font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      Semiconductor
                    </span>
                  </h1>
                  
                  <div className="h-16 overflow-hidden">
                    <div 
                      className="transition-transform duration-1000 ease-in-out"
                      style={{ transform: `translateY(-${currentHeroImage * 4}rem)` }}
                    >
                      {heroImages.map((image, index) => (
                        <div key={index} className="h-16 flex flex-col justify-center">
                          <p className="text-2xl font-light text-gray-200">{image.title}</p>
                          <p className="text-lg text-gray-400">{image.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-6 pt-8">
                    <button 
                      onClick={() => navigateToSlide(4)}
                      className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Careers
                    </button>
                    <button 
                      onClick={() => setShowVideoModal(true)}
                      className="flex items-center gap-3 px-8 py-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
                    >
                      <Play className="h-5 w-5" />
                      Watch Our Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Navigation Dots */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentHeroImage 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white/60" />
          </div>
        </section>

        {/* Slide 2: Stats Bar */}
        <section className="snap-start h-screen w-full relative flex items-center bg-black/95 backdrop-blur-md" data-slide-index="1">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-light text-white mb-4">
                  Global Semiconductor
                  <span className="block font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Leader
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  As the world's largest contract chip manufacturer, TSMC produces over 90% of the world's most advanced semiconductors
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-red-400">54%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Market Share</h3>
                  <p className="text-gray-400">Global foundry market leadership</p>
                </div>

                <div className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-red-400">3nm</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Leading Node</h3>
                  <p className="text-gray-400">Most advanced chip technology</p>
                </div>

                <div className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-red-400">$70B</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Annual Revenue</h3>
                  <p className="text-gray-400">2023 record performance</p>
                </div>

                <div className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-red-400">75K+</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Employees</h3>
                  <p className="text-gray-400">Global workforce</p>
                </div>
              </div>

              <div className="mt-16 text-center">
                <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl border border-red-500/20">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-lg font-medium text-white">Arizona Fab Construction: 85% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: Innovation & Technology */}
        <section className="snap-start h-screen w-full relative flex items-center bg-gradient-to-br from-gray-900 to-black" data-slide-index="2">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-5xl font-light text-white mb-8">
                    Technology
                    <span className="block font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      Leadership
                    </span>
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30 flex-shrink-0">
                        <span className="text-red-400 font-bold">3nm</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Advanced Process Technology</h3>
                        <p className="text-gray-300">Leading the industry with 3nm process technology, enabling unprecedented performance and efficiency in chip design.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30 flex-shrink-0">
                        <span className="text-red-400 font-bold">AI</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">AI & Machine Learning</h3>
                        <p className="text-gray-300">Powering the AI revolution with specialized chips for machine learning, autonomous vehicles, and data centers.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30 flex-shrink-0">
                        <span className="text-red-400 font-bold">5G</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">5G & Connectivity</h3>
                        <p className="text-gray-300">Manufacturing the chips that enable 5G networks, IoT devices, and the connected world of tomorrow.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl border border-red-500/20 p-8 backdrop-blur-md">
                    <Image
                      src="/api/placeholder/600/600"
                      alt="TSMC Semiconductor Wafer"
                      width={600}
                      height={600}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">300mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4: Culture & Values */}
        <section className="snap-start h-screen w-full relative flex items-center bg-gradient-to-br from-black to-gray-900" data-slide-index="3">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-light text-white mb-8">
                  Our
                  <span className="block font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Culture
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Built on integrity, commitment, innovation, and customer trust - the foundation of our global success
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Innovation Excellence</h3>
                  <p className="text-gray-300">Pioneering breakthrough technologies that shape the future of computing and connectivity.</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Customer Partnership</h3>
                  <p className="text-gray-300">Building lasting relationships with the world's leading technology companies and innovators.</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Sustainability</h3>
                  <p className="text-gray-300">Committed to environmental responsibility and sustainable manufacturing practices.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl border border-red-500/20 p-8 backdrop-blur-md">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Join Our Mission</h3>
                    <p className="text-gray-300 mb-6">
                      Be part of a team that's enabling the technologies of tomorrow. From smartphones to supercomputers, 
                      your work at TSMC will impact billions of lives around the world.
                    </p>
                    <button 
                      onClick={() => setShowVideoModal(true)}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                    >
                      <Play className="h-5 w-5" />
                      Watch Culture Video
                    </button>
                  </div>
                  <div className="relative">
                    <Image
                      src="/api/placeholder/400/300"
                      alt="TSMC Team Culture"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 5: Careers & Jobs */}
        <section className="snap-start h-screen w-full relative bg-black overflow-y-auto" data-slide-index="4">
          <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-light text-white mb-4">
                  Career
                  <span className="block font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Opportunities
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Join the world's leading semiconductor manufacturer and help build the technologies that power our digital future
                </p>
              </div>

              {/* Job Search & Filters */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>

                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Listings */}
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-red-500/50 transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{job.title}</h3>
                            {job.urgent && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full border border-red-500/30">
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded">{job.department}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.locations.map(loc => `${loc.city}, ${loc.state}`).join(' • ')}
                            </span>
                            <span>{job.type}</span>
                          </div>
                          <p className="text-gray-300 mb-4">{job.description}</p>
                          <div className="flex items-center gap-6">
                            <span className="text-green-400 font-semibold">{job.salaryRange}</span>
                            <div className="flex items-center gap-2">
                              {job.locations.map((location, idx) => (
                                <span key={idx} className="text-sm text-gray-400">
                                  {location.city}: {location.openings} opening{location.openings !== 1 ? 's' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              savedJobs.includes(job.id)
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            <Bookmark className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => toggleJobExpansion(job.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                          >
                            {expandedJob === job.id ? 'Hide Details' : 'View Details'}
                            <ChevronRight className={`h-4 w-4 transition-transform ${expandedJob === job.id ? 'rotate-90' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {expandedJob === job.id && (
                        <div className="border-t border-white/10 pt-6 mt-6">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-4">Requirements</h4>
                              <ul className="space-y-2">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-red-400 mt-1">•</span>
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-4">Location Details</h4>
                              <div className="space-y-3">
                                {job.locations.map((location, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                    <span className="text-white">{location.city}, {location.state}</span>
                                    <span className="text-red-400 font-semibold">{location.openings} positions</span>
                                  </div>
                                ))}
                              </div>
                              <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold">
                                Apply Now
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No positions found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria or check back later for new opportunities.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 