
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Conditional loading for 3G optimization
const isSlowConnection = navigator.connection && 
  (navigator.connection.effectiveType === 'slow-2g' || 
   navigator.connection.effectiveType === '2g' || 
   navigator.connection.effectiveType === '3g');

// Lazy load components with preload hints for faster networks
const AnimatedHeroSection = React.lazy(() => {
  if (isSlowConnection) {
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

// Only load online monitor for faster connections
const OnlineUsersMonitor = React.lazy(() => 
  import('@/components/OnlineUsersMonitor')
);

const Index = () => {
  // Reduce animations for slow connections
  const animationDuration = isSlowConnection ? 0.2 : 0.8;
  const shouldShowOnlineMonitor = !isSlowConnection;

  return (
    <MobileLayout className="min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationDuration }}
      >
        <Header />
        
        {shouldShowOnlineMonitor && (
          <Suspense fallback={null}>
            <OnlineUsersMonitor />
          </Suspense>
        )}
        
        <motion.main
          initial={{ opacity: 0, y: isSlowConnection ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration * 0.75, delay: 0.1 }}
          className="overflow-x-hidden"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatedHeroSection />
          </Suspense>
          
          <Suspense fallback={
            <div className="h-32 flex items-center justify-center text-sm text-gray-600">
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
