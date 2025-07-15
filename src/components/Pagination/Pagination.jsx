import React from 'react';
import './Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);

      const target = document.querySelector('.scroll-to-top-target');
      if (target) {
        target.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
