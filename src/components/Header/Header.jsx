import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaLightbulb } from 'react-icons/fa';
import useResponsiveMenu from '../../hooks/useResponsiveMenu';
import CategoryMenu from '../CategoryMenu/CategoryMenu';
import { categories } from '../../data/categories';
import './Header.css';

export default function Header({ onCategorySelect, onResetFilters }) {
  const navigate = useNavigate(); 
  const {
    isMobile,
    menuOpen,
    setMenuOpen,
    expandedCategory,
    toggleCategory,
    navRef,
    setExpandedCategory,
  } = useResponsiveMenu();

  const handleLogoClick = () => {
    onResetFilters();
    window.scrollTo(0, 0);
  };

  const renderDesktopNav = () => (
    <>
      {categories.map((cat) => (
<div key={cat.id} className="nav-item category-hover">
  <span className="menu-item">{cat.name} ▾</span>
  <div className="category-dropdown">
    <CategoryMenu categoryId={cat.id} onSelect={onCategorySelect} />
  </div>
</div>

      ))}
      <Link to="/about" className="menu-item">Về chúng tôi</Link>
      <FaLightbulb className="lightbulb-icon desktop" title="Gợi ý thông minh!" />
    </>
  );

  const renderMobileNav = () => (
    <>
      {categories.map((cat) => (
        <div key={cat.id}>
          <div
            className="menu-item category-toggle"
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.name} {expandedCategory === cat.id ? '▾' : '▸'}
          </div>
          <div className={`category-submenu-wrapper ${expandedCategory === cat.id ? 'open' : ''}`}>
            <CategoryMenu
              categoryId={cat.id}
              onSelect={(catId, subId) => {
                onCategorySelect(catId, subId);
                setMenuOpen(false);
              }}
              isOpen={expandedCategory === cat.id}
            />
          </div>
        </div>
      ))}

      <Link 
        to="/about" 
        className="menu-item" 
        onClick={() => {
          setMenuOpen(false);
          setExpandedCategory(null);
          navigate('/about');
        }}
      >
        Về chúng tôi
      </Link>
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

        <button className="menu-toggle" onClick={() => {
          const nextState = !menuOpen;
          setMenuOpen(nextState);
          if (!nextState) {
            setExpandedCategory(null);
          }
        }}>
          <FaBars size={22} />
        </button>

        <nav ref={navRef} className={`navigation ${menuOpen ? 'open' : ''}`}>
          <div className="nav-left">
            {isMobile ? renderMobileNav() : renderDesktopNav()}
          </div>
          <div className="nav-right">
            <Link 
              to="/login" 
              className="menu-item login-tab"
              onClick={() => {
                setMenuOpen(false);
                setExpandedCategory(null);
              }}
            >
              Đăng nhập
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
