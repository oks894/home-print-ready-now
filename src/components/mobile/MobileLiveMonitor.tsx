
import React, { memo, useMemo } from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

interface MobileLiveMonitorProps {
  className?: string;
}

const MobileLiveMonitor = memo(({ className = '' }: MobileLiveMonitorProps) => {
  const { onlineCount, isConnected } = useOnlineUsers();
  const adaptiveConfig = getAdaptiveConfig();

  // Position the monitor to show only half on mobile
  const positionClasses = useMemo(() => {
    const isAdminPage = window.location.pathname.includes('/admin');
    return isAdminPage 
      ? 'fixed top-32 -right-8 z-[70]' // Half hidden for admin
      : 'fixed top-16 -right-8 z-50'; // Half hidden for regular pages
  }, []);

  const connectionIcon = useMemo(() => {
    return isConnected ? (
      <Wifi className="w-3 h-3 text-green-500" />
    ) : (
      <WifiOff className="w-3 h-3 text-orange-500" />
    );
  }, [isConnected]);

  // Use Wifi icon for 1 user, Users for multiple
  const userCountIcon = useMemo(() => {
    return onlineCount === 1 ? (
      <Wifi className="w-3 h-3 text-blue-600" />
    ) : (
      <Users className="w-3 h-3 text-blue-600" />
    );
  }, [onlineCount]);

  return (
    <div className={`${positionClasses} bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-2 text-xs">
        {connectionIcon}
        {userCountIcon}
        <span className="font-semibold text-blue-600 min-w-[2ch] tabular-nums">{onlineCount}</span>
        
        {/* Green dot instead of "on" text */}
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-orange-500'} ${isConnected ? 'animate-pulse' : ''}`}></div>
        
        {!isConnected && (
          <span className="text-orange-500">...</span>
        )}
      </div>
    </div>
  );
});

MobileLiveMonitor.displayName = 'MobileLiveMonitor';

export default MobileLiveMonitor;
