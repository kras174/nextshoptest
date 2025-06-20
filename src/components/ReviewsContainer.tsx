"use client"
import React, { useEffect, useState } from 'react';
import Reviews, { Review } from './Reviews';
import Loader from './Loader';
import Skeleton from './Skeleton';

const ReviewsContainer = () => {
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
    <>
      {loading && reviews.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mx-auto mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] w-full" />
          ))}
        </div>
      ) : null}
      {loading && reviews.length === 0 && <Loader className="mt-8" />}
      <Reviews reviews={reviews} loading={loading} error={error} />
    </>
  );
};

export default ReviewsContainer;
