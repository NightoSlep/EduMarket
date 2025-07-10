import React, { useState, useRef, useEffect } from 'react';
import { MdPriceChange } from 'react-icons/md';
import './PriceFilter.css';

export default function PriceFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleDropdown = () => {
    setOpen(prev => !prev);
  };

  const handleOptionClick = (newValue) => {
    onChange(newValue);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="price-filter-wrapper" ref={ref}>
      <button className="filter-icon-btn" onClick={toggleDropdown}>
        <MdPriceChange size={20} />
      </button>

      {/* Luôn render dropdown */}
      <div className={`price-dropdown ${open ? 'open' : ''}`}>
        <div
          onClick={() => handleOptionClick('all')}
          className={`price-option ${value === 'all' ? 'selected' : ''}`}
        >
          Tất cả
        </div>
        <div
          onClick={() => handleOptionClick('low')}
          className={`price-option ${value === 'low' ? 'selected' : ''}`}
        >
          Dưới 500,000 VND
        </div>
        <div
          onClick={() => handleOptionClick('mid')}
          className={`price-option ${value === 'mid' ? 'selected' : ''}`}
        >
          500,000 – 1,000,000 VND
        </div>
        <div
          onClick={() => handleOptionClick('high')}
          className={`price-option ${value === 'high' ? 'selected' : ''}`}
        >
          Trên 1,000,000 VND
        </div>
      </div>
    </div>
  );
}
