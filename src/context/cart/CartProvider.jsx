import { useState, useEffect } from "react";
import { fetchCourseById } from "../../api/courses";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
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
      console.error("❌ Failed to fetch course:", err);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
