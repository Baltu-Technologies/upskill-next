'use client';

import React, { useState } from 'react';
import { 
  UserSkill, 
  SkillDomain, 
  SkillTemplate,
  SkillConfidenceLevel,
  mockSkillDomains,
  getConfidenceLevelText,
  getConfidenceLevelEmoji,
  getConfidenceLevelColor,
  getVerificationStatusText,
  getVerificationStatusColor,
  getSkillTemplate,
  getSkillDomain
} from '@/data/mockProfileData';

interface SkillsInventorySectionProps {
  skills: UserSkill[];
  onUpdate: (skills: UserSkill[]) => void;
  hasUnsavedChanges: boolean;
}

export default function SkillsInventorySection({ skills, onUpdate, hasUnsavedChanges }: SkillsInventorySectionProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('electronics');
  const [isAddingCustomSkill, setIsAddingCustomSkill] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedDomainForCustom, setSelectedDomainForCustom] = useState('');

  const toggleAccordion = (domainId: string) => {
    setActiveAccordion(activeAccordion === domainId ? null : domainId);
  };

  const getUserSkillForTemplate = (templateId: string): UserSkill | null => {
    return skills.find(skill => skill.skillTemplateId === templateId) || null;
  };

  const handleSkillToggle = (template: SkillTemplate, domain: SkillDomain) => {
    const existingSkill = getUserSkillForTemplate(template.id);
    
    if (existingSkill) {
      // Remove skill
      const updatedSkills = skills.filter(skill => skill.skillTemplateId !== template.id);
      onUpdate(updatedSkills);
    } else {
      // Add skill with default confidence level 1
      const newSkill: UserSkill = {
        id: `skill-${Date.now()}`,
        skillTemplateId: template.id,
        userId: 'user-1',
        confidenceLevel: 1,
        sourceType: 'self_reported',
        verificationStatus: 'none',
        acquiredDate: new Date().toISOString(),
        isHidden: false
      };
      onUpdate([...skills, newSkill]);
    }
  };

  const handleConfidenceChange = (skillId: string, confidenceLevel: SkillConfidenceLevel) => {
    const updatedSkills = skills.map(skill => 
      skill.id === skillId 
        ? { ...skill, confidenceLevel }
        : skill
    );
    onUpdate(updatedSkills);
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim() || !selectedDomainForCustom) return;

    // Create a custom skill template
    const customTemplate: SkillTemplate = {
      id: `custom-${Date.now()}`,
      name: customSkillInput.trim(),
      description: 'Custom skill added by user',
      domainId: selectedDomainForCustom,
      aliases: [],
      isCore: false
    };

    // Add to domain (in practice, this would be saved to backend)
    const domain = mockSkillDomains.find(d => d.id === selectedDomainForCustom);
    if (domain) {
      domain.skills.push(customTemplate);
    }

    // Create user skill
    const newSkill: UserSkill = {
      id: `skill-${Date.now()}`,
      skillTemplateId: customTemplate.id,
      userId: 'user-1',
      confidenceLevel: 1,
      sourceType: 'self_reported',
      verificationStatus: 'none',
      acquiredDate: new Date().toISOString(),
      isHidden: false
    };

    onUpdate([...skills, newSkill]);
    setCustomSkillInput('');
    setSelectedDomainForCustom('');
    setIsAddingCustomSkill(false);
  };

  const calculateDomainProgress = (domain: SkillDomain) => {
    const domainSkills = domain.skills.filter(skill => skill.isCore);
    const userSkillsInDomain = domainSkills.filter(skill => 
      getUserSkillForTemplate(skill.id)
    );
    return domainSkills.length > 0 ? (userSkillsInDomain.length / domainSkills.length) * 100 : 0;
  };

  const calculateOverallProgress = () => {
    const totalCoreSkills = mockSkillDomains.reduce((total, domain) => 
      total + domain.skills.filter(skill => skill.isCore).length, 0
    );
    const completedCoreSkills = mockSkillDomains.reduce((total, domain) => 
      total + domain.skills.filter(skill => 
        skill.isCore && getUserSkillForTemplate(skill.id)
      ).length, 0
    );
    return totalCoreSkills > 0 ? Math.round((completedCoreSkills / totalCoreSkills) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header and Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Skills Inventory</h2>
            <p className="text-gray-600 mt-1">
              Build your comprehensive skills profile with evidence and verification
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{calculateOverallProgress()}%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${calculateOverallProgress()}%` }}
          />
        </div>

        {/* Skills Summary */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>{skills.length} skills added</span>
          <span>{skills.filter(s => s.verificationStatus === 'verified').length} verified</span>
          <span>{skills.filter(s => s.evidence && s.evidence.length > 0).length} with evidence</span>
        </div>
      </div>

      {/* Guided Domain Sections */}
      <div className="space-y-4">
        {mockSkillDomains.map((domain) => {
          const progress = calculateDomainProgress(domain);
          const isActive = activeAccordion === domain.id;
          
          return (
            <div key={domain.id} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Domain Header */}
              <button
                onClick={() => toggleAccordion(domain.id)}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${domain.color} flex items-center justify-center text-white text-xl`}>
                    {domain.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                    <p className="text-sm text-gray-500">{domain.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{Math.round(progress)}%</div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${domain.color}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 transform transition-transform ${isActive ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Domain Skills */}
              {isActive && (
                <div className="px-6 pb-6 bg-gray-50">
                  <div className="grid gap-4 mt-4">
                    {domain.skills.map((skill) => {
                      const userSkill = getUserSkillForTemplate(skill.id);
                      const isSelected = !!userSkill;

                      return (
                        <div 
                          key={skill.id} 
                          className={`
                            p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Skill Info */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleSkillToggle(skill, domain)}
                                  className={`
                                    w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                                    ${isSelected 
                                      ? 'bg-blue-500 border-blue-500 text-white' 
                                      : 'border-gray-300 hover:border-blue-500'
                                    }
                                  `}
                                >
                                  {isSelected && (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                                
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                                    <span>{skill.name}</span>
                                    {skill.isCore && (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                        Core
                                      </span>
                                    )}
                                  </h4>
                                  {skill.description && (
                                    <p className="text-sm text-gray-500 mt-1">{skill.description}</p>
                                  )}
                                </div>
                              </div>

                              {/* Confidence Level Selector */}
                              {isSelected && userSkill && (
                                <div className="mt-4 p-3 bg-white rounded-lg border">
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-700">
                                      Confidence Level
                                    </label>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-500">
                                        {getConfidenceLevelText(userSkill.confidenceLevel)}
                                      </span>
                                      <span>{getConfidenceLevelEmoji(userSkill.confidenceLevel)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4].map((level) => (
                                      <button
                                        key={level}
                                        onClick={() => handleConfidenceChange(userSkill.id, level as SkillConfidenceLevel)}
                                        className={`
                                          flex-1 py-2 px-3 text-sm rounded-lg border transition-all
                                          ${userSkill.confidenceLevel === level
                                            ? `${getConfidenceLevelColor(level as SkillConfidenceLevel)} border-current`
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                          }
                                        `}
                                      >
                                        <div className="text-center">
                                          <div className="text-lg">{getConfidenceLevelEmoji(level as SkillConfidenceLevel)}</div>
                                          <div className="text-xs">{level}</div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Verification Status */}
                              {isSelected && userSkill && (
                                <div className="mt-3 flex items-center justify-between">
                                  <span className={`
                                    px-3 py-1 rounded-full text-xs font-medium
                                    ${getVerificationStatusColor(userSkill.verificationStatus)}
                                  `}>
                                    {getVerificationStatusText(userSkill.verificationStatus)}
                                  </span>
                                  
                                  {userSkill.evidence && userSkill.evidence.length > 0 && (
                                    <span className="text-xs text-gray-500 flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 11-4 0 2 2 0 014 0zm2-2a2 2 0 100 4 2 2 0 000-4zm8 2a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                                      </svg>
                                      {userSkill.evidence.length} evidence
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Skill Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {!isAddingCustomSkill ? (
                      <button
                        onClick={() => {
                          setIsAddingCustomSkill(true);
                          setSelectedDomainForCustom(domain.id);
                        }}
                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        + Add other skill in {domain.name}
                      </button>
                    ) : selectedDomainForCustom === domain.id && (
                      <div className="p-4 bg-white rounded-lg border">
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={customSkillInput}
                            onChange={(e) => setCustomSkillInput(e.target.value)}
                            placeholder="Enter skill name..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                          />
                          <button
                            onClick={handleAddCustomSkill}
                            disabled={!customSkillInput.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingCustomSkill(false);
                              setCustomSkillInput('');
                              setSelectedDomainForCustom('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Insights */}
      {skills.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Progress Insights</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {calculateOverallProgress() < 50 && (
              <p>Keep adding skills! You're {50 - calculateOverallProgress()}% away from a well-rounded profile.</p>
            )}
            {skills.filter(s => s.verificationStatus === 'verified').length === 0 && (
              <p>Consider getting your skills verified by instructors or employers to boost credibility.</p>
            )}
            {skills.filter(s => s.evidence && s.evidence.length > 0).length < skills.length * 0.3 && (
              <p>Upload evidence for your skills to strengthen your profile.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}