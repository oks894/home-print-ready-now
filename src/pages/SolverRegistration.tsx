import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SolverRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: ''
  });
  
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClassLevels, setSelectedClassLevels] = useState<string[]>([]);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'Accounts'];
  const classLevels = ['Class 6-8', 'Class 9-10', 'Class 11-12', 'B.Tech/Engineering'];

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleClassLevelToggle = (level: string) => {
    setSelectedClassLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.contact) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    if (selectedClassLevels.length === 0) {
      toast.error('Please select at least one class level');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('assignment_solvers')
        .insert({
          name: formData.name,
          contact: formData.contact,
          email: formData.email || null,
          subjects: selectedSubjects,
          class_levels: selectedClassLevels,
          is_verified: false,
          is_active: true
        });

      if (error) throw error;

      toast.success('Registration submitted!', {
        description: 'Your application is pending verification by Dynamic Edu. We will contact you soon.'
      });
      
      navigate('/ellio-notes/assignment-help');
    } catch (error: any) {
      console.error('Error registering solver:', error);
      if (error.code === '23505') {
        toast.error('This contact is already registered');
      } else {
        toast.error('Failed to submit registration');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="w-8 h-8 text-blue-600" />
                Become a Verified Solver
              </CardTitle>
              <CardDescription>
                Earn money by helping students with their assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact (Phone) *</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="Your phone number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <Label className="mb-3 block">Subjects You Can Solve *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject}
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <Label
                          htmlFor={subject}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class Levels */}
                <div>
                  <Label className="mb-3 block">Class Levels *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {classLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={level}
                          checked={selectedClassLevels.includes(level)}
                          onCheckedChange={() => handleClassLevelToggle(level)}
                        />
                        <Label
                          htmlFor={level}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">What You'll Get</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      'Earn ₹9 per assignment',
                      'Flexible working hours',
                      'Work from anywhere',
                      'Verified by Dynamic Edu',
                      'Regular payment cycle'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>

                <p className="text-xs text-center text-gray-600">
                  Already registered?{' '}
                  <a href="/ellio-notes/assignment-help/solver" className="text-blue-600 hover:underline">
                    Access Dashboard
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default SolverRegistration;