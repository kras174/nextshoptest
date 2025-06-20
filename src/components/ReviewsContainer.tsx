"use client"
import React, { useEffect, useState } from 'react';
import Reviews, { Review } from './Reviews';

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

  return <Reviews reviews={reviews} loading={loading} error={error} />;
};

export default ReviewsContainer;
