
import { useEffect, useState, useRef } from 'react';
import { getAdaptiveConfig } from '@/utils/connectionUtils';
import { usePresenceConnection } from './usePresenceConnection';
import { useMilestones } from './useMilestones';
import { usePeakCount } from './usePeakCount';

// This hook tracks the number of online users with Supabase realtime presence
export const useOnlineUsers = () => {
  // Hooks ALWAYS at the top, never inside conditionals or returns
  const [onlineCount, setOnlineCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const isInitializedRef = useRef(false);
  const adaptiveConfig = getAdaptiveConfig();
  const { connectToPresence, cleanup } = usePresenceConnection();
  const { milestones, addMilestone } = useMilestones();
  const { peakCount, updatePeakCount } = usePeakCount();

  // Safe handlers declared up here
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
    // Only logic, never hooks, in effects/branches
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const connectionDelay = adaptiveConfig.ultraLightMode ? 3000 : 1500;
    const timeoutId = setTimeout(() => {
      connectToPresence(handlePresenceSync, handleConnectionChange);
    }, connectionDelay);

    return () => {
      console.info('useOnlineUsers: Cleaning up...');
      clearTimeout(timeoutId);
      cleanup();
      isInitializedRef.current = false;
    };
  // Dependency includes only pure/constant things and hook outputs
  }, [connectToPresence, cleanup, adaptiveConfig.ultraLightMode]);

  // No conditional hook usage: always returns the same shape
  return { onlineCount, isConnected, peakCount, milestones };
};
