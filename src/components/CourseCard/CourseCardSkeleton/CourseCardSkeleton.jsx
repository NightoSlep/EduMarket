import React from 'react';
import './CourseCardSkeleton.css';

export default function CourseCardSkeleton() {
  return (
    <div className="course-card skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-title" />
      <div className="skeleton-price" />
      <div className="skeleton-button" />
    </div>
  );
}
