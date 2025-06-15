
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

export const LoadingSpinner = () => {
  const isMobile = useIsMobile();
  const { simplifiedUI, enableHeavyAnimations } = getAdaptiveConfig();
  
  // Use simpler loading for slow connections
  if (simplifiedUI) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className={`border-4 border-blue-500 border-t-transparent rounded-full ${
            isMobile ? 'w-8 h-8' : 'w-12 h-12'
          }`} style={{ animation: 'spin 1s linear infinite' }} />
          <p className={`font-medium text-gray-700 ${
            isMobile ? 'text-sm text-center px-4' : 'text-base'
          }`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: enableHeavyAnimations ? 0.5 : 0.2 }}
      >
        <motion.div
          className={`border-4 border-blue-500 border-t-transparent rounded-full ${
            isMobile ? 'w-12 h-12' : 'w-16 h-16'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className={`font-semibold text-gray-700 ${
            isMobile ? 'text-lg text-center px-4' : 'text-xl'
          }`}
          animate={enableHeavyAnimations ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={enableHeavyAnimations ? { duration: 2, repeat: Infinity } : {}}
        >
          {enableHeavyAnimations ? 'Loading Premium Experience...' : 'Loading...'}
        </motion.p>
      </motion.div>
    </div>
  );
};
