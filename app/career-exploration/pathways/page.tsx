'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Cpu, 
  Settings, 
  TrendingUp, 
  Clock, 
  BookOpen,
  Award,
  Building2,
  Zap
} from 'lucide-react';

const MyPathwaysPage = () => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const pathways = [
    {
      id: 'data-center-tech',
      title: 'Data Center Technician',
      description: 'Manage and maintain critical data center infrastructure, servers, and networking equipment.',
      icon: Server,
      color: 'bg-blue-500',
      progress: 35,
      timeToComplete: '8-12 months',
      salary: '$45,000 - $85,000',
      growth: '+8% annually',
      courses: [
        { name: 'Server Hardware Fundamentals', completed: true },
        { name: 'Network Infrastructure', completed: true },
        { name: 'Power & Cooling Systems', completed: false },
        { name: 'Virtualization Technologies', completed: false },
        { name: 'Data Center Security', completed: false }
      ],
      skills: [
        'Server Hardware',
        'Network Configuration',
        'HVAC Systems',
        'Power Management',
        'Troubleshooting',
        'Documentation'
      ],
      certifications: [
        'CompTIA Server+',
        'Data Center Certified Professional',
        'Cisco CCNA Data Center'
      ],
      industries: [
        'Cloud Services',
        'Telecommunications',
        'Financial Services',
        'Healthcare Technology'
      ]
    },
    {
      id: 'semiconductor',
      title: 'Semiconductor Technician',
      description: 'Work in semiconductor fabrication, testing, and quality control in clean room environments.',
      icon: Cpu,
      color: 'bg-purple-500',
      progress: 22,
      timeToComplete: '6-10 months',
      salary: '$40,000 - $75,000',
      growth: '+7% annually',
      courses: [
        { name: 'Semiconductor Physics', completed: true },
        { name: 'Clean Room Protocols', completed: false },
        { name: 'Wafer Processing', completed: false },
        { name: 'Test Equipment Operation', completed: false },
        { name: 'Quality Control Systems', completed: false }
      ],
      skills: [
        'Microscopy',
        'Clean Room Procedures',
        'Equipment Calibration',
        'Process Documentation',
        'Statistical Analysis',
        'Safety Protocols'
      ],
      certifications: [
        'IPC Standards Certification',
        'SEMI Safety Guidelines',
        'Clean Room Technician Certification'
      ],
      industries: [
        'Microelectronics',
        'Automotive Electronics',
        'Telecommunications',
        'Consumer Electronics'
      ]
    },
    {
      id: 'cnc-operator',
      title: 'CNC Operator',
      description: 'Operate computer-controlled machining equipment to produce precision parts and components.',
      icon: Settings,
      color: 'bg-orange-500',
      progress: 58,
      timeToComplete: '4-8 months',
      salary: '$35,000 - $65,000',
      growth: '+4% annually',
      courses: [
        { name: 'CNC Programming Basics', completed: true },
        { name: 'G-Code & M-Code', completed: true },
        { name: 'Tool Selection & Setup', completed: true },
        { name: 'Quality Measurement', completed: false },
        { name: 'Advanced Machining', completed: false }
      ],
      skills: [
        'CNC Programming',
        'Blueprint Reading',
        'Precision Measurement',
        'Tool Management',
        'Setup & Troubleshooting',
        'Quality Control'
      ],
      certifications: [
        'NIMS CNC Turning',
        'NIMS CNC Milling',
        'Manufacturing Skill Standards Council'
      ],
      industries: [
        'Aerospace Manufacturing',
        'Automotive Parts',
        'Medical Devices',
        'Precision Tooling'
      ]
    }
  ];

  const PathwayCard = ({ pathway }: { pathway: typeof pathways[0] }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4" 
          style={{ borderLeftColor: pathway.color.replace('bg-', '#') === 'bg-blue-500' ? '#3b82f6' : 
                                    pathway.color.replace('bg-', '#') === 'bg-purple-500' ? '#a855f7' : '#f97316' }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${pathway.color} text-white`}>
              <pathway.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{pathway.title}</h3>
              <p className="text-gray-600 mt-1">{pathway.description}</p>
            </div>
          </div>
          <Badge variant="secondary">{pathway.progress}% Complete</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Course Progress</span>
            <span>{pathway.progress}%</span>
          </div>
          <Progress value={pathway.progress} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto text-gray-500 mb-1" />
            <div className="text-sm font-medium">{pathway.timeToComplete}</div>
            <div className="text-xs text-gray-500">Timeline</div>
          </div>
          <div className="text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <div className="text-sm font-medium">{pathway.salary}</div>
            <div className="text-xs text-gray-500">Salary Range</div>
          </div>
          <div className="text-center">
            <Zap className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <div className="text-sm font-medium">{pathway.growth}</div>
            <div className="text-xs text-gray-500">Job Growth</div>
          </div>
        </div>

        {/* Course List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Required Courses
          </h4>
          <div className="space-y-1">
            {pathway.courses.slice(0, 3).map((course, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={course.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                  {course.name}
                </span>
                <Badge variant={course.completed ? 'default' : 'outline'} className="text-xs">
                  {course.completed ? 'Complete' : 'Pending'}
                </Badge>
              </div>
            ))}
            {pathway.courses.length > 3 && (
              <div className="text-xs text-gray-500">
                +{pathway.courses.length - 3} more courses
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            className="flex-1" 
            onClick={() => setSelectedPathway(selectedPathway === pathway.id ? null : pathway.id)}
          >
            {selectedPathway === pathway.id ? 'Hide Details' : 'View Details'}
          </Button>
          <Button variant="outline" className="flex-1">
            Continue Learning
          </Button>
        </div>

        {/* Expanded Details */}
        {selectedPathway === pathway.id && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Skills */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Key Skills</h5>
              <div className="flex flex-wrap gap-2">
                {pathway.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Recommended Certifications
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {pathway.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Target Industries
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {pathway.industries.map((industry, idx) => (
                  <div key={idx} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Career Pathways</h1>
          <p className="text-gray-600">
            Explore your personalized learning paths in advanced manufacturing and industrial technology
          </p>
        </div>

        {/* Pathway Grid */}
        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-1">
          {pathways.map((pathway) => (
            <PathwayCard key={pathway.id} pathway={pathway} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Ready to Advance Your Career?
              </h2>
              <p className="text-gray-600 mb-6">
                Complete your pathway assessments and start building the skills that matter in today&apos;s 
                advanced manufacturing industry.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg">
                  Take Skills Assessment
                </Button>
                <Button variant="outline" size="lg">
                  Browse All Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyPathwaysPage; 