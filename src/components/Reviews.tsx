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
  <section className="flex justify-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mx-auto mb-4">
      {loading && <div>Загрузка отзывов...</div>}
      {error && <div className="text-red-500">Ошибка: {error}</div>}
      {!loading && !error && reviews.length === 0 && <div>Нет отзывов</div>}
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-[#e0e0e0] rounded-lg p-4 text-gray-900 text-left shadow min-h-[140px]"
        >
          <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: review.text }} />
        </div>
      ))}
    </div>
  </section>
));

Reviews.displayName = 'Reviews';

export default Reviews;
