import React, { useState } from "react";
import { getCategoryMap } from "../../utils/CategoryUtil";
import { courses } from "../../data/course";
import { FaChevronRight } from "react-icons/fa";
import "./CategoryMenu.css";

export default function CategoryMenu({ onSelect }) {
  const categories = getCategoryMap(courses);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="category-dropdown">
      <ul className="category-list">
        {categories.map(({ category, subcategories }) => (
          <li
            key={category}
            className="category-item"
            onMouseEnter={() => setHovered(category)}
            onClick={() => setHovered(hovered === category ? null : category)}
          >
            <span className="category-name">
              {category} <FaChevronRight className="chevron-icon" />
            </span>
            
            {hovered === category && (
              <ul className="subcategory-list">
                {subcategories.map((sub) => (
                  <li
                    key={sub}
                    className="subcategory-item"
                    onClick={() => onSelect(category, sub)}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
