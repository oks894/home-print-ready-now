
import React from 'react';
import { motion } from 'framer-motion';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { usePrintJobForm } from '@/hooks/usePrintJobForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { createServiceHandlers } from '@/utils/serviceHandlers';
import { steps } from './form-steps/stepDefinitions';
import { MobileContainer } from '@/components/mobile/MobileContainer';
import { MobileStepNotification } from './form-steps/MobileStepNotification';
import { FormHeader } from './form-steps/FormHeader';
import { FormContent } from './form-steps/FormContent';
import StepProgress from './form-steps/StepProgress';
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
  console.log('PrintJobForm - currentStep:', currentStep);
  console.log('PrintJobForm - files count:', files.length);
  console.log('PrintJobForm - selected services count:', selectedServices.length);

  // Convert deliveryRequested to boolean to fix TypeScript error
  const deliveryRequestedBoolean = typeof deliveryRequested === 'string' ? deliveryRequested === 'true' : Boolean(deliveryRequested);

  // Get validation result
  const validationResult = canProceed();
  const canProceedBoolean = validationResult === true;
  const validationMessage = typeof validationResult === 'string' ? validationResult : null;

  console.log('PrintJobForm - validation result:', validationResult);
  console.log('PrintJobForm - can proceed:', canProceedBoolean);

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

  return (
    <section className={`${isMobile ? 'py-6 px-0' : 'py-16 px-4'} bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-screen`}>
      <MobileContainer className={isMobile ? 'px-3 max-w-full' : ''}>
        <div className={isMobile ? 'p-4' : 'p-8'}>
          <FormHeader />

          {/* Mobile-optimized Progress Indicator */}
          <div className={isMobile ? 'px-0 my-4' : 'my-6'}>
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          {/* Loading State Notification */}
          {servicesLoading && (
            <div className={isMobile ? 'mb-4' : 'mb-6'}>
              <MobileStepNotification 
                message="Loading available services..." 
                type="info" 
              />
            </div>
          )}

          {/* Validation Message */}
          {validationMessage && !canProceedBoolean && (
            <div className={isMobile ? 'mb-4' : 'mb-6'}>
              <MobileStepNotification 
                message={validationMessage} 
                type="warning" 
              />
            </div>
          )}

          {/* Mobile-optimized Step Content */}
          <div className={isMobile ? 'my-4' : 'my-8'}>
            <FormContent
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
          </div>

          {/* Success Message for Completed Steps */}
          {canProceedBoolean && currentStep === steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={isMobile ? 'mt-4 mb-4' : 'mt-8'}
            >
              <MobileStepNotification 
                message="All information completed! Ready to submit your print job." 
                type="success" 
              />
            </motion.div>
          )}

          {/* Mobile-optimized Navigation */}
          <div className={isMobile ? 'mt-4 sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border' : 'mt-8'}>
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
        </div>
      </MobileContainer>
    </section>
  );
};

export default PrintJobForm;
