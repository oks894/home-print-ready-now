
import { useEffect, useState } from 'react';
import { Bell, BellOff, Smartphone, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { useVibration } from '@/hooks/useVibration';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export const NotificationManager = () => {
  const { permission, requestPermission, startListening, isInBackground, vibrationEnabled } = useNotifications();
  const { isSupported: vibrationSupported, isEnabled: vibrationEnabled2, enableVibration, disableVibration, vibrate, patterns } = useVibration();
  const [isListening, setIsListening] = useState(false);
  const [cleanup, setCleanup] = useState<(() => void) | null>(null);

  const handleEnableNotifications = async () => {
    console.log('Enabling notifications...');
    const result = await requestPermission();
    if (result === 'granted') {
      console.log('Permission granted, starting to listen...');
      const cleanupFn = startListening();
      setCleanup(() => cleanupFn);
      setIsListening(true);
    }
  };

  const handleDisableNotifications = () => {
    console.log('Disabling notifications...');
    if (cleanup) {
      cleanup();
      setCleanup(null);
    }
    setIsListening(false);
  };

  const handleTestVibration = () => {
    vibrate(patterns.test);
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
      console.log('Auto-starting notifications with granted permission');
      const cleanupFn = startListening();
      setCleanup(() => cleanupFn);
      setIsListening(true);
    }

    // Cleanup on unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [permission]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Real-time Notifications
        </CardTitle>
        <CardDescription>
          Get notified instantly when new print orders arrive with sound, vibration, and visual alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Browser Notifications</p>
            <p className="text-sm text-gray-600">Push notifications from browser</p>
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

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Tab Status</p>
            <p className="text-sm text-gray-600">Current tab visibility</p>
          </div>
          <Badge className={isInBackground ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
            {isInBackground ? 'Background' : 'Active'}
          </Badge>
        </div>

        <Separator />

        {/* Vibration Settings */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <h4 className="font-medium">Vibration Settings</h4>
          </div>

          {vibrationSupported ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Vibration Alerts</p>
                  <p className="text-sm text-gray-600">Haptic feedback for new orders</p>
                </div>
                <Switch
                  checked={vibrationEnabled2}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      enableVibration();
                    } else {
                      disableVibration();
                    }
                  }}
                />
              </div>

              {vibrationEnabled2 && (
                <Button
                  onClick={handleTestVibration}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Test Vibration
                </Button>
              )}
            </>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                Vibration is not supported on this device/browser.
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex gap-2">
          {permission !== 'granted' && (
            <Button 
              onClick={handleEnableNotifications}
              className="flex-1"
            >
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          )}

          {permission === 'granted' && !isListening && (
            <Button 
              onClick={handleEnableNotifications}
              className="flex-1"
            >
              <Bell className="w-4 h-4 mr-2" />
              Start Listening
            </Button>
          )}

          {isListening && (
            <Button 
              onClick={handleDisableNotifications}
              variant="outline"
              className="flex-1"
            >
              <BellOff className="w-4 h-4 mr-2" />
              Stop Listening
            </Button>
          )}
        </div>

        {permission === 'denied' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Notifications Blocked:</strong> Please enable notifications in your browser settings for this site to receive real-time alerts.
            </p>
          </div>
        )}

        {permission === 'granted' && isListening && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Notifications Active:</strong> You'll receive alerts with {vibrationEnabled2 && vibrationSupported ? 'vibration, ' : ''}sound, and visual notifications for new print orders{isInBackground ? ', with enhanced alerts since the tab is in the background' : ''}.
            </p>
          </div>
        )}

        {permission === 'granted' && !isListening && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Ready to Listen:</strong> Click "Start Listening" to begin receiving real-time notifications with enhanced background support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
