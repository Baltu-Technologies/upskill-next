import { NextRequest, NextResponse } from 'next/server';

// Simple permission check helper (in production, this would use JWT verification)
function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

export async function POST(request: NextRequest) {
  try {
    // Mock user data (in production, this would come from verified JWT)
    const mockUserData = {
      roles: ['Employer Recruiter'], // Try changing this to test different roles
      permissions: [
        'create_job_posting',
        'view_candidates',
        'manage_pipeline',
        'schedule_interviews',
        'view_analytics',
        'export_reports'
      ]
    };
    
    // Check if user has permission to create job postings
    if (!hasPermission(mockUserData.permissions, 'create_job_posting')) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions',
          message: 'This action requires the create_job_posting permission.',
          userPermissions: mockUserData.permissions,
          requiredPermission: 'create_job_posting'
        },
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    
    // User has permission, simulate creating a job posting
    return NextResponse.json({
      success: true,
      message: '✅ Job posting created successfully!',
      data: {
        jobId: 'job_' + Date.now(),
        title: body.title || 'Test Job Posting',
        description: body.description || 'Test job description',
        createdBy: mockUserData.roles[0],
        permissions: mockUserData.permissions,
        organization: 'Baltu Technologies'
      }
    });
    
  } catch (error) {
    console.error('Error in create-job endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also handle GET for testing permissions
export async function GET(request: NextRequest) {
  try {
    const mockUserData = {
      roles: ['Employer Recruiter'],
      permissions: [
        'create_job_posting',
        'view_candidates',
        'manage_pipeline',
        'schedule_interviews',
        'view_analytics',
        'export_reports'
      ]
    };
    
    // Check if user has permission to view job postings
    if (!hasPermission(mockUserData.permissions, 'create_job_posting')) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions',
          message: 'This action requires the create_job_posting permission.',
          userPermissions: mockUserData.permissions,
          requiredPermission: 'create_job_posting'
        },
        { status: 403 }
      );
    }
    
    // Return list of job postings
    return NextResponse.json({
      success: true,
      message: '📋 Job postings retrieved successfully!',
      data: {
        jobPostings: [
          {
            id: 'job_001',
            title: 'Senior React Developer',
            department: 'Engineering',
            status: 'Active',
            candidates: 12
          },
          {
            id: 'job_002',
            title: 'UX Designer',
            department: 'Design',
            status: 'Active',
            candidates: 8
          }
        ],
        userRole: mockUserData.roles[0],
        permissions: mockUserData.permissions
      }
    });
    
  } catch (error) {
    console.error('Error in create-job GET endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 