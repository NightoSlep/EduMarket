import './CourseDetail.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from '../../api/categories';
import { fetchSubcategories } from '../../api/subcategories';
import { likedCourses } from '../../data/likedCourses';
import { ToastContainer, toast } from 'react-toastify';
import CourseDetailSkeleton from './CourseDetailSkeleton/CourseDetailSkeleton';
import 'react-toastify/dist/ReactToastify.css';

export default function CourseDetail({ course, isLoading, onClose }) {
  const [likes, setLikes] = useState(course.likes || 0);
  const [reviewText, setReviewText] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const userId = user?.id;

  // ✅ Check liked từ dữ liệu mock
  useEffect(() => {
    if (!userId || !course?.id) return;
    const hasLiked = likedCourses.some(
      (entry) => entry.userId === userId && entry.courseId === course.id
    );
    setIsLiked(hasLiked);
  }, [course?.id, userId]);

  const handleLikeToggle = () => {
    if (!userId) {
      toast.warn('Vui lòng đăng nhập để sử dụng tính năng này!');
      return;
    }

    if (isLiked) {
      toast.info('❌ Đã bỏ thích khóa học');
      setLikes((prev) => Math.max(prev - 1, 0));
      setIsLiked(false);
    } else {
      toast.success('✅ Đã thêm vào yêu thích');
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleReviewSubmit = () => {
    const trimmed = reviewText.trim();
    if (!trimmed) {
      alert('❗ Vui lòng nhập nội dung đánh giá.');
      return;
    }
    setReviewText('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const loadNames = async () => {
      const [cats, subs] = await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
      ]);
      const cat = cats.find((c) => c.id === course.categoryId);
      const sub = subs.find((s) => s.id === course.subcategoryId);
      setCategoryName(cat?.name || 'Không rõ');
      setSubcategoryName(sub?.name || 'Không rõ');
    };
    loadNames();
  }, [course]);

  if (isLoading) return <CourseDetailSkeleton />;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <div className="close-wrapper">
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="course-detail-container">
          <img
            src={course.image}
            alt={course.name}
            className="course-detail-image"
          />
          <div className="course-detail-info">
            <h2>{course.name}</h2>
            <p>
              <strong>Danh mục:</strong> {categoryName} - {subcategoryName}
            </p>
            <p>
              <strong>Mô tả:</strong> {course.description}
            </p>
            <p className="price">{course.price.toLocaleString()} VND</p>

            <div className="likes-section">
              <button
                className="like-btn"
                onClick={handleLikeToggle}
                style={{ color: isLiked ? '#6a0dad' : 'gray' }}
              >
                <FontAwesomeIcon icon={isLiked ? solidHeart : regularHeart} />{' '}
                {isLiked ? 'Đã thích' : 'Thích'}
              </button>
              <span className="like-count">{likes} lượt thích</span>
            </div>

            <button className="enroll-btn">
              {categoryName === 'Khóa học' ? 'Đăng ký học' : 'Mua tài liệu'}
            </button>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Đánh giá từ người học</h2>
          <div className="review">
            <strong>Nguyễn Văn A</strong>: Rất hữu ích, dễ hiểu và sát với thực tế!
          </div>
          <div className="review">
            <strong>Trần Thị B</strong>: Hình ảnh rõ ràng, nội dung tốt, xứng đáng!
          </div>
          <div className="add-review">
            <textarea
              placeholder="Viết đánh giá của bạn tại đây..."
              rows={4}
              className="review-input"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button className="submit-review-btn" onClick={handleReviewSubmit}>
              Gửi đánh giá
            </button>
          </div>
        </div>

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
}
