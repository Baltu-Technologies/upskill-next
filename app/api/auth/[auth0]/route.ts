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
      const organization = searchParams.get('organization') || 'org_ayHu5XNaTHWMaso5'; // Baltu Technologies org
      
      const loginUrl = `${domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid profile email&` +
        `organization=${organization}`;
      
      return NextResponse.redirect(loginUrl);
      
    case 'logout':
      // Handle logout
      const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
        `returnTo=${encodeURIComponent(process.env.AUTH0_BASE_URL!)}&` +
        `client_id=${process.env.AUTH0_CLIENT_ID}`;
      
      return NextResponse.redirect(logoutUrl);
      
    case 'callback':
      // Handle Auth0 callback - this is a simplified version
      // In a real implementation, you'd exchange the code for tokens
      return NextResponse.redirect('/dashboard');
      
    case 'me':
      // Return user profile
      return NextResponse.json({ user: null }); // Placeholder
      
    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
} 