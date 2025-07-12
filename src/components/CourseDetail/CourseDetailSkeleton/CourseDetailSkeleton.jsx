import React from 'react';
import './CourseDetailSkeleton.css';

export default function CourseDetailSkeleton() {
  return (
    <div className="modal-overlay">
      <div className="course-modal">
        <div className="close-wrapper">
          <div className="skeleton-circle"></div>
        </div>

        <div className="course-detail-container">
          <div className="course-detail-image skeleton-image"></div>
          <div className="course-detail-info skeleton-info">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-short" />
            <div className="skeleton-button enroll-placeholder" />
          </div>
        </div>

        <div className="reviews-section">
          <div className="skeleton-line skeleton-title skeleton-review-title" />
          <div className="skeleton-review" />
          <div className="skeleton-review" />
          <div className="add-review">
            <div className="skeleton-textarea" />
            <div className="skeleton-button skeleton-submit-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}
