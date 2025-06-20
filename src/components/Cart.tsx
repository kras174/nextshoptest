"use client"
import React, { useState, useRef, useEffect } from 'react';
import InputMask from 'react-input-mask';
import type { InputHTMLAttributes } from 'react';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

export type CartProps = {
  cartItems: CartItem[];
  totalPrice: number;
  phone: string;
  error: string;
  loading: boolean;
  modalOpen: boolean;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onModalClose: () => void;
};

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const [show, setShow] = React.useState(open);
  React.useEffect(() => {
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

const Cart: React.FC<CartProps> = ({
  cartItems,
  totalPrice,
  phone,
  error,
  loading,
  modalOpen,
  onPhoneChange,
  onRemove,
  onSubmit,
  onModalClose,
}) => {
  const [removing, setRemoving] = useState<string | null>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);

  const handleRemoveWithFade = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      onRemove(id);
      setRemoving(null);
    }, 300);
  };

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
              <div
                key={item.id}
                className={`grid grid-cols-[1fr_48px_64px_28px] sm:grid-cols-[1fr_60px_80px_32px] items-center py-1 border-b border-[#c0c0c0] last:border-b-0 transition-all duration-300 ${removing === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              >
                <span className="truncate pr-2">{item.title}</span>
                <span className="text-center">x{item.qty}</span>
                <span className="text-right">{item.price * item.qty}₽</span>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-600 text-lg font-bold px-1 sm:px-2"
                  onClick={() => handleRemoveWithFade(item.id)}
                  aria-label="Удалить товар"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <div className="flex flex-row items-center gap-2">
          <InputMask
            mask="+7 (999) 999-99-99"
            maskChar={"_"}
            value={phone}
            onChange={onPhoneChange}
            disabled={loading}
          >
            {(inputProps: InputHTMLAttributes<HTMLInputElement>) => (
              <input
                {...inputProps}
                ref={phoneInputRef}
                id="phone"
                name="phone"
                type="tel"
                className="border rounded px-2 sm:px-3 py-2 bg-white text-black flex-1 text-sm sm:text-base"
                placeholder="+7 (___) ___-__-__"
                autoComplete="tel"
              />
            )}
          </InputMask>
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
      <Modal open={modalOpen} onClose={onModalClose}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-2">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-xl font-bold text-black">Заказ успешно оформлен!</div>
          <div className="text-gray-700 text-sm">Спасибо за ваш заказ.<br/>Мы свяжемся с вами в ближайшее время.</div>
          <button className="mt-2 bg-black text-white rounded px-6 py-2 font-semibold" onClick={onModalClose}>
            Закрыть
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Cart;
