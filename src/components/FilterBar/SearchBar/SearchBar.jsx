import React, { useEffect, useRef, useState } from 'react';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa'; 

export default function SearchBar({  value, onSearchChange }) {
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const hoverTimer = useRef(null);


  const handleIconClick = () => {
    if (!focused) {
      inputRef.current?.focus();
    }
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    setTimeout(() => {
      if (!wrapperRef.current?.matches(':hover')) {
        setExpanded(false);
      }
    }, 100);
  };

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      inputRef.current?.focus();
    }, 1200);
  };  

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    if (!focused) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    setExpanded(focused);
  }, [focused]);

  return (
    <div
      className={`search-wrapper ${expanded ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="search-icon-btn" onClick={handleIconClick}>
         <FaSearch />
      </button>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}
