import { useState } from 'react';
import { CoinPaymentConfirmation } from './CoinPaymentConfirmation';
import { useCoinBalance } from '@/hooks/useCoinBalance';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PrintCoinPaymentProps {
  totalAmount: number;
  selectedServices: any[];
  onPaymentConfirmed: () => Promise<string | null>;
  onSuccess: (trackingId: string) => void;
  children: (props: { 
    handlePayment: () => void; 
    isProcessing: boolean;
    hasEnoughBalance: boolean;
    coinBalance: number;
  }) => React.ReactNode;
}

export const PrintCoinPayment = ({
  totalAmount,
  selectedServices,
  onPaymentConfirmed,
  onSuccess,
  children
}: PrintCoinPaymentProps) => {
  const { user } = useAuth();
  const { coinBalance, deductCoins, hasEnoughCoins } = useCoinBalance();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate coin cost (1 coin = 1 rupee for simplicity, adjust as needed)
  const coinCost = Math.ceil(totalAmount);

  const handlePayment = () => {
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    if (!hasEnoughCoins(coinCost)) {
      toast.error('Insufficient coin balance');
      return;
    }

    setShowConfirmation(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      // First submit the print job
      const trackingId = await onPaymentConfirmed();
      
      if (!trackingId) {
        return { success: false, error: 'Failed to create order' };
      }

      // Then deduct coins
      const result = await deductCoins(
        coinCost,
        `Print Order - ${selectedServices.length} service(s)`,
        'print_job',
        trackingId
      );

      if (!result.success) {
        return { success: false, error: 'Failed to deduct coins' };
      }

      onSuccess(trackingId);
      return { success: true };
    } catch (error) {
      console.error('Payment error:', error);
      return { success: false, error: 'Payment failed' };
    } finally {
      setIsProcessing(false);
    }
  };

  const serviceNames = selectedServices.map(s => s.name || s.serviceName).join(', ');

  return (
    <>
      {children({
        handlePayment,
        isProcessing,
        hasEnoughBalance: hasEnoughCoins(coinCost),
        coinBalance
      })}

      <CoinPaymentConfirmation
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        serviceName="Ellio Prints"
        description={serviceNames || 'Print services'}
        coinCost={coinCost}
        currentBalance={coinBalance}
        onConfirm={processPayment}
      />
    </>
  );
};