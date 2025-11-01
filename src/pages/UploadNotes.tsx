import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Check } from 'lucide-react';
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

const UploadNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    uploaderName: '',
    uploaderContact: '',
    classLevel: '',
    subject: '',
    title: '',
    description: ''
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
          variant: 'destructive'
        });
        return;
      }

      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload PDF, DOCX, JPG, or PNG files only',
          variant: 'destructive'
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${formData.classLevel}/${formData.subject}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('student-notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student-notes')
        .getPublicUrl(filePath);

      // Insert note record
      const { error: insertError } = await supabase
        .from('notes')
        .insert({
          title: formData.title,
          subject: formData.subject,
          class_level: formData.classLevel,
          description: formData.description,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploader_name: formData.uploaderName,
          uploader_contact: formData.uploaderContact,
          is_approved: false,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setIsSuccess(true);
      toast({
        title: 'Success! 🎉',
        description: 'Your notes have been submitted for review'
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your notes. Please try again.',
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
                <h2 className="text-3xl font-bold mb-4">Thank you for contributing! 🎉</h2>
                <p className="text-muted-foreground mb-8">
                  Your notes will be reviewed and published shortly. We appreciate you helping fellow students!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => { setIsSuccess(false); setFormData({ uploaderName: '', uploaderContact: '', classLevel: '', subject: '', title: '', description: '' }); setFile(null); }}>
                    Upload Another
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/ellio-notes/browse')}>
                    Browse Notes
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
              <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full mb-4">
                <Upload className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Upload Notes</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Share Your Knowledge</h1>
              <p className="text-muted-foreground">
                Help fellow students by uploading your notes. All uploads are reviewed before publishing.
              </p>
            </div>

            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="uploaderName">Your Name *</Label>
                  <Input
                    id="uploaderName"
                    required
                    value={formData.uploaderName}
                    onChange={(e) => setFormData({ ...formData, uploaderName: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <Label htmlFor="uploaderContact">Contact (Optional)</Label>
                  <Input
                    id="uploaderContact"
                    value={formData.uploaderContact}
                    onChange={(e) => setFormData({ ...formData, uploaderContact: e.target.value })}
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
                  <Label htmlFor="title">Topic/Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Quadratic Equations - Complete Notes"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what's covered (max 200 characters)"
                    maxLength={200}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/200 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="file">Upload File *</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      {file ? (
                        <div className="text-center">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOCX, JPG, PNG (Max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Uploading...' : 'Submit Notes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/ellio-notes')}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UploadNotes;
