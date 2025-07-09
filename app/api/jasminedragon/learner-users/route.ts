import { NextResponse } from 'next/server';
import { UserRolesService } from '../../../../lib/db/user-roles-service';
import { getCurrentUserWithRoles } from '../../../../lib/auth/role-helpers';

export async function GET() {
  try {
    // Check if the current user has admin privileges
    const session = await getCurrentUserWithRoles();
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all learner users with their roles using the static method
    const users = await UserRolesService.getAllUsersWithRoles();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching learner users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch learner users' 
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

    const { email, name, role = 'learner' } = await request.json();

    // Initialize the roles service
    const rolesService = new UserRolesService();
    
    // Create a new user (this would need to be implemented in UserRolesService)
    // For now, we'll just return a success message
    return NextResponse.json({ 
      message: 'User creation endpoint ready - implement user creation logic' 
    });
  } catch (error) {
    console.error('Error creating learner user:', error);
    return NextResponse.json({ 
      error: 'Failed to create learner user' 
    }, { status: 500 });
  }
} 