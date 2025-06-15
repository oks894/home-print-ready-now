
import React from 'react';

export const SimpleLoader = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div 
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};
