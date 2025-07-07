import { NextRequest, NextResponse } from 'next/server';
import { 
  createSession, 
  getSession as getRedisSession,
  updateSession,
  deleteSession,
  getUserSessions,
  getSessionStats,
  getSessionFromRequest
} from '@/lib/redis/session';
import { getUserInfo } from '@/lib/auth/middleware';

/**
 * GET /api/redis/session
 * Get current session data or list user sessions
 */
export async function GET(request: NextRequest) {
  try {
    const userInfo = await getUserInfo(request);
    
    if (!userInfo || !userInfo.organization) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const sessionId = searchParams.get('sessionId');
    
    switch (action) {
      case 'current':
        // Get current session from request
        const currentSession = await getSessionFromRequest(request);
        return NextResponse.json({
          success: true,
          session: currentSession,
          timestamp: new Date().toISOString(),
        });
        
      case 'get':
        if (!sessionId) {
          return NextResponse.json(
            { error: 'Session ID is required' },
            { status: 400 }
          );
        }
        
        const session = await getRedisSession(userInfo.organization, sessionId);
        return NextResponse.json({
          success: true,
          session,
          exists: session !== null,
          timestamp: new Date().toISOString(),
        });
        
      case 'userSessions':
        const sessions = await getUserSessions(userInfo.organization, userInfo.userId || '');
        return NextResponse.json({
          success: true,
          sessions,
          count: sessions.length,
          timestamp: new Date().toISOString(),
        });
        
      case 'stats':
        const stats = await getSessionStats(userInfo.organization);
        return NextResponse.json({
          success: true,
          stats,
          timestamp: new Date().toISOString(),
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: current, get, userSessions, or stats' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Redis session GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Session retrieval failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/redis/session
 * Create a new session
 */
export async function POST(request: NextRequest) {
  try {
    const userInfo = await getUserInfo(request);
    
    if (!userInfo || !userInfo.organization) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { action, sessionId, updates, config } = body;
    
    switch (action) {
      case 'create':
        const newSessionId = await createSession({
          tenantId: userInfo.organization,
          userId: userInfo.userId || '',
          email: userInfo.email || '',
          name: userInfo.name,
          roles: userInfo.roles,
          permissions: userInfo.permissions,
          organizationName: userInfo.organizationName,
          metadata: body.metadata,
        }, config);
        
        return NextResponse.json({
          success: true,
          sessionId: newSessionId,
          timestamp: new Date().toISOString(),
        });
        
      case 'update':
        if (!sessionId) {
          return NextResponse.json(
            { error: 'Session ID is required' },
            { status: 400 }
          );
        }
        
        const updateSuccess = await updateSession(
          userInfo.organization,
          sessionId,
          updates,
          config
        );
        
        return NextResponse.json({
          success: updateSuccess,
          sessionId,
          timestamp: new Date().toISOString(),
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: create or update' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Redis session POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Session operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/redis/session
 * Destroy session(s)
 */
export async function DELETE(request: NextRequest) {
  try {
    const userInfo = await getUserInfo(request);
    
    if (!userInfo || !userInfo.organization) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteSession(userInfo.organization, sessionId);
    
    return NextResponse.json({
      success,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis session DELETE error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Session deletion failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 