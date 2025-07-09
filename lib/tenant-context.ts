// lib/tenant-context.ts
import { NextRequest } from 'next/server';
import { auth0 } from './auth0-client';
import { extractTenantContext } from './organizations';

export interface TenantContext {
  userId: string;
  organizationId: string;
  role: string;
  email: string;
  organizationName: string;
}

/**
 * Get tenant context for multi-tenant operations
 * - Development: Uses mock data for rapid development
 * - Production: Uses real Auth0 session data
 */
export async function getTenantContext(request: NextRequest): Promise<TenantContext> {
  // Development mode: Use mock data
  if (process.env.NODE_ENV === 'development' && !process.env.FORCE_AUTH0) {
    const tenantInfo = extractTenantContext(request);
    return {
      userId: 'dev_user_123',
      organizationId: tenantInfo.organization?.id || 'org_ayHu5XNaTNHMasO5',
      role: 'admin',
      email: 'dev@baltutech.com',
      organizationName: tenantInfo.organization?.name || 'Development Org'
    };
  }
  
  // Production mode: Use real Auth0 data
  const session = await auth0.getSession(request);
  if (!session?.user) {
    throw new Error('No valid Auth0 session found');
  }
  
  const user = session.user;
  const userRoles = user['https://employer-portal.upskill.com/roles'] || [];
  const primaryRole = userRoles[0] || 'user';
  
  return {
    userId: user.sub,
    organizationId: user['https://employer-portal.upskill.com/organization'] || '',
    role: primaryRole,
    email: user.email,
    organizationName: user['https://employer-portal.upskill.com/organization_name'] || 'Unknown Organization'
  };
}

/**
 * Validate tenant context and ensure organization access
 */
export function validateTenantContext(tenantContext: TenantContext): void {
  if (!tenantContext.organizationId) {
    throw new Error('Organization not found in tenant context');
  }
  
  if (!tenantContext.userId) {
    throw new Error('User not found in tenant context');
  }
}

/**
 * Get organization ID from tenant context (helper function)
 */
export function getOrganizationId(tenantContext: TenantContext): string {
  validateTenantContext(tenantContext);
  return tenantContext.organizationId;
}

/**
 * Get user ID from tenant context (helper function)
 */
export function getUserId(tenantContext: TenantContext): string {
  validateTenantContext(tenantContext);
  return tenantContext.userId;
} 