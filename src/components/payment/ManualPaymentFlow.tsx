import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generatePaymentMessage, openWhatsApp } from '@/utils/whatsapp';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';

interface ManualPaymentFlowProps {
  amount: number;
  serviceName: string;
  serviceType: 'resume' | 'print' | 'assignment';
  referenceId: string;
  userName: string;
  userEmail: string;
  trackingId?: string;
  onPaymentVerified?: () => void;
}

export const ManualPaymentFlow = ({
  amount,
  serviceName,
  serviceType,
  referenceId,
  userName,
  userEmail,
  trackingId,
  onPaymentVerified
}: ManualPaymentFlowProps) => {
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const { toast } = useToast();
  const { pendingPayment, isApproved, isPending, isRejected, createPendingPayment } = 
    usePaymentVerification(userEmail, serviceType, referenceId);

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  useEffect(() => {
    if (isApproved && onPaymentVerified) {
      onPaymentVerified();
    }
  }, [isApproved, onPaymentVerified]);

  const loadPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setPaymentSettings(data);
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const handleWhatsAppPayment = async () => {
    if (!paymentSettings) return;

    const message = generatePaymentMessage({
      name: userName,
      amount,
      service: serviceName,
      trackingId,
    });

    // Create pending payment record
    await createPendingPayment(userName, amount, referenceId, trackingId);

    // Open WhatsApp
    openWhatsApp(paymentSettings.whatsapp_number, message);
  };

  if (isLoadingSettings) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!paymentSettings?.enable_manual_payments) {
    return (
      <Alert>
        <AlertDescription>
          Manual payments are currently disabled. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  if (isApproved) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5 mr-2" />
            Payment Verified!
          </CardTitle>
          <CardDescription>Your payment has been approved. You can now access {serviceName}.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payment Pending Verification</span>
            <PaymentStatusBadge status="pending" />
          </CardTitle>
          <CardDescription>
            We've received your payment notification. Our team will verify it shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              <strong>What's next?</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Our team will verify your payment within 1-2 hours</li>
                <li>You'll receive a notification once approved</li>
                <li>Keep this page open or check back later</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Amount to pay: <strong className="text-lg text-foreground">₹{amount}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Instructions */}
        {paymentSettings.payment_instructions && (
          <Alert>
            <AlertDescription>{paymentSettings.payment_instructions}</AlertDescription>
          </Alert>
        )}

        {/* UPI ID */}
        <div className="space-y-2">
          <Label>UPI ID</Label>
          <div className="flex gap-2">
            <Input value={paymentSettings.upi_id} readOnly className="font-mono" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(paymentSettings.upi_id, 'UPI ID')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* QR Code */}
        {paymentSettings.qr_code_url && (
          <div className="space-y-2">
            <Label>Or Scan QR Code</Label>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img
                src={paymentSettings.qr_code_url}
                alt="Payment QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
        )}

        {/* WhatsApp Confirmation */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">After Making Payment:</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to confirm your payment via WhatsApp. This will help us verify your payment quickly.
            </p>
            <Button
              onClick={handleWhatsAppPayment}
              className="w-full"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              I've Paid on WhatsApp
            </Button>
          </div>
        </div>

        {/* Rejection Info */}
        {isRejected && pendingPayment?.rejection_reason && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Payment Rejected:</strong> {pendingPayment.rejection_reason}
              <br />
              Please contact support for assistance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
