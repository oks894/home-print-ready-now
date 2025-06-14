
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TouchButtonProps extends React.ComponentProps<typeof Button> {
  haptic?: boolean;
  children: React.ReactNode;
}

export const TouchButton = ({ 
  haptic = true, 
  className, 
  children, 
  onClick,
  ...props 
}: TouchButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.(e);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      <Button
        className={cn(
          'min-h-[48px] touch-manipulation text-base font-medium shadow-lg active:shadow-md transition-shadow',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};
