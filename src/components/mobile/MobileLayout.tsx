
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export const MobileLayout = ({ children, showBottomNav = false, className = '' }: MobileLayoutProps) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div 
      className={`min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 safe-area-inset ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex flex-col min-h-screen ${showBottomNav ? 'pb-16' : ''}`}>
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
        
        {showBottomNav && (
          <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-inset z-50 shadow-lg">
            {/* Bottom navigation will be added here */}
          </div>
        )}
      </div>
    </motion.div>
  );
};
