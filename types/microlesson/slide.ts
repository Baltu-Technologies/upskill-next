export interface BaseSlide {
  id: string;
  type: string;
  duration?: number; // Duration in seconds
  backgroundColor?: string;
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
  imagePosition: 'left' | 'right';
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

export type SlideType = 
  | TitleSlide 
  | TitleWithSubtext 
  | TitleWithImage 
  | VideoSlide 
  | AR3DModelSlide 
  | QuickCheckSlide 
  | CustomHTMLSlide
  | HotspotActivitySlide
  | MarkdownSlide;

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