'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  Settings2, 
  Plus, 
  X, 
  Shield, 
  Brain, 
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  User,
  Calendar,
  Mail,
  Edit3,
  Trash2
} from 'lucide-react';
import Image from 'next/image';

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  roles: string[];
  lastActive?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<{
    userId: string;
    role: string;
    action: 'add' | 'remove';
  } | null>(null);
  const [adminConfirmText, setAdminConfirmText] = useState('');
  const [showAdminConfirmation, setShowAdminConfirmation] = useState(false);

  const roles = ['admin', 'guide', 'content_creator', 'learner'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jasminedragon/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, action: 'add' | 'remove') => {
    // Set up confirmation action
    setConfirmationAction({ userId, role: newRole, action });
    
    // Special handling for admin role
    if (newRole === 'admin' && action === 'add') {
      setShowAdminConfirmation(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const confirmRoleChange = async () => {
    if (!confirmationAction) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/jasminedragon/users/roles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: confirmationAction.userId,
          role: confirmationAction.role,
          action: confirmationAction.action
        })
      });

      if (!response.ok) throw new Error('Failed to update user role');
      
      await fetchUsers(); // Refresh user list
      setShowRoleModal(false);
      setSelectedUser(null);
      setShowConfirmation(false);
      setShowAdminConfirmation(false);
      setConfirmationAction(null);
      setAdminConfirmText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setShowAdminConfirmation(false);
    setConfirmationAction(null);
    setAdminConfirmText('');
  };

  const isAdminConfirmationValid = () => {
    return adminConfirmText.toLowerCase() === 'make admin';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-500/10 text-red-400 border-red-500/20',
      guide: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      content_creator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      learner: 'bg-green-500/10 text-green-400 border-green-500/20'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: Shield,
      guide: Users,
      content_creator: Brain,
      learner: Award
    };
    const IconComponent = icons[role as keyof typeof icons] || Users;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusIcon = (user: User) => {
    if (user.status === 'active') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (user.status === 'pending') return <Clock className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserDisplayName = (user: User) => {
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.email.split('@')[0];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getUserDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.roles.includes(selectedRole);
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header Banner */}
        <div className="relative h-[30vh] flex items-center justify-center overflow-hidden rounded-2xl mb-8">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&crop=center"
              alt="User management workspace"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-8"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-purple-600/90 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1">
                  <span className="text-white font-bold text-sm block text-center">Users</span>
                </div>
              </div>
              
              <div className="flex-1 max-w-lg">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  User Management
                </h1>
                <p className="text-lg text-gray-300 mb-4">
                  Manage user accounts, roles, and permissions
                </p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Users className="w-3 h-3 mr-1" />
                    {filteredUsers.length} Users
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="guide">Guide</option>
                    <option value="content_creator">Content Creator</option>
                    <option value="learner">Learner</option>
                  </select>
                  <Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Roles
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {getUserDisplayName(user)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {(user.roles || []).map((role) => (
                              <Badge 
                                key={role} 
                                className={`text-xs border ${getRoleColor(role)}`}
                              >
                                {getRoleIcon(role)}
                                <span className="ml-1 capitalize">{role.replace('_', ' ')}</span>
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(user)}
                            <span className="text-sm text-gray-300 capitalize">
                              {user.status || 'active'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleModal(true);
                              }}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No users found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Role Management Modal */}
        <AnimatePresence>
          {showRoleModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRoleModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Manage Roles for {getUserDisplayName(selectedUser)}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRoleModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {roles.map((role) => {
                    const hasRole = selectedUser.roles.includes(role);
                    return (
                      <div key={role} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getRoleIcon(role)}
                          <span className="text-white capitalize">{role.replace('_', ' ')}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={hasRole ? "destructive" : "default"}
                          onClick={() => handleRoleChange(selectedUser.id, role, hasRole ? 'remove' : 'add')}
                          disabled={isUpdating}
                          className={hasRole ? 
                            "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30" :
                            "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                          }
                        >
                          {isUpdating ? 'Updating...' : hasRole ? 'Remove' : 'Add'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role Change Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && confirmationAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={cancelConfirmation}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <AlertCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Confirm Role Change
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 mb-2">
                    Are you sure you want to{' '}
                    <span className="font-semibold text-white">
                      {confirmationAction.action}
                    </span>{' '}
                    the{' '}
                    <span className="font-semibold text-white capitalize">
                      {confirmationAction.role.replace('_', ' ')}
                    </span>{' '}
                    role {confirmationAction.action === 'add' ? 'to' : 'from'}{' '}
                    <span className="font-semibold text-white">
                      {selectedUser ? getUserDisplayName(selectedUser) : 'this user'}
                    </span>?
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={cancelConfirmation}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmRoleChange}
                    disabled={isUpdating}
                    className={confirmationAction.action === 'add' 
                      ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                    }
                  >
                    {isUpdating ? 'Updating...' : 'Confirm'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Role Confirmation Modal */}
        <AnimatePresence>
          {showAdminConfirmation && confirmationAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={cancelConfirmation}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Admin Role Confirmation
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 mb-4">
                    ⚠️ You are about to grant <span className="font-semibold text-white">Administrator</span> privileges to{' '}
                    <span className="font-semibold text-white">
                      {selectedUser ? getUserDisplayName(selectedUser) : 'this user'}
                    </span>.
                  </p>
                  <p className="text-yellow-400 text-sm mb-4">
                    Admin users have full access to all system functions including user management, 
                    analytics, and settings. This action should only be performed by authorized personnel.
                  </p>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 text-sm mb-2">
                      To confirm, please type: <span className="font-mono text-white bg-gray-700 px-2 py-1 rounded">make admin</span>
                    </p>
                    <Input
                      value={adminConfirmText}
                      onChange={(e) => setAdminConfirmText(e.target.value)}
                      placeholder="Type 'make admin' to confirm"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={cancelConfirmation}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmRoleChange}
                    disabled={isUpdating || !isAdminConfirmationValid()}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Granting Admin...' : 'Grant Admin Access'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
} 