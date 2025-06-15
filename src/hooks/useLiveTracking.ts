
import { useEffect, useRef } from 'react';
import { useOnlineUsers } from './useOnlineUsers';

export const useLiveTracking = (pageName?: string) => {
  const { onlineCount, isConnected, peakCount, milestones } = useOnlineUsers();
  const lastActivityRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const currentPage = pageName || window.location.pathname;
    
    // Throttle activity tracking to reduce overhead
    const trackActivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivityRef.current < 30000) return; // 30 second throttle
      
      lastActivityRef.current = currentTime;
      console.log(`Live tracking: ${currentPage} - ${onlineCount} users online`);
    };

    // Optimized visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackActivity();
      }
    };

    // Initial tracking
    trackActivity();
    
    // Set up event listeners with passive options for better performance
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    
    // Reduced frequency interval
    intervalRef.current = setInterval(trackActivity, 60000); // Every 60 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pageName, onlineCount]); // Only re-run when page or count changes

  return {
    onlineCount,
    isConnected,
    peakCount,
    milestones,
    isTracking: true
  };
};
