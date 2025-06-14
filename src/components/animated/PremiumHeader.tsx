
import { motion } from 'framer-motion';
import { Crown, Star } from 'lucide-react';

const PremiumHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <motion.div
        className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-2xl border border-white/30 text-gray-800 px-8 py-4 rounded-full text-sm font-bold mb-10 shadow-2xl"
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            "0 35px 60px -12px rgba(0, 0, 0, 0.35)",
            "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Crown className="w-5 h-5 text-yellow-500" />
        </motion.div>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Premium Services Portfolio
        </span>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Star className="w-5 h-5 text-blue-500 fill-current" />
        </motion.div>
      </motion.div>

      <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8">
        <motion.span 
          className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: "200% 200%" }}
        >
          Revolutionary
        </motion.span>
        <br />
        <motion.span 
          className="inline-block bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ backgroundSize: "200% 200%" }}
        >
          Services
        </motion.span>
      </h2>
      <motion.p
        className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Experience the future of printing with our 
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> cutting-edge technology </span>
        and unmatched quality standards.
      </motion.p>
    </motion.div>
  );
};

export default PremiumHeader;
