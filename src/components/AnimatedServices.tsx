
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/useServices';
import AnimatedBackground from './animated/AnimatedBackground';
import PremiumHeader from './animated/PremiumHeader';
import ServiceCard from './animated/ServiceCard';
import AnimatedContactSection from './animated/AnimatedContactSection';

const AnimatedServices = () => {
  const { services, isLoading } = useServices();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, rotateX: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section id="services" className="relative py-24 px-4 overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <PremiumHeader />

        {/* Enhanced Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20"
        >
          {isLoading ? (
            // Enhanced Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20"
              >
                <Skeleton className="w-16 h-16 mx-auto mb-6 rounded-2xl" />
                <Skeleton className="h-8 w-40 mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-6" />
                <Skeleton className="h-5 w-full mb-3" />
                <Skeleton className="h-5 w-4/5 mx-auto" />
              </motion.div>
            ))
          ) : (
            services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                variants={itemVariants}
              />
            ))
          )}
        </motion.div>

        <AnimatedContactSection />
      </div>
    </section>
  );
};

export default AnimatedServices;
