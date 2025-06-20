"use client"
import React, { createContext, useContext } from 'react';
import type { ProductsContextType, CartContextType } from '../types';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

export const ProductsContext = createContext<ProductsContextType>({ productsMap: {}, setProductsMap: () => {} });
export const useProductsMap = () => useContext(ProductsContext);

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useLocalStorageState<Record<number, number>>('cart', {});

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
};
