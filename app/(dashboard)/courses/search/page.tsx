'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Search,
  Filter,
  Clock,
  BookOpen,
  Trophy,
  X,
  SlidersHorizontal,
  ChevronDown,
  GraduationCap,
  Code2,
  Briefcase,
  Zap,
  Award,
  CheckCircle,
  PlayCircle,
  BookMarked,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sponsor: {
    name: string;
    logo: string;
    type: 'university' | 'company';
  };
  duration: number; // Duration in hours
  xpValue: number; // XP points earned
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  industryTags: string[]; // Industry tags like semiconductor, data centers, etc.
  technologies: string[];
  featured: boolean;
  category: string;
  certification?: string; // Optional certification
  progress?: number; // For in-progress courses (0-100)
  completed?: boolean; // For completed courses
  enrolledDate?: string; // For enrolled courses
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Semiconductor Manufacturing',
    description: 'Master modern semiconductor fabrication processes, cleanroom protocols, and yield optimization techniques.',
    imageUrl: 'https://picsum.photos/400/250?random=1',
    sponsor: {
      name: 'Intel Corporation',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg',
      type: 'company'
    },
    duration: 24,
    xpValue: 1200,
    level: 'Advanced',
    industryTags: ['Semiconductor', 'Manufacturing'],
    technologies: ['Lithography', 'Etching', 'Deposition', 'Metrology'],
    featured: true,
    category: 'Manufacturing',
    certification: 'Semiconductor Professional',
    progress: 75,
    enrolledDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Data Center Infrastructure Management',
    description: 'Learn data center design, cooling systems, power management, and network infrastructure optimization.',
    imageUrl: 'https://picsum.photos/400/250?random=2',
    sponsor: {
      name: 'Microsoft Corporation',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      type: 'company'
    },
    duration: 18,
    xpValue: 900,
    level: 'Intermediate',
    industryTags: ['Data Centers', 'Infrastructure'],
    technologies: ['Cooling Systems', 'Power Management', 'Network Design', 'Monitoring'],
    featured: true,
    category: 'Infrastructure',
    certification: 'Data Center Specialist',
    progress: 45,
    enrolledDate: '2024-01-10'
  },
  {
    id: '3',
    title: 'Industrial Automation & Robotics',
    description: 'Comprehensive training in automated manufacturing systems, PLC programming, and robotic integration.',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    sponsor: {
      name: 'Honeywell International',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Honeywell_logo.svg',
      type: 'company'
    },
    duration: 32,
    xpValue: 1600,
    level: 'Advanced',
    industryTags: ['Advanced Manufacturing', 'Automation'],
    technologies: ['PLC Programming', 'SCADA', 'Robotics', 'Machine Vision'],
    featured: false,
    category: 'Automation',
    certification: 'Industrial Automation Expert',
    completed: true,
    enrolledDate: '2023-12-01'
  },
  {
    id: '4',
    title: 'Clean Energy Systems Engineering',
    description: 'Design and optimize renewable energy systems including solar, wind, and energy storage solutions.',
    imageUrl: 'https://picsum.photos/400/250?random=4',
    sponsor: {
      name: 'General Electric',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/General_Electric_logo.svg',
      type: 'company'
    },
    duration: 28,
    xpValue: 1400,
    level: 'Intermediate',
    industryTags: ['Clean Energy', 'Manufacturing'],
    technologies: ['Solar Systems', 'Wind Energy', 'Battery Storage', 'Grid Integration'],
    featured: true,
    category: 'Energy',
    certification: 'Renewable Energy Engineer'
  },
  {
    id: '5',
    title: 'Advanced Materials Science',
    description: 'Explore cutting-edge materials for semiconductor and manufacturing applications.',
    imageUrl: 'https://picsum.photos/400/250?random=5',
    sponsor: {
      name: 'Arizona State University',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Arizona_State_University_logo.svg',
      type: 'university'
    },
    duration: 20,
    xpValue: 1000,
    level: 'Advanced',
    industryTags: ['Semiconductor', 'Advanced Manufacturing'],
    technologies: ['Nanotechnology', 'Composite Materials', 'Surface Engineering', 'Characterization'],
    featured: false,
    category: 'Materials',
    certification: 'Materials Science Professional',
    progress: 30,
    enrolledDate: '2024-01-20'
  },
  {
    id: '6',
    title: 'IoT Systems for Smart Manufacturing',
    description: 'Implement IoT solutions for Industry 4.0 manufacturing environments.',
    imageUrl: 'https://picsum.photos/400/250?random=6',
    sponsor: {
      name: 'Amkor Technology',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Amkor_logo.svg',
      type: 'company'
    },
    duration: 16,
    xpValue: 800,
    level: 'Beginner',
    industryTags: ['Advanced Manufacturing', 'Data Centers'],
    technologies: ['IoT Sensors', 'Edge Computing', 'Data Analytics', 'Cloud Integration'],
    featured: false,
    category: 'Technology',
    certification: 'IoT Systems Specialist'
  }
];

