import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Lock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  preview_image: string | null;
}

const ResumeLab = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [purchasedTemplates, setPurchasedTemplates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .eq('status', 'active')
        .order('display_order');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const checkPurchase = async (templateId: string, email: string) => {
    const { data } = await supabase
      .from('resume_purchases')
      .select('id')
      .eq('template_id', templateId)
      .eq('user_email', email)
      .single();
    
    return !!data;
  };

  const handleUnlock = async (template: Template) => {
    const email = prompt('Enter your email to unlock this template:');
    if (!email) return;

    // Validate email
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setUserEmail(email);

    // Check if already purchased
    const alreadyPurchased = await checkPurchase(template.id, email);
    if (alreadyPurchased) {
      toast.success('You already own this template!');
      setPurchasedTemplates(prev => new Set(prev).add(template.id));
      navigate(`/resume-lab/editor/${template.id}?email=${email}`);
      return;
    }

    // For now, simulate payment (in production, integrate with payment gateway)
    const confirmPurchase = confirm(
      `Unlock "${template.name}" for ₹${template.price}?\n\n` +
      `This will give you lifetime access to edit and export this template.`
    );

    if (!confirmPurchase) return;

    try {
      const { error } = await supabase
        .from('resume_purchases')
        .insert({
          user_email: email,
          template_id: template.id,
          amount_paid: template.price,
          payment_reference: `REF-${Date.now()}`
        });

      if (error) throw error;

      toast.success('Template unlocked successfully!');
      setPurchasedTemplates(prev => new Set(prev).add(template.id));
      navigate(`/resume-lab/editor/${template.id}?email=${email}`);
    } catch (error: any) {
      console.error('Error purchasing template:', error);
      if (error.code === '23505') {
        toast.error('You already own this template!');
      } else {
        toast.error('Failed to unlock template');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      professional: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      modern: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      creative: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      international: 'bg-green-500/10 text-green-600 border-green-500/20'
    };
    return colors[category] || colors.professional;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto text-center relative"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Premium Resume Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ellio Resume Lab
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              World-class resume templates trusted by professionals worldwide. 
              Build, customize, and export ATS-friendly resumes in minutes.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>ATS-Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>PDF Export</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Templates Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-center mb-12"
            >
              Choose Your Template
            </motion.h2>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4" />
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                      {/* Template Preview */}
                      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FileText className="w-24 h-24 text-gray-400 group-hover:scale-110 transition-transform" />
                        
                        <Badge className={`absolute top-4 right-4 ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </Badge>
                      </div>

                      {/* Template Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {template.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-purple-600">₹{template.price}</span>
                            <span className="text-sm text-gray-500">one-time</span>
                          </div>

                          <Button
                            onClick={() => handleUnlock(template)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Unlock
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ellio Resume Lab?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: 'Professional Templates',
                  description: 'Designed by experts, trusted by professionals at top companies worldwide.'
                },
                {
                  icon: Sparkles,
                  title: 'Full Customization',
                  description: 'Customize colors, fonts, spacing, and layout to match your personal brand.'
                },
                {
                  icon: CheckCircle,
                  title: 'ATS-Friendly',
                  description: 'Optimized to pass applicant tracking systems used by 99% of companies.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResumeLab;
