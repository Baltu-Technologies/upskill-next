import { redis, REDIS_CONFIG, REDIS_PATTERNS } from './client';
import { NextRequest } from 'next/server';
import { getUserInfo } from '@/lib/auth/middleware';

// Session data structure
export interface SessionData {
  sessionId: string;
  tenantId: string;
  userId: string;
  email: string;
  name?: string;
  roles: string[];
  permissions: string[];
  organizationName?: string;
  createdAt: number;
  lastAccessedAt: number;
  expiresAt: number;
  metadata?: Record<string, any>;
}

// Session configuration
export interface SessionConfig {
  ttl?: number;
  extendOnAccess?: boolean;
  maxSessions?: number;
  trackActivity?: boolean;
}

// Default session configuration
const DEFAULT_SESSION_CONFIG: SessionConfig = {
  ttl: REDIS_CONFIG.sessionTTL,
  extendOnAccess: true,
  maxSessions: 5, // Maximum concurrent sessions per user
  trackActivity: true,
};

// Helper functions
const getSessionKey = (tenantId: string, sessionId: string): string => {
  return REDIS_PATTERNS.session(tenantId, sessionId);
};

const getUserSessionsKey = (tenantId: string, userId: string): string => {
  return `user_sessions:${tenantId}:${userId}`;
};

const getSessionActivityKey = (tenantId: string, sessionId: string): string => {
  return `session_activity:${tenantId}:${sessionId}`;
};

/**
 * Create a new session
 */
