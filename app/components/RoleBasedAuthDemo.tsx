'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

type UserRole = 'admin' | 'guide' | 'content_creator' | 'learner';

interface RoleInfo {
  role: UserRole;
  description: string;
  permissions: string[];
}

const ROLE_DESCRIPTIONS: Record<UserRole, RoleInfo> = {
  admin: {
    role: 'admin',
    description: 'Full access to all features and administrative functions',
    permissions: ['Home', 'Courses', 'Career Opportunities', 'Course Test', 'Guide Access', 'Course Creator', 'Profile', 'Settings', 'Admin']
  },
  guide: {
    role: 'guide',
    description: 'Teachers, instructors, and case managers who guide learners',
    permissions: ['Home', 'Courses', 'Career Opportunities', 'Guide Access', 'Profile']
  },
  content_creator: {
    role: 'content_creator',
    description: 'Internal team members who create and manage course content',
    permissions: ['Home', 'Courses', 'Career Opportunities', 'Course Creator', 'Profile']
  },
  learner: {
    role: 'learner',
    description: 'Students and learners accessing courses and career opportunities',
    permissions: ['Home', 'Courses', 'Career Opportunities', 'Profile']
  }
};

export default function RoleBasedAuthDemo() {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const [navigationPermissions, setNavigationPermissions] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current user roles via API
  useEffect(() => {
    const loadUserRoles = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user-permissions');
        if (response.ok) {
          const permissions = await response.json();
          setNavigationPermissions(permissions);
          // For demo purposes, show current user as learner
          setUserRoles(['learner']);
        }
      } catch (error) {
        console.error('Error loading user roles:', error);
        setError('Failed to load user roles');
      }
    };

    loadUserRoles();
  }, [user]);

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Role-Based Authentication Demo</CardTitle>
          <CardDescription>Please sign in to test the role-based authentication system</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Authentication Demo</CardTitle>
          <CardDescription>
            Test the 4-tier role system: Admin, Guide, Content Creator, and Learner
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Current User: {user.email}</h3>
            <div className="flex flex-wrap gap-2">
              {userRoles.length > 0 ? (
                userRoles.map((role) => (
                  <Badge key={role} variant="default" className="bg-blue-100 text-blue-800">
                    {role}
                  </Badge>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-500">No roles assigned</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.values(ROLE_DESCRIPTIONS).map((roleInfo) => (
              <Card key={roleInfo.role} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base capitalize">{roleInfo.role}</CardTitle>
                    <Badge 
                      variant={userRoles.includes(roleInfo.role) ? "default" : "secondary"}
                      className={userRoles.includes(roleInfo.role) ? "bg-green-100 text-green-800" : ""}
                    >
                      {userRoles.includes(roleInfo.role) ? "Active" : "Available"}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {roleInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {roleInfo.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Navigation Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Navigation Permissions</CardTitle>
              <CardDescription>
                Based on your current roles, here are the navigation items you can access:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(navigationPermissions).map(([key, hasPermission]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        hasPermission ? 'bg-green-500' : 'bg-red-300'
                      }`}
                    />
                    <span className={`text-sm ${hasPermission ? 'text-gray-900' : 'text-gray-400'}`}>
                      {key.replace('canAccess', '').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> This is a demonstration of the role-based authentication system. 
              In production, role assignments would be managed through the admin panel at 
              <code className="bg-blue-100 px-1 rounded">/jasminedragon</code>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 