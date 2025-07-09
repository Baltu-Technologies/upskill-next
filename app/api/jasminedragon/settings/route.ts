import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { currentUserHasRole } from '@/lib/auth/role-helpers';

// Default settings
const defaultSettings = {
  general: {
    siteName: 'Upskill Platform',
    siteDescription: 'A comprehensive learning platform for skill development',
    contactEmail: 'admin@upskillplatform.com',
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'learner'
  },
  security: {
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 720, // 12 hours
    maxLoginAttempts: 5,
    enableTwoFactor: false
  },
  notifications: {
    emailNotifications: true,
    welcomeEmails: true,
    digestEmails: false,
    systemAlerts: true
  },
  features: {
    enableCourses: true,
    enableCareerCenter: true,
    enableGuideAccess: true,
    enableContentCreation: true,
    enableAnalytics: true
  }
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await currentUserHasRole('admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Return default settings for now
    // In a real application, you would fetch these from a database
    return NextResponse.json(defaultSettings);

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await currentUserHasRole('admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await request.json();
    
    // Validate settings structure
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings format' },
        { status: 400 }
      );
    }

    // Here you would save to database
    // For now, we'll just return success
    console.log('Settings would be saved:', settings);

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully' 
    });

  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 