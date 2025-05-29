'use client';

import { useState, useEffect } from 'react';
import styles from './CourseCarousel.module.css';
import CourseService from '../services/courses.service.js';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  instructor: string;
  duration: string;
}

export default function CourseCarousel() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const coursesPerView = 3;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await CourseService.getFeaturedCourses();
        console.log('Fetched courses:', data); // Debug log
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Using fallback data.');
        setCourses(CourseService.getFallbackCourses());
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + coursesPerView >= courses.length ? 0 : prevIndex + coursesPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - coursesPerView < 0 ? Math.max(0, courses.length - coursesPerView) : prevIndex - coursesPerView
    );
  };

  const visibleCourses = courses.slice(currentIndex, currentIndex + coursesPerView);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={styles.error}>
        <p>No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.carousel}>
      {error && (
        <div className={styles.error}>
          <small>{error}</small>
        </div>
      )}
      
      <button 
        className={styles.arrowButton} 
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        ←
      </button>
      
      <div className={styles.carouselContent}>
        {visibleCourses.map((course) => (
          <div
            key={course.id}
            className={styles.courseCard}
          >
            <img src={course.imageUrl} alt={course.title} />
            <div className={styles.courseInfo}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className={styles.courseMeta}>
                <span>👨‍🏫 {course.instructor}</span>
                <span>⏱️ {course.duration}</span>
              </div>
              <button className={styles.enrollButton}>Enroll Now</button>
            </div>
          </div>
        ))}
      </div>

      <button 
        className={styles.arrowButton} 
        onClick={nextSlide}
        disabled={currentIndex + coursesPerView >= courses.length}
      >
        →
      </button>
    </div>
  );
} 