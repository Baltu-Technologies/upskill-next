'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Plus
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CourseCarousel from './CourseCarousel';
import CollapsibleSidebar from './CollapsibleSidebar';
import { cn } from '@/lib/utils';

export default function DashboardFixed() {
  const { user, signOut } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const stats = [
    {
      title: "Courses Enrolled",
      value: "12",
      description: "+2 from last month",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Certificates Earned",
      value: "8",
      description: "+3 from last month",
      icon: GraduationCap,
      color: "text-green-600"
    },
    {
      title: "Learning Streak",
      value: "15 days",
      description: "Keep it up!",
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Study Groups",
      value: "4",
      description: "Active groups",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="sidebar-layout">
      {/* Desktop Sidebar - Always rendered but fixed positioned */}
      <div className="hidden md:block">
        <CollapsibleSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarCollapsed && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarCollapsed(true)} />
          <div className="absolute left-0 top-0 h-full max-w-[80vw]">
            <CollapsibleSidebar 
              isCollapsed={false} 
              onToggle={() => setIsSidebarCollapsed(true)} 
            />
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className={cn("sidebar-content", isSidebarCollapsed && "collapsed")}>
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="sidebar-aware-container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent md:hidden">
                  🚀 Upskill
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.signInDetails?.loginId || user?.email || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || user?.signInDetails?.loginId}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content with proper overflow handling */}
        <main className="sidebar-main">
          <div className="max-w-none space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.signInDetails?.loginId?.split('@')[0] || 'Learner'}!
              </h2>
              <p className="text-muted-foreground">
                Continue your learning journey and achieve your goals.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Enroll in New Course
                  </CardTitle>
                  <CardDescription>
                    Discover new skills and expand your knowledge
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Continue Learning
                  </CardTitle>
                  <CardDescription>
                    Resume your current courses and assignments
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Join Study Group
                  </CardTitle>
                  <CardDescription>
                    Connect with peers and learn together
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Featured Courses */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Featured Courses</h3>
                  <p className="text-muted-foreground">
                    Handpicked courses to boost your career
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  View All Courses
                </Button>
              </div>
              
              <CourseCarousel />
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: "Completed", item: "React Fundamentals - Chapter 5", time: "2 hours ago" },
                  { action: "Started", item: "Advanced TypeScript Patterns", time: "1 day ago" },
                  { action: "Earned", item: "JavaScript Expert Certificate", time: "3 days ago" },
                  { action: "Joined", item: "Frontend Development Study Group", time: "1 week ago" }
                ].map((activity, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          <span className="text-primary">{activity.action}</span> {activity.item}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 