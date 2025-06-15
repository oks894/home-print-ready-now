
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import OnlineUsersMonitor from '@/components/OnlineUsersMonitor';

// Lazy load heavy components to reduce initial bundle size
const AnimatedHeroSection = React.lazy(() => import('@/components/AnimatedHeroSection'));
const MainContentSections = React.lazy(() => import('@/components/MainContentSections').then(module => ({ default: module.MainContentSections })));

const Index = () => {
  return (
    <MobileLayout className="min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <OnlineUsersMonitor />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-hidden"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatedHeroSection />
          </Suspense>
          
          <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading content...</div>}>
            <MainContentSections />
          </Suspense>
        </motion.main>
        
        <Footer />
      </motion.div>
    </MobileLayout>
  );
};

export default Index;
