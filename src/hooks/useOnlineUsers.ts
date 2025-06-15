
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel: RealtimeChannel = supabase.channel('online_users');

    const userStatus = {
      user_id: Math.random().toString(36).substring(7), // Generate unique session ID
      online_at: new Date().toISOString(),
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const count = Object.keys(newState).length;
        setOnlineCount(count);
        setIsConnected(true);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userStatus);
        }
      });

    // Cleanup function
    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, []);

  return { onlineCount, isConnected };
};
