
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Printer, GalleryHorizontal } from 'lucide-react';

export const ActionButtonsSection = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const startPrinting = () => {
    navigate('/printing');
  };

  const viewGallery = () => {
    navigate('/services');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`${isMobile ? 'py-8 px-4' : 'py-12 px-4'} bg-gradient-to-r from-blue-50 via-white to-purple-50`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`font-bold text-gray-900 mb-6 ${
            isMobile ? 'text-xl' : 'text-3xl'
          }`}
        >
          Ready to Get Started?
        </motion.h2>
        
        <div className={`flex gap-4 justify-center ${
          isMobile ? 'flex-col items-center max-w-xs mx-auto' : 'flex-row'
        }`}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={isMobile ? 'w-full' : ''}
          >
            <Button
              onClick={startPrinting}
              size={isMobile ? "lg" : "lg"}
              className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0 ${
                isMobile ? 'w-full h-14 text-base rounded-xl' : 'px-8 py-4 text-lg rounded-xl'
              }`}
            >
              <Printer className="mr-2 h-5 w-5" />
              Start Printing Now
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={isMobile ? 'w-full' : ''}
          >
            <Button
              onClick={viewGallery}
              variant="outline"
              size={isMobile ? "lg" : "lg"}
              className={`border-2 border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-700 hover:text-white hover:border-purple-700 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm ${
                isMobile ? 'w-full h-14 text-base rounded-xl' : 'px-8 py-4 text-lg rounded-xl'
              }`}
            >
              <GalleryHorizontal className="mr-2 h-5 w-5" />
              View Gallery
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
