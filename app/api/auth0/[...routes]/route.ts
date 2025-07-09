import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0-client';
import { extractTenantContext } from '@/lib/organizations';

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const slug = pathname.split('/').pop();
  
  try {
    if (slug === 'login') {
      // Store the returnTo URL in state
      const { searchParams } = new URL(request.url);
      const returnTo = searchParams.get('returnTo') || '/employer-access';
      const organizationParam = searchParams.get('organization');
      
      // Extract tenant context for organization-specific handling
      const tenantContext = extractTenantContext(request);
      
      // Determine organization ID to use
      const organizationId = organizationParam || tenantContext.organization?.id;
      
      console.log(`Auth0 login for organization: ${organizationId} (${tenantContext.organization?.name})`);
      
      // Create Auth0 login URL
      const auth0LoginUrl = `https://${process.env.AUTH0_DOMAIN}/authorize?` +
        `response_type=code&` +
        `client_id=${process.env.AUTH0_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent((process.env.AUTH0_BASE_URL || 'http://localhost:3000') + '/api/auth0/callback')}&` +
        `scope=${encodeURIComponent(process.env.AUTH0_SCOPE || 'openid profile email')}&` +
        `state=${encodeURIComponent(returnTo)}&` +
        (process.env.AUTH0_AUDIENCE ? `audience=${encodeURIComponent(process.env.AUTH0_AUDIENCE)}&` : '') +
        (organizationId ? `organization=${encodeURIComponent(organizationId)}&` : '');
      
      return NextResponse.redirect(auth0LoginUrl);
    }
    
    if (slug === 'logout') {
      // Clear Auth0 session and redirect to Auth0 logout
      const auth0LogoutUrl = `https://${process.env.AUTH0_DOMAIN}/v2/logout?` +
        `client_id=${process.env.AUTH0_CLIENT_ID}&` +
        `returnTo=${encodeURIComponent(process.env.AUTH0_BASE_URL || 'http://localhost:3000')}`;
      
      return NextResponse.redirect(auth0LogoutUrl);
    }
    
    if (slug === 'callback') {
      // Handle Auth0 callback
      const { searchParams } = new URL(request.url);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      if (error) {
        console.error('Auth0 callback error:', error);
        
        // Handle organization requirement error specifically
        const errorDescription = searchParams.get('error_description');
        if (error === 'invalid_request' && errorDescription?.includes('organization is required')) {
          console.log('Auth0 organization requirement detected, redirecting to main site');
          return NextResponse.redirect(new URL('/?auth0_org_required=true', request.url));
        }
        
        return NextResponse.redirect(new URL('/unauthorized?reason=auth0-error', request.url));
      }
      
      if (!code) {
        console.error('No authorization code received');
        return NextResponse.redirect(new URL('/unauthorized?reason=no-code', request.url));
      }
      
      try {
        // Exchange authorization code for tokens
        const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID!,
            client_secret: process.env.AUTH0_CLIENT_SECRET!,
            code,
            redirect_uri: `${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}/api/auth0/callback`,
          }),
        });
        
        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.text();
          console.error('Token exchange failed:', errorData);
          return NextResponse.redirect(new URL('/unauthorized?reason=token-exchange-failed', request.url));
        }
        
        const tokens = await tokenResponse.json();
        
        // Get user info
        const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        });
        
        if (!userResponse.ok) {
          console.error('Failed to get user info');
          return NextResponse.redirect(new URL('/unauthorized?reason=userinfo-failed', request.url));
        }
        
        const userInfo = await userResponse.json();
        
        // Create a session manually by setting a JWT as cookie
        const sessionData = {
          user: userInfo,
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: Date.now() + (tokens.expires_in * 1000),
        };
        
        // Redirect to the original destination
        const redirectUrl = state || '/employer-access';
        const response = NextResponse.redirect(new URL(redirectUrl, request.url));
        
        // Set session cookie with JWT
        response.cookies.set('auth0-session', JSON.stringify(sessionData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        
        return response;
        
      } catch (error) {
        console.error('Auth0 callback processing error:', error);
        return NextResponse.redirect(new URL('/unauthorized?reason=callback-processing-failed', request.url));
      }
    }
    
    // Default: return 404
    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('Auth0 API route error:', error);
    return NextResponse.redirect(new URL('/unauthorized?reason=auth0-api-error', request.url));
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
} 