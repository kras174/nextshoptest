"use client"
import React, { useEffect, useState } from 'react';

type Review = {
  id: number;
  text: string;
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://o-complex.com:1337/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
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
  );
};

export default Reviews;
