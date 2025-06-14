
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
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
  );
};

export default AnimatedBackground;
