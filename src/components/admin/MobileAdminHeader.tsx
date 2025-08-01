
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
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-gray-900 truncate">Admin Panel</h1>
            <p className="text-xs text-gray-500">Print Management</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRetrying}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <motion.div
              animate={isRetrying ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRetrying ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
          </TouchButton>

          <TouchButton
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </TouchButton>
        </div>
      </div>
    </motion.header>
  );
};
