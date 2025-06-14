
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User, Clock, Settings, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { SelectedService } from '@/types/service';
import StepProgress from './form-steps/StepProgress';
import StepContent from './form-steps/StepContent';
import NavigationButtons from './form-steps/NavigationButtons';

interface PrintJobFormProps {
  onOrderSubmitted: (trackingId: string) => void;
}

const PrintJobForm = ({ onOrderSubmitted }: PrintJobFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [canAccessDelivery, setCanAccessDelivery] = useState(false);
  const [deliveryRequested, setDeliveryRequested] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    institute: '',
    timeSlot: '',
    notes: ''
  });

  const { submitPrintJob, isSubmitting } = usePrintJobSubmission();
  const { services, isLoading: servicesLoading } = useServices();
  const { toast } = useToast();

  console.log('PrintJobForm - services:', services);
  console.log('PrintJobForm - servicesLoading:', servicesLoading);

  const steps = [
    { 
      id: 'upload', 
      title: 'Upload Files', 
      icon: FileText, 
      description: 'Upload your documents',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'services', 
      title: 'Select Services', 
      icon: Settings, 
      description: 'Choose printing options',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'info', 
      title: 'Your Details', 
      icon: User, 
      description: 'Contact information',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'schedule', 
      title: 'Schedule', 
      icon: Clock, 
      description: 'Pick up time',
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'review', 
      title: 'Review & Submit', 
      icon: CheckCircle, 
      description: 'Confirm your order',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return files.length > 0;
      case 1: return selectedServices.length > 0;
      case 2: return formData.name.trim() && formData.phone.trim();
      case 3: return formData.timeSlot.trim();
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Submitting form with data:', {
        formData,
        files: files.length,
        selectedServices: selectedServices.length,
        totalAmount,
        deliveryRequested
      });

      const trackingId = await submitPrintJob(
        formData,
        files,
        selectedServices,
        totalAmount,
        deliveryRequested,
        canAccessDelivery
      );
      
      if (trackingId) {
        onOrderSubmitted(trackingId);
        
        // Reset form with explicit boolean type
        setCurrentStep(0);
        setFiles([]);
        setSelectedServices([]);
        setFormData({
          name: '',
          phone: '',
          institute: '',
          timeSlot: '',
          notes: ''
        });
        setDeliveryRequested(false); // Explicitly set to boolean false
        setTotalAmount(0);
      }
    } catch (error) {
      console.error('Error submitting print job:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your print job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleServiceAdd = (service: any, quantity = 1) => {
    console.log('Adding service:', service, 'quantity:', quantity);
    const basePrice = parseFloat(service.price.replace(/[₹\/\w\s]/g, '')) || 0;
    const newService: SelectedService = { 
      ...service, 
      quantity, 
      calculatedPrice: basePrice * quantity 
    };
    setSelectedServices(prev => [...prev, newService]);
  };

  const handleServiceUpdate = (serviceId: string, quantity: number) => {
    console.log('Updating service:', serviceId, 'quantity:', quantity);
    setSelectedServices(services => 
      services.map(s => {
        if (s.id === serviceId) {
          const basePrice = parseFloat(s.price.replace(/[₹\/\w\s]/g, '')) || 0;
          return { ...s, quantity, calculatedPrice: basePrice * quantity };
        }
        return s;
      })
    );
  };

  const handleServiceRemove = (serviceId: string) => {
    console.log('Removing service:', serviceId);
    setSelectedServices(services => services.filter(s => s.id !== serviceId));
  };

  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => sum + service.calculatedPrice, 0);
    setTotalAmount(total);
    setCanAccessDelivery(total >= 200);
    console.log('Total amount updated:', total);
  }, [selectedServices]);

  const stepVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.95 }
  };

  // Ensure deliveryRequested is always boolean when passed to StepContent
  const handleDeliveryRequestedChange = (requested: boolean) => {
    setDeliveryRequested(requested);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Submit Your Print Job
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional printing made simple. Upload, customize, and get your documents printed with premium quality.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <StepProgress steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}
                transition={{ duration: 0.3 }}
              >
                <StepContent
                  currentStep={currentStep}
                  files={files}
                  onFilesChange={setFiles}
                  services={services}
                  selectedServices={selectedServices}
                  onAddService={handleServiceAdd}
                  onUpdateQuantity={handleServiceUpdate}
                  onRemoveService={handleServiceRemove}
                  totalAmount={totalAmount}
                  canAccessDelivery={canAccessDelivery}
                  formData={formData}
                  onFormDataChange={setFormData}
                  deliveryRequested={deliveryRequested}
                  onDeliveryRequestedChange={handleDeliveryRequestedChange}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          canProceed={canProceed()}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default PrintJobForm;
