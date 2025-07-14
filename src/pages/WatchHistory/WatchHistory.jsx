import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchWatchHistory } from '../../api/watchHistory';
import { fetchCourses } from '../../api/courses';
import { fetchCategories } from '../../api/categories';
import { fetchSubcategories } from '../../api/subcategories';
import { Link } from 'react-router-dom';
import FilterBar from '../../components/FilterBar/FilterBar';
import './WatchHistory.css';

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
      window.location.href = '/';
      return;
    }

    Promise.all([
      fetchWatchHistory(user.id),
      fetchCourses(),
      fetchSubcategories(),
      fetchCategories(),
    ])
      .then(([historyData, allCourses, subcats, cats]) => {
        setCourses(allCourses);
        setCategories(cats);
        setSubcategories(subcats);
        setHistory(historyData);
      })
      .finally(() => setLoading(false));
  }, []);

  const getCourseById = useCallback(
    (id) => courses.find((c) => c.id === id),
    [courses]
  );

  const filteredHistory = useMemo(() => {
    return history
      .map((entry) => {
        const course = getCourseById(entry.courseId);
        if (!course) return null;

        const subcategoryName =
          subcategories.find((s) => s.id === course.subcategoryId)?.name || '';

        const categoryName =
          categories.find((c) => c.id === course.categoryId)?.name || 'Không rõ';

        return {
          ...entry,
          ...course,
          subcategoryName,
          categoryName,
        };
      })
      .filter(
        (item) =>
          item &&
          item.name &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [history, getCourseById, categories, subcategories, searchTerm]);

  const totalFiltered = filteredHistory.length;

  const pagedHistory = useMemo(() => {
    return filteredHistory.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  return (
    <div className="watch-history-page">
      <div className="watch-history-header">
        <h2 className="watch-history-title">📜 Lịch sử xem khóa học</h2>
        <div className="watch-history-actions">
          <FilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      <div className="watch-history-layout">
        <div className="watch-history-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : totalFiltered === 0 ? (
            <p>Không có khóa học nào.</p>
          ) : (
            <div className="watch-history-scroll">
              {pagedHistory.map((item, index) => (
                <div key={index} className="history-card">
                  <div className="history-left">
                    <Link to={`/courses/${item.courseId}`} className="course-name">
                      {item.name}
                    </Link>
                    <div className="category-info">
                      📂 Danh mục: {item.categoryName} - {item.subcategoryName}
                    </div>
                  </div>
                  <div className="watched-time">
                    🕒 {new Date(item.watchedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!loading && totalFiltered > 0 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
