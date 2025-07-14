import './CourseDetail.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from '../../api/categories';
import { fetchSubcategories } from '../../api/subcategories';
import { fetchReviewsByCourseId } from '../../api/reviews';
import {
  fetchLikedCourses,
  likeCourse,
  unlikeCourse,
} from '../../api/likedCourses';
import { ToastContainer, toast } from 'react-toastify';
import CourseDetailSkeleton from './CourseDetailSkeleton/CourseDetailSkeleton';
import 'react-toastify/dist/ReactToastify.css';

export default function CourseDetail({ course, onClose }) {
  const [likes, setLikes] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const userId = user?.id;

  useEffect(() => {
    const fetchLikeInfo = async () => {
      if (!userId || !course?.id) return;
      try {
        const liked = await fetchLikedCourses(userId);
        const hasLiked = liked.some((entry) => entry.courseId === course.id);
        setIsLiked(hasLiked);

        const allUserLikes = await fetchLikedCourses();
        const courseLikeCount = allUserLikes.filter(
          (entry) => entry.courseId === course.id
        ).length;
        setLikes(courseLikeCount);
      } catch (error) {
        console.error('Lỗi khi xử lý likedCourses:', error);
      }
    };

    fetchLikeInfo();
  }, [userId, course?.id]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [cats, subs, fetchedReviews] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchReviewsByCourseId(course.id),
        ]);
        if (!isMounted) return;

        const cat = cats.find((c) => c.id === course.categoryId);
        const sub = subs.find((s) => s.id === course.subcategoryId);
        setCategoryName(cat?.name || 'Không rõ');
        setSubcategoryName(sub?.name || 'Không rõ');
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Lỗi tải dữ liệu khóa học:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [course]);

  const handleLikeToggle = async () => {
    if (!userId) {
      toast.warn('Vui lòng đăng nhập để sử dụng tính năng này!');
      return;
    }
    try {
      if (isLiked) {
        await unlikeCourse(userId, course.id);
        toast.info('❌ Đã bỏ thích khóa học');
        setIsLiked(false);
        setLikes((prev) => Math.max(prev - 1, 0));
      } else {
        await likeCourse(userId, course.id);
        toast.success('✅ Đã thêm vào yêu thích');
        setIsLiked(true);
        setLikes((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Lỗi khi xử lý like/unlike:', error);
      toast.error('⚠️ Đã có lỗi xảy ra!');
    }
  };

  const handleReviewSubmit = () => {
    const trimmed = reviewText.trim();
    if (!userId) {
      toast.warn('❗ Bạn cần đăng nhập để gửi đánh giá.');
      return;
    }
    if (!trimmed) {
      alert('❗ Vui lòng nhập nội dung đánh giá.');
      return;
    }

    const newReview = {
      id: Date.now(),
      courseId: course.id,
      name: user.name,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
  
    setReviews((prev) => [newReview, ...prev]);
    setReviewText('');
    toast.success('✅ Gửi đánh giá thành công!');
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
