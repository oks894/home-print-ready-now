
import { motion } from 'framer-motion';
import { FileText, Palette, Package, Truck, Phone, MessageCircle, Sparkles, Star, Zap, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/useServices';

const getServiceIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'printing': return FileText;
    case 'color': return Palette;
    case 'delivery': return Truck;
    case 'binding': return Package;
    default: return FileText;
  }
};

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
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 via-purple-50 to-pink-50"
          animate={{
            background: [
              "linear-gradient(135deg, #f8fafc 0%, #dbeafe 25%, #f3e8ff 50%, #fce7f3 75%, #f8fafc 100%)",
              "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 25%, #fce7f3 50%, #f8fafc 75%, #dbeafe 100%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Geometric Shapes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              rotate: [0, 360],
              scale: [0.5, 1.2, 0.5],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          >
            <div className={`w-${4 + Math.floor(Math.random() * 8)} h-${4 + Math.floor(Math.random() * 8)} bg-gradient-to-r from-blue-400/20 to-purple-400/20 ${Math.random() > 0.5 ? 'rounded-full' : 'rounded-lg rotate-45'}`} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header Section */}
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
            services.map((service, index) => {
              const IconComponent = getServiceIcon(service.category);
              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ 
                    y: -15,
                    rotateY: 5,
                    scale: 1.02
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className="bg-white/30 backdrop-blur-2xl border border-white/30 shadow-2xl group-hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden h-full relative">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Glowing Border Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                    
                    <CardHeader className="text-center pb-6 relative z-10">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        whileHover={{
                          scale: 1.15,
                          rotate: 15,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </motion.div>
                      <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {service.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-gray-700 leading-relaxed text-lg text-center">
                        {service.description}
                      </p>
                      
                      {/* Premium Badge */}
                      <motion.div
                        className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        PREMIUM
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Ultra-Premium Contact Section */}
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
      </div>
    </section>
  );
};

export default AnimatedServices;
