
import { useState, useEffect } from 'react';

export const usePeakCount = () => {
  const [peakCount, setPeakCount] = useState(0);

  // Load saved peak count on mount
  useEffect(() => {
    try {
      const savedPeakCount = localStorage.getItem('online_users_peak');
      if (savedPeakCount) {
        setPeakCount(parseInt(savedPeakCount, 10));
      }
    } catch (e) {
      console.warn('usePeakCount: Error loading saved peak count:', e);
    }
  }, []);

  // Save peak count with throttling
  useEffect(() => {
    if (peakCount > 0) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('online_users_peak', peakCount.toString());
        } catch (e) {
          console.warn('usePeakCount: Failed to save peak count:', e);
        }
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [peakCount]);

  const updatePeakCount = (currentCount: number) => {
    setPeakCount(prev => Math.max(prev, currentCount));
  };

  return {
    peakCount,
    updatePeakCount
  };
};
