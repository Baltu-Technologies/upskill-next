/**
 * Frontend Role Validation Utilities
 * 
 * Provides client-side validation for role assignments and UI constraints.
 * Works in conjunction with backend validation to provide immediate feedback
 * and prevent invalid operations from reaching the server.
 */

import { UserRole, hasMinimumRole } from '../auth/role-helpers';
import { UserRolesService } from '../db/user-roles-service';

// Helper functions
const isValidRole = (role: string): role is UserRole => {
  const validRoles = Object.keys(UserRolesService.getRoleHierarchy()) as UserRole[];
  return validRoles.includes(role as UserRole);
};

const getRoleLevel = (role: UserRole): number => {
  return UserRolesService.getRoleHierarchy()[role];
};

// Types for validation results
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  code?: string;
}

export interface RoleAssignmentValidation extends ValidationResult {
  canProceed: boolean;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface BulkAssignmentValidation {
  overall: ValidationResult;
  individual: Array<{
    userId: string;
    validation: RoleAssignmentValidation;
  }>;
  summary: {
    valid: number;
    invalid: number;
    warnings: number;
  };
}

// Error codes for consistent error handling
export const VALIDATION_ERRORS = {
  ADMIN_REQUIRED: 'ADMIN_REQUIRED',
  SELF_DEMOTION: 'SELF_DEMOTION',
  INVALID_ROLE: 'INVALID_ROLE',
  SAME_ROLE: 'SAME_ROLE',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  BULK_LIMIT_EXCEEDED: 'BULK_LIMIT_EXCEEDED',
  INVALID_ROLE_TRANSITION: 'INVALID_ROLE_TRANSITION'
} as const;

// Configuration
const MAX_BULK_OPERATIONS = 50;

/**
 * Validates if a user can perform admin operations
 */
export function validateAdminAccess(
  currentUser: { id: string; role: UserRole } | null
): ValidationResult {
  if (!currentUser) {
    return {
      isValid: false,
      error: 'Authentication required to access admin features',
      code: VALIDATION_ERRORS.ADMIN_REQUIRED
    };
  }

  if (!hasMinimumRole(currentUser.role, 'admin')) {
    return {
      isValid: false,
      error: 'Admin privileges required for this operation',
      code: VALIDATION_ERRORS.INSUFFICIENT_PERMISSIONS
    };
  }

  return { isValid: true };
}

/**
 * Validates a single role assignment
 */
export function validateRoleAssignment(
  currentUser: { id: string; role: UserRole } | null,
  targetUser: { id: string; role: UserRole; email?: string },
  newRole: UserRole,
  reason?: string
): RoleAssignmentValidation {
  // Check admin access first
  const adminCheck = validateAdminAccess(currentUser);
  if (!adminCheck.isValid) {
    return {
      ...adminCheck,
      canProceed: false
    };
  }

  // Validate the new role
  if (!isValidRole(newRole)) {
    return {
      isValid: false,
      canProceed: false,
      error: `Invalid role: ${newRole}`,
      code: VALIDATION_ERRORS.INVALID_ROLE
    };
  }

  // Check if role is actually changing
  if (targetUser.role === newRole) {
    return {
      isValid: false,
      canProceed: false,
      error: `User already has the ${newRole} role`,
      code: VALIDATION_ERRORS.SAME_ROLE
    };
  }

  // Prevent self-demotion from admin role
  if (currentUser!.id === targetUser.id && 
      targetUser.role === 'admin' && 
      newRole !== 'admin') {
    return {
      isValid: false,
      canProceed: false,
      error: 'You cannot demote yourself from admin role',
      code: VALIDATION_ERRORS.SELF_DEMOTION
    };
  }

  // Check for potentially risky role transitions
  const riskWarnings = checkRoleTransitionRisks(targetUser.role, newRole, targetUser.email);
  
  if (riskWarnings.length > 0) {
    return {
      isValid: true,
      canProceed: true,
      requiresConfirmation: true,
      warning: riskWarnings.join('. '),
      confirmationMessage: `Are you sure you want to change ${targetUser.email || targetUser.id} from ${targetUser.role} to ${newRole}?`
    };
  }

  return {
    isValid: true,
    canProceed: true
  };
}

/**
 * Validates bulk role assignments
 */
export function validateBulkRoleAssignment(
  currentUser: { id: string; role: UserRole } | null,
  assignments: Array<{ userId: string; role: UserRole; currentRole?: UserRole; email?: string }>,
  reason?: string
): BulkAssignmentValidation {
  // Check admin access
  const adminCheck = validateAdminAccess(currentUser);
  if (!adminCheck.isValid) {
    return {
      overall: adminCheck,
      individual: [],
      summary: { valid: 0, invalid: assignments.length, warnings: 0 }
    };
  }

  // Check bulk operation limits
  if (assignments.length > MAX_BULK_OPERATIONS) {
    return {
      overall: {
        isValid: false,
        error: `Bulk operations are limited to ${MAX_BULK_OPERATIONS} users at a time`,
        code: VALIDATION_ERRORS.BULK_LIMIT_EXCEEDED
      },
      individual: [],
      summary: { valid: 0, invalid: assignments.length, warnings: 0 }
    };
  }

  // Validate each individual assignment
  const individual = assignments.map(assignment => {
    const targetUser = {
      id: assignment.userId,
      role: assignment.currentRole || 'learner',
      email: assignment.email
    };

    const validation = validateRoleAssignment(
      currentUser,
      targetUser,
      assignment.role,
      reason
    );

    return {
      userId: assignment.userId,
      validation
    };
  });

  // Calculate summary
  const summary = individual.reduce(
    (acc, item) => {
      if (item.validation.isValid) {
        acc.valid++;
        if (item.validation.warning) {
          acc.warnings++;
        }
      } else {
        acc.invalid++;
      }
      return acc;
    },
    { valid: 0, invalid: 0, warnings: 0 }
  );

  // Overall result
  const overall: ValidationResult = summary.invalid === 0
    ? { isValid: true }
    : {
        isValid: false,
        error: `${summary.invalid} assignments are invalid and cannot be processed`,
        warning: summary.warnings > 0 ? `${summary.warnings} assignments have warnings` : undefined
      };

  return {
    overall,
    individual,
    summary
  };
}

/**
 * Check for risky role transitions that should show warnings
 */
function checkRoleTransitionRisks(
  currentRole: UserRole,
  newRole: UserRole,
  email?: string
): string[] {
  const warnings: string[] = [];

  // Promoting to admin
  if (newRole === 'admin' && currentRole !== 'admin') {
    warnings.push('Promoting user to admin grants full system access');
  }

  // Demoting from admin
  if (currentRole === 'admin' && newRole !== 'admin') {
    warnings.push('Demoting from admin will remove all administrative privileges');
  }

  // Role level changes (major jumps)
  const currentLevel = getRoleLevel(currentRole);
  const newLevel = getRoleLevel(newRole);
  const levelDifference = Math.abs(newLevel - currentLevel);

  if (levelDifference > 1) {
    warnings.push(`This is a significant role change (level ${currentLevel} to ${newLevel})`);
  }

  return warnings;
}

/**
 * Validates role assignment constraints based on business rules
 */
export function validateRoleConstraints(
  currentRole: UserRole,
  newRole: UserRole,
  context?: {
    userCount?: number;
    hasEmailVerified?: boolean;
    accountAge?: number; // days
  }
): ValidationResult {
  // Basic role transition validation
  if (!isValidRole(newRole)) {
    return {
      isValid: false,
      error: `Invalid target role: ${newRole}`,
      code: VALIDATION_ERRORS.INVALID_ROLE
    };
  }

  // Business rule: Maybe require email verification for certain roles
  if (context?.hasEmailVerified === false && ['admin', 'content_creator'].includes(newRole)) {
    return {
      isValid: false,
      error: 'Email verification required for elevated roles',
      code: VALIDATION_ERRORS.INVALID_ROLE_TRANSITION
    };
  }

  // Business rule: Account age requirements (example)
  if (context?.accountAge !== undefined && context.accountAge < 7 && newRole === 'admin') {
    return {
      isValid: false,
      error: 'Account must be at least 7 days old for admin role',
      code: VALIDATION_ERRORS.INVALID_ROLE_TRANSITION
    };
  }

  return { isValid: true };
}

/**
 * Formats validation errors for user display
 */
export function formatValidationError(validation: ValidationResult): string {
  if (validation.isValid) return '';

  const baseError = validation.error || 'Validation failed';
  
  // Add helpful suggestions based on error codes
  switch (validation.code) {
    case VALIDATION_ERRORS.ADMIN_REQUIRED:
      return `${baseError}. Please sign in with an admin account.`;
    
    case VALIDATION_ERRORS.SELF_DEMOTION:
      return `${baseError}. Ask another admin to change your role if needed.`;
    
    case VALIDATION_ERRORS.SAME_ROLE:
      return `${baseError}. Select a different role to make changes.`;
    
    case VALIDATION_ERRORS.BULK_LIMIT_EXCEEDED:
      return `${baseError}. Process users in smaller batches.`;
    
    default:
      return baseError;
  }
}

/**
 * Generates audit trail information for role changes
 */
export function generateAuditInfo(
  currentUser: { id: string; email?: string; role: UserRole },
  targetUser: { id: string; email?: string; role: UserRole },
  newRole: UserRole,
  reason?: string
): {
  action: string;
  performedBy: string;
  targetUser: string;
  changes: {
    field: string;
    from: string;
    to: string;
  }[];
  reason?: string;
  timestamp: string;
  metadata: Record<string, any>;
} {
  return {
    action: 'role_assignment',
    performedBy: currentUser.email || currentUser.id,
    targetUser: targetUser.email || targetUser.id,
    changes: [
      {
        field: 'role',
        from: targetUser.role,
        to: newRole
      }
    ],
    reason,
    timestamp: new Date().toISOString(),
    metadata: {
      performedById: currentUser.id,
      performedByRole: currentUser.role,
      targetUserId: targetUser.id,
      previousRole: targetUser.role,
      newRole: newRole
    }
  };
}

/**
 * Helper to validate UI state for role management components
 */
export function validateUIState(
  selectedUsers: Array<{ id: string; role: UserRole; email?: string }>,
  targetRole: UserRole,
  currentUser: { id: string; role: UserRole } | null
): {
  canProceed: boolean;
  errors: string[];
  warnings: string[];
  confirmationRequired: boolean;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  let confirmationRequired = false;

  // Check admin access
  const adminCheck = validateAdminAccess(currentUser);
  if (!adminCheck.isValid) {
    errors.push(formatValidationError(adminCheck));
  }

  // Check if any users are selected
  if (selectedUsers.length === 0) {
    errors.push('Please select at least one user');
  }

  // Check bulk limit
  if (selectedUsers.length > MAX_BULK_OPERATIONS) {
    errors.push(`Too many users selected (max: ${MAX_BULK_OPERATIONS})`);
  }

  // Validate each selected user
  selectedUsers.forEach(user => {
    const validation = validateRoleAssignment(currentUser, user, targetRole);
    
    if (!validation.isValid) {
      errors.push(`${user.email || user.id}: ${validation.error}`);
    } else if (validation.warning) {
      warnings.push(`${user.email || user.id}: ${validation.warning}`);
    }
    
    if (validation.requiresConfirmation) {
      confirmationRequired = true;
    }
  });

  return {
    canProceed: errors.length === 0,
    errors,
    warnings,
    confirmationRequired
  };
}

/**
 * Helper to check if a role assignment operation should show a warning
 */
export function shouldShowRoleAssignmentWarning(
  currentRole: UserRole,
  newRole: UserRole,
  userEmail?: string
): { shouldWarn: boolean; message?: string } {
  const risks = checkRoleTransitionRisks(currentRole, newRole, userEmail);
  
  if (risks.length > 0) {
    return {
      shouldWarn: true,
      message: `Warning: ${risks.join('. ')}. Are you sure you want to proceed?`
    };
  }

  return { shouldWarn: false };
} 