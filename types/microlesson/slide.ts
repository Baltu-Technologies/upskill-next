export type ImageLayout = 'none' | 'top' | 'left' | 'right' | 'bottom' | 'background';

// New column layout types
export type ColumnLayout = 'none' | '2-equal' | '2-left' | '2-right' | '3-columns' | '4-columns';

export interface ColumnContent {
  id: string;
  blocks: string[]; // Array of block IDs or HTML content
  content?: string; // Rich text content for the column
}

export interface BaseSlide {
  id: string;
  type: string;
  duration?: number; // Duration in seconds
  backgroundColor?: string;
  imageLayout?: ImageLayout;
  imageUrl?: string;
  imageCaption?: string;
  // New column system properties
  columnLayout?: ColumnLayout;
  columns?: ColumnContent[];
  // Table-based column system
  tableContent?: string; // HTML content for table-based columns
  
  // Learning-focused properties
  learningObjective?: string; // Which learning objective this slide addresses
  cognitiveLoad?: 'low' | 'medium' | 'high'; // Complexity level for learners
  industryContext?: string; // Specific workplace application context
  interactionRequired?: boolean; // Does this slide need learner engagement?
  workplaceRelevance?: string; // How this applies in real work situations
}

export interface TitleSlide extends BaseSlide {
  type: 'TitleSlide';
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface TitleWithSubtext extends BaseSlide {
  type: 'TitleWithSubtext';
  title: string;
  subtext?: string;
  content?: string;
  bullets?: string[];
  accentColor?: string;
}

export interface TitleWithImage extends BaseSlide {
  type: 'TitleWithImage';
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageLayout?: ImageLayout; // Uses the new layout system
  imagePosition?: 'left' | 'right'; // Keep for backward compatibility
  caption?: string;
}

export interface VideoSlide extends BaseSlide {
  type: 'VideoSlide';
  title: string;
  videoUrl: string;
  description?: string;
  captionsUrl?: string;
  controls?: boolean;
}

export interface Hotspot {
  label: string;
  position: [number, number, number];
}

export interface AR3DModelSlide extends BaseSlide {
  type: 'AR3DModelSlide';
  title: string;
  modelUrl: string;
  arEnabled: boolean;
  hotspots: Hotspot[];
}

export interface QuickCheckSlide extends BaseSlide {
  type: 'QuickCheckSlide';
  title?: string;
  question: string;
  questionType?: 'multiple-choice' | 'fill-in-the-blank';
  choices?: string[];
  options?: string[];
  blankTemplate?: string;
  correctAnswer: string | string[] | number;
  explanation?: string;
  hint?: string;
}

export interface CustomHTMLSlide extends BaseSlide {
  type: 'CustomHTMLSlide';
  rawHtml: string;
}

export interface ImageHotspot {
  id: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  label: string;
  description?: string;
  correctMatch?: string;
}

export interface HotspotActivitySlide extends BaseSlide {
  type: 'HotspotActivitySlide';
  title: string;
  instruction?: string;
  imageUrl?: string;
  backgroundImage?: string;
  hotspots: ImageHotspot[];
  activityType?: 'identify' | 'match' | 'sequence';
  choices?: string[]; // For matching activities
  correctAnswers?: { [hotspotId: string]: string }; // For matching activities
  hint?: string;
}

export interface MarkdownSlide extends BaseSlide {
  type: 'MarkdownSlide';
  title?: string;
  content: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
}

// New Learning-Focused Slide Types

export interface LearningObjectivesSlide extends BaseSlide {
  type: 'LearningObjectivesSlide';
  title: string;
  objectives: string[];
  successCriteria?: string[];
  estimatedTime?: string;
  workplaceApplication?: string;
}

export interface ContextSetterSlide extends BaseSlide {
  type: 'ContextSetterSlide';
  title: string;
  workplaceScenario: string;
  consequences?: string;
  industryRelevance: string;
  motivationalHook?: string;
}

export interface ConceptExplanationSlide extends BaseSlide {
  type: 'ConceptExplanationSlide';
  concept: string;
  explanation: string;
  industryExample: string;
  visualAid?: string;
  keyTerms?: string[];
  commonMisconceptions?: string[];
}

export interface StepByStepProcedure extends BaseSlide {
  type: 'StepByStepProcedure';
  title: string;
  procedure: string;
  steps: Array<{
    step: number;
    instruction: string;
    visualAid?: string;
    safetyNote?: string;
    commonError?: string;
  }>;
  tools?: string[];
  safetyPrecautions?: string[];
}

export interface ComparisonSlide extends BaseSlide {
  type: 'ComparisonSlide';
  title: string;
  comparisonType: 'tools' | 'methods' | 'safety' | 'procedures' | 'materials';
  leftSide: {
    title: string;
    items: string[];
    image?: string;
    pros?: string[];
    cons?: string[];
  };
  rightSide: {
    title: string;
    items: string[];
    image?: string;
    pros?: string[];
    cons?: string[];
  };
  conclusion?: string;
}

export interface CaseStudySlide extends BaseSlide {
  type: 'CaseStudySlide';
  title: string;
  scenario: string;
  challenge: string;
  solution?: string;
  outcome?: string;
  lessonsLearned: string[];
  discussionPoints?: string[];
}

export interface SafetyProtocolSlide extends BaseSlide {
  type: 'SafetyProtocolSlide';
  title: string;
  hazardType: string;
  warningLevel: 'notice' | 'caution' | 'warning' | 'danger';
  protocols: Array<{
    step: string;
    explanation: string;
    visualAid?: string;
  }>;
  consequences?: string;
  emergencyProcedures?: string[];
}

export interface PracticeScenarioSlide extends BaseSlide {
  type: 'PracticeScenarioSlide';
  title: string;
  scenario: string;
  challenge: string;
  options?: Array<{
    choice: string;
    consequence: string;
    correct: boolean;
  }>;
  feedback?: string;
  coachingTips?: string[];
}

export interface ReflectionSlide extends BaseSlide {
  type: 'ReflectionSlide';
  title: string;
  prompt: string;
  guidingQuestions: string[];
  discussionPoints?: string[];
  actionItems?: string[];
}

export interface RealWorldApplicationSlide extends BaseSlide {
  type: 'RealWorldApplicationSlide';
  title: string;
  workplaceContext: string;
  applications: Array<{
    situation: string;
    application: string;
    example?: string;
    tips?: string[];
  }>;
  transferTasks?: string[];
}

export interface TroubleshootingSlide extends BaseSlide {
  type: 'TroubleshootingSlide';
  title: string;
  problem: string;
  symptoms: string[];
  diagnosticSteps: Array<{
    step: string;
    whatToLookFor: string;
    possibleCauses?: string[];
  }>;
  solutions: Array<{
    cause: string;
    solution: string;
    prevention?: string;
  }>;
}

export interface SummarySlide extends BaseSlide {
  type: 'SummarySlide';
  title: string;
  keyTakeaways: string[];
  actionItems: string[];
  nextSteps?: string[];
  resources?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  reviewQuestions?: string[];
}

export type SlideType = 
  | TitleSlide 
  | TitleWithSubtext 
  | TitleWithImage 
  | VideoSlide 
  | AR3DModelSlide 
  | QuickCheckSlide 
  | CustomHTMLSlide
  | HotspotActivitySlide
  | MarkdownSlide
  // New Learning-Focused Slides
  | LearningObjectivesSlide
  | ContextSetterSlide
  | ConceptExplanationSlide
  | StepByStepProcedure
  | ComparisonSlide
  | CaseStudySlide
  | SafetyProtocolSlide
  | PracticeScenarioSlide
  | ReflectionSlide
  | RealWorldApplicationSlide
  | TroubleshootingSlide
  | SummarySlide;

export interface LessonConfig {
  id: string;
  title: string;
  description?: string;
  totalSlides?: number;
  duration?: string;
  course?: string; // Course name
  lesson?: string; // Lesson name within the course
  slides: SlideType[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
  };
}

export interface SlideRendererProps {
  slide: SlideType;
  isActive: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onQuickCheckAnswered?: (correct: boolean) => void;
  onDefineWord?: (word: string) => void;
  onSaveToStudyList?: (word: string) => void;
  onAddToNotes?: (text: string, slideId?: string) => void;
  onAskAI?: (text: string) => void;
}

// Lesson contains multiple microlessons
export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "45 minutes"
  objectives: string[];
  microlessons: LessonConfig[];
  completionCriteria?: {
    minimumScore?: number;
    requiredMicrolessons?: string[];
  };
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Course contains multiple lessons
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "8 hours"
  lessons: Lesson[];
  prerequisites?: string[];
  learningOutcomes: string[];
  industry: string;
  skillLevel: 'entry' | 'intermediate' | 'advanced';
  courseLevel?: 'Beginning' | 'Intermediate' | 'Advanced'; // Course difficulty level
  certification?: {
    available: boolean;
    provider?: string;
    validityPeriod?: string;
  };
  instructorInfo?: {
    name: string;
    title: string;
    bio: string;
    avatar?: string;
  };
  tags?: string[];
  thumbnail?: string;
  price?: {
    amount: number;
    currency: string;
  };
  enrollmentCount?: number;
  rating?: {
    average: number;
    count: number;
  };
}

// Progress tracking interfaces
export interface MicrolessonProgress {
  microlessonId: string;
  completed: boolean;
  score?: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  microlessonsProgress: MicrolessonProgress[];
  overallScore?: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
}

export interface CourseProgress {
  courseId: string;
  enrolled: boolean;
  completed: boolean;
  lessonsProgress: LessonProgress[];
  overallProgress: number; // percentage 0-100
  certificateEarned?: boolean;
  enrollmentDate: Date;
  completionDate?: Date;
  totalTimeSpent: number; // in minutes
} 