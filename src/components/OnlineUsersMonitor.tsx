
import { motion } from 'framer-motion';
import { Users, Wifi, WifiOff, Trophy } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

interface OnlineUsersMonitorProps {
  showMilestones?: boolean;
  className?: string;
}

const OnlineUsersMonitor = ({ showMilestones = false, className = '' }: OnlineUsersMonitorProps) => {
  const { onlineCount, isConnected, peakCount, milestones } = useOnlineUsers();
  const { simplifiedUI, enableHeavyAnimations, enableBackdropBlur } = getAdaptiveConfig();

  console.log('OnlineUsersMonitor render - count:', onlineCount, 'connected:', isConnected, 'peak:', peakCount);

  // Check if we've hit a milestone
  const recentMilestone = milestones.find(m => m.count <= onlineCount && Date.now() - m.timestamp < 10000);

  // Simple version for slow connections
  if (simplifiedUI) {
    return (
      <div className={`fixed top-20 right-4 z-40 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md ${className}`}>
        <div className="flex items-center gap-2 text-sm">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-gray-400" />
          )}
          <Users className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-blue-600">{onlineCount}</span>
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
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: enableHeavyAnimations ? 0.3 : 0.1 }}
      className={`fixed top-20 right-4 z-40 ${
        enableBackdropBlur 
          ? 'bg-white/90 backdrop-blur-sm' 
          : 'bg-white'
      } border border-gray-200 rounded-lg px-3 py-2 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 text-sm">
        {isConnected ? (
          <motion.div
            animate={enableHeavyAnimations ? { scale: [1, 1.1, 1] } : {}}
            transition={enableHeavyAnimations ? { duration: 2, repeat: Infinity } : {}}
          >
            <Wifi className="w-4 h-4 text-green-500" />
          </motion.div>
        ) : (
          <WifiOff className="w-4 h-4 text-gray-400" />
        )}
        
        <Users className="w-4 h-4 text-blue-600" />
        
        <motion.span
          key={onlineCount}
          initial={enableHeavyAnimations ? { scale: 1.2 } : {}}
          animate={{ scale: 1 }}
          transition={{ duration: enableHeavyAnimations ? 0.2 : 0.1 }}
          className="font-semibold text-blue-600"
        >
          {onlineCount}
        </motion.span>
        
        <span className="text-gray-600 text-xs">
          online
        </span>

        {/* Milestone celebration */}
        {recentMilestone && enableHeavyAnimations && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="ml-2"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
          </motion.div>
        )}
      </div>

      {/* Admin milestone tracking */}
      {showMilestones && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-2 pt-2 border-t border-gray-100 overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span className="text-gray-600">Peak: {peakCount}</span>
          </div>
          
          {milestones.length > 0 && (
            <div className="mt-1">
              <div className="text-xs text-gray-500 mb-1">Milestones Reached:</div>
              <div className="flex flex-wrap gap-1">
                {milestones.map((milestone, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700"
                  >
                    {milestone.count}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Next milestone indicator */}
          {(() => {
            const nextMilestone = [100, 200, 500, 1000, 2000, 5000].find(m => m > peakCount);
            if (nextMilestone) {
              const progress = (onlineCount / nextMilestone) * 100;
              return (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Next: {nextMilestone}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default OnlineUsersMonitor;
