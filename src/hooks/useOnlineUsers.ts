
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  const [isConnected, setIsConnected] = useState(false);
  const [peakCount, setPeakCount] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitializedRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useRef(getPresenceUserId());

  const cleanup = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (channelRef.current) {
      try {
        channelRef.current.untrack().catch(() => {});
        supabase.removeChannel(channelRef.current);
        // Enhanced log for debugging
        console.info('useOnlineUsers: Channel cleanup complete');
      } catch (error) {
        console.warn('useOnlineUsers: Cleanup warning:', error);
      }
      channelRef.current = null;
    }
  };

  const connectToPresence = () => {
    cleanup();

    try {
      const channelId = `online_users`;
      channelRef.current = supabase.channel(channelId);

      const userStatus = {
        user_id: userId.current,
        online_at: new Date().toISOString(),
        page: window.location.pathname,
      };

      // Logging for debugging reconnections & errors
      console.log('[useOnlineUsers] Attempting to join presence:', userStatus);

      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          if (channelRef.current) {
            const newState = channelRef.current.presenceState();
            const count = Math.max(Object.keys(newState).length, 1);

            setOnlineCount(count);
            setIsConnected(true);

            setPeakCount(prev => Math.max(prev, count));
            // Milestone logic
            if (count % 10 === 0 && count > 0) {
              const milestoneThresholds = [10, 25, 50, 100];
              milestoneThresholds.forEach(threshold => {
                if (count >= threshold) {
                  setMilestones(prev => {
                    const exists = prev.some(m => m.count === threshold);
                    if (!exists) {
                      return [...prev, { count: threshold, timestamp: Date.now() }];
                    }
                    return prev;
                  });
                }
              });
            }

            console.debug('[useOnlineUsers] Presence synced - count:', count, 'state:', newState);
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('[useOnlineUsers] User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('[useOnlineUsers] User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          console.log('[useOnlineUsers] Channel status:', status);
          if (status === 'SUBSCRIBED' && channelRef.current) {
            try {
              await channelRef.current.track(userStatus);
              setIsConnected(true);
              console.log('[useOnlineUsers] Successfully tracking presence');
            } catch (error) {
              console.error('[useOnlineUsers] Track error:', error);
              setIsConnected(false);
              reconnectTimeoutRef.current = setTimeout(connectToPresence, 3000);
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            setIsConnected(false);
            reconnectTimeoutRef.current = setTimeout(connectToPresence, 3000);
            console.warn('[useOnlineUsers] Connection lost, will retry in 3s:', status);
          }
        });

    } catch (error) {
      console.error('[useOnlineUsers] Setup error:', error);
      setIsConnected(false);
      setOnlineCount(1);
    }
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Persisted data load
    const savedPeakCount = localStorage.getItem('online_users_peak');
    const savedMilestones = localStorage.getItem('online_users_milestones');

    if (savedPeakCount) {
      setPeakCount(parseInt(savedPeakCount, 10));
    }
    if (savedMilestones) {
      try {
        setMilestones(JSON.parse(savedMilestones));
      } catch (e) {
        console.error('useOnlineUsers: Error parsing milestones:', e);
      }
    }

    connectToPresence();

    return () => {
      console.log('useOnlineUsers: Cleaning up...');
      cleanup();
      isInitializedRef.current = false;
    };
  }, []);

  // Persist peak/milestones
  useEffect(() => {
    if (peakCount > 0) {
      localStorage.setItem('online_users_peak', peakCount.toString());
    }
  }, [peakCount]);

  useEffect(() => {
    if (milestones.length > 0) {
      localStorage.setItem('online_users_milestones', JSON.stringify(milestones));
    }
  }, [milestones]);

  return { onlineCount, isConnected, peakCount, milestones };
};
