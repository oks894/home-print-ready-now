
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  // Request notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  // Show browser notification
  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && 'Notification' in window) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  };

  // Listen for new print jobs
  const startListening = () => {
    if (permission !== 'granted') return;

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
          
          // Show browser notification
          showNotification('New Print Order!', {
            body: `Order from ${job.name} - Tracking ID: ${job.tracking_id}`,
            tag: `print-job-${job.id}`,
            requireInteraction: true
          });

          // Also show toast notification
          toast({
            title: "New Print Order!",
            description: `Order from ${job.name} - ID: ${job.tracking_id}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  return {
    permission,
    requestPermission,
    showNotification,
    startListening
  };
};
