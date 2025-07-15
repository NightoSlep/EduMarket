import { useEffect, useMemo, useState } from 'react';
import { fetchCourses } from '../api/courses';
import { fetchLikedCourses } from '../api/likedCourses';
import { fetchSubcategories } from '../api/subcategories';

export default function useLikedCourses(externalSubcategoryId) {
  const [likedCourses, setLikedCourses] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
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
        console.error("Lỗi tải dữ liệu yêu thích:", err);
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

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const disabledOptions = useMemo(() => ({
    all: false,
    low: !filteredCourses.some(c => c.price < 500000),
    mid: !filteredCourses.some(c => c.price >= 500000 && c.price <= 1000000),
    high: !filteredCourses.some(c => c.price > 1000000),
  }), [filteredCourses]);

  const getSubcategoryName = () => {
    const sub = subcategories.find(s => s.id === subcategoryFilter);
    return sub ? `❤️ Khóa học yêu thích - ${sub.name}` : '❤️ Khóa học yêu thích';
  };

  return {
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
    subcategories,
    selectedSubcategory: subcategoryFilter,
    setSubcategoryFilter,
    getSubcategoryName,
  };
}
