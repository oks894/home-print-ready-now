
import { motion } from 'framer-motion';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

// Check for slow connection
const isSlowConnection = navigator.connection && 
  (navigator.connection.effectiveType === 'slow-2g' || 
   navigator.connection.effectiveType === '2g' || 
   navigator.connection.effectiveType === '3g');

const OnlineUsersMonitor = () => {
  const { onlineCount, isConnected } = useOnlineUsers();

  // Simple version for slow connections
  if (isSlowConnection) {
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
      className="fixed top-20 right-4 z-40 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg"
    >
      <div className="flex items-center gap-2 text-sm">
        {isConnected ? (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wifi className="w-4 h-4 text-green-500" />
          </motion.div>
        ) : (
          <WifiOff className="w-4 h-4 text-gray-400" />
        )}
        
        <Users className="w-4 h-4 text-blue-600" />
        
        <motion.span
          key={onlineCount}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
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
