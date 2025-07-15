import { useState, useEffect } from 'react';
import { fetchCourseById } from '../api/courses';

export default function useCart() {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (id) => {
    const exists = cartItems.find((c) => c.id === id);
    if (exists) return;

    try {
      const course = await fetchCourseById(id);
      if (course) {
        setCartItems((prev) => [...prev, course]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch course by ID:', id, err);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { cartItems, addToCart, removeFromCart };
}
