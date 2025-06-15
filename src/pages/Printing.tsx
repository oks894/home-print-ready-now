
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrintJobForm from '@/components/PrintJobForm';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useIsMobile } from '@/hooks/use-mobile';

const Printing = () => {
  const isMobile = useIsMobile();

  const handleOrderSubmitted = (trackingId: string) => {
    // You can add tracking popup logic here if needed
    console.log('Order submitted with tracking ID:', trackingId);
  };

  return (
    <MobileLayout className="min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Header />
        
        <motion.main
          initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${
            isMobile ? 'pb-safe' : ''
          }`}
        >
          <div className={`${isMobile ? 'pt-2 pb-4' : 'pt-8 pb-12'}`}>
            <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`font-bold text-gray-900 mb-2 ${
                  isMobile ? 'text-xl px-4' : 'text-4xl'
                }`}
              >
                Submit Your Print Job
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-gray-600 ${
                  isMobile ? 'text-sm px-4 leading-relaxed' : 'text-lg'
                }`}
              >
                Upload your files and get professional printing with doorstep delivery
              </motion.p>
            </div>

            <PrintJobForm onOrderSubmitted={handleOrderSubmitted} />
          </div>
        </motion.main>
        
        {!isMobile && <Footer />}
      </motion.div>
    </MobileLayout>
  );
};

export default Printing;
