
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Simplified notification hook without the broken realtime functionality
export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

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

  // Show browser notification
  const showNotification = (title: string, options?: NotificationOptions) => {
    console.log('Attempting to show notification:', title, permission);
    if (permission === 'granted' && 'Notification' in window) {
      const enhancedOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        silent: false,
        ...options
      };

      const notification = new Notification(title, enhancedOptions);

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

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

  // Simplified startListening that doesn't break
  const startListening = () => {
    console.log('Notification listening disabled (was causing issues)');
    return () => {}; // Return empty cleanup function
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
    isInBackground: false,
    vibrationEnabled: false
  };
};
