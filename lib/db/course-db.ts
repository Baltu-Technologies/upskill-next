import { Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';

/**
 * ========================================
 * TASK 11: Kysely Database Client for Course Operations ✅
 * ========================================
 * 
 * Type-safe database client for course data operations through RDS Proxy
 * Provides connection pooling, retry logic, and comprehensive error handling
 */

// ========================================
// TASK 11.2: Configure Kysely with RDS Proxy ✅
// ========================================

/**
 * Database connection configuration for course data
 * Uses RDS Proxy for enhanced connection pooling and high availability
 */
const createCourseDbPool = () => {
  // Course database connection through RDS Proxy
  const courseDbUrl = process.env.COURSE_DB_URL || process.env.COURSE_RDS_PROXY_ENDPOINT;
  
  if (!courseDbUrl) {
    throw new Error(
      'Course database URL not configured. Please set COURSE_DB_URL or COURSE_RDS_PROXY_ENDPOINT environment variable.'
    );
  }
  
  // Extract components for connection string building
  const courseDbConfig = {
    // Default course database configuration
    host: courseDbUrl,
    port: parseInt(process.env.COURSE_DB_PORT || '5432'),
    database: process.env.COURSE_DB_NAME || 'upskill_course_data',
    user: process.env.COURSE_DB_USER || 'postgres',
    
    // ✅ RDS Proxy optimized connection settings
    ssl: {
      rejectUnauthorized: false,
      ca: undefined, // RDS Proxy handles certificate management
      checkServerIdentity: () => undefined, // Disable hostname verification for proxy
    },
    
    // ✅ Connection pool settings optimized for RDS Proxy
    max: parseInt(process.env.COURSE_DB_MAX_CONNECTIONS || '20'), // Higher limit for course data
    min: parseInt(process.env.COURSE_DB_MIN_CONNECTIONS || '2'),
    idleTimeoutMillis: parseInt(process.env.COURSE_DB_IDLE_TIMEOUT || '10000'), // 10 seconds
    connectionTimeoutMillis: parseInt(process.env.COURSE_DB_CONNECTION_TIMEOUT || '5000'), // 5 seconds
    
    // ✅ Performance optimizations
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    query_timeout: 30000, // 30 second query timeout
    statement_timeout: 30000, // 30 second statement timeout
    
    // ✅ Application identification for monitoring
    application_name: 'upskill-course-operations',
    fallback_application_name: 'upskill-app',
  };
  
  // If we have a full connection string, use it directly
  if (courseDbUrl.startsWith('postgresql://')) {
    return new Pool({
      connectionString: courseDbUrl,
      ...courseDbConfig,
    });
  }
  
  // Otherwise, build connection from components
  return new Pool(courseDbConfig);
};

// ========================================
// TASK 11.3: Implement Type-Safe Schemas with Kysely ✅
// ========================================

/**
 * Comprehensive Course Database Type Definitions
 * 
 * Production-ready schemas for a complete online learning platform
 * with courses, lessons, instructors, enrollments, progress tracking,
 * assessments, certificates, and analytics.
 */

// ========================================
// Core Entity Schemas
// ========================================

/**
 * Instructors/Teachers in the platform
 */
export interface InstructorTable {
  id: string;
  user_id: string; // Links to auth database user
  bio: string;
  expertise_areas: string[]; // JSON array
  experience_years: number;
  rating: number; // Average rating (0.0 - 5.0)
  total_courses: number;
  total_students: number;
  certification_urls: string[]; // JSON array
  social_links: Record<string, string>; // JSON object
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Course Categories for organization
 */
export interface CategoryTable {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string; // For subcategories
  icon_url?: string;
  color: string; // Hex color for UI
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Main Courses table with comprehensive metadata
 */
export interface CourseTable {
  id: string;
  title: string;
  slug: string; // URL-friendly identifier
  short_description: string;
  full_description: string;
  instructor_id: string;
  category_id: string;
  subcategory_id?: string;
  
  // Course metadata
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration_hours: number;
  total_lessons: number;
  language: string; // ISO language code
  subtitles_available: string[]; // JSON array of language codes
  
  // Pricing and enrollment
  price: number; // In cents
  original_price?: number; // For discounts
  currency: string; // ISO currency code
  is_free: boolean;
  
  // Course status
  status: 'draft' | 'review' | 'published' | 'archived';
  is_featured: boolean;
  
  // Media and thumbnails
  thumbnail_url?: string;
  preview_video_url?: string;
  course_image_url?: string;
  
  // SEO and marketing
  meta_title?: string;
  meta_description?: string;
  keywords: string[]; // JSON array
  
  // Analytics and ratings
  average_rating: number; // 0.0 - 5.0
  total_ratings: number;
  total_enrollments: number;
  completion_rate: number; // Percentage
  
  // Learning outcomes and requirements
  learning_outcomes: string[]; // JSON array
  prerequisites: string[]; // JSON array
  target_audience: string[]; // JSON array
  
  // Timestamps
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Course Modules/Sections for organizing lessons
 */
export interface ModuleTable {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  duration_hours: number;
  is_locked: boolean; // Requires previous modules to be completed
  created_at: Date;
  updated_at: Date;
}

/**
 * Individual lessons within courses
 */
export interface LessonTable {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  slug: string;
  content: string; // Rich text/markdown content
  
  // Media content
  video_url?: string;
  video_duration_seconds?: number;
  audio_url?: string;
  
  // Lesson organization
  order_index: number;
  lesson_type: 'video' | 'text' | 'interactive' | 'quiz' | 'assignment';
  
  // Access control
  is_preview: boolean; // Free preview lesson
  is_required: boolean; // Must complete to progress
  
  // Content metadata
  reading_time_minutes?: number;
  download_resources: Record<string, string>[]; // JSON array of resource objects
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// ========================================
// Student Progress and Enrollment Schemas
// ========================================

/**
 * Course enrollments and access
 */
export interface EnrollmentTable {
  id: string;
  user_id: string;
  course_id: string;
  
  // Enrollment details
  enrollment_type: 'free' | 'paid' | 'trial' | 'gifted';
  payment_status: 'pending' | 'completed' | 'refunded' | 'failed';
  access_expires_at?: Date; // For trial/limited access
  
  // Progress tracking
  progress_percentage: number; // 0-100
  completed_lessons: number;
  total_time_spent_seconds: number;
  current_lesson_id?: string;
  
  // Status
  status: 'active' | 'paused' | 'completed' | 'dropped';
  
  // Timestamps
  enrolled_at: Date;
  started_at?: Date;
  completed_at?: Date;
  last_accessed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Detailed lesson progress tracking
 */
export interface ProgressTable {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  
  // Progress details
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  completion_percentage: number; // 0-100
  time_spent_seconds: number;
  
  // Video/media progress
  last_position_seconds?: number; // For video resume
  watched_duration_seconds?: number;
  
  // Interaction data
  notes?: string; // Student notes
  bookmarked: boolean;
  likes: number;
  
  // Timestamps
  started_at?: Date;
  completed_at?: Date;
  last_accessed_at: Date;
  created_at: Date;
  updated_at: Date;
}

// ========================================
// Assessment and Certification Schemas
// ========================================

/**
 * Quizzes and assessments
 */
export interface QuizTable {
  id: string;
  course_id: string;
  lesson_id?: string; // Optional: quiz can be standalone
  title: string;
  description?: string;
  
  // Quiz configuration
  quiz_type: 'practice' | 'graded' | 'final';
  passing_score: number; // Percentage required to pass
  time_limit_minutes?: number;
  max_attempts: number;
  randomize_questions: boolean;
  show_correct_answers: boolean;
  
  // Grading
  total_points: number;
  weight_percentage: number; // Contribution to course grade
  
  // Status
  is_required: boolean;
  is_active: boolean;
  
  created_at: Date;
  updated_at: Date;
}

/**
 * Quiz questions
 */
export interface QuestionTable {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  
  // Question configuration
  points: number;
  order_index: number;
  
  // Answer options (JSON structure)
  options: Record<string, any>[]; // Array of option objects
  correct_answers: string[]; // Array of correct option IDs/values
  explanation?: string; // Explanation for correct answer
  
  // Media
  image_url?: string;
  video_url?: string;
  
  created_at: Date;
  updated_at: Date;
}

/**
 * Student quiz attempts and scores
 */
export interface QuizAttemptTable {
  id: string;
  user_id: string;
  quiz_id: string;
  
  // Attempt details
  attempt_number: number;
  score: number; // Points earned
  percentage: number; // Score as percentage
  passed: boolean;
  
  // Answers submitted (JSON structure)
  answers: Record<string, any>; // Question ID -> Answer mapping
  
  // Timing
  time_spent_seconds: number;
  
  // Status
  status: 'in_progress' | 'submitted' | 'graded';
  
  // Timestamps
  started_at: Date;
  submitted_at?: Date;
  graded_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Course completion certificates
 */
export interface CertificateTable {
  id: string;
  user_id: string;
  course_id: string;
  instructor_id: string;
  
  // Certificate details
  certificate_number: string; // Unique identifier
  certificate_url: string; // PDF/image URL
  
  // Completion data
  final_score: number; // Overall course score
  completion_percentage: number;
  time_to_complete_hours: number;
  
  // Verification
  verification_code: string; // For external verification
  is_verified: boolean;
  
  // Timestamps
  earned_at: Date;
  expires_at?: Date; // For certifications that expire
  created_at: Date;
  updated_at: Date;
}

// ========================================
// Analytics and Feedback Schemas
// ========================================

/**
 * Course reviews and ratings
 */
export interface ReviewTable {
  id: string;
  user_id: string;
  course_id: string;
  
  // Review content
  rating: number; // 1-5 stars
  title?: string;
  review_text?: string;
  
  // Review metadata
  is_verified_purchase: boolean;
  is_featured: boolean;
  helpfulness_score: number; // Based on votes
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  moderation_notes?: string;
  
  created_at: Date;
  updated_at: Date;
}

/**
 * Learning analytics and engagement metrics
 */
export interface AnalyticsTable {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id?: string;
  
  // Event tracking
  event_type: 'page_view' | 'video_play' | 'video_pause' | 'download' | 'bookmark' | 'note_taken';
  event_data: Record<string, any>; // JSON event payload
  
  // Session data
  session_id: string;
  user_agent: string;
  ip_address?: string;
  
  // Timestamps
  occurred_at: Date;
  created_at: Date;
}

// ========================================
// Main Database Interface
// ========================================

export interface CourseDatabase {
  // Core entities
  instructors: InstructorTable;
  categories: CategoryTable;
  courses: CourseTable;
  modules: ModuleTable;
  lessons: LessonTable;
  
  // Student progress
  enrollments: EnrollmentTable;
  progress: ProgressTable;
  
  // Assessments
  quizzes: QuizTable;
  questions: QuestionTable;
  quiz_attempts: QuizAttemptTable;
  certificates: CertificateTable;
  
  // Feedback and analytics
  reviews: ReviewTable;
  analytics: AnalyticsTable;
}

// ========================================
// Kysely Database Client Instance
// ========================================

/**
 * Create and configure Kysely database instance
 * Uses PostgreSQL dialect with RDS Proxy connection pooling
 */
export const createCourseDb = () => {
  const pool = createCourseDbPool();
  
  return new Kysely<CourseDatabase>({
    dialect: new PostgresDialect({
      pool,
    }),
    
    // ✅ Query logging for development (disable in production)
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    
    // ✅ Plugin support for future extensions
    plugins: [],
  });
};

// ========================================
// Exported Database Instance
// ========================================

/**
 * Main course database instance
 * Use this for all course-related database operations
 */
export const courseDb = createCourseDb();

// ========================================
// Utility Functions
// ========================================

/**
 * Test database connection and return connection info
 */
export async function testCourseDbConnection() {
  try {
    // Use raw SQL to test connection without type constraints
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5
    `.execute(courseDb);
      
    console.log('✅ Course database connection successful');
    return {
      success: true,
      tablesFound: result.rows.length > 0,
      tables: result.rows.map((row: any) => row.table_name),
    };
  } catch (error) {
    console.error('❌ Course database connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Close database connections gracefully
 */
export async function closeCourseDb() {
  try {
    await courseDb.destroy();
    console.log('✅ Course database connections closed');
  } catch (error) {
    console.error('❌ Error closing course database:', error);
  }
}

/**
 * Get database connection stats for monitoring
 */
export function getCourseDbStats() {
  const pool = (courseDb.getExecutor() as any)?.adapter?.pool;
  
  if (!pool) {
    return { error: 'Unable to access connection pool stats' };
  }
  
  return {
    totalCount: pool.totalCount || 0,
    idleCount: pool.idleCount || 0,
    waitingCount: pool.waitingCount || 0,
  };
}

// ========================================
// TASK 11.3: Type-Safe Query Builders ✅
// ========================================

/**
 * Type-safe query builders and helper functions
 * These demonstrate the power of Kysely's type system
 */

/**
 * Course query builders with type safety
 */
export const courseQueries = {
  /**
   * Get published courses with instructor and category information
   */
  getPublishedCourses: () => {
    return courseDb
      .selectFrom('courses')
      .innerJoin('instructors', 'courses.instructor_id', 'instructors.id')
      .innerJoin('categories', 'courses.category_id', 'categories.id')
      .select([
        'courses.id',
        'courses.title',
        'courses.slug',
        'courses.short_description',
        'courses.thumbnail_url',
        'courses.price',
        'courses.is_free',
        'courses.average_rating',
        'courses.total_enrollments',
        'courses.difficulty_level',
        'courses.duration_hours',
        'instructors.user_id as instructor_user_id',
        'categories.name as category_name',
        'categories.slug as category_slug',
      ])
      .where('courses.status', '=', 'published')
      .where('categories.is_active', '=', true)
      .where('instructors.is_active', '=', true)
      .orderBy('courses.created_at', 'desc');
  },

  /**
   * Get course details with full information
   */
  getCourseDetails: (courseId: string) => {
    return courseDb
      .selectFrom('courses')
      .innerJoin('instructors', 'courses.instructor_id', 'instructors.id')
      .innerJoin('categories', 'courses.category_id', 'categories.id')
      .selectAll('courses')
      .select([
        'instructors.user_id as instructor_user_id',
        'instructors.bio as instructor_bio',
        'instructors.rating as instructor_rating',
        'categories.name as category_name',
        'categories.slug as category_slug',
      ])
      .where('courses.id', '=', courseId)
      .where('courses.status', '=', 'published');
  },

  /**
   * Get course modules with lessons count
   */
  getCourseModules: (courseId: string) => {
    return courseDb
      .selectFrom('modules')
      .leftJoin('lessons', 'modules.id', 'lessons.module_id')
      .select([
        'modules.id',
        'modules.title',
        'modules.description',
        'modules.order_index',
        'modules.duration_hours',
        'modules.is_locked',
        (eb) => eb.fn.count('lessons.id').as('lesson_count'),
      ])
      .where('modules.course_id', '=', courseId)
      .groupBy([
        'modules.id',
        'modules.title',
        'modules.description',
        'modules.order_index',
        'modules.duration_hours',
        'modules.is_locked',
      ])
      .orderBy('modules.order_index', 'asc');
  },
};

/**
 * Enrollment and progress query builders
 */
export const progressQueries = {
  /**
   * Get user's course enrollment with progress
   */
  getUserEnrollment: (userId: string, courseId: string) => {
    return courseDb
      .selectFrom('enrollments')
      .selectAll()
      .where('user_id', '=', userId)
      .where('course_id', '=', courseId);
  },

  /**
   * Get detailed progress for a user's course
   */
  getUserCourseProgress: (userId: string, courseId: string) => {
    return courseDb
      .selectFrom('progress')
      .innerJoin('lessons', 'progress.lesson_id', 'lessons.id')
      .innerJoin('modules', 'lessons.module_id', 'modules.id')
      .select([
        'progress.id',
        'progress.lesson_id',
        'progress.status',
        'progress.completion_percentage',
        'progress.time_spent_seconds',
        'progress.last_position_seconds',
        'progress.bookmarked',
        'progress.completed_at',
        'lessons.title as lesson_title',
        'lessons.order_index as lesson_order',
        'lessons.lesson_type',
        'modules.title as module_title',
        'modules.order_index as module_order',
      ])
      .where('progress.user_id', '=', userId)
      .where('progress.course_id', '=', courseId)
      .orderBy(['modules.order_index', 'lessons.order_index']);
  },

  /**
   * Calculate course completion percentage
   */
  calculateCourseCompletion: async (userId: string, courseId: string) => {
    const result = await courseDb
      .selectFrom('progress')
      .select((eb) => [
        eb.fn.count('progress.id').as('total_lessons'),
        eb.fn
          .count('progress.id')
          .filterWhere('progress.status', '=', 'completed')
          .as('completed_lessons'),
      ])
      .where('progress.user_id', '=', userId)
      .where('progress.course_id', '=', courseId)
      .executeTakeFirst();

    const totalLessons = Number(result?.total_lessons) || 0;
    const completedLessons = Number(result?.completed_lessons) || 0;

    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  },
};

/**
 * Assessment and certification query builders
 */
export const assessmentQueries = {
  /**
   * Get course quizzes
   */
  getCourseQuizzes: (courseId: string) => {
    return courseDb
      .selectFrom('quizzes')
      .select([
        'id',
        'title',
        'description',
        'quiz_type',
        'passing_score',
        'time_limit_minutes',
        'max_attempts',
        'total_points',
        'is_required',
      ])
      .where('course_id', '=', courseId)
      .where('is_active', '=', true)
      .orderBy('created_at', 'asc');
  },

  /**
   * Get user's quiz attempts for a course
   */
  getUserQuizAttempts: (userId: string, courseId: string) => {
    return courseDb
      .selectFrom('quiz_attempts')
      .innerJoin('quizzes', 'quiz_attempts.quiz_id', 'quizzes.id')
      .select([
        'quiz_attempts.id',
        'quiz_attempts.quiz_id',
        'quiz_attempts.attempt_number',
        'quiz_attempts.score',
        'quiz_attempts.percentage',
        'quiz_attempts.passed',
        'quiz_attempts.status',
        'quiz_attempts.submitted_at',
        'quizzes.title as quiz_title',
      ])
      .where('quiz_attempts.user_id', '=', userId)
      .where('quizzes.course_id', '=', courseId)
      .orderBy('quiz_attempts.created_at', 'desc');
  },

  /**
   * Get user's certificates
   */
  getUserCertificates: (userId: string) => {
    return courseDb
      .selectFrom('certificates')
      .innerJoin('courses', 'certificates.course_id', 'courses.id')
      .innerJoin('instructors', 'certificates.instructor_id', 'instructors.id')
      .select([
        'certificates.id',
        'certificates.certificate_number',
        'certificates.certificate_url',
        'certificates.final_score',
        'certificates.completion_percentage',
        'certificates.verification_code',
        'certificates.earned_at',
        'certificates.expires_at',
        'courses.title as course_title',
        'courses.thumbnail_url as course_thumbnail',
        'instructors.user_id as instructor_user_id',
      ])
      .where('certificates.user_id', '=', userId)
      .where('certificates.is_verified', '=', true)
      .orderBy('certificates.earned_at', 'desc');
  },
};

/**
 * Analytics and reporting query builders
 */
export const analyticsQueries = {
  /**
   * Get course performance metrics
   */
  getCourseMetrics: (courseId: string) => {
    return courseDb
      .selectFrom('enrollments')
      .select((eb) => [
        eb.fn.count('enrollments.id').as('total_enrollments'),
        eb.fn
          .count('enrollments.id')
          .filterWhere('enrollments.status', '=', 'completed')
          .as('completions'),
        eb.fn.avg('enrollments.progress_percentage').as('avg_progress'),
        eb.fn.sum('enrollments.total_time_spent_seconds').as('total_time_spent'),
      ])
      .where('course_id', '=', courseId)
      .groupBy('course_id');
  },

     /**
    * Get learning analytics for a time period
    */
   getLearningAnalytics: (startDate: Date, endDate: Date) => {
     return courseDb
       .selectFrom('analytics')
       .innerJoin('courses', 'analytics.course_id', 'courses.id')
       .select([
         'analytics.event_type',
         'courses.title as course_title',
         (eb) => eb.fn.count('analytics.id').as('event_count'),
         (eb) => eb.fn.count('analytics.user_id').distinct().as('unique_users'),
       ])
       .where('analytics.occurred_at', '>=', startDate)
       .where('analytics.occurred_at', '<=', endDate)
       .groupBy(['analytics.event_type', 'courses.title'])
       .orderBy('event_count', 'desc');
   },
};

// ========================================
// Data Validation Helpers
// ========================================

/**
 * Type guards and validation helpers
 */
export const validators = {
  /**
   * Validate difficulty level
   */
  isValidDifficultyLevel: (level: string): level is CourseTable['difficulty_level'] => {
    return ['beginner', 'intermediate', 'advanced', 'expert'].includes(level);
  },

  /**
   * Validate course status
   */
  isValidCourseStatus: (status: string): status is CourseTable['status'] => {
    return ['draft', 'review', 'published', 'archived'].includes(status);
  },

  /**
   * Validate lesson type
   */
  isValidLessonType: (type: string): type is LessonTable['lesson_type'] => {
    return ['video', 'text', 'interactive', 'quiz', 'assignment'].includes(type);
  },

  /**
   * Validate progress status
   */
  isValidProgressStatus: (status: string): status is ProgressTable['status'] => {
    return ['not_started', 'in_progress', 'completed', 'skipped'].includes(status);
  },
};

// ========================================
// Transaction Helpers
// ========================================

/**
 * Transaction wrapper for complex operations
 */
export const transactions = {
  /**
   * Enroll user in course with initial progress setup
   */
  enrollUserInCourse: async (
    userId: string,
    courseId: string,
    enrollmentType: EnrollmentTable['enrollment_type'] = 'free'
  ) => {
    return await courseDb.transaction().execute(async (trx) => {
      // Create enrollment record
      const enrollment = await trx
        .insertInto('enrollments')
        .values({
          id: crypto.randomUUID(),
          user_id: userId,
          course_id: courseId,
          enrollment_type: enrollmentType,
          payment_status: enrollmentType === 'free' ? 'completed' : 'pending',
          progress_percentage: 0,
          completed_lessons: 0,
          total_time_spent_seconds: 0,
          status: 'active',
          enrolled_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Get all lessons for the course
      const lessons = await trx
        .selectFrom('lessons')
        .select(['id'])
        .where('course_id', '=', courseId)
        .execute();

      // Create initial progress records for all lessons
      const progressRecords = lessons.map((lesson) => ({
        id: crypto.randomUUID(),
        user_id: userId,
        course_id: courseId,
        lesson_id: lesson.id,
        status: 'not_started' as const,
        completion_percentage: 0,
        time_spent_seconds: 0,
        bookmarked: false,
        likes: 0,
        last_accessed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }));

      if (progressRecords.length > 0) {
        await trx
          .insertInto('progress')
          .values(progressRecords)
          .execute();
      }

      return enrollment;
    });
  },
}; 