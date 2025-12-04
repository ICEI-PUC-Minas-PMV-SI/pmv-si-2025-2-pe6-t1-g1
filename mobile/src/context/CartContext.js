import React, { createContext, useState } from 'react';

export const CartContext = createContext({
  cart: [], // array of { product, quantity }
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  adjustQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // addItem(item, qty=1): if product already exists (by id/name) increment quantity
  function addItem(product, qty = 1) {
    setCart(prev => {
      // find by id or nameItem/title
      const key = (p) => (p && (p.id || p.nameItem || p.name || p.title));
      const prodKey = key(product);
      if (!prodKey) {
        return [...prev, { product, quantity: qty }];
      }
      const idx = prev.findIndex(entry => key(entry.product) === prodKey);
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });
  }

  function removeItem(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function updateQuantity(index, quantity) {
    setCart(prev => {
      const next = prev.slice();
      if (quantity <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = { ...next[index], quantity };
      }
      return next;
    });
  }

  function adjustQuantity(index, delta) {
    setCart(prev => {
      const next = prev.slice();
      const current = next[index];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = { ...current, quantity: newQty };
      }
      return next;
    });
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, adjustQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
