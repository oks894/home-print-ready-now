
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

interface Milestone {
  count: number;
  timestamp: number;
}

// Utility to get/save a persistent user ID for presence
function getPresenceUserId() {
  let uid = localStorage.getItem('presence_uid');
  if (!uid) {
    uid = `user_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem('presence_uid', uid);
  }
  return uid;
}

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(1);
  const [isConnected, setIsConnected] = useState(true);
  const [peakCount, setPeakCount] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitializedRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useRef(getPresenceUserId());
  const adaptiveConfig = getAdaptiveConfig();

  const cleanup = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (channelRef.current) {
      try {
        channelRef.current.untrack().catch(() => {});
        supabase.removeChannel(channelRef.current);
        console.info('useOnlineUsers: Channel cleanup complete');
      } catch (error) {
        console.warn('useOnlineUsers: Cleanup warning:', error);
      }
      channelRef.current = null;
    }
  };

  const connectToPresence = () => {
    cleanup();
    setIsConnected(false);

    try {
      // Optimized for slow servers - use simpler channel configuration
      const channelId = `presence_${Math.floor(Date.now() / 10000)}`; // Group connections in 10-second windows
      channelRef.current = supabase.channel(channelId, {
        config: {
          presence: {
            key: userId.current,
          },
          broadcast: { self: false }, // Reduce bandwidth
          postgres_changes: [], // Disable postgres changes for better performance
        },
      });

      const userStatus = {
        user_id: userId.current,
        online_at: new Date().toISOString(),
        device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      };

      console.log('[useOnlineUsers] Connecting with optimized config:', userStatus);

      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          if (channelRef.current) {
            const newState = channelRef.current.presenceState();
            const count = Math.max(Object.keys(newState).length, 1);

            setOnlineCount(count);
            setIsConnected(true);

            setPeakCount(prev => Math.max(prev, count));
            
            // Simplified milestone logic for slow servers
            if (count % 10 === 0 && count > 0 && !adaptiveConfig.ultraLightMode) {
              setMilestones(prev => {
                const exists = prev.some(m => m.count === count);
                if (!exists) {
                  return [...prev.slice(-3), { count, timestamp: Date.now() }]; // Keep only last 3
                }
                return prev;
              });
            }

            console.debug('[useOnlineUsers] Presence synced - count:', count);
          }
        })
        .on('presence', { event: 'join' }, ({ key }) => {
          console.log('[useOnlineUsers] User joined:', key);
        })
        .on('presence', { event: 'leave' }, ({ key }) => {
          console.log('[useOnlineUsers] User left:', key);
        })
        .subscribe(async (status) => {
          console.log('[useOnlineUsers] Channel status:', status);
          if (status === 'SUBSCRIBED' && channelRef.current) {
            try {
              await channelRef.current.track(userStatus);
              setIsConnected(true);
              console.log('[useOnlineUsers] Successfully tracking presence');

              // Optimized heartbeat for slow servers
              if (adaptiveConfig.simplifiedUI) {
                heartbeatRef.current = setInterval(async () => {
                  if (channelRef.current) {
                    try {
                      await channelRef.current.track({
                        ...userStatus,
                        last_heartbeat: new Date().toISOString(),
                      });
                    } catch (error) {
                      console.warn('[useOnlineUsers] Heartbeat failed:', error);
                    }
                  }
                }, 45000); // Longer interval for slow servers
              }
            } catch (error) {
              console.error('[useOnlineUsers] Track error:', error);
              setIsConnected(false);
              const retryDelay = adaptiveConfig.ultraLightMode ? 8000 : 5000; // Longer delays for slow servers
              reconnectTimeoutRef.current = setTimeout(connectToPresence, retryDelay);
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            setIsConnected(false);
            const retryDelay = adaptiveConfig.ultraLightMode ? 10000 : 6000; // Extended retry delays
            reconnectTimeoutRef.current = setTimeout(connectToPresence, retryDelay);
            console.warn('[useOnlineUsers] Connection lost, will retry in', retryDelay / 1000, 's:', status);
          }
        });

    } catch (error) {
      console.error('[useOnlineUsers] Setup error:', error);
      setIsConnected(false);
      setOnlineCount(1);
      reconnectTimeoutRef.current = setTimeout(connectToPresence, 8000); // Longer initial retry
    }
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Optimized data loading for slow servers
    try {
      const savedPeakCount = localStorage.getItem('online_users_peak');
      if (savedPeakCount) {
        setPeakCount(parseInt(savedPeakCount, 10));
      }

      if (!adaptiveConfig.ultraLightMode) {
        const savedMilestones = localStorage.getItem('online_users_milestones');
        if (savedMilestones) {
          setMilestones(JSON.parse(savedMilestones));
        }
      }
    } catch (e) {
      console.error('useOnlineUsers: Error loading saved data:', e);
    }

    // Delayed connection start for slow servers
    const connectionDelay = adaptiveConfig.ultraLightMode ? 2000 : 1000;
    reconnectTimeoutRef.current = setTimeout(connectToPresence, connectionDelay);

    return () => {
      console.log('useOnlineUsers: Cleaning up...');
      cleanup();
      isInitializedRef.current = false;
    };
  }, []);

  // Throttled persistence for slow servers
  useEffect(() => {
    if (peakCount > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('online_users_peak', peakCount.toString());
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [peakCount]);

  useEffect(() => {
    if (milestones.length > 0 && !adaptiveConfig.ultraLightMode) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('online_users_milestones', JSON.stringify(milestones));
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [milestones, adaptiveConfig.ultraLightMode]);

  return { onlineCount, isConnected, peakCount, milestones };
};
