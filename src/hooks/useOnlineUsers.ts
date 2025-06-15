
import { useEffect, useState, useRef } from 'react';
import { getAdaptiveConfig } from '@/utils/connectionUtils';
import { usePresenceConnection } from './usePresenceConnection';
import { useMilestones } from './useMilestones';
import { usePeakCount } from './usePeakCount';

// Ensure all hooks are called ALWAYS, no return statements before hooks
export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const isInitializedRef = useRef(false);
  const adaptiveConfig = getAdaptiveConfig();

  const { connectToPresence, cleanup } = usePresenceConnection();
  const { milestones, addMilestone } = useMilestones();
  const { peakCount, updatePeakCount } = usePeakCount();

  const handlePresenceSync = (count: number) => {
    setOnlineCount(count);
    updatePeakCount(count);
    addMilestone(count);
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      setOnlineCount(1);
    }
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const connectionDelay = adaptiveConfig.ultraLightMode ? 3000 : 1500;
    const timeoutId = setTimeout(() => {
      connectToPresence(handlePresenceSync, handleConnectionChange);
    }, connectionDelay);

    return () => {
      console.log('useOnlineUsers: Cleaning up...');
      clearTimeout(timeoutId);
      cleanup();
      isInitializedRef.current = false;
    };
  }, [connectToPresence, cleanup, adaptiveConfig.ultraLightMode]);

  return { onlineCount, isConnected, peakCount, milestones };
};
