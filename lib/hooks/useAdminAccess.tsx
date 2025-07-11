'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, hasMinimumRole } from '../auth/role-helpers';

// Types
export interface CurrentUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAccessState {
  user: CurrentUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Hook for admin access control
export function useAdminAccess() {
  const [state, setState] = useState<AdminAccessState>({
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Fetch current session and validate admin access
  const checkAdminAccess = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Get current session from BetterAuth
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });

      if (!response.ok) {
        // If session endpoint fails, user is not authenticated
        setState({
          user: null,
          isAdmin: false,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        return;
      }

      const sessionData = await response.json();

      if (!sessionData.user) {
        // No user in session
        setState({
          user: null,
          isAdmin: false,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        return;
      }

      const user: CurrentUser = {
        id: sessionData.user.id,
        email: sessionData.user.email,
        firstName: sessionData.user.firstName,
        lastName: sessionData.user.lastName,
        role: sessionData.user.role || 'learner',
        emailVerified: sessionData.user.emailVerified || false,
        createdAt: sessionData.user.createdAt,
        updatedAt: sessionData.user.updatedAt
      };

      // Check if user has admin privileges
      const isAdmin = hasMinimumRole(user.role, 'admin');

      setState({
        user,
        isAdmin,
        isAuthenticated: true,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error checking admin access:', error);
      setState({
        user: null,
        isAdmin: false,
        isAuthenticated: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check authentication'
      });
    }
  }, []);

  // Check access on component mount
  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  // Refresh session data
  const refresh = useCallback(() => {
    return checkAdminAccess();
  }, [checkAdminAccess]);

  // Check if user has specific minimum role
  const hasMinRole = useCallback((minRole: UserRole): boolean => {
    if (!state.user) return false;
    return hasMinimumRole(state.user.role, minRole);
  }, [state.user]);

  // Check if user can access admin features
  const canAccessAdminFeatures = useCallback((): boolean => {
    return state.isAuthenticated && state.isAdmin;
  }, [state.isAuthenticated, state.isAdmin]);

  // Check if user can manage roles
  const canManageRoles = useCallback((): boolean => {
    return hasMinRole('admin');
  }, [hasMinRole]);

  // Check if user can perform bulk operations
  const canPerformBulkOperations = useCallback((): boolean => {
    return hasMinRole('admin');
  }, [hasMinRole]);

  // Check if user can assign specific role
  const canAssignRole = useCallback((targetRole: UserRole): boolean => {
    if (!state.user || !state.isAdmin) return false;
    
    // Admins can assign any role except preventing self-demotion
    return true;
  }, [state.user, state.isAdmin]);

  // Check if role assignment is valid (business rules)
  const isValidRoleAssignment = useCallback((
    targetUserId: string, 
    currentRole: UserRole, 
    newRole: UserRole
  ): { valid: boolean; reason?: string } => {
    if (!state.user || !state.isAdmin) {
      return { valid: false, reason: 'Admin privileges required' };
    }

    // Prevent self-demotion from admin
    if (targetUserId === state.user.id && currentRole === 'admin' && newRole !== 'admin') {
      return { valid: false, reason: 'Cannot demote yourself from admin role' };
    }

    // Role is the same
    if (currentRole === newRole) {
      return { valid: false, reason: 'User already has this role' };
    }

    return { valid: true };
  }, [state.user, state.isAdmin]);

  return {
    // Current state
    user: state.user,
    isAdmin: state.isAdmin,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,

    // Actions
    refresh,

    // Permission checks
    hasMinRole,
    canAccessAdminFeatures,
    canManageRoles,
    canPerformBulkOperations,
    canAssignRole,
    isValidRoleAssignment
  };
}

// Hook for protecting admin-only components
export function useRequireAdmin() {
  const adminAccess = useAdminAccess();

  useEffect(() => {
    if (!adminAccess.loading && !adminAccess.canAccessAdminFeatures()) {
      // Redirect or show error for non-admin users
      console.warn('Admin access required');
    }
  }, [adminAccess.loading, adminAccess.canAccessAdminFeatures]);

  return {
    ...adminAccess,
    isAuthorized: adminAccess.canAccessAdminFeatures()
  };
}

// Hook for role-based UI rendering
export function useRoleBasedUI() {
  const adminAccess = useAdminAccess();

  // Show component only for specific roles
  const showForRoles = useCallback((allowedRoles: UserRole[]): boolean => {
    if (!adminAccess.user) return false;
    return allowedRoles.includes(adminAccess.user.role);
  }, [adminAccess.user]);

  // Show component only for minimum role level
  const showForMinRole = useCallback((minRole: UserRole): boolean => {
    return adminAccess.hasMinRole(minRole);
  }, [adminAccess.hasMinRole]);

  // Show component only for admin
  const showForAdmin = useCallback((): boolean => {
    return adminAccess.isAdmin;
  }, [adminAccess.isAdmin]);

  return {
    user: adminAccess.user,
    isAuthenticated: adminAccess.isAuthenticated,
    loading: adminAccess.loading,
    showForRoles,
    showForMinRole,
    showForAdmin
  };
}

// Admin access validation component
export function AdminAccessGuard({ children }: { children: React.ReactNode }) {
  const { isAuthorized, loading, error } = useRequireAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Checking permissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">Authentication Error</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-8 text-center">
        <div className="text-orange-600 mb-4">Access Restricted</div>
        <p className="text-gray-600">Admin privileges required to access this feature.</p>
      </div>
    );
  }

  return <>{children}</>;
} 