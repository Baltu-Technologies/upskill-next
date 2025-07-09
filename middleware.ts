import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './lib/auth0-client';
import { extractTenantContext } from './lib/organizations';

// Define public routes that don't require authentication (for both learner and employer)
const publicRoutes = [
  '/',
  '/demo',
  '/api/auth', // Better Auth API routes
  '/api/auth0', // Auth0 API routes
  '/privacy-policy',
  '/terms-of-service',
  '/test',
  '/test-db',
  '/test-responsive',
  '/redis-test',
  '/s3-test',
  '/auth-test',
  '/auth0-test',
  '/auth-flow-test',
  '/rbac-test',
  '/user-management-test',
  '/microlesson-context-menu-test',
];

// Define learner platform routes (BetterAuth)
const learnerRoutes = [
  '/dashboard',
  '/profile',
  '/study-hub',
  '/courses',
  '/stats-goals',
  '/skills-assessment',
  '/skills-demo',
  '/task18-demo',
  '/messages',
  '/settings',
  '/career-exploration',
  '/microlessons',
  '/guide-access',
  '/course-creator',
];

// Define admin routes that require admin role (BetterAuth)
const adminRoutes = [
  '/jasminedragon'
];

function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function isPublicRoute(pathname: string): boolean {
  return isRouteMatch(pathname, publicRoutes);
}

function isLearnerRoute(pathname: string): boolean {
  return isRouteMatch(pathname, learnerRoutes) || isRouteMatch(pathname, adminRoutes);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static files to pass through
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract tenant context (subdomain-based routing)
  const tenantContext = extractTenantContext(request);
  
  console.log(`Tenant context for ${pathname}:`, tenantContext);

  // Allow public routes for both learner and employer
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Handle employer portal (subdomain-based or /employer-access route)
  if (tenantContext.type === 'employer' || pathname.startsWith('/employer-access') || pathname.startsWith('/employers')) {
    const organization = tenantContext.organization;
    
    if (!organization) {
      // Invalid organization - redirect to organization not found page
      const notFoundUrl = new URL('/organization-not-found', request.url);
      return NextResponse.redirect(notFoundUrl);
    }

    // TEMPORARY: Allow access to employer routes without Auth0 authentication
    // TODO: Re-enable Auth0 authentication once organization setup is complete
    console.log(`TEMPORARY ACCESS: Allowing access to ${pathname} for organization ${organization.name}`);
    return NextResponse.next();
    
    /* DISABLED FOR DEVELOPMENT - Re-enable when Auth0 organization is configured
    try {
      const session = await auth0.getSession(request);
      
      if (!session) {
        // Redirect to Auth0 login with organization parameter
        const loginUrl = new URL('/api/auth0/login', request.url);
        loginUrl.searchParams.set('returnTo', pathname);
        loginUrl.searchParams.set('organization', organization.id);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user has employer access permissions
      const userRoles = session.user?.['https://employer-portal.upskill.com/roles'] || [];
      const hasEmployerAccess = userRoles.some((role: string) => 
        ['Employer Admin', 'Employer Recruiter', 'Employer Viewer'].includes(role)
      );

      if (!hasEmployerAccess) {
        // Redirect to unauthorized page
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        unauthorizedUrl.searchParams.set('reason', 'employer-access-required');
        return NextResponse.redirect(unauthorizedUrl);
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Auth0 middleware error:', error);
      // Redirect to Auth0 login on error
      const loginUrl = new URL('/api/auth0/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      loginUrl.searchParams.set('organization', organization.id);
      return NextResponse.redirect(loginUrl);
    }
    */
  }

  // Handle learner platform routes (BetterAuth)
  if (tenantContext.type === 'learner') {
    if (isLearnerRoute(pathname)) {
      // Check for Better Auth session cookie
      const sessionCookie = request.cookies.get('better-auth.session_token');
      
      if (!sessionCookie?.value) {
        // Redirect to BetterAuth login with return URL
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // For admin routes, let the page component handle role verification
      // since we can't easily verify roles in Edge Runtime without database access
      return NextResponse.next();
    }
  }

  // If we reach here, either:
  // 1. It's a learner context trying to access employer routes
  // 2. It's an employer context trying to access learner routes
  // 3. It's an unknown route
  
  // Default routing based on tenant type
  switch (tenantContext.type) {
    case 'employer':
      // Employer trying to access learner routes - redirect to employer home
      return NextResponse.redirect(new URL('/employer-access', request.url));
    case 'learner':
    default:
      // Learner trying to access employer routes or unknown route - redirect to learner home
      return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 