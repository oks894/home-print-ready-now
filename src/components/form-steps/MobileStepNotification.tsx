
import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileStepNotificationProps {
  message: string;
  type?: 'info' | 'warning' | 'success';
}

export const MobileStepNotification = ({ 
  message, 
  type = 'info' 
}: MobileStepNotificationProps) => {
  const isMobile = useIsMobile();

  const icons = {
    info: <Info className="h-4 w-4 flex-shrink-0" />,
    warning: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
    success: <CheckCircle className="h-4 w-4 flex-shrink-0" />
  };

  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mb-4 ${isMobile ? 'mx-2' : 'mb-6'}`}
    >
      <Alert className={`${variants[type]} border ${isMobile ? 'text-sm' : ''}`}>
        <div className="flex items-start gap-2">
          {icons[type]}
          <AlertDescription className="flex-1 leading-relaxed">
            {message}
          </AlertDescription>
        </div>
      </Alert>
    </motion.div>
  );
};
