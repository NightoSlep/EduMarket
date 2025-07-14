import React, { useEffect, useState } from 'react';
import CourseList from '../components/CourseList/CourseList';
import CourseDetail from '../components/CourseDetail/CourseDetail';
import Pagination from '../components/Pagination/Pagination';
import { fetchCourses } from '../api/courses';
import { fetchLikedCourses } from '../api/likedCourses';

export default function LikedCourses() {
  const [likedCourses, setLikedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(likedCourses.length / itemsPerPage);
  const currentCourses = likedCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

        setLikedCourses(filtered);
      } catch (err) {
        console.error("Lỗi tải dữ liệu yêu thích:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [likedCourses]);

  return (
    <div className="liked-courses-page">
      <h2 className="course-title">❤️ Khóa học đã yêu thích</h2>

      <CourseList
        courses={currentCourses}
        isLoading={loading}
        onSelectCourse={setSelectedCourse}
      />

      {!loading && likedCourses.length === 0 && (
        <p style={{ marginTop: 20 }}>Bạn chưa yêu thích khóa học nào.</p>
      )}

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
          subcategories={[]}
        />
      )}
    </div>
  );
}
