
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, Zap } from 'lucide-react';

interface HeroFeaturesProps {
  containerVariants: any;
  itemVariants: any;
  floatingVariants: any;
}

const HeroFeatures = ({ containerVariants, itemVariants, floatingVariants }: HeroFeaturesProps) => {
  const features = [
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
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
    >
      {features.map((feature, index) => (
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
  );
};

export default HeroFeatures;
