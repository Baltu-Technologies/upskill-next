"use client";

import { useState } from 'react';
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import CourseCarousel from "./components/CourseCarousel";
import styles from "./page.module.css";

export default function App() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`${styles.main} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <header className={styles.header}>
          <h1>Welcome to Upskill</h1>
          {user && (
            <div className={styles.userInfo}>
              <span>👤 {user.signInDetails?.loginId}</span>
              <button onClick={signOut} className={styles.signOutButton}>
                Sign Out
              </button>
            </div>
          )}
        </header>

        <section className={styles.hero}>
          <h1>Discover Your Next Course</h1>
          <p>Expand your skills with our expert-led courses</p>
        </section>

        <section className={styles.featuredCourses}>
          <h2>Featured Courses</h2>
          <CourseCarousel />
        </section>
      </main>
    </div>
  );
}
