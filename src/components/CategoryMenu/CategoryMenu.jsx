// src/components/CategoryMenu/CategoryMenu.jsx
import React from 'react';
import { categories } from '../../data/categories';
import { subcategories } from '../../data/subcategories';
import './CategoryMenu.css';

export default function CategoryMenu({ categoryId, onSelect, isOpen }) {
  const selectedCategory = categories.find((c) => c.id === categoryId);
  if (!selectedCategory) return null;

  const relatedSubcategories = subcategories.filter(
    (sub) => sub.categoryId === categoryId
  );

  return (
    <div className={`category-dropdown ${isOpen ? 'open' : ''}`}>
      <ul className="subcategory-list vertical">
        {relatedSubcategories.map((sub) => (
          <li
            key={sub.id}
            className="subcategory-item"
            onClick={() => onSelect(categoryId, sub.id)}
          >
            {sub.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
