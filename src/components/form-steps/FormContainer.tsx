
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileContainer } from '@/components/mobile/MobileContainer';
import { FormHeader } from './FormHeader';
import StepProgress from './StepProgress';
import { FormContent } from './FormContent';
import NavigationButtons from './NavigationButtons';
import { MobileStepNotification } from './MobileStepNotification';
import { steps } from './stepDefinitions';
import { Service, SelectedService } from '@/types/service';

interface FormData {
  name: string;
  phone: string;
  institute: string;
  timeSlot: string;
  notes: string;
}

interface FormContainerProps {
  currentStep: number;
  uploadedFiles: Array<{ name: string; url: string; size: number; type: string }>;
  selectedServices: SelectedService[];
  totalAmount: number;
  canAccessDelivery: boolean;
  deliveryRequested: boolean;
  formData: FormData;
  services: Service[];
  servicesLoading: boolean;
  validationMessage: string | null;
  canProceedBoolean: boolean;
  isSubmitting: boolean;
  onUploadedFilesChange: (files: Array<{ name: string; url: string; size: number; type: string }>) => void;
  onAddService: (service: any, quantity?: number) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onRemoveService: (serviceId: string) => void;
  onFormDataChange: (data: any) => void;
  onDeliveryRequestedChange: (requested: boolean | string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const FormContainer = ({
  currentStep,
  uploadedFiles,
  selectedServices,
  totalAmount,
  canAccessDelivery,
  deliveryRequested,
  formData,
  services,
  servicesLoading,
  validationMessage,
  canProceedBoolean,
  isSubmitting,
  onUploadedFilesChange,
  onAddService,
  onUpdateQuantity,
  onRemoveService,
  onFormDataChange,
  onDeliveryRequestedChange,
  onPrevious,
  onNext,
  onSubmit
}: FormContainerProps) => {
  const isMobile = useIsMobile();

  return (
    <MobileContainer className={isMobile ? 'px-3 max-w-full' : ''}>
      <div className={isMobile ? 'p-4' : 'p-8'}>
        <FormHeader />

        <div className={isMobile ? 'px-0 my-4' : 'my-6'}>
          <StepProgress steps={steps} currentStep={currentStep} />
        </div>

        {servicesLoading && (
          <div className={isMobile ? 'mb-4' : 'mb-6'}>
            <MobileStepNotification 
              message="Loading available services..." 
              type="info" 
            />
          </div>
        )}

        {validationMessage && !canProceedBoolean && (
          <div className={isMobile ? 'mb-4' : 'mb-6'}>
            <MobileStepNotification 
              message={validationMessage} 
              type="warning" 
            />
          </div>
        )}

        <div className={isMobile ? 'my-4' : 'my-8'}>
          <FormContent
            currentStep={currentStep}
            uploadedFiles={uploadedFiles}
            onUploadedFilesChange={onUploadedFilesChange}
            services={services}
            selectedServices={selectedServices}
            onAddService={onAddService}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveService={onRemoveService}
            totalAmount={totalAmount}
            canAccessDelivery={canAccessDelivery}
            formData={formData}
            onFormDataChange={onFormDataChange}
            deliveryRequested={deliveryRequested}
            onDeliveryRequestedChange={onDeliveryRequestedChange}
          />
        </div>

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

        <div className={isMobile ? 'mt-4 sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border' : 'mt-8'}>
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={steps.length}
            canProceed={canProceedBoolean}
            isSubmitting={isSubmitting}
            onPrevious={onPrevious}
            onNext={onNext}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </MobileContainer>
  );
};
