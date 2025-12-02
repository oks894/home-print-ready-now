import { motion } from 'framer-motion';
import { Shield, BadgeCheck, Wallet, Zap, Smartphone, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your files and data are encrypted and protected',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: BadgeCheck,
    title: 'Verified by Dynamic Edu',
    description: 'Quality assured by our trusted education platform',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Wallet,
    title: 'Affordable Pricing',
    description: 'Student-friendly rates with no hidden charges',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Quick processing and delivery for all services',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access all services from any device, anywhere',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Star,
    title: 'Trusted by 500+ Students',
    description: 'Join our growing community of satisfied users',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export const WhyChooseEllio = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ellio</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for academic success, all in one place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseEllio;
