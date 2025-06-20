import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from './Cart';

describe('Cart', () => {
  const getDefaultProps = () => ({
    cartItems: [
      { id: '1', title: 'Product 1', price: 100, qty: 2 },
      { id: '2', title: 'Product 2', price: 200, qty: 1 },
    ],
    totalPrice: 400,
    phone: '+7 (999) 123-45-67',
    error: '',
    loading: false,
    modalOpen: false,
    onPhoneChange: jest.fn(),
    onRemove: jest.fn(),
    onSubmit: jest.fn((e) => e.preventDefault()),
    onModalClose: jest.fn(),
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders cart items and total price', () => {
    const props = getDefaultProps();
    render(<Cart {...props} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('400₽')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const props = getDefaultProps();
    render(<Cart {...props} />);
    const removeButtons = screen.getAllByLabelText('Удалить Product 1 из корзины');
    expect(removeButtons[0]).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(removeButtons[0]);
      jest.runAllTimers();
    });
    expect(props.onRemove).toHaveBeenCalledWith('1');
  });

  it('calls onPhoneChange when phone input changes', () => {
    const props = getDefaultProps();
    render(<Cart {...props} />);
    const input = screen.getByPlaceholderText('+7 (___) ___-__-__');
    fireEvent.change(input, { target: { value: '+7 (999) 111-22-33' } });
    expect(props.onPhoneChange).toHaveBeenCalled();
  });

  it('calls onSubmit when form is submitted', () => {
    const props = getDefaultProps();
    render(<Cart {...props} />);
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it('shows error message', () => {
    const props = getDefaultProps();
    render(<Cart {...props} error="Ошибка" />);
    expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
  });
});
