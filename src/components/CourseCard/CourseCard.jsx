import React from 'react';
import './CourseCard.css';

export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.name} />
      <h3>{course.name}</h3>
      <p className="description">{course.description}</p>
      <p className="price">{course.price.toLocaleString()} VND</p>
      <button className="detail-btn">Xem chi tiết</button>
    </div>
  );
}
