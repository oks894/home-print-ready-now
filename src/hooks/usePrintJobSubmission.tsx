
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
    let baseTrackingId = phone.replace(/\D/g, '');
    
    // Check if this tracking ID already exists
    const { data: existingJob } = await supabase
      .from('print_jobs')
      .select('tracking_id')
      .eq('tracking_id', baseTrackingId)
      .maybeSingle();
    
    // If no conflict, use the original phone number
    if (!existingJob) {
      return baseTrackingId;
    }
    
    // If there's a conflict, add a timestamp suffix to make it unique
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const uniqueTrackingId = `${baseTrackingId}${timestamp}`;
    
    return uniqueTrackingId;
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
          delivery_requested: deliveryRequested && canAccessDelivery
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

      toast({
        title: "Order Submitted!",
        description: `Your tracking ID is ${newTrackingId}. Total: ₹${totalAmount.toFixed(2)}${totalAmount > 0 && selectedServices.some(s => s.quantity >= 50) ? ' (Bulk discount applied!)' : ''}`,
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
