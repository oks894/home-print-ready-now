
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Zap, Star, Crown, Sparkles } from 'lucide-react';

const AnimatedContactSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Ultra-Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 via-pink-600 to-blue-800"
          animate={{
            background: [
              "linear-gradient(135deg, #2563eb 0%, #7c3aed 25%, #db2777 50%, #1e40af 75%, #2563eb 100%)",
              "linear-gradient(135deg, #7c3aed 0%, #db2777 25%, #1e40af 50%, #2563eb 75%, #7c3aed 100%)",
              "linear-gradient(135deg, #db2777 0%, #1e40af 25%, #2563eb 50%, #7c3aed 75%, #db2777 100%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated Mesh Pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 3px, transparent 3px),
                             radial-gradient(circle at 75% 75%, white 3px, transparent 3px),
                             radial-gradient(circle at 50% 50%, white 2px, transparent 2px)`,
            backgroundSize: '80px 80px, 120px 120px, 60px 60px'
          }}
          animate={{
            backgroundPosition: ['0px 0px, 0px 0px, 0px 0px', '80px 80px, 120px 120px, 60px 60px'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating Elements */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-50, 50, -50],
              x: [-30, 30, -30],
              rotate: [0, 360],
              scale: [0.3, 1.5, 0.3],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          >
            <div className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-white' : 'bg-yellow-300'} ${Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm rotate-45'}`} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-2xl text-white px-8 py-4 rounded-full text-sm font-bold mb-8 border border-white/30 shadow-2xl"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 25px 50px -12px rgba(255, 255, 255, 0.25)",
                "0 35px 60px -12px rgba(255, 255, 255, 0.35)",
                "0 25px 50px -12px rgba(255, 255, 255, 0.25)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-5 h-5 text-yellow-300" />
            </motion.div>
            24/7 Premium Support
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-yellow-300" />
            </motion.div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8">
            <motion.span
              animate={{
                textShadow: [
                  "0 0 20px rgba(255, 255, 255, 0.5)",
                  "0 0 40px rgba(255, 255, 255, 0.8)",
                  "0 0 20px rgba(255, 255, 255, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Need Help? We're
            </motion.span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Always Here!
            </motion.span>
          </h2>
          
          <motion.p
            className="text-xl sm:text-2xl text-blue-100 mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Get instant expert support for all your printing needs with our revolutionary
            <span className="text-yellow-300 font-bold"> AI-powered assistance </span>
            and human touch
          </motion.p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          <motion.a 
            href="tel:+917005498122" 
            className="group relative overflow-hidden"
            whileHover={{ scale: 1.1, y: -10, rotateY: 5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl" />
            <div className="relative flex items-center gap-4 bg-white text-blue-600 px-10 py-6 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-500 font-bold text-xl min-w-[300px] justify-center shadow-2xl border-2 border-white/30">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <Phone className="w-7 h-7" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
              <div className="text-left">
                <div className="text-lg">Call Now</div>
                <div className="text-sm opacity-70">+91 7005498122</div>
              </div>
            </div>
          </motion.a>
          
          <motion.a 
            href="https://wa.me/917005498122" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative overflow-hidden"
            whileHover={{ scale: 1.1, y: -10, rotateY: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded-2xl" />
            <div className="relative flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-500 font-bold text-xl min-w-[300px] justify-center shadow-2xl">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative"
              >
                <MessageCircle className="w-7 h-7" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </motion.div>
              <div className="text-left">
                <div className="text-lg">WhatsApp</div>
                <div className="text-sm opacity-90">Instant Chat</div>
              </div>
            </div>
          </motion.a>
        </div>
        
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-300 fill-current" />
            <span className="text-lg font-semibold">Available Mon-Sat: 9AM-6PM</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/30" />
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-green-300" />
            </motion.div>
            <span className="text-lg font-semibold">24/7 WhatsApp Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedContactSection;
