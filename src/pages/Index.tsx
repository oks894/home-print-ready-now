
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Printer, GalleryHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackingPopup from '@/components/TrackingPopup';
import AnimatedServices from '@/components/AnimatedServices';
import Feedback from '@/components/Feedback';
import PaymentQR from '@/components/PaymentQR';
import AnimatedHeroSection from '@/components/AnimatedHeroSection';
import AnimatedContactSection from '@/components/AnimatedContactSection';
import PrintJobForm from '@/components/PrintJobForm';
import { MobileLayout } from '@/components/mobile/MobileLayout';

// Loading component for better UX
const LoadingSpinner = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`border-4 border-blue-500 border-t-transparent rounded-full ${
            isMobile ? 'w-12 h-12' : 'w-16 h-16'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className={`font-semibold text-gray-700 ${
            isMobile ? 'text-lg text-center px-4' : 'text-xl'
          }`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Premium Experience...
        </motion.p>
      </motion.div>
    </div>
  );
};

const Index = () => {
  const [showTrackingPopup, setShowTrackingPopup] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleOrderSubmitted = (newTrackingId: string) => {
    setTrackingId(newTrackingId);
    setShowTrackingPopup(true);
  };

  const resetForm = () => {
    setShowTrackingPopup(false);
    setTrackingId('');
  };

  const scrollToPrintJobs = () => {
    const printJobsSection = document.getElementById('print-jobs-section');
    if (printJobsSection) {
      printJobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const viewGallery = () => {
    navigate('/services');
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
            
            {/* Action Buttons Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`${isMobile ? 'py-10 px-4' : 'py-12 px-4'} bg-gradient-to-r from-blue-50 via-white to-purple-50`}
            >
              <div className="max-w-4xl mx-auto text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`font-bold text-gray-900 mb-8 ${
                    isMobile ? 'text-2xl' : 'text-3xl'
                  }`}
                >
                  Ready to Get Started?
                </motion.h2>
                
                <div className={`flex gap-6 justify-center ${
                  isMobile ? 'flex-col items-center' : 'flex-row'
                }`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      onClick={scrollToPrintJobs}
                      size={isMobile ? "lg" : "lg"}
                      className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0 ${
                        isMobile ? 'w-72 h-16 text-lg rounded-2xl' : 'px-8 py-4 text-lg rounded-xl'
                      }`}
                    >
                      <Printer className="mr-3 h-6 w-6" />
                      Start Printing Now
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      onClick={viewGallery}
                      variant="outline"
                      size={isMobile ? "lg" : "lg"}
                      className={`border-2 border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-700 hover:text-white hover:border-purple-700 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm ${
                        isMobile ? 'w-72 h-16 text-lg rounded-2xl' : 'px-8 py-4 text-lg rounded-xl'
                      }`}
                    >
                      <GalleryHorizontal className="mr-3 h-6 w-6" />
                      View Gallery
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <AnimatedContactSection />
            
            <motion.div
              id="print-jobs-section"
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
      </MobileLayout>
    </Suspense>
  );
};

export default Index;
