
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    console.log('useOnlineUsers: Initializing...');
    let channel: RealtimeChannel | null = null;

    const initializeChannel = async () => {
      try {
        channel = supabase.channel('online_users_global');

        const userStatus = {
          user_id: Math.random().toString(36).substring(7), // Generate unique session ID
          online_at: new Date().toISOString(),
          page: window.location.pathname,
        };

        console.log('useOnlineUsers: Setting up channel with status:', userStatus);

        channel
          .on('presence', { event: 'sync' }, () => {
            if (channel) {
              const newState = channel.presenceState();
              const count = Object.keys(newState).length;
              console.log('useOnlineUsers: Presence sync - count:', count, 'state:', newState);
              
              setOnlineCount(count);
              setIsConnected(true);
              
              // Update peak count
              setPeakCount(prev => {
                const newPeak = Math.max(prev, count);
                if (newPeak > prev) {
                  console.log('useOnlineUsers: New peak count:', newPeak);
                }
                return newPeak;
              });

              // Check for milestones
              const milestoneThresholds = [100, 200, 500, 1000, 2000, 5000];
              milestoneThresholds.forEach(threshold => {
                if (count >= threshold) {
                  setMilestones(prev => {
                    const exists = prev.some(m => m.count === threshold);
                    if (!exists) {
                      console.log('useOnlineUsers: Milestone reached:', threshold);
                      return [...prev, { count: threshold, timestamp: Date.now() }];
                    }
                    return prev;
                  });
                }
              });
            }
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            console.log('useOnlineUsers: User joined:', key, newPresences);
          })
          .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            console.log('useOnlineUsers: User left:', key, leftPresences);
          })
          .subscribe(async (status) => {
            console.log('useOnlineUsers: Channel subscription status:', status);
            if (status === 'SUBSCRIBED' && channel) {
              const trackResult = await channel.track(userStatus);
              console.log('useOnlineUsers: Track result:', trackResult);
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

    // Cleanup function
    return () => {
      console.log('useOnlineUsers: Cleaning up...');
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Persist peak count and milestones to localStorage
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
