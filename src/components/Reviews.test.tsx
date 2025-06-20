import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Reviews from './Reviews';

describe('Reviews', () => {
  const reviews = [
    { id: 1, text: 'Great product!' },
    { id: 2, text: 'Not bad.' },
  ];

  it('renders reviews', () => {
    render(<Reviews reviews={reviews} loading={false} error={null} />);
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('Not bad.')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Reviews reviews={[]} loading={true} error={null} />);
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<Reviews reviews={[]} loading={false} error="Ошибка" />);
    expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<Reviews reviews={[]} loading={false} error={null} />);
    expect(screen.getByText(/нет отзывов/i)).toBeInTheDocument();
  });
});
