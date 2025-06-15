
import { useEffect } from 'react';
import { useOnlineUsers } from './useOnlineUsers';

export const useLiveTracking = (pageName?: string) => {
  const { onlineCount, isConnected, peakCount, milestones } = useOnlineUsers();

  useEffect(() => {
    // Track page views and user activity
    const trackActivity = () => {
      console.log(`Live tracking active on ${pageName || window.location.pathname}`);
    };

    // Track when user becomes active/inactive
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('User became active');
        trackActivity();
      }
    };

    // Set up tracking
    trackActivity();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Track periodic activity
    const interval = setInterval(trackActivity, 30000); // Every 30 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [pageName]);

  return {
    onlineCount,
    isConnected,
    peakCount,
    milestones,
    isTracking: true
  };
};
