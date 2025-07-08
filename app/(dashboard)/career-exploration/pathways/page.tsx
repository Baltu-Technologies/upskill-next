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
      description: 'Manage and maintain critical infrastructure in modern data centers',
      icon: Server,
      color: 'bg-blue-500',
      progress: 35,
      timeToComplete: '8-12 months',
      salary: '$45,000 - $85,000',
      growth: '+8% annually',
      courses: [
        { name: 'Server Hardware Fundamentals', completed: true },
        { name: 'Network Infrastructure Basics', completed: true },
        { name: 'Power & Cooling Systems', completed: false },
        { name: 'Data Center Operations', completed: false },
        { name: 'Virtualization Technologies', completed: false },
        { name: 'Cloud Infrastructure Management', completed: false }
      ],
      skills: [
        'Server Maintenance',
        'Network Troubleshooting', 
        'Power Management',
        'Cable Management',
        'Environmental Monitoring',
        'Backup Systems'
      ],
      certifications: [
        'CompTIA Server+',
        'Data Center Certified Associate (DCCA)',
        'Cisco CCNA Data Center'
      ],
      industries: [
        'Cloud Service Providers',
        'Financial Services',
        'Healthcare Technology',
        'Government Facilities'
      ]
    },
    {
      id: 'semiconductor-tech',
      title: 'Semiconductor Technician',
      description: 'Work in clean room environments manufacturing microchips and electronic components',
      icon: Cpu,
      color: 'bg-purple-500',
      progress: 22,
      timeToComplete: '6-10 months',
      salary: '$40,000 - $75,000',
      growth: '+7% annually',
      courses: [
        { name: 'Clean Room Procedures', completed: true },
        { name: 'Wafer Processing Basics', completed: false },
        { name: 'Photolithography Techniques', completed: false },
        { name: 'Quality Control & Testing', completed: false },
        { name: 'Chemical Safety Protocols', completed: false },
        { name: 'Advanced Semiconductor Manufacturing', completed: false }
      ],
      skills: [
        'Clean Room Operations',
        'Wafer Handling',
        'Process Monitoring',
        'Quality Inspection',
        'Chemical Handling',
        'Equipment Maintenance'
      ],
      certifications: [
        'SEMI Safety Guidelines',
        'Clean Room Certification',
        'Semiconductor Manufacturing Technician'
      ],
      industries: [
        'Intel & AMD',
        'TSMC & GlobalFoundries',
        'Memory Manufacturers',
        'Automotive Electronics'
      ]
    },
    {
      id: 'cnc-operator',
      title: 'CNC Operator',
      description: 'Operate computer-controlled machine tools to create precision parts',
      icon: Settings,
      color: 'bg-orange-500',
      progress: 58,
      timeToComplete: '4-8 months',
      salary: '$35,000 - $65,000',
      growth: '+4% annually',
      courses: [
        { name: 'CNC Machine Basics', completed: true },
        { name: 'G-Code Programming', completed: true },
        { name: 'Precision Measurement', completed: true },
        { name: 'Advanced CNC Operations', completed: false },
        { name: 'CAM Software Training', completed: false },
        { name: 'Multi-Axis Machining', completed: false }
      ],
      skills: [
        'Machine Setup',
        'G-Code Programming',
        'Blueprint Reading',
        'Precision Measurement',
        'Tool Selection',
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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 bg-gray-900 border-gray-700" 
          style={{ borderLeftColor: pathway.color.replace('bg-', '#') === 'bg-blue-500' ? '#3b82f6' : 
                                    pathway.color.replace('bg-', '#') === 'bg-purple-500' ? '#a855f7' : '#f97316' }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${pathway.color} text-white`}>
              <pathway.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{pathway.title}</h3>
              <p className="text-gray-300 mt-1">{pathway.description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">{pathway.progress}% Complete</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Course Progress</span>
            <span>{pathway.progress}%</span>
          </div>
          <Progress value={pathway.progress} className="h-2 bg-gray-700" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-700">
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <div className="text-sm font-medium text-white">{pathway.timeToComplete}</div>
            <div className="text-xs text-gray-400">Timeline</div>
          </div>
          <div className="text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-green-400 mb-1" />
            <div className="text-sm font-medium text-white">{pathway.salary}</div>
            <div className="text-xs text-gray-400">Salary Range</div>
          </div>
          <div className="text-center">
            <Zap className="w-5 h-5 mx-auto text-blue-400 mb-1" />
            <div className="text-sm font-medium text-white">{pathway.growth}</div>
            <div className="text-xs text-gray-400">Job Growth</div>
          </div>
        </div>

        {/* Course List */}
        <div>
          <h4 className="font-medium text-white mb-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Required Courses
          </h4>
          <div className="space-y-1">
            {pathway.courses.slice(0, 3).map((course, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={course.completed ? 'text-gray-500 line-through' : 'text-gray-300'}>
                  {course.name}
                </span>
                <Badge variant={course.completed ? 'default' : 'outline'} className={`text-xs ${course.completed ? 'bg-green-600 text-white' : 'border-gray-600 text-gray-300'}`}>
                  {course.completed ? 'Complete' : 'Pending'}
                </Badge>
              </div>
            ))}
            {pathway.courses.length > 3 && (
              <div className="text-xs text-gray-400">
                +{pathway.courses.length - 3} more courses
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700" 
            onClick={() => setSelectedPathway(selectedPathway === pathway.id ? null : pathway.id)}
          >
            {selectedPathway === pathway.id ? 'Hide Details' : 'View Details'}
          </Button>
          <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
            Continue Learning
          </Button>
        </div>

        {/* Expanded Details */}
        {selectedPathway === pathway.id && (
          <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
            {/* Skills */}
            <div>
              <h5 className="font-medium text-white mb-2">Key Skills</h5>
              <div className="flex flex-wrap gap-2">
                {pathway.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h5 className="font-medium text-white mb-2 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Recommended Certifications
              </h5>
              <ul className="text-sm text-gray-300 space-y-1">
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
              <h5 className="font-medium text-white mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Target Industries
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {pathway.industries.map((industry, idx) => (
                  <div key={idx} className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
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
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Career Pathways</h1>
          <p className="text-gray-300">
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
          <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-700">
            <CardContent className="py-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Ready to Advance Your Career?
              </h2>
              <p className="text-gray-300 mb-6">
                Complete your pathway assessments and start building the skills that matter in today&apos;s 
                advanced manufacturing industry.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Take Skills Assessment
                </Button>
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
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