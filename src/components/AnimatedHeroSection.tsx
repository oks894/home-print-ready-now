
import { useNavigate } from 'react-router-dom';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import Hero3DScene from './hero/Hero3DScene';
import HeroFeatures from './hero/HeroFeatures';

const AnimatedHeroSection = () => {
  const navigate = useNavigate();

  const handleStartPrinting = () => {
    navigate('/printing');
  };

  const handleViewGallery = () => {
    navigate('/services');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative pt-20 pb-16 px-4 overflow-hidden min-h-screen">
      <HeroBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <HeroContent
          onStartPrinting={handleStartPrinting}
          onViewGallery={handleViewGallery}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />

        <Hero3DScene />

        <HeroFeatures
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          floatingVariants={floatingVariants}
        />
      </div>
    </section>
  );
};

export default AnimatedHeroSection;
