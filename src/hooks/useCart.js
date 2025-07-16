import { useContext } from "react";
import { CartContext } from "../context/cart/CartContext.js";

export const useCart = () => useContext(CartContext);
