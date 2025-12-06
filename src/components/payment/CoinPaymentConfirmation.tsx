import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Coins, AlertTriangle, Loader2 } from 'lucide-react';

interface CoinPaymentConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  description: string;
  coinCost: number;
  currentBalance: number;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
}

export const CoinPaymentConfirmation = ({
  open,
  onOpenChange,
  serviceName,
  description,
  coinCost,
  currentBalance,
  onConfirm,
  onSuccess,
}: CoinPaymentConfirmationProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const balanceAfter = currentBalance - coinCost;
  const hasEnoughBalance = currentBalance >= coinCost;
  const isLowBalance = balanceAfter < 10 && balanceAfter >= 0;

  const handleConfirm = async () => {
    if (!hasEnoughBalance) return;
    
    setIsProcessing(true);
    const result = await onConfirm();
    setIsProcessing(false);
    
    if (result.success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Confirm Payment
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>You are about to purchase:</p>
              
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="font-semibold text-foreground">{serviceName}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cost:</span>
                  <span className="font-semibold text-foreground">{coinCost} coins</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Balance:</span>
                  <span className="font-semibold text-foreground">{currentBalance} coins</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span>Balance After:</span>
                  <span className={`font-semibold ${!hasEnoughBalance ? 'text-destructive' : isLowBalance ? 'text-yellow-600' : 'text-foreground'}`}>
                    {balanceAfter} coins
                  </span>
                </div>
              </div>

              {!hasEnoughBalance && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">Insufficient balance. Please recharge your coins.</p>
                </div>
              )}

              {isLowBalance && hasEnoughBalance && (
                <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">Your balance will be low after this purchase.</p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!hasEnoughBalance || isProcessing}
            className="bg-primary hover:bg-primary/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${coinCost} Coins`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
