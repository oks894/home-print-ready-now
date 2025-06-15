
import { useState } from 'react';

export const useRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const retryWithBackoff = async (fn: () => Promise<void>, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fn();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        setIsRetrying(true);
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        setIsRetrying(false);
      }
    }
  };

  return { isRetrying, retryWithBackoff, setIsRetrying };
};
