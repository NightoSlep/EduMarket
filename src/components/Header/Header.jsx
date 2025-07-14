import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaLightbulb } from 'react-icons/fa';
import { fetchCategories } from '../../api/categories';
import useResponsiveMenu from '../../hooks/useResponsiveMenu';
import CategoryMenu from '../CategoryMenu/CategoryMenu';
import LoginModal from '../LoginModal/LoginModal';
import './Header.css';

export default function Header({ onCategorySelect }) {
  const navigate = useNavigate();
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
    expandedCategories,
    toggleCategory,
    navRef,
    setExpandedCategories,
  } = useResponsiveMenu();

  useEffect(() => {
    fetchCategories().then(setCategories).catch((err) => {
      console.error("Lỗi tải categories:", err);
    });
  }, []);

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    setExpandedCategories([]);
    navigate('/');
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
        onClick={handleLikedClick}
      >
        Sở thích
      </Link>
      <Link
        to={user ? "/history" : "#"}
        className="menu-item"
        onClick={handleHistoryClick}
      >
        Lịch sử xem
      </Link>
      <FaLightbulb className="lightbulb-icon desktop" title="Gợi ý thông minh!" />
    </>
  );

  const renderMobileNav = () => (
    <>
      {categories.map((cat) => {
        const isOpen = expandedCategories.includes(cat.id);
        return (
          <div key={cat.id}>
            <div
              className="menu-item category-toggle"
              onClick={() => toggleCategory(cat.id)}
            >
              {cat.name} {isOpen ? '▾' : '▸'}
            </div>
            <div className={`category-submenu-wrapper ${isOpen ? 'open' : ''}`}>
              <CategoryMenu
                categoryId={cat.id}
                onSelect={(catId, subId) => {
                  onCategorySelect(catId, subId);
                  setMenuOpen(false);
                  setExpandedCategories([]);
                }}
                isOpen={isOpen}
              />
            </div>
          </div>
        );
      })}
      <Link
        to={user ? "/liked" : "#"}
        className="menu-item"
        onClick={handleLikedClick}
      >
        Sở thích
      </Link>
      <Link
        to={user ? "/history" : "#"}
        className="menu-item"
        onClick={handleHistoryClick}
      >
        Lịch sử xem
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
            setExpandedCategories([]);
          }}
        >
          Đăng nhập
        </div>
      )}
    </>
  );

  const handleLikedClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("❗ Bạn cần đăng nhập để xem danh sách yêu thích!");
    } else {
      setMenuOpen(false);
      setExpandedCategories([]);
    }
  };

  const handleHistoryClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("❗ Bạn cần đăng nhập để xem lịch sử!");
    } else {
      setMenuOpen(false);
      setExpandedCategories([]);
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-area">
          <div className="logo-link" onClick={handleLogoClick}>
            <div className="logo">Edu</div>
          </div>
          {isMobile && (
            <FaLightbulb className="lightbulb-icon mobile" title="Gợi ý thông minh!" />
          )}
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
                setExpandedCategories([]);
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
                    setExpandedCategories([]);
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
