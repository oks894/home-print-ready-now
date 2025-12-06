import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileEdit, 
  ListChecks, 
  Users, 
  Check, 
  Clock, 
  Shield, 
  Zap,
  DollarSign,
  GraduationCap,
  Search
} from 'lucide-react';

const AssignmentHelp = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: 'Upload Assignment',
      description: 'Upload files or type your questions',
      action: () => navigate('/ellio-notes/assignment-help/upload'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileEdit,
      title: 'Type Question',
      description: 'Quickly type your question for help',
      action: () => navigate('/ellio-notes/assignment-help/type'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: ListChecks,
      title: 'My Requests',
      description: 'Track your assignments',
      action: () => navigate('/ellio-notes/assignment-help/my-requests'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Search,
      title: 'Browse Questions',
      description: 'View all available assignments',
      action: () => navigate('/ellio-notes/assignment-help/browse'),
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Become a Solver',
      description: 'Earn by helping others',
      action: () => navigate('/ellio-notes/assignment-help/solver/register'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    { icon: Check, text: 'Verified by Dynamic Edu' },
    { icon: Clock, text: 'Fast turnaround time' },
    { icon: Shield, text: 'Quality guaranteed' },
    { icon: Zap, text: 'Urgent help available' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            🎓 Powered by Dynamic Edu
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Assignment Help
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Get expert help with your assignments - Fast, Affordable, Verified
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <benefit.icon className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          <Card className="border-2 border-blue-200 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Normal
              </CardTitle>
              <CardDescription>Standard turnaround time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 mb-2">₹15</div>
              <p className="text-gray-600 mb-4">per question</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  2-3 days delivery
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Verified solutions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Expert solvers
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-600" />
                Urgent
                <Badge variant="destructive">Popular</Badge>
              </CardTitle>
              <CardDescription>Fast-track your assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600 mb-2">₹20</div>
              <p className="text-gray-600 mb-4">₹15 base + ₹5 urgent</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  24 hours delivery
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Priority processing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Verified solutions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-purple-200"
                onClick={feature.action}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Students */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                For Students
              </h3>
              <div className="space-y-4">
                {[
                  'Upload or type your assignment',
                  'Pay ₹15 (or subject-specific rate)',
                  'Expert solvers work on it',
                  'Get verified solution from Dynamic Edu'
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* For Solvers */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                For Solvers
              </h3>
              <div className="space-y-4">
                {[
                  'Register as a verified solver',
                  'Browse available assignments',
                  'Complete and submit solutions',
                  'Earn ₹9 per assignment (verified by admin)'
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-12 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Help?</h2>
          <p className="text-lg mb-8 opacity-90">Start your assignment now and get expert assistance</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/ellio-notes/assignment-help/upload')}
            >
              Upload Assignment
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => navigate('/ellio-notes/assignment-help/type')}
            >
              Type Question
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AssignmentHelp;