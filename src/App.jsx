import React, { useState } from 'react';
import './App.css';
import { courses as allCourses } from './data/course';
import Header from './components/Header/Header';
import PriceFilter from './components/PriceFilter/PriceFilter';
import CourseList from './components/CourseList/CourseList';
import CourseDetail from './components/CourseDetail/CourseDetail';
import SearchBar from './components/SearchBar/SearchBar';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  const [viewMode, setViewMode] = useState('all');

  const filterByPrice = (course) => {
    if (priceRange === 'low') return course.price < 500000;
    if (priceRange === 'mid') return course.price >= 500000 && course.price <= 1000000;
    if (priceRange === 'high') return course.price > 1000000;
    return true;
  };

  const filteredCourses = allCourses.filter(course =>
    (viewMode === 'all' || course.category === viewMode) &&
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    filterByPrice(course) &&
    (!categoryFilter || course.category === categoryFilter) &&
    (!subcategoryFilter || course.subcategory === subcategoryFilter)
  );

  const handleCategorySelect = (category, subcategory) => {
    setViewMode(category);
    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    setSelectedCourse(null);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setSelectedCourse(null);
    setCategoryFilter(null);
    setSubcategoryFilter(null);
    setViewMode('all');
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
          <div className="search-filter-row">
            <SearchBar value={searchTerm} onSearchChange={setSearchTerm} />
            <PriceFilter value={priceRange} onChange={setPriceRange} />
          </div>

          <CourseList courses={filteredCourses} onSelect={setSelectedCourse} />
        </div>
        <CourseDetail course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      </main>
    </div>
  );
}
