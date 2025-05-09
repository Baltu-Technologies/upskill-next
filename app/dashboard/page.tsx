'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, error } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
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
    <div className={styles.layout}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className={`${styles.dashboard} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <header className={styles.header}>
          <div className={styles.welcomeSection}>
            <h1>Welcome back, {user?.username || user?.email || 'User'}!</h1>
            <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className={styles.quickActions}>
            <button className={styles.actionButton}>
              <span>📚</span> Browse Courses
            </button>
            <button className={styles.actionButton}>
              <span>📝</span> Continue Learning
            </button>
          </div>
        </header>
        
        <main className={styles.main}>
          <div className={styles.grid}>
            <section className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statContent}>
                  <h3>Courses in Progress</h3>
                  <p className={styles.statNumber}>3</p>
                  <p className={styles.statDescription}>You're making great progress!</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statContent}>
                  <h3>Completed Courses</h3>
                  <p className={styles.statNumber}>5</p>
                  <p className={styles.statDescription}>Keep up the good work!</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏱️</div>
                <div className={styles.statContent}>
                  <h3>Learning Hours</h3>
                  <p className={styles.statNumber}>24</p>
                  <p className={styles.statDescription}>This month</p>
                </div>
              </div>
            </section>

            <section className={styles.recentActivity}>
              <h2>Recent Activity</h2>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>📚</div>
                  <div className={styles.activityContent}>
                    <h4>Started "Web Development Fundamentals"</h4>
                    <p>2 hours ago</p>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>✅</div>
                  <div className={styles.activityContent}>
                    <h4>Completed "Introduction to JavaScript"</h4>
                    <p>Yesterday</p>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>📝</div>
                  <div className={styles.activityContent}>
                    <h4>Submitted assignment in "React Basics"</h4>
                    <p>2 days ago</p>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.recommendedCourses}>
              <h2>Recommended for You</h2>
              <div className={styles.courseGrid}>
                <div className={styles.courseCard}>
                  <div className={styles.courseImage}></div>
                  <div className={styles.courseContent}>
                    <h4>Advanced React Patterns</h4>
                    <p>Take your React skills to the next level</p>
                    <button className={styles.enrollButton}>Enroll Now</button>
                  </div>
                </div>
                <div className={styles.courseCard}>
                  <div className={styles.courseImage}></div>
                  <div className={styles.courseContent}>
                    <h4>Node.js Masterclass</h4>
                    <p>Build scalable backend applications</p>
                    <button className={styles.enrollButton}>Enroll Now</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
} 