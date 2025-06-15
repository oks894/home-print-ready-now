
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

// Utility to get/save a persistent user ID for presence
function getPresenceUserId() {
  let uid = localStorage.getItem('presence_uid');
  if (!uid) {
    uid = `user_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem('presence_uid', uid);
  }
  return uid;
}

export const usePresenceConnection = () => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useRef(getPresenceUserId());
  const connectionAttemptsRef = useRef(0);
  const adaptiveConfig = getAdaptiveConfig();

  // All logic is in callbacks, no hooks inside conditionals
  const cleanup = useCallback(() => {
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
        console.info('usePresenceConnection: Channel cleanup complete');
      } catch (error) {
        console.warn('usePresenceConnection: Cleanup warning:', error);
      }
      channelRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback((onReconnect: () => void) => {
    const delay = Math.min(5000 + (connectionAttemptsRef.current * 2000), 30000);
    console.log('[usePresenceConnection] Scheduling reconnect in', delay / 1000, 's');
    reconnectTimeoutRef.current = setTimeout(onReconnect, delay);
  }, []);

  const connectToPresence = useCallback((
    onPresenceSync: (count: number) => void,
    onConnectionChange: (isConnected: boolean) => void
  ) => {
    if (connectionAttemptsRef.current > 5) {
      console.warn('usePresenceConnection: Too many connection attempts, stopping');
      onConnectionChange(false);
      return;
    }

    connectionAttemptsRef.current += 1;
    cleanup();
    onConnectionChange(false);

    try {
      const channelId = `presence_${Math.floor(Date.now() / 30000)}`;
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

      console.log('[usePresenceConnection] Connecting attempt', connectionAttemptsRef.current, userStatus);

      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          if (channelRef.current) {
            const newState = channelRef.current.presenceState();
            const count = Math.max(Object.keys(newState).length, 1);
            onPresenceSync(count);
            onConnectionChange(true);
            connectionAttemptsRef.current = 0;
            console.debug('[usePresenceConnection] Presence synced - count:', count);
          }
        })
        .on('presence', { event: 'join' }, ({ key }) => {
          console.log('[usePresenceConnection] User joined:', key);
        })
        .on('presence', { event: 'leave' }, ({ key }) => {
          console.log('[usePresenceConnection] User left:', key);
        })
        .subscribe(async (status) => {
          console.log('[usePresenceConnection] Channel status:', status);
          if (status === 'SUBSCRIBED' && channelRef.current) {
            try {
              await channelRef.current.track(userStatus);
              onConnectionChange(true);
              console.log('[usePresenceConnection] Successfully tracking presence');

              if (!adaptiveConfig.ultraLightMode) {
                heartbeatRef.current = setInterval(async () => {
                  if (channelRef.current) {
                    try {
                      await channelRef.current.track({
                        ...userStatus,
                        last_heartbeat: new Date().toISOString(),
                      });
                    } catch (error) {
                      console.warn('[usePresenceConnection] Heartbeat failed:', error);
                    }
                  }
                }, 60000);
              }
            } catch (error) {
              console.error('[usePresenceConnection] Track error:', error);
              onConnectionChange(false);
              scheduleReconnect(() => connectToPresence(onPresenceSync, onConnectionChange));
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            onConnectionChange(false);
            scheduleReconnect(() => connectToPresence(onPresenceSync, onConnectionChange));
            console.warn('[usePresenceConnection] Connection lost:', status);
          }
        });

    } catch (error) {
      console.error('[usePresenceConnection] Setup error:', error);
      onConnectionChange(false);
      scheduleReconnect(() => connectToPresence(onPresenceSync, onConnectionChange));
    }
  }, [cleanup, scheduleReconnect, adaptiveConfig.ultraLightMode]);

  return {
    connectToPresence,
    cleanup,
    scheduleReconnect
  };
};
