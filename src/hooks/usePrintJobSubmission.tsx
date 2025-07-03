
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
    // Start with the clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Generate a random alphabet character (A-Z)
    const alphabetChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Try different alphabet combinations until we find a unique one
    for (let i = 0; i < 26; i++) {
      const randomChar = alphabetChars[Math.floor(Math.random() * alphabetChars.length)];
      const trackingId = `${cleanPhone}${randomChar}`;
      
      // Check if this tracking ID already exists
      const { data: existingJob } = await supabase
        .from('print_jobs')
        .select('tracking_id')
        .eq('tracking_id', trackingId)
        .maybeSingle();
      
      // If no conflict, use this tracking ID
      if (!existingJob) {
        return trackingId;
      }
    }
    
    // If all single letters are taken, add a number
    const timestamp = Date.now().toString().slice(-2);
    const randomChar = alphabetChars[Math.floor(Math.random() * alphabetChars.length)];
    return `${cleanPhone}${randomChar}${timestamp}`;
  };

  const convertFilesToBase64 = async (files: File[]): Promise<Array<{ name: string; size: number; type: string; data: string }>> => {
    const filePromises = files.map(file => {
      return new Promise<{ name: string; size: number; type: string; data: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    });
    
    return Promise.all(filePromises);
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
    files: File[],
    selectedServices: SelectedService[],
    totalAmount: number,
    deliveryRequested: boolean,
    canAccessDelivery: boolean
  ) => {
    if (!formData.name || !formData.phone || !formData.timeSlot || files.length === 0) {
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
      const filesWithData = await convertFilesToBase64(files);

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
          files: filesWithData,
          status: totalAmount > 0 ? 'pending_payment' : 'pending',
          selected_services: selectedServicesData,
          total_amount: totalAmount,
          delivery_requested: deliveryRequested && canAccessDelivery,
          sms_notifications: true, // Default to enabled
          email_notifications: true // Default to enabled
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

      // Auto-copy tracking ID to clipboard
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
