import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchWatchHistory, addToWatchHistory } from '../../api/watchHistory';
import { fetchCourses } from '../../api/courses';
import { fetchCategories } from '../../api/categories';
import { fetchSubcategories } from '../../api/subcategories';
import CourseDetail from '../../components/CourseDetail/CourseDetail';
import Pagination from '../../components/Pagination/Pagination';
import FilterBar from '../../components/FilterBar/FilterBar';
import useWatchHistory from '../../hooks/useWatchHistory';
import WatchHistorySkeleton from './WatchHistorySkeleton/WatchHistorySkeleton';
import './WatchHistory.css';

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { saveWatchHistory, getWatchHistory } = useWatchHistory();
  const user = useMemo(() => JSON.parse(localStorage.getItem('loggedInUser')), []);

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
      return;
    }

    const fetchData = async () => {
      try {
        const [apiHistory, allCourses, subcats, cats] = await Promise.all([
          fetchWatchHistory(user.id),
          fetchCourses(),
          fetchSubcategories(),
          fetchCategories(),
        ]);

        setCourses(allCourses);
        setSubcategories(subcats);
        setCategories(cats);

        const localHistory = getWatchHistory(user.id);

        const merged = [
          ...apiHistory,
          ...localHistory.filter(
            (lh) => !apiHistory.some((ah) => ah.courseId === lh.courseId)
          ),
        ].sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));

        const enriched = merged.map((entry) => {
          const course = allCourses.find((c) => c.id === entry.courseId);
          const name = course?.name || `Khóa học #${entry.courseId}`;
          const categoryName = course
            ? cats.find((c) => c.id === course.categoryId)?.name
            : 'Không rõ';
          const subcategoryName = course
            ? subcats.find((s) => s.id === course.subcategoryId)?.name
            : '';
          return {
            ...entry,
            ...(course || {}),
            name,
            categoryName,
            subcategoryName,
          };
        });

        setHistory(enriched);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu lịch sử:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, getWatchHistory]);

  useEffect(() => {
    const scrollTarget = document.querySelector('.watch-history-content');
    if (scrollTarget) {
      scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const getCourseById = useCallback(
    (id) => courses.find((c) => c.id === id),
    [courses]
  );

  const filteredHistory = useMemo(() => {
    return history.filter(
      (item) =>
        item.name &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  const pagedHistory = useMemo(() => {
    return filteredHistory.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleCourseClick = async (course) => {
    if (!user || !course) return;

    const newEntry = saveWatchHistory(user.id, course.id);
    if (newEntry) {
      try {
        await addToWatchHistory(user.id, course.id);

        const fullCourse = getCourseById(course.id);
        const categoryName =
          categories.find((c) => c.id === fullCourse?.categoryId)?.name || 'Không rõ';
        const subcategoryName =
          subcategories.find((s) => s.id === fullCourse?.subcategoryId)?.name || '';

        const enriched = {
          ...newEntry,
          ...(fullCourse || {}),
          name: fullCourse?.name || `Khóa học #${course.id}`,
          categoryName,
          subcategoryName,
        };
        setHistory((prev) => {
          const filtered = prev.filter((item) => item.courseId !== course.id);
          return [enriched, ...filtered];
        });
      } catch (err) {
        console.error('Lỗi khi gửi lịch sử xem:', err);
      }
    }

    setSelectedCourse(course);
  };

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
            <WatchHistorySkeleton count={6} />
          ) : filteredHistory.length === 0 ? (
            <p>Không có khóa học nào.</p>
          ) : (
            <div className="scroll-to-top-target">
              {pagedHistory.map((item) => (
                <div
                  key={`${item.userId}-${item.courseId}-${item.watchedAt}`}
                  className="history-card"
                  onClick={() => handleCourseClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="history-left">
                    <div className="course-name">{item.name}</div>
                    <div className="category-info">
                      📂 Danh mục: {item.categoryName} - {item.subcategoryName}
                    </div>
                  </div>
                  <div className="watched-time">
                    🕒{' '}
                    {(() => {
                      const date = new Date(item.watchedAt);
                      const timeStr = date.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const dateStr = date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      });
                      return `${timeStr}, ${dateStr}`;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!loading && filteredHistory.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
