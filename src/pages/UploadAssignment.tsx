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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, FileText, CalendarIcon, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const UploadAssignment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignmentType, setAssignmentType] = useState<'file_upload' | 'text'>('file_upload');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deadline, setDeadline] = useState<Date>();
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const uploadFiles = async () => {
    const uploadedFiles = [];
    
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error } = await supabase.storage
        .from('assignment-files')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('assignment-files')
        .getPublicUrl(filePath);

      uploadedFiles.push({
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type
      });
    }
    
    return uploadedFiles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentContact || !formData.classLevel || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (assignmentType === 'file_upload' && selectedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    if (assignmentType === 'text' && !formData.assignmentText) {
      toast.error('Please enter your question');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFiles = [];
      if (assignmentType === 'file_upload') {
        uploadedFiles = await uploadFiles();
      }

      const { data, error } = await supabase
        .from('assignments')
        .insert({
          student_name: formData.studentName,
          student_contact: formData.studentContact,
          class_level: formData.classLevel,
          subject: formData.subject,
          assignment_type: assignmentType,
          assignment_text: assignmentType === 'text' ? formData.assignmentText : null,
          assignment_files: assignmentType === 'file_upload' ? uploadedFiles : [],
          urgency,
          deadline: deadline ? deadline.toISOString() : null,
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

      toast.success('Assignment submitted successfully!', {
        description: 'You will be notified once a solver is assigned.'
      });
      
      navigate('/ellio-notes/assignment-help/my-requests');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Upload className="w-8 h-8 text-blue-600" />
                Submit Assignment
              </CardTitle>
              <CardDescription>
                Fill in the details below to get help with your assignment
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

                {/* Assignment Type */}
                <div>
                  <Label className="mb-3 block">Assignment Type *</Label>
                  <RadioGroup value={assignmentType} onValueChange={(value: any) => setAssignmentType(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file_upload" id="file_upload" />
                      <Label htmlFor="file_upload" className="cursor-pointer">Upload Files</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text" className="cursor-pointer">Type Question</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Conditional Content */}
                {assignmentType === 'file_upload' ? (
                  <div>
                    <Label htmlFor="files">Upload Assignment Files *</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        id="files"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="files" className="cursor-pointer">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {selectedFiles.length > 0 
                            ? `${selectedFiles.length} file(s) selected`
                            : 'Click to browse or drag files here'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, Word, Images - Max 20MB</p>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="assignmentText">Type Your Question *</Label>
                    <Textarea
                      id="assignmentText"
                      value={formData.assignmentText}
                      onChange={(e) => setFormData({ ...formData, assignmentText: e.target.value })}
                      placeholder="Enter your assignment question or problem..."
                      rows={6}
                      required={assignmentType === 'text'}
                    />
                  </div>
                )}

                {/* Urgency */}
                <div>
                  <Label className="mb-3 block">Urgency *</Label>
                  <RadioGroup value={urgency} onValueChange={(value: any) => setUrgency(value)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal" className="cursor-pointer flex-1">
                        <span className="font-medium">Normal (2-3 days)</span>
                        <span className="ml-2 text-blue-600">₹15</span>
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

                {/* Deadline */}
                <div>
                  <Label>Deadline (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, 'PPP') : 'Pick a deadline'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Price Summary */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
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
                      <span className="text-blue-600">₹{totalFee}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
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

export default UploadAssignment;