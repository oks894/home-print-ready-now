
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export const LoadingSpinner = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
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
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Premium Experience...
        </motion.p>
      </motion.div>
    </div>
  );
};
