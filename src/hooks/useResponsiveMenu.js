import { useEffect, useRef, useState } from 'react';

export default function useResponsiveMenu() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const navRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        !e.target.closest('.menu-toggle')
      ) {
        setMenuOpen(false);
        setExpandedCategories([]);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  return {
    isMobile,
    menuOpen,
    setMenuOpen,
    expandedCategories,
    toggleCategory,
    navRef,
    setExpandedCategories,
  };
}
