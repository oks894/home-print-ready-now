import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Milestone {
  count: number;
  timestamp: number;
}

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [peakCount, setPeakCount] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log('useOnlineUsers: Initializing...');

    const initializeChannel = async () => {
      try {
        // Remove any existing channel first
        if (channelRef.current) {
          await channelRef.current.untrack();
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        const uniqueChannelName = `online_users_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        channelRef.current = supabase.channel(uniqueChannelName);

        const userStatus = {
          user_id: Math.random().toString(36).substring(7),
          online_at: new Date().toISOString(),
          page: window.location.pathname,
        };

        channelRef.current
          .on('presence', { event: 'sync' }, () => {
            if (channelRef.current) {
              const newState = channelRef.current.presenceState();
              const count = Object.keys(newState).length;
              
              setOnlineCount(count);
              setIsConnected(true);
              
              setPeakCount(prev => Math.max(prev, count));

              const milestoneThresholds = [100, 200, 500, 1000, 2000, 5000];
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
          })
          .on('presence', { event: 'join' }, () => {})
          .on('presence', { event: 'leave' }, () => {})
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED' && channelRef.current) {
              await channelRef.current.track(userStatus);
            }
          });

      } catch (error) {
        console.error('useOnlineUsers: Error initializing channel:', error);
        setIsConnected(false);
      }
    };

    // Load persisted data from localStorage
    const savedPeakCount = localStorage.getItem('online_users_peak');
    const savedMilestones = localStorage.getItem('online_users_milestones');
    
    if (savedPeakCount) {
      setPeakCount(parseInt(savedPeakCount, 10));
    }
    
    if (savedMilestones) {
      try {
        setMilestones(JSON.parse(savedMilestones));
      } catch (e) {
        console.error('useOnlineUsers: Error parsing saved milestones:', e);
      }
    }

    initializeChannel();

    return () => {
      console.log('useOnlineUsers: Cleaning up...');
      if (channelRef.current) {
        channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

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
