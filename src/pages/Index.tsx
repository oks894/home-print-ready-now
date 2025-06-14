
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackingPopup from '@/components/TrackingPopup';
import AnimatedServices from '@/components/AnimatedServices';
import Feedback from '@/components/Feedback';
import PaymentQR from '@/components/PaymentQR';
import AnimatedHeroSection from '@/components/AnimatedHeroSection';
import AnimatedContactSection from '@/components/AnimatedContactSection';
import PrintJobForm from '@/components/PrintJobForm';

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-xl font-semibold text-gray-700"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading Premium Experience...
      </motion.p>
    </motion.div>
  </div>
);

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
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Header />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatedHeroSection />
          <AnimatedContactSection />
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <PrintJobForm onOrderSubmitted={handleOrderSubmitted} />
          </motion.div>
          
          <AnimatedServices />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <PaymentQR />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Feedback />
          </motion.div>
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
    </Suspense>
  );
};

export default Index;
