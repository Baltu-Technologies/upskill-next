import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.split('/').pop(); // Gets the last segment (login, logout, callback, me)
  
  // Basic router for Auth0 endpoints
  switch (path) {
    case 'login':
      // Redirect to Auth0 login with organization support
      const domain = process.env.AUTH0_ISSUER_BASE_URL;
      const clientId = process.env.AUTH0_CLIENT_ID;
      const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`;
      
      // Get organization from query params (required for Auth0 Organizations)
      const organization = searchParams.get('organization') || 'org_ayHu5XNaTNHMasO5'; // Baltu Technologies org
      
      const loginUrl = `${domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid profile email&` +
        `organization=${organization}`;
      
      console.log('Auth0 Login URL:', loginUrl);
      return NextResponse.redirect(loginUrl);
      
    case 'logout':
      // Handle logout
      const returnTo = `${process.env.AUTH0_BASE_URL}/auth0-test`;
      const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
        `returnTo=${encodeURIComponent(returnTo)}&` +
        `client_id=${process.env.AUTH0_CLIENT_ID}`;
      
      return NextResponse.redirect(logoutUrl);
      
    case 'callback':
      // Handle Auth0 callback
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        console.error('Auth0 Error:', error, errorDescription);
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth0-test?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`);
      }
      
      if (code) {
        // TODO: Exchange code for tokens
        console.log('Auth0 callback received code:', code);
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth0-test?success=true`);
      }
      
      return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth0-test?error=no_code`);
      
    case 'me':
      // Get current user info (placeholder)
      return NextResponse.json({ message: 'User info endpoint - not implemented yet' });
      
    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
} 