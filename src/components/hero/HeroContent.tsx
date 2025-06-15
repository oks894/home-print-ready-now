
import { motion } from 'framer-motion';
import { Sparkles, FileText, Star, Zap } from 'lucide-react';

interface HeroContentProps {
  onStartPrinting: () => void;
  onViewGallery: () => void;
  containerVariants: any;
  itemVariants: any;
}

const HeroContent = ({ 
  onStartPrinting, 
  onViewGallery, 
  containerVariants, 
  itemVariants 
}: HeroContentProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-16"
    >
      {/* Premium Badge */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-xl border border-white/20 text-gray-800 px-8 py-4 rounded-full text-sm font-semibold mb-10 shadow-2xl"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
        </motion.div>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Premium 3D Print Technology
        </span>
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="w-5 h-5 text-blue-500" />
        </motion.div>
      </motion.div>

      {/* Main Heading with Enhanced Typography */}
      <motion.h1
        variants={itemVariants}
        className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight"
      >
        <motion.span 
          className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-blue-800 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: "200% 200%" }}
        >
          Future of
        </motion.span>
        <br />
        <motion.span 
          className="inline-block bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ backgroundSize: "200% 200%" }}
        >
          Printing
        </motion.span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-2xl sm:text-3xl text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed font-medium"
      >
        Experience revolutionary 3D printing with AI-powered optimization, 
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> real-time tracking</span>, 
        and premium quality delivery.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
      >
        <motion.button
          onClick={onStartPrinting}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <span className="relative z-10 flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Start Printing Now
          </span>
        </motion.button>
        
        <motion.button
          onClick={onViewGallery}
          className="group bg-white/30 backdrop-blur-xl border-2 border-white/20 text-gray-800 px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:bg-white/50 transition-all duration-300"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            View Gallery
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
