import React, { useState } from 'react';
import CourseList from '../../components/CourseList/CourseList';
import CourseDetail from '../../components/CourseDetail/CourseDetail';
import Pagination from '../../components/Pagination/Pagination';
import FilterBar from '../../components/FilterBar/FilterBar';
import useLikedCourse from '../../hooks/useLikedCourse';

export default function LikedCourses({ externalSubcategoryId }) {
  const {
    loading,
    currentCourses,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    disabledOptions,
    getSubcategoryName,
  } = useLikedCourse(externalSubcategoryId);

  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="liked-courses-page">
      <FilterBar
        title={getSubcategoryName()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        disabledOptions={disabledOptions}
      />

      <CourseList
        courses={currentCourses}
        isLoading={loading}
        onSelectCourse={setSelectedCourse}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
