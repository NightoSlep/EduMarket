import React, { useEffect, useState } from 'react';
import './CourseCard.css';
import { useCart } from "../../hooks/useCart";
import { fetchCategories } from '../../api/categories';
import { fetchSubcategories } from '../../api/subcategories';

export default function CourseCard({ course, onSelectCourse, user }) {
  const { addToCart, cartItems  } = useCart();
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isInCart = cartItems.some(item => item.id === course.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subcatRes] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
        ]);
        const matchedCat = catRes.find(c => String(c.id) === String(course.categoryId));
        const matchedSub = subcatRes.find(sc => String(sc.id) === String(course.subcategoryId));

        setCategoryName(matchedCat?.name || '');
        setSubcategoryName(matchedSub?.name || '');
      } catch (err) {
        console.error("Failed to fetch categories/subcategories", err);
      }
    };
    fetchData();
  }, [course]);

  const handleResize = () => setIsMobile(window.innerWidth <= 768);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isLoading || !user) {
      if (!user) alert("Bạn cần đăng nhập!");
      return;
    }
    const alreadyHasCategory = cartItems.some(
      (item) => item.id === course.id
    );
    if (alreadyHasCategory) {
      alert("❗ Danh mục này đã nằm trong giỏ hàng!");
      return;
    }
    setIsLoading(true);
    await addToCart(course.id);
    setIsLoading(false);
  };

  return (
    <div className="course-card" onClick={() => onSelectCourse(course)}>
      {isMobile ? (
        <>
          <div className="card-mobile-left">
            <div
              className="course-image-bg"
              style={{ backgroundImage: `url(${course.image})` }}
            />
          </div>

          <div className="mobile-right">
            <div className="price-add-row">
              <p className="price">{course.price.toLocaleString()} VND</p>
              <button
                className={`add-cart-btn ${isInCart ? 'in-cart' : ''}`}
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? '...' : '🛒'}
              </button>
            </div>

            <h3>{course.name}</h3>

            {(categoryName || subcategoryName) && (
              <p className="course-category">
                {categoryName}
                {subcategoryName ? ` / ${subcategoryName}` : ''}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="image-wrapper">
            <div
              className="course-image-bg"
              style={{ backgroundImage: `url(${course.image})` }}
            />
            <div className="card-overlay">
              <button
                className="add-cart-btn"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? 'Đang thêm...' : '🛒 Thêm vào giỏ'}
              </button>
            </div>
          </div>
          <div className="card-body">
            <h3>{course.name}</h3>
            <div className="bottom-info">
              <p className="price">{course.price.toLocaleString()} VND</p>
              <button className="detail-btn">Xem chi tiết</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
