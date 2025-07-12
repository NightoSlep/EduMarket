import React from 'react';
import CourseCard from '../CourseCard/CourseCard';
import CourseCardSkeleton from '../CourseCard/CourseCardSkeleton/CourseCardSkeleton';
import './CourseList.css';

export default function CourseList({ courses, isLoading, onSelectCourse  }) {
  return (
    <div className="course-list">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))
        : courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onSelectCourse={onSelectCourse}
            />
          ))}
    </div>
  );
}
