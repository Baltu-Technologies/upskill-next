import { Pool } from 'pg';

// Types for user roles
export type UserRole = 'admin' | 'guide' | 'content_creator' | 'learner';

export interface UserRoleData {
  id: number;
  user_id: string;
  role: UserRole;
  granted_at: Date;
  granted_by: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: number;
  user_id: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithRoles {
  id: string;
  email: string;
  name: string;
  image?: string;
  email_verified: boolean;
  roles: UserRole[];
  profile?: UserProfile;
  created_at: Date;
  updated_at: Date;
}

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  admin: [
    'home',
    'courses',
    'career_opportunities', 
    'course_test',
    'guide_access',
    'course_creator',
    'profile',
    'settings',
    'admin'
  ],
  guide: [
    'home',
    'courses',
    'career_opportunities',
    'guide_access',
    'profile'
  ],
  content_creator: [
    'home',
    'courses',
    'career_opportunities',
    'course_creator',
    'profile'
  ],
  learner: [
    'home',
    'courses',
    'career_opportunities',
    'profile'
  ]
} as const;

// Database connection (should use your existing auth DB pool)
let pool: Pool;

export function initializeUserRolesService(authPool: Pool) {
  pool = authPool;
}

export class UserRolesService {
  /**
   * Get user roles by user ID
   */
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    const result = await pool.query(
      'SELECT get_user_roles($1) as roles',
      [userId]
    );
    return result.rows[0]?.roles || [];
  }

  /**
   * Check if user has specific role
   */
  static async userHasRole(userId: string, role: UserRole): Promise<boolean> {
    const result = await pool.query(
      'SELECT user_has_role($1, $2) as has_role',
      [userId, role]
    );
    return result.rows[0]?.has_role || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  static async userHasAnyRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Assign role to user
   */
  static async assignRole(
    userId: string, 
    role: UserRole, 
    grantedBy?: string
  ): Promise<void> {
    await pool.query(
      'SELECT assign_user_role($1, $2, $3)',
      [userId, role, grantedBy || null]
    );
  }

  /**
   * Revoke role from user
   */
  static async revokeRole(userId: string, role: UserRole): Promise<void> {
    await pool.query(
      'SELECT revoke_user_role($1, $2)',
      [userId, role]
    );
  }

  /**
   * Get user with roles and profile
   */
  static async getUserWithRoles(userId: string): Promise<UserWithRoles | null> {
    const client = await pool.connect();
    try {
      // Get user basic info
      const userResult = await client.query(
        'SELECT id, email, name, image, email_verified, created_at, updated_at FROM "user" WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return null;
      }

      const user = userResult.rows[0];

      // Get user roles
      const roles = await this.getUserRoles(userId);

      // Get user profile
      const profileResult = await client.query(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [userId]
      );

      const profile = profileResult.rows[0] || null;

      return {
        ...user,
        roles,
        profile
      };
    } finally {
      client.release();
    }
  }

  /**
   * Get all users with their roles (admin function)
   */
  static async getAllUsersWithRoles(): Promise<UserWithRoles[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          u.id, u.email, u.name, u.image, u.email_verified, u.created_at, u.updated_at,
          COALESCE(
            ARRAY_AGG(ur.role ORDER BY ur.role) FILTER (WHERE ur.role IS NOT NULL AND ur.is_active = true), 
            ARRAY[]::varchar[]
          ) as roles,
          row_to_json(up.*) as profile
        FROM "user" u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN user_profiles up ON u.id = up.user_id
        GROUP BY u.id, up.id
        ORDER BY u.created_at DESC
      `);

      return result.rows.map(row => ({
        ...row,
        profile: row.profile ? JSON.parse(row.profile) : null
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get or create user profile
   */
  static async getOrCreateUserProfile(
    userId: string,
    firstName?: string,
    lastName?: string
  ): Promise<UserProfile> {
    const result = await pool.query(
      'SELECT * FROM get_or_create_user_profile($1, $2, $3)',
      [userId, firstName || null, lastName || null]
    );
    return result.rows[0];
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<UserProfile> {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        setParts.push(`${key} = $${paramIndex++}`);
        values.push(key === 'preferences' ? JSON.stringify(value) : value);
      }
    });

    if (setParts.length === 0) {
      // No updates, just return existing profile
      const result = await pool.query(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [userId]
      );
      return result.rows[0];
    }

    values.push(userId);
    const result = await pool.query(
      `UPDATE user_profiles 
       SET ${setParts.join(', ')}, updated_at = NOW()
       WHERE user_id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Get user permissions based on roles
   */
  static async getUserPermissions(userId: string): Promise<string[]> {
    const roles = await this.getUserRoles(userId);
    const permissions = new Set<string>();

    roles.forEach(role => {
      ROLE_PERMISSIONS[role].forEach(permission => {
        permissions.add(permission);
      });
    });

    return Array.from(permissions);
  }

  /**
   * Check if user has specific permission
   */
  static async userHasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: UserRole): Promise<UserWithRoles[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          u.id, u.email, u.name, u.image, u.email_verified, u.created_at, u.updated_at,
          COALESCE(
            ARRAY_AGG(ur2.role ORDER BY ur2.role) FILTER (WHERE ur2.role IS NOT NULL AND ur2.is_active = true), 
            ARRAY[]::varchar[]
          ) as roles,
          row_to_json(up.*) as profile
        FROM "user" u
        INNER JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN user_roles ur2 ON u.id = ur2.user_id
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE ur.role = $1 AND ur.is_active = true
        GROUP BY u.id, up.id
        ORDER BY u.created_at DESC
      `, [role]);

      return result.rows.map(row => ({
        ...row,
        profile: row.profile ? JSON.parse(row.profile) : null
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Assign default role to new user
   */
  static async assignDefaultRole(userId: string): Promise<void> {
    await this.assignRole(userId, 'learner', 'system');
  }

  /**
   * Get role hierarchy (for admin functions)
   */
  static getRoleHierarchy(): Record<UserRole, number> {
    return {
      admin: 4,
      guide: 3,
      content_creator: 2,
      learner: 1
    };
  }

  /**
   * Check if user can manage another user's roles
   */
  static async canManageUserRoles(managerId: string, targetUserId: string): Promise<boolean> {
    const managerRoles = await this.getUserRoles(managerId);
    const targetRoles = await this.getUserRoles(targetUserId);
    
    const hierarchy = this.getRoleHierarchy();
    const managerLevel = Math.max(...managerRoles.map(role => hierarchy[role]));
    const targetLevel = Math.max(...targetRoles.map(role => hierarchy[role]));
    
    return managerLevel > targetLevel;
  }
}

// Export for convenience
export const {
  getUserRoles,
  userHasRole,
  userHasAnyRole,
  assignRole,
  revokeRole,
  getUserWithRoles,
  getAllUsersWithRoles,
  getOrCreateUserProfile,
  updateUserProfile,
  getUserPermissions,
  userHasPermission,
  getUsersByRole,
  assignDefaultRole,
  canManageUserRoles
} = UserRolesService; 