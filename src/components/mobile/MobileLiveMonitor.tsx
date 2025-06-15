
import React, { memo, useMemo } from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface MobileLiveMonitorProps {
  className?: string;
  onlineCount: number;
  isConnected: boolean;
}

const MobileLiveMonitor = memo(({ className = '', onlineCount, isConnected }: MobileLiveMonitorProps) => {
  // Position the monitor to be fully visible on mobile (right edge, with margin)
  const positionClasses = useMemo(() => {
    const isAdminPage = window.location.pathname.includes('/admin');
    return isAdminPage
      ? 'fixed top-32 right-4 z-[70]' // Fully visible for admin
      : 'fixed top-16 right-4 z-50';  // Fully visible for regular pages
  }, []);

  const connectionIcon = useMemo(() => {
    return isConnected ? (
      <Wifi className="w-4 h-4 text-green-500" />
    ) : (
      <WifiOff className="w-4 h-4 text-orange-500" />
    );
  }, [isConnected]);

  // Use Wifi icon for 1 user, Users for multiple
  const userCountIcon = useMemo(() => {
    return onlineCount === 1 ? (
      <Wifi className="w-4 h-4 text-blue-600" />
    ) : (
      <Users className="w-4 h-4 text-blue-600" />
    );
  }, [onlineCount]);

  return (
    <div className={`
      ${positionClasses}
      bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm
      transition-all duration-300 flex items-center min-w-[82px] max-w-full
      ${className}
    `}>
      <div className="flex items-center gap-2 text-sm">
        {connectionIcon}
        {userCountIcon}
        <span className="font-semibold text-blue-600 min-w-[2ch] tabular-nums">{onlineCount}</span>
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
