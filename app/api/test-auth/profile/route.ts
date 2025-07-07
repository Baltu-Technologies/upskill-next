import { NextRequest, NextResponse } from 'next/server';

// Mock user data for testing (in production, this would come from Auth0 tokens)
const mockUserData = {
  sub: 'auth0|test-user-123',
  email: 'test@baltutechnologies.com',
  name: 'Test User',
  organization: 'org_ayHu5XNaTNHMasO5',
  organizationName: 'Baltu Technologies',
  // These roles and permissions would come from Auth0 tokens in production
  roles: ['Employer Admin'], // Could be: Admin, Recruiter, Marketing, Viewer
  permissions: [
    'manage_users',
    'edit_company_profile',
    'create_job_posting',
    'view_analytics',
    'export_reports',
    'view_candidates',
    'manage_content',
    'manage_pipeline',
    'schedule_interviews'
  ]
};

export async function GET(request: NextRequest) {
  try {
    // In production, you would verify the JWT token here
    // For now, we'll return mock data for testing
    
    return NextResponse.json({
      success: true,
      user: {
        id: mockUserData.sub,
        email: mockUserData.email,
        name: mockUserData.name,
        organization: {
          id: mockUserData.organization,
          name: mockUserData.organizationName
        },
        roles: mockUserData.roles,
        permissions: mockUserData.permissions
      }
    });
    
  } catch (error) {
    console.error('Error in profile endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 