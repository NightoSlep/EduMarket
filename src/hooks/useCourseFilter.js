import { useState, useEffect } from 'react';
import { fetchCourses } from '../api/courses';

export default function useCourseFilter(searchTerm, priceRange, subcategoryId) {
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetchCourses()
        .then((data) => {
          if (!isMounted) return;

          const result = data.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (
              (priceRange === 'low' && c.price < 500000) ||
              (priceRange === 'mid' && c.price >= 500000 && c.price <= 1000000) ||
              (priceRange === 'high' && c.price > 1000000) ||
              priceRange === 'all'
            ) &&
            (!subcategoryId || c.subcategoryId === subcategoryId)
          );

          setFilteredCourses(result);
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi khi lấy courses:", err);
          setFilteredCourses([]);
          setLoading(false);
        });
    }, 800);

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [searchTerm, priceRange, subcategoryId]);

  return { filteredCourses, loading };
}
