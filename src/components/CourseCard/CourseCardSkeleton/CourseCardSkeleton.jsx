import React from 'react';
import './CourseCardSkeleton.css';

export default function CourseCardSkeleton() {
  return (
    <>
      <div className="ccs-container ccs-desktop">
        <div className="ccs-image" />
        <div className="ccs-title" />
        <div className="ccs-price" />
        <div className="ccs-button" />
      </div>

      <div className="ccs-container-mobile ccs-mobile">
        <div className="ccs-mobile-left">
          <div className="ccs-mobile-image skeleton-bg" />
        </div>
        <div className="ccs-mobile-right">
          <div className="ccs-price-add-row">
            <div className="ccs-price skeleton-bg" />
            <div className="ccs-add-btn skeleton-bg" />
          </div>
          <div className="ccs-title skeleton-bg" />
          <div className="ccs-category skeleton-bg" />
        </div>
      </div>
    </>
  );
}
