
import { useState, useEffect } from 'react';

export const usePeakCount = () => {
  const [peakCount, setPeakCount] = useState(0);

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

  // Never call hooks in this function!
  const updatePeakCount = (currentCount: number) => {
    setPeakCount(prev => Math.max(prev, currentCount));
  };

  // Always return shape
  return { peakCount, updatePeakCount };
};
