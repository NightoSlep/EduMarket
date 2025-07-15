import React from 'react';
import './WatchHistorySkeleton.css';

export default function WatchHistorySkeleton({ count = 6 }) {
  return (
    <div className="watch-history-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-left">
            <div className="skeleton-title" />
            <div className="skeleton-category" />
          </div>
          <div className="skeleton-time" />
        </div>
      ))}
    </div>
  );
}
