"use client"
import React, { useState } from 'react';
import { useCart } from './Products';
import { useProductsMap } from './Products';

const phoneRegex = /^\+7\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

const Cart = () => {
  const { cart, setCart } = useCart();
  const { productsMap } = useProductsMap();
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = productsMap[Number(id)];
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneRegex.test(phone)) {
      setError('Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://o-complex.com:1337/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          cart: Object.entries(cart).map(([id, qty]) => ({ id: Number(id), quantity: qty })),
        }),
      });
      if (!res.ok) throw new Error('Ошибка при отправке заказа');
      setModalOpen(true);
      setCart({});
      setPhone('');
    } catch (err) {
      console.error(err);
      setError('Ошибка при отправке заказа. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[Number(id)];
      return newCart;
    });
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = productsMap[Number(id)];
      if (!product) return null;
      return { id, title: product.title, price: product.price, qty };
    })
    .filter((item): item is { id: string; title: string; price: number; qty: number } => Boolean(item));

  return (
    <section className="bg-[#e0e0e0] rounded-lg shadow p-6 max-w-lg mx-auto w-full">
      <h2 className="text-lg font-semibold mb-4 text-black">Добавленные товары</h2>
      {cartItems.length > 0 && (
        <div className="mb-4">
          <div className="bg-[#d1d1d1] rounded p-2 text-black text-sm">
            <div className="grid grid-cols-[1fr_60px_80px_32px] items-center font-semibold pb-1 border-b border-[#c0c0c0] mb-1 text-xs uppercase tracking-wide">
              <span>Товар</span>
              <span className="text-center">Кол-во</span>
              <span className="text-right">Сумма</span>
              <span></span>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_60px_80px_32px] items-center py-1 border-b border-[#c0c0c0] last:border-b-0">
                <span className="truncate pr-2">{item.title}</span>
                <span className="text-center">x{item.qty}</span>
                <span className="text-right">{item.price * item.qty}₽</span>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-600 text-lg font-bold px-2"
                  onClick={() => handleRemove(item.id)}
                  aria-label="Удалить товар"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center gap-2">
          <input
            id="phone"
            name="phone"
            type="tel"
            className="border rounded px-3 py-2 bg-white text-black flex-1"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-black text-white rounded px-6 py-2 font-semibold text-base h-full"
            disabled={loading}
          >
            {loading ? '...' : 'заказать'}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </form>
      <div className="mt-4 flex flex-row justify-between text-black text-base font-semibold">
        <span>Итого:</span>
        <span>{totalPrice}₽</span>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center gap-4">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="text-2xl font-bold text-green-600">Заказ успешно оформлен!</div>
          <div className="text-gray-600">Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</div>
          <button className="mt-4 bg-blue-600 text-white rounded px-4 py-2" onClick={() => setModalOpen(false)}>
            Закрыть
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Cart;
