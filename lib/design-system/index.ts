/**
 * Tesla-Inspired Design System Utilities
 * Provides consistent styling patterns across dual authentication portals
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PortalType = 'employer' | 'learner';
export type ComponentVariant = 'default' | 'glass' | 'outline' | 'ghost';
export type ComponentSize = 'sm' | 'default' | 'lg';

/**
 * Portal-specific configuration
 */
export const PORTAL_CONFIG = {
  employer: {
    accent: 'hsl(var(--employer-accent))',
    accentForeground: 'hsl(var(--employer-accent-foreground))',
    gradient: 'var(--gradient-employer)',
    theme: 'employer',
    brandName: 'Employer Portal',
    description: 'Corporate learning management and talent development',
  },
  learner: {
    accent: 'hsl(var(--learner-accent))',
    accentForeground: 'hsl(var(--learner-accent-foreground))',
    gradient: 'var(--gradient-learner)',
    theme: 'learner',
    brandName: 'Learning Portal',
    description: 'Personal skill development and learning journey',
  },
} as const;

/**
 * Tesla-inspired component class generators
 */
export const getButtonClasses = (
  variant: ComponentVariant = 'default',
  size: ComponentSize = 'default',
  portal?: PortalType
): string => {
  const baseClasses = 'tesla-nav-item inline-flex items-center justify-center gap-2 font-medium rounded-lg';
  
  const variantClasses = {
    default: portal ? `${portal}-bg hover:opacity-90` : 'bg-primary text-primary-foreground hover:bg-primary/90',
    glass: 'glassmorphism text-foreground hover:shadow-xl',
    outline: `border-2 ${portal ? `border-${portal}` : 'border-primary'} bg-transparent hover:bg-accent`,
    ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
};

export const getCardClasses = (portal?: PortalType): string => {
  const baseClasses = 'tesla-card rounded-lg border shadow-sm';
  const portalClasses = portal ? `border-${portal}/20` : 'border-border';
  
  return `${baseClasses} ${portalClasses} bg-card text-card-foreground`;
};

export const getNavigationItemClasses = (
  isActive: boolean = false,
  portal?: PortalType
): string => {
  const baseClasses = 'tesla-nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium';
  const activeClasses = isActive
    ? portal 
      ? `${portal}-bg text-${portal}-foreground shadow-sm`
      : 'bg-accent text-accent-foreground'
    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50';
  
  return `${baseClasses} ${activeClasses}`;
};

/**
 * Portal detection utilities
 */
export const detectPortalFromPath = (pathname: string): PortalType => {
  return pathname.startsWith('/employer-access') ? 'employer' : 'learner';
};

export const getPortalConfig = (portal: PortalType) => {
  return PORTAL_CONFIG[portal];
};

/**
 * Responsive design utilities
 */
export const BREAKPOINTS = {
  mobile: '(max-width: 899px)',
  tablet: '(min-width: 900px) and (max-width: 1199px)',
  desktop: '(min-width: 1200px)',
  custom: '(min-width: 900px)', // Custom breakpoint for sidebar visibility
} as const;

/**
 * Animation presets
 */
export const ANIMATIONS = {
  fadeIn: 'animate-fadeIn',
  float: 'animate-float',
  pulse: 'animate-pulse',
  interactive: 'interactive',
  hoverLift: 'hover-lift',
  hoverGlow: 'hover-glow',
} as const;

/**
 * Color scheme utilities
 */
export const getPortalColorClasses = (portal: PortalType) => ({
  accent: `${portal}-accent`,
  background: `${portal}-bg`,
  gradient: `${portal}-gradient`,
  border: `border-${portal}/20`,
  hover: `hover:${portal}-bg/10`,
});

/**
 * Tesla design system constants
 */
export const DESIGN_TOKENS = {
  // Responsive breakpoints - standardized across all components
  breakpoints: {
    mobile: 900, // < 900px = mobile (uses bottom nav, overlay sidebar)
    tablet: 1200, // 900-1199px = tablet (sidebar visible, optimized spacing)
    desktop: 1200, // >= 1200px = desktop (full sidebar experience)
  },
  
  // Sidebar dimensions
  sidebar: {
    collapsed: 64, // 16 * 4 = 64px (w-16)
    mobile: 280,   // 70 * 4 = 280px (w-70) - optimized for mobile
    tablet: 300,   // 75 * 4 = 300px (w-75) - tablet optimization
    desktop: 320,  // 80 * 4 = 320px (w-80) - full desktop width
  },
  
  // Z-index layers
  zIndex: {
    backdrop: 30,
    sidebar: 40,
    mobileNav: 50,
    modal: 60,
    tooltip: 70,
  },

  spacing: {
    xs: 'var(--space-1)',      // 4px
    sm: 'var(--space-2)',      // 8px
    md: 'var(--space-4)',      // 16px
    lg: 'var(--space-6)',      // 24px
    xl: 'var(--space-8)',      // 32px
    '2xl': 'var(--space-12)',  // 48px
  },
  borderRadius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  },
  typography: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
    '3xl': 'var(--text-3xl)',
    '4xl': 'var(--text-4xl)',
    '5xl': 'var(--text-5xl)',
  },
  durations: {
    fast: 'var(--duration-fast)',
    normal: 'var(--duration-normal)',
    slow: 'var(--duration-slow)',
  },
} as const;

