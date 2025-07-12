import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaLightbulb } from 'react-icons/fa';
import useResponsiveMenu from '../../hooks/useResponsiveMenu';
import CategoryMenu from '../CategoryMenu/CategoryMenu';
import './Header.css';

export default function Header({ onCategorySelect, onResetFilters }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const {
    isMobile,
    menuOpen,
    setMenuOpen,
    expandedCategory,
    toggleCategory,
    navRef,
  } = useResponsiveMenu();

  const handleLogoClick = () => {
    onResetFilters();
    window.scrollTo(0, 0);
  };

  const renderDesktopNav = () => (
    <>
      {['Khóa học', 'Tài liệu'].map((cat) => (
        <div
          key={cat}
          className="nav-item category-hover"
          onMouseEnter={() => setHoveredCategory(cat)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <span className="nav-link">{cat} ▾</span>
          {hoveredCategory === cat && (
            <div className="dropdown-wrapper">
              <CategoryMenu category={cat} onSelect={onCategorySelect} />
            </div>
          )}
        </div>
      ))}
      <Link to="/about" className="nav-link">Về chúng tôi</Link>
      <FaLightbulb className="lightbulb-icon desktop" title="Gợi ý thông minh!" />
    </>
  );

  const renderMobileNav = () => (
    <>
      {['Khóa học', 'Tài liệu'].map((cat) => (
        <div key={cat} className="nav-item category-toggle" onClick={() => toggleCategory(cat)}>
          <span className="nav-link">{cat} {expandedCategory === cat ? '▾' : '▸'}</span>
          {expandedCategory === cat && (
            <div className="category-submenu">
              <CategoryMenu category={cat} onSelect={onCategorySelect} />
            </div>
          )}
        </div>
      ))}
      <Link to="/about" className="nav-link">Về chúng tôi</Link>
    </>
  );

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-area">
          <Link to="/" className="logo-link" onClick={handleLogoClick}>
            <div className="logo">Edu</div>
          </Link>
          {isMobile && <FaLightbulb className="lightbulb-icon mobile" title="Gợi ý thông minh!" />}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={22} />
        </button>

        <nav ref={navRef} className={`navigation ${menuOpen ? 'open' : ''}`}>
          <div className="nav-left">
            {isMobile ? renderMobileNav() : renderDesktopNav()}
          </div>
          <div className="nav-right">
            <Link to="/login" className="nav-link login-tab">Đăng nhập</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
