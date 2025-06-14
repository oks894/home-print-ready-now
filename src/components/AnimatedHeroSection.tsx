
import { motion } from 'framer-motion';
import { Printer, FileText, Clock, CheckCircle, Sparkles, Zap, Star } from 'lucide-react';
import Scene3D from './3d/Scene3D';
import { Suspense } from 'react';

const AnimatedHeroSection = () => {
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
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50"
          animate={{
            background: [
              "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #f3e8ff 50%, #fce7f3 75%, #dbeafe 100%)",
              "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 25%, #fce7f3 50%, #dbeafe 75%, #e0e7ff 100%)",
              "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 25%, #dbeafe 50%, #e0e7ff 75%, #f3e8ff 100%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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

        {/* Enhanced 3D Scene with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20"
        >
          <div className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <Suspense fallback={
                <div className="h-[600px] w-full bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-2xl flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                  />
                </div>
              }>
                <Scene3D />
              </Suspense>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              icon: FileText,
              title: "AI Upload",
              description: "Smart file processing with instant optimization and error detection",
              color: "from-blue-500 to-cyan-500",
              delay: 0
            },
            {
              icon: Clock,
              title: "Live Tracking",
              description: "Real-time 3D visualization of your print progress with notifications",
              color: "from-purple-500 to-pink-500",
              delay: 0.1
            },
            {
              icon: CheckCircle,
              title: "Premium Quality",
              description: "Professional results with advanced materials and precision control",
              color: "from-green-500 to-emerald-500",
              delay: 0.2
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Optimized printing speeds without compromising quality standards",
              color: "from-yellow-500 to-orange-500",
              delay: 0.3
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
              style={{ 
                transition: `all 0.3s ease-in-out ${feature.delay}s` 
              }}
            >
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="relative"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <div className="bg-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedHeroSection;
