
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
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 safe-area-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="p-3 hover:bg-gray-100 rounded-full"
          >
            <Menu className="w-5 h-5" />
          </TouchButton>
          
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Print Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRetrying}
            className="p-3 hover:bg-gray-100 rounded-full"
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
            className="p-3 hover:bg-red-50 text-red-600 rounded-full"
          >
            <LogOut className="w-5 h-5" />
          </TouchButton>
        </div>
      </div>
    </motion.header>
  );
};
