'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from './ThemeToggle';
import { 
  Building2, 
  Users, 
  Plus, 
  Search,
  TrendingUp,
  Settings,
  Calendar,
  FileText,
  Target,
  Briefcase,
  UserCheck,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Mail,
  MessageSquare
} from 'lucide-react';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

export default function EmployerLayout({ children }: EmployerLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/employer-access',
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      title: 'Company Profile',
      href: '/employer-access/profile',
      icon: Building2,
      description: 'Manage Company Info'
    },
    {
      title: 'Job Postings',
      href: '/employer-access/jobs',
      icon: Briefcase,
      description: 'Manage Open Positions'
    },
    {
      title: 'Candidate Pipeline',
      href: '/employer-access/pipeline',
      icon: Users,
      description: 'Track Applications'
    },
    {
      title: 'Talent Search',
      href: '/employer-access/talent-search',
      icon: Search,
      description: 'Find Candidates'
    },
    {
      title: 'Analytics',
      href: '/employer-access/analytics',
      icon: BarChart3,
      description: 'Performance Metrics'
    },
    {
      title: 'Messages',
      href: '/employer-access/messages',
      icon: MessageSquare,
      description: 'Candidate Communication'
    },
    {
      title: 'Calendar',
      href: '/employer-access/calendar',
      icon: Calendar,
      description: 'Interview Scheduling'
    },
    {
      title: 'Reports',
      href: '/employer-access/reports',
      icon: FileText,
      description: 'Hiring Reports'
    },
    {
      title: 'Settings',
      href: '/employer-access/settings',
      icon: Settings,
      description: 'Account Settings'
    }
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/employer-access') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card/95 backdrop-blur-sm border-r border-border shadow-lg transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Employer Portal</h1>
                <p className="text-xs text-muted-foreground">Upskill Platform</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-xs opacity-70 truncate">{item.description}</p>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/auth0/logout'}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", isCollapsed ? "ml-16" : "ml-64")}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Building2 className="w-3 h-3 mr-1" />
                Employer Portal
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 