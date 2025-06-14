
import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

const AnimatedContactSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="bg-gradient-to-r from-white/40 via-blue-50/40 to-purple-50/40 backdrop-blur-2xl rounded-3xl p-12 text-center shadow-2xl border border-white/30 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <motion.h3
            className="text-4xl font-black text-gray-900 mb-8"
            animate={{ 
              scale: [1, 1.02, 1],
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 30px rgba(147, 51, 234, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ready for the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Future</span>?
          </motion.h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <motion.a 
              href="tel:+918787665349" 
              className="group relative overflow-hidden"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl shadow-2xl font-bold text-lg">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Phone className="w-6 h-6" />
                </motion.div>
                Call: +91 8787665349
              </div>
            </motion.a>
            
            <motion.a 
              href="https://wa.me/918787665349" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-5 rounded-2xl shadow-2xl font-bold text-lg">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MessageCircle className="w-6 h-6" />
                </motion.div>
                WhatsApp Chat
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedContactSection;
