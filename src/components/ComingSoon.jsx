import React from 'react';

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600 mb-6">
          This page is not available yet. We’re working hard to bring it to you soon!
        </p>
        <div className="animate-bounce text-4xl text-indigo-600">🚧</div>
      </div>
    </div>
  );
};

export default ComingSoon;
