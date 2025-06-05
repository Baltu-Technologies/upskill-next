"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { EmojiSlider } from '../ui/EmojiSlider';
import { TechDomain, UserInterest } from '../../data/mockCareerData';
import { cn } from '@/lib/utils';

interface TechDomainSelectorProps {
  techDomains: TechDomain[];
  userInterests: UserInterest[];
  onInterestChange: (interest: UserInterest) => void;
  className?: string;
}

// Technology domain images mapping (placeholder images for demo)
const getTechDomainImage = (domainId: string): string => {
  const imageMap: Record<string, string> = {
    'manufacturing': '/api/placeholder/300/200?text=Manufacturing',
    'automotive': '/api/placeholder/300/200?text=Automotive+Tech',
    'semiconductors': '/api/placeholder/300/200?text=Semiconductors',
    'robotics-automation': '/api/placeholder/300/200?text=Robotics',
    'telecommunications': '/api/placeholder/300/200?text=Telecom',
    'hardware-infrastructure': '/api/placeholder/300/200?text=Hardware',
    'networking': '/api/placeholder/300/200?text=Networking',
    'electrical-systems': '/api/placeholder/300/200?text=Electrical',
    'cloud-computing': '/api/placeholder/300/200?text=Cloud',
    'default': '/api/placeholder/300/200?text=Technology'
  };
  return imageMap[domainId] || imageMap.default;
};

// Subdomain images mapping
const getSubdomainImage = (subdomainId: string): string => {
  const imageMap: Record<string, string> = {
    // Manufacturing subdomains
    'cnc-programming': '/api/placeholder/200/120?text=CNC+Programming',
    'precision-measurement': '/api/placeholder/200/120?text=Precision+Measurement',
    'cad-cam': '/api/placeholder/200/120?text=CAD+CAM',
    'quality-control': '/api/placeholder/200/120?text=Quality+Control',
    
    // Automotive subdomains
    'automotive-diagnostics': '/api/placeholder/200/120?text=Auto+Diagnostics',
    'ev-systems': '/api/placeholder/200/120?text=EV+Systems',
    'hybrid-technology': '/api/placeholder/200/120?text=Hybrid+Tech',
    
    // Semiconductors subdomains
    'cleanroom-operations': '/api/placeholder/200/120?text=Cleanroom+Ops',
    'wafer-processing': '/api/placeholder/200/120?text=Wafer+Processing',
    'semiconductor-testing': '/api/placeholder/200/120?text=Semi+Testing',
    
    // Robotics subdomains
    'industrial-robotics': '/api/placeholder/200/120?text=Industrial+Robotics',
    'robot-programming': '/api/placeholder/200/120?text=Robot+Programming',
    'automation-systems': '/api/placeholder/200/120?text=Automation+Systems',
    
    // Telecommunications subdomains
    'fiber-optics': '/api/placeholder/200/120?text=Fiber+Optics',
    'network-infrastructure': '/api/placeholder/200/120?text=Network+Infrastructure',
    '5g-technology': '/api/placeholder/200/120?text=5G+Technology',
    
    // Hardware subdomains
    'data-center-ops': '/api/placeholder/200/120?text=Data+Center+Ops',
    'server-maintenance': '/api/placeholder/200/120?text=Server+Maintenance',
    'hardware-troubleshooting': '/api/placeholder/200/120?text=Hardware+Troubleshooting',
    
    // Networking subdomains
    'structured-cabling': '/api/placeholder/200/120?text=Structured+Cabling',
    'network-security': '/api/placeholder/200/120?text=Network+Security',
    'wireless-systems': '/api/placeholder/200/120?text=Wireless+Systems',
    
    // Default
    'default': '/api/placeholder/200/120?text=Technology'
  };
  return imageMap[subdomainId] || imageMap.default;
};

// Technology domain color schemes
const getDomainColorScheme = (domainId: string) => {
  const colorSchemes: Record<string, {
    bg: string;
    bgDark: string;
    border: string;
    borderDark: string;
    ring: string;
  }> = {
    'manufacturing': {
      bg: 'bg-orange-50',
      bgDark: 'dark:bg-orange-900/10',
      border: 'border-orange-200',
      borderDark: 'dark:border-orange-800/30',
      ring: 'ring-orange-500'
    },
    'automotive': {
      bg: 'bg-blue-50',
      bgDark: 'dark:bg-blue-900/10',
      border: 'border-blue-200',
      borderDark: 'dark:border-blue-800/30',
      ring: 'ring-blue-500'
    },
    'semiconductors': {
      bg: 'bg-purple-50',
      bgDark: 'dark:bg-purple-900/10',
      border: 'border-purple-200',
      borderDark: 'dark:border-purple-800/30',
      ring: 'ring-purple-500'
    },
    'robotics-automation': {
      bg: 'bg-green-50',
      bgDark: 'dark:bg-green-900/10',
      border: 'border-green-200',
      borderDark: 'dark:border-green-800/30',
      ring: 'ring-green-500'
    },
    'telecommunications': {
      bg: 'bg-cyan-50',
      bgDark: 'dark:bg-cyan-900/10',
      border: 'border-cyan-200',
      borderDark: 'dark:border-cyan-800/30',
      ring: 'ring-cyan-500'
    },
    'hardware-infrastructure': {
      bg: 'bg-indigo-50',
      bgDark: 'dark:bg-indigo-900/10',
      border: 'border-indigo-200',
      borderDark: 'dark:border-indigo-800/30',
      ring: 'ring-indigo-500'
    },
    'networking': {
      bg: 'bg-emerald-50',
      bgDark: 'dark:bg-emerald-900/10',
      border: 'border-emerald-200',
      borderDark: 'dark:border-emerald-800/30',
      ring: 'ring-emerald-500'
    },
    'electrical-systems': {
      bg: 'bg-yellow-50',
      bgDark: 'dark:bg-yellow-900/10',
      border: 'border-yellow-200',
      borderDark: 'dark:border-yellow-800/30',
      ring: 'ring-yellow-500'
    },
    'cloud-computing': {
      bg: 'bg-sky-50',
      bgDark: 'dark:bg-sky-900/10',
      border: 'border-sky-200',
      borderDark: 'dark:border-sky-800/30',
      ring: 'ring-sky-500'
    }
  };
  
  return colorSchemes[domainId] || {
    bg: 'bg-gray-50',
    bgDark: 'dark:bg-gray-800',
    border: 'border-gray-200',
    borderDark: 'dark:border-gray-700',
    ring: 'ring-gray-500'
  };
};

