
import { useState } from 'react';
import { Printer, FileText, Clock, CheckCircle, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomerForm from '@/components/CustomerForm';
import FileUpload from '@/components/FileUpload';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import TrackingPopup from '@/components/TrackingPopup';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import Feedback from '@/components/Feedback';
import PaymentQR from '@/components/PaymentQR';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    institute: '',
    timeSlot: '',
    notes: ''
  });
  const [showTrackingPopup, setShowTrackingPopup] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const generateTrackingId = () => {
    return 'PJ' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const convertFilesToBase64 = async (files: File[]): Promise<Array<{ name: string; size: number; type: string; data: string }>> => {
    const filePromises = files.map(file => {
      return new Promise<{ name: string; size: number; type: string; data: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    });
    
    return Promise.all(filePromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.timeSlot || files.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload at least one file",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newTrackingId = generateTrackingId();
      const filesWithData = await convertFilesToBase64(files);

      const { error } = await supabase
        .from('print_jobs')
        .insert({
          tracking_id: newTrackingId,
          name: formData.name,
          phone: formData.phone,
          institute: formData.institute || null,
          time_slot: formData.timeSlot,
          notes: formData.notes || null,
          files: filesWithData,
          status: 'pending'
        });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your print job. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setTrackingId(newTrackingId);
      setShowTrackingPopup(true);

      toast({
        title: "Order Submitted!",
        description: `Your tracking ID is ${newTrackingId}`,
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your print job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      institute: '',
      timeSlot: '',
      notes: ''
    });
    setFiles([]);
    setShowTrackingPopup(false);
    setTrackingId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Printer className="w-4 h-4" />
            Professional Print Services
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Fast, Reliable <span className="text-blue-600">Print Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your documents, choose your pickup time, and get professional printing done quickly and efficiently.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Upload Files</h3>
              <p className="text-sm text-gray-600">PDF, Word, Images (Max 20MB)</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Choose Time</h3>
              <p className="text-sm text-gray-600">Flexible pickup slots</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Get Printed</h3>
              <p className="text-sm text-gray-600">High-quality results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Print Job Form */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Submit Your Print Job
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below to get started with your printing needs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <CustomerForm 
                formData={formData} 
                onFormDataChange={setFormData}
              />
              <FileUpload 
                files={files} 
                onFilesChange={setFiles}
              />
            </div>
            
            <TimeSlotSelector
              timeSlot={formData.timeSlot}
              notes={formData.notes}
              onTimeSlotChange={(timeSlot) => setFormData(prev => ({ ...prev, timeSlot }))}
              onNotesChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
            />

            <div className="text-center">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold min-w-48"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Printer className="w-5 h-5 mr-2" />
                    Submit Print Job
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Services />
      <PaymentQR />
      <Stats />
      <Feedback />
      <Footer />

      {showTrackingPopup && (
        <TrackingPopup
          trackingId={trackingId}
          onClose={() => setShowTrackingPopup(false)}
          onNewOrder={resetForm}
        />
      )}
    </div>
  );
};

export default Index;
