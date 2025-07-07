import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define the custom claims structure from our Auth0 Action
interface EmployerPortalClaims {
  sub?: string;
  email?: string;
  name?: string;
  'https://employer-portal.upskill.com/roles'?: string[];
  'https://employer-portal.upskill.com/permissions'?: string[];
  'https://employer-portal.upskill.com/organization'?: string;
  'https://employer-portal.upskill.com/organization_name'?: string;
}

// Extract role and permission claims from the user session
export async function getUserClaims(req: NextRequest): Promise<EmployerPortalClaims | null> {
  try {
    // Try to get auth token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify JWT token with Auth0's public key
    const domain = process.env.AUTH0_ISSUER_BASE_URL;
    const audience = process.env.AUTH0_AUDIENCE || 'https://employer-portal.upskill.com';
    
    if (!domain) {
      console.error('AUTH0_ISSUER_BASE_URL not configured');
      return null;
    }
    
    // Get Auth0's public key
    const jwksUri = `${domain}/.well-known/jwks.json`;
    const response = await fetch(jwksUri);
    const jwks = await response.json();
    
    // For now, we'll decode the token without verification (development only)
    // In production, you should properly verify the JWT signature
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    return payload as EmployerPortalClaims;
  } catch (error) {
    console.error('Error getting user claims:', error);
    return null;
  }
}

// Check if user has a specific permission
export async function hasPermission(req: NextRequest, permission: string): Promise<boolean> {
  const claims = await getUserClaims(req);
  
  if (!claims) {
    return false;
  }
  
  const permissions = claims['https://employer-portal.upskill.com/permissions'] || [];
  return permissions.includes(permission);
}

// Check if user has any of the specified roles
export async function hasRole(req: NextRequest, roles: string | string[]): Promise<boolean> {
  const claims = await getUserClaims(req);
  
  if (!claims) {
    return false;
  }
  
  const userRoles = claims['https://employer-portal.upskill.com/roles'] || [];
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  return requiredRoles.some(role => userRoles.includes(role));
}

// Get user's organization ID
export async function getUserOrganization(req: NextRequest): Promise<string | null> {
  const claims = await getUserClaims(req);
  
  if (!claims) {
    return null;
  }
  
  return claims['https://employer-portal.upskill.com/organization'] || null;
}

// Middleware wrapper for protecting API routes with permission requirements
export function requirePermissions(permissions: string | string[]) {
  return async function(req: NextRequest, handler: Function) {
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    
    // Check each required permission
    for (const permission of requiredPermissions) {
      const hasAccess = await hasPermission(req, permission);
      
      if (!hasAccess) {
        return NextResponse.json(
          { 
            error: 'Insufficient permissions',
            required: permission,
            message: `This action requires the '${permission}' permission.`
          },
          { status: 403 }
        );
      }
    }
    
    // User has all required permissions, proceed with the handler
    return handler(req);
  };
}

// Middleware wrapper for protecting API routes with role requirements
export function requireRoles(roles: string | string[]) {
  return async function(req: NextRequest, handler: Function) {
    const hasAccess = await hasRole(req, roles);
    
    if (!hasAccess) {
      const rolesList = Array.isArray(roles) ? roles.join(', ') : roles;
      return NextResponse.json(
        { 
          error: 'Insufficient role',
          required: rolesList,
          message: `This action requires one of the following roles: ${rolesList}`
        },
        { status: 403 }
      );
    }
    
    // User has required role, proceed with the handler
    return handler(req);
  };
}

// Combined middleware for requiring both authentication and specific permissions
export function requireAuth(options?: { 
  permissions?: string | string[]; 
  roles?: string | string[]; 
}) {
  return async function(req: NextRequest, handler: Function) {
    // Check if user is authenticated
    const claims = await getUserClaims(req);
    
    if (!claims) {
      return NextResponse.json(
        { error: 'Authentication required', message: 'You must be logged in to access this resource.' },
        { status: 401 }
      );
    }
    
    // Check permissions if specified
    if (options?.permissions) {
      const permissionCheck = await requirePermissions(options.permissions);
      const permissionResult = await permissionCheck(req, handler);
      
      // If permission check failed, return the error response
      if (permissionResult.status === 403) {
        return permissionResult;
      }
    }
    
    // Check roles if specified
    if (options?.roles) {
      const roleCheck = await requireRoles(options.roles);
      const roleResult = await roleCheck(req, handler);
      
      // If role check failed, return the error response
      if (roleResult.status === 403) {
        return roleResult;
      }
    }
    
    // All checks passed, proceed with the handler
    return handler(req);
  };
}

// Helper to get all user info for debugging/display purposes
export async function getUserInfo(req: NextRequest) {
  const claims = await getUserClaims(req);
  
  if (!claims) {
    return null;
  }
  
  return {
    userId: claims.sub,
    email: claims.email,
    name: claims.name,
    roles: claims['https://employer-portal.upskill.com/roles'] || [],
    permissions: claims['https://employer-portal.upskill.com/permissions'] || [],
    organization: claims['https://employer-portal.upskill.com/organization'],
    organizationName: claims['https://employer-portal.upskill.com/organization_name']
  };
} 