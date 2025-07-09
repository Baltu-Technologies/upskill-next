'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useAuth0 } from '@/app/contexts/Auth0Context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building2, Shield, LogOut, LogIn } from 'lucide-react';

export default function DualAuthSwitcher() {
  const betterAuth = useAuth();
  const auth0 = useAuth0();
  const [showSwitcher, setShowSwitcher] = useState(false);

  useEffect(() => {
    // Only show switcher for internal Baltu users
    const isInternalUser = betterAuth.user?.email?.includes('@baltutechnologies.com') || 
                          betterAuth.user?.email?.includes('@baltu.com');
    setShowSwitcher(isInternalUser);
  }, [betterAuth.user]);

  if (!showSwitcher) return null;

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 border-0 bg-white/95 dark:bg-slate-800/95 
                     shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Internal Auth Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-3">
            {/* BetterAuth Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  BetterAuth
                </span>
              </div>
              <Badge variant={betterAuth.isAuthenticated ? "default" : "secondary"}>
                {betterAuth.isAuthenticated ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            {betterAuth.isAuthenticated && (
              <div className="text-xs text-slate-600 dark:text-slate-400 ml-6">
                {betterAuth.user?.email}
              </div>
            )}

            {/* Auth0 Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Auth0 (Employers)
                </span>
              </div>
              <Badge variant={auth0.isAuthenticated ? "default" : "secondary"}>
                {auth0.isAuthenticated ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            {auth0.isAuthenticated && (
              <div className="text-xs text-slate-600 dark:text-slate-400 ml-6">
                {auth0.user?.email}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                BetterAuth Actions
              </div>
              {betterAuth.isAuthenticated ? (
                <Button 
                  onClick={betterAuth.signOut}
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <LogOut className="w-3 h-3 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <LogIn className="w-3 h-3 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Auth0 Actions
              </div>
              {auth0.isAuthenticated ? (
                <Button 
                  onClick={auth0.signOut}
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <LogOut className="w-3 h-3 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  onClick={() => window.location.href = '/api/auth0/login'}
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <LogIn className="w-3 h-3 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 