import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingPayment {
  id: string;
  user_email: string;
  user_name: string;
  service_type: string;
  reference_id: string;
  amount: number;
  tracking_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  verified_by: string | null;
  payment_proof_url: string | null;
  whatsapp_message_sent: boolean;
  created_at: string;
  verified_at: string | null;
}

export const usePaymentVerification = (userEmail: string, serviceType: string, referenceId?: string) => {
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userEmail || !serviceType) {
      setIsLoading(false);
      return;
    }

    checkPaymentStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('payment-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pending_payments',
          filter: `user_email=eq.${userEmail}`
        },
        (payload) => {
          const updated = payload.new as any;
          setPendingPayment(updated);

          if (updated.status === 'approved') {
            toast({
              title: 'Payment Verified! ✅',
              description: 'Your payment has been approved. You can now access the service.',
            });
          } else if (updated.status === 'rejected') {
            toast({
              title: 'Payment Rejected',
              description: updated.rejection_reason || 'Please contact support for assistance.',
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userEmail, serviceType, referenceId]);

  const checkPaymentStatus = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('pending_payments')
        .select('*')
        .eq('user_email', userEmail)
        .eq('service_type', serviceType)
        .order('created_at', { ascending: false })
        .limit(1);

      if (referenceId) {
        query = query.eq('reference_id', referenceId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      setPendingPayment(data as any);
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPendingPayment = async (
    userName: string,
    amount: number,
    refId: string,
    trackingId?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('pending_payments')
        .insert({
          user_email: userEmail,
          user_name: userName,
          service_type: serviceType,
          reference_id: refId,
          amount,
          tracking_id: trackingId,
          status: 'pending',
          whatsapp_message_sent: true
        })
        .select()
        .single();

      if (error) throw error;

      setPendingPayment(data as any);
      
      // Log activity
      await supabase.from('activity_log').insert({
        activity_type: 'payment_pending',
        description: `Payment pending for ${serviceType}`,
        user_email: userEmail,
        metadata: { amount, reference_id: refId }
      });

      return data;
    } catch (error) {
      console.error('Error creating pending payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create payment request. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    pendingPayment,
    isLoading,
    checkPaymentStatus,
    createPendingPayment,
    isApproved: pendingPayment?.status === 'approved',
    isPending: pendingPayment?.status === 'pending',
    isRejected: pendingPayment?.status === 'rejected',
  };
};
