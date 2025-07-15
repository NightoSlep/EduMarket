import './CourseDetail.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';
import CourseDetailSkeleton from './CourseDetailSkeleton/CourseDetailSkeleton';
import useCourseDetail from '../../hooks/useCourseDetail';

export default function CourseDetail({ course, onClose }) {
  const {

    isLiked,
    likes,
    reviews,
    categoryName,
    subcategoryName,
    isLoading,
    reviewText,
    setReviewText,
    handleLikeToggle,
    handleReviewSubmit,
  } = useCourseDetail(course);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
          <img src={course.image} alt={course.name} className="course-detail-image" />
          <div className="course-detail-info">
            <h2>{course.name}</h2>
            <p><strong>Danh mục:</strong> {categoryName} - {subcategoryName}</p>
            <p><strong>Mô tả:</strong> {course.description}</p>
            <p className="price">{course.price.toLocaleString()} VND</p>

            <div className="likes-section">
              <button
                className="like-btn"
                onClick={handleLikeToggle}
                style={{ color: isLiked ? 'red' : 'gray' }}
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

          {reviews.length === 0 && (
            <div style={{ fontStyle: 'italic', color: '#888' }}>
              Chưa có đánh giá nào.
            </div>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="review">
              <div className="review-header">
                <img
                  className="review-avatar"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    review.name
                  )}&background=6a00ff&color=fff&size=32`}
                  alt="avatar"
                />
                <strong className="review-name">{review.name}</strong>
                <span className="review-time">
                  {new Date(review.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="review-text">{review.content}</div>
            </div>
          ))}

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
