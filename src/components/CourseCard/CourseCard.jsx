import React from 'react';
import './CourseCard.css';

export default function CourseCard({ course, onSelectCourse }) {
  return (
    <div className="course-card" onClick={() => onSelectCourse(course)}>
      <img src={course.image} alt={course.name} className="course-image" />
      <h3>{course.name}</h3>
      <p className="price">{course.price.toLocaleString()} VND</p>
      <button className="detail-btn" onClick={() => onSelectCourse(course)}>
        Xem chi tiết
      </button>
    </div>
  );
}