/**
 * Accessibility utilities
 */
export const getFocusClasses = (): string => {
  return 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
};

export const getScreenReaderClasses = (): string => {
  return 'sr-only';
};

/**
 * Tesla-inspired glassmorphism variants
 */
export const getGlassmorphismClasses = (variant: 'light' | 'default' | 'strong' = 'default'): string => {
  const variants = {
    light: 'glassmorphism-light',
    default: 'glassmorphism',
    strong: 'glassmorphism-strong',
  };
  
  return variants[variant];
};

/**
 * Status indicator utilities
 */
export const getStatusClasses = (status: 'success' | 'error' | 'warning' | 'info'): string => {
  return `status-${status}`;
};

/**
 * Grid layout utilities
 */
export const getGridClasses = (
  columns: number = 1,
  gap: keyof typeof DESIGN_TOKENS.spacing = 'md'
): string => {
  const columnClass = columns === 1 ? 'grid-cols-1' : `grid-cols-${columns}`;
  const gapClass = `gap-${gap}`;
  
  return `grid ${columnClass} ${gapClass}`;
}; 

// Mobile Navigation Utilities
export const getMobileNavigationClasses = (isOpen: boolean) => {
  return {
    backdrop: cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
      "lg:hidden", // Only show on mobile/tablet
      isOpen ? "opacity-100 z-30" : "opacity-0 pointer-events-none"
    ),
    sidebar: cn(
      "fixed left-0 top-0 h-full transition-transform duration-300 ease-in-out",
      "z-40 lg:translate-x-0", // Always visible on desktop
      isOpen ? "translate-x-0" : "-translate-x-full"
    ),
    hamburger: cn(
      "lg:hidden", // Only show hamburger on mobile/tablet
      "flex items-center justify-center w-10 h-10",
      "rounded-lg transition-colors duration-200",
      "bg-slate-200/80 hover:bg-slate-300/80",
      "dark:bg-slate-800/80 dark:hover:bg-slate-700/80"
    )
  };
};

// Responsive Sidebar Width Utilities
export const getResponsiveSidebarWidth = (isCollapsed: boolean, isMobile: boolean, isTablet: boolean) => {
  if (isCollapsed) return `w-16`; // 64px collapsed
  
  if (isMobile) return `w-70`; // 280px mobile
  if (isTablet) return `w-75`; // 300px tablet  
  return `w-80`; // 320px desktop
};

// Touch Gesture Support
export const getTouchGestureClasses = () => {
  return cn(
    "touch-pan-y", // Allow vertical scrolling
    "overscroll-contain", // Prevent overscroll bounce
    "select-none" // Prevent text selection during swipe
  );
};

// Mobile Header/Top Navigation
export const getMobileHeaderClasses = () => {
  return cn(
    "lg:hidden", // Only show on mobile/tablet
    "fixed top-0 left-0 right-0 z-50",
    "bg-white/95 dark:bg-slate-900/95",
    "backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/50",
    "shadow-lg px-4 py-3"
  );
};

// Enhanced Portal Configuration with Mobile Support
export const getEnhancedPortalConfig = (portalType: PortalType) => {
  const baseConfig = PORTAL_CONFIG[portalType];
  
  return {
    ...baseConfig,
    mobile: {
      headerHeight: 64, // Mobile header height
      bottomNavHeight: 80, // Mobile bottom nav height
      sidebarWidth: DESIGN_TOKENS.sidebar.mobile,
      overlayBackdrop: true,
    },
    tablet: {
      headerHeight: 0, // No mobile header on tablet
      bottomNavHeight: 0, // No bottom nav on tablet
      sidebarWidth: DESIGN_TOKENS.sidebar.tablet,
      overlayBackdrop: false,
    },
    desktop: {
      headerHeight: 0,
      bottomNavHeight: 0,
      sidebarWidth: DESIGN_TOKENS.sidebar.desktop,
      overlayBackdrop: false,
    }
  };
};

// Responsive Detection Hook Utilities
export const createResponsiveDetector = () => {
  const checkBreakpoint = (width: number) => ({
    isMobile: width < DESIGN_TOKENS.breakpoints.mobile,
    isTablet: width >= DESIGN_TOKENS.breakpoints.mobile && width < DESIGN_TOKENS.breakpoints.desktop,
    isDesktop: width >= DESIGN_TOKENS.breakpoints.desktop,
  });
  
  return {
    checkBreakpoint,
    mobileBreakpoint: DESIGN_TOKENS.breakpoints.mobile,
    tabletBreakpoint: DESIGN_TOKENS.breakpoints.desktop,
  };
}; 