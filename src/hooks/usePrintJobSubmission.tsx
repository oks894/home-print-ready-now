
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SelectedService } from '@/types/service';

interface FormData {
  name: string;
  phone: string;
  institute: string;
  timeSlot: string;
  notes: string;
}

export const usePrintJobSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const generateUniqueTrackingId = async (phone: string): Promise<string> => {
    const cleanPhone = phone.replace(/\D/g, '');
    const alphabetChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < 26; i++) {
      const randomChar = alphabetChars[Math.floor(Math.random() * alphabetChars.length)];
      const trackingId = `${cleanPhone}${randomChar}`;
      
      const { data: existingJob } = await supabase
        .from('print_jobs')
        .select('tracking_id')
        .eq('tracking_id', trackingId)
        .maybeSingle();
      
      if (!existingJob) {
        return trackingId;
      }
    }
    
    const timestamp = Date.now().toString().slice(-2);
    const randomChar = alphabetChars[Math.floor(Math.random() * alphabetChars.length)];
    return `${cleanPhone}${randomChar}${timestamp}`;
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  const submitPrintJob = async (
    formData: FormData,
    uploadedFiles: Array<{ name: string; url: string; size: number; type: string }>,
    selectedServices: SelectedService[],
    totalAmount: number,
    deliveryRequested: boolean,
    canAccessDelivery: boolean
  ) => {
    if (!formData.name || !formData.phone || !formData.timeSlot || uploadedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload at least one file",
        variant: "destructive"
      });
      return null;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "No Services Selected",
        description: "Please select at least one service",
        variant: "destructive"
      });
      return null;
    }

    setIsSubmitting(true);

    try {
      const newTrackingId = await generateUniqueTrackingId(formData.phone);

      const selectedServicesData = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        quantity: service.quantity,
        price: service.calculatedPrice
      }));

      console.log('Attempting to insert print job with tracking ID:', newTrackingId);

      const { error } = await supabase
        .from('print_jobs')
        .insert({
          tracking_id: newTrackingId,
          name: formData.name,
          phone: formData.phone,
          institute: formData.institute || null,
          time_slot: formData.timeSlot,
          notes: formData.notes || null,
          files: uploadedFiles, // Now using uploaded file URLs instead of Base64
          status: totalAmount > 0 ? 'pending_payment' : 'pending',
          selected_services: selectedServicesData,
          total_amount: totalAmount,
          delivery_requested: deliveryRequested && canAccessDelivery,
          sms_notifications: true,
          email_notifications: true
        });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your print job. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      const copySuccess = await copyToClipboard(newTrackingId);
      
      toast({
        title: "Order Submitted Successfully!",
        description: `Your tracking ID is ${newTrackingId}${copySuccess ? ' (Auto-copied!)' : ''}. You will receive notifications about your order status via SMS. Total: ₹${totalAmount.toFixed(2)}${totalAmount > 0 && selectedServices.some(s => s.quantity >= 50) ? ' (Bulk discount applied!)' : ''}`,
      });

      return newTrackingId;

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your print job. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitPrintJob
  };
};
