import { useState, useEffect } from 'react';

export default function useCart() {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course) => {
    setCartItems((prev) => {
      const exists = prev.find((c) => c.id === course.id);
      if (exists) return prev;
      return [...prev, course];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { cartItems, addToCart, removeFromCart };
}
