
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('useOnlineUsers: Initializing...');
    let channel: RealtimeChannel | null = null;

    const initializeChannel = async () => {
      try {
        channel = supabase.channel('online_users');

        const userStatus = {
          user_id: Math.random().toString(36).substring(7), // Generate unique session ID
          online_at: new Date().toISOString(),
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

  return { onlineCount, isConnected };
};
