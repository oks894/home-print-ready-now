import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Printer, BookOpen, HelpCircle, User, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export const UserBottomNav = () => {
  const location = useLocation();
  const { user, profile } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'prints', label: 'Print', icon: Printer, path: '/printing' },
    { id: 'notes', label: 'Notes', icon: BookOpen, path: '/ellio-notes' },
    { id: 'help', label: 'Help', icon: HelpCircle, path: '/assignment-help' },
    { id: 'profile', label: 'Profile', icon: User, path: user ? '/dashboard' : '/auth' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom lg:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 min-w-0 flex-1 rounded-xl transition-all relative ${
                active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <item.icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
                {active && (
                  <motion.div
                    layoutId="userActiveIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
                {/* Show coin balance badge on profile */}
                {item.id === 'profile' && user && profile && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-4 text-[9px] px-1 py-0 h-4 bg-ellio-blue text-white"
                  >
                    <Coins className="w-2 h-2 mr-0.5" />
                    {profile.coin_balance}
                  </Badge>
                )}
              </motion.div>
              <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default UserBottomNav;
