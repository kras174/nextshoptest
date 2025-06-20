import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart, { CartProps } from './Cart';

describe('Cart', () => {
  const cartItems = [
    { id: '1', title: 'Product 1', price: 100, qty: 2 },
    { id: '2', title: 'Product 2', price: 200, qty: 1 },
  ];
  const defaultProps: CartProps = {
    cartItems,
    totalPrice: 400,
    phone: '+7 (999) 123-45-67',
    error: '',
    loading: false,
    modalOpen: false,
    onPhoneChange: jest.fn(),
    onRemove: jest.fn(),
    onSubmit: jest.fn((e) => e.preventDefault()),
    onModalClose: jest.fn(),
  };

  it('renders cart items and total price', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('400₽')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<Cart {...defaultProps} />);
    const removeButtons = screen.getAllByLabelText(/удалить/i);
    fireEvent.click(removeButtons[0]);
    expect(defaultProps.onRemove).toHaveBeenCalledWith('1');
  });

  it('calls onPhoneChange when phone input changes', () => {
    render(<Cart {...defaultProps} />);
    const input = screen.getByPlaceholderText('+7 (___) ___-__-__');
    fireEvent.change(input, { target: { value: '+7 (999) 111-22-33' } });
    expect(defaultProps.onPhoneChange).toHaveBeenCalled();
  });

  it('calls onSubmit when form is submitted', () => {
    render(<Cart {...defaultProps} />);
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Cart {...defaultProps} error="Ошибка" />);
    expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
  });
});
