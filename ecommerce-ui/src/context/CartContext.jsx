import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Keep local storage perfectly synced regardless of where data came from
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // When user logs in, sync local cart to remote backend and fetch merged result
  useEffect(() => {
    if (user && token) {
      fetchCartFromBackend();
    }
  }, [user, token]);

  const fetchCartFromBackend = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.data && data.data.items) {
        const formattedCart = data.data.items
          .filter(item => item.product)
          .map(item => ({
            ...item.product,
            quantity: item.quantity
          }));
        setCart(formattedCart);
      }
    } catch (err) {
      console.error("Failed to fetch cart from backend:", err);
    }
  };

  const syncCartWithBackend = async () => {
    try {
      const localItems = JSON.parse(localStorage.getItem("cart")) || [];
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cart/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ localItems }),
      });
      const data = await response.json();
      if (data.success && data.data && data.data.items) {
        // Map backend format back to frontend format
        const formattedCart = data.data.items.map(item => ({
          ...item.product,
          quantity: item.quantity
        }));
        setCart(formattedCart);
      }
    } catch (err) {
      console.error("Failed to sync cart:", err);
    }
  };

  const addToCart = async (product) => {
    // 1. Optimistic UI Update (Immediate feedback)
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // 2. Sync to Backend if logged in
    if (user && token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        });
      } catch (err) {
        console.error("Failed to add to database cart:", err);
      }
    }
  };

  const removeFromCart = async (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));

    if (user && token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cart/remove/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Failed to remove from database cart:", err);
      }
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: newQuantity } : item))
    );

    if (user && token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cart/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: id, quantity: newQuantity }),
        });
      } catch (err) {
        console.error("Failed to update database cart:", err);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