export const createSession = async (
  sessionData: Omit<SessionData, 'sessionId' | 'createdAt' | 'lastAccessedAt' | 'expiresAt'>,
  config: SessionConfig = {}
): Promise<string> => {
  const sessionConfig = { ...DEFAULT_SESSION_CONFIG, ...config };
  const sessionId = generateSessionId();
  const now = Date.now();
  
  const fullSessionData: SessionData = {
    ...sessionData,
    sessionId,
    createdAt: now,
    lastAccessedAt: now,
    expiresAt: now + (sessionConfig.ttl! * 1000),
  };

  try {
    const sessionKey = getSessionKey(sessionData.tenantId, sessionId);
    const userSessionsKey = getUserSessionsKey(sessionData.tenantId, sessionData.userId);
    
    // Store session data
    await redis.set(sessionKey, fullSessionData, { ex: sessionConfig.ttl! });
    
    // Add to user's active sessions set
    await redis.sadd(userSessionsKey, sessionId);
    await redis.expire(userSessionsKey, sessionConfig.ttl!);
    
    // Enforce max sessions limit
    if (sessionConfig.maxSessions) {
      await enforceMaxSessions(sessionData.tenantId, sessionData.userId, sessionConfig.maxSessions);
    }
    
    // Track activity if enabled
    if (sessionConfig.trackActivity) {
      await trackSessionActivity(sessionData.tenantId, sessionId, 'created');
    }
    
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
};

/**
 * Get session data
 */
export const getSession = async (
  tenantId: string,
  sessionId: string,
  config: SessionConfig = {}
): Promise<SessionData | null> => {
  const sessionConfig = { ...DEFAULT_SESSION_CONFIG, ...config };
  
  try {
    const sessionKey = getSessionKey(tenantId, sessionId);
    const sessionData = await redis.get(sessionKey) as SessionData | null;
    
    if (!sessionData) {
      return null;
    }
    
    // Check if session has expired
    if (Date.now() > sessionData.expiresAt) {
      await deleteSession(tenantId, sessionId);
      return null;
    }
    
          // Extend session if configured to do so
      if (sessionConfig.extendOnAccess) {
        const now = Date.now();
        sessionData.lastAccessedAt = now;
        sessionData.expiresAt = now + (sessionConfig.ttl! * 1000);
        
        await redis.set(sessionKey, sessionData, { ex: sessionConfig.ttl! });
      }
    
    // Track activity if enabled
    if (sessionConfig.trackActivity) {
      await trackSessionActivity(tenantId, sessionId, 'accessed');
    }
    
    return sessionData;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Update session data
 */
export const updateSession = async (
  tenantId: string,
  sessionId: string,
  updates: Partial<SessionData>,
  config: SessionConfig = {}
): Promise<boolean> => {
  const sessionConfig = { ...DEFAULT_SESSION_CONFIG, ...config };
  
  try {
    const sessionKey = getSessionKey(tenantId, sessionId);
    const existingSession = await getSession(tenantId, sessionId, config);
    
    if (!existingSession) {
      return false;
    }
    
    const updatedSession: SessionData = {
      ...existingSession,
      ...updates,
      lastAccessedAt: Date.now(),
    };
    
    await redis.set(sessionKey, updatedSession, { ex: sessionConfig.ttl! });
    
    // Track activity if enabled
    if (sessionConfig.trackActivity) {
      await trackSessionActivity(tenantId, sessionId, 'updated');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating session:', error);
    return false;
  }
};

/**
 * Delete a session
 */
export const deleteSession = async (tenantId: string, sessionId: string): Promise<boolean> => {
  try {
    const sessionKey = getSessionKey(tenantId, sessionId);
    const sessionData = await getSession(tenantId, sessionId);
    
    if (sessionData) {
      const userSessionsKey = getUserSessionsKey(tenantId, sessionData.userId);
      await redis.srem(userSessionsKey, sessionId);
    }
    
    await redis.del(sessionKey);
    
    // Clean up activity tracking
    const activityKey = getSessionActivityKey(tenantId, sessionId);
    await redis.del(activityKey);
    
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};

/**
 * Get all active sessions for a user
 */
export const getUserSessions = async (tenantId: string, userId: string): Promise<SessionData[]> => {
  try {
    const userSessionsKey = getUserSessionsKey(tenantId, userId);
    const sessionIds = await redis.smembers(userSessionsKey);
    
    if (!sessionIds || sessionIds.length === 0) {
      return [];
    }
    
    const sessions: SessionData[] = [];
    
    for (const sessionId of sessionIds) {
      const sessionData = await getSession(tenantId, sessionId);
      if (sessionData) {
        sessions.push(sessionData);
      } else {
        // Clean up invalid session ID
        await redis.srem(userSessionsKey, sessionId);
      }
    }
    
    return sessions.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return [];
  }
};

/**
 * Delete all sessions for a user
 */
export const deleteUserSessions = async (tenantId: string, userId: string): Promise<number> => {
  try {
    const sessions = await getUserSessions(tenantId, userId);
    let deletedCount = 0;
    
    for (const session of sessions) {
      const success = await deleteSession(tenantId, session.sessionId);
      if (success) deletedCount++;
    }
    
    // Clean up user sessions set
    const userSessionsKey = getUserSessionsKey(tenantId, userId);
    await redis.del(userSessionsKey);
    
    return deletedCount;
  } catch (error) {
    console.error('Error deleting user sessions:', error);
    return 0;
  }
};

/**
 * Enforce maximum sessions per user
 */
const enforceMaxSessions = async (
  tenantId: string,
  userId: string,
  maxSessions: number
): Promise<void> => {
  try {
    const sessions = await getUserSessions(tenantId, userId);
    
    if (sessions.length > maxSessions) {
      // Sort by last accessed time and remove oldest sessions
      const sessionsToRemove = sessions
        .sort((a, b) => a.lastAccessedAt - b.lastAccessedAt)
        .slice(0, sessions.length - maxSessions);
      
      for (const session of sessionsToRemove) {
        await deleteSession(tenantId, session.sessionId);
      }
    }
  } catch (error) {
    console.error('Error enforcing max sessions:', error);
  }
};

/**
 * Track session activity
 */
const trackSessionActivity = async (
  tenantId: string,
  sessionId: string,
  action: string
): Promise<void> => {
  try {
    const activityKey = getSessionActivityKey(tenantId, sessionId);
    const timestamp = Date.now();
    
    await redis.zadd(activityKey, { score: timestamp, member: `${timestamp}:${action}` });
    await redis.expire(activityKey, REDIS_CONFIG.sessionTTL);
    
    // Keep only last 100 activities
    await redis.zremrangebyrank(activityKey, 0, -101);
  } catch (error) {
    console.error('Error tracking session activity:', error);
  }
};

/**
 * Get session activity log
 */
export const getSessionActivity = async (
  tenantId: string,
  sessionId: string,
  limit: number = 50
): Promise<Array<{ timestamp: number; action: string }>> => {
  try {
    const activityKey = getSessionActivityKey(tenantId, sessionId);
    const activities = await redis.zrange(activityKey, 0, limit - 1, { rev: true }) as string[];
    
    return activities.map((activity) => {
      const [timestamp, action] = activity.split(':');
      return {
        timestamp: parseInt(timestamp),
        action,
      };
    });
  } catch (error) {
    console.error('Error getting session activity:', error);
    return [];
  }
};

/**
 * Session statistics for a tenant
 */
export const getSessionStats = async (tenantId: string): Promise<{
  totalActiveSessions: number;
  uniqueUsers: number;
  averageSessionDuration: number;
  recentActivity: number;
}> => {
  try {
    const pattern = `session:${tenantId}:*`;
    const sessionKeys = await redis.keys(pattern);
    
    if (sessionKeys.length === 0) {
      return {
        totalActiveSessions: 0,
        uniqueUsers: 0,
        averageSessionDuration: 0,
        recentActivity: 0,
      };
    }
    
    const sessions = await redis.mget(...sessionKeys) as SessionData[];
    const validSessions = sessions.filter(Boolean);
    const uniqueUsers = new Set(validSessions.map(s => s.userId)).size;
    
    const now = Date.now();
    const recentActivity = validSessions.filter(
      s => now - s.lastAccessedAt < 60 * 60 * 1000 // Last hour
    ).length;
    
    const totalDuration = validSessions.reduce(
      (sum, s) => sum + (s.lastAccessedAt - s.createdAt),
      0
    );
    const averageSessionDuration = validSessions.length > 0 
      ? totalDuration / validSessions.length 
      : 0;
    
    return {
      totalActiveSessions: validSessions.length,
      uniqueUsers,
      averageSessionDuration,
      recentActivity,
    };
  } catch (error) {
    console.error('Error getting session stats:', error);
    return {
      totalActiveSessions: 0,
      uniqueUsers: 0,
      averageSessionDuration: 0,
      recentActivity: 0,
    };
  }
};

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Session middleware helper for API routes
 */
export async function getSessionFromRequest(req: NextRequest): Promise<SessionData | null> {
  try {
    const userInfo = await getUserInfo(req);
    
    if (!userInfo || !userInfo.organization) {
      return null;
    }
    
    // In this implementation, we'll create/update session based on Auth0 JWT
    // You might want to get session ID from cookies or headers instead
    const sessionId = req.headers.get('x-session-id') || 
                     req.cookies.get('session-id')?.value ||
                     generateSessionId();
    
    // Try to get existing session
    let session = await getSession(userInfo.organization, sessionId);
    
    if (!session) {
      // Create new session
      const newSessionId = await createSession({
        tenantId: userInfo.organization,
        userId: userInfo.userId || '',
        email: userInfo.email || '',
        name: userInfo.name,
        roles: userInfo.roles,
        permissions: userInfo.permissions,
        organizationName: userInfo.organizationName,
      });
      
      session = await getSession(userInfo.organization, newSessionId);
    } else {
      // Update session with latest user info
      await updateSession(userInfo.organization, sessionId, {
        roles: userInfo.roles,
        permissions: userInfo.permissions,
        name: userInfo.name,
        organizationName: userInfo.organizationName,
      });
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session from request:', error);
    return null;
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(tenantId: string): Promise<number> {
  try {
    const pattern = `session:${tenantId}:*`;
    const sessionKeys = await redis.keys(pattern);
    
    if (sessionKeys.length === 0) {
      return 0;
    }
    
    let deletedCount = 0;
    const now = Date.now();
    
    for (const sessionKey of sessionKeys) {
      const session = await redis.get(sessionKey) as SessionData | null;
      
      if (!session || now > session.expiresAt) {
        await redis.del(sessionKey);
        deletedCount++;
        
        // Clean up related data
        if (session) {
          const userSessionsKey = getUserSessionsKey(tenantId, session.userId);
          await redis.srem(userSessionsKey, session.sessionId);
          
          const activityKey = getSessionActivityKey(tenantId, session.sessionId);
          await redis.del(activityKey);
        }
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
}

export default {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  getUserSessions,
  deleteUserSessions,
  getSessionActivity,
  getSessionStats,
  getSessionFromRequest,
  cleanupExpiredSessions,
}; 