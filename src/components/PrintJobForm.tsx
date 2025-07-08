
import React from 'react';
import { useServices } from '@/hooks/useServices';
import { usePrintJobForm } from '@/hooks/usePrintJobForm';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useIsMobile } from '@/hooks/use-mobile';
import { createServiceHandlers } from '@/utils/serviceHandlers';
import { FormContainer } from './form-steps/FormContainer';

interface PrintJobFormProps {
  onOrderSubmitted: (trackingId: string) => void;
}

const PrintJobForm = ({ onOrderSubmitted }: PrintJobFormProps) => {
  const isMobile = useIsMobile();
  const {
    currentStep,
    files,
    uploadedFiles,
    selectedServices,
    totalAmount,
    canAccessDelivery,
    deliveryRequested,
    formData,
    setFiles,
    setUploadedFiles,
    setSelectedServices,
    setFormData,
    handleNext,
    handlePrevious,
    canProceed,
    resetForm,
    handleDeliveryRequestedChange
  } = usePrintJobForm();

  const { services, isLoading: servicesLoading } = useServices();
  const serviceHandlers = createServiceHandlers(setSelectedServices);

  // Convert deliveryRequested to boolean to fix TypeScript error
  const deliveryRequestedBoolean = typeof deliveryRequested === 'string' ? deliveryRequested === 'true' : Boolean(deliveryRequested);

  // Get validation result
  const validationResult = canProceed();
  const canProceedBoolean = validationResult === true;
  const validationMessage = typeof validationResult === 'string' ? validationResult : null;

  const { handleSubmit, isSubmitting } = useFormSubmission({
    canProceed,
    formData,
    files,
    uploadedFiles,
    selectedServices,
    totalAmount,
    deliveryRequested: deliveryRequestedBoolean,
    canAccessDelivery,
    onOrderSubmitted,
    resetForm
  });

  console.log('PrintJobForm - services:', services);
  console.log('PrintJobForm - servicesLoading:', servicesLoading);
  console.log('PrintJobForm - currentStep:', currentStep);
  console.log('PrintJobForm - files count:', files.length);
  console.log('PrintJobForm - uploaded files count:', uploadedFiles.length);
  console.log('PrintJobForm - selected services count:', selectedServices.length);
  console.log('PrintJobForm - validation result:', validationResult);
  console.log('PrintJobForm - can proceed:', canProceedBoolean);

  return (
    <section className={`${isMobile ? 'py-6 px-0' : 'py-16 px-4'} bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-screen`}>
      <FormContainer
        currentStep={currentStep}
        files={files}
        selectedServices={selectedServices}
        totalAmount={totalAmount}
        canAccessDelivery={canAccessDelivery}
        deliveryRequested={deliveryRequestedBoolean}
        formData={formData}
        services={services}
        servicesLoading={servicesLoading}
        validationMessage={validationMessage}
        canProceedBoolean={canProceedBoolean}
        isSubmitting={isSubmitting}
        onFilesChange={setFiles}
        onAddService={serviceHandlers.handleServiceAdd}
        onUpdateQuantity={serviceHandlers.handleServiceUpdate}
        onRemoveService={serviceHandlers.handleServiceRemove}
        onFormDataChange={setFormData}
        onDeliveryRequestedChange={handleDeliveryRequestedChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default PrintJobForm;
