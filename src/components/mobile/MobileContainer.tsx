
import React from 'react';
import { motion } from 'framer-motion';

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
  const paddingClasses = {
    none: '',
    sm: 'px-3 py-3',
    md: 'px-4 py-4',
    lg: 'px-6 py-6'
  };

  return (
    <motion.div 
      className={`w-full max-w-sm mx-auto sm:max-w-2xl lg:max-w-6xl ${paddingClasses[padding]} ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        {children}
      </div>
    </motion.div>
  );
};
