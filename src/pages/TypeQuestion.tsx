import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileEdit, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const TypeQuestion = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentContact: '',
    classLevel: '',
    subject: '',
    assignmentText: ''
  });

  const classLevels = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'B.Tech', 'Other'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'Accounts'];

  const baseFee = 15;
  const urgentFee = urgency === 'urgent' ? 5 : 0;
  const totalFee = baseFee + urgentFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentContact || !formData.classLevel || !formData.subject || !formData.assignmentText) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          student_name: formData.studentName,
          student_contact: formData.studentContact,
          class_level: formData.classLevel,
          subject: formData.subject,
          assignment_type: 'text',
          assignment_text: formData.assignmentText,
          assignment_files: [],
          urgency,
          base_fee: baseFee,
          urgent_fee: urgentFee,
          total_fee: totalFee,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create transaction record
      await supabase.from('assignment_transactions').insert({
        assignment_id: data.id,
        student_name: formData.studentName,
        total_amount: totalFee,
        dynamic_edu_amount: 6,
        solver_amount: 9,
        status: 'pending'
      });

      toast.success('Question submitted successfully!', {
        description: 'You will be notified once a solver is assigned.'
      });
      
      navigate('/ellio-notes/assignment-help/my-requests');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <FileEdit className="w-8 h-8 text-purple-600" />
                Type Your Question
              </CardTitle>
              <CardDescription>
                Quickly type your question and get expert help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="studentName">Your Name *</Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="studentContact">Contact (Phone/Email) *</Label>
                    <Input
                      id="studentContact"
                      value={formData.studentContact}
                      onChange={(e) => setFormData({ ...formData, studentContact: e.target.value })}
                      placeholder="Phone number or email"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="classLevel">Class/Level *</Label>
                      <Select value={formData.classLevel} onValueChange={(value) => setFormData({ ...formData, classLevel: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <Label htmlFor="assignmentText">Your Question *</Label>
                  <Textarea
                    id="assignmentText"
                    value={formData.assignmentText}
                    onChange={(e) => setFormData({ ...formData, assignmentText: e.target.value })}
                    placeholder="Type your question or problem here... Be as detailed as possible."
                    rows={10}
                    required
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Include all relevant details to get the best solution
                  </p>
                </div>

                {/* Urgency */}
                <div>
                  <Label className="mb-3 block">Urgency *</Label>
                  <RadioGroup value={urgency} onValueChange={(value: any) => setUrgency(value)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-purple-50 transition-colors">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal" className="cursor-pointer flex-1">
                        <span className="font-medium">Normal (2-3 days)</span>
                        <span className="ml-2 text-purple-600">₹15</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-orange-50 transition-colors">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent" className="cursor-pointer flex-1">
                        <span className="font-medium">Urgent (24 hours)</span>
                        <span className="ml-2 text-orange-600">₹20</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Price Summary */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Price Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Fee:</span>
                      <span>₹{baseFee}</span>
                    </div>
                    {urgency === 'urgent' && (
                      <div className="flex justify-between text-sm text-orange-600">
                        <span>Urgent Fee:</span>
                        <span>₹{urgentFee}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-purple-600">₹{totalFee}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Question'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TypeQuestion;