const industryTags = ['All Industries', 'Semiconductor', 'Data Centers', 'Advanced Manufacturing', 'Clean Energy', 'Automation', 'Infrastructure'];
const technologies = ['Lithography', 'PLC Programming', 'IoT Sensors', 'Cooling Systems', 'Solar Systems', 'Robotics', 'Nanotechnology', 'Edge Computing'];
const courseLevels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const certifications = ['All Certifications', 'Semiconductor Professional', 'Data Center Specialist', 'Industrial Automation Expert', 'Renewable Energy Engineer', 'Materials Science Professional', 'IoT Systems Specialist'];

type TabType = 'all' | 'in-progress' | 'completed';

export default function SearchCoursesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedCertification, setSelectedCertification] = useState('All Certifications');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommendations');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['all', 'in-progress', 'completed'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Get tab-specific courses
  const getTabCourses = (tab: TabType) => {
    switch (tab) {
      case 'in-progress':
        return courses.filter(course => course.progress !== undefined && !course.completed);
      case 'completed':
        return courses.filter(course => course.completed);
      default:
        return courses;
    }
  };

  // Filter and search logic
  useEffect(() => {
    const tabCourses = getTabCourses(activeTab);
    
    let filtered = tabCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.sponsor.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = selectedIndustry === 'All Industries' || 
                             course.industryTags.includes(selectedIndustry);
      const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
      const matchesCertification = selectedCertification === 'All Certifications' || 
                                  course.certification === selectedCertification;
      
      const matchesTechnologies = selectedTechnologies.length === 0 ||
                                 selectedTechnologies.some(tech => course.technologies.includes(tech));

      return matchesSearch && matchesIndustry && matchesLevel && 
             matchesCertification && matchesTechnologies;
    });

    // Sort courses
    switch (sortBy) {
      case 'recommendations':
        // Sort by recommendation score: featured + XP value + level appropriateness
        filtered.sort((a, b) => {
          const scoreA = (a.featured ? 1000 : 0) + a.xpValue + (a.level === 'Intermediate' ? 500 : 0);
          const scoreB = (b.featured ? 1000 : 0) + b.xpValue + (b.level === 'Intermediate' ? 500 : 0);
          return scoreB - scoreA;
        });
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case 'xp':
        filtered.sort((a, b) => b.xpValue - a.xpValue);
        break;
      case 'level':
        const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        filtered.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedIndustry, selectedTechnologies, selectedLevel, 
      selectedCertification, sortBy, courses, activeTab]);

  const handleTechnologyToggle = (tech: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All Industries');
    setSelectedTechnologies([]);
    setSelectedLevel('All Levels');
    setSelectedCertification('All Certifications');
  };

  const activeFiltersCount = [
    selectedIndustry !== 'All Industries',
    selectedTechnologies.length > 0,
    selectedLevel !== 'All Levels',
    selectedCertification !== 'All Certifications'
  ].filter(Boolean).length;

  const tabCounts = {
    all: courses.length,
    'in-progress': courses.filter(c => c.progress !== undefined && !c.completed).length,
    completed: courses.filter(c => c.completed).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Courses</h1>
              <p className="text-slate-600 dark:text-slate-300">Discover and manage your learning journey</p>
            </div>
          </div>

          {/* Horizontal Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-1 mb-6">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab('all');
                  router.push('/courses/search?tab=all');
                }}
                className={cn(
                  "flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
                  activeTab === 'all'
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                )}
              >
                <BookMarked className="h-4 w-4" />
                All Courses
                <Badge variant="secondary" className={cn(
                  "ml-1",
                  activeTab === 'all' ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                )}>
                  {tabCounts.all}
                </Badge>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('in-progress');
                  router.push('/courses/search?tab=in-progress');
                }}
                className={cn(
                  "flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
                  activeTab === 'in-progress'
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700"
                )}
              >
                <PlayCircle className="h-4 w-4" />
                In Progress
                <Badge variant="secondary" className={cn(
                  "ml-1",
                  activeTab === 'in-progress' ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                )}>
                  {tabCounts['in-progress']}
                </Badge>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('completed');
                  router.push('/courses/search?tab=completed');
                }}
                className={cn(
                  "flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
                  activeTab === 'completed'
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-700"
                )}
              >
                <CheckCircle className="h-4 w-4" />
                Completed
                <Badge variant="secondary" className={cn(
                  "ml-1",
                  activeTab === 'completed' ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                )}>
                  {tabCounts.completed}
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8 shadow-sm border border-slate-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search courses, sponsors, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform duration-200", 
                  showFilters && "rotate-180")} />
              </Button>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
                  <SelectItem value="recommendations">My Recommendations</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="xp">Highest XP Value</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="level">Difficulty Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Industry Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      Industry
                    </label>
                    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
                        {industryTags.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Course Level Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <GraduationCap className="h-4 w-4 text-purple-500" />
                      Course Level
                    </label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
                        {courseLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Certification Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Award className="h-4 w-4 text-green-500" />
                      Certification
                    </label>
                    <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
                        {certifications.map(cert => (
                          <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Technology Tags */}
                <div className="mt-6 space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Code2 className="h-4 w-4 text-cyan-500" />
                    Technologies & Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map(tech => (
                      <Badge
                        key={tech}
                        variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:scale-105",
                          selectedTechnologies.includes(tech)
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                        )}
                        onClick={() => handleTechnologyToggle(tech)}
                      >
                        {tech}
                        {selectedTechnologies.includes(tech) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={clearAllFilters} className="text-red-600 hover:text-red-700">
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
            Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            {searchQuery && <span className="text-blue-600"> for "{searchQuery}"</span>}
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer border border-slate-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
              <div className="relative">
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {course.featured && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Trophy className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-slate-700">
                  {course.level}
                </Badge>
                {course.progress !== undefined && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/50 rounded-lg p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-xs">Progress</span>
                        <span className="text-white text-xs font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1">
                        <div 
                          className="bg-white h-1 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {course.completed && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge className="w-full justify-center bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-yellow-600">{course.xpValue} XP</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Industry:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.industryTags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.technologies.slice(0, 3).map(tech => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {course.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fixed bottom section */}
                <div className="mt-6 space-y-4">
                  {course.certification && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                        Earns: {course.certification}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-gray-700 rounded-lg">
                        <img 
                          src={course.sponsor.logo} 
                          alt={course.sponsor.name}
                          className="h-6 w-6 object-contain"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            const fallback = target.nextElementSibling as HTMLElement;
                            target.style.display = 'none';
                            if (fallback) {
                              fallback.style.display = 'block';
                            }
                          }}
                        />
                        <span className="text-lg hidden">
                          {course.sponsor.type === 'university' ? '🎓' : '🏢'}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {course.sponsor.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {course.sponsor.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className={cn(
                        "transition-all duration-200",
                        course.progress !== undefined 
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : course.completed
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                    >
                      {course.progress !== undefined 
                        ? 'Continue' 
                        : course.completed 
                        ? 'Review' 
                        : 'Start Course'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Try adjusting your search criteria or filters to find more courses.
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 