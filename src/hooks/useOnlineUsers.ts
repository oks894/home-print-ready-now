
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Milestone {
  count: number;
  timestamp: number;
}

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(1); // Start with 1 (current user)
  const [isConnected, setIsConnected] = useState(false);
  const [peakCount, setPeakCount] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitializedRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const maxRetries = 3;
  const baseRetryDelay = 2000;

  const cleanup = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (channelRef.current) {
      channelRef.current.untrack().catch(() => {});
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };

  const connectToPresence = () => {
    if (retryCountRef.current >= maxRetries) {
      console.log('useOnlineUsers: Max retries reached, using fallback mode');
      setOnlineCount(1);
      setIsConnected(false);
      return;
    }

    cleanup();

    try {
      const channelId = `online_users_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      channelRef.current = supabase.channel(channelId);

      const userStatus = {
        user_id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        online_at: new Date().toISOString(),
        page: window.location.pathname,
      };

      console.log('useOnlineUsers: Attempting connection, retry:', retryCountRef.current);

      // Set shorter timeout for faster failure detection
      const connectionTimeout = setTimeout(() => {
        console.warn('useOnlineUsers: Connection timeout, retrying...');
        retryConnection();
      }, 5000);

      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          clearTimeout(connectionTimeout);
          
          if (channelRef.current) {
            const newState = channelRef.current.presenceState();
            const count = Math.max(Object.keys(newState).length, 1);
            
            setOnlineCount(count);
            setIsConnected(true);
            retryCountRef.current = 0; // Reset retry count on success
            
            // Update peak count
            setPeakCount(prev => Math.max(prev, count));

            // Check for milestones (reduced frequency)
            if (count % 10 === 0 && count > 0) {
              const milestoneThresholds = [10, 25, 50, 100, 250, 500];
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
          }
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('useOnlineUsers: User joined, count:', newPresences.length);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('useOnlineUsers: User left, count:', leftPresences.length);
        })
        .subscribe(async (status) => {
          console.log('useOnlineUsers: Status:', status);
          
          if (status === 'SUBSCRIBED' && channelRef.current) {
            try {
              await channelRef.current.track(userStatus);
              console.log('useOnlineUsers: Successfully tracking presence');
            } catch (error) {
              console.error('useOnlineUsers: Track error:', error);
              retryConnection();
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            clearTimeout(connectionTimeout);
            console.error('useOnlineUsers: Connection failed with status:', status);
            retryConnection();
          }
        });

    } catch (error) {
      console.error('useOnlineUsers: Setup error:', error);
      retryConnection();
    }
  };

  const retryConnection = () => {
    if (retryCountRef.current >= maxRetries) return;

    retryCountRef.current++;
    const delay = baseRetryDelay * Math.pow(2, retryCountRef.current - 1);
    
    setIsConnected(false);
    
    console.log(`useOnlineUsers: Retrying in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connectToPresence();
    }, delay);
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Load persisted data
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

    // Start connection
    connectToPresence();

    return () => {
      console.log('useOnlineUsers: Cleaning up...');
      cleanup();
      isInitializedRef.current = false;
      retryCountRef.current = 0;
    };
  }, []);

  // Persist data with throttling
  useEffect(() => {
    if (peakCount > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('online_users_peak', peakCount.toString());
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [peakCount]);

  useEffect(() => {
    if (milestones.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('online_users_milestones', JSON.stringify(milestones));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [milestones]);

  return { onlineCount, isConnected, peakCount, milestones };
};
