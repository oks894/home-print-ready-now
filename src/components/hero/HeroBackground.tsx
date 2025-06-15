
import { motion } from 'framer-motion';

const HeroBackground = () => {
  return (
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
  );
};

export default HeroBackground;