export const TechDomainSelector: React.FC<TechDomainSelectorProps> = ({
  techDomains,
  userInterests,
  onInterestChange,
  className
}) => {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  const toggleDomain = (domainId: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId);
    } else {
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  };

  const getDomainInterest = (domainId: string): 0 | 1 | 2 | 3 => {
    const interest = userInterests.find(
      i => i.type === 'tech' && i.domainId === domainId && !i.subdomainId
    );
    return interest?.weight ?? 1;
  };

  const getSubdomainInterest = (subdomainId: string): 0 | 1 | 2 | 3 => {
    const interest = userInterests.find(
      i => i.type === 'tech' && i.subdomainId === subdomainId
    );
    return interest?.weight ?? 1;
  };

  const handleDomainInterestChange = (domainId: string, weight: 0 | 1 | 2 | 3) => {
    onInterestChange({
      domainId,
      type: 'tech',
      weight
    });
  };

  const handleSubdomainInterestChange = (subdomainId: string, weight: 0 | 1 | 2 | 3) => {
    onInterestChange({
      subdomainId,
      type: 'tech',
      weight
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Technology Domains
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Rate your interest in technology areas. Explore specific technologies within each domain.
        </p>
      </div>

      {/* Technology Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
        {techDomains.map((domain) => {
          const domainInterest = getDomainInterest(domain.id);
          const isExpanded = expandedDomains.has(domain.id);
          const colorScheme = getDomainColorScheme(domain.id);
          
          return (
            <div 
              key={domain.id} 
              className={cn(
                "rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300",
                colorScheme.bg,
                colorScheme.bgDark,
                colorScheme.border,
                colorScheme.borderDark,
                "border",
                isExpanded && `md:col-span-2 ring-2 ${colorScheme.ring} ring-opacity-50`
              )}
            >
              {!isExpanded ? (
                /* Collapsed Domain Card */
                <div className="relative">
                  {/* Domain Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={getTechDomainImage(domain.id)}
                      alt={domain.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-white font-bold text-lg">
                        {domain.name}
                      </h3>
                    </div>
                  </div>

                  {/* Domain Content */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {domain.description}
                    </p>
                    
                    {/* Interest Rating */}
                    <div className="mb-4">
                      <EmojiSlider
                        value={domainInterest}
                        onChange={(weight) => handleDomainInterestChange(domain.id, weight)}
                        label={`Interest in ${domain.name}`}
                      />
                    </div>

                    {/* Explore Technologies Button */}
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex flex-col items-start space-y-1">
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4" />
                          <span className="font-medium">Explore Specific Technologies</span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {domain.subdomains.length} technologies available
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Expanded Domain Card */
                <div className="p-6">
                  {/* Header with Domain Info and Collapse Button */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getTechDomainImage(domain.id)}
                          alt={domain.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {domain.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {domain.description}
                        </p>
                        <div className="max-w-xs">
                          <EmojiSlider
                            value={domainInterest}
                            onChange={(weight) => handleDomainInterestChange(domain.id, weight)}
                            label={`Interest in ${domain.name}`}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span className="text-sm font-medium">Collapse</span>
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Subdomains Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
                      Specific Technologies
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {domain.subdomains.map((subdomain) => {
                        const subdomainInterest = getSubdomainInterest(subdomain.id);
                        
                        return (
                          <div 
                            key={subdomain.id}
                            className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            {/* Subdomain Image */}
                            <div className="h-24 relative overflow-hidden">
                              <img
                                src={getSubdomainImage(subdomain.id)}
                                alt={subdomain.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <div className="absolute bottom-1 left-2">
                                <h5 className="text-white font-semibold text-xs">
                                  {subdomain.name}
                                </h5>
                              </div>
                            </div>

                            {/* Subdomain Content */}
                            <div className="p-3">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {subdomain.description}
                              </p>
                              
                              <EmojiSlider
                                value={subdomainInterest}
                                onChange={(weight) => handleSubdomainInterestChange(subdomain.id, weight)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Selection Summary
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          You've rated {userInterests.filter(i => i.type === 'tech').length} technology areas. 
          Expand each domain to explore and rate specific technologies for more precise recommendations.
        </p>
      </div>
    </div>
  );
}; 