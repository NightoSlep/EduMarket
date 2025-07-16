import React from 'react';
import './Cart.css';
import { useCart } from '../../hooks/useCart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { fetchCourses } from '../../api/courses';
import CourseCard from '../../components/CourseCard/CourseCard';
import CourseCardSkeleton from '../../components/CourseCard/CourseCardSkeleton/CourseCardSkeleton';

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const [suggested, setSuggested] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (cartItems.length === 0) return;

      setLoadingSuggestions(true);
      try {
        const allCourses = await fetchCourses();
        const subIdsInCart = [...new Set(cartItems.map(item => item.subcategoryId))];

        const filtered = allCourses.filter(course =>
          subIdsInCart.includes(course.subcategoryId) &&
          !cartItems.some(item => item.id === course.id) // không gợi ý lại những gì đã có trong giỏ
        );

        setSuggested(filtered);
      } catch (err) {
        console.error('Lỗi khi tải gợi ý:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, [cartItems]);

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Giỏ hàng</h1>

      <div className="cart-container">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Chưa có khóa học hoặc tài liệu nào trong giỏ.</p>
        ) : (
          <div className="cart-table">
            <div className="cart-header">
              <div>Ảnh</div>
              <div>Tên</div>
              <div>Giá</div>
              <div></div>
            </div>
            {cartItems.map((item) => (
              <div className="cart-row" key={item.id}>
                <div>
                  <img src={item.image} alt={item.name} className="cart-image" />
                </div>
                <div>{item.name}</div>
                <div>{item.price.toLocaleString()} VND</div>
                <div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <p className="total-price">
            Tổng cộng: <strong>{total.toLocaleString()} VND</strong>
          </p>
          <button className="checkout-btn">Thanh toán</button>
        </div>
      )}
      {suggested.length > 0 && (
        <div className="suggested-container">
          <h2 className="suggested-title">Gợi ý liên quan 🎯</h2>
          <div className={`suggested-scroll ${suggested.length > 4 ? 'scroll-enabled' : ''}`}>
            {loadingSuggestions
              ? Array(3).fill(0).map((_, i) => <CourseCardSkeleton key={i} />)
              : suggested.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
