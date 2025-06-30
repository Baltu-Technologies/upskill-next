'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Home,
  BookOpen, 
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Briefcase,
  HelpCircle,
  MessageCircle,
  BarChart3,
  Target,
  Trophy,
  Users,
  GraduationCap,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  FileText,
  Clock,
  Star,
  Gamepad2,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';
import MyAccountPopup from './MyAccountPopup';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  active?: boolean;
  color?: string;
  submenu?: SubMenuItem[];
  isProfile?: boolean;
}

interface SubMenuItem {
  title: string;
  href?: string;
  active?: boolean;
  badge?: string;
}



const bottomNavItems: NavItem[] = [
  // Settings moved to profile dropdown
];

// Submenu Item Component
const SubMenuItem = ({ 
  item, 
  isCollapsed 
}: { 
  item: SubMenuItem; 
  isCollapsed: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if this item is active based on current pathname
  const isActive = item.href === pathname;
  
  const handleClick = () => {
    if (item.href) {
      router.push(item.href);
      // Note: We don't change sidebar state here - it stays as it was
    }
  };

  return (
    <div className="relative group/submenu w-full overflow-hidden">
      <Button
        variant="ghost"
        onClick={handleClick}
        className={cn(
          "justify-start relative overflow-hidden group transition-all duration-300 ease-out",
          "ml-4 mr-1 px-2 py-2.5 text-sm rounded-lg w-[calc(100%-1.25rem)]",
          "hover:scale-105 backdrop-blur-sm border-none shadow-sm",
          item.href ? "cursor-pointer" : "cursor-default",
          isActive 
            ? "bg-[hsl(217,91%,60%)]/20 text-[hsl(217,91%,60%)] shadow-md border border-[hsl(217,91%,60%)]/20" 
            : "bg-transparent text-slate-600 hover:bg-[hsl(217,91%,60%)]/10 hover:text-[hsl(217,91%,60%)] hover:shadow-sm hover:border hover:border-[hsl(217,91%,60%)]/20",
          // Dark mode variants
          isActive
            ? "dark:bg-[hsl(217,91%,60%)]/20 dark:text-[hsl(217,91%,60%)] dark:shadow-md dark:border dark:border-[hsl(217,91%,60%)]/30"
            : "dark:bg-transparent dark:text-[hsl(210,40%,98%)]/80 dark:hover:bg-[hsl(217,91%,60%)]/15 dark:hover:text-[hsl(217,91%,60%)] dark:hover:shadow-sm dark:hover:border dark:hover:border-[hsl(217,91%,60%)]/20"
        )}
        size="sm"
      >
        {/* Hover indicator line */}
        <div className="absolute left-1 top-0 h-full w-0.5 bg-[hsl(217,91%,60%)]/70 
                        scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center shadow-sm" />
        
        {/* Active indicator line */}
        {isActive && (
          <div className="absolute left-1 top-0 h-full w-0.5 bg-[hsl(217,91%,60%)] shadow-md" />
        )}
        
        <span className="flex-1 text-left transition-all duration-300 group-hover:translate-x-1 leading-tight truncate min-w-0">
          {item.title}
        </span>
        
        {item.href && (
          <ChevronRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-[hsl(217,91%,60%)] transition-all duration-300" />
        )}
        
        {item.badge && (
          <span className="ml-1 text-xs px-1 py-0.5 rounded-full font-medium
                          bg-[hsl(217,91%,60%)]/70 text-white group-hover:bg-[hsl(217,91%,60%)]
                          dark:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)]/70 dark:group-hover:bg-[hsl(217,91%,60%)]/20 dark:group-hover:text-[hsl(217,91%,60%)] dark:bg-none
                          transition-all duration-300 group-hover:scale-110 shrink-0 flex-none">
            {item.badge}
          </span>
        )}
      </Button>
      
      {/* Tooltip for truncated text */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-200/95 text-slate-700
                      dark:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)]
                      text-xs rounded-md shadow-lg border-none z-50 opacity-0 group-hover/submenu:opacity-100 
                      transition-opacity duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm
                      top-1/2 -translate-y-1/2">
        {item.title}
        {item.badge && <span className="ml-1 text-[hsl(217,91%,60%)]">({item.badge})</span>}
      </div>
    </div>
  );
};

