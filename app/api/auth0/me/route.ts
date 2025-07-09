import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0-client';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
    
    return NextResponse.json(session.user);
  } catch (error) {
    console.error('Error in /api/auth0/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 