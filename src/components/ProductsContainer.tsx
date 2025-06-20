"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Products, { Product } from './Products';
import { useCart, useProductsMap } from './ProductsContext';
import { useAppearAnimation } from '../hooks/useAppearAnimation';

const PAGE_SIZE = 20;

type ApiResponse = {
  page: number;
  amount: number;
  total: number;
  items: Product[];
};

const ProductsContainer = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);
  const { cart, setCart } = useCart();
  const { setProductsMap } = useProductsMap();
  const animatedIds = useAppearAnimation(products.map(p => p.id)) as Set<number>;

  const fetchProducts = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://o-complex.com:1337/products?page=${pageNum}&page_size=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data: ApiResponse = await res.json();
      setProducts((prev) => [...prev, ...data.items]);
      setProductsMap((prev) => {
        const newMap = { ...prev };
        data.items.forEach((item) => { newMap[item.id] = item; });
        return newMap;
      });
      setHasMore(data.items.length === PAGE_SIZE);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    } finally {
      setLoading(false);
    }
  }, [setProductsMap]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [hasMore, loading]);

  const handleBuy = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: 1 }));
  };

  const handleIncrement = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id: number) => {
    setCart((prev) => {
      const qty = (prev[id] || 0) - 1;
      if (qty <= 0) {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      }
      return { ...prev, [id]: qty };
    });
  };

  const handleInput = (id: number, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setCart((prev) => ({ ...prev, [id]: num }));
    } else if (value === '') {
      setCart((prev) => {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      });
    }
  };

  return (
    <Products
      products={products}
      cart={cart}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onBuy={handleBuy}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      onInput={handleInput}
      loaderRef={loader as React.RefObject<HTMLDivElement>}
      animatedIds={animatedIds}
    />
  );
};

export default ProductsContainer;
