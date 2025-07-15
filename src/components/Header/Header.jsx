import './Header.css';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaLightbulb, FaShoppingCart } from 'react-icons/fa';
import { fetchCategories } from '../../api/categories';
import { fetchLikedCourses } from '../../api/likedCourses';
import { fetchWatchHistory } from '../../api/watchHistory';
import { fetchCourses } from '../../api/courses';
import useResponsiveMenu from '../../hooks/useResponsiveMenu';
import CategoryMenu from '../CategoryMenu/CategoryMenu';
import LoginModal from '../LoginModal/LoginModal';
import useCart from '../../hooks/useCart';

export default function Header({ onCategorySelect, onSuggestCourses  }) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("loggedInUser");
    return stored ? JSON.parse(stored) : null;
  });
  const { cartItems } = useCart();

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

  const handleSuggestClick = async () => {
    if (!user) {
      setShowLogin(true);
      toast.info("Vui lòng đăng nhập để xem gợi ý cá nhân!");
      return;
    }
    try {
      const [history, liked, allCourses] = await Promise.all([
        fetchWatchHistory(user.id),
        fetchLikedCourses(user.id),
        fetchCourses(),
      ]);
      const likedIds = liked.map(l => l.courseId);
      const watchedIds = history.map(h => h.courseId);

      const interactedCourseIds = [...new Set([...likedIds, ...watchedIds])];
      const interactedCourses = allCourses.filter(c => interactedCourseIds.includes(c.id));
      const relatedSubIds = [
        ...new Set(interactedCourses.map(c => c.subcategoryId)),
      ];
      const suggestedCourses = allCourses.filter(course =>
        relatedSubIds.includes(course.subcategoryId)
      );
      onSuggestCourses(suggestedCourses);
      toast.success("🎯 Hiển thị gợi ý phù hợp với bạn!");
    } catch (err) {
      console.error("Lỗi khi tải gợi ý:", err);
      toast.error("Lỗi khi tải gợi ý!");
    }
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    localStorage.removeItem("watchHistory");
    localStorage.removeItem("cartItems");
    setUser(null);
    setMenuOpen(false);
    setExpandedCategories([]);
    navigate('/');
    toast.success("👋 Đăng xuất thành công!");
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
      <FaLightbulb
        className="lightbulb-icon desktop"
        title="Gợi ý thông minh!"
        onClick={handleSuggestClick}
        style={{ cursor: 'pointer' }}
      />
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
            <div
              className="menu-item lightbulb-wrapper"
              onClick={handleSuggestClick}
              title="Gợi ý thông minh!"
            >
              <FaLightbulb className="lightbulb-icon mobile" />
              <span className="bulb-label">Gợi ý</span>
            </div>
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
              {user && (
                <div className="cart-wrapper">
                  <Link to="/cart" className="cart-icon" title="Giỏ hàng">
                    <FaShoppingCart />
                    {cartItems.length > 0 && (
                      <span className="cart-badge">{cartItems.length}</span>
                    )}
                  </Link>
                </div>
              )}
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
