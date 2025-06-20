"use client"
import React, { useState } from 'react';
import Cart, { CartItem } from './Cart';
import { useCart, useProductsMap } from './ProductsContext';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { submitOrder as apiSubmitOrder } from '../api/shopApi';

function formatPhoneFromDigits(digits: string) {
  if (!digits) return '';
  let res = '+7';
  if (digits.length > 1) res += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) res += ') ' + digits.slice(4, 7);
  if (digits.length >= 7) res += '-' + digits.slice(7, 9);
  if (digits.length >= 9) res += '-' + digits.slice(9, 11);
  return res;
}

const CartContainer = React.memo(() => {
  const { cart, setCart } = useCart();
  const { productsMap } = useProductsMap();
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = productsMap[Number(id)];
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const [phoneDigits, setPhoneDigits] = useLocalStorageState<string>('phone', '');
  const phone = formatPhoneFromDigits(phoneDigits);

  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');
    if (digits === '' || raw === '' || raw === '+') {
      setPhoneDigits('');
      return;
    }
    let result = digits;
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
      await apiSubmitOrder({
        phone: phoneDigits,
        cart: Object.entries(cart).map(([id, qty]) => ({ id: Number(id), quantity: qty })),
      });
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

  const cartItems: CartItem[] = Object.entries(cart)
    .map(([id, qty]) => {
      const product = productsMap[Number(id)];
      if (!product) return null;
      return { id, title: product.title, price: product.price, qty };
    })
    .filter((item): item is CartItem => Boolean(item));

  return (
    <Cart
      cartItems={cartItems}
      totalPrice={totalPrice}
      phone={phone}
      error={error}
      loading={loading}
      modalOpen={modalOpen}
      onPhoneChange={handlePhoneChange}
      onRemove={handleRemove}
      onSubmit={handleSubmit}
      onModalClose={() => setModalOpen(false)}
    />
  );
});

CartContainer.displayName = 'CartContainer';

export default CartContainer;
