
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
  const [isConnected, setIsConnected] = useState(false); // Start as disconnected
  const [peakCount, setPeakCount] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitializedRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useRef(getPresenceUserId());
  const adaptiveConfig = getAdaptiveConfig();
  const connectionAttemptsRef = useRef(0);

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
    // Limit connection attempts to prevent infinite loops
    if (connectionAttemptsRef.current > 5) {
      console.warn('useOnlineUsers: Too many connection attempts, stopping');
      setIsConnected(false);
      setOnlineCount(1);
      return;
    }

    connectionAttemptsRef.current += 1;
    cleanup();
    setIsConnected(false);

    try {
      // Very simple channel configuration for slow servers
      const channelId = `presence_${Math.floor(Date.now() / 30000)}`; // 30-second windows
      channelRef.current = supabase.channel(channelId, {
        config: {
          presence: {
            key: userId.current,
          },
          broadcast: { self: false },
        },
      });

      const userStatus = {
        user_id: userId.current,
        online_at: new Date().toISOString(),
        device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      };

      console.log('[useOnlineUsers] Connecting attempt', connectionAttemptsRef.current, userStatus);

      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          if (channelRef.current) {
            const newState = channelRef.current.presenceState();
            const count = Math.max(Object.keys(newState).length, 1);

            setOnlineCount(count);
            setIsConnected(true);
            connectionAttemptsRef.current = 0; // Reset on successful connection

            setPeakCount(prev => Math.max(prev, count));
            
            // Very simple milestone logic
            if (count % 10 === 0 && count > 0 && !adaptiveConfig.ultraLightMode) {
              setMilestones(prev => {
                const exists = prev.some(m => m.count === count);
                if (!exists) {
                  return [...prev.slice(-2), { count, timestamp: Date.now() }]; // Keep only last 2
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

              // Very light heartbeat for slow servers
              if (!adaptiveConfig.ultraLightMode) {
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
                }, 60000); // 1 minute interval
              }
            } catch (error) {
              console.error('[useOnlineUsers] Track error:', error);
              setIsConnected(false);
              scheduleReconnect();
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            setIsConnected(false);
            scheduleReconnect();
            console.warn('[useOnlineUsers] Connection lost:', status);
          }
        });

    } catch (error) {
      console.error('[useOnlineUsers] Setup error:', error);
      setIsConnected(false);
      setOnlineCount(1);
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    const delay = Math.min(5000 + (connectionAttemptsRef.current * 2000), 30000); // Progressive backoff, max 30s
    console.log('[useOnlineUsers] Scheduling reconnect in', delay / 1000, 's');
    reconnectTimeoutRef.current = setTimeout(connectToPresence, delay);
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Load saved data quietly
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
      console.warn('useOnlineUsers: Error loading saved data:', e);
    }

    // Start connection with delay for slow servers
    const connectionDelay = adaptiveConfig.ultraLightMode ? 3000 : 1500;
    reconnectTimeoutRef.current = setTimeout(connectToPresence, connectionDelay);

    return () => {
      console.log('useOnlineUsers: Cleaning up...');
      cleanup();
      isInitializedRef.current = false;
      connectionAttemptsRef.current = 0;
    };
  }, []);

  // Throttled persistence
  useEffect(() => {
    if (peakCount > 0) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('online_users_peak', peakCount.toString());
        } catch (e) {
          console.warn('Failed to save peak count:', e);
        }
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [peakCount]);

  useEffect(() => {
    if (milestones.length > 0 && !adaptiveConfig.ultraLightMode) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('online_users_milestones', JSON.stringify(milestones));
        } catch (e) {
          console.warn('Failed to save milestones:', e);
        }
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [milestones, adaptiveConfig.ultraLightMode]);

  return { onlineCount, isConnected, peakCount, milestones };
};
