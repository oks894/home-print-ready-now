
import React, { memo } from 'react';
import { Users, Wifi, WifiOff, Trophy } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

interface OnlineUsersMonitorProps {
  showMilestones?: boolean;
  className?: string;
}

const OnlineUsersMonitor = memo(({ showMilestones = false, className = '' }: OnlineUsersMonitorProps) => {
  const { onlineCount, isConnected, peakCount, milestones } = useOnlineUsers();

  console.log('OnlineUsersMonitor render - count:', onlineCount, 'connected:', isConnected);

  // Simplified admin version - no animations to prevent loading issues
  return (
    <div className={`fixed top-20 right-4 z-40 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-gray-400" />
        )}
        <Users className="w-4 h-4 text-blue-600" />
        <span className="font-semibold text-blue-600 min-w-[2ch]">{onlineCount}</span>
        <span className="text-gray-600 text-xs">online</span>
      </div>
      
      {showMilestones && milestones.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Trophy className="w-3 h-3" />
            <span>Peak: {peakCount}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Milestones: {milestones.map(m => m.count).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
});

OnlineUsersMonitor.displayName = 'OnlineUsersMonitor';

export default OnlineUsersMonitor;
