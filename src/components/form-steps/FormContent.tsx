
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Service, SelectedService } from '@/types/service';
import { useIsMobile } from '@/hooks/use-mobile';
import StepContent from './StepContent';

interface FormData {
  name: string;
  phone: string;
  institute: string;
  timeSlot: string;
  notes: string;
}

interface FormContentProps {
  currentStep: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  services: Service[];
  selectedServices: SelectedService[];
  onAddService: (service: any, quantity?: number) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onRemoveService: (serviceId: string) => void;
  totalAmount: number;
  canAccessDelivery: boolean;
  formData: FormData;
  onFormDataChange: (data: any) => void;
  deliveryRequested: boolean;
  onDeliveryRequestedChange: (requested: boolean | string) => void;
}

export const FormContent = ({
  currentStep,
  files,
  onFilesChange,
  services,
  selectedServices,
  onAddService,
  onUpdateQuantity,
  onRemoveService,
  totalAmount,
  canAccessDelivery,
  formData,
  onFormDataChange,
  deliveryRequested,
  onDeliveryRequestedChange
}: FormContentProps) => {
  const isMobile = useIsMobile();

  const stepVariants = {
    hidden: { opacity: 0, x: isMobile ? 50 : 100, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: isMobile ? -50 : -100, scale: 0.95 }
  };

  return (
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
              onFilesChange={onFilesChange}
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
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
