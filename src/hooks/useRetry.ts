
import { useState, useCallback } from 'react';

export const useRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const retryWithBackoff = useCallback(async (fn: () => Promise<void>, maxRetries = 2) => {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        setIsRetrying(i > 0);
        await fn();
        setIsRetrying(false);
        return;
      } catch (error) {
        lastError = error;
        if (i === maxRetries - 1) {
          setIsRetrying(false);
          throw error;
        }
        
        // Simple exponential backoff with max delay
        const delay = Math.min(1000 * Math.pow(2, i), 3000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    setIsRetrying(false);
    throw lastError;
  }, []);

  return { isRetrying, retryWithBackoff, setIsRetrying };
};
