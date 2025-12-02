import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Printer, BookOpen, GraduationCap, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HomeHero = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Printer,
      title: 'Ellio Prints',
      emoji: '🖨️',
      description: 'Print, Laminate & Deliver Documents',
      features: ['Document Printing', 'Lamination', 'Quick Delivery'],
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
      path: '/ellio-prints',
    },
    {
      icon: BookOpen,
      title: 'Ellio Notes',
      emoji: '📘',
      description: 'Share & Access Student Notes',
      features: ['Browse Notes', 'Upload Notes', 'Request Notes'],
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
      path: '/ellio-notes',
    },
    {
      icon: GraduationCap,
      title: 'Assignment Help',
      emoji: '✍️',
      description: 'Get Expert Help with Assignments',
      features: ['Upload Questions', 'Track Progress', 'Get Solutions'],
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
      path: '/ellio-notes/assignment-help',
    },
    {
      icon: FileText,
      title: 'Resume Lab',
      emoji: '📄',
      description: 'Build Professional Resumes',
      features: ['Modern Templates', 'Easy Editor', 'PDF Export'],
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30',
      path: '/resume-lab',
    },
  ];

  return (
    <section className="relative pt-24 pb-16 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/40 to-purple-200/40 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-green-200/40 to-teal-200/40 dark:from-green-800/20 dark:to-teal-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-200/30 to-orange-200/30 dark:from-pink-800/10 dark:to-orange-800/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Empowering Students, One Service at a Time</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ellio
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Your Complete Student Services Platform — Print, Learn, and Succeed
          </motion.p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="cursor-pointer group"
                onClick={() => navigate(service.path)}
              >
                <Card className={`p-6 h-full bg-gradient-to-br ${service.bgGradient} border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300`}>
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                      {service.title}
                      <span className="text-lg">{service.emoji}</span>
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                    {/* Features */}
                    <ul className="space-y-2 mb-4 flex-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      variant="ghost"
                      className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(service.path);
                      }}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
