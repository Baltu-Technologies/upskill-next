"use client";

import React, { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { EmojiSlider } from '../ui/EmojiSlider';
import { IndustryDomain, UserInterest } from '../../data/mockCareerData';
import { cn } from '@/lib/utils';

interface IndustryDomainSelectorProps {
  industryDomains: IndustryDomain[];
  userInterests: UserInterest[];
  onInterestChange: (interest: UserInterest) => void;
  className?: string;
}

// Industry domain color schemes
const getDomainColorScheme = (domainId: string) => {
  const colorMap: Record<string, { bg: string; border: string; button: string; buttonHover: string }> = {
    'advanced-manufacturing': { 
      bg: 'bg-orange-50 dark:bg-orange-900/10', 
      border: 'border-orange-200 dark:border-orange-800/50',
      button: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      buttonHover: 'text-orange-600 dark:text-orange-400'
    },
    'aerospace-defense': { 
      bg: 'bg-slate-50 dark:bg-slate-900/10', 
      border: 'border-slate-200 dark:border-slate-800/50',
      button: 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
      buttonHover: 'text-slate-600 dark:text-slate-400'
    },
    'automotive-mobility': { 
      bg: 'bg-blue-50 dark:bg-blue-900/10', 
      border: 'border-blue-200 dark:border-blue-800/50',
      button: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      buttonHover: 'text-blue-600 dark:text-blue-400'
    },
    'energy-utilities': { 
      bg: 'bg-yellow-50 dark:bg-yellow-900/10', 
      border: 'border-yellow-200 dark:border-yellow-800/50',
      button: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      buttonHover: 'text-yellow-600 dark:text-yellow-400'
    },
    'sustainable-green': { 
      bg: 'bg-green-50 dark:bg-green-900/10', 
      border: 'border-green-200 dark:border-green-800/50',
      button: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      buttonHover: 'text-green-600 dark:text-green-400'
    },
    'data-centers': { 
      bg: 'bg-indigo-50 dark:bg-indigo-900/10', 
      border: 'border-indigo-200 dark:border-indigo-800/50',
      button: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      buttonHover: 'text-indigo-600 dark:text-indigo-400'
    },
    'telecommunications': { 
      bg: 'bg-cyan-50 dark:bg-cyan-900/10', 
      border: 'border-cyan-200 dark:border-cyan-800/50',
      button: 'bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      buttonHover: 'text-cyan-600 dark:text-cyan-400'
    },
    'smart-cities': { 
      bg: 'bg-purple-50 dark:bg-purple-900/10', 
      border: 'border-purple-200 dark:border-purple-800/50',
      button: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      buttonHover: 'text-purple-600 dark:text-purple-400'
    },
    'construction-tech': { 
      bg: 'bg-amber-50 dark:bg-amber-900/10', 
      border: 'border-amber-200 dark:border-amber-800/50',
      button: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      buttonHover: 'text-amber-600 dark:text-amber-400'
    },
    'healthcare-medical': { 
      bg: 'bg-red-50 dark:bg-red-900/10', 
      border: 'border-red-200 dark:border-red-800/50',
      button: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      buttonHover: 'text-red-600 dark:text-red-400'
    },
    'logistics-supply': { 
      bg: 'bg-teal-50 dark:bg-teal-900/10', 
      border: 'border-teal-200 dark:border-teal-800/50',
      button: 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      buttonHover: 'text-teal-600 dark:text-teal-400'
    },
    'agriculture-food': { 
      bg: 'bg-lime-50 dark:bg-lime-900/10', 
      border: 'border-lime-200 dark:border-lime-800/50',
      button: 'bg-lime-50 hover:bg-lime-100 dark:bg-lime-900/20 dark:hover:bg-lime-900/40 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-800',
      buttonHover: 'text-lime-600 dark:text-lime-400'
    },
    'mining-materials': { 
      bg: 'bg-stone-50 dark:bg-stone-900/10', 
      border: 'border-stone-200 dark:border-stone-800/50',
      button: 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-900/20 dark:hover:bg-stone-900/40 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800',
      buttonHover: 'text-stone-600 dark:text-stone-400'
    },
    'consumer-electronics': { 
      bg: 'bg-pink-50 dark:bg-pink-900/10', 
      border: 'border-pink-200 dark:border-pink-800/50',
      button: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      buttonHover: 'text-pink-600 dark:text-pink-400'
    },
    'research-education': { 
      bg: 'bg-violet-50 dark:bg-violet-900/10', 
      border: 'border-violet-200 dark:border-violet-800/50',
      button: 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
      buttonHover: 'text-violet-600 dark:text-violet-400'
    },
    'public-safety': { 
      bg: 'bg-gray-50 dark:bg-gray-900/10', 
      border: 'border-gray-200 dark:border-gray-800/50',
      button: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
      buttonHover: 'text-gray-600 dark:text-gray-400'
    }
  };
  return colorMap[domainId] || colorMap['public-safety']; // fallback to gray
};

// Subdomain images mapping
const getSubdomainImage = (subdomainId: string): string => {
  const imageMap: Record<string, string> = {
    // Advanced Manufacturing subdomains
    'semiconductor-fabs': '/api/placeholder/200/120?text=Semiconductor+Fabs',
    'precision-machining': '/api/placeholder/200/120?text=Precision+Machining',
    'electronics-assembly': '/api/placeholder/200/120?text=Electronics+Assembly',
    'additive-manufacturing': '/api/placeholder/200/120?text=3D+Printing',
    'contract-manufacturing': '/api/placeholder/200/120?text=Contract+Mfg',
    
    // Aerospace & Defense subdomains
    'commercial-aircraft': '/api/placeholder/200/120?text=Aircraft+Mfg',
    'spacecraft-launch': '/api/placeholder/200/120?text=Spacecraft',
    'satellite-operations': '/api/placeholder/200/120?text=Satellites',
    'uav-systems': '/api/placeholder/200/120?text=Drones+UAV',
    'defense-systems': '/api/placeholder/200/120?text=Defense+Systems',
    
    // Automotive subdomains
    'electric-vehicles': '/api/placeholder/200/120?text=Electric+Vehicles',
    'autonomous-vehicles': '/api/placeholder/200/120?text=Autonomous+Cars',
    'rail-transit': '/api/placeholder/200/120?text=Rail+Transit',
    'charging-infrastructure': '/api/placeholder/200/120?text=EV+Charging',
    'fleet-telematics': '/api/placeholder/200/120?text=Fleet+Mgmt',
    
    // Energy & Utilities subdomains
    'renewable-power': '/api/placeholder/200/120?text=Solar+Wind',
    'hydro-geothermal': '/api/placeholder/200/120?text=Hydro+Geo',
    'thermal-generation': '/api/placeholder/200/120?text=Thermal+Power',
    'grid-operations': '/api/placeholder/200/120?text=Power+Grid',
    'microgrid-distributed': '/api/placeholder/200/120?text=Microgrids',
    
    // Sustainable & Green subdomains
    'carbon-capture': '/api/placeholder/200/120?text=Carbon+Capture',
    'waste-energy': '/api/placeholder/200/120?text=Waste+to+Energy',
    'water-treatment': '/api/placeholder/200/120?text=Water+Treatment',
    'energy-efficiency': '/api/placeholder/200/120?text=Energy+Efficiency',
    'bio-materials': '/api/placeholder/200/120?text=Bio+Materials',
    
    // Data Centers subdomains
    'hyperscale-datacenters': '/api/placeholder/200/120?text=Hyperscale+DC',
    'edge-computing': '/api/placeholder/200/120?text=Edge+Computing',
    'colocation-services': '/api/placeholder/200/120?text=Colocation',
    'critical-facilities': '/api/placeholder/200/120?text=Critical+Facilities',
    'infrastructure-design': '/api/placeholder/200/120?text=DC+Design',
    
    // Telecommunications subdomains
    'cellular-carriers': '/api/placeholder/200/120?text=5G+Carriers',
    'fiber-networks': '/api/placeholder/200/120?text=Fiber+Networks',
    'satellite-broadband': '/api/placeholder/200/120?text=Satellite+Internet',
    'iot-connectivity': '/api/placeholder/200/120?text=IoT+Networks',
    'network-equipment': '/api/placeholder/200/120?text=Network+Equipment',
    
    // Smart Cities subdomains
    'intelligent-transportation': '/api/placeholder/200/120?text=Smart+Transport',
    'connected-lighting': '/api/placeholder/200/120?text=Smart+Lighting',
    'building-automation': '/api/placeholder/200/120?text=Smart+Buildings',
    'municipal-iot': '/api/placeholder/200/120?text=Municipal+IoT',
    'urban-planning': '/api/placeholder/200/120?text=Urban+Planning',
    
    // Construction Tech subdomains
    'epc-firms': '/api/placeholder/200/120?text=EPC+Projects',
    'bim-projects': '/api/placeholder/200/120?text=BIM+Modeling',
    'modular-construction': '/api/placeholder/200/120?text=Modular+Build',
    'construction-robotics': '/api/placeholder/200/120?text=Construction+Robots',
    'construction-tech': '/api/placeholder/200/120?text=Construction+Tech',
    
    // Healthcare subdomains
    'medical-devices': '/api/placeholder/200/120?text=Medical+Devices',
    'hospital-it': '/api/placeholder/200/120?text=Hospital+IT',
    'digital-health': '/api/placeholder/200/120?text=Digital+Health',
    'lab-automation': '/api/placeholder/200/120?text=Lab+Automation',
    'medical-imaging': '/api/placeholder/200/120?text=Medical+Imaging',
    
    // Logistics subdomains
    'automated-fulfillment': '/api/placeholder/200/120?text=Automated+Warehouse',
    'robotics-3pl': '/api/placeholder/200/120?text=3PL+Robotics',
    'cold-chain': '/api/placeholder/200/120?text=Cold+Chain',
    'smart-ports': '/api/placeholder/200/120?text=Smart+Ports',
    'supply-chain-tech': '/api/placeholder/200/120?text=Supply+Chain',
    
    // Agriculture subdomains
    'precision-agriculture': '/api/placeholder/200/120?text=Precision+Ag',
    'indoor-farming': '/api/placeholder/200/120?text=Indoor+Farming',
    'food-processing': '/api/placeholder/200/120?text=Food+Processing',
    'agricultural-drones': '/api/placeholder/200/120?text=Ag+Drones',
    'livestock-tech': '/api/placeholder/200/120?text=Livestock+Tech',
    
    // Mining subdomains
    'smart-mining': '/api/placeholder/200/120?text=Smart+Mining',
    'materials-refinement': '/api/placeholder/200/120?text=Materials+Refine',
    'battery-materials': '/api/placeholder/200/120?text=Battery+Materials',
    'resource-monitoring': '/api/placeholder/200/120?text=Resource+Monitor',
    'extraction-tech': '/api/placeholder/200/120?text=Extraction+Tech',
    
    // Consumer Electronics subdomains
    'home-automation': '/api/placeholder/200/120?text=Smart+Home',
    'wearables-fitness': '/api/placeholder/200/120?text=Wearables',
    'personal-robotics': '/api/placeholder/200/120?text=Personal+Robots',
    'xr-hardware': '/api/placeholder/200/120?text=VR+AR+Hardware',
    'mobile-devices': '/api/placeholder/200/120?text=Mobile+Devices',
    
    // Research & Education subdomains
    'university-research': '/api/placeholder/200/120?text=University+Labs',
    'national-labs': '/api/placeholder/200/120?text=National+Labs',
    'contract-rd': '/api/placeholder/200/120?text=Contract+R%26D',
    'testing-certification': '/api/placeholder/200/120?text=Testing+Cert',
    'tech-transfer': '/api/placeholder/200/120?text=Tech+Transfer',
    
    // Public Safety subdomains
    'infrastructure-protection': '/api/placeholder/200/120?text=Infrastructure+Security',
    'physical-security': '/api/placeholder/200/120?text=Physical+Security',
    'cybersecurity-services': '/api/placeholder/200/120?text=Cybersecurity',
    'emergency-response': '/api/placeholder/200/120?text=Emergency+Response',
    'surveillance-awareness': '/api/placeholder/200/120?text=Surveillance'
  };
  
  return imageMap[subdomainId] || '/api/placeholder/200/120?text=Industry+Area';
};

export const IndustryDomainSelector: React.FC<IndustryDomainSelectorProps> = ({
  industryDomains,
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
      // Only allow one domain to be expanded at a time
      newExpanded.clear();
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  };

  const getDomainInterest = (domainId: string): 0 | 1 | 2 | 3 => {
    const interest = userInterests.find(
      i => i.type === 'industry' && i.domainId === domainId && !i.subdomainId
    );
    return interest?.weight ?? 1;
  };

  const getSubdomainInterest = (subdomainId: string): 0 | 1 | 2 | 3 => {
    const interest = userInterests.find(
      i => i.type === 'industry' && i.subdomainId === subdomainId
    );
    return interest?.weight ?? 1;
  };

  const handleDomainInterestChange = (domainId: string, weight: 0 | 1 | 2 | 3) => {
    onInterestChange({
      domainId,
      type: 'industry',
      weight
    });
  };

  const handleSubdomainInterestChange = (subdomainId: string, weight: 0 | 1 | 2 | 3) => {
    onInterestChange({
      subdomainId,
      type: 'industry',
      weight
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Industry Categories
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select industries that interest you. These represent the economic sectors where technology is applied.
        </p>
      </div>

      {/* Industry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {industryDomains.map((domain) => {
          const domainInterest = getDomainInterest(domain.id);
          const isExpanded = expandedDomains.has(domain.id);
          const colorScheme = getDomainColorScheme(domain.id);
          
          return (
            <div 
              key={domain.id} 
              className={cn(
                "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300",
                colorScheme.bg,
                colorScheme.border,
                isExpanded && "md:col-span-2 ring-2 ring-blue-500 ring-opacity-50"
              )}
            >
              {isExpanded ? (
                // Expanded State: Compact header + subdomain grid
                <div>
                  {/* Compact Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Domain thumbnail */}
                        <img 
                          src={getSubdomainImage(domain.subdomains[0]?.id || domain.id)}
                          alt={domain.name}
                          className="w-16 h-10 object-cover rounded border border-gray-200 dark:border-gray-700 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {domain.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {domain.description}
                          </p>
                          
                          {/* Compact Interest Rating */}
                          <div className="mt-3">
                            <EmojiSlider
                              value={domainInterest}
                              onChange={(weight) => handleDomainInterestChange(domain.id, weight)}
                              label={`Interest in ${domain.name}`}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Close button */}
                      <button
                        onClick={() => toggleDomain(domain.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subdomain Grid */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Specific Industry Areas:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {domain.subdomains.map((subdomain) => {
                        const subdomainInterest = getSubdomainInterest(subdomain.id);
                        
                        return (
                          <div 
                            key={subdomain.id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <img 
                              src={getSubdomainImage(subdomain.id)}
                              alt={subdomain.name}
                              className="w-full h-24 object-cover"
                            />
                            <div className="p-4">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                {subdomain.name}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {subdomain.description}
                              </p>
                              
                              <EmojiSlider
                                value={subdomainInterest}
                                onChange={(weight) => handleSubdomainInterestChange(subdomain.id, weight)}
                                label={`Interest in ${subdomain.name}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Collapsed State: Standard card layout
                <div>
                  {/* Domain Image */}
                  <div className="aspect-[2/1] bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={getSubdomainImage(domain.subdomains[0]?.id || domain.id)}
                      alt={domain.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Domain Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {domain.name}
                    </h3>
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

                    {/* Explore Industries Button */}
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors border",
                        colorScheme.button
                      )}
                    >
                      <div className="flex flex-col items-start space-y-1">
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4" />
                          <span className="font-medium">Explore Specific Industries</span>
                        </div>
                        <p className={cn("text-xs", colorScheme.buttonHover)}>
                          {domain.subdomains.length} industries available
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
          Industry Selection Summary
        </h3>
        <p className="text-sm text-purple-700 dark:text-purple-300">
          You've rated {userInterests.filter(i => i.type === 'industry').length} industry areas. 
          These selections help match you with career opportunities in sectors that interest you.
        </p>
      </div>
    </div>
  );
}; 