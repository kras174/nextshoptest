"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createContext, useContext } from 'react';

type Product = {
	id: number;
	image_url: string;
	title: string;
	description: string;
	price: number;
};

type ApiResponse = {
	page: number;
	amount: number;
	total: number;
	items: Product[];
};

type CartContextType = {
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

export type ProductsContextType = {
	productsMap: Record<number, Product>;
	setProductsMap: React.Dispatch<React.SetStateAction<Record<number, Product>>>;
};

export const ProductsContext = createContext<ProductsContextType>({ productsMap: {}, setProductsMap: () => { } });
export const useProductsMap = () => useContext(ProductsContext);

const PAGE_SIZE = 20;

const Products = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const loader = useRef<HTMLDivElement | null>(null);
	const { cart, setCart } = useCart();
	const { setProductsMap } = useProductsMap();
	const [animatedIds, setAnimatedIds] = useState<Set<number>>(new Set());

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

	useEffect(() => {
		// Анимировать только новые товары
		products.forEach((product) => {
			if (!animatedIds.has(product.id)) {
				setTimeout(() => {
					setAnimatedIds((prev) => new Set(prev).add(product.id));
				}, 50);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products]);

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
		<section>
			<h2 className="sr-only">Товары</h2>
			<div id="products-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-7">
				{products.map((product) => {
					const qty = cart[product.id] || 0;
					const isVisible = animatedIds.has(product.id);
					return (
						<div
							key={product.id}
							className={`bg-[#e0e0e0] rounded-lg shadow flex flex-col items-center p-2 sm:p-4 text-black min-h-[270px] sm:min-h-[370px] transition-all duration-500 ease-out
								${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
						>
							<img src={product.image_url} alt={product.title} className="w-full h-28 sm:h-40 object-cover rounded mb-2 sm:mb-3 bg-white" />
							<h3 className="font-bold text-sm sm:text-base mb-1 text-center w-full truncate">{product.title}</h3>
							<p className="text-gray-700 text-xs mb-2 text-center w-full break-words max-h-12 sm:max-h-16 overflow-hidden">{product.description}</p>
							<div className="font-semibold mb-2 text-center w-full text-xs sm:text-base">цена: {product.price}₽</div>
							{qty === 0 ? (
								<button className="bg-black text-white rounded w-full py-1.5 sm:py-2 mt-auto font-semibold text-xs sm:text-base transition hover:bg-gray-800" onClick={() => handleBuy(product.id)}>
									купить
								</button>
							) : (
								<div className="flex items-center gap-1 sm:gap-2 mt-auto w-full justify-center">
									<button className="bg-black text-white px-2 sm:px-3 py-1 rounded text-base sm:text-lg font-bold" onClick={() => handleDecrement(product.id)}>-</button>
									<input
										type="number"
										min={1}
										className="w-10 sm:w-14 text-center border rounded bg-white text-black font-semibold text-xs sm:text-base"
										value={qty}
										onChange={(e) => handleInput(product.id, e.target.value)}
									/>
									<button className="bg-black text-white px-2 sm:px-3 py-1 rounded text-base sm:text-lg font-bold" onClick={() => handleIncrement(product.id)}>+</button>
								</div>
							)}
						</div>
					);
				})}
			</div>
			{error && <div className="text-red-500 mt-4">Ошибка: {error}</div>}
			{loading && <div className="mt-4 text-white">Загрузка...</div>}
			<div ref={loader} />
			{!hasMore && !loading && <div className="text-center text-gray-400 mt-4">Больше товаров нет</div>}
		</section>
	);
};

export default Products;
