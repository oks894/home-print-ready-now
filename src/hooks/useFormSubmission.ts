
import { useToast } from '@/hooks/use-toast';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';

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
  const { submitPrintJob, isSubmitting } = usePrintJobSubmission();
  const { toast } = useToast();

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

    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload at least one file before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Submitting form with data:', {
        formData,
        uploadedFiles: uploadedFiles.length,
        selectedServices: selectedServices.length,
        totalAmount,
        deliveryRequested
      });

      toast({
        title: "Submitting Order",
        description: "Please wait while we process your print job...",
      });

      const trackingId = await submitPrintJob(
        formData,
        uploadedFiles,
        selectedServices,
        totalAmount,
        deliveryRequested,
        canAccessDelivery
      );
      
      if (trackingId) {
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

  return {
    handleSubmit,
    isSubmitting
  };
};
