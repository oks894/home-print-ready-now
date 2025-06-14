
import { useState, useEffect } from 'react';
import { SelectedService } from '@/types/service';

interface FormData {
  name: string;
  phone: string;
  institute: string;
  timeSlot: string;
  notes: string;
}

export const usePrintJobForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [canAccessDelivery, setCanAccessDelivery] = useState(false);
  const [deliveryRequested, setDeliveryRequested] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    institute: '',
    timeSlot: '',
    notes: ''
  });

  const handleNext = () => {
    if (currentStep < 4) {
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

  const resetForm = () => {
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
    setDeliveryRequested(false);
    setTotalAmount(0);
  };

  const handleDeliveryRequestedChange = (requested: boolean) => {
    setDeliveryRequested(requested);
  };

  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => sum + service.calculatedPrice, 0);
    setTotalAmount(total);
    setCanAccessDelivery(total >= 200);
    console.log('Total amount updated:', total);
  }, [selectedServices]);

  return {
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
  };
};
