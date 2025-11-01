import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RequestNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    contact: '',
    classLevel: '',
    subject: '',
    topic: '',
    additionalDetails: ''
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['note-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('note_categories')
        .select('*')
        .order('display_order');
      return data || [];
    }
  });

  const selectedCategory = categories?.find(c => c.class_level === formData.classLevel);
  const subjects = selectedCategory?.subjects as string[] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('note_requests')
        .insert({
          student_name: formData.studentName,
          contact: formData.contact,
          class_level: formData.classLevel,
          subject: formData.subject,
          topic: formData.topic,
          additional_details: formData.additionalDetails,
          status: 'pending'
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: 'Request submitted! ✅',
        description: 'We\'ll notify our contributors about your request'
      });

    } catch (error) {
      console.error('Request error:', error);
      toast({
        title: 'Request failed',
        description: 'There was an error submitting your request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="p-12">
                <div className="w-20 h-20 rounded-full bg-green-500 mx-auto mb-6 flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Request Submitted! ✅</h2>
                <p className="text-muted-foreground mb-2">
                  We'll notify our contributors about your request.
                </p>
                <p className="text-muted-foreground mb-8">
                  Check back soon or browse available notes meanwhile.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/ellio-notes/browse')}>
                    Browse Notes
                  </Button>
                  <Button variant="outline" onClick={() => { setIsSuccess(false); setFormData({ studentName: '', contact: '', classLevel: '', subject: '', topic: '', additionalDetails: '' }); }}>
                    Submit Another Request
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full mb-4">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Request Notes</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Can't Find What You Need?</h1>
              <p className="text-muted-foreground">
                Submit a request and our community of contributors will help you out
              </p>
            </div>

            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="studentName">Your Name *</Label>
                  <Input
                    id="studentName"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <Label htmlFor="contact">Contact (Optional)</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Phone or email"
                  />
                </div>

                <div>
                  <Label htmlFor="classLevel">Class/Level *</Label>
                  <Select required value={formData.classLevel} onValueChange={(value) => setFormData({ ...formData, classLevel: value, subject: '' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class level" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.class_level}>
                          {cat.class_level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select required value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })} disabled={!formData.classLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="topic">Topic You Need *</Label>
                  <Input
                    id="topic"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Quadratic Equations, Organic Chemistry"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
                  <Textarea
                    id="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                    placeholder="Any specific requirements or details..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/ellio-notes')}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="p-6 mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                While waiting for your request to be fulfilled, check out the available notes in our library. You might find similar topics that can help you study!
              </p>
              <Button variant="link" className="mt-2 p-0" onClick={() => navigate('/ellio-notes/browse')}>
                Browse Available Notes →
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RequestNotes;
