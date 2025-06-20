"use client"
import React from 'react';

export type Product = {
	id: number;
	image_url: string;
	title: string;
	description: string;
	price: number;
};

export type ProductsProps = {
	products: Product[];
	cart: Record<number, number>;
	loading: boolean;
	error: string | null;
	hasMore: boolean;
	onBuy: (id: number) => void;
	onIncrement: (id: number) => void;
	onDecrement: (id: number) => void;
	onInput: (id: number, value: string) => void;
	loaderRef: React.RefObject<HTMLDivElement>;
	animatedIds: Set<number>;
};

const Products: React.FC<ProductsProps> = React.memo(({
	products,
	cart,
	loading,
	error,
	hasMore,
	onBuy,
	onIncrement,
	onDecrement,
	onInput,
	loaderRef,
	animatedIds,
}) => (
	<section aria-labelledby="products-heading">
		<h2 id="products-heading" className="sr-only">Товары</h2>
		<ul id="products-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-7" role="list">
			{products.map((product) => {
				const qty = cart[product.id] || 0;
				const isVisible = animatedIds.has(product.id);
				return (
					<li
						key={product.id}
						className={`bg-[#e0e0e0] rounded-lg shadow flex flex-col items-center p-2 sm:p-4 text-black min-h-[270px] sm:min-h-[370px] transition-all duration-500 ease-out
							${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
						tabIndex={0}
						aria-label={`Товар: ${product.title}`}
					>
						<img src={product.image_url} alt={product.title} className="w-full h-28 sm:h-40 object-cover rounded mb-2 sm:mb-3 bg-white" />
						<h3 className="font-bold text-sm sm:text-base mb-1 text-center w-full truncate">{product.title}</h3>
						<p className="text-gray-700 text-xs mb-2 text-center w-full break-words max-h-12 sm:max-h-16 overflow-hidden">{product.description}</p>
						<div className="font-semibold mb-2 text-center w-full text-xs sm:text-base">цена: {product.price}₽</div>
						{qty === 0 ? (
							<button
								className="bg-black text-white rounded w-full py-1.5 sm:py-2 mt-auto font-semibold text-xs sm:text-base transition hover:bg-gray-800"
								onClick={() => onBuy(product.id)}
								aria-label={`Купить ${product.title}`}
							>
								купить
							</button>
						) : (
							<div className="flex items-center gap-1 sm:gap-2 mt-auto w-full justify-center" role="group" aria-label={`Управление количеством для ${product.title}`}>
								<button
									className="bg-black text-white px-2 sm:px-3 py-1 rounded text-base sm:text-lg font-bold"
									onClick={() => onDecrement(product.id)}
									aria-label={`Уменьшить количество для ${product.title}`}
								>
									-
								</button>
								<input
									type="number"
									min={1}
									className="w-10 sm:w-14 text-center border rounded bg-white text-black font-semibold text-xs sm:text-base"
									value={qty}
									onChange={(e) => onInput(product.id, e.target.value)}
									aria-label={`Количество для ${product.title}`}
								/>
								<button
									className="bg-black text-white px-2 sm:px-3 py-1 rounded text-base sm:text-lg font-bold"
									onClick={() => onIncrement(product.id)}
									aria-label={`Увеличить количество для ${product.title}`}
								>
									+
								</button>
							</div>
						)}
					</li>
				);
			})}
		</ul>
		{error && <div className="text-red-500 mt-4" role="alert">Ошибка: {error}</div>}
		{loading && <div className="mt-4 text-white" aria-live="polite">Загрузка...</div>}
		<div ref={loaderRef} aria-hidden="true" />
		{!hasMore && !loading && <div className="text-center text-gray-400 mt-4">Больше товаров нет</div>}
	</section>
));

Products.displayName = 'Products';

export default Products;
