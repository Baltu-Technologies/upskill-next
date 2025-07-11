'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserRole } from '../auth/role-helpers';

// Types
export interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListOptions {
  limit?: number;
  offset?: number;
  role?: UserRole;
  search?: string;
  sortBy?: 'email' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface RoleStats {
  learner: number;
  guide: number;
  admin: number;
  content_creator: number;
  total: number;
}

export interface RoleAssignmentResult {
  success: boolean;
  userId: string;
  previousRole: UserRole;
  newRole: UserRole;
  assignedBy: string;
  timestamp: Date;
  error?: string;
}

export interface BulkAssignmentResult {
  userId: string;
  success: boolean;
  previousRole: UserRole;
  newRole: UserRole;
  error?: string;
}

// Hook for fetching and managing user lists
export function useUsers(options: UserListOptions = {}) {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (newOptions: UserListOptions = {}, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const mergedOptions = { ...options, ...newOptions };
      const params = new URLSearchParams();

      if (mergedOptions.limit) params.append('limit', mergedOptions.limit.toString());
      if (mergedOptions.offset) params.append('offset', mergedOptions.offset.toString());
      if (mergedOptions.role) params.append('role', mergedOptions.role);
      if (mergedOptions.search) params.append('search', mergedOptions.search);
      if (mergedOptions.sortBy) params.append('sortBy', mergedOptions.sortBy);
      if (mergedOptions.sortOrder) params.append('sortOrder', mergedOptions.sortOrder);

      const response = await fetch(`/api/auth/admin/users?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();

      if (append) {
        setUsers(prev => [...prev, ...data.users]);
      } else {
        setUsers(data.users);
      }

      setHasMore(data.hasMore);
      setTotal(data.total);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [options]);

  const searchUsers = useCallback(async (searchTerm: string, limit: number = 10) => {
    return fetchUsers({ search: searchTerm, limit });
  }, [fetchUsers]);

  const refetch = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    hasMore,
    total,
    fetchUsers,
    searchUsers,
    refetch
  };
}

// Hook for role statistics
export function useRoleStats() {
  const [stats, setStats] = useState<RoleStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getRoleStats' }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch role statistics');
      }

      const data = await response.json();
      setStats(data.stats);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch role statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

// Hook for individual role assignment
export function useRoleAssignment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const assignRole = useCallback(async (
    userId: string,
    newRole: UserRole,
    reason?: string
  ): Promise<RoleAssignmentResult | null> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/auth/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, reason }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role');
      }

      const data = await response.json();
      setSuccess(data.message);
      
      return data.result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    assignRole,
    loading,
    error,
    success,
    clearMessages
  };
}

// Hook for bulk role assignment
export function useBulkRoleAssignment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [results, setResults] = useState<BulkAssignmentResult[] | null>(null);

  const bulkAssignRoles = useCallback(async (
    assignments: Array<{ userId: string; role: UserRole }>,
    reason?: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setResults(null);

    try {
      const response = await fetch('/api/auth/admin/users/bulk-role-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignments, reason }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process bulk assignment');
      }

      const data = await response.json();
      setResults(data.results);
      
      if (data.summary.failed === 0) {
        setSuccess(`Successfully updated ${data.summary.successful} users`);
      } else {
        setSuccess(`Completed: ${data.summary.successful} successful, ${data.summary.failed} failed`);
      }

      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process bulk assignment';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
    setResults(null);
  }, []);

  return {
    bulkAssignRoles,
    loading,
    error,
    success,
    results,
    clearMessages
  };
}

// Hook for fetching users by specific role
export function useUsersByRole(role: UserRole) {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersByRole = useCallback(async (targetRole: UserRole, limit: number = 50) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        role: targetRole,
        limit: limit.toString()
      });

      const response = await fetch(`/api/auth/admin/users/bulk-role-assignment?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users by role');
      }

      const data = await response.json();
      setUsers(data.users);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users by role');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersByRole(role);
  }, [role, fetchUsersByRole]);

  const refetch = useCallback(() => {
    return fetchUsersByRole(role);
  }, [role, fetchUsersByRole]);

  return {
    users,
    loading,
    error,
    refetch,
    fetchUsersByRole
  };
}

// Hook for getting specific user details
export function useUserDetails(userId: string | null) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/admin/users/${targetUserId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user details');
      }

      const data = await response.json();
      setUser(data.user);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    } else {
      setUser(null);
      setError(null);
    }
  }, [userId, fetchUser]);

  const refetch = useCallback(() => {
    if (userId) {
      return fetchUser(userId);
    }
  }, [userId, fetchUser]);

  return {
    user,
    loading,
    error,
    refetch
  };
}

// Combined hook for complete role management operations
export function useRoleManagement() {
  const usersList = useUsers();
  const roleStats = useRoleStats();
  const roleAssignment = useRoleAssignment();
  const bulkAssignment = useBulkRoleAssignment();

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      usersList.refetch(),
      roleStats.refetch()
    ]);
  }, [usersList.refetch, roleStats.refetch]);

  // Enhanced assign role that refreshes data
  const assignRoleWithRefresh = useCallback(async (
    userId: string,
    newRole: UserRole,
    reason?: string
  ) => {
    const result = await roleAssignment.assignRole(userId, newRole, reason);
    if (result?.success) {
      await refreshAll();
    }
    return result;
  }, [roleAssignment.assignRole, refreshAll]);

  // Enhanced bulk assign that refreshes data
  const bulkAssignWithRefresh = useCallback(async (
    assignments: Array<{ userId: string; role: UserRole }>,
    reason?: string
  ) => {
    const result = await bulkAssignment.bulkAssignRoles(assignments, reason);
    if (result) {
      await refreshAll();
    }
    return result;
  }, [bulkAssignment.bulkAssignRoles, refreshAll]);

  return {
    // User list management
    users: usersList.users,
    usersLoading: usersList.loading,
    usersError: usersList.error,
    hasMore: usersList.hasMore,
    totalUsers: usersList.total,
    fetchUsers: usersList.fetchUsers,
    searchUsers: usersList.searchUsers,
    
    // Role statistics
    stats: roleStats.stats,
    statsLoading: roleStats.loading,
    statsError: roleStats.error,
    
    // Role assignment
    assignRole: assignRoleWithRefresh,
    assignmentLoading: roleAssignment.loading,
    assignmentError: roleAssignment.error,
    assignmentSuccess: roleAssignment.success,
    
    // Bulk assignment
    bulkAssignRoles: bulkAssignWithRefresh,
    bulkLoading: bulkAssignment.loading,
    bulkError: bulkAssignment.error,
    bulkSuccess: bulkAssignment.success,
    bulkResults: bulkAssignment.results,
    
    // Utility functions
    refreshAll,
    clearAssignmentMessages: roleAssignment.clearMessages,
    clearBulkMessages: bulkAssignment.clearMessages
  };
} 