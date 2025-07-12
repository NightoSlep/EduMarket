import React from 'react';
import { getCategoryMap } from '../../utils/CategoryUtil';
import { courses } from '../../data/course';
import './CategoryMenu.css';

export default function CategoryMenu({ category, onSelect }) {
  const categories = getCategoryMap(courses);
  const selected = categories.find((c) => c.category === category);

  if (!selected) return null;

  return (
    <div className="category-dropdown">
      <ul className="subcategory-list vertical">
        {selected.subcategories.map((sub) => (
          <li
            key={sub}
            className="subcategory-item"
            onClick={() => onSelect(category, sub)}
          >
            {sub}
          </li>
        ))}
      </ul>
    </div>
  );
}
