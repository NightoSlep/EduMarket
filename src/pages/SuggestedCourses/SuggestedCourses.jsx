import React, { useEffect, useState } from 'react';
import { fetchSuggestedCourses } from '../api/suggestions';
import { Link, useNavigate } from 'react-router-dom';
import './SuggestedCourses.css';

export default function SuggestedCourses() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSuggestedCourses(user.id).then(data => {
      setSuggestions(data);
      setLoading(false);
    });
  }, [user, navigate]);

  return (
    <div className="suggested-page">
      <h2>🎯 Gợi ý khóa học dành cho bạn</h2>
      {loading ? (
        <p>Đang tải gợi ý...</p>
      ) : suggestions.length === 0 ? (
        <p>Hiện chưa có gợi ý nào. Hãy xem hoặc thích vài khóa học nhé!</p>
      ) : (
        <div className="course-list">
          {suggestions.map(course => (
            <div key={course.id} className="course-card">
              <img src={course.image} alt={course.name} />
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p className="price">{course.price.toLocaleString()} VND</p>
              <Link to={`/courses/${course.id}`} className="view-btn">Xem chi tiết</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
