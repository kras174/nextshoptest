import React from 'react';

const Loader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex justify-center items-center ${className}`} role="status" aria-label="Загрузка...">
    <span className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

export default Loader;