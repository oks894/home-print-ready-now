
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { usePrintJobForm } from '@/hooks/usePrintJobForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { createServiceHandlers } from '@/utils/serviceHandlers';
import { steps } from './form-steps/stepDefinitions';
import { MobileContainer } from '@/components/mobile/MobileContainer';
import StepProgress from './form-steps/StepProgress';
import StepContent from './form-steps/StepContent';
import NavigationButtons from './form-steps/NavigationButtons';

interface PrintJobFormProps {
  onOrderSubmitted: (trackingId: string) => void;
}

const PrintJobForm = ({ onOrderSubmitted }: PrintJobFormProps) => {
  const isMobile = useIsMobile();
  const {
    currentStep,
    files,
    selectedServices,
    totalAmount,
    canAccessDelivery,
    deliveryRequested,
    formData,
    setFiles,
    setSelectedServices,
    setFormData,
    handleNext,
    handlePrevious,
    canProceed,
    resetForm,
    handleDeliveryRequestedChange
  } = usePrintJobForm();

  const { submitPrintJob, isSubmitting } = usePrintJobSubmission();
  const { services, isLoading: servicesLoading } = useServices();
  const { toast } = useToast();

  const serviceHandlers = createServiceHandlers(setSelectedServices);

  console.log('PrintJobForm - services:', services);
  console.log('PrintJobForm - servicesLoading:', servicesLoading);

  // Convert deliveryRequested to boolean to fix TypeScript error
  const deliveryRequestedBoolean = typeof deliveryRequested === 'string' ? deliveryRequested === 'true' : Boolean(deliveryRequested);

  // Fix: Get validation result and convert to boolean
  const validationResult = canProceed();
  const canProceedBoolean = validationResult === true;
  const validationMessage = typeof validationResult === 'string' ? validationResult : null;

  const handleSubmit = async () => {
    const currentValidationResult = canProceed();
    const isValid = currentValidationResult === true;
    
    if (!isValid) {
      const message = typeof currentValidationResult === 'string' 
        ? currentValidationResult 
        : "Please fill in all required fields before submitting.";
        
      toast({
        title: "Form Incomplete",
        description: message,
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
        deliveryRequested: deliveryRequestedBoolean
      });

      // Show loading notification
      toast({
        title: "Submitting Order",
        description: "Please wait while we process your print job...",
      });

      const trackingId = await submitPrintJob(
        formData,
        files,
        selectedServices,
        totalAmount,
        deliveryRequestedBoolean,
        canAccessDelivery
      );
      
      if (trackingId) {
        // Success notification
        toast({
          title: "Order Submitted Successfully!",
          description: `Your print job has been submitted. Tracking ID: ${trackingId}`,
          variant: "default",
        });
        
        onOrderSubmitted(trackingId);
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting print job:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit your print job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: isMobile ? 50 : 100, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: isMobile ? -50 : -100, scale: 0.95 }
  };

  // Mobile-optimized notification component
  const StepNotification = ({ message, type = 'info' }: { message: string; type?: 'info' | 'warning' | 'success' }) => {
    const icons = {
      info: <Info className="h-4 w-4 flex-shrink-0" />,
      warning: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
      success: <CheckCircle className="h-4 w-4 flex-shrink-0" />
    };

    const variants = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`mb-4 ${isMobile ? 'mx-2' : 'mb-6'}`}
      >
        <Alert className={`${variants[type]} border ${isMobile ? 'text-sm' : ''}`}>
          <div className="flex items-start gap-2">
            {icons[type]}
            <AlertDescription className="flex-1 leading-relaxed">
              {message}
            </AlertDescription>
          </div>
        </Alert>
      </motion.div>
    );
  };

  return (
    <section className={`${isMobile ? 'py-6 px-0' : 'py-16 px-4'} bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50`}>
      <MobileContainer className={isMobile ? 'px-0' : ''}>
        {/* Mobile-optimized Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center ${isMobile ? 'mb-6 px-4' : 'mb-12'}`}
        >
          <h2 className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 ${
            isMobile ? 'text-2xl leading-tight' : 'text-4xl md:text-5xl'
          }`}>
            Submit Your Print Job
          </h2>
          <p className={`text-gray-600 max-w-3xl mx-auto ${
            isMobile ? 'text-base leading-relaxed' : 'text-xl'
          }`}>
            Professional printing made simple. Upload, customize, and get your documents printed with premium quality.
          </p>
        </motion.div>

        {/* Mobile-optimized Progress Indicator */}
        <div className={isMobile ? 'px-2' : ''}>
          <StepProgress steps={steps} currentStep={currentStep} />
        </div>

        {/* Loading State Notification */}
        {servicesLoading && (
          <StepNotification 
            message="Loading available services..." 
            type="info" 
          />
        )}

        {/* Validation Message */}
        {validationMessage && !canProceedBoolean && (
          <StepNotification 
            message={validationMessage} 
            type="warning" 
          />
        )}

        {/* Mobile-optimized Step Content */}
        <Card className={`border-0 shadow-2xl bg-white/80 backdrop-blur-sm ${
          isMobile ? 'mx-2 rounded-xl' : ''
        }`}>
          <CardContent className={isMobile ? 'p-4 sm:p-6' : 'p-8 md:p-12'}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}
                transition={{ duration: isMobile ? 0.2 : 0.3 }}
              >
                <StepContent
                  currentStep={currentStep}
                  files={files}
                  onFilesChange={setFiles}
                  services={services}
                  selectedServices={selectedServices}
                  onAddService={serviceHandlers.handleServiceAdd}
                  onUpdateQuantity={serviceHandlers.handleServiceUpdate}
                  onRemoveService={serviceHandlers.handleServiceRemove}
                  totalAmount={totalAmount}
                  canAccessDelivery={canAccessDelivery}
                  formData={formData}
                  onFormDataChange={setFormData}
                  deliveryRequested={deliveryRequestedBoolean}
                  onDeliveryRequestedChange={handleDeliveryRequestedChange}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Success Message for Completed Steps */}
        {canProceedBoolean && currentStep === steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={isMobile ? 'mt-4' : 'mt-6'}
          >
            <StepNotification 
              message="All information completed! Ready to submit your print job." 
              type="success" 
            />
          </motion.div>
        )}

        {/* Mobile-optimized Navigation */}
        <div className={isMobile ? 'px-2' : ''}>
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={steps.length}
            canProceed={canProceedBoolean}
            isSubmitting={isSubmitting}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </div>
      </MobileContainer>
    </section>
  );
};

export default PrintJobForm;
