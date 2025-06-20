"use client"
import CartContainer from "@/components/CartContainer";
import Header from "@/components/Header";
import ProductsContainer from "@/components/ProductsContainer";
import { CartProvider, ProductsContext, ProductsContextType } from "@/components/ProductsContext";
import ReviewsContainer from "@/components/ReviewsContainer";
import React, { useState } from "react";

type Product = ProductsContextType["productsMap"][number];

export default function Home() {
  const [productsMap, setProductsMap] = useState<Record<number, Product>>({});
  return (
    <CartProvider>
      <ProductsContext.Provider value={{ productsMap, setProductsMap }}>
        <main className="min-h-screen bg-[#232323]">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col gap-6 sm:gap-10">
            <Header />
            <ReviewsContainer />
            <CartContainer />
            <ProductsContainer />
          </div>
        </main>
      </ProductsContext.Provider>
    </CartProvider>
  );
}
