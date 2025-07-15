import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchCategories } from '../api/categories';
import { fetchSubcategories } from '../api/subcategories';
import { fetchReviewsByCourseId } from '../api/reviews';
import {
  fetchLikedCourses,
  likeCourse,
  unlikeCourse,
} from '../api/likedCourses';

export default function useCourseDetail(course) {
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
    if (!userId || !course?.id) return;

    const fetchLikeInfo = async () => {
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

  return {
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
  };
}
