
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
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      console.log('useOnlineUsers: Already initialized, skipping...');
      return;
    }

    console.log('useOnlineUsers: Initializing...');
    isInitializedRef.current = true;

    const initializeChannel = async () => {
      try {
        // Clean up any existing channel first
        if (channelRef.current) {
          console.log('useOnlineUsers: Cleaning up existing channel');
          await channelRef.current.untrack();
          supabase.removeChannel(channelRef.current);
        }

        // Create new channel with unique identifier
        const channelId = `online_users_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        channelRef.current = supabase.channel(channelId);

        const userStatus = {
          user_id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          online_at: new Date().toISOString(),
          page: window.location.pathname,
        };

        console.log('useOnlineUsers: Setting up channel with status:', userStatus);

        // Set connection timeout
        connectionTimeoutRef.current = setTimeout(() => {
          console.warn('useOnlineUsers: Connection timeout, setting fallback state');
          setOnlineCount(1); // Show at least current user
          setIsConnected(false);
        }, 10000); // 10 second timeout

        channelRef.current
          .on('presence', { event: 'sync' }, () => {
            if (connectionTimeoutRef.current) {
              clearTimeout(connectionTimeoutRef.current);
              connectionTimeoutRef.current = null;
            }
            
            if (channelRef.current) {
              const newState = channelRef.current.presenceState();
              const count = Object.keys(newState).length;
              console.log('useOnlineUsers: Presence sync - count:', count);
              
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
            if (status === 'SUBSCRIBED' && channelRef.current) {
              try {
                const trackResult = await channelRef.current.track(userStatus);
                console.log('useOnlineUsers: Track result:', trackResult);
              } catch (error) {
                console.error('useOnlineUsers: Track error:', error);
                // Fallback to showing current user
                setOnlineCount(1);
                setIsConnected(false);
              }
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('useOnlineUsers: Channel subscription error/timeout');
              setIsConnected(false);
              // Show fallback count
              setOnlineCount(1);
            }
          });

      } catch (error) {
        console.error('useOnlineUsers: Error initializing channel:', error);
        setIsConnected(false);
        setOnlineCount(1); // Fallback to showing current user
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
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (channelRef.current) {
        channelRef.current.untrack().catch(console.error);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []); // Empty dependency array to run only once

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
