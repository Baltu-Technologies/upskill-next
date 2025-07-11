/**
 * Form Validation Utilities for Role Management
 * 
 * Provides form-specific validation helpers that integrate with the role validation system
 * and support React forms, input validation, and user feedback.
 */

import { UserRole } from '../auth/role-helpers';
import { UserRolesService } from '../db/user-roles-service';

// Helper functions
const isValidRole = (role: string): role is UserRole => {
  const validRoles = Object.keys(UserRolesService.getRoleHierarchy()) as UserRole[];
  return validRoles.includes(role as UserRole);
};
import { 
  validateRoleAssignment, 
  validateBulkRoleAssignment,
  validateUIState,
  ValidationResult,
  VALIDATION_ERRORS 
} from './roleValidation';

// Form field validation results
export interface FieldValidation {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
}

// Email validation for role assignment forms
export function validateEmail(email: string): FieldValidation {
  if (!email.trim()) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
}

// Role selection validation
export function validateRoleSelection(role: string): FieldValidation {
  if (!role) {
    return {
      isValid: false,
      error: 'Please select a role'
    };
  }

  if (!isValidRole(role)) {
    return {
      isValid: false,
      error: 'Invalid role selected'
    };
  }

  return { isValid: true };
}

// Reason/comment validation
export function validateReason(reason: string, isRequired: boolean = false): FieldValidation {
  if (isRequired && !reason.trim()) {
    return {
      isValid: false,
      error: 'Reason is required for this operation'
    };
  }

  if (reason.length > 500) {
    return {
      isValid: false,
      error: 'Reason must be 500 characters or less'
    };
  }

  return { isValid: true };
}

// Bulk user selection validation
export function validateUserSelection(
  selectedUserIds: string[],
  minUsers: number = 1,
  maxUsers: number = 50
): FieldValidation {
  if (selectedUserIds.length < minUsers) {
    return {
      isValid: false,
      error: `Please select at least ${minUsers} user${minUsers === 1 ? '' : 's'}`
    };
  }

  if (selectedUserIds.length > maxUsers) {
    return {
      isValid: false,
      error: `Cannot select more than ${maxUsers} users at once`
    };
  }

  return { isValid: true };
}

// Search query validation
export function validateSearchQuery(query: string): FieldValidation {
  if (query.length > 0 && query.length < 2) {
    return {
      isValid: false,
      error: 'Search query must be at least 2 characters'
    };
  }

  if (query.length > 100) {
    return {
      isValid: false,
      error: 'Search query must be 100 characters or less'
    };
  }

  return { isValid: true };
}

