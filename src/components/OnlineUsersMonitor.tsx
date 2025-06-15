
import React, { memo, useMemo } from 'react';
import { Users, Wifi, WifiOff, Trophy } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

interface OnlineUsersMonitorProps {
  showMilestones?: boolean;
  className?: string;
}

const OnlineUsersMonitor = memo(({ showMilestones = false, className = '' }: OnlineUsersMonitorProps) => {
  const { onlineCount, isConnected, peakCount, milestones } = useOnlineUsers();

  // Memoize milestone display to prevent unnecessary re-renders
  const milestoneDisplay = useMemo(() => {
    if (!showMilestones || milestones.length === 0) return null;
    
    const recentMilestones = milestones.slice(-3); // Show only last 3 milestones
    return recentMilestones.map(m => m.count).join(', ');
  }, [showMilestones, milestones]);

  // Memoize the connection status icon
  const connectionIcon = useMemo(() => {
    return isConnected ? (
      <Wifi className="w-4 h-4 text-green-500" />
    ) : (
      <WifiOff className="w-4 h-4 text-orange-500" />
    );
  }, [isConnected]);

  return (
    <div className={`fixed top-20 right-4 z-40 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-opacity duration-300 ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        {connectionIcon}
        <Users className="w-4 h-4 text-blue-600" />
        <span className="font-semibold text-blue-600 min-w-[2ch] tabular-nums">{onlineCount}</span>
        <span className="text-gray-600 text-xs">online</span>
        {!isConnected && (
          <span className="text-xs text-orange-500">reconnecting...</span>
        )}
      </div>
      
      {showMilestones && (peakCount > 0 || milestoneDisplay) && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          {peakCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Trophy className="w-3 h-3" />
              <span>Peak: {peakCount}</span>
            </div>
          )}
          {milestoneDisplay && (
            <div className="text-xs text-gray-400 mt-1 truncate">
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
