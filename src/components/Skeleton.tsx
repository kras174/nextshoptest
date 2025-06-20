import React from 'react';

const Skeleton: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`bg-gray-300 rounded animate-pulse ${className}`} />
));
Skeleton.displayName = 'Skeleton';

export default Skeleton;
