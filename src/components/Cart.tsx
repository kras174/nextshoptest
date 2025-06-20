"use client"
import React, { useState, useEffect } from 'react';
import { useCart } from './Products';
import { useProductsMap } from './Products';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const [show, setShow] = useState(open);
  useEffect(() => {
    if (open) setShow(true);
    else setTimeout(() => setShow(false), 250);
  }, [open]);
  return (
    <>
      {(open || show) && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div
            className={`bg-[#e0e0e0] rounded-2xl shadow-2xl p-7 max-w-xs w-full text-center relative transition-all duration-300
              ${open ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
            style={{ minWidth: 280 }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

function formatPhoneFromDigits(digits: string) {
  if (!digits) return '';
  let res = '+7';
  if (digits.length > 1) res += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) res += ') ' + digits.slice(4, 7);
  if (digits.length >= 7) res += '-' + digits.slice(7, 9);
  if (digits.length >= 9) res += '-' + digits.slice(9, 11);
  return res;
}

const Cart = () => {
  const { cart, setCart } = useCart();
  const { productsMap } = useProductsMap();
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = productsMap[Number(id)];
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const [phoneDigits, setPhoneDigits] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('phone');
        const digits = saved ? saved.replace(/\D/g, '') : '';
        return digits;
      } catch {}
    }
    return '';
  });
  const phone = formatPhoneFromDigits(phoneDigits);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('phone', phoneDigits);
    }
  }, [phoneDigits]);

  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Если поле очищено — оставить пустым
    const digits = raw.replace(/\D/g, '');
    if (digits === '' || raw === '' || raw === '+') {
      setPhoneDigits('');
      return;
    }
    let result = digits;
    // Всегда начинать с 7
    if (result.startsWith('8')) result = '7' + result.slice(1);
    if (!result.startsWith('7')) result = '7' + result;
    setPhoneDigits(result.slice(0, 11));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneDigits || phoneDigits.length !== 11) {
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
          phone: phoneDigits,
          cart: Object.entries(cart).map(([id, qty]) => ({ id: Number(id), quantity: qty })),
        }),
      });
      if (!res.ok) throw new Error('Ошибка при отправке заказа');
      setModalOpen(true);
      setCart({});
      setPhoneDigits('');
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
    <section className="bg-[#e0e0e0] rounded-lg shadow p-3 sm:p-6 max-w-full sm:max-w-lg mx-auto w-full">
      <h2 className="text-lg font-semibold mb-4 text-black">Добавленные товары</h2>
      {cartItems.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <div className="bg-[#d1d1d1] rounded p-2 text-black text-xs sm:text-sm min-w-[340px]">
            <div className="grid grid-cols-[1fr_48px_64px_28px] sm:grid-cols-[1fr_60px_80px_32px] items-center font-semibold pb-1 border-b border-[#c0c0c0] mb-1 text-xs uppercase tracking-wide">
              <span>Товар</span>
              <span className="text-center">Кол-во</span>
              <span className="text-right">Сумма</span>
              <span></span>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_48px_64px_28px] sm:grid-cols-[1fr_60px_80px_32px] items-center py-1 border-b border-[#c0c0c0] last:border-b-0">
                <span className="truncate pr-2">{item.title}</span>
                <span className="text-center">x{item.qty}</span>
                <span className="text-right">{item.price * item.qty}₽</span>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-600 text-lg font-bold px-1 sm:px-2"
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
            className="border rounded px-2 sm:px-3 py-2 bg-white text-black flex-1 text-sm sm:text-base"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={handlePhoneChange}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-black text-white rounded px-4 sm:px-6 py-2 font-semibold text-sm sm:text-base h-full"
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
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-2">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-xl font-bold text-black">Заказ успешно оформлен!</div>
          <div className="text-gray-700 text-sm">Спасибо за ваш заказ.<br/>Мы свяжемся с вами в ближайшее время.</div>
          <button className="mt-2 bg-black text-white rounded px-6 py-2 font-semibold" onClick={() => setModalOpen(false)}>
            Закрыть
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Cart;
