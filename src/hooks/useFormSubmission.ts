import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';
import { useAuth } from '@/contexts/AuthContext';
import { useCoinBalance } from '@/hooks/useCoinBalance';

interface UseFormSubmissionProps {
  canProceed: () => boolean | string;
  formData: any;
  uploadedFiles: Array<{ name: string; url: string; size: number; type: string }>;
  selectedServices: any[];
  totalAmount: number;
  deliveryRequested: boolean;
  canAccessDelivery: boolean;
  onOrderSubmitted: (trackingId: string) => void;
  resetForm: () => void;
}

export const useFormSubmission = ({
  canProceed,
  formData,
  uploadedFiles,
  selectedServices,
  totalAmount,
  deliveryRequested,
  canAccessDelivery,
  onOrderSubmitted,
  resetForm
}: UseFormSubmissionProps) => {
  const { submitPrintJob, isSubmitting: isPrintSubmitting } = usePrintJobSubmission();
  const { toast } = useToast();
  const { user } = useAuth();
  const { coinBalance, deductCoins, hasEnoughCoins } = useCoinBalance();
  const [isProcessing, setIsProcessing] = useState(false);

  const coinCost = Math.ceil(totalAmount);

  const validateForm = (): { valid: boolean; message?: string } => {
    const currentValidationResult = canProceed();
    const isValid = currentValidationResult === true;
    
    if (!isValid) {
      return {
        valid: false,
        message: typeof currentValidationResult === 'string' 
          ? currentValidationResult 
          : "Please fill in all required fields before submitting."
      };
    }

    if (uploadedFiles.length === 0) {
      return { valid: false, message: "Please upload at least one file before submitting." };
    }

    if (user && !hasEnoughCoins(coinCost)) {
      return { valid: false, message: "Insufficient coin balance. Please recharge your wallet." };
    }

    return { valid: true };
  };

  const submitOrder = async (): Promise<string | null> => {
    try {
      const trackingId = await submitPrintJob(
        formData,
        uploadedFiles,
        selectedServices,
        totalAmount,
        deliveryRequested,
        canAccessDelivery
      );
      return trackingId;
    } catch (error) {
      console.error('Error submitting print job:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    
    if (!validation.valid) {
      toast({
        title: "Form Incomplete",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      toast({
        title: "Submitting Order",
        description: "Please wait while we process your print job...",
      });

      const trackingId = await submitOrder();
      
      if (trackingId) {
        // Deduct coins if user is logged in
        if (user && coinCost > 0) {
          const serviceNames = selectedServices.map(s => s.name || s.serviceName).join(', ');
          await deductCoins(
            coinCost,
            `Print Order - ${serviceNames}`,
            'print_job',
            trackingId
          );
        }

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
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting: isPrintSubmitting || isProcessing,
    coinCost,
    coinBalance,
    hasEnoughBalance: hasEnoughCoins(coinCost)
  };
};
