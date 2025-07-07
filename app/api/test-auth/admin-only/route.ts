import { NextRequest, NextResponse } from 'next/server';

// Simple role check helper (in production, this would use JWT verification)
function hasRole(userRoles: string[], requiredRole: string): boolean {
  return userRoles.includes(requiredRole);
}

export async function GET(request: NextRequest) {
  try {
    // Mock user data (in production, this would come from verified JWT)
    const mockUserData = {
      roles: ['Employer Admin'], // Try changing this to test different roles
      permissions: ['manage_users', 'edit_company_profile', 'create_job_posting']
    };
    
    // Check if user has admin role
    if (!hasRole(mockUserData.roles, 'Employer Admin')) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions',
          message: 'This endpoint requires the Employer Admin role.',
          userRoles: mockUserData.roles,
          requiredRole: 'Employer Admin'
        },
        { status: 403 }
      );
    }
    
    // User has admin role, return protected data
    return NextResponse.json({
      success: true,
      message: '🎉 Welcome Admin! This is protected admin-only content.',
      data: {
        adminInfo: 'This data is only visible to Employer Admins',
        userManagement: 'Access to user management functions',
        systemSettings: 'Access to system configuration'
      }
    });
    
  } catch (error) {
    console.error('Error in admin-only endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 