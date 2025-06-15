
import { motion } from 'framer-motion';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

const OnlineUsersMonitor = () => {
  const { onlineCount, isConnected } = useOnlineUsers();
  const { simplifiedUI, enableHeavyAnimations, enableBackdropBlur } = getAdaptiveConfig();

  // Simple version for slow connections
  if (simplifiedUI) {
    return (
      <div className="fixed top-20 right-4 z-40 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md">
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
      } border border-gray-200 rounded-lg px-3 py-2 shadow-lg`}
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
      </div>
    </motion.div>
  );
};

export default OnlineUsersMonitor;
