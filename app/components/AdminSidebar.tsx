'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Activity, 
  Lock,
  FileText,
  Bell,
  Globe,
  Shield,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  description: string;
}

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/jasminedragon',
      description: 'Admin overview and metrics'
    },
    {
      title: 'User Management',
      icon: Users,
      href: '/jasminedragon/users',
      description: 'Manage all users and roles'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/jasminedragon/analytics',
      description: 'User registration trends and stats'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/jasminedragon/settings',
      description: 'Configure system settings'
    },
    {
      title: 'Test Panel',
      icon: Activity,
      href: '/jasminedragon/test',
      description: 'Test admin API endpoints'
    },
    {
      title: 'Security',
      icon: Lock,
      href: '/jasminedragon/security',
      description: 'Security settings and monitoring'
    },
    {
      title: 'Content Management',
      icon: FileText,
      href: '/jasminedragon/content',
      description: 'Manage courses and content'
    },
    {
      title: 'Notifications',
      icon: Bell,
      href: '/jasminedragon/notifications',
      description: 'System notifications and alerts'
    },
    {
      title: 'External Integrations',
      icon: Globe,
      href: '/jasminedragon/integrations',
      description: 'Third-party service integrations'
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-white hover:bg-gray-800/80 transition-colors"
      >
        {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? '4rem' : '20rem',
          opacity: 1
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
        className={cn(
          "fixed lg:relative left-0 top-0 h-screen z-40",
          "bg-gradient-to-b from-gray-900 via-gray-900 to-black",
          "border-r border-gray-800/50 backdrop-blur-sm",
          "flex flex-col overflow-hidden",
          isCollapsed && "lg:translate-x-0 -translate-x-full lg:block"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800/50">
          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              scale: isCollapsed ? 0.8 : 1
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">System Control</p>
              </div>
            )}
          </motion.div>
          
          {/* Collapse Button (Desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className={cn("w-3 h-3 transition-transform", isCollapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    "hover:bg-gray-800/50 hover:backdrop-blur-sm",
                    active && "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10",
                    !active && "hover:border hover:border-gray-700/50"
                  )}
                >
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                    active ? "bg-blue-500/20 text-blue-400" : "text-gray-400 group-hover:text-white group-hover:bg-gray-700/50"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text Content */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 min-w-0"
                      >
                        <div className={cn(
                          "font-medium text-sm transition-colors",
                          active ? "text-white" : "text-gray-300 group-hover:text-white"
                        )}>
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity",
                    "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  )} />
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50">
          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              height: isCollapsed ? 0 : 'auto'
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-400">System Online</span>
              </div>
              <p className="text-xs text-gray-400">
                All services operational
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
} 