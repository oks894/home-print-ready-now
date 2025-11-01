import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Printer, FileText, Shield, Clock, Truck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EllioPrints = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: FileText,
      title: 'Document Printing',
      description: 'High-quality B&W and color printing for all your documents',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Lamination',
      description: 'Professional lamination to protect your important documents',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FileText,
      title: 'Resume Templates',
      description: 'Professional resume and certificate templates',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FileText,
      title: 'Form Filling & Typing',
      description: 'Expert assistance with form filling and typing services',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Truck,
      title: 'Delivery Service',
      description: 'Fast and reliable delivery to your doorstep',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Get your documents printed and ready in no time',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const steps = [
    { number: '1', title: 'Upload Documents', description: 'Upload your files securely' },
    { number: '2', title: 'Select Services', description: 'Choose printing options' },
    { number: '3', title: 'Schedule Pickup', description: 'Select convenient time slot' },
    { number: '4', title: 'Track & Receive', description: 'Monitor status in real-time' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Printer className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Ellio Prints</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Complete Document Solution
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional printing, lamination, and delivery services for students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/printing')}
                className="text-lg px-8"
              >
                <Printer className="w-5 h-5 mr-2" />
                Upload & Print
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/track')}
                className="text-lg px-8"
              >
                <Clock className="w-5 h-5 mr-2" />
                Track Order
              </Button>
            </div>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            id="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Affordable Pricing</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Transparent pricing with no hidden charges
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">B&W Printing</h3>
                <p className="text-4xl font-bold text-primary mb-2">₹2</p>
                <p className="text-muted-foreground">per page</p>
              </Card>
              <Card className="p-6 border-2 border-primary">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Color Printing</h3>
                <p className="text-4xl font-bold text-primary mb-2">₹10</p>
                <p className="text-muted-foreground">per page</p>
              </Card>
              <Card className="p-6">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Lamination</h3>
                <p className="text-4xl font-bold text-primary mb-2">₹20</p>
                <p className="text-muted-foreground">per document</p>
              </Card>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Upload your documents now and experience hassle-free printing
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/printing')}
              className="text-lg px-8"
            >
              Start Printing Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EllioPrints;
