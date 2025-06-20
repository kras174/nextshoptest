"use client"
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Products, { CartProvider, ProductsContext } from "@/components/Products";
import Reviews from "@/components/Reviews";
import React, { useState } from "react";
import type { ProductsContextType } from "@/components/Products";

type Product = ProductsContextType["productsMap"][number];

export default function Home() {
  const [productsMap, setProductsMap] = useState<Record<number, Product>>({});
  return (
    <CartProvider>
      <ProductsContext.Provider value={{ productsMap, setProductsMap }}>
        <main className="min-h-screen bg-[#232323]">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col gap-6 sm:gap-10">
            <Header />
            <Reviews />
            <Cart />
            <Products />
          </div>
        </main>
      </ProductsContext.Provider>
    </CartProvider>
  );
}
