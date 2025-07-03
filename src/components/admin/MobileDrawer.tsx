
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, MessageSquare, Settings, BarChart3 } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount: number;
  feedbackCount: number;
}

export const MobileDrawer = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange, 
  pendingCount, 
  feedbackCount 
}: MobileDrawerProps) => {
  const menuItems = [
    { 
      id: 'orders', 
      label: 'Print Jobs', 
      icon: FileText, 
      badge: pendingCount > 0 ? pendingCount : null,
      badgeVariant: 'destructive' as const
    },
    { 
      id: 'feedback', 
      label: 'Feedback', 
      icon: MessageSquare, 
      badge: feedbackCount,
      badgeVariant: 'secondary' as const
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: Settings, 
      badge: null,
      badgeVariant: 'secondary' as const
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      badge: null,
      badgeVariant: 'secondary' as const
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 safe-area-inset"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <p className="text-sm text-gray-500">Navigate admin panels</p>
                </div>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </TouchButton>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <TouchButton
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => {
                        onTabChange(item.id);
                        onClose();
                      }}
                      className={`w-full justify-start h-12 text-base font-medium ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <Badge 
                          variant={item.badgeVariant}
                          className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </TouchButton>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  Swipe left or tap outside to close
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
