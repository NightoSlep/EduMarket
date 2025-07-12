import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './CourseDetail.css';
import CourseDetailSkeleton from './CourseDetailSkeleton/CourseDetailSkeleton';

export default function CourseDetail({ course, isLoading, onClose }) {
  const [likes, setLikes] = useState(course.likes || 0);
  const [reviewText, setReviewText] = useState('');

  const handleLike = () => setLikes(prev => prev + 1);

  const handleReviewSubmit = () => {
    const trimmed = reviewText.trim();
    if (!trimmed) {
      alert('❗ Vui lòng nhập nội dung đánh giá.');
      return;
    }
    alert('✅ Đánh giá của bạn: ' + trimmed);
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

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

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
            <p><strong>Danh mục:</strong> {course.category} - {course.subcategory || 'Không rõ'}</p>
            <p><strong>Mô tả:</strong> {course.description}</p>
            <p className="price">{course.price.toLocaleString()} VND</p>
            <div className="likes-section">
              <button className="like-btn" onClick={handleLike}>❤️ Thích</button>
              <span className="like-count">{likes} lượt thích</span>
            </div>
            <button className="enroll-btn">
              {course.category === 'Khóa học' ? 'Đăng ký học' : 'Mua tài liệu'}
            </button>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Đánh giá từ người học</h2>
          <div className="review"><strong>Nguyễn Văn A</strong>: Rất hữu ích, dễ hiểu và sát với thực tế!</div>
          <div className="review"><strong>Trần Thị B</strong>: Hình ảnh rõ ràng, nội dung tốt, xứng đáng!</div>
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
      </div>
    </div>
  );
}
