import { 
  User, 
  Target, 
  GraduationCap, 
  FolderOpen, 
  Brain, 
  Cpu, 
  Building,
  Heart,
  FileText,
  Award,
  LucideIcon,
  Route
} from 'lucide-react';
import { CompleteProfile } from '@/types/profile';

// Placeholder components for sections not yet implemented

/** Placeholder component for the Portfolio & Projects section. */
const PortfolioProjectsSection = () => (
  <div className="p-8 text-center text-slate-500">
    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
    <h3 className="text-lg font-medium mb-2">Portfolio & Projects</h3>
    <p>Showcase your work and achievements</p>
  </div>
);

/** Placeholder component for the Skills Assessment section. */
const SkillsSection = () => (
  <div className="p-8 text-center text-slate-500">
    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
    <h3 className="text-lg font-medium mb-2">Skills Assessment</h3>
    <p>Evaluate and track your technical skills</p>
  </div>
);

/** Placeholder component for the Technologies section. */
const TechnologiesSection = () => (
  <div className="p-8 text-center text-slate-500">
    <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
    <h3 className="text-lg font-medium mb-2">Technologies</h3>
    <p>Explore technology stacks and tools</p>
  </div>
);

/** Placeholder component for the Industries section. */
const IndustriesSection = () => (
  <div className="p-8 text-center text-slate-500">
    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
    <h3 className="text-lg font-medium mb-2">Industries</h3>
    <p>Discover career opportunities across industries</p>
  </div>
);

/**
 * Defines the configuration structure for a top-level navigation section.
 * This interface is used to build the `profileNavigationStructure`.
 * Note: `icon` type is `any` here as it directly takes the Lucide icon component, 
 * not an instance. For actual rendering, `TwoTierNavigation` expects `LucideIcon` type for instantiated icons.
 */
export interface ProfileNavigationConfig {
  /** Unique identifier for the section (e.g., 'about-me'). */
  id: string;
  /** Display label for the section (e.g., "About Me"). */
  label: string;
  /** Lucide icon component to be displayed for the section. */
  icon: LucideIcon;
  /** Optional ID of the default sub-tab to select when this section becomes active. */
  defaultSubTab?: string;
  /** Array of sub-tab configurations within this section. */
  subTabs: {
    /** Unique identifier for the sub-tab (e.g., 'my-profile'). */
    id: string;
    /** Display label for the sub-tab (e.g., "My Profile"). */
    label: string;
    /** Optional Lucide icon component for the sub-tab. */
    icon?: LucideIcon;
    /** Optional badge text to display next to the sub-tab label. */
    badge?: string;
  }[];
}

/**
 * Defines the navigation structure for the user profile page.
 * This array is consumed by `app/profile/page.tsx` to generate the `sections` prop
 * for the `TwoTierNavigation` component, where actual React components are mapped to sub-tabs.
 */
export const profileNavigationStructure: ProfileNavigationConfig[] = [
  {
    id: 'about-me',
    label: 'About Me',
    icon: Heart,
    defaultSubTab: 'my-profile',
    subTabs: [
      {
        id: 'my-profile',
        label: 'My Profile',
        icon: User
      },
      {
        id: 'professional-profile',
        label: 'Professional Profile',
        icon: Target
      }
    ]
  },
  {
    id: 'credentials-work',
    label: 'Credentials & Work',
    icon: FileText,
    defaultSubTab: 'education-credentials',
    subTabs: [
      {
        id: 'education-credentials',
        label: 'Education & Credentials',
        icon: GraduationCap
      },
      {
        id: 'portfolio-projects',
        label: 'Portfolio & Projects',
        icon: FolderOpen,
        badge: '3'
      }
    ]
  },
  {
    id: 'career-explorer',
    label: 'Career Explorer',
    icon: Brain,
    defaultSubTab: 'skills',
    subTabs: [
      {
        id: 'skills',
        label: 'Skills',
        icon: Brain
      },
      {
        id: 'technologies',
        label: 'Technologies',
        icon: Cpu
      },
      {
        id: 'industries',
        label: 'Industries',
        icon: Building
      },
      {
        id: 'career-pathways',
        label: 'Career Pathways',
        icon: Route
      }
    ]
  }
];

/**
 * Default state for the profile navigation if no state is found in URL parameters.
 */
export const defaultNavigationState = {
  section: 'about-me',
  subTab: 'my-profile'
};

/**
 * Retrieves a top-level section configuration by its ID.
 * @param sectionId The ID of the section to retrieve.
 * @returns The `ProfileNavigationConfig` object if found, otherwise `undefined`.
 */
export function getSectionById(sectionId: string): ProfileNavigationConfig | undefined {
  return profileNavigationStructure.find(section => section.id === sectionId);
}

/**
 * Retrieves a sub-tab configuration by its parent section ID and its own ID.
 * @param sectionId The ID of the parent section.
 * @param subTabId The ID of the sub-tab to retrieve.
 * @returns The sub-tab configuration object if found, otherwise `undefined`.
 */
export function getSubTabById(sectionId: string, subTabId: string) {
  const section = getSectionById(sectionId);
  return section?.subTabs.find(subTab => subTab.id === subTabId);
}

/**
 * Validates if a given section and sub-tab combination is valid based on the defined structure.
 * @param section The ID of the section.
 * @param subTab The ID of the sub-tab.
 * @returns `true` if the navigation state is valid, `false` otherwise.
 */
export function isValidNavigationState(section: string, subTab: string): boolean {
  const sectionData = getSectionById(section);
  if (!sectionData) return false;
  
  return sectionData.subTabs.some(tab => tab.id === subTab);
} 