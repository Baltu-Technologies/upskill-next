import { auth } from "../../auth";
import { UserRolesService, type UserRole } from "../db/user-roles-service";
import { NextRequest, NextResponse } from "next/server";

// Re-export the UserRole type for convenience
export type { UserRole };

/**
 * Check if a user role has at least the minimum required role level
 */
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
    const hierarchy = UserRolesService.getRoleHierarchy();
    const userLevel = hierarchy[userRole];
    const minLevel = hierarchy[minimumRole];
    
    return userLevel >= minLevel;
}

// Type for session with roles
export interface SessionWithRoles {
    user: {
        id: string;
        email: string;
        name?: string;
        image?: string | null;
        firstName?: string;
        lastName?: string;
        roles?: UserRole[];
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null;
        userAgent?: string | null;
    };
}

/**
 * Get current user session with roles
 */
export async function getCurrentUserWithRoles(): Promise<SessionWithRoles | null> {
    try {
        // Get session using BetterAuth API - this works in both API routes and server components
        const session = await auth.api.getSession({
            headers: await import('next/headers').then(mod => mod.headers())
        });
        
        if (!session?.user) {
            return null;
        }
        
        // Get user roles using the roles service
        const roles = await UserRolesService.getUserRoles(session.user.id);
        
        return {
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                image: session.user.image || undefined,
                firstName: session.user.firstName || undefined,
                lastName: session.user.lastName || undefined,
                roles
            },
            session: {
                id: session.session.id,
                userId: session.session.userId,
                expiresAt: session.session.expiresAt,
                token: session.session.token,
                ipAddress: session.session.ipAddress || undefined,
                userAgent: session.session.userAgent || undefined
            }
        };
    } catch (error) {
        console.error("Error getting current user with roles:", error);
        return null;
    }
}

/**
 * Check if current user has specific role
 */
export async function currentUserHasRole(role: UserRole): Promise<boolean> {
    try {
        const session = await getCurrentUserWithRoles();
        if (!session) return false;
        
        return session.user.roles?.includes(role) || false;
    } catch (error) {
        console.error("Error checking user role:", error);
        return false;
    }
}

/**
 * Check if current user has specific permission
 */
export async function currentUserHasPermission(permission: string): Promise<boolean> {
    try {
        const session = await getCurrentUserWithRoles();
        if (!session) return false;
        
        return await UserRolesService.userHasPermission(session.user.id, permission);
    } catch (error) {
        console.error("Error checking user permission:", error);
        return false;
    }
}

/**
 * Require specific role for route access
 */
export async function requireRole(role: UserRole): Promise<boolean> {
    try {
        const session = await getCurrentUserWithRoles();
        if (!session) return false;
        
        return session.user.roles?.includes(role) || false;
    } catch (error) {
        console.error("Error requiring role:", error);
        return false;
    }
}

/**
 * Require specific permission for route access
 */
export async function requirePermission(permission: string): Promise<boolean> {
    try {
        const session = await getCurrentUserWithRoles();
        if (!session) return false;
        
        return await UserRolesService.userHasPermission(session.user.id, permission);
    } catch (error) {
        console.error("Error requiring permission:", error);
        return false;
    }
}

/**
 * Get navigation items based on user roles
 */
export async function getNavigationForUser(): Promise<{
    canAccessHome: boolean;
    canAccessCourses: boolean;
    canAccessCareerOpportunities: boolean;
    canAccessCourseTest: boolean;
    canAccessGuideAccess: boolean;
    canAccessCourseCreator: boolean;
    canAccessProfile: boolean;
}> {
    try {
        console.log('🔍 Role Debug - Starting getNavigationForUser');
        const session = await getCurrentUserWithRoles();
        console.log('🔍 Role Debug - Session result:', session ? 'Found' : 'Not found');
        
        // Default permissions for unauthenticated users
        if (!session) {
            console.log('🔍 Role Debug - No session, returning false permissions');
            return {
                canAccessHome: false,
                canAccessCourses: false,
                canAccessCareerOpportunities: false,
                canAccessCourseTest: false,
                canAccessGuideAccess: false,
                canAccessCourseCreator: false,
                canAccessProfile: false,
            };
        }

        console.log('🔍 Role Debug - User ID:', session.user.id);
        console.log('🔍 Role Debug - User roles:', session.user.roles);

        // If user has no roles (e.g., before migration or new user), provide default learner access
        if (!session.user.roles || session.user.roles.length === 0) {
            console.log('🔍 Role Debug - No roles found, returning default learner permissions');
            return {
                canAccessHome: true,
                canAccessCourses: true,
                canAccessCareerOpportunities: true,
                canAccessCourseTest: false,
                canAccessGuideAccess: false,
                canAccessCourseCreator: false,
                canAccessProfile: true,
            };
        }

        console.log('🔍 Role Debug - Checking permissions for roles:', session.user.roles);
        
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

        console.log('🔍 Role Debug - Permission results:', permissions);

        const result = {
            canAccessHome: permissions[0],
            canAccessCourses: permissions[1],
            canAccessCareerOpportunities: permissions[2],
            canAccessCourseTest: permissions[3],
            canAccessGuideAccess: permissions[4],
            canAccessCourseCreator: permissions[5],
            canAccessProfile: permissions[6],
        };

        console.log('🔍 Role Debug - Final result:', result);
        return result;
    } catch (error) {
        console.error("❌ Role Error - Error getting navigation for user:", error);
        // Return default learner permissions on error (assume authenticated user)
        return {
            canAccessHome: true,
            canAccessCourses: true,
            canAccessCareerOpportunities: true,
            canAccessCourseTest: false,
            canAccessGuideAccess: false,
            canAccessCourseCreator: false,
            canAccessProfile: true,
        };
    }
}

/**
 * Middleware helper to protect routes based on roles
 */
export async function createRoleBasedMiddleware(
    requiredPermission: string,
    redirectTo: string = "/auth/signin"
) {
    return async (request: NextRequest) => {
        try {
            const session = await getCurrentUserWithRoles();
            
            if (!session) {
                return NextResponse.redirect(new URL(redirectTo, request.url));
            }

            const hasPermission = await UserRolesService.userHasPermission(session.user.id, requiredPermission);
            
            if (!hasPermission) {
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error("Error in role-based middleware:", error);
            return NextResponse.redirect(new URL(redirectTo, request.url));
        }
    };
}

/**
 * Server-side permission check for pages
 */
export async function checkPermissionForPage(permission: string): Promise<{
    hasPermission: boolean;
    user: SessionWithRoles['user'] | null;
}> {
    try {
        const session = await getCurrentUserWithRoles();
        
        if (!session) {
            return { hasPermission: false, user: null };
        }

        const hasPermission = await UserRolesService.userHasPermission(session.user.id, permission);
        
        return {
            hasPermission,
            user: session.user
        };
    } catch (error) {
        console.error("Error checking permission for page:", error);
        return { hasPermission: false, user: null };
    }
}

/**
 * Utility functions for role management
 */
export const roleHelpers = {
    getCurrentUserWithRoles,
    currentUserHasRole,
    currentUserHasPermission,
    requireRole,
    requirePermission,
    getNavigationForUser,
    createRoleBasedMiddleware,
    checkPermissionForPage,
}; 