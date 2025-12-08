import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Printer, Users, Coins, MoreHorizontal } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';
import { usePendingRechargeCount } from '@/hooks/usePendingRechargeCount';
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
}: MobileBottomNavProps) => {
  const { pendingCount: pendingRechargeCount } = usePendingRechargeCount();

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
      id: 'users',
      label: 'Users',
      icon: Users,
    },
    {
      id: 'coins',
      label: 'Coins',
      icon: Coins,
      badge: pendingRechargeCount,
    },
  ];

  const moreNavItems = [
    { id: 'pendingPayments', label: 'Pending Payments' },
    { id: 'assignments', label: 'Assignments/Solvers' },
    { id: 'resumeLab', label: 'Resume Lab' },
    { id: 'feedback', label: `Feedback (${feedbackCount})` },
    { id: 'services', label: 'Services' },
    { id: 'paymentSettings', label: 'Payment Config' },
    { id: 'adminRoles', label: 'Admin Roles' },
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
      <div className="flex items-center justify-around px-1 py-1">
        {mainNavItems.map((item) => (
          <TouchButton
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-0.5 p-2 min-w-0 flex-1 relative rounded-xl ${
              activeTab === item.id 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-3 w-5 h-5 text-[10px] p-0 flex items-center justify-center"
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </TouchButton>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TouchButton
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-0.5 p-2 min-w-0 flex-1 rounded-xl ${
                moreNavItems.some(item => item.id === activeTab) 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </TouchButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52" sideOffset={8}>
            {moreNavItems.map((item) => (
              <DropdownMenuItem 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`py-3 ${activeTab === item.id ? 'bg-accent font-medium' : ''}`}
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
