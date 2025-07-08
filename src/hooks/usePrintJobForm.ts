
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
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; size: number; type: string }>>([]);
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

  const canProceed = (): boolean | string => {
    console.log('Checking canProceed for step:', currentStep);
    console.log('Files:', files.length);
    console.log('Uploaded files:', uploadedFiles.length);
    console.log('Selected services:', selectedServices.length);
    console.log('Form data:', formData);
    
    switch (currentStep) {
      case 0: 
        if (files.length === 0 && uploadedFiles.length === 0) {
          return 'Please upload at least one file to continue';
        }
        return true;
      case 1: 
        if (selectedServices.length === 0) {
          return 'Please select at least one service to continue';
        }
        return true;
      case 2: 
        if (!formData.name.trim()) {
          return 'Please enter your name to continue';
        }
        if (!formData.phone.trim()) {
          return 'Please enter your phone number to continue';
        }
        return true;
      case 3: 
        if (!formData.timeSlot.trim()) {
          return 'Please select a time slot to continue';
        }
        return true;
      case 4: 
        return true;
      default: 
        return false;
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setFiles([]);
    setUploadedFiles([]);
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

  const handleDeliveryRequestedChange = (requested: boolean | string) => {
    // Always convert to boolean and store as boolean
    const booleanValue = typeof requested === 'string' ? requested === 'true' : Boolean(requested);
    setDeliveryRequested(booleanValue);
  };

  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => sum + service.calculatedPrice, 0);
    setTotalAmount(total);
    setCanAccessDelivery(total >= 200);
    console.log('Total amount updated:', total);
    console.log('Selected services updated:', selectedServices);
  }, [selectedServices]);

  return {
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
  };
};
