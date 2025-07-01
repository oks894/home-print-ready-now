
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useVibration } from '@/hooks/useVibration';
import { usePageVisibility } from '@/hooks/usePageVisibility';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();
  const { vibrate, patterns, isEnabled: vibrationEnabled } = useVibration();
  const { isInBackground } = usePageVisibility();

  // Request notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      console.log('Notification permission:', result);
      return result;
    }
    console.log('Notifications not supported');
    return 'denied';
  };

  // Show browser notification with enhanced options for background
  const showNotification = (title: string, options?: NotificationOptions) => {
    console.log('Attempting to show notification:', title, permission);
    if (permission === 'granted' && 'Notification' in window) {
      const enhancedOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: isInBackground, // Require interaction if in background
        silent: false,
        tag: 'print-order', // Group similar notifications
        ...options
      };

      const notification = new Notification(title, enhancedOptions);

      // Auto close after 10 seconds for background, 5 seconds for foreground
      const autoCloseDelay = isInBackground ? 10000 : 5000;
      setTimeout(() => {
        notification.close();
      }, autoCloseDelay);

      // Add click handler to focus the window
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } else {
      console.log('Cannot show notification. Permission:', permission);
    }
  };

  // Trigger vibration for new orders
  const triggerOrderVibration = () => {
    if (vibrationEnabled) {
      if (isInBackground) {
        // Stronger vibration pattern when in background
        vibrate(patterns.urgent);
      } else {
        // Gentle vibration when tab is active
        vibrate(patterns.newOrder);
      }
    }
  };

  // Listen for new print jobs
  const startListening = () => {
    console.log('Starting to listen for notifications. Permission:', permission);
    
    const channel = supabase
      .channel('print-jobs-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'print_jobs'
        },
        (payload) => {
          console.log('New print job received:', payload);
          
          const job = payload.new;
          
          // Trigger vibration
          triggerOrderVibration();
          
          // Show browser notification with enhanced options for background
          if (permission === 'granted') {
            showNotification('New Print Order!', {
              body: `Order from ${job.name} - Tracking ID: ${job.tracking_id}`,
              tag: `print-job-${job.id}`,
              requireInteraction: isInBackground,
              data: { jobId: job.id, trackingId: job.tracking_id }
            });
          }

          // Always show toast notification with enhanced visibility for background
          toast({
            title: "New Print Order!",
            description: `Order from ${job.name} - ID: ${job.tracking_id}`,
            duration: isInBackground ? 8000 : 5000, // Longer duration if in background
          });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from notifications');
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
      console.log('Initial notification permission:', Notification.permission);
    }
  }, []);

  return {
    permission,
    requestPermission,
    showNotification,
    startListening,
    triggerOrderVibration,
    isInBackground,
    vibrationEnabled
  };
};
