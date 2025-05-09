'use client';

import { useAuth } from '../contexts/AuthContext';
import styles from './Sidebar.module.css';
import Link from 'next/link';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link href="/" className={styles.logo}>
          {isCollapsed ? 'U' : 'Upskill'}
        </Link>
        <button 
          className={styles.collapseButton}
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className={styles.nav}>
        <Link href="/dashboard" className={styles.navItem}>
          <span>📊</span>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link href="/courses" className={styles.navItem}>
          <span>📚</span>
          {!isCollapsed && <span>Courses</span>}
        </Link>
        <Link href="/progress" className={styles.navItem}>
          <span>📈</span>
          {!isCollapsed && <span>Progress</span>}
        </Link>
        <Link href="/profile" className={styles.navItem}>
          <span>👤</span>
          {!isCollapsed && <span>Profile</span>}
        </Link>
      </nav>

      <div className={styles.sidebarFooter}>
        {user ? (
          <button onClick={signOut} className={styles.signOutButton}>
            <span>🚪</span>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        ) : (
          <Link href="/auth" className={styles.signInButton}>
            <span>🔑</span>
            {!isCollapsed && <span>Sign In</span>}
          </Link>
        )}
      </div>
    </aside>
  );
} 