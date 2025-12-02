import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeHero from '@/components/HomeHero';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseEllio from '@/components/WhyChooseEllio';
import StatisticsBar from '@/components/StatisticsBar';
import CTASection from '@/components/CTASection';
import FloatingActionButton from '@/components/FloatingActionButton';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { SimpleLoader } from '@/components/SimpleLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getAdaptiveConfig } from '@/utils/connectionUtils';
import { useLiveTracking } from '@/hooks/useLiveTracking';

const adaptiveConfig = getAdaptiveConfig();

const OnlineUsersMonitor = React.lazy(() => 
  import('@/components/OnlineUsersMonitor')
);

const Index = () => {
  const { animationDuration, enableHeavyAnimations, simplifiedUI, ultraLightMode } = adaptiveConfig;
  
  useLiveTracking('home');

  return (
    <ErrorBoundary fallback={<SimpleLoader message="Loading home page..." />}>
      <MobileLayout className={`min-h-screen ${simplifiedUI ? 'connection-3g' : ''} ${ultraLightMode ? 'ultra-light' : ''}`}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: animationDuration }}
        >
          <ErrorBoundary fallback={<div className="h-16 bg-background" />}>
            <Header />
          </ErrorBoundary>
          
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
              <>
                <ErrorBoundary fallback={null}>
                  <StatisticsBar />
                </ErrorBoundary>
                
                <ErrorBoundary fallback={null}>
                  <HowItWorks />
                </ErrorBoundary>
                
                <ErrorBoundary fallback={null}>
                  <WhyChooseEllio />
                </ErrorBoundary>
                
                <ErrorBoundary fallback={null}>
                  <CTASection />
                </ErrorBoundary>
              </>
            )}
          </motion.main>
          
          <ErrorBoundary fallback={<div className="h-16 bg-muted" />}>
            <Footer />
          </ErrorBoundary>

          <FloatingActionButton />
        </motion.div>
      </MobileLayout>
    </ErrorBoundary>
  );
};

export default Index;
