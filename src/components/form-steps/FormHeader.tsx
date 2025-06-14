
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export const FormHeader = () => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center ${isMobile ? 'mb-6 px-4' : 'mb-12'}`}
    >
      <h2 className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 ${
        isMobile ? 'text-2xl leading-tight' : 'text-4xl md:text-5xl'
      }`}>
        Submit Your Print Job
      </h2>
      <p className={`text-gray-600 max-w-3xl mx-auto ${
        isMobile ? 'text-base leading-relaxed' : 'text-xl'
      }`}>
        Professional printing made simple. Upload, customize, and get your documents printed with premium quality.
      </p>
    </motion.div>
  );
};
