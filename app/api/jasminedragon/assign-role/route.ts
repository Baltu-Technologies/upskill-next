import { NextResponse } from 'next/server';
import { UserRolesService } from '../../../../lib/db/user-roles-service';
import { getCurrentUserWithRoles } from '../../../../lib/auth/role-helpers';

export async function POST(request: Request) {
  try {
    // Check if the current user has admin privileges
    const session = await getCurrentUserWithRoles();
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, role, platform } = await request.json();

    if (!userId || !role || !platform) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, role, platform' 
      }, { status: 400 });
    }

    if (platform === 'learner') {
      // Assign role in BetterAuth system
      await UserRolesService.assignRole(userId, role, session.user.id);
      
      return NextResponse.json({ 
        message: `Role '${role}' assigned to learner user successfully` 
      });
    } else if (platform === 'employer') {
      // Assign role in Auth0 system
      // This would require Auth0 Management API integration
      // For now, we'll return a placeholder response
      return NextResponse.json({ 
        message: `Auth0 role assignment not yet implemented for role '${role}'` 
      });
    } else {
      return NextResponse.json({ 
        error: 'Invalid platform. Must be "learner" or "employer"' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json({ 
      error: 'Failed to assign role' 
    }, { status: 500 });
  }
} 