"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "agasaro_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.product_id === product.product_id);

      if (existing) {
        return current.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          product_id: product.product_id,
          product_name: product.product_name,
          unit_price: product.unit_price,
          available_quantity: product.available_quantity,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((current) =>
      current.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.product_id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  let total = 0;
  for (const item of items) {
    total += Number(item.unit_price) * Number(item.quantity);
  }

  const value = { items, addItem, updateQuantity, removeItem, clearCart, total };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
