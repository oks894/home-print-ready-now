import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Printer, BookOpen, ArrowRight } from 'lucide-react';
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
      features: ['Document Printing', 'Lamination', 'Resume Templates', 'Quick Delivery'],
      color: 'from-blue-500 to-purple-600',
      bgColor: 'from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20',
      path: '/ellio-prints'
    },
    {
      icon: BookOpen,
      title: 'Ellio Notes',
      emoji: '📘',
      description: 'Share & Access Student Notes',
      features: ['Browse Notes', 'Upload Notes', 'Request Notes', 'Top Contributors'],
      color: 'from-green-500 to-teal-600',
      bgColor: 'from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20',
      path: '/ellio-notes'
    },
    {
      icon: BookOpen,
      title: 'Assignment Help',
      emoji: '✍️',
      description: 'Upload Questions, Get Help, Earn Money',
      features: ['Upload Assignment', 'Type Question', 'Track Requests', 'Become Solver'],
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20',
      path: '/ellio-notes/assignment-help'
    }
  ];

  const stats = [
    { label: 'Total Prints', value: '500+', icon: Printer },
    { label: 'Notes Available', value: '150+', icon: BookOpen },
    { label: 'Assignments Solved', value: '25+', icon: BookOpen },
    { label: 'Happy Students', value: '200+', icon: '🎓' }
  ];

  return (
    <section className="relative pt-20 pb-16 px-4 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-800/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="text-6xl md:text-7xl mb-4">📚🖨️</div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Welcome to Ellio
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Your Complete Student Services Platform
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                whileHover={{ y: -8 }}
                className="cursor-pointer"
                onClick={() => navigate(service.path)}
              >
                <Card className={`p-8 h-full bg-gradient-to-br ${service.bgColor} border-2 hover:shadow-2xl transition-all duration-300`}>
                  <div className="flex flex-col h-full">
                    {/* Icon and Title */}
                    <div className="mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        {service.title} {service.emoji}
                      </h2>
                      <p className="text-lg text-muted-foreground">{service.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6 flex-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      className={`w-full text-lg py-6 bg-gradient-to-r ${service.color} hover:opacity-90 transition-opacity`}
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(service.path);
                      }}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
              className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground italic">
            "Powered by Ellio — Learn, Print, Progress"
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
