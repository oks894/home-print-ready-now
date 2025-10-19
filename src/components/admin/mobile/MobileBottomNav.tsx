import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, RefreshCw, Settings } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount: number;
  feedbackCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const MobileBottomNav = ({
  activeTab,
  onTabChange,
  pendingCount,
  feedbackCount,
  onRefresh,
  isRefreshing
}: MobileBottomNavProps) => {
  const navItems = [
    {
      id: 'printJobs',
      label: 'Jobs',
      icon: FileText,
      badge: pendingCount,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
      badge: feedbackCount,
    },
    {
      id: 'services',
      label: 'Services',
      icon: Settings,
    },
    {
      id: 'links',
      label: 'Links',
      icon: Settings,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <TouchButton
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 p-3 min-w-0 flex-1 relative ${
              activeTab === item.id ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
            
            <span className="text-xs font-medium truncate">{item.label}</span>
            
            {item.badge > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
              >
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
          </TouchButton>
        ))}
      </div>
    </motion.div>
  );
};