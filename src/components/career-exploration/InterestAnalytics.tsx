'use client';

import React, { useState, useMemo } from 'react';
import { 
  Target, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Star,
  Eye,
  Edit3,
  Calendar,
  Lightbulb,
  ArrowRight,
  Filter
} from 'lucide-react';
import { UserProfile, CareerPathway } from '../../data/mockCareerData';

interface InterestAnalyticsProps {
  interests: UserProfile['capturedInterests'];
  pathways?: CareerPathway[];
  onEditInterests?: () => void;
  className?: string;
}

// Helper function to get emoji for rating
const getEmojiForRating = (rating: number): string => {
  switch (rating) {
    case 1: return '👎';
    case 2: return '😐';
    case 3: return '👍';
    case 4: return '❤️';
    default: return '😐';
  }
};

// Interest distribution chart component
const InterestDistributionChart: React.FC<{
  data: { label: string; value: number; count: number }[];
  title: string;
  color: string;
}> = ({ data, title, color }) => {
  const maxValue = Math.max(...data.map(d => d.count));
  
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 flex items-center">
        <BarChart3 className="w-4 h-4 mr-2" />
        {title}
      </h4>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center space-x-3">
            <div className="w-20 text-xs text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${color}`}
                style={{ width: `${(item.count / maxValue) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 w-8 text-right">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Interest insight component
const InterestInsights: React.FC<{
  techInterests: [string, number][];
  industryInterests: [string, number][];
  pathways?: CareerPathway[];
}> = ({ techInterests, industryInterests, pathways = [] }) => {
  const insights = useMemo(() => {
    const results = [];
    
    // Top interest analysis
    const topTech = techInterests[0];
    const topIndustry = industryInterests[0];
    
    if (topTech && topTech[1] >= 3) {
      results.push({
        type: 'strength',
        title: 'Primary Tech Focus',
        description: `Strong interest in ${topTech[0]} (${getEmojiForRating(topTech[1])}) - Consider specializing in this area.`,
        icon: <Star className="w-4 h-4 text-yellow-500" />
      });
    }
    
    if (topIndustry && topIndustry[1] >= 3) {
      results.push({
        type: 'opportunity',
        title: 'Industry Alignment',
        description: `High interest in ${topIndustry[0]} industry - Look for pathways in this sector.`,
        icon: <TrendingUp className="w-4 h-4 text-green-500" />
      });
    }
    
    // Pathway alignment analysis
    if (pathways.length > 0) {
      const alignedPathways = pathways.filter(pathway => {
        const techMatch = pathway.requiredTechDomains.some((domain: string) => 
          techInterests.find(([techDomain, rating]) => 
            techDomain === domain && rating >= 3
          )
        );
        const industryMatch = pathway.relevantIndustries.some((industry: string) =>
          industryInterests.find(([industryDomain, rating]) => 
            industryDomain === industry && rating >= 3
          )
        );
        return techMatch || industryMatch;
      });
      
      results.push({
        type: 'alignment',
        title: 'Pathway Alignment',
        description: `${alignedPathways.length} of your saved pathways align with your interests.`,
        icon: <Target className="w-4 h-4 text-blue-500" />
      });
    }
    
    // Interest diversity analysis
    const highInterests = [...techInterests, ...industryInterests].filter(([, rating]) => rating >= 3);
    if (highInterests.length >= 6) {
      results.push({
        type: 'diversity',
        title: 'Diverse Interests',
        description: `You have ${highInterests.length} high-interest areas - Consider cross-functional roles.`,
        icon: <PieChart className="w-4 h-4 text-purple-500" />
      });
    }
    
    return results;
  }, [techInterests, industryInterests, pathways]);
  
  if (insights.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 flex items-center">
        <Lightbulb className="w-4 h-4 mr-2" />
        Interest Insights
      </h4>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              {insight.icon}
              <div className="flex-1">
                <h5 className="font-medium text-blue-900 text-sm">{insight.title}</h5>
                <p className="text-blue-700 text-xs mt-1">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
export const InterestAnalytics: React.FC<InterestAnalyticsProps> = ({ 
  interests, 
  pathways = [], 
  onEditInterests,
  className = '' 
}) => {
  const [activeView, setActiveView] = useState<'summary' | 'analytics' | 'insights'>('summary');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const techInterests = Object.entries(interests.techDomains)
    .sort(([,a], [,b]) => (b as number) - (a as number)) as [string, number][];
    
  const industryInterests = Object.entries(interests.industryDomains)
    .sort(([,a], [,b]) => (b as number) - (a as number)) as [string, number][];
  
  // Analytics data
  const techDistribution = useMemo(() => {
    const ratings = { '❤️': 0, '👍': 0, '😐': 0, '👎': 0 };
    techInterests.forEach(([, rating]) => {
      const emoji = getEmojiForRating(rating as number);
      ratings[emoji as keyof typeof ratings]++;
    });
    
    return Object.entries(ratings).map(([label, count]) => ({
      label,
      value: count,
      count
    }));
  }, [techInterests]);
  
  const industryDistribution = useMemo(() => {
    const ratings = { '❤️': 0, '👍': 0, '😐': 0, '👎': 0 };
    industryInterests.forEach(([, rating]) => {
      const emoji = getEmojiForRating(rating as number);
      ratings[emoji as keyof typeof ratings]++;
    });
    
    return Object.entries(ratings).map(([label, count]) => ({
      label,
      value: count,
      count
    }));
  }, [industryInterests]);
  
  const displayTechInterests = isExpanded ? techInterests : techInterests.slice(0, 4);
  const displayIndustryInterests = isExpanded ? industryInterests : industryInterests.slice(0, 4);
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          My Interests Profile
        </h3>
        <div className="flex items-center space-x-2">
          {onEditInterests && (
            <button
              onClick={onEditInterests}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-700"
          >
            {isExpanded ? 'Show Less' : 'Show All'}
            {isExpanded ? 
              <ChevronUp className="w-4 h-4 ml-1" /> : 
              <ChevronDown className="w-4 h-4 ml-1" />
            }
          </button>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'summary', label: 'Summary', icon: <Eye className="w-4 h-4" /> },
          { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> }
        ].map((view) => (
          <button
            key={view.key}
            onClick={() => setActiveView(view.key as any)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === view.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view.icon}
            <span className="ml-1">{view.label}</span>
          </button>
        ))}
      </div>
      
      {/* Content Views */}
      {activeView === 'summary' && (
        <div className="space-y-6">
          {/* Technology Interests */}
          <div>
            <h4 className="font-medium text-blue-700 mb-3 flex items-center">
              Technology Domains 
              <span className="ml-2 text-sm text-gray-500">({techInterests.length} total)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayTechInterests.map(([domain, rating]) => (
                <div key={domain} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-sm font-medium text-gray-700 truncate flex-1">{domain}</span>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-lg">{getEmojiForRating(rating)}</span>
                    <span className="text-xs text-gray-500 min-w-[4rem] text-right">
                      {rating === 1 ? 'Not interested' :
                       rating === 2 ? 'Somewhat' :
                       rating === 3 ? 'Interested' : 'Very interested'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {!isExpanded && techInterests.length > 4 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                Show {techInterests.length - 4} more tech domains
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>

          {/* Industry Interests */}
          <div>
            <h4 className="font-medium text-purple-700 mb-3 flex items-center">
              Industry Domains
              <span className="ml-2 text-sm text-gray-500">({industryInterests.length} total)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayIndustryInterests.map(([domain, rating]) => (
                <div key={domain} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <span className="text-sm font-medium text-gray-700 truncate flex-1">{domain}</span>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-lg">{getEmojiForRating(rating)}</span>
                    <span className="text-xs text-gray-500 min-w-[4rem] text-right">
                      {rating === 1 ? 'Not interested' :
                       rating === 2 ? 'Somewhat' :
                       rating === 3 ? 'Interested' : 'Very interested'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {!isExpanded && industryInterests.length > 4 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 flex items-center"
              >
                Show {industryInterests.length - 4} more industry domains
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InterestDistributionChart
            data={techDistribution}
            title="Tech Interest Distribution"
            color="bg-blue-500"
          />
          <InterestDistributionChart
            data={industryDistribution}
            title="Industry Interest Distribution"
            color="bg-purple-500"
          />
        </div>
      )}
      
      {activeView === 'insights' && (
        <InterestInsights 
          techInterests={techInterests}
          industryInterests={industryInterests}
          pathways={pathways}
        />
      )}
      
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Captured on {new Date(interests.capturedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{techInterests.filter(([, rating]) => rating >= 3).length} tech interests</span>
            <span>{industryInterests.filter(([, rating]) => rating >= 3).length} industry interests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestAnalytics; 