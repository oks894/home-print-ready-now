
import { motion } from 'framer-motion';
import AnimatedServices from '@/components/AnimatedServices';
import PaymentQR from '@/components/PaymentQR';
import Feedback from '@/components/Feedback';

export const MainContentSections = () => {
  return (
    <>
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
    </>
  );
};

export default MainContentSections;
