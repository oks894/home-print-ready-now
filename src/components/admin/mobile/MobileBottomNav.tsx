import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Printer, Clock, GraduationCap, Settings, BarChart3, MoreHorizontal } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'printJobs',
      label: 'Orders',
      icon: Printer,
      badge: pendingCount,
    },
    {
      id: 'pendingPayments',
      label: 'Payments',
      icon: Clock,
    },
    {
      id: 'assignments',
      label: 'Tasks',
      icon: GraduationCap,
    },
  ];

  const moreNavItems = [
    { id: 'resumeLab', label: 'Resume Lab' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'services', label: 'Services' },
    { id: 'paymentSettings', label: 'Payment Config' },
    { id: 'globalSettings', label: 'Settings' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => (
          <TouchButton
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 p-3 min-w-0 flex-1 relative ${
              activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
            
            <span className="text-xs font-medium truncate">{item.label}</span>
            
            {item.badge && item.badge > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
              >
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
          </TouchButton>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TouchButton
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 p-3 min-w-0 flex-1 ${
                moreNavItems.some(item => item.id === activeTab) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-xs font-medium">More</span>
            </TouchButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {moreNavItems.map((item) => (
              <DropdownMenuItem 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={activeTab === item.id ? 'bg-accent' : ''}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};