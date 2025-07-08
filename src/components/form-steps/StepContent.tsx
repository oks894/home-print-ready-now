import React from 'react';
import { motion } from 'framer-motion';
import { Service, SelectedService } from '@/types/service';
import UploadStep from './steps/UploadStep';
import ServicesStep from './steps/ServicesStep';
import CustomerInfoStep from './steps/CustomerInfoStep';
import ScheduleStep from './steps/ScheduleStep';
import ReviewStep from './steps/ReviewStep';

interface StepContentProps {
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
  formData: {
    name: string;
    phone: string;
    institute: string;
    timeSlot: string;
    notes: string;
  };
  onFormDataChange: (data: any) => void;
  deliveryRequested: boolean;
  onDeliveryRequestedChange: (requested: boolean | string) => void;
}

const StepContent = ({
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
}: StepContentProps) => {
  const stepVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.95 }
  };

  // Convert File[] to uploaded files format for UploadStep
  const uploadedFiles = files.map(file => ({
    name: file.name,
    url: URL.createObjectURL(file), // Create object URL for preview
    size: file.size,
    type: file.type
  }));

  const handleFilesUploaded = (uploadedFileList: Array<{ name: string; url: string; size: number; type: string }>) => {
    // Convert uploaded files back to File objects - this is a simplified approach
    // In a real scenario, you'd handle this differently, but for now we'll update the files state
    onFilesChange(files); // Keep existing files for now
  };

  switch (currentStep) {
    case 0:
      return (
        <motion.div variants={stepVariants}>
          <UploadStep 
            uploadedFiles={uploadedFiles}
            onFilesUploaded={handleFilesUploaded}
          />
        </motion.div>
      );

    case 1:
      return (
        <motion.div variants={stepVariants}>
          <ServicesStep
            services={services}
            selectedServices={selectedServices}
            onAddService={onAddService}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveService={onRemoveService}
            totalAmount={totalAmount}
            canAccessDelivery={canAccessDelivery}
          />
        </motion.div>
      );

    case 2:
      return (
        <motion.div variants={stepVariants}>
          <CustomerInfoStep
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        </motion.div>
      );

    case 3:
      return (
        <motion.div variants={stepVariants}>
          <ScheduleStep
            formData={formData}
            onFormDataChange={onFormDataChange}
            canAccessDelivery={canAccessDelivery}
            deliveryRequested={deliveryRequested}
            onDeliveryRequestedChange={onDeliveryRequestedChange}
          />
        </motion.div>
      );

    case 4:
      return (
        <motion.div variants={stepVariants}>
          <ReviewStep
            files={files}
            selectedServices={selectedServices}
            totalAmount={totalAmount}
            formData={formData}
            deliveryRequested={deliveryRequested}
          />
        </motion.div>
      );

    default:
      return null;
  }
};

export default StepContent;
