
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackingPopup from '@/components/TrackingPopup';
import AnimatedHeroSection from '@/components/AnimatedHeroSection';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ActionButtonsSection } from '@/components/ActionButtonsSection';
import { MainContentSections } from '@/components/MainContentSections';

const Index = () => {
  const [showTrackingPopup, setShowTrackingPopup] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleOrderSubmitted = (newTrackingId: string) => {
    setTrackingId(newTrackingId);
    setShowTrackingPopup(true);
  };

  const resetForm = () => {
    setShowTrackingPopup(false);
    setTrackingId('');
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MobileLayout className="min-h-screen">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Header />
          
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="overflow-x-hidden"
          >
            <AnimatedHeroSection />
            <ActionButtonsSection />
            <MainContentSections onOrderSubmitted={handleOrderSubmitted} />
          </motion.main>
          
          <Footer />

          {showTrackingPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <TrackingPopup
                trackingId={trackingId}
                onClose={() => setShowTrackingPopup(false)}
                onNewOrder={resetForm}
              />
            </motion.div>
          )}
        </motion.div>
      </MobileLayout>
    </Suspense>
  );
};

export default Index;
