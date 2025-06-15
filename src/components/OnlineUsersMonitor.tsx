
import React, { memo, useMemo } from 'react';
import { Users, Wifi, WifiOff, Trophy } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAdaptiveConfig } from '@/utils/connectionUtils';
import MobileLiveMonitor from '@/components/mobile/MobileLiveMonitor';

interface OnlineUsersMonitorProps {
  showMilestones?: boolean;
  className?: string;
}

// UI for desktop users
const DesktopLiveMonitor: React.FC<{
  onlineCount: number;
  isConnected: boolean;
  peakCount: number;
  milestones: { count: number; timestamp: number }[];
  showMilestones: boolean;
  className?: string;
}> = memo(({ onlineCount, isConnected, peakCount, milestones, showMilestones, className }) => {
  const adaptiveConfig = getAdaptiveConfig();

  // Memoize milestone display to prevent unnecessary re-renders
  const milestoneDisplay = useMemo(() => {
    if (!showMilestones || milestones.length === 0 || adaptiveConfig.simplifiedUI) return null;
    const recentMilestones = milestones.slice(-2);
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

  // Memoize the user count icon - use Wifi for 1 user, Users for multiple
  const userCountIcon = useMemo(() => {
    return onlineCount === 1 ? (
      <Wifi className="w-4 h-4 text-blue-600" />
    ) : (
      <Users className="w-4 h-4 text-blue-600" />
    );
  }, [onlineCount]);

  // Desktop positioning
  const isAdminPage = window.location.pathname.includes('/admin');
  const positionClasses = useMemo(() => {
    return isAdminPage
      ? 'fixed top-28 right-4 z-[70]'
      : 'fixed top-20 right-4 z-50';
  }, [isAdminPage]);

  return (
    <div className={`${positionClasses} bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-2 py-1 shadow-sm transition-opacity duration-300 ${className}`}>
      <div className="flex items-center gap-1 text-sm">
        {connectionIcon}
        {userCountIcon}
        <span className="font-semibold text-blue-600 min-w-[2ch] tabular-nums">{onlineCount}</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-orange-500'} ${isConnected ? 'animate-pulse' : ''}`}></div>
        </div>
        {!isConnected && (
          <span className="text-xs text-orange-500">
            {adaptiveConfig.simplifiedUI ? '...' : 'reconnecting...'}
          </span>
        )}
      </div>

      {/* Always show milestones and peak in admin desktop unless simplifiedUI is set */}
      {showMilestones && (peakCount > 0 || milestoneDisplay) && !adaptiveConfig.simplifiedUI && (
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
DesktopLiveMonitor.displayName = 'DesktopLiveMonitor';

// Refactored OnlineUsersMonitor
const OnlineUsersMonitor = memo(({ showMilestones = false, className = '' }: OnlineUsersMonitorProps) => {
  // Always call useOnlineUsers at the top level for consistent hook order
  const isMobile = useIsMobile();
  const {
    onlineCount,
    isConnected,
    peakCount,
    milestones
  } = useOnlineUsers();

  // Always call useOnlineUsers (never in branch)
  // Pass down the data as props (DO NOT call hook in child)
  if (isMobile) {
    return (
      <MobileLiveMonitor
        onlineCount={onlineCount}
        isConnected={isConnected}
        className={className}
      />
    );
  }

  return (
    <DesktopLiveMonitor
      onlineCount={onlineCount}
      isConnected={isConnected}
      peakCount={peakCount}
      milestones={milestones}
      showMilestones={showMilestones}
      className={className}
    />
  );
});
OnlineUsersMonitor.displayName = 'OnlineUsersMonitor';

export default OnlineUsersMonitor;
