import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import CategoryMenu from '../CategoryMenu/CategoryMenu';

function Header({ onCategorySelect, onResetFilters }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <header className="app-header">
      <Link 
        to="/" 
        className="logo-link"   
        onClick={() => {
          onResetFilters();            
          window.scrollTo(0, 0);
      }}>
        <div className="logo">Edu</div>
      </Link>

      <nav className="navigation">
        <div
          className="nav-item category-hover"
          onMouseEnter={() => handleMouseEnter('Khóa học')}
          onMouseLeave={handleMouseLeave}
        >
          <span className="nav-link">Khóa học ▾</span>
          {hoveredCategory === 'Khóa học' && (
            <CategoryMenu
              category="Khóa học"
              onSelect={onCategorySelect}
            />
          )}
        </div>

        {/* TÀI LIỆU */}
        <div
          className="nav-item category-hover"
          onMouseEnter={() => handleMouseEnter('Tài liệu')}
          onMouseLeave={handleMouseLeave}
        >
          <span className="nav-link">Tài liệu ▾</span>
          {hoveredCategory === 'Tài liệu' && (
            <CategoryMenu
              category="Tài liệu"
              onSelect={onCategorySelect}
            />
          )}
        </div>

        <Link to="/topics" className="nav-link">Chủ đề</Link>
        <Link to="/about" className="nav-link">Về chúng tôi</Link>
        <Link to="/login" className="nav-link login-tab">Đăng nhập</Link>
      </nav>
    </header>
  );
}

export default Header;
