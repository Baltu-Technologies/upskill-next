'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button 
          onClick={() => router.push('/')}
          className={styles.retryButton}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome to your Dashboard</h1>
        <p>Hello, {user?.username || user?.email || 'User'}</p>
      </header>
      
      <main className={styles.main}>
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Profile</h3>
            <p>View and edit your profile information</p>
          </div>
          <div className={styles.statCard}>
            <h3>Activity</h3>
            <p>Track your recent activities</p>
          </div>
          <div className={styles.statCard}>
            <h3>Settings</h3>
            <p>Manage your account settings</p>
          </div>
        </section>
      </main>
    </div>
  );
} 