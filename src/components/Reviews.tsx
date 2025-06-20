"use client"
import React from 'react';

export type Review = {
  id: number;
  text: string;
};

export type ReviewsProps = {
  reviews: Review[];
  loading: boolean;
  error: string | null;
};

const Reviews: React.FC<ReviewsProps> = React.memo(({ reviews, loading, error }) => (
  <section className="flex justify-center" aria-labelledby="reviews-heading">
    <h2 id="reviews-heading" className="sr-only">Отзывы</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mx-auto mb-4" role="list">
      {loading && <li aria-live="polite">Загрузка отзывов...</li>}
      {error && <li className="text-red-500" role="alert">Ошибка: {error}</li>}
      {!loading && !error && reviews.length === 0 && <li>Нет отзывов</li>}
      {reviews.map((review) => (
        <li
          key={review.id}
          className="bg-[#e0e0e0] rounded-lg p-4 text-gray-900 text-left shadow min-h-[140px]"
          tabIndex={0}
          aria-label={`Отзыв: ${review.text.replace(/<[^>]+>/g, '').slice(0, 30)}...`}
        >
          <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: review.text }} />
        </li>
      ))}
    </ul>
  </section>
));

Reviews.displayName = 'Reviews';

export default Reviews;
