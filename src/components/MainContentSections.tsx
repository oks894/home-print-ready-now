
import { motion } from 'framer-motion';
import AnimatedContactSection from '@/components/AnimatedContactSection';
import PrintJobForm from '@/components/PrintJobForm';
import AnimatedServices from '@/components/AnimatedServices';
import PaymentQR from '@/components/PaymentQR';
import Feedback from '@/components/Feedback';

interface MainContentSectionsProps {
  onOrderSubmitted: (trackingId: string) => void;
}

export const MainContentSections = ({ onOrderSubmitted }: MainContentSectionsProps) => {
  return (
    <>
      <AnimatedContactSection />
      
      <motion.div
        id="print-jobs-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <PrintJobForm onOrderSubmitted={onOrderSubmitted} />
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
    </>
  );
};
