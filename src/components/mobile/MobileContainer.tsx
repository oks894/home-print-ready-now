
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const MobileContainer = ({ 
  children, 
  className = '', 
  padding = 'md' 
}: MobileContainerProps) => {
  const isMobile = useIsMobile();

  const paddingClasses = {
    none: '',
    sm: isMobile ? 'px-2 py-2' : 'px-3 py-3',
    md: isMobile ? 'px-3 py-3' : 'px-4 py-4',
    lg: isMobile ? 'px-4 py-4' : 'px-6 py-6'
  };

  return (
    <motion.div 
      className={`w-full ${
        isMobile 
          ? 'max-w-full mx-auto' 
          : 'max-w-sm mx-auto sm:max-w-2xl lg:max-w-6xl'
      } ${paddingClasses[padding]} ${className}`}
      initial={{ opacity: 0, y: isMobile ? 10 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {isMobile ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          {children}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          {children}
        </div>
      )}
    </motion.div>
  );
};
