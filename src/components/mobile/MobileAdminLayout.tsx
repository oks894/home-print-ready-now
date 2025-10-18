
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
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </motion.div>
  );
};
