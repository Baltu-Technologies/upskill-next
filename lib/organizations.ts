// lib/organizations.ts
import { NextRequest } from 'next/server';

export interface OrganizationConfig {
  id: string;                    // Auth0 organization ID (e.g., 'org_ayHu5XNaTNHMasO5')
  slug: string;                  // URL-friendly identifier (e.g., 'baltu')
  name: string;                  // Display name (e.g., 'Baltu Technologies')
  domain?: string;               // Email domain (e.g., 'baltutech.com')
  subdomain: string;             // Subdomain (e.g., 'baltu')
  isActive: boolean;             // Whether this organization is active
  features?: string[];           // Enabled features for this organization
  settings?: Record<string, any>; // Organization-specific settings
}

/**
 * Registry of all employer organizations
 * In production, this would come from a database
 */
export const ORGANIZATIONS: Record<string, OrganizationConfig> = {
  'baltu': {
    id: 'org_ayHu5XNaTNHMasO5',
    slug: 'baltu',
    name: 'Baltu Technologies',
    domain: 'baltutech.com',
    subdomain: 'baltu',
    isActive: true,
    features: ['job-posting', 'candidate-screening', 'analytics'],
    settings: {
      theme: 'default',
      branding: {
        logo: '/media/baltu_technologies_logo_long_upskill_white.png',
        primaryColor: '#3b82f6'
      }
    }
  },
  // Add more organizations as needed
  'acme': {
    id: 'org_2HgZqEjUUqzJvJ1N', // Example organization ID
    slug: 'acme',
    name: 'Acme Corporation',
    domain: 'acme.com',
    subdomain: 'acme',
    isActive: true,
    features: ['job-posting', 'candidate-screening'],
    settings: {
      theme: 'dark',
      branding: {
        primaryColor: '#ef4444'
      }
    }
  }
};

/**
 * Extract tenant context from request
 */
export type TenantContext = {
  type: 'learner' | 'employer';
  organization?: OrganizationConfig;
  subdomain?: string;
};

export function extractTenantContext(request: NextRequest): TenantContext {
  const host = request.headers.get('host') || '';
  
  // Development environment
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    // Check if path starts with /employer-access - treat as employer
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith('/employer-access') || pathname.startsWith('/employers')) {
      // For development, use the first organization as default
      const defaultOrg = Object.values(ORGANIZATIONS)[0];
      return {
        type: 'employer' as const,
        organization: defaultOrg,
        subdomain: defaultOrg.subdomain
      };
    }
    return { type: 'learner' as const };
  }
  
  // Production environment - parse subdomain
  const parts = host.split('.');
  
  // Main domain (upskill.baltutech.com) - learner platform
  if (parts.length === 3 && parts[0] === 'upskill') {
    return { type: 'learner' as const };
  }
  
  // Subdomain (baltu.baltutech.com) - employer portal
  if (parts.length === 3 && parts[0] !== 'upskill') {
    const subdomain = parts[0];
    const organization = ORGANIZATIONS[subdomain];
    
    if (organization && organization.isActive) {
      return {
        type: 'employer' as const,
        organization,
        subdomain
      };
    }
  }
  
  // Default to learner for unknown domains
  return { type: 'learner' as const };
}

/**
 * Get organization by subdomain
 */
export function getOrganizationBySubdomain(subdomain: string): OrganizationConfig | null {
  return ORGANIZATIONS[subdomain] || null;
}

/**
 * Get organization by Auth0 organization ID
 */
export function getOrganizationById(id: string): OrganizationConfig | null {
  return Object.values(ORGANIZATIONS).find(org => org.id === id) || null;
}

/**
 * Check if a subdomain is valid and active
 */
export function isValidSubdomain(subdomain: string): boolean {
  const org = ORGANIZATIONS[subdomain];
  return org ? org.isActive : false;
}

/**
 * Get all active organizations
 */
export function getActiveOrganizations(): OrganizationConfig[] {
  return Object.values(ORGANIZATIONS).filter(org => org.isActive);
} 