import React from 'react';
import './CourseDetail.css';

export default function CourseDetail({ course, onClose }) {
  if (!course) return null;

  return (
    <div className="course-detail-overlay" onClick={onClose}>
      <div className="course-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{course.name}</h2>
        <img src={course.image} alt={course.name} />
        <p><strong>Mô tả ngắn:</strong> {course.description}</p>
        <p><strong>Chi tiết:</strong> {course.detail}</p>
        <p><strong>Giá:</strong> {course.price.toLocaleString()} VND</p>
      </div>
    </div>
  );
}
