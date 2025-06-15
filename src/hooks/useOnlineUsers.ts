
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Milestone {
  count: number;
  timestamp: number;
}

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [peakCount, setPeakCount] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitializedRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (channelRef.current) {
      try {
        channelRef.current.untrack().catch(() => {});
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn('useOnlineUsers: Cleanup warning:', error);
      }
      channelRef.current = null;
    }
  };

  const connectToPresence = () => {
    cleanup();

    try {
      // Use a simpler channel ID
      const channelId = `online_users`;
      channelRef.current = supabase.channel(channelId);

      const userStatus = {
        user_id: `user_${Date.now()}`,
        online_at: new Date().toISOString(),
        page: window.location.pathname,
      };

      console.log('useOnlineUsers: Connecting to presence...');

      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          if (channelRef.current) {
            const newState = channelRef.current.presenceState();
            const count = Math.max(Object.keys(newState).length, 1);
            
            setOnlineCount(count);
            setIsConnected(true);
            
            // Update peak count
            setPeakCount(prev => Math.max(prev, count));

            // Check for milestones
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
            
            console.log('useOnlineUsers: Synced, online count:', count);
          }
        })
        .on('presence', { event: 'join' }, () => {
          console.log('useOnlineUsers: User joined');
        })
        .on('presence', { event: 'leave' }, () => {
          console.log('useOnlineUsers: User left');
        })
        .subscribe(async (status) => {
          console.log('useOnlineUsers: Status:', status);
          
          if (status === 'SUBSCRIBED' && channelRef.current) {
            try {
              await channelRef.current.track(userStatus);
              setIsConnected(true);
              console.log('useOnlineUsers: Successfully tracking presence');
            } catch (error) {
              console.error('useOnlineUsers: Track error:', error);
              setIsConnected(false);
              // Retry connection after a delay
              reconnectTimeoutRef.current = setTimeout(() => {
                connectToPresence();
              }, 3000);
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.warn('useOnlineUsers: Connection issue:', status);
            setIsConnected(false);
            // Retry connection after a delay
            reconnectTimeoutRef.current = setTimeout(() => {
              connectToPresence();
            }, 3000);
          }
        });

    } catch (error) {
      console.error('useOnlineUsers: Setup error:', error);
      setIsConnected(false);
      // Fallback to offline mode
      setOnlineCount(1);
    }
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
    };
  }, []);

  // Persist data
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
