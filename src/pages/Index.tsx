
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeHero from '@/components/HomeHero';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SimpleLoader } from '@/components/SimpleLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getAdaptiveConfig } from '@/utils/connectionUtils';
import { useLiveTracking } from '@/hooks/useLiveTracking';

// Get adaptive configuration
const adaptiveConfig = getAdaptiveConfig();

const MainContentSections = React.lazy(() => 
  import('@/components/MainContentSections').then(module => ({ 
    default: module.default 
  }))
);

const OnlineUsersMonitor = React.lazy(() => 
  import('@/components/OnlineUsersMonitor')
);

const Index = () => {
  const { animationDuration, enableHeavyAnimations, simplifiedUI, ultraLightMode } = adaptiveConfig;
  
  // Enable live tracking for the home page
  useLiveTracking('home');

  return (
    <ErrorBoundary fallback={<SimpleLoader message="Loading home page..." />}>
      <MobileLayout className={`min-h-screen ${simplifiedUI ? 'connection-3g' : ''} ${ultraLightMode ? 'ultra-light' : ''}`}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: animationDuration }}
        >
          <ErrorBoundary fallback={<div className="h-16 bg-white" />}>
            <Header />
          </ErrorBoundary>
          
          {/* Always show live monitor on all pages */}
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <OnlineUsersMonitor showMilestones={false} />
            </Suspense>
          </ErrorBoundary>
          
          <motion.main
            initial={{ opacity: 0, y: enableHeavyAnimations ? 20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animationDuration * 0.75, delay: enableHeavyAnimations ? 0.1 : 0 }}
            className="overflow-x-hidden"
          >
            <ErrorBoundary fallback={<SimpleLoader message="Loading content..." />}>
              <HomeHero />
            </ErrorBoundary>
            
            {!ultraLightMode && (
              <ErrorBoundary fallback={
                <div className="h-32 flex items-center justify-center text-sm text-gray-600">
                  Content temporarily unavailable
                </div>
              }>
                <Suspense fallback={
                  <div className={`h-32 flex items-center justify-center text-sm text-gray-600 ${
                    simplifiedUI ? 'animate-none' : 'animate-pulse'
                  }`}>
                    Loading content...
                  </div>
                }>
                  <MainContentSections />
                </Suspense>
              </ErrorBoundary>
            )}
          </motion.main>
          
          <ErrorBoundary fallback={<div className="h-16 bg-gray-100" />}>
            <Footer />
          </ErrorBoundary>
        </motion.div>
      </MobileLayout>
    </ErrorBoundary>
  );
};

export default Index;
