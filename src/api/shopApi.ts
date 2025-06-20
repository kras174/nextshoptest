export type Product = {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
};

export type Review = {
  id: number;
  text: string;
};

export type OrderRequest = {
  phone: string;
  cart: { id: number; quantity: number }[];
};

export type ProductsResponse = {
  page: number;
  amount: number;
  total: number;
  items: Product[];
};

const API_BASE = 'http://o-complex.com:1337';

export async function fetchProducts(page: number, pageSize: number): Promise<ProductsResponse> {
  const res = await fetch(`${API_BASE}/products?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function submitOrder(order: OrderRequest): Promise<void> {
  const res = await fetch(`${API_BASE}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Ошибка при отправке заказа');
}