// Form-level validation for role assignment
export function validateRoleAssignmentForm(
  formData: {
    targetRole: string;
    reason?: string;
    selectedUsers: Array<{ id: string; role: UserRole; email?: string }>;
  },
  currentUser: { id: string; role: UserRole } | null,
  options: {
    requireReason?: boolean;
    maxUsers?: number;
  } = {}
): FormValidationState {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Validate role selection
  const roleValidation = validateRoleSelection(formData.targetRole);
  if (!roleValidation.isValid) {
    errors.targetRole = roleValidation.error!;
  }

  // Validate user selection
  const userSelectionValidation = validateUserSelection(
    formData.selectedUsers.map(u => u.id),
    1,
    options.maxUsers
  );
  if (!userSelectionValidation.isValid) {
    errors.selectedUsers = userSelectionValidation.error!;
  }

  // Validate reason if required
  if (options.requireReason || formData.reason) {
    const reasonValidation = validateReason(formData.reason || '', options.requireReason);
    if (!reasonValidation.isValid) {
      errors.reason = reasonValidation.error!;
    }
  }

  // Validate UI state for role assignments
  if (Object.keys(errors).length === 0 && isValidRole(formData.targetRole)) {
    const uiStateValidation = validateUIState(
      formData.selectedUsers,
      formData.targetRole as UserRole,
      currentUser
    );

    if (!uiStateValidation.canProceed) {
      uiStateValidation.errors.forEach((error, index) => {
        errors[`validation_${index}`] = error;
      });
    }

    uiStateValidation.warnings.forEach((warning, index) => {
      warnings[`validation_${index}`] = warning;
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    touched: {}, // This would be managed by the form component
    isDirty: true
  };
}

// Form-level validation for bulk role assignment
export function validateBulkRoleAssignmentForm(
  formData: {
    sourceRole?: string;
    targetRole: string;
    reason?: string;
    userIds: string[];
  },
  users: Array<{ id: string; role: UserRole; email?: string }>,
  currentUser: { id: string; role: UserRole } | null
): FormValidationState {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Validate target role
  const roleValidation = validateRoleSelection(formData.targetRole);
  if (!roleValidation.isValid) {
    errors.targetRole = roleValidation.error!;
  }

  // Validate user selection
  const userSelectionValidation = validateUserSelection(formData.userIds);
  if (!userSelectionValidation.isValid) {
    errors.userIds = userSelectionValidation.error!;
  }

  // Validate reason
  const reasonValidation = validateReason(formData.reason || '');
  if (!reasonValidation.isValid) {
    errors.reason = reasonValidation.error!;
  }

  // Validate bulk assignment if basic validation passes
  if (Object.keys(errors).length === 0 && isValidRole(formData.targetRole)) {
    const selectedUsers = users.filter(user => formData.userIds.includes(user.id));
    const assignments = selectedUsers.map(user => ({
      userId: user.id,
      role: formData.targetRole as UserRole,
      currentRole: user.role,
      email: user.email
    }));

    const bulkValidation = validateBulkRoleAssignment(
      currentUser,
      assignments,
      formData.reason
    );

    if (!bulkValidation.overall.isValid) {
      errors.bulk = bulkValidation.overall.error!;
    }

    if (bulkValidation.overall.warning) {
      warnings.bulk = bulkValidation.overall.warning;
    }

    // Add individual validation errors
    bulkValidation.individual.forEach((item, index) => {
      if (!item.validation.isValid) {
        errors[`user_${item.userId}`] = item.validation.error!;
      }
      if (item.validation.warning) {
        warnings[`user_${item.userId}`] = item.validation.warning;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    touched: {},
    isDirty: true
  };
}

// Helper to create field validation function for React forms
export function createFieldValidator<T>(
  validator: (value: T) => FieldValidation,
  deps: any[] = []
) {
  return (value: T) => {
    const result = validator(value);
    return result.isValid ? undefined : result.error;
  };
}

// Real-time validation helpers for form fields
export const fieldValidators = {
  email: createFieldValidator(validateEmail),
  role: createFieldValidator(validateRoleSelection),
  reason: createFieldValidator((value: string) => validateReason(value, false)),
  requiredReason: createFieldValidator((value: string) => validateReason(value, true)),
  searchQuery: createFieldValidator(validateSearchQuery),
  userSelection: createFieldValidator((value: string[]) => validateUserSelection(value))
};

// Form submission validation wrapper
export function withFormValidation<T extends Record<string, any>>(
  validator: (data: T) => FormValidationState,
  onSubmit: (data: T) => void | Promise<void>
) {
  return async (data: T) => {
    const validation = validator(data);
    
    if (!validation.isValid) {
      // Return validation errors for form to handle
      throw new Error(Object.values(validation.errors)[0] || 'Form validation failed');
    }

    return onSubmit(data);
  };
}

// Debounced validation for real-time feedback
export function createDebouncedValidator<T>(
  validator: (value: T) => FieldValidation,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (value: T, callback: (result: FieldValidation) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validator(value);
      callback(result);
    }, delay);
  };
}

// Form state helpers
export function createFormValidationState(): FormValidationState {
  return {
    isValid: true,
    errors: {},
    warnings: {},
    touched: {},
    isDirty: false
  };
}

export function updateFormValidationState(
  currentState: FormValidationState,
  field: string,
  validation: FieldValidation,
  touched: boolean = true
): FormValidationState {
  const newErrors = { ...currentState.errors };
  const newWarnings = { ...currentState.warnings };
  const newTouched = { ...currentState.touched, [field]: touched };

  if (validation.isValid) {
    delete newErrors[field];
    if (validation.warning) {
      newWarnings[field] = validation.warning;
    } else {
      delete newWarnings[field];
    }
  } else {
    newErrors[field] = validation.error!;
    delete newWarnings[field];
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
    warnings: newWarnings,
    touched: newTouched,
    isDirty: true
  };
}

// Helper to get user-friendly error messages
export function getFormErrorMessage(
  validationState: FormValidationState,
  field?: string
): string {
  if (field && validationState.errors[field]) {
    return validationState.errors[field];
  }

  const firstError = Object.values(validationState.errors)[0];
  return firstError || '';
}

// Helper to check if form can be submitted
export function canSubmitForm(
  validationState: FormValidationState,
  requiresDirty: boolean = true
): boolean {
  return validationState.isValid && (!requiresDirty || validationState.isDirty);
} 