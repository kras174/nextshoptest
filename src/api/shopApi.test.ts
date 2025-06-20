import { fetchProducts, fetchReviews, submitOrder } from './shopApi';

describe('shopApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetchProducts returns data on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ page: 1, amount: 2, total: 2, items: [{ id: 1, image_url: '', title: 'P', description: '', price: 1 }] }),
    });
    const data = await fetchProducts(1, 10);
    expect(data.items[0].title).toBe('P');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/products?page=1&page_size=10'));
  });

  it('fetchProducts throws on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(fetchProducts(1, 10)).rejects.toThrow('Failed to fetch products');
  });

  it('fetchReviews returns data on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: 1, text: 'review' }]),
    });
    const data = await fetchReviews();
    expect(data[0].text).toBe('review');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/reviews'));
  });

  it('fetchReviews throws on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(fetchReviews()).rejects.toThrow('Failed to fetch reviews');
  });

  it('submitOrder calls fetch with correct params', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    await submitOrder({ phone: '123', cart: [{ id: 1, quantity: 2 }] });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/order'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '123', cart: [{ id: 1, quantity: 2 }] }),
      })
    );
  });

  it('submitOrder throws on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(submitOrder({ phone: '123', cart: [] })).rejects.toThrow('Ошибка при отправке заказа');
  });
});
