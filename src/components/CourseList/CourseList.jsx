import React, { useMemo } from 'react';
import CourseCard from '../CourseCard/CourseCard';
import CourseCardSkeleton from '../CourseCard/CourseCardSkeleton/CourseCardSkeleton';
import useWatchHistory from '../../hooks/useWatchHistory';
import './CourseList.css';

export default function CourseList({ courses, isLoading, onSelectCourse }) {
  const { saveWatchHistory } = useWatchHistory();
  const user = useMemo(() => JSON.parse(localStorage.getItem('loggedInUser')), []);

  const handleSelectCourse = (course) => {
    if (!user || !course) return;
    saveWatchHistory(user.id, course.id);
    if (onSelectCourse) {
      onSelectCourse(course);
    }
  };

  return (
    <div className="course-list-wrapper">
      <div className="course-list">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          : courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={handleSelectCourse}
              />
            ))}
      </div>
    </div>
  );
}
