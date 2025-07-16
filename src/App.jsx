import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchCategories } from './api/categories';
import { fetchSubcategories } from './api/subcategories';
import Header from './components/Header/Header';
import CourseList from './components/CourseList/CourseList';
import CourseDetail from './components/CourseDetail/CourseDetail';
import FilterBar from './components/FilterBar/FilterBar';
import Pagination from './components/Pagination/Pagination';
import useCourseFilter from './hooks/useCourseFilter';
import WatchHistory from './pages/WatchHistory/WatchHistory';
import LikedCourses from './pages/LikedCourses/LikedCourses';
import Cart from './pages/Cart/Cart';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [likedSubcategoryId, setLikedSubcategoryId] = useState(null);
  const [suggestedCourses, setSuggestedCourses] = useState(null);

  const { filteredCourses, loading } = useCourseFilter(
    searchTerm,
    priceRange,
    subcategoryFilter
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentCourses = (suggestedCourses ?? filteredCourses).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const disabledOptions = useMemo(() => ({
    all: false,
    low: !filteredCourses.some(c => c.price < 500000),
    mid: !filteredCourses.some(c => c.price >= 500000 && c.price <= 1000000),
    high: !filteredCourses.some(c => c.price > 1000000),
  }), [filteredCourses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceRange, subcategoryFilter]);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchSubcategories()])
      .then(([cats, subs]) => {
        setCategories(cats);
        setSubcategories(subs);
      });
  }, []);

  const getTitle = () => {
    if (suggestedCourses) return "🎯 Gợi ý phù hợp với bạn";
    const category = categories.find(c => c.id === categoryFilter);
    const subcategory = subcategories.find(sc => sc.id === subcategoryFilter);
    if (category && subcategory) return `${category.name} - ${subcategory.name}`;
    if (subcategory) return subcategory.name;
    return 'Khóa học & Tài liệu';
  };

  const handleCategorySelect = (categoryId, subcategoryId) => {
    setCategoryFilter(categoryId);
    setSubcategoryFilter(subcategoryId);
    setLikedSubcategoryId(subcategoryId);
    setSuggestedCourses(null);
    window.scrollTo(0, 0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setCategoryFilter(null);
    setSubcategoryFilter(null);
    setLikedSubcategoryId(null);
    setSuggestedCourses(null);
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
        onSuggestCourses={(courses) => {
          setSuggestedCourses(courses);
          setCurrentPage(1);
          window.scrollTo(0, 0);
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FilterBar
                title={getTitle()}
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
                totalPages={Math.ceil(suggestedCourses ?? filteredCourses.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </>
          }
        />
        <Route
          path="/liked"
          element={
            <LikedCoursesWrapper subcategoryId={likedSubcategoryId} />
          }
        />
        <Route path="/history" element={<WatchHistory />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

function LikedCoursesWrapper({ subcategoryId }) {
  return (
    <LikedCourses externalSubcategoryId={subcategoryId} />
  );
}
