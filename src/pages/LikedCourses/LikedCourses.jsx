import React, { useEffect, useState, useMemo } from 'react';
import CourseList from '../../components/CourseList/CourseList';
import CourseDetail from '../../components/CourseDetail/CourseDetail';
import Pagination from '../../components/Pagination/Pagination';
import { fetchCourses } from '../../api/courses';
import { fetchLikedCourses } from '../../api/likedCourses';
import { fetchSubcategories } from '../../api/subcategories';
import FilterBar from '../../components/FilterBar/FilterBar';

export default function LikedCourses({ externalSubcategoryId }) {
  const [likedCourses, setLikedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;
    const userId = user.id;

    const loadData = async () => {
      try {
        const liked = await fetchLikedCourses(userId);
        const likedIds = liked.map(item => item.courseId);
        const allCourses = await fetchCourses();
        const filtered = allCourses.filter(course => likedIds.includes(course.id));
        const subs = await fetchSubcategories();
        setLikedCourses(filtered);
        setSubcategories(subs);
      } catch (err) {
        console.error("Lỗi tải dữ liệu yêu thích hoặc subcategory:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (externalSubcategoryId) {
      setSubcategoryFilter(externalSubcategoryId);
    }
  }, [externalSubcategoryId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceRange, subcategoryFilter]);

  const filteredCourses = useMemo(() => {
    return likedCourses.filter(course => {
      const matchSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());

      let matchPrice = true;
      if (priceRange === 'low') matchPrice = course.price < 500000;
      else if (priceRange === 'mid') matchPrice = course.price >= 500000 && course.price <= 1000000;
      else if (priceRange === 'high') matchPrice = course.price > 1000000;

      const matchSubcategory = subcategoryFilter
        ? course.subcategoryId === subcategoryFilter
        : true;

      return matchSearch && matchPrice && matchSubcategory;
    });
  }, [likedCourses, searchTerm, priceRange, subcategoryFilter]);

  const disabledOptions = useMemo(() => ({
    all: false,
    low: !filteredCourses.some(c => c.price < 500000),
    mid: !filteredCourses.some(c => c.price >= 500000 && c.price <= 1000000),
    high: !filteredCourses.some(c => c.price > 1000000),
  }), [filteredCourses]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSubcategoryName = () => {
    const sub = subcategories.find(s => s.id === subcategoryFilter);
    return sub ? `❤️ Khóa học yêu thích - ${sub.name}` : '❤️ Khóa học yêu thích';
  };

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
          isLoading={false}
          onClose={() => setSelectedCourse(null)}
          categories={[]}
          subcategories={subcategories}
        />
      )}
    </div>
  );
}
