import React from 'react';
import SearchBar from './SearchBar/SearchBar'
import PriceFilter from './PriceFilter/PriceFilter';
import './FilterBar.css';

export default function FilterBar({ title, searchTerm, setSearchTerm, priceRange, setPriceRange, disabledOptions = {} }) {
  return (
    <div className="search-filter-row">
      <h2 className="course-title">{title}</h2>
      <div className="filter-group">
        <SearchBar value={searchTerm} onSearchChange={setSearchTerm} />
        {priceRange !== undefined && setPriceRange !== undefined && (
          <PriceFilter
            value={priceRange}
            onChange={setPriceRange}
            disabledOptions={disabledOptions}
          />
        )}
      </div>
    </div>
  );
}
