import { useState, useEffect } from 'react';
import { courses } from '../data/courses'; // đổi từ 'course' nếu bạn đã đổi tên file

export default function useCourseFilter(searchTerm, priceRange, subcategoryId) {
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const result = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        ((priceRange === 'low' && c.price < 500000) ||
         (priceRange === 'mid' && c.price >= 500000 && c.price <= 1000000) ||
         (priceRange === 'high' && c.price > 1000000) ||
         priceRange === 'all') &&
        (!subcategoryId || c.subcategoryId === subcategoryId)
      );
      setFilteredCourses(result);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm, priceRange, subcategoryId]);

  return { filteredCourses, loading };
}
