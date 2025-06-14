

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { usePrintJobForm } from '@/hooks/usePrintJobForm';
import { createServiceHandlers } from '@/utils/serviceHandlers';
import { steps } from './form-steps/stepDefinitions';
import StepProgress from './form-steps/StepProgress';
import StepContent from './form-steps/StepContent';
import NavigationButtons from './form-steps/NavigationButtons';

interface PrintJobFormProps {
  onOrderSubmitted: (trackingId: string) => void;
}

const PrintJobForm = ({ onOrderSubmitted }: PrintJobFormProps) => {
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

  // Ensure deliveryRequested is always boolean
  const isDeliveryRequested = Boolean(deliveryRequested);

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
        deliveryRequested: isDeliveryRequested
      });

      const trackingId = await submitPrintJob(
        formData,
        files,
        selectedServices,
        totalAmount,
        isDeliveryRequested,
        canAccessDelivery
      );
      
      if (trackingId) {
        onOrderSubmitted(trackingId);
        resetForm();
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

  const stepVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.95 }
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
                  onAddService={serviceHandlers.handleServiceAdd}
                  onUpdateQuantity={serviceHandlers.handleServiceUpdate}
                  onRemoveService={serviceHandlers.handleServiceRemove}
                  totalAmount={totalAmount}
                  canAccessDelivery={canAccessDelivery}
                  formData={formData}
                  onFormDataChange={setFormData}
                  deliveryRequested={isDeliveryRequested}
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
