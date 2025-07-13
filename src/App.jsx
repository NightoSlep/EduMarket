import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import PriceFilter from './components/PriceFilter/PriceFilter';
import CourseList from './components/CourseList/CourseList';
import CourseDetail from './components/CourseDetail/CourseDetail';
import SearchBar from './components/SearchBar/SearchBar';
import Pagination from './components/Pagination/Pagination';
import useCourseFilter from './hooks/useCourseFilter';
import LikedCourses from './pages/LikedCourses';
import { fetchCategories } from './api/categories';
import { fetchSubcategories } from './api/subcategories';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const { filteredCourses, loading } = useCourseFilter(searchTerm, priceRange, subcategoryFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceRange, subcategoryFilter]);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchSubcategories().then(setSubcategories);
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      setDetailLoading(true);
      const timer = setTimeout(() => setDetailLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedCourse]);

  const renderTitle = () => {
    const category = categories.find(c => c.id === categoryFilter);
    const subcategory = subcategories.find(sc => sc.id === subcategoryFilter);
    if (category && subcategory) return `${category.name} - ${subcategory.name}`;
    if (subcategory) return subcategory.name;
    return 'Khóa học & Tài liệu';
  };

  const handleCategorySelect = (categoryId, subcategoryId) => {
    setCategoryFilter(categoryId);
    setSubcategoryFilter(subcategoryId);
    window.scrollTo(0, 0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setCategoryFilter(null);
    setSubcategoryFilter(null);
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <Header
        onCategorySelect={handleCategorySelect}
        onResetFilters={handleResetFilters}
        categories={categories}
        subcategories={subcategories}
      />
      <main>
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="search-filter-row">
                    <h2 className="course-title">{renderTitle()}</h2>
                    <div className="filter-group">
                      <SearchBar value={searchTerm} onSearchChange={setSearchTerm} />
                      <PriceFilter value={priceRange} onChange={setPriceRange} />
                    </div>
                  </div>

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
                </>
              }
            />
            <Route path="/liked" element={<LikedCourses />} />
          </Routes>
        </div>
      </main>

      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          isLoading={detailLoading}
          onClose={() => setSelectedCourse(null)}
          categories={categories}
          subcategories={subcategories}
        />
      )}
    </div>
  );
}
