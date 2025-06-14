
import { motion } from 'framer-motion';
import { FileText, Palette, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const getServiceIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'printing': return FileText;
    case 'color': return Palette;
    case 'delivery': return Truck;
    case 'binding': return Package;
    default: return FileText;
  }
};

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    price: string;
    description: string;
    category: string;
  };
  index: number;
  variants: any;
}

const ServiceCard = ({ service, index, variants }: ServiceCardProps) => {
  const IconComponent = getServiceIcon(service.category);

  return (
    <motion.div
      key={service.id}
      variants={variants}
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
};

export default ServiceCard;
