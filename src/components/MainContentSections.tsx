
import { motion } from 'framer-motion';
import AnimatedServices from '@/components/AnimatedServices';
import PaymentQR from '@/components/PaymentQR';
import Feedback from '@/components/Feedback';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

export const MainContentSections = () => {
  const { enableHeavyAnimations, animationDuration } = getAdaptiveConfig();
  
  return (
    <>
      <AnimatedServices />
      
      <motion.div
        initial={enableHeavyAnimations ? { opacity: 0, scale: 0.95 } : { opacity: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: animationDuration }}
        viewport={{ once: true }}
      >
        <PaymentQR />
      </motion.div>
      
      <motion.div
        initial={enableHeavyAnimations ? { opacity: 0, y: 30 } : { opacity: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: animationDuration }}
        viewport={{ once: true }}
      >
        <Feedback />
      </motion.div>
    </>
  );
};

export default MainContentSections;
