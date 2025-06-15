
import { useEffect, useRef } from 'react';
import { useOnlineUsers } from './useOnlineUsers';

export const useLiveTracking = (pageName?: string) => {
  const { onlineCount, isConnected, peakCount, milestones } = useOnlineUsers();
  const lastActivityRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentPage = pageName || window.location.pathname;
    
    // Simple activity tracking without throttling initially
    const trackActivity = () => {
      const currentTime = Date.now();
      lastActivityRef.current = currentTime;
      console.log(`Live tracking: ${currentPage} - ${onlineCount} users online`);
    };

    // Track activity on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackActivity();
      }
    };

    // Initial tracking
    trackActivity();
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up interval for periodic tracking (less frequent)
    intervalRef.current = setInterval(trackActivity, 120000); // Every 2 minutes

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pageName, onlineCount]);

  return {
    onlineCount,
    isConnected,
    peakCount,
    milestones,
    isTracking: true
  };
};
