import React from 'react';
import './CourseCard.css';
import useCart from '../../hooks/useCart';

export default function CourseCard({ course, onSelectCourse }) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    await addToCart(course.id);
    setIsLoading(false);
  };

  return (
    <div className="course-card" onClick={() => onSelectCourse(course)}>
      <div className="image-wrapper">
        <div
          className="course-image-bg"
          style={{ backgroundImage: `url(${course.image})` }}
        />
        <div className="card-overlay">
          <button className="add-cart-btn" onClick={handleAddToCart} disabled={isLoading}>
            {isLoading ? 'Đang thêm...' : '🛒 Thêm vào giỏ'}
          </button>
        </div>
      </div>

      <h3>{course.name}</h3>
      <p className="price">{course.price.toLocaleString()} VND</p>
      <button className="detail-btn">Xem chi tiết</button>
    </div>
  );
}
