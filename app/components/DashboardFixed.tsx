'use client';

import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Plus
} from 'lucide-react';
import CourseCarousel from './CourseCarousel';

export default function DashboardFixed() {
  const { user } = useAuth();

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
    <div className="space-y-8">
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
  );
} 