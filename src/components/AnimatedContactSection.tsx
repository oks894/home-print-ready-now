
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Zap } from 'lucide-react';

const AnimatedContactSection = () => {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-4 h-4" />
            Lightning Fast Support
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Need Help? We're Here!
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Get instant support for all your printing needs with our 24/7 assistance
          </p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.a 
            href="tel:+917005498122" 
            className="group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4 bg-white text-blue-600 px-8 py-5 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold text-lg min-w-[250px] justify-center shadow-xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Phone className="w-6 h-6" />
              </motion.div>
              Call +91 7005498122
            </div>
          </motion.a>
          
          <motion.a 
            href="https://wa.me/917005498122" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4 bg-green-500 text-white px-8 py-5 rounded-xl hover:bg-green-600 transition-all duration-300 font-semibold text-lg min-w-[250px] justify-center shadow-xl">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
              WhatsApp Chat
            </div>
          </motion.a>
        </div>
        
        <motion.p
          className="text-blue-100 mt-8 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Available Mon-Sat: 9AM-5PM | 24/7 WhatsApp Support
        </motion.p>
      </div>
    </section>
  );
};

export default AnimatedContactSection;
