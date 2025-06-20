import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-300 rounded animate-pulse ${className}`} />
);

export default Skeleton;
