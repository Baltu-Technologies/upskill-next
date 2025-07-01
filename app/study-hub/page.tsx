'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Brain, 
  Target,
  ArrowRight,
  Bookmark,
  MessageSquare,
  Award,
  Users,
  BarChart3,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

export default function StudyHubPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[hsl(222,84%,4%)] dark:via-[hsl(222,84%,6%)] dark:to-[hsl(222,84%,8%)]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-cyan-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="relative px-6 pt-16 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full px-4 py-2 mb-6 border border-blue-200/30 dark:border-blue-400/20">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Your Learning Command Center</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6">
                Study Hub
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Master your skills with AI-powered study tools, personalized learning paths, and intelligent progress tracking.
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => router.push('/study-hub/ask-ai')}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Ask AI Tutor
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/80 dark:bg-[hsl(222,84%,12%)]/80 backdrop-blur-xl border-white/20 dark:border-[hsl(217,33%,17%)]/30 hover:bg-white dark:hover:bg-[hsl(222,84%,15%)] transition-all duration-300 hover:scale-105"
                  onClick={() => router.push('/study-hub/dojo')}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Practice Dojo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card 
              className="group cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/study-hub/study-list')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Study List</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Organize and track your learning materials</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">5 items due soon</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/study-hub/notes')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                    <Bookmark className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">AI-enhanced note-taking and organization</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">12 notes synced</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200/50 dark:border-green-800/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/study-hub/ask-ai')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                    <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Tutor</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Get instant help and explanations</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Available 24/7</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border-orange-200/50 dark:border-orange-800/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/study-hub/dojo')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
                    <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Practice Dojo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Skill drills and practice exercises</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">3 challenges ready</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Features */}
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full px-4 py-2 mb-6 border border-blue-200/30 dark:border-blue-400/20">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">More Features Coming Soon</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Enhanced Learning Experience
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              We're building advanced study analytics, collaborative study groups, and personalized learning recommendations to supercharge your education.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Detailed insights into your learning patterns and progress</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Study Groups</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Collaborate with peers and join focused study sessions</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Achievements</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Earn badges and track milestones as you progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 