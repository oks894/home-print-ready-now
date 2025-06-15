
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

// Get adaptive configuration
const adaptiveConfig = getAdaptiveConfig();

// Conditional loading based on connection speed
const AnimatedHeroSection = React.lazy(() => {
  if (adaptiveConfig.simplifiedUI) {
    // For slow connections, load a simpler version
    return import('@/components/SimpleHeroSection');
  }
  return import('@/components/AnimatedHeroSection');
});

const MainContentSections = React.lazy(() => 
  import('@/components/MainContentSections').then(module => ({ 
    default: module.default 
  }))
);

// Always show online monitor but load it lazily
const OnlineUsersMonitor = React.lazy(() => 
  import('@/components/OnlineUsersMonitor')
);

const Index = () => {
  const { animationDuration, enableHeavyAnimations, simplifiedUI } = adaptiveConfig;

  return (
    <MobileLayout className={`min-h-screen ${simplifiedUI ? 'connection-3g' : ''}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationDuration }}
      >
        <Header />
        
        <Suspense fallback={null}>
          <OnlineUsersMonitor />
        </Suspense>
        
        <motion.main
          initial={{ opacity: 0, y: enableHeavyAnimations ? 20 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration * 0.75, delay: enableHeavyAnimations ? 0.1 : 0 }}
          className="overflow-x-hidden"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatedHeroSection />
          </Suspense>
          
          <Suspense fallback={
            <div className={`h-32 flex items-center justify-center text-sm text-gray-600 ${
              simplifiedUI ? 'animate-none' : 'animate-pulse'
            }`}>
              Loading content...
            </div>
          }>
            <MainContentSections />
          </Suspense>
        </motion.main>
        
        <Footer />
      </motion.div>
    </MobileLayout>
  );
};

export default Index;