// Interactive Button Component with Enhanced Hover Effects and Submenu Support
const InteractiveNavButton = ({ 
  item, 
  isCollapsed, 
  isActive = false, 
  variant = "ghost",
  expandedMenus,
  onToggleSubmenu
}: { 
  item: NavItem; 
  isCollapsed: boolean; 
  isActive?: boolean; 
  variant?: "ghost" | "secondary" | "outline" | "default";
  expandedMenus: Set<string>;
  onToggleSubmenu: (title: string) => void;
}) => {
  const router = useRouter();
  const Icon = item.icon;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expandedMenus.has(item.title);
  
  const handleClick = () => {
    if (isCollapsed && item.href && !item.isProfile) {
      // When collapsed, clicking non-profile icons navigates to default page and keeps sidebar collapsed
      router.push(item.href);
      return; // Important: prevent any further submenu toggling
    } else if (item.submenu && item.submenu.length > 0) {
      // When expanded, or for profile menu even when collapsed, toggle submenu
      onToggleSubmenu(item.title);
    } else if (item.href) {
      // Navigate to single page
      router.push(item.href);
    }
  };
  
  return (
    <div>
      <Button
        variant={isActive ? "secondary" : variant}
        onClick={handleClick}
        className={cn(
          "w-full justify-start relative overflow-hidden group transition-all duration-300 ease-out",
          isCollapsed ? "px-2 py-3" : "px-4 py-3 mx-1",
          "hover:scale-105 active:scale-95 transition-transform rounded-xl",
          "backdrop-blur-sm shadow-sm border-none",
          // Special styling for profile section
          item.isProfile && !isCollapsed ? "py-4 min-h-[4rem]" : "",
          isActive 
            ? "bg-[hsl(217,91%,60%)]/20 text-[hsl(217,91%,60%)] shadow-lg shadow-[hsl(217,91%,60%)]/25 border border-[hsl(217,91%,60%)]/30" 
            : "bg-transparent hover:bg-[hsl(217,91%,60%)]/10 text-slate-700 hover:text-[hsl(217,91%,60%)] hover:shadow-md hover:border hover:border-[hsl(217,91%,60%)]/20",
          // Dark mode variants
          isActive
            ? "dark:bg-[hsl(217,91%,60%)]/20 dark:text-[hsl(217,91%,60%)] dark:shadow-lg dark:shadow-[hsl(217,91%,60%)]/25 dark:border dark:border-[hsl(217,91%,60%)]/40"
            : "dark:bg-transparent dark:hover:bg-[hsl(217,91%,60%)]/15 dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)] dark:hover:shadow-md dark:hover:border dark:hover:border-[hsl(217,91%,60%)]/25"
        )}
        size={isCollapsed ? "icon" : "default"}
      >
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(217,91%,60%)]/0 via-[hsl(217,91%,60%)]/10 to-[hsl(217,91%,60%)]/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon with enhanced hover effects - Special handling for profile */}
        {item.isProfile && !isCollapsed ? (
          <div className="flex items-center gap-3 mr-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[hsl(217,91%,60%)] p-0.5">
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[hsl(222,84%,12%)] flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[hsl(217,91%,60%)]" />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-100 dark:border-[hsl(222,84%,12%)]"></div>
            </div>
          </div>
        ) : (
          <Icon className={cn(
            "h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
            !isCollapsed && "mr-3",
            isActive ? "text-[hsl(217,91%,60%)]" : "text-slate-600",
            "group-hover:text-[hsl(217,91%,60%)] group-hover:drop-shadow-md",
            // Dark mode variants
            !isActive && "dark:text-[hsl(210,40%,98%)]/70"
          )} />
        )}
        
        {!isCollapsed && (
          <>
            <div className="flex-1 text-left transition-all duration-300 group-hover:translate-x-1">
              <span className={cn(
                "font-semibold text-base transition-all duration-300 leading-tight",
                "group-hover:text-[hsl(217,91%,60%)]",
                "text-slate-700 dark:text-[hsl(210,40%,98%)]",
                item.isProfile ? "text-lg" : ""
              )}>
                {item.title}
              </span>
              {item.isProfile && (
                <div className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/50 mt-0.5">
                  View & Edit Profile
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              {item.badge && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-semibold",
                  "transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm",
                  isActive 
                    ? "bg-[hsl(217,91%,60%)] text-[hsl(210,40%,98%)] shadow-md" 
                    : "bg-[hsl(217,91%,60%)]/80 text-white group-hover:bg-[hsl(217,91%,60%)]",
                  // Dark mode variants  
                  !isActive && "dark:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:group-hover:bg-[hsl(217,91%,60%)] dark:group-hover:text-[hsl(210,40%,98%)] dark:bg-none"
                )}>
                  {item.badge}
                </span>
              )}
              
              {hasSubmenu && (
                <ChevronDown className={cn(
                  "h-3 w-3 transition-all duration-300",
                  isExpanded ? "rotate-180 text-[hsl(217,91%,60%)]" : "rotate-0",
                  "group-hover:text-[hsl(217,91%,60%)]",
                  "text-slate-600 dark:text-[hsl(210,40%,98%)]/70"
                )} />
              )}
            </div>
          </>
        )}
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className={cn(
            "absolute left-full ml-2 bg-slate-200/95 text-slate-700",
            "dark:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)]",
            "text-xs rounded-md shadow-lg border-none z-50 opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm",
            item.isProfile ? "px-3 py-2" : "px-2 py-1"
          )}>
            {item.isProfile ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[hsl(217,91%,60%)] p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[hsl(222,84%,15%)] flex items-center justify-center">
                    <User className="h-3 w-3 text-[hsl(217,91%,60%)]" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs opacity-75">View & Edit</div>
                </div>
              </div>
            ) : (
              <>
                {item.title}
                {item.badge && <span className="ml-1 text-[hsl(217,91%,60%)]">({item.badge})</span>}
                {hasSubmenu && <span className="ml-1 text-[hsl(210,40%,98%)]/50">▼</span>}
              </>
            )}
          </div>
        )}
      </Button>
      
      {/* Submenu with smooth animation */}
      {hasSubmenu && !isCollapsed && (
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-out w-full",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="space-y-1 py-2 w-full overflow-hidden flex flex-col items-stretch">
            {item.submenu?.map((subItem, index) => (
              <SubMenuItem 
                key={index} 
                item={subItem} 
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Interactive Quick Action Button
const QuickActionButton = ({ 
  children, 
  variant = "outline", 
  className = "", 
  ...props 
}: any) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "transition-all duration-300 ease-out group",
        "hover:scale-105 hover:shadow-lg hover:shadow-primary/25",
        "active:scale-95",
        "hover:bg-primary/10 hover:border-primary/50 hover:text-primary",
        className
      )}
      {...props}
    >
      <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        {children}
      </div>
    </Button>
  );
};

export default function CollapsibleSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false);

  // Define navigation items (active state will be calculated dynamically)
  const mainNavItems: NavItem[] = [
    // Home - Shows "Welcome, Peter!" in main content area
    {
      title: 'Home',
      icon: Home,
      href: '/',
      color: 'text-blue-500'
    },
    
    // Courses with submenu
    {
      title: 'Courses',
      icon: BookOpen,
      color: 'text-purple-500',
      href: '/courses',
      submenu: [
        {
          title: 'My Courses',
          href: '/courses/my-learning'
        },
        {
          title: 'All Courses',
          href: '/courses'
        },
        {
          title: 'Certifications',
          href: '/certifications'
        }
      ]
    },
    
    // Career Opportunities with submenu
    {
      title: 'Career Opportunities',
      icon: Briefcase,
      color: 'text-orange-500',
      href: '/employers',
      submenu: [
        {
          title: 'All Employers',
          href: '/employers'
        },
        {
          title: 'My Career Matches',
          href: '/employers/career-matches'
        },
        {
          title: 'My Submissions',
          href: '/employers/submissions'
        }
      ]
    },
    
    // MicroLessons - Interactive learning content
    {
      title: 'MicroLessons',
      icon: Play,
      color: 'text-green-500',
      href: '/microlessons'
    },
    
    // Course Test - Prototype course structure
    {
      title: 'Course Test',
      icon: GraduationCap,
      color: 'text-blue-600',
      href: '/courses/test',
      submenu: [
        {
          title: 'Course Overview',
          href: '/courses/test'
        },
        {
          title: 'Lessons',
          href: '/courses/test/lessons'
        },
        {
          title: 'Progress',
          href: '/courses/test/progress'
        }
      ]
    }
  ];

  // Function to check if a main nav item is active
  const isMainNavItemActive = (item: NavItem): boolean => {
    if (item.href === '/') {
      // Home route should be active for both "/" and "/dashboard" since authenticated users get redirected
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(item.href || '');
  };

  // Define profile submenu items - now includes Career Explorer and My Pathways
  const profileSubmenuItems = [
    {
      title: 'My Profile',
      href: '/profile'
    },
    {
      title: 'Career Explorer',
      href: '/career-exploration'
    },
    {
      title: 'My Pathways',
      href: '/career-exploration/pathways'
    },
    {
      title: 'Stats & Goals',
      href: '/stats-goals'
    },
    {
      title: 'Study Hub',
      href: '/study-hub'
    }
  ];

  // Auto-collapse submenus when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setExpandedMenus(new Set());
    }
  }, [isCollapsed]);

  // Auto-expand relevant menus based on current page
  useEffect(() => {
    const newExpandedMenus = new Set<string>();
    
    // Profile-related pages - now includes career exploration
    if (pathname === '/profile' || 
        pathname === '/stats-goals' || 
        pathname === '/study-hub' ||
        pathname.startsWith('/career-exploration')) {
      newExpandedMenus.add('Profile');
    }
    
    // Courses pages
    if (pathname.startsWith('/courses')) {
      newExpandedMenus.add('Courses');
    }
    
    // Career Opportunities pages
    if (pathname.startsWith('/employers')) {
      newExpandedMenus.add('Career Opportunities');
    }
    
    // Course Test pages
    if (pathname.startsWith('/courses/test')) {
      newExpandedMenus.add('Course Test');
    }
    
    setExpandedMenus(newExpandedMenus);
  }, [pathname]);

  // Check for mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleToggleSubmenu = (title: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  // Theme toggle function
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <div 
        className={cn(
          "fixed left-0 top-0 flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0",
          "bg-slate-200/95",
          "dark:bg-[hsl(222,84%,8%)]",
          "backdrop-blur-xl border-r border-slate-300/80 dark:border-[hsl(217,33%,17%)]/20",
          "shadow-[0_0_30px_rgba(0,0,0,0.08)] shadow-slate-200/50",
          "dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] dark:shadow-black/20",
          // Simple shadow without glow
          "shadow-lg",
          "font-['Inter_Variable',system-ui,sans-serif]",
          // Responsive width: extra wide to accommodate longer menu text
          isCollapsed ? "w-16" : isMobile ? "w-72" : "w-80",
          // Ensure sidebar doesn't overflow on small screens
          "max-w-[90vw] sm:max-w-none",

        )}
        style={{ 
          fontFamily: "'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          zIndex: 40 
        }}
      >
      {/* Logo Section with Toggle Button */}
      <div className="px-4 py-6 border-b border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30 bg-slate-200/95 dark:bg-[hsl(222,84%,8%)] backdrop-blur-sm">
        {isCollapsed ? (
          /* Collapsed State - Show flower logo and toggle button */
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10">
              <Image 
                src="/media/baltu_technologies_logo_flower_only.png" 
                alt="Upskill Flower Logo" 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-6 w-6 bg-slate-300/80 hover:bg-slate-400/80 text-slate-600 hover:text-[hsl(217,91%,60%)]
                        dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)]
                        hover:scale-105 transition-all duration-200 rounded-full border-none"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          /* Expanded State - Show full logo with toggle button on the right */
          <div className="flex items-center justify-between">
            <div className="w-60 h-16">
              <Image 
                src="/media/baltu_technologies_logo_long_upskill_white.png" 
                alt="Upskill Full Logo" 
                width={240} 
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 bg-slate-300/80 hover:bg-slate-400/80 text-slate-600 hover:text-[hsl(217,91%,60%)]
                        dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)]
                        hover:scale-105 transition-all duration-200 rounded-full border-none flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="px-3 py-4 border-b border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30">
        {isCollapsed ? (
          /* Collapsed State - Show only avatar */
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleSubmenu('Profile')}
              className="w-12 h-12 p-0 rounded-full hover:scale-105 transition-all duration-200
                        bg-slate-200/60 hover:bg-slate-300/80 dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                <Image 
                  src="/media/Peter_Costa_Bio_2024.jpg" 
                  alt="Peter Costa" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Button>
          </div>
        ) : (
          /* Expanded State - Show full profile info as clickable menu item */
          <Button
            variant="ghost"
            onClick={() => handleToggleSubmenu('Profile')}
            className={cn(
              "w-full justify-start relative overflow-hidden group transition-all duration-300 ease-out",
              "px-4 py-4 mx-0 rounded-xl",
              "hover:scale-105 active:scale-95 transition-transform",
              "backdrop-blur-sm shadow-sm border-none min-h-[5rem]",
              expandedMenus.has('Profile')
                ? "bg-[hsl(217,91%,60%)]/20 text-[hsl(217,91%,60%)] shadow-lg shadow-[hsl(217,91%,60%)]/25 border border-[hsl(217,91%,60%)]/30" 
                : "bg-transparent hover:bg-[hsl(217,91%,60%)]/10 text-slate-700 hover:text-[hsl(217,91%,60%)] hover:shadow-md hover:border hover:border-[hsl(217,91%,60%)]/20",
              // Dark mode variants
              expandedMenus.has('Profile')
                ? "dark:bg-[hsl(217,91%,60%)]/20 dark:text-[hsl(217,91%,60%)] dark:shadow-lg dark:shadow-[hsl(217,91%,60%)]/25 dark:border dark:border-[hsl(217,91%,60%)]/40"
                : "dark:bg-transparent dark:hover:bg-[hsl(217,91%,60%)]/15 dark:text-[hsl(210,40%,98%)]/80 dark:hover:text-[hsl(217,91%,60%)] dark:hover:shadow-md dark:hover:border dark:hover:border-[hsl(217,91%,60%)]/25"
            )}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 shadow-lg">
                <Image 
                  src="/media/Peter_Costa_Bio_2024.jpg" 
                  alt="Peter Costa" 
                  width={48} 
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-base font-semibold truncate">
                  Peter Costa
                </h3>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  expandedMenus.has('Profile') ? "rotate-180" : ""
                )} 
              />
            </div>
          </Button>
        )}
        
        {/* Profile Submenu */}
        {expandedMenus.has('Profile') && !isCollapsed && (
          <div className="mt-2 space-y-1">
            {profileSubmenuItems.map((item) => (
              <SubMenuItem key={item.title} item={item} isCollapsed={false} />
            ))}
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 pt-6 pb-3 overflow-y-auto 
                      scrollbar-thin scrollbar-track-slate-200/30 scrollbar-thumb-blue-500/80 
                      dark:scrollbar-track-slate-800/50 dark:scrollbar-thumb-blue-400/60
                      hover:scrollbar-thumb-blue-600/90 dark:hover:scrollbar-thumb-blue-300/80">
        <div className="space-y-2">
          {mainNavItems.map((item, index) => (
            <InteractiveNavButton
              key={index}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isMainNavItemActive(item)}
              expandedMenus={expandedMenus}
              onToggleSubmenu={handleToggleSubmenu}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-3 mt-auto border-t border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30">
        <div className="space-y-2">
          {/* My Account Button */}
          <Button 
            variant="ghost" 
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "transition-all duration-300 hover:scale-105",
              isCollapsed 
                ? "w-10 h-10 p-0" 
                : "w-full justify-start h-10 px-3",
              "bg-transparent hover:bg-slate-300/40 text-slate-600 hover:text-[hsl(217,91%,60%)]",
              "dark:bg-transparent dark:hover:bg-[hsl(222,84%,10%)] dark:text-[hsl(210,40%,98%)]/80 dark:hover:text-[hsl(217,91%,60%)]"
            )}
            onClick={() => {
              setIsAccountPopupOpen(true);
            }}
          >
            <User className="h-4 w-4 fill-current" />
            {!isCollapsed && <span className="ml-2">My Account</span>}
          </Button>

          {/* Settings Button */}
          <Button 
            variant="ghost" 
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "transition-all duration-300 hover:scale-105",
              isCollapsed 
                ? "w-10 h-10 p-0" 
                : "w-full justify-start h-10 px-3",
              "bg-transparent hover:bg-slate-300/40 text-slate-600 hover:text-[hsl(217,91%,60%)]",
              "dark:bg-transparent dark:hover:bg-[hsl(222,84%,10%)] dark:text-[hsl(210,40%,98%)]/80 dark:hover:text-[hsl(217,91%,60%)]"
            )}
            onClick={() => {
              router.push('/settings');
            }}
          >
            <Settings className="h-4 w-4 fill-current" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>

          {/* Help & Support Button */}
          <Button 
            variant="ghost" 
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "transition-all duration-300 hover:scale-105",
              isCollapsed 
                ? "w-10 h-10 p-0" 
                : "w-full justify-start h-10 px-3",
              "bg-transparent hover:bg-slate-300/40 text-slate-600 hover:text-[hsl(217,91%,60%)]",
              "dark:bg-transparent dark:hover:bg-[hsl(222,84%,10%)] dark:text-[hsl(210,40%,98%)]/80 dark:hover:text-[hsl(217,91%,60%)]"
            )}
            onClick={() => {
              // Open Help & Support page or modal
              console.log('Opening Help & Support...');
              router.push('/help');
            }}
          >
            <HelpCircle className="h-4 w-4 fill-current" />
            {!isCollapsed && <span className="ml-2">Help & Support</span>}
          </Button>
        </div>
      </div>

      {/* My Account Popup */}
      <MyAccountPopup 
        isOpen={isAccountPopupOpen}
        onClose={() => setIsAccountPopupOpen(false)}
      />
    </div>
  );
} 