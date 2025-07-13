import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaLightbulb } from 'react-icons/fa';
import { fetchCategories } from '../../api/categories';
import useResponsiveMenu from '../../hooks/useResponsiveMenu';
import CategoryMenu from '../CategoryMenu/CategoryMenu';
import LoginModal from '../LoginModal/LoginModal';
import './Header.css';

export default function Header({ onCategorySelect, onResetFilters }) {
  const [showLogin, setShowLogin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("loggedInUser");
    return stored ? JSON.parse(stored) : null;
  });

  const {
    isMobile,
    menuOpen,
    setMenuOpen,
    expandedCategory,
    toggleCategory,
    navRef,
    setExpandedCategory,
  } = useResponsiveMenu();

  useEffect(() => {
    fetchCategories().then(setCategories).catch((err) => {
      console.error("Lỗi tải categories:", err);
    });
  }, []);

  const handleLogoClick = () => {
    onResetFilters();
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setMenuOpen(false);
    setExpandedCategory(null);
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
      <Link
        to={user ? "/liked" : "#"}
        className="menu-item liked-link"
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            alert("❗ Bạn cần đăng nhập để xem danh sách yêu thích!");
          }
        }}
      >
        ❤️ Yêu thích
      </Link>
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
        to={user ? "/liked" : "#"}
        className="menu-item"
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            alert("❗ Bạn cần đăng nhập để xem danh sách yêu thích!");
          } else {
            setMenuOpen(false);
            setExpandedCategory(null);
          }
        }}
      >
        Yêu thích
      </Link>
      {user ? (
        <div className="menu-item logout-item" onClick={handleLogout}>
          Đăng xuất
        </div>
      ) : (
        <div
          className="menu-item"
          onClick={() => {
            setShowLogin(true);
            setMenuOpen(false);
            setExpandedCategory(null);
          }}
        >
          Đăng nhập
        </div>
      )}
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

        <div className="right-controls">
          {isMobile && user && (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6a0dad&color=fff&size=32`}
              alt="avatar"
              className="avatar mobile-avatar"
            />
          )}
          <button
            className="menu-toggle"
            onClick={() => {
              const nextState = !menuOpen;
              setMenuOpen(nextState);
              if (!nextState) {
                setExpandedCategory(null);
              }
            }}
          >
            <FaBars size={22} />
          </button>
        </div>

        <nav ref={navRef} className={`navigation ${menuOpen ? 'open' : ''}`}>
          <div className="nav-left">
            {isMobile ? renderMobileNav() : renderDesktopNav()}
          </div>

          {!isMobile && (
            <div className="nav-right">
              {user ? (
                <div className="user-info desktop-dropdown">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6a0dad&color=fff&size=32`}
                    alt="avatar"
                    className="avatar"
                  />
                  <span className="user-name">{user.name}</span>
                  <div className="user-dropdown">
                    <div className="dropdown-item" onClick={handleLogout}>Đăng xuất</div>
                  </div>
                </div>
              ) : (
                <span
                  className="menu-item login-tab"
                  onClick={() => {
                    setShowLogin(true);
                    setMenuOpen(false);
                    setExpandedCategory(null);
                  }}
                >
                  Đăng nhập
                </span>
              )}
            </div>
          )}
        </nav>
      </div>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
}
