import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Products from './Products';

describe('Products', () => {
  const products = [
    {
      id: 1,
      image_url: 'img1.jpg',
      title: 'Product 1',
      description: 'Desc 1',
      price: 100,
    },
    {
      id: 2,
      image_url: 'img2.jpg',
      title: 'Product 2',
      description: 'Desc 2',
      price: 200,
    },
  ];
  const animatedIds = new Set([1, 2]);
  const noop = () => {};
  const loaderRef = React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>;

  it('renders product cards', () => {
    render(
      <Products
        products={products}
        cart={{}}
        loading={false}
        error={null}
        hasMore={false}
        onBuy={noop}
        onIncrement={noop}
        onDecrement={noop}
        onInput={noop}
        loaderRef={loaderRef}
        animatedIds={animatedIds}
      />
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('shows loading and error states', () => {
    render(
      <Products
        products={[]}
        cart={{}}
        loading={true}
        error={"Ошибка"}
        hasMore={false}
        onBuy={noop}
        onIncrement={noop}
        onDecrement={noop}
        onInput={noop}
        loaderRef={loaderRef}
        animatedIds={animatedIds}
      />
    );
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
    expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
  });

  it('calls onBuy when buy button is clicked', () => {
    const onBuy = jest.fn();
    render(
      <Products
        products={products}
        cart={{}}
        loading={false}
        error={null}
        hasMore={false}
        onBuy={onBuy}
        onIncrement={noop}
        onDecrement={noop}
        onInput={noop}
        loaderRef={loaderRef}
        animatedIds={animatedIds}
      />
    );
    fireEvent.click(screen.getAllByText(/купить/i)[0]);
    expect(onBuy).toHaveBeenCalledWith(1);
  });

  it('calls onIncrement and onDecrement for quantity controls', () => {
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();
    render(
      <Products
        products={products}
        cart={{ 1: 2 }}
        loading={false}
        error={null}
        hasMore={false}
        onBuy={noop}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onInput={noop}
        loaderRef={loaderRef}
        animatedIds={animatedIds}
      />
    );
    fireEvent.click(screen.getAllByText('+')[0]);
    fireEvent.click(screen.getAllByText('-')[0]);
    expect(onIncrement).toHaveBeenCalledWith(1);
    expect(onDecrement).toHaveBeenCalledWith(1);
  });
});
