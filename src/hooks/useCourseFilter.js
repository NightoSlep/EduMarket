import { useState, useEffect } from 'react';
import { courses as course } from '../data/course';

export default function useCourseFilter(searchTerm, priceRange, subcategoryFilter) {
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const result = course.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        ((priceRange === 'low' && c.price < 500000) ||
         (priceRange === 'mid' && c.price >= 500000 && c.price <= 1000000) ||
         (priceRange === 'high' && c.price > 1000000) ||
         priceRange === 'all') &&
        (!subcategoryFilter || c.subcategory === subcategoryFilter)
      );
      setFilteredCourses(result);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchTerm, priceRange, subcategoryFilter]);

  return { filteredCourses, loading };
}
