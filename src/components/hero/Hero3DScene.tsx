
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import Scene3D from '../3d/Scene3D';

const Hero3DScene = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-12 md:mb-16 flex justify-center"
    >
      <div className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/30 w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
        <div className="relative z-10">
          <Suspense fallback={
            <div className="h-96 w-full bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-2xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          }>
            <Scene3D />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero3DScene;
