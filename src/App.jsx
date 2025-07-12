import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import PriceFilter from './components/PriceFilter/PriceFilter';
import CourseList from './components/CourseList/CourseList';
import CourseDetail from './components/CourseDetail/CourseDetail';
import SearchBar from './components/SearchBar/SearchBar';
import useCourseFilter from './hooks/useCourseFilter';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);

  const { filteredCourses, loading } = useCourseFilter(searchTerm, priceRange, subcategoryFilter);

  useEffect(() => {
    if (selectedCourse) {
      setDetailLoading(true);
      const timer = setTimeout(() => {
        setDetailLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedCourse]);

  const renderTitle = () => {
    if (categoryFilter && subcategoryFilter) return `${categoryFilter} - ${subcategoryFilter}`;
    if (subcategoryFilter) return subcategoryFilter;
    return 'Khóa học & Tài liệu';
  };

  const handleCategorySelect = (category, subcategory) => {
    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    window.scrollTo(0, 0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setCategoryFilter(null);
    setSubcategoryFilter(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <Header
        onCategorySelect={handleCategorySelect}
        onResetFilters={handleResetFilters}
      />
      <main>
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={
              <>
                <div className="search-filter-row">
                  <h2 className="course-title">{renderTitle()}</h2>
                  <div className="filter-group">
                    <SearchBar value={searchTerm} onSearchChange={setSearchTerm} />
                    <PriceFilter value={priceRange} onChange={setPriceRange} />
                  </div>
                </div>
                <CourseList
                  courses={filteredCourses}
                  isLoading={loading}
                  onSelectCourse={setSelectedCourse}
                />
              </>
            } />
          </Routes>
        </div>
      </main>

      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          isLoading={detailLoading}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
