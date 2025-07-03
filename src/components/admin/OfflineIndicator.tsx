
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineWarning(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineWarning(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="bg-red-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline</span>
          </motion.div>
        )}

        {showOfflineWarning && isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            onAnimationComplete={() => {
              setTimeout(() => setShowOfflineWarning(false), 3000);
            }}
            className="bg-green-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back Online</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent connection status for mobile */}
      <div className="mt-2">
        <Badge 
          variant={isOnline ? "default" : "destructive"}
          className="text-xs"
        >
          {isOnline ? (
            <><Wifi className="w-3 h-3 mr-1" /> Online</>
          ) : (
            <><WifiOff className="w-3 h-3 mr-1" /> Offline</>
          )}
        </Badge>
      </div>
    </div>
  );
};
