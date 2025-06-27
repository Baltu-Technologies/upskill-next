'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  X,
  Database,
  Network,
  Monitor,
  Wrench,
  BrainCircuit,
  Rocket,
  TrendingUp,
  Server,
  Shield,
  CheckCircle,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react';

// Hero gallery images for data centers
const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop&crop=center',
    title: 'The Digital Backbone of Tomorrow',
    subtitle: 'Data centers power every app, website, and digital service you use daily'
  },
  {
    url: 'https://images.unsplash.com/photo-1515524738708-327f6b0037a7?w=1920&h=1080&fit=crop&crop=center',
    title: 'Where Innovation Meets Infrastructure',
    subtitle: 'State-of-the-art facilities supporting the digital economy'
  },
  {
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1920&h=1080&fit=crop&crop=center',
    title: 'Careers That Connect the World',
    subtitle: 'Join the team that keeps the internet running 24/7'
  },
  {
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=1080&fit=crop&crop=center',
    title: 'The Future is Being Built Here',
    subtitle: 'Cloud computing, AI, and edge computing all start in data centers'
  }
];

// Educational slides about data centers
const educationalSlides = [
  {
    icon: Database,
    title: 'What Are Data Centers?',
    description: 'Data centers are specialized buildings that house thousands of servers, networking equipment, and storage systems. Think of them as the physical backbone of the internet - every time you stream a video, send a message, or use an app, you\'re connecting to a data center.',
    facts: [
      'Data centers consume 1% of global electricity',
      'A single data center can house 100,000+ servers',
      'They operate 24/7/365 with 99.99% uptime requirements',
      'Arizona is becoming a major data center hub due to its strategic location'
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center'
  },
  {
    icon: Rocket,
    title: 'Why Data Centers Matter',
    description: 'Data centers enable everything we do online. From social media and streaming services to online banking and e-commerce, data centers process, store, and deliver the digital services that power our modern world.',
    facts: [
      'Support $2.9 trillion in U.S. economic activity annually',
      'Enable remote work for millions of people',
      'Power artificial intelligence and machine learning',
      'Critical for national security and emergency services'
    ],
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop&crop=center'
  },
  {
    icon: TrendingUp,
    title: 'Industry Growth & Opportunity',
    description: 'The data center industry is experiencing explosive growth. With cloud computing, AI, 5G, and IoT driving demand, skilled technicians are in high demand with excellent career prospects.',
    facts: [
      '15% annual job growth - much faster than average',
      'Starting salaries range from $45K-$65K',
      'Strong career advancement opportunities',
      'Skills transfer to many tech industries'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center'
  }
];

// Job roles in data centers
const jobRoles = [
  {
    icon: Server,
    title: 'Data Center Technician',
    description: 'Install, maintain, and troubleshoot servers and networking equipment',
    salary: '$45K - $65K',
    education: 'Certificate program or associate degree',
    growth: 'High demand',
    skills: ['Hardware troubleshooting', 'Network basics', 'Server management', 'Problem solving']
  },
  {
    icon: Network,
    title: 'Network Operations Specialist',
    description: 'Monitor network performance and respond to connectivity issues',
    salary: '$50K - $75K',
    education: 'Networking certification preferred',
    growth: 'Excellent growth',
    skills: ['Network monitoring', 'Cisco/Juniper', 'Troubleshooting', 'Communication']
  },
  {
    icon: Shield,
    title: 'Security Specialist',
    description: 'Ensure physical and digital security of data center facilities',
    salary: '$55K - $80K',
    education: 'Security training or military background',
    growth: 'High demand',
    skills: ['Physical security', 'Access control', 'Surveillance systems', 'Incident response']
  },
  {
    icon: Wrench,
    title: 'Facilities Maintenance Technician',
    description: 'Maintain HVAC, power, and cooling systems critical to operations',
    salary: '$48K - $70K',
    education: 'Trade school or apprenticeship',
    growth: 'Steady demand',
    skills: ['HVAC systems', 'Electrical work', 'Mechanical systems', 'Preventive maintenance']
  },
  {
    icon: BrainCircuit,
    title: 'Cloud Infrastructure Engineer',
    description: 'Design and implement cloud solutions for enterprise clients',
    salary: '$70K - $95K',
    education: 'Bachelor\'s degree or equivalent experience',
    growth: 'Very high demand',
    skills: ['AWS/Azure/GCP', 'Automation', 'Infrastructure as Code', 'DevOps']
  },
  {
    icon: Monitor,
    title: 'Systems Administrator',
    description: 'Manage operating systems and software across server environments',
    salary: '$60K - $85K',
    education: 'Associate degree or certifications',
    growth: 'Strong demand',
    skills: ['Linux/Windows Server', 'Scripting', 'Database management', 'System monitoring']
  }
];

// Partner companies offering internships
const partnerCompanies = [
  {
    id: 1,
    name: 'Phoenix Data Center Solutions',
    logo: '/media/arizona_data_center_alliance/qts_logo.png',
    locations: ['Phoenix, AZ', 'Scottsdale, AZ'],
    size: '800+ employees',
    description: 'Leading colocation and cloud infrastructure provider serving enterprise clients across the Southwest.',
    internshipPrograms: [
      {
        title: 'Data Center Operations Intern',
        duration: '12 weeks',
        pay: '$18-22/hour',
        spots: 8,
        description: 'Hands-on experience with server management, monitoring systems, and facility operations.'
      },
      {
        title: 'Network Infrastructure Intern',
        duration: '16 weeks',
        pay: '$20-25/hour',
        spots: 4,
        description: 'Learn about network design, implementation, and troubleshooting in enterprise environments.'
      }
    ],
    technologies: ['Dell EMC', 'Cisco Networking', 'VMware', 'AWS Direct Connect'],
    benefits: ['Health benefits', 'Mentorship program', 'Potential full-time offer', 'Industry certifications'],
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=300&fit=crop&crop=center',
    urgent: true
  },
  {
    id: 2,
    name: 'CyrusOne Arizona',
    logo: '/media/arizona_data_center_alliance/microsoft_logo.png',
    locations: ['Chandler, AZ', 'Phoenix, AZ'],
    size: '1,200+ employees',
    description: 'Global data center platform providing mission-critical facilities for enterprises and government.',
    internshipPrograms: [
      {
        title: 'Facilities Management Intern',
        duration: '10 weeks',
        pay: '$19-23/hour',
        spots: 6,
        description: 'Learn critical facility systems including power, cooling, and fire suppression.'
      },
      {
        title: 'IT Operations Intern',
        duration: '12 weeks',
        pay: '$21-26/hour',
        spots: 5,
        description: 'Experience with server provisioning, network configuration, and customer support.'
      }
    ],
    technologies: ['Schneider Electric', 'Vertiv Systems', 'Microsoft Azure', 'Oracle Cloud'],
    benefits: ['Competitive pay', 'Career development', 'Flexible schedule', 'Training stipend'],
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=300&fit=crop&crop=center',
    urgent: false
  },
  {
    id: 3,
    name: 'EdgeCore Digital Infrastructure',
    logo: '/media/arizona_data_center_alliance/edgecore_logo.png',
    locations: ['Mesa, AZ', 'Tempe, AZ'],
    size: '600+ employees',
    description: 'Developing hyperscale data centers for cloud service providers and large enterprises.',
    internshipPrograms: [
      {
        title: 'Cloud Infrastructure Intern',
        duration: '14 weeks',
        pay: '$22-27/hour',
        spots: 3,
        description: 'Work with cutting-edge cloud technologies and automation systems.'
      },
      {
        title: 'Security Operations Intern',
        duration: '12 weeks',
        pay: '$20-24/hour',
        spots: 4,
        description: 'Learn about physical and cyber security in critical infrastructure environments.'
      }
    ],
    technologies: ['Kubernetes', 'Terraform', 'Ansible', 'Prometheus'],
    benefits: ['Modern workspace', 'Innovation projects', 'Networking events', 'Certification support'],
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=300&fit=crop&crop=center',
    urgent: true
  },
  {
    id: 4,
    name: 'Digital Realty Arizona',
    logo: '/media/arizona_data_center_alliance/vantage_logo.png',
    locations: ['Phoenix, AZ', 'Goodyear, AZ'],
    size: '2,000+ employees globally',
    description: 'Global leader in data center, colocation and interconnection solutions.',
    internshipPrograms: [
      {
        title: 'Data Center Engineering Intern',
        duration: '16 weeks',
        pay: '$23-28/hour',
        spots: 2,
        description: 'Advanced internship focusing on data center design and optimization.'
      },
      {
        title: 'Customer Solutions Intern',
        duration: '10 weeks',
        pay: '$19-24/hour',
        spots: 6,
        description: 'Learn about customer onboarding, technical support, and account management.'
      }
    ],
    technologies: ['ServiceNow', 'PlatformDIGITAL', 'Data center automation', 'Edge computing'],
    benefits: ['Global opportunities', 'Executive mentorship', 'Innovation labs', 'Travel opportunities'],
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=300&fit=crop&crop=center',
    urgent: false
  },
  {
    id: 5,
    name: 'Iron Mountain Data Centers',
    logo: '/media/arizona_data_center_alliance/meta_logo.jpg',
    locations: ['Scottsdale, AZ'],
    size: '500+ employees',
    description: 'Trusted partner for data center services, cloud solutions, and information management.',
    internshipPrograms: [
      {
        title: 'Operations Support Intern',
        duration: '12 weeks',
        pay: '$18-22/hour',
        spots: 7,
        description: 'Support daily data center operations and learn industry best practices.'
      },
      {
        title: 'Sustainability Intern',
        duration: '14 weeks',
        pay: '$20-25/hour',
        spots: 2,
        description: 'Work on green energy initiatives and sustainability reporting.'
      }
    ],
    technologies: ['DCIM software', 'Energy management systems', 'Cooling optimization', 'Renewable energy'],
    benefits: ['Sustainability focus', 'Community impact', 'Diverse teams', 'Professional development'],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=300&fit=crop&crop=center',
    urgent: false
  }
];

export default function ArizonaDataCenterAlliancePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentEducationalSlide, setCurrentEducationalSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [savedCompanies, setSavedCompanies] = useState<number[]>([]);
  const [expandedInternships, setExpandedInternships] = useState<{[key: string]: boolean}>({});
  const [activeSection, setActiveSection] = useState('hero');

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance educational slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEducationalSlide((prev) => (prev + 1) % educationalSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Scroll-based section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'education', 'careers', 'partners'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const navigateToEducationalSlide = (slideIndex: number) => {
    setCurrentEducationalSlide(slideIndex);
  };

  const toggleSaveCompany = (companyId: number) => {
    setSavedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const toggleInternshipExpansion = (key: string) => {
    setExpandedInternships(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Arizona Data Center
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Alliance
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-2">
              {heroImages[currentSlide].title}
            </p>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {heroImages[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="#education"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Explore Opportunities
            </a>
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Overview
            </button>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-blue-400 scale-110' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section id="education" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Understanding Data Centers
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover the fascinating world of data centers and why they're essential to our digital future
            </p>
          </div>

          {/* Educational Slide Show */}
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            {educationalSlides.map((slide, index) => (
              <div
                key={index}
                className={`transition-opacity duration-1000 ${
                  index === currentEducationalSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <slide.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white">{slide.title}</h3>
                    </div>
                    
                    <p className="text-lg text-slate-300 leading-relaxed">
                      {slide.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-xl font-semibold text-white">Key Facts:</h4>
                      <ul className="space-y-2">
                        {slide.facts.map((fact, factIndex) => (
                          <li key={factIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="relative">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={600}
                      height={400}
                      className="rounded-xl object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Educational slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {educationalSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToEducationalSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentEducationalSlide ? 'bg-blue-400' : 'bg-slate-500 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Internship Opportunities Section - Tesla-inspired minimal design */}
      <section id="partners" className="snap-start min-h-screen w-full relative overflow-hidden pt-16 sm:pt-0">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop&crop=center"
            alt="Data Center Internship Opportunities"
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
                Internship
                <span className="block font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Opportunities
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                Start your data center career with hands-on experience at leading companies
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 sm:mb-8 md:mb-12">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search internships..."
                      className="w-full px-6 py-4 bg-black/20 backdrop-blur-xl border border-gray-800/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <select
                  className="px-6 py-4 bg-black/20 backdrop-blur-xl border border-gray-800/50 rounded-full text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all duration-300 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                >
                  <option value="all">All Companies</option>
                  {partnerCompanies.map(company => (
                    <option key={company.id} value={company.name} className="bg-gray-900">{company.name}</option>
                  ))}
                </select>
                
                <select
                  className="px-6 py-4 bg-black/20 backdrop-blur-xl border border-gray-800/50 rounded-full text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all duration-300 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                >
                  <option value="all">All Locations</option>
                  <option value="Phoenix" className="bg-gray-900">Phoenix, AZ</option>
                  <option value="Scottsdale" className="bg-gray-900">Scottsdale, AZ</option>
                  <option value="Chandler" className="bg-gray-900">Chandler, AZ</option>
                  <option value="Mesa" className="bg-gray-900">Mesa, AZ</option>
                  <option value="Tempe" className="bg-gray-900">Tempe, AZ</option>
                  <option value="Goodyear" className="bg-gray-900">Goodyear, AZ</option>
                </select>
              </div>
            </div>

            {/* Internship Opportunities - Course Card Inspired Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {partnerCompanies.flatMap((company) =>
                company.internshipPrograms.map((program, programIndex) => {
                  const internshipId = `${company.id}-${programIndex}`;
                  return (
                    <div 
                      key={internshipId} 
                      className="group cursor-pointer overflow-hidden border-2 border-slate-700 bg-slate-800/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full rounded-2xl"
                    >
                      {/* Internship Banner Image */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-125 group-hover:translate-x-3 group-hover:-translate-y-2">
                          <Image
                            src={company.image}
                            alt={program.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Urgent Badge */}
                        {company.urgent && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white rounded-full text-xs font-medium animate-pulse">
                              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                              Urgent Hiring
                            </span>
                          </div>
                        )}

                        {/* Spots Available Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white rounded-full text-xs font-medium">
                            {program.spots} spots available
                          </span>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveCompany(company.id);
                          }}
                          className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group/bookmark"
                        >
                          {savedCompanies.includes(company.id) ? (
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
                              src={company.logo}
                              alt={company.name}
                              width={96}
                              height={40}
                              className="object-contain max-h-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 pt-4">
                        <div className="space-y-4 flex-1">
                          {/* Internship Title */}
                          <h3 className="text-white font-bold text-xl leading-tight group-hover:text-blue-100 transition-colors duration-300">
                            {program.title}
                          </h3>

                          {/* Company Name */}
                          <p className="text-blue-400 font-medium text-sm">
                            {company.name}
                          </p>

                          {/* Internship Description */}
                          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                            {program.description}
                          </p>

                          {/* Location and Pay */}
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-300 text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                              {company.locations[0]}
                            </div>
                            <div className="flex items-center text-green-400 font-medium text-sm">
                              <DollarSign className="h-4 w-4 mr-2" />
                              {program.pay}
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center text-yellow-400 text-sm">
                            <Clock className="h-4 w-4 mr-2" />
                            {program.duration}
                          </div>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1">
                            {company.technologies.slice(0, 2).map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                            {company.technologies.length > 2 && (
                              <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                                +{company.technologies.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button - Always at bottom */}
                        <div className="pt-4 mt-auto">
                          <button 
                            className="w-full bg-black/30 hover:bg-black/50 border border-gray-700/50 hover:border-blue-400/50 text-white py-4 px-6 rounded-full font-light transition-all duration-300 hover:shadow-lg group"
                            onClick={() => toggleInternshipExpansion(internshipId)}
                          >
                            View Internship Details
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content Modal/Overlay */}
                      {expandedInternships[internshipId] && (
                        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                            <button
                              onClick={() => toggleInternshipExpansion(internshipId)}
                              className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200 backdrop-blur-md"
                            >
                              <X className="h-6 w-6 text-white" />
                            </button>
                            
                            <div className="overflow-y-auto max-h-full">
                              {/* Internship Header */}
                              <div className="relative h-64 overflow-hidden">
                                <Image
                                  src={company.image}
                                  alt={program.title}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                  <h2 className="text-3xl font-bold text-white mb-2">{program.title}</h2>
                                  <div className="flex items-center gap-6 text-gray-300">
                                    <span className="font-light">
                                      {company.name}
                                    </span>
                                    <span className="font-light">
                                      {company.locations.join(', ')}
                                    </span>
                                    <span className="text-green-400 font-medium">
                                      {program.pay}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-8 space-y-8">
                                {/* Internship Description */}
                                <div>
                                  <h3 className="text-xl font-bold text-white mb-4">About This Internship</h3>
                                  <p className="text-gray-300 leading-relaxed">{program.description}</p>
                                </div>
                                
                                {/* Company Info */}
                                <div>
                                  <h3 className="text-xl font-bold text-white mb-4">About {company.name}</h3>
                                  <p className="text-gray-300 leading-relaxed mb-4">{company.description}</p>
                                  <div className="flex items-center gap-6 text-sm text-gray-400">
                                    <span className="font-light">
                                      {company.size}
                                    </span>
                                    <span className="font-light">
                                      {program.duration}
                                    </span>
                                    <span className="text-green-400 font-medium">
                                      {program.spots} positions available
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Technologies */}
                                <div>
                                  <h3 className="text-xl font-light text-white mb-4">
                                    Technologies You'll Work With
                                  </h3>
                                  <div className="flex flex-wrap gap-3">
                                    {company.technologies.map((tech, index) => (
                                      <span key={index} className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm font-medium border border-blue-600/30">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Benefits */}
                                <div>
                                  <h3 className="text-xl font-light text-white mb-4">
                                    Benefits & Perks
                                  </h3>
                                  <div className="grid gap-3">
                                    {company.benefits.map((benefit, index) => (
                                      <div key={index} className="flex items-start gap-3 text-gray-300">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                                        <span className="leading-relaxed font-light">{benefit}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Apply Button */}
                                <div className="flex gap-4 pt-6 border-t border-slate-700">
                                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-lg">
                                    Apply for Internship
                                  </button>
                                  <button
                                    onClick={() => toggleSaveCompany(company.id)}
                                    className={`px-6 py-4 rounded-xl transition-all duration-300 border ${
                                      savedCompanies.includes(company.id)
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'
                                        : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                                  >
                                    {savedCompanies.includes(company.id) ? (
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
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities Section - Tesla-inspired minimal design */}
      <section id="careers" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
              Career
              <span className="block font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Explore exciting career paths in the data center industry with excellent growth potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobRoles.map((role, index) => (
              <div key={index} className="group bg-black/20 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-[1.02]">
                <div className="mb-6">
                  <h3 className="text-2xl font-light text-white mb-2">{role.title}</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
                </div>

                <p className="text-slate-300 mb-8 leading-relaxed">{role.description}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-slate-400 font-light">Salary Range</span>
                    <span className="text-green-400 font-medium">{role.salary}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-slate-400 font-light">Education</span>
                    <span className="text-white text-sm text-right max-w-48">{role.education}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-slate-400 font-light">Job Growth</span>
                    <span className="text-blue-400 font-medium">{role.growth}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-light text-slate-300 mb-4">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-4 py-2 bg-slate-800/50 text-slate-300 rounded-full text-sm font-light border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-cyan-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Data Center Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the digital infrastructure revolution and build the future of technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/employers/career-matches"
              className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Find Your Match
            </Link>
            <Link
              href="/study-hub"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 border-2 border-white/20"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/20">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/XZmGGAbHqa0"
              title="Data Center Overview"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
} 