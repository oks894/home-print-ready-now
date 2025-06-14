
import { useState } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import CustomerForm from '@/components/CustomerForm';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import SuccessMessage from '@/components/SuccessMessage';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    institute: '',
    timeSlot: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one document to print",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.phone || !formData.timeSlot) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Store the print job data
    const printJob = {
      id: Date.now().toString(),
      ...formData,
      files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const existingJobs = JSON.parse(localStorage.getItem('printJobs') || '[]');
    localStorage.setItem('printJobs', JSON.stringify([...existingJobs, printJob]));

    setIsSubmitted(true);
    toast({
      title: "Print job submitted successfully!",
      description: "You will receive a confirmation call shortly.",
    });
  };

  const handleNewOrder = () => {
    setIsSubmitted(false);
    setFiles([]);
    setFormData({ name: '', phone: '', institute: '', timeSlot: '', notes: '' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <Header />
        <SuccessMessage onNewOrder={handleNewOrder} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Print from <span className="text-blue-600">Home</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your documents, schedule a pickup time, and get professional printing done while you stay comfortable at home.
          </p>
        </div>
      </section>

      {/* Main Form */}
      <section className="py-8 px-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <FileUpload files={files} onFilesChange={setFiles} />
            
            <CustomerForm 
              formData={formData} 
              onFormDataChange={setFormData} 
            />

            <TimeSlotSelector
              timeSlot={formData.timeSlot}
              notes={formData.notes}
              onTimeSlotChange={(timeSlot) => setFormData(prev => ({ ...prev, timeSlot }))}
              onNotesChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
            />

            {/* Submit Button */}
            <div className="text-center">
              <Button type="submit" size="lg" className="px-12 py-6 text-lg">
                <Printer className="w-5 h-5 mr-2" />
                Submit Print Job
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
