'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home,
  BookOpen, 
  GraduationCap, 
  Users, 
  TrendingUp,
  Settings,
  Award,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Briefcase,
  X,
  Sun,
  Moon,
  Monitor,
  LogOut,
  HelpCircle,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

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

// Career Profile item (separate from main nav)
const careerProfileItem: NavItem = {
  title: 'My Career Profile',
  icon: User,
  color: 'text-cyan-500',
  isProfile: true,
  href: '/profile',
  submenu: [
    {
      title: 'My Profile',
      href: '/profile',
      active: false
    },
    {
      title: 'Skills Profile',
      href: '/profile?tab=skills',
      active: false
    },
    {
      title: 'My Pathways',
      href: '/profile?tab=pathways',
      active: false
    },
    {
      title: 'Project Showcase',
      href: '/profile?tab=projects',
      badge: '3',
      active: false
    },
    {
      title: 'Certifications',
      href: '/profile?tab=certifications',
      badge: '8',
      active: false
    },
    {
      title: 'My Stats and Goals',
      href: '/profile?tab=stats',
      active: false
    }
  ]
};

const mainNavItems: NavItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/',
    active: true,
    color: 'text-blue-500'
  },
  {
    title: 'Career Opportunities',
    icon: Briefcase,
    badge: '5',
    color: 'text-purple-500',
    href: '/employers/search',
    submenu: [
      {
        title: 'Search Employers',
        href: '/employers/search',
        active: false
      },
      {
        title: 'Saved Employers',
        href: '/employers/saved',
        badge: '3',
        active: false
      },
      {
        title: 'My Employer Connections',
        href: '/employers/connections',
        badge: '2',
        active: false
      }
    ]
  },
  {
    title: 'Study Hub',
    icon: GraduationCap,
    color: 'text-indigo-500',
    href: '/study-hub/study-list',
    submenu: [
      {
        title: 'My Study List',
        href: '/study-hub/study-list',
        active: false
      },
      {
        title: 'My Notes',
        href: '/study-hub/notes',
        active: false
      },
      {
        title: 'Dojo',
        href: '/study-hub/dojo',
        active: false
      }
    ]
  }
];

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
          item.active 
            ? "bg-slate-200/70 text-[hsl(217,91%,60%)]" 
            : "bg-slate-200/50 text-slate-600 hover:bg-slate-300/70 hover:text-[hsl(217,91%,60%)]",
          // Dark mode variants
          item.active
            ? "dark:bg-[hsl(222,84%,15%)] dark:text-[hsl(217,91%,60%)]"
            : "dark:bg-[hsl(222,84%,10%)] dark:text-[hsl(210,40%,98%)]/80 dark:hover:bg-[hsl(222,84%,15%)] dark:hover:text-[hsl(217,91%,60%)]"
        )}
        size="sm"
      >
        {/* Hover indicator line */}
        <div className="absolute left-1 top-0 h-full w-0.5 bg-[hsl(217,91%,60%)]/50 
                        scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
        
        <span className="flex-1 text-left transition-all duration-300 group-hover:translate-x-1 leading-tight truncate min-w-0">
          {item.title}
        </span>
        
        {item.href && (
          <ChevronRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-[hsl(217,91%,60%)] transition-all duration-300" />
        )}
        
        {item.badge && (
          <span className="ml-1 text-xs px-1 py-0.5 rounded-full font-medium
                          bg-gradient-to-r from-[hsl(217,91%,60%)]/70 to-[hsl(142,71%,45%)]/70 text-white group-hover:from-[hsl(217,91%,60%)] group-hover:to-[hsl(142,71%,45%)]
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
            ? "bg-gradient-to-r from-[hsl(217,91%,60%)]/15 to-[hsl(142,71%,45%)]/15 text-[hsl(217,91%,60%)] shadow-lg shadow-[hsl(217,91%,60%)]/20" 
            : "bg-slate-200/60 hover:bg-slate-300/80 text-slate-700 hover:text-[hsl(217,91%,60%)]",
          // Dark mode variants
          isActive
            ? "dark:bg-gradient-to-r dark:from-[hsl(217,91%,60%)]/15 dark:to-[hsl(142,71%,45%)]/15 dark:text-[hsl(217,91%,60%)] dark:shadow-lg dark:shadow-[hsl(217,91%,60%)]/20"
            : "dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)]"
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(142,71%,45%)] p-0.5">
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
                    : "bg-gradient-to-r from-[hsl(217,91%,60%)]/80 to-[hsl(142,71%,45%)]/80 text-white group-hover:from-[hsl(217,91%,60%)] group-hover:to-[hsl(142,71%,45%)]",
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
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(142,71%,45%)] p-0.5">
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
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  
  // Bottom navigation states
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('English');
  
  // Refs for click outside detection
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto-collapse submenus when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setExpandedMenus(new Set());
    }
  }, [isCollapsed]);

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

  // Language toggle function
  const toggleLanguage = () => {
    const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  // Get current language flag
  const getLanguageFlag = () => {
    switch (language) {
      case 'Spanish': return '🇪🇸';
      case 'French': return '🇫🇷';
      case 'German': return '🇩🇪';
      case 'Portuguese': return '🇵🇹';
      default: return '🇺🇸';
    }
  };

  // Close popups when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close search on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowSearch(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div 
        className={cn(
          "fixed left-0 top-0 flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0",
          "bg-gradient-to-b from-slate-200/95 via-slate-300/90 to-slate-200/95",
          "dark:bg-gradient-to-b dark:from-[hsl(222,84%,8%)] dark:via-[hsl(222,84%,6%)] dark:to-[hsl(222,84%,8%)]",
          "backdrop-blur-xl border-r border-slate-300/80 dark:border-[hsl(217,33%,17%)]/20",
          "shadow-[0_0_30px_rgba(0,0,0,0.08)] shadow-slate-200/50",
          "dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] dark:shadow-black/20",
          // Enhanced shadow with right-side glow
          "shadow-[8px_0_32px_rgba(148,163,184,0.15),0_0_30px_rgba(0,0,0,0.08)]",
          "dark:shadow-[8px_0_32px_rgba(59,130,246,0.08),0_0_50px_rgba(0,0,0,0.5)]",
          "font-['Inter_Variable',system-ui,sans-serif]",
          // Responsive width: extra wide to accommodate longer menu text
          isCollapsed ? "w-16" : isMobile ? "w-72" : "w-80",
          // Ensure sidebar doesn't overflow on small screens
          "max-w-[90vw] sm:max-w-none",
          // Add subtle glow effect on the right edge
          "after:content-[''] after:absolute after:top-0 after:right-0 after:h-full after:w-1",
          "after:bg-gradient-to-r after:from-transparent after:via-slate-400/30 after:to-transparent",
          "dark:after:bg-gradient-to-r dark:after:from-transparent dark:after:via-[hsl(217,91%,60%)]/20 dark:after:to-transparent",
          "after:blur-sm after:pointer-events-none"
        )}
        style={{ 
          fontFamily: "'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          zIndex: 40 
        }}
      >
      {/* Sidebar Header with Career Profile */}
      <div className="bg-gradient-to-r from-slate-300/80 to-slate-200/80 dark:from-[hsl(222,84%,10%)] dark:to-[hsl(222,84%,12%)] backdrop-blur-sm border-b border-slate-300/70 dark:border-[hsl(217,33%,17%)]/20">
        {isCollapsed ? (
          /* Collapsed State - Show only toggle button centered */
          <div className="flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 bg-slate-300/80 hover:bg-slate-400/80 text-slate-600 hover:text-[hsl(217,91%,60%)]
                        dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)]
                        hover:scale-110 transition-all duration-300 hover:rotate-180 rounded-full border-none"
            >
              <ChevronRight className="h-4 w-4 transition-transform duration-300" />
            </Button>
          </div>
        ) : (
          /* Expanded State - Show both profile and toggle */
          <div className="flex items-center justify-between p-4">
            {/* Career Profile Section */}
            <div className="flex-1 mr-4">
              <InteractiveNavButton
                item={careerProfileItem}
                isCollapsed={isCollapsed}
                isActive={false}
                expandedMenus={expandedMenus}
                onToggleSubmenu={handleToggleSubmenu}
              />
            </div>
            
            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 bg-slate-300/80 hover:bg-slate-400/80 text-slate-600 hover:text-[hsl(217,91%,60%)]
                        dark:bg-[hsl(222,84%,12%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)] dark:hover:text-[hsl(217,91%,60%)]
                        hover:scale-110 transition-all duration-300 hover:rotate-180 rounded-full border-none flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
            </Button>
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
              isActive={item.active}
              expandedMenus={expandedMenus}
              onToggleSubmenu={handleToggleSubmenu}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-3 mt-auto border-t border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30">
        {!isCollapsed && (
          <div className="text-xs font-medium text-slate-500 dark:text-[hsl(210,40%,98%)]/50 uppercase tracking-wide mb-2">
            Tools
          </div>
        )}
        
                  <div className="space-y-2">
          {/* Help Button */}
          <Button 
            variant="ghost" 
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "transition-all duration-300 hover:scale-105",
              isCollapsed 
                ? "w-10 h-10 p-0" 
                : "w-full justify-start h-10 px-3",
              "bg-slate-200/50 hover:bg-slate-300/70 text-slate-600 hover:text-[hsl(217,91%,60%)]",
              "dark:bg-[hsl(222,84%,10%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)]/80 dark:hover:text-[hsl(217,91%,60%)]"
            )}
            onClick={() => {
              // Open AI Help chatbot for site navigation
              console.log('Opening AI Help & Support chatbot for site navigation...');
              // TODO: Implement AI Help chatbot modal/panel
            }}
          >
            <div className="relative">
              <HelpCircle className="h-4 w-4 fill-current" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-slate-200 dark:border-[hsl(222,84%,12%)]"></div>
            </div>
            {!isCollapsed && <span className="ml-2">AI Help & Support</span>}
          </Button>

          {/* Search Button */}
          <div className="relative" ref={searchRef}>
            <Button 
              variant="ghost" 
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "transition-all duration-300 hover:scale-105",
                isCollapsed 
                  ? "w-10 h-10 p-0" 
                  : "w-full justify-start h-10 px-3",
                "bg-slate-200/50 hover:bg-slate-300/70 text-slate-600 hover:text-[hsl(217,91%,60%)]",
                "dark:bg-[hsl(222,84%,10%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)]/80 dark:hover:text-[hsl(217,91%,60%)]"
              )}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4 fill-current" />
              {!isCollapsed && <span className="ml-2">Search</span>}
            </Button>
            
            {/* Search Popup */}
            {showSearch && (
              <div className="fixed left-80 bottom-20 w-96 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-2xl z-[9999] overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Search className="h-5 w-5 text-emerald-500 fill-current" />
                    <h3 className="font-semibold text-lg">Search</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-white dark:hover:bg-black rounded-full transition-all duration-200 ml-auto" 
                      onClick={() => setShowSearch(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground fill-current" />
                    <Input
                      placeholder="Search courses, skills, instructors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800 border-border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
                  {searchQuery ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground mb-3">
                        Search results for <span className="font-medium text-foreground">"{searchQuery}"</span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:to-indigo-950 rounded-lg cursor-pointer transition-all duration-200 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-white fill-current" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Advanced React Patterns</p>
                              <p className="text-xs text-muted-foreground">Course • 12 lessons</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3 fill-current" />
                      <p className="text-sm text-muted-foreground">Start typing to search courses, skills, and instructors</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size={isCollapsed ? "icon" : "default"}
                className={cn(
                  "transition-all duration-300 hover:scale-105",
                  isCollapsed 
                    ? "w-10 h-10 p-0" 
                    : "w-full justify-start h-10 px-3",
                  "bg-slate-200/50 hover:bg-slate-300/70 text-slate-600 hover:text-[hsl(217,91%,60%)]",
                  "dark:bg-[hsl(222,84%,10%)] dark:hover:bg-[hsl(222,84%,15%)] dark:text-[hsl(210,40%,98%)]/80 dark:hover:text-[hsl(217,91%,60%)]"
                )}
              >
                <User className="h-4 w-4 fill-current" />
                {!isCollapsed && <span className="ml-2">Account & Settings</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 bg-white dark:bg-gray-900 border border-border shadow-2xl rounded-xl p-2" align="end" forceMount side="right">
              <DropdownMenuLabel className="font-normal p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">Peter Costa</p>
                    <p className="text-xs leading-none text-muted-foreground">peter@example.com</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuItem className="rounded-lg bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:to-indigo-950 transition-all duration-200 cursor-pointer p-3 border border-gray-200 dark:border-gray-700">
                <User className="mr-3 h-4 w-4 text-blue-500" />
                <span className="font-medium">Account</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="rounded-lg bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-950 dark:hover:to-slate-950 transition-all duration-200 cursor-pointer p-3 border border-gray-200 dark:border-gray-700">
                <Settings className="mr-3 h-4 w-4 text-gray-500" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2" />
              
              {/* Theme Toggle */}
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleTheme();
                }}
                className="cursor-pointer bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-950 dark:hover:to-orange-950 transition-all duration-200 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {theme === 'light' ? <Sun className="mr-3 h-4 w-4 text-amber-500" /> : 
                     theme === 'dark' ? <Moon className="mr-3 h-4 w-4 text-blue-400" /> : 
                     <Monitor className="mr-3 h-4 w-4 text-gray-500" />}
                    <span className="font-medium">Theme</span>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border">
                    {theme}
                  </span>
                </div>
              </DropdownMenuItem>
              
              {/* Language Toggle */}
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleLanguage();
                }}
                className="cursor-pointer bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950 dark:hover:to-emerald-950 transition-all duration-200 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{getLanguageFlag()}</span>
                    <span className="font-medium">Language</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border">
                    {language}
                  </span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2" />
              
              <DropdownMenuItem onClick={signOut} className="rounded-lg bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950 dark:hover:to-pink-950 transition-all duration-200 cursor-pointer p-3 text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 