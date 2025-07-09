import { NextResponse, NextRequest } from 'next/server';
import { auth } from '../../../auth';
import { UserRolesService } from '../../../lib/db/user-roles-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Debug - Starting user permissions check');
    console.log('🔍 API Debug - Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Get session using BetterAuth API with request context
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    console.log('🔍 API Debug - Session result:', session ? 'Found' : 'Not found');
    console.log('🔍 API Debug - Session details:', session ? { userId: session.user?.id, email: session.user?.email } : 'None');
    
    if (!session?.user) {
      console.log('🔍 API Debug - No session found, returning default learner permissions for now');
      // For debugging purposes, return default learner permissions when no session
      const fallbackPermissions = {
        canAccessHome: true,
        canAccessCourses: true,
        canAccessCareerOpportunities: true,
        canAccessCourseTest: false,
        canAccessGuideAccess: false,
        canAccessCourseCreator: false,
        canAccessProfile: true,
      };
      return NextResponse.json(fallbackPermissions);
    }

    console.log('🔍 API Debug - User ID:', session.user.id);
    
    // Get user roles
    const roles = await UserRolesService.getUserRoles(session.user.id);
    console.log('🔍 API Debug - User roles:', roles);
    
    // If user has no roles, provide default learner access
    if (!roles || roles.length === 0) {
      console.log('🔍 API Debug - No roles found, returning default learner permissions');
      const defaultPermissions = {
        canAccessHome: true,
        canAccessCourses: true,
        canAccessCareerOpportunities: true,
        canAccessCourseTest: false,
        canAccessGuideAccess: false,
        canAccessCourseCreator: false,
        canAccessProfile: true,
      };
      return NextResponse.json(defaultPermissions);
    }
    
    console.log('🔍 API Debug - Checking permissions for roles:', roles);
    
    // Check permissions based on roles
    const permissions = await Promise.all([
      UserRolesService.userHasPermission(session.user.id, 'home'),
      UserRolesService.userHasPermission(session.user.id, 'courses'),
      UserRolesService.userHasPermission(session.user.id, 'career_opportunities'),
      UserRolesService.userHasPermission(session.user.id, 'course_test'),
      UserRolesService.userHasPermission(session.user.id, 'guide_access'),
      UserRolesService.userHasPermission(session.user.id, 'course_creator'),
      UserRolesService.userHasPermission(session.user.id, 'profile'),
    ]);
    
    console.log('🔍 API Debug - Permission results:', permissions);
    
    const result = {
      canAccessHome: permissions[0],
      canAccessCourses: permissions[1],
      canAccessCareerOpportunities: permissions[2],
      canAccessCourseTest: permissions[3],
      canAccessGuideAccess: permissions[4],
      canAccessCourseCreator: permissions[5],
      canAccessProfile: permissions[6],
    };
    
    console.log('🔍 API Debug - Final result:', result);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ API Error - Error fetching user permissions:', error);
    // Return fallback permissions on error
    const errorFallback = {
      canAccessHome: true,
      canAccessCourses: true,
      canAccessCareerOpportunities: true,
      canAccessCourseTest: false,
      canAccessGuideAccess: false,
      canAccessCourseCreator: false,
      canAccessProfile: true,
    };
    return NextResponse.json(errorFallback);
  }
} 