import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/categories';
import { fetchSubcategories } from '../../api/subcategories';
import './CategoryMenu.css';

export default function CategoryMenu({ categoryId, onSelect, isOpen }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, subs] = await Promise.all([
          fetchCategories(),
          fetchSubcategories()
        ]);
        setCategories(cats);
        setSubcategories(subs);
      } catch (err) {
        console.error('Lỗi khi tải danh mục hoặc danh mục con:', err);
      }
    };
    loadData();
  }, []);

  const selectedCategory = categories.find(c => c.id === categoryId);
  if (!selectedCategory) return null;

  const relatedSubcategories = subcategories.filter(
    sub => sub.categoryId === categoryId
  );

  return (
    <div className={`category-dropdown ${isOpen ? 'open' : ''}`}>
      <ul className="subcategory-list">
        {relatedSubcategories.map(sub => (
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
