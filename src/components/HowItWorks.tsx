import { motion } from 'framer-motion';
import { MousePointer, Upload, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Choose Service',
    description: 'Select from our range of student services',
    icon: MousePointer,
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    title: 'Upload or Submit',
    description: 'Submit your files or assignment details',
    icon: Upload,
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '03',
    title: 'Make Payment',
    description: 'Pay securely via UPI or WhatsApp',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
  },
  {
    number: '04',
    title: 'Get Results',
    description: 'Receive your prints, notes, or solutions',
    icon: CheckCircle,
    color: 'from-pink-500 to-pink-600',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in just 4 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Number Badge */}
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Step Number */}
                <span className="text-sm font-bold text-muted-foreground mb-2">
                  STEP {step.number}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
