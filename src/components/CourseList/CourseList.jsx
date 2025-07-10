import React from 'react';
import CourseCard from '../CourseCard/CourseCard';
import './CourseList.css';

export default function CourseList({ courses, onSelect }) {
  return (
    <div className="course-list">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} onSelect={() => onSelect(course)} />
      ))}
    </div>
  );
}
