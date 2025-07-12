'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, BookOpen, Target, CheckCircle2, Play, GraduationCap, ArrowRight, Zap, Shield, Building2, MapPin, Briefcase, Users, Trophy, TrendingUp, Star, ArrowDown, Plus, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { sampleCourse } from '@/data/microlesson/sampleConfig';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CourseTestPage() {
  const router = useRouter();
  const course = sampleCourse;

  // Calculate total lessons, microlessons, and XP
  const totalLessons = course.lessons.length;
  const totalMicrolessons = course.lessons.reduce((total, lesson) => total + lesson.microlessons.length, 0);
  const totalXP = totalMicrolessons * 50; // 50 XP per microlesson

  // Mock course state - in real app this would come from user data/API
  type CourseState = 'not-added' | 'not-started' | 'in-progress' | 'completed';
  const [courseState] = useState<CourseState>('not-started'); // Change this to test different states
  
  // Calculate overall progress (mock data)
  const overallProgress = courseState === 'completed' ? 100 : courseState === 'in-progress' ? 33 : 0;

  const getCourseButtonConfig = () => {
    switch (courseState) {
      case 'not-added':
        return {
          text: 'Add Course',
          icon: Plus,
          className: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
          action: () => {
            // In real app: add course to user's enrolled courses
            console.log('Adding course to user library');
            router.push('/courses/test/lessons');
          }
        };
      case 'not-started':
        return {
          text: 'Start Course',
          icon: Play,
          className: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          action: () => router.push('/courses/test/lessons')
        };
      case 'in-progress':
        return {
          text: 'Continue Course',
          icon: Play,
          className: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
          action: () => router.push('/courses/test/lessons')
        };
      case 'completed':
        return {
          text: 'Review Course',
          icon: RotateCcw,
          className: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
          action: () => router.push('/courses/test/lessons')
        };
      default:
        return {
          text: 'Start Course',
          icon: Play,
          className: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          action: () => router.push('/courses/test/lessons')
        };
    }
  };

  const buttonConfig = getCourseButtonConfig();

  const handleViewLessons = () => {
    const curriculumSection = document.getElementById('course-curriculum');
    if (curriculumSection) {
      curriculumSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Large Hero Section - Similar to Lessons Page */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/semiconductor/Technician-with-wafer-in-semiconductor-FAB.jpg"
            alt="Technician with wafer in semiconductor fabrication facility"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl">
            {/* Course Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/25">
                <Image
                  src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=100&h=100&fit=crop&crop=center"
                  alt="Course"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-600/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl md:text-3xl">SC</span>
                </div>
              </div>
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Basics of{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                Semiconductor
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mb-12"
            >
              {course.description}
            </motion.p>
            
            {/* Course Meta */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-8 text-gray-300 mb-16"
            >
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-medium">{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Target className="w-6 h-6 text-green-400" />
                <span className="text-lg font-medium">{totalMicrolessons} Microlessons</span>
              </div>
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-medium">{totalXP} XP</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button
                onClick={buttonConfig.action}
                className={`${buttonConfig.className} text-white font-bold px-12 py-6 text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 group`}
              >
                <buttonConfig.icon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                {buttonConfig.text}
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={handleViewLessons}
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm font-bold px-12 py-6 text-lg rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                View Curriculum
              </Button>
            </motion.div>

            {/* Scroll Down Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col items-center mt-16"
            >
              <span className="text-gray-400 text-sm mb-3 font-medium">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  const content = document.getElementById('main-content');
                  if (content) {
                    content.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <ArrowDown className="w-5 h-5 text-white/70" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div id="main-content" className="container mx-auto px-4 py-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - What You'll Learn */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn Section - Condensed */}
            <Card className="group overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-400" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {course.learningOutcomes.map((objective: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-all duration-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm leading-snug">{objective}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            <Card id="course-curriculum" className="group overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  Course Curriculum
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {totalLessons} lessons • {totalMicrolessons} microlessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/lesson border border-slate-600 rounded-lg p-6 bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 hover:border-blue-400/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-2 group-hover/lesson:text-blue-400 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                            {lesson.description}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {lesson.microlessons.length} Learning Objectives • {lesson.duration}
                          </p>
                        </div>
                        <Play className="w-5 h-5 text-blue-400 mt-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity" />
                      </div>
                      

                      
                      {/* Microlessons */}
                      <div className="pl-4 border-l-2 border-slate-700 space-y-2">
                        {lesson.microlessons.slice(0, 3).map((microlesson, mlIndex) => (
                          <div key={mlIndex} className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                            <span className="text-slate-300">{microlesson.title}</span>
                          </div>
                        ))}
                        {lesson.microlessons.length > 3 && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                            <span className="text-slate-400">+{lesson.microlessons.length - 3} more microlessons</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Course Details & Features */}
          <div className="space-y-6">
            {/* Course Details Card */}
            <Card className="group overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400 font-medium">Duration</span>
                    <span className="text-white font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400 font-medium">Difficulty</span>
                    <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                      {course.skillLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400 font-medium">Lessons</span>
                    <span className="text-white font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400 font-medium">Microlessons</span>
                    <span className="text-white font-medium">{totalMicrolessons}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400 font-medium">XP Earned</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {totalXP}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Tags */}
            <Card className="group overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Course Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Semiconductor Manufacturing', 'Clean Room Operations', 'Wafer Processing', 'Quality Control', 'Safety Protocols', 'Equipment Maintenance', 'Photolithography', 'Industrial Operations'].map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-blue-400/50 text-blue-400 bg-blue-400/5 hover:bg-blue-400/10 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="group overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-green-400" />
                  Aligns with Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      name: 'IPC-A-610 Acceptability of Electronic Assemblies', 
                      org: 'IPC International',
                      level: 'Operator'
                    },
                    { 
                      name: 'Semiconductor Manufacturing Fundamentals', 
                      org: 'SEMI International',
                      level: 'Level 1'
                    },
                    { 
                      name: 'Clean Room Operations Certificate', 
                      org: 'IEST (Institute of Environmental Sciences)',
                      level: 'Basic'
                    }
                  ].map((cert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-all duration-200">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm leading-tight mb-1">{cert.name}</h4>
                        <p className="text-slate-400 text-xs">{cert.org}</p>
                        <Badge variant="outline" className="border-green-400/50 text-green-400 bg-green-400/5 text-xs mt-1">
                          {cert.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Badges You'll Earn */}
            <Card className="group overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-400" />
                  Badges You'll Earn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Semiconductor Fundamentals', color: 'from-blue-500 to-blue-600' },
                    { name: 'Clean Room Certified', color: 'from-green-500 to-green-600' },
                    { name: 'Safety Specialist', color: 'from-red-500 to-red-600' },
                    { name: 'Process Expert', color: 'from-purple-500 to-purple-600' }
                  ].map((badge, index) => (
                    <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-all duration-200">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center mb-2`}>
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-center text-slate-300 font-medium leading-tight">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card className="group overflow-hidden border-slate-700 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 hover:from-blue-900/50 hover:to-purple-900/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <CardContent className="p-6">
                <Button
                  onClick={buttonConfig.action}
                  className={`w-full ${buttonConfig.className} text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group`}
                >
                  <buttonConfig.icon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {buttonConfig.text}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hiring Partners Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Hiring Partners
          </h2>
          <p className="text-gray-300 text-center mb-8 max-w-3xl mx-auto">
            These employers actively hire professionals who complete our semiconductor training programs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Taiwan Semiconductor Manufacturing (TSMC)',
                logo: '/media/organization_logo/Tsmc.svg.png',
                description: 'Leading global semiconductor foundry providing advanced chip manufacturing.',
                locations: ['Phoenix, AZ', 'Chandler, AZ'],
                gradient: 'from-purple-600 to-blue-600'
              },
              {
                name: 'Amkor Technology',
                logo: '/media/organization_logo/amkor_technology.png',
                description: 'Global leader in semiconductor assembly and test services.',
                locations: ['Tempe, AZ', 'Chandler, AZ'],
                gradient: 'from-blue-600 to-indigo-600'
              },
              {
                name: 'Honeywell Aerospace',
                logo: '/media/organization_logo/honeywell-aerospace.jpg',
                description: 'Advanced aerospace technologies and manufacturing solutions.',
                locations: ['Tempe, AZ'],
                gradient: 'from-green-600 to-teal-600'
              }
            ].map((partner, index) => (
              <Card key={index} className="group cursor-pointer overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="relative h-32 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-120 group-hover:translate-x-2 group-hover:-translate-y-1">
                    <Image
                      src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center"
                      alt={partner.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${partner.gradient} opacity-80`} />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg leading-tight">{partner.name}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <MapPin className="h-3 w-3" />
                        {partner.locations.join(', ')}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Career Pathways Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Career Pathways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Semiconductor Technician',
                description: 'Work in clean room environments operating advanced manufacturing equipment for chip production.',
                salary: '$65K - $95K',
                growth: '+15% annually',
                skills: ['Clean Room Operations', 'Equipment Maintenance', 'Quality Control', 'Safety Protocols'],
                gradient: 'from-blue-600 to-purple-600'
              },
              {
                title: 'Process Engineer',
                description: 'Optimize manufacturing processes and troubleshoot production issues in semiconductor fabrication.',
                salary: '$85K - $125K',
                growth: '+12% annually',
                skills: ['Process Optimization', 'Data Analysis', 'Problem Solving', 'Technical Documentation'],
                gradient: 'from-green-600 to-teal-600'
              }
            ].map((pathway, index) => (
              <Card key={index} className="group overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className={`h-2 bg-gradient-to-r ${pathway.gradient}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2">{pathway.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">{pathway.description}</p>
                    </div>
                    <Briefcase className="w-6 h-6 text-blue-400 mt-1" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-green-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Salary Range</span>
                      </div>
                      <p className="text-white font-semibold">{pathway.salary}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-medium">Job Growth</span>
                      </div>
                      <p className="text-white font-semibold">{pathway.growth}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {pathway.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="border-slate-600 text-slate-300 bg-slate-900/50 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="group overflow-hidden border-slate-700 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 hover:from-blue-900/50 hover:via-purple-900/30 hover:to-blue-900/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <CardContent className="p-8">
              <GraduationCap className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who have advanced their careers in semiconductor manufacturing through our comprehensive training program.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={buttonConfig.action}
                  className={`${buttonConfig.className} text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  <buttonConfig.icon className="w-5 h-5 mr-2" />
                  {buttonConfig.text} Now
                </Button>
                <Button
                  onClick={handleViewLessons}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 px-8 py-3 rounded-xl"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  View Curriculum
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 