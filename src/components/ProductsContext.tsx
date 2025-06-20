"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Product = {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
};

export type ProductsContextType = {
  productsMap: Record<number, Product>;
  setProductsMap: React.Dispatch<React.SetStateAction<Record<number, Product>>>;
};

export const ProductsContext = createContext<ProductsContextType>({ productsMap: {}, setProductsMap: () => {} });
export const useProductsMap = () => useContext(ProductsContext);

export type CartContextType = {
  cart: Record<number, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<number, number>>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Record<number, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cart');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
};
