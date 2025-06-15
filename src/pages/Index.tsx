
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedHeroSection from '@/components/AnimatedHeroSection';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ActionButtonsSection } from '@/components/ActionButtonsSection';
import { MainContentSections } from '@/components/MainContentSections';

const Index = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MobileLayout className="min-h-screen">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Header />
          
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-x-hidden"
          >
            <AnimatedHeroSection />
            <ActionButtonsSection />
            <MainContentSections />
          </motion.main>
          
          <Footer />
        </motion.div>
      </MobileLayout>
    </Suspense>
  );
};

export default Index;
