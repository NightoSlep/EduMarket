import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './PriceFilter.css';

export default function PriceFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleDropdown = () => {
    setOpen(prev => !prev);
  };

  const handleOptionChange = (e) => {
    onChange(e.target.value);
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
      <button className="price-button" onClick={toggleDropdown}>
        Giá <FaChevronDown className="chevron-icon" />
      </button>

      <div className={`price-dropdown ${open ? 'open' : ''}`}>
        <label className="price-option">
          <input
            type="radio"
            name="price"
            value="all"
            checked={value === 'all'}
            onChange={handleOptionChange}
          />
          <span>Tất cả</span>
        </label>
        <label className="price-option">
          <input
            type="radio"
            name="price"
            value="low"
            checked={value === 'low'}
            onChange={handleOptionChange}
          />
          <span>Dưới 500.000 VND</span>
        </label>
        <label className="price-option">
          <input
            type="radio"
            name="price"
            value="mid"
            checked={value === 'mid'}
            onChange={handleOptionChange}
          />
          <span>500.000 – 1.000.000 VND</span>
        </label>
        <label className="price-option">
          <input
            type="radio"
            name="price"
            value="high"
            checked={value === 'high'}
            onChange={handleOptionChange}
          />
          <span>Trên 1.000.000 VND</span>
        </label>
      </div>
    </div>
  );
}
