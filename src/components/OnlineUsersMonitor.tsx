
import React, { memo, useMemo } from 'react';
import { Users, Wifi, WifiOff, Trophy } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

interface OnlineUsersMonitorProps {
  showMilestones?: boolean;
  className?: string;
}

const OnlineUsersMonitor = memo(({ showMilestones = false, className = '' }: OnlineUsersMonitorProps) => {
  const { onlineCount, isConnected, peakCount, milestones } = useOnlineUsers();
  const isMobile = useIsMobile();
  const adaptiveConfig = getAdaptiveConfig();

  // Always show the monitor - don't hide it
  console.log('OnlineUsersMonitor rendering:', { onlineCount, isConnected, adaptiveConfig });

  // Memoize milestone display to prevent unnecessary re-renders
  const milestoneDisplay = useMemo(() => {
    if (!showMilestones || milestones.length === 0 || adaptiveConfig.simplifiedUI) return null;
    
    const recentMilestones = milestones.slice(-2); // Show only last 2 milestones on mobile
    return recentMilestones.map(m => m.count).join(', ');
  }, [showMilestones, milestones, adaptiveConfig.simplifiedUI]);

  // Memoize the connection status icon
  const connectionIcon = useMemo(() => {
    if (adaptiveConfig.simplifiedUI) return null;
    
    return isConnected ? (
      <Wifi className="w-3 h-3 text-green-500" />
    ) : (
      <WifiOff className="w-3 h-3 text-orange-500" />
    );
  }, [isConnected, adaptiveConfig.simplifiedUI]);

  // Determine position based on current page and device
  const isAdminPage = window.location.pathname.includes('/admin');
  const positionClasses = useMemo(() => {
    if (isAdminPage) {
      return isMobile 
        ? 'fixed top-32 right-2 z-[70]' // Even higher z-index and lower position for admin mobile
        : 'fixed top-28 right-4 z-[70]'; // Even higher z-index for admin desktop
    }
    return isMobile 
      ? 'fixed top-16 right-2 z-50' // Higher z-index for mobile
      : 'fixed top-20 right-4 z-50'; // Higher z-index for desktop
  }, [isAdminPage, isMobile]);

  return (
    <div className={`${positionClasses} bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-2 py-1 shadow-sm transition-opacity duration-300 ${className}`}>
      <div className={`flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
        {connectionIcon}
        <Users className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-600`} />
        <span className="font-semibold text-blue-600 min-w-[2ch] tabular-nums">{onlineCount}</span>
        <span className="text-gray-600 text-xs">
          {isMobile ? 'on' : 'online'}
        </span>
        {!isConnected && (
          <span className="text-xs text-orange-500">
            {adaptiveConfig.simplifiedUI ? '...' : 'reconnecting...'}
          </span>
        )}
      </div>
      
      {showMilestones && !isMobile && (peakCount > 0 || milestoneDisplay) && (
        <div className="mt-1 pt-1 border-t border-gray-100">
          {peakCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Trophy className="w-3 h-3" />
              <span>Peak: {peakCount}</span>
            </div>
          )}
          {milestoneDisplay && (
            <div className="text-xs text-gray-400 mt-1 truncate max-w-[120px]">
              Recent: {milestoneDisplay}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

OnlineUsersMonitor.displayName = 'OnlineUsersMonitor';

export default OnlineUsersMonitor;
