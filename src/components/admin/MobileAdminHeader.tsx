
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, LogOut, Menu } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAdminHeaderProps {
  onLogout: () => void;
  onRefresh: () => void;
  isRetrying: boolean;
  onMenuToggle: () => void;
}

export const MobileAdminHeader = ({ 
  onLogout, 
  onRefresh, 
  isRetrying, 
  onMenuToggle 
}: MobileAdminHeaderProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <motion.div
            className="p-2 bg-white/20 backdrop-blur-sm rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">A</span>
            </div>
          </motion.div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-white truncate">ellio Admin</h1>
            <p className="text-xs text-blue-100">Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRetrying}
            className="p-2.5 hover:bg-white/20 rounded-xl text-white"
          >
            <motion.div
              animate={isRetrying ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRetrying ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          </TouchButton>

          <TouchButton
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="p-2.5 hover:bg-red-500/20 text-white rounded-xl"
          >
            <LogOut className="w-5 h-5" />
          </TouchButton>
        </div>
      </div>
    </motion.header>
  );
};
