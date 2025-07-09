import { NextResponse } from 'next/server';
import { getCurrentUserWithRoles } from '../../../../lib/auth/role-helpers';

export async function GET() {
  try {
    // Check if the current user has admin privileges
    const session = await getCurrentUserWithRoles();
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // TODO: Implement Auth0 Management API integration
    // This would fetch users from Auth0 with their organization and role data
    // For now, return mock data
    const mockEmployerUsers = [
      {
        id: 'auth0|employer1',
        email: 'admin@baltutech.com',
        name: 'John Employer',
        organization: 'Baltu Technologies',
        roles: ['admin', 'recruiter'],
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-15T10:30:00Z'
      },
      {
        id: 'auth0|employer2',
        email: 'recruiter@honeywell.com',
        name: 'Jane Recruiter',
        organization: 'Honeywell',
        roles: ['recruiter'],
        createdAt: '2024-01-02T00:00:00Z',
        lastLogin: '2024-01-14T14:22:00Z'
      }
    ];

    return NextResponse.json(mockEmployerUsers);
  } catch (error) {
    console.error('Error fetching employer users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch employer users' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check if the current user has admin privileges
    const session = await getCurrentUserWithRoles();
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email, name, organization, role = 'recruiter' } = await request.json();

    // TODO: Implement Auth0 Management API integration
    // This would create a new Auth0 user with organization assignment
    // For now, return a placeholder response
    return NextResponse.json({ 
      message: 'Auth0 user creation not yet implemented',
      data: { email, name, organization, role }
    });
  } catch (error) {
    console.error('Error creating employer user:', error);
    return NextResponse.json({ 
      error: 'Failed to create employer user' 
    }, { status: 500 });
  }
} 