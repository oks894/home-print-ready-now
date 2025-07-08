
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileAdminLayout = ({ children, className = '' }: MobileAdminLayoutProps) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div 
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 safe-area-inset ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 overflow-x-hidden px-3 py-4">
          {children}
        </main>
      </div>
    </motion.div>
  );
};
