
import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

export const NotificationManager = () => {
  const { permission, requestPermission, startListening } = useNotifications();
  const [isListening, setIsListening] = useState(false);

  const handleEnableNotifications = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      const cleanup = startListening();
      setIsListening(true);
      
      // Store cleanup function to call when component unmounts or notifications are disabled
      return cleanup;
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { status: 'Enabled', color: 'bg-green-100 text-green-800' };
      case 'denied':
        return { status: 'Blocked', color: 'bg-red-100 text-red-800' };
      default:
        return { status: 'Not Set', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const permissionInfo = getPermissionStatus();

  useEffect(() => {
    // Auto-start listening if permission is already granted
    if (permission === 'granted' && !isListening) {
      const cleanup = startListening();
      setIsListening(true);
      
      return cleanup;
    }
  }, [permission, isListening, startListening]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Real-time Notifications
        </CardTitle>
        <CardDescription>
          Get notified instantly when new print orders arrive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notification Status</p>
            <p className="text-sm text-gray-600">Browser notification permission</p>
          </div>
          <Badge className={permissionInfo.color}>
            {permissionInfo.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Real-time Listening</p>
            <p className="text-sm text-gray-600">Live order monitoring</p>
          </div>
          <Badge className={isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {isListening ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {permission !== 'granted' && (
          <Button 
            onClick={handleEnableNotifications}
            className="w-full"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        )}

        {permission === 'denied' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Notifications Blocked:</strong> Please enable notifications in your browser settings for this site to receive real-time alerts.
            </p>
          </div>
        )}

        {permission === 'granted' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Notifications Enabled:</strong> You'll receive alerts for new print orders even when this tab is in the background.